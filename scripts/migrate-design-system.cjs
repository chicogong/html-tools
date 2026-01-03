#!/usr/bin/env node

/**
 * 设计系统迁移脚本
 *
 * 功能：
 * 1. 统一 CSS 变量命名（旧系统 → 新标准）
 * 2. 添加 Google Fonts 链接
 * 3. 替换硬编码颜色值为 CSS 变量
 * 4. 统一字体系统
 * 5. 生成迁移报告
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 配置
const CONFIG = {
  dryRun: process.argv.includes('--dry-run'),
  verbose: process.argv.includes('--verbose'),
  maxFiles: process.argv.includes('--test') ? 10 : Infinity,
  targetPattern: process.argv.find(arg => arg.startsWith('--pattern='))?.split('=')[1] || 'tools/**/*.html'
};

// 颜色映射表：旧值 → CSS 变量
const COLOR_MAPPINGS = {
  // 背景色
  '#0a0a0f': 'var(--color-bg-deep)',
  '#12121a': 'var(--color-bg-surface)',
  '#1a1a24': 'var(--color-bg-card)',
  '#22222e': 'var(--color-bg-elevated)',
  '#121218': 'var(--color-bg-surface)',  // Glassmorphism 风格
  '#1a1a22': 'var(--color-bg-card)',

  // 文本色
  '#e8e8ed': 'var(--color-text-primary)',
  '#a8a8b3': 'var(--color-text-secondary)',
  '#707080': 'var(--color-text-muted)',

  // 强调色
  '#00f5d4': 'var(--color-accent-cyan)',
  '#a78bfa': 'var(--color-accent-purple)',
  '#f472b6': 'var(--color-accent-pink)',

  // 边框色
  '#2a2a38': 'var(--color-border-subtle)',
  '#3a3a48': 'var(--color-border-default)',
  '#4a4a58': 'var(--color-border-strong)',

  // 浅色主题
  '#fafafa': 'var(--color-bg-deep)',  // 在 [data-theme="light"] 中
  '#ffffff': 'var(--color-bg-surface)',
  '#f5f5f5': 'var(--color-bg-card)',
  '#1a1a1a': 'var(--color-text-primary)',
  '#4a4a4a': 'var(--color-text-secondary)',
};

// CSS 变量重命名映射（旧系统 → 新标准）
const VARIABLE_RENAMES = {
  // 旧的赛博朋克风格 → 新标准
  '--bg-deep': '--color-bg-deep',
  '--bg-surface': '--color-bg-surface',
  '--bg-card': '--color-bg-card',
  '--text-primary': '--color-text-primary',
  '--text-secondary': '--color-text-secondary',
  '--text-muted': '--color-text-muted',
  '--accent-cyan': '--color-accent-cyan',
  '--accent-purple': '--color-accent-purple',

  // Glassmorphism 风格 → 新标准（已经使用 --color 前缀，只需确认）
  '--color-bg-base': '--color-bg-deep',
  '--color-bg-elevated': '--color-bg-surface',

  // 字体
  '--font-family-sans': '--font-sans',
  '--font-family-mono': '--font-mono',
};

// Google Fonts 模板
const GOOGLE_FONTS_TEMPLATE = `  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
`;

// 统计数据
const stats = {
  totalFiles: 0,
  processedFiles: 0,
  skippedFiles: 0,
  errors: 0,
  changes: {
    googleFontsAdded: 0,
    variablesRenamed: 0,
    colorsReplaced: 0,
    fontsUpdated: 0
  }
};

/**
 * 检测文件是否需要迁移
 */
function needsMigration(content) {
  // 检查是否使用旧的 CSS 变量
  for (const oldVar of Object.keys(VARIABLE_RENAMES)) {
    if (content.includes(oldVar)) {
      return true;
    }
  }

  // 检查是否有硬编码颜色
  for (const color of Object.keys(COLOR_MAPPINGS)) {
    if (content.includes(color)) {
      return true;
    }
  }

  // 检查是否缺少 Google Fonts
  if (!content.includes('fonts.googleapis.com')) {
    return true;
  }

  // 检查是否使用系统字体
  if (content.includes('-apple-system, BlinkMacSystemFont')) {
    return true;
  }

  return false;
}

/**
 * 添加 Google Fonts 链接
 */
function addGoogleFonts(content) {
  // 如果已存在，跳过
  if (content.includes('fonts.googleapis.com')) {
    return content;
  }

  // 在 </head> 前添加
  content = content.replace('</head>', `${GOOGLE_FONTS_TEMPLATE}</head>`);
  stats.changes.googleFontsAdded++;

  return content;
}

/**
 * 重命名 CSS 变量
 */
function renameVariables(content) {
  let modified = content;
  let changeCount = 0;

  for (const [oldVar, newVar] of Object.entries(VARIABLE_RENAMES)) {
    // 替换变量定义
    const definePattern = new RegExp(`${escapeRegex(oldVar)}\\s*:`, 'g');
    if (definePattern.test(modified)) {
      modified = modified.replace(definePattern, `${newVar}:`);
      changeCount++;
    }

    // 替换变量使用
    const usePattern = new RegExp(`var\\(${escapeRegex(oldVar)}\\)`, 'g');
    if (usePattern.test(modified)) {
      modified = modified.replace(usePattern, `var(${newVar})`);
      changeCount++;
    }
  }

  if (changeCount > 0) {
    stats.changes.variablesRenamed += changeCount;
  }

  return modified;
}

