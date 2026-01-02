/**
 * 批量优化工具脚本
 * 自动修复UI质量问题
 */
const fs = require('fs');
const path = require('path');

// 优化配置
const OPTIMIZATIONS = {
  // 添加字体大小和行高
  addFontSizeAndLineHeight: {
    pattern: /(body\s*\{[^}]*?)(background:|color:|min-height:)/,
    replacement: '$1font-size: 16px;\n        line-height: 1.6;\n        $2',
    description: '添加字体大小16px和行高1.6'
  },

  // 添加visually-hidden样式
  addVisuallyHiddenStyle: {
    pattern: /(\s+)(<\/style>)/,
    replacement: `$1.visually-hidden {
$1  position: absolute;
$1  width: 1px;
$1  height: 1px;
$1  margin: -1px;
$1  padding: 0;
$1  overflow: hidden;
$1  clip: rect(0, 0, 0, 0);
$1  white-space: nowrap;
$1  border: 0;
$1}
$1$2`,
    description: '添加visually-hidden无障碍样式'
  },

  // 为输入框添加placeholder和label
  addInputLabels: {
    pattern: /<input\s+([^>]*?)type="(number|text|email|tel|url)"([^>]*?)(?:id="([^"]+)")?([^>]*?)(\/?>)/g,
    replacement: (match, before, type, middle, id, after, closing) => {
      // 如果已有placeholder，跳过
      if (match.includes('placeholder=')) return match;

      const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
      const labelText = type === 'number' ? '输入数值' : '输入内容';

      // 如果有id但没有label
      if (id && !match.includes('label')) {
        return `<label for="${inputId}" class="visually-hidden">${labelText}</label>\n          <input ${before}type="${type}"${middle}id="${inputId}"${after} placeholder="${labelText}"${closing}`;
      }

      return match;
    },
    description: '为输入框添加label和placeholder'
  },

  // 添加按钮ARIA标签
  addButtonAria: {
    pattern: /<button([^>]*?)(?!aria-label)(?!title)>([^<]{1,30})<\/button>/g,
    replacement: (match, attrs, text) => {
      // 如果已有aria-label或title，跳过
      if (attrs.includes('aria-label') || attrs.includes('title')) return match;

      const cleanText = text.trim();
      if (cleanText && !attrs.includes('aria-label')) {
        return `<button${attrs} aria-label="${cleanText}">${text}</button>`;
      }
      return match;
    },
    description: '为按钮添加ARIA标签'
  },

  // 确保最小触摸目标
  ensureMinTouchTargets: {
    pattern: /(\.btn\s*\{[^}]*?padding:\s*)(\d+)px\s+(\d+)px/g,
    replacement: (match, prefix, top, right) => {
      const topNum = parseInt(top);
      const rightNum = parseInt(right);

      // 确保至少12px padding以达到44px最小触摸目标
      const newTop = Math.max(topNum, 12);
      const newRight = Math.max(rightNum, 20);

      return `${prefix}${newTop}px ${newRight}px`;
    },
    description: '确保按钮有足够的触摸目标尺寸'
  }
};

// 分析工具需要的优化
function analyzeNeededOptimizations(toolData) {
  const needed = [];

  if (!toolData.details) return needed;

  // 字体排版问题
  if (toolData.details.typography && toolData.details.typography < 10) {
    needed.push('addFontSizeAndLineHeight');
  }

  // 表单可用性问题
  if (toolData.details.formUsability && toolData.details.formUsability < 15) {
    needed.push('addVisuallyHiddenStyle');
    needed.push('addInputLabels');
  }

  // 交互性问题
  if (toolData.details.interactivity && toolData.details.interactivity < 15) {
    needed.push('addButtonAria');
  }

  return needed;
}

// 应用优化
function applyOptimizations(filePath, optimizationKeys) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const applied = [];

  for (const key of optimizationKeys) {
    const opt = OPTIMIZATIONS[key];
    if (!opt) continue;

    const originalContent = content;

    if (typeof opt.replacement === 'function') {
      content = content.replace(opt.pattern, opt.replacement);
    } else {
      // 检查是否已经应用过
      if (key === 'addFontSizeAndLineHeight' && content.includes('font-size: 16px')) {
        continue;
      }
      if (key === 'addVisuallyHiddenStyle' && content.includes('.visually-hidden')) {
        continue;
      }

      content = content.replace(opt.pattern, opt.replacement);
    }

    if (content !== originalContent) {
      modified = true;
      applied.push(opt.description);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
  }

  return { modified, applied };
}

