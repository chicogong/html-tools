const fs = require('fs');
const path = require('path');

// 增强优化规则 - 针对80-89分的工具
const ENHANCED_OPTIMIZATIONS = {
  // 为body添加font-size（如果只有line-height没有font-size）
  addBodyFontSize: {
    pattern: /(body\s*\{[^}]*line-height:[^}]*?)(min-height:|background:|color:)/,
    replacement: (match, before, after) => {
      if (before.includes('font-size:')) return match;
      return `${before}font-size: 16px;\n        ${after}`;
    },
    description: '为body添加font-size: 16px'
  },

  // 移除重复的:root定义
  removeDoubleRoot: {
    pattern: /(:root\s*\{[^}]+\})\s*\n\s*\n\s*(:root\s*\{)/g,
    replacement: '$1\n\n      /* 合并后的root变量 */\n      $2',
    description: '标记重复的:root定义'
  }
};

// 主优化函数
function enhancedOptimize(reportPath) {
  console.log('\n🔧 增强优化 - 针对80-89分工具\n');
  
  const results = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const optimized = JSON.parse(fs.readFileSync(path.join(__dirname, 'optimization-log.json'), 'utf8'));
  
  const optimizedPaths = new Set(optimized.map(o => o.path));
  const needsOptimization = results.filter(r => 
    r.score >= 80 && r.score < 90 && !optimizedPaths.has(r.path)
  );

  console.log(`找到 ${needsOptimization.length} 个需要增强优化的工具\n`);

  let count = 0;
  const newOptimizations = [];

  for (const tool of needsOptimization.slice(0, 20)) { // 先优化20个测试
    const filePath = path.join(__dirname, '../../', tool.path);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  文件不存在: ${tool.path}`);
      continue;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const applied = [];

    // 应用font-size优化
    const originalContent = content;
    if (typeof ENHANCED_OPTIMIZATIONS.addBodyFontSize.replacement === 'function') {
      content = content.replace(
        ENHANCED_OPTIMIZATIONS.addBodyFontSize.pattern,
        ENHANCED_OPTIMIZATIONS.addBodyFontSize.replacement
      );
    }

    if (content !== originalContent) {
      modified = true;
      applied.push(ENHANCED_OPTIMIZATIONS.addBodyFontSize.description);
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ ${tool.name} (${tool.score}分)`);
      applied.forEach(desc => console.log(`   - ${desc}`));
      count++;

      newOptimizations.push({
        tool: tool.name,
        path: tool.path,
        score: tool.score,
        optimizations: applied
      });
    }
  }

  // 更新优化日志
  const allOptimizations = [...optimized, ...newOptimizations];
  fs.writeFileSync(
    path.join(__dirname, 'optimization-log.json'),
    JSON.stringify(allOptimizations, null, 2)
  );

  console.log(`\n✅ 增强优化完成: ${count} 个工具\n`);
  return count;
}

// 运行
if (require.main === module) {
  const reportPath = process.argv[2] || path.join(__dirname, 'merged-report.json');
  enhancedOptimize(reportPath);
}

module.exports = { enhancedOptimize };