/**
 * 替换硬编码颜色为 CSS 变量
 */
function replaceHardcodedColors(content) {
  let modified = content;
  let changeCount = 0;

  // 只替换 CSS 样式中的颜色（不替换字符串中的颜色）
  const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/);
  if (!styleMatch) return content;

  let styles = styleMatch[1];
  const originalStyles = styles;

  for (const [color, variable] of Object.entries(COLOR_MAPPINGS)) {
    // 匹配 background: #xxx; color: #xxx; border-color: #xxx 等
    const patterns = [
      new RegExp(`(background(?:-color)?\\s*:\\s*)${color}`, 'gi'),
      new RegExp(`(color\\s*:\\s*)${color}`, 'gi'),
      new RegExp(`(border(?:-color)?\\s*:\\s*)${color}`, 'gi'),
      new RegExp(`(box-shadow\\s*:[^;]*?)${color}`, 'gi')
    ];

    for (const pattern of patterns) {
      if (pattern.test(styles)) {
        styles = styles.replace(pattern, `$1${variable}`);
        changeCount++;
      }
    }
  }

  if (changeCount > 0) {
    modified = content.replace(originalStyles, styles);
    stats.changes.colorsReplaced += changeCount;
  }

  return modified;
}

/**
 * 统一字体系统
 */
function updateFonts(content) {
  let modified = content;

  // 替换系统字体为 var(--font-sans)
  const systemFontPattern = /font-family\s*:\s*-apple-system,\s*BlinkMacSystemFont[^;]+;/g;
  if (systemFontPattern.test(modified)) {
    modified = modified.replace(systemFontPattern, 'font-family: var(--font-sans);');
    stats.changes.fontsUpdated++;
  }

  // 替换通用 monospace 为 var(--font-mono)
  const monoPattern = /font-family\s*:\s*(['"]?)monospace\1\s*;/g;
  if (monoPattern.test(modified)) {
    modified = modified.replace(monoPattern, 'font-family: var(--font-mono);');
    stats.changes.fontsUpdated++;
  }

  // 替换 "JetBrains Mono", monospace 为 var(--font-mono)
  const jetbrainsPattern = /font-family\s*:\s*(['"])JetBrains Mono\1\s*,\s*monospace\s*;/g;
  if (jetbrainsPattern.test(modified)) {
    modified = modified.replace(jetbrainsPattern, 'font-family: var(--font-mono);');
    stats.changes.fontsUpdated++;
  }

  return modified;
}

/**
 * 处理单个文件
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // 检查是否需要迁移
    if (!needsMigration(content)) {
      stats.skippedFiles++;
      if (CONFIG.verbose) {
        console.log(`  ⏭️  跳过: ${filePath}（已是最新标准）`);
      }
      return;
    }

    // 执行迁移
    let modified = content;
    modified = addGoogleFonts(modified);
    modified = renameVariables(modified);
    modified = replaceHardcodedColors(modified);
    modified = updateFonts(modified);

    // 如果有变更，保存文件
    if (modified !== content) {
      if (!CONFIG.dryRun) {
        fs.writeFileSync(filePath, modified, 'utf8');
      }
      stats.processedFiles++;
      console.log(`  ✅ 已迁移: ${filePath}`);
    } else {
      stats.skippedFiles++;
    }
  } catch (error) {
    stats.errors++;
    console.error(`  ❌ 错误: ${filePath}`);
    console.error(`     ${error.message}`);
  }
}

/**
 * 辅助函数：转义正则表达式特殊字符
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 生成迁移报告
 */
function generateReport() {
  const report = `
=======================================================
🎨 设计系统迁移报告
=======================================================

📊 统计数据:
  总文件数:     ${stats.totalFiles}
  已处理:       ${stats.processedFiles} ✅
  跳过:         ${stats.skippedFiles} ⏭️
  错误:         ${stats.errors} ❌

🔧 变更明细:
  添加 Google Fonts:     ${stats.changes.googleFontsAdded} 次
  重命名 CSS 变量:       ${stats.changes.variablesRenamed} 次
  替换硬编码颜色:        ${stats.changes.colorsReplaced} 次
  更新字体系统:          ${stats.changes.fontsUpdated} 次

${CONFIG.dryRun ? '⚠️  试运行模式 - 未实际修改文件' : ''}

=======================================================
`;

  console.log(report);

  // 保存报告到文件
  if (!CONFIG.dryRun) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = `migration-report-${timestamp}.txt`;
    fs.writeFileSync(reportPath, report);
    console.log(`📄 完整报告已保存: ${reportPath}\n`);
  }
}

/**
 * 主函数
 */
function main() {
  console.log('\n🎨 设计系统迁移工具\n');
  console.log(`模式: ${CONFIG.dryRun ? '试运行 (不修改文件)' : '正式迁移'}`);
  console.log(`匹配模式: ${CONFIG.targetPattern}\n`);

  // 查找所有文件
  const files = glob.sync(CONFIG.targetPattern)
    .slice(0, CONFIG.maxFiles);

  stats.totalFiles = files.length;

  console.log(`找到 ${files.length} 个文件\n`);

  // 处理文件
  files.forEach(processFile);

  // 生成报告
  generateReport();

  // 退出码
  process.exit(stats.errors > 0 ? 1 : 0);
}

// 执行
if (require.main === module) {
  main();
}

module.exports = { processFile, needsMigration };