// 主优化函数
function optimizeTools(reportPath, scoreThreshold = 90) {
  console.log(`\n🔧 批量优化工具\n`);
  console.log(`📊 读取测试报告: ${reportPath}`);

  const results = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const toolsNeedingOptimization = results.filter(r => r.score < scoreThreshold && r.score > 0);

  console.log(`\n找到 ${toolsNeedingOptimization.length} 个需要优化的工具（分数 < ${scoreThreshold}）\n`);

  let optimized = 0;
  let skipped = 0;
  const optimizationLog = [];

  for (const tool of toolsNeedingOptimization) {
    const filePath = path.join(__dirname, '../../', tool.path);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  文件不存在: ${tool.path}`);
      skipped++;
      continue;
    }

    const needed = analyzeNeededOptimizations(tool);

    if (needed.length === 0) {
      console.log(`✓ ${tool.name} - 无需优化`);
      skipped++;
      continue;
    }

    console.log(`\n🔨 优化: ${tool.name} (${tool.score}分)`);
    console.log(`   文件: ${tool.path}`);
    console.log(`   需要: ${needed.join(', ')}`);

    const result = applyOptimizations(filePath, needed);

    if (result.modified) {
      console.log(`   ✅ 已应用:`);
      result.applied.forEach(desc => console.log(`      - ${desc}`));
      optimized++;

      optimizationLog.push({
        tool: tool.name,
        path: tool.path,
        score: tool.score,
        optimizations: result.applied
      });
    } else {
      console.log(`   ⏭️  已是最新`);
      skipped++;
    }
  }

  // 保存优化日志
  const logPath = path.join(__dirname, 'optimization-log.json');
  fs.writeFileSync(logPath, JSON.stringify(optimizationLog, null, 2));

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 优化完成`);
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ 已优化: ${optimized} 个工具`);
  console.log(`⏭️  已跳过: ${skipped} 个工具`);
  console.log(`📄 日志已保存: ${logPath}`);
  console.log();

  return { optimized, skipped, log: optimizationLog };
}

// 合并批次报告
function mergeBatchReports(batchFiles) {
  console.log(`\n📦 合并批次报告...\n`);

  const allResults = [];

  for (const file of batchFiles) {
    if (!fs.existsSync(file)) {
      console.log(`⚠️  文件不存在: ${file}`);
      continue;
    }

    const batch = JSON.parse(fs.readFileSync(file, 'utf8'));
    allResults.push(...batch);
    console.log(`✓ 已加载: ${file} (${batch.length} 个工具)`);
  }

  const mergedPath = path.join(__dirname, 'merged-report.json');
  fs.writeFileSync(mergedPath, JSON.stringify(allResults, null, 2));

  console.log(`\n✅ 合并完成: ${mergedPath}`);
  console.log(`📊 总计: ${allResults.length} 个工具\n`);

  // 统计
  const stats = {
    total: allResults.length,
    excellent: allResults.filter(r => r.score >= 90).length,
    good: allResults.filter(r => r.score >= 75 && r.score < 90).length,
    needsWork: allResults.filter(r => r.score >= 60 && r.score < 75).length,
    poor: allResults.filter(r => r.score < 60 && r.score > 0).length,
    errors: allResults.filter(r => r.error).length,
    avg: Math.round(allResults.filter(r => r.score > 0).reduce((sum, r) => sum + r.score, 0) / allResults.filter(r => r.score > 0).length)
  };

  console.log(`📊 统计:`);
  console.log(`   优秀 (90-100): ${stats.excellent}`);
  console.log(`   良好 (75-89): ${stats.good}`);
  console.log(`   需改进 (60-74): ${stats.needsWork}`);
  console.log(`   较差 (<60): ${stats.poor}`);
  console.log(`   错误: ${stats.errors}`);
  console.log(`   平均分: ${stats.avg}`);

  return mergedPath;
}

// CLI入口
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'merge') {
    const batchFiles = args.slice(1);
    if (batchFiles.length === 0) {
      console.error('使用: node batch-optimize.cjs merge <文件1> <文件2> ...');
      process.exit(1);
    }
    mergeBatchReports(batchFiles);
  } else if (command === 'optimize') {
    const reportPath = args[1] || path.join(__dirname, 'merged-report.json');
    const threshold = parseInt(args[2]) || 90;
    optimizeTools(reportPath, threshold);
  } else {
    console.log('使用方法:');
    console.log('  合并报告: node batch-optimize.cjs merge batch-*.json');
    console.log('  批量优化: node batch-optimize.cjs optimize [报告路径] [分数阈值]');
  }
}

module.exports = { optimizeTools, mergeBatchReports, analyzeNeededOptimizations, applyOptimizations };
