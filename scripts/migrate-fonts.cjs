#!/usr/bin/env node

/**
 * 字体系统统一脚本
 *
 * 功能：
 * 1. 添加 Google Fonts CDN 链接
 * 2. 统一字体声明为 CSS 变量
 * 3. 确保 CSS 变量定义存在
 */

const fs = require('fs');
const glob = require('glob');

// 配置
const CONFIG = {
  dryRun: process.argv.includes('--dry-run'),
  verbose: process.argv.includes('--verbose'),
  maxFiles: process.argv.includes('--test') ? 10 : Infinity,
  targetPattern: process.argv.find(arg => arg.startsWith('--pattern='))?.split('=')[1] || 'tools/**/*.html'
};

// Google Fonts 链接模板
const GOOGLE_FONTS_LINK = `  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
`;

// CSS 变量定义模板
const FONT_VARIABLES = `  /* 字体变量 */
  --font-sans: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
`;

// 统计
const stats = {
  totalFiles: 0,
  processedFiles: 0,
  skippedFiles: 0,
  googleFontsAdded: 0,
  variablesAdded: 0,
  fontReplacements: 0
};

/**
 * 添加 Google Fonts 链接
 */
function addGoogleFonts(content) {
  if (content.includes('fonts.googleapis.com')) {
    return content;
  }

  // 在 </head> 之前插入
  const modified = content.replace('</head>', `${GOOGLE_FONTS_LINK}\n</head>`);
  stats.googleFontsAdded++;

  return modified;
}

/**
 * 添加字体 CSS 变量定义
 */
function addFontVariables(content) {
  // 检查是否已存在
  if (content.includes('--font-sans') && content.includes('--font-mono')) {
    return content;
  }

  // 查找 :root { 块
  const rootPattern = /(:root\s*\{[^}]*)/;
  const match = content.match(rootPattern);

  if (match) {
    // 在 :root 块中添加变量
    const modified = content.replace(
      rootPattern,
      `$1\n${FONT_VARIABLES}`
    );
    stats.variablesAdded++;
    return modified;
  } else {
    // 创建新的 :root 块
    const stylePattern = /(<style[^>]*>)/;
    const modified = content.replace(
      stylePattern,
      `$1\n:root {\n${FONT_VARIABLES}\n}`
    );
    stats.variablesAdded++;
    return modified;
  }
}

/**
 * 替换字体声明
 */
function replaceFontDeclarations(content) {
  let modified = content;
  let replacements = 0;

  // 1. 替换系统字体为 var(--font-sans)
  const systemFontPatterns = [
    /font-family\s*:\s*-apple-system,\s*BlinkMacSystemFont[^;]+;/g,
    /font-family\s*:\s*(['"])Segoe UI\1[^;]+;/g,
    /font-family\s*:\s*(['"])Roboto\1[^;]+;/g
  ];

  for (const pattern of systemFontPatterns) {
    if (pattern.test(modified)) {
      modified = modified.replace(pattern, 'font-family: var(--font-sans);');
      replacements++;
    }
  }

  // 2. 替换 monospace 为 var(--font-mono)
  const monoPatterns = [
    /font-family\s*:\s*(['"]?)monospace\1\s*;/g,
    /font-family\s*:\s*(['"])Courier New\1[^;]+;/g,
    /font-family\s*:\s*(['"])JetBrains Mono\1\s*,\s*monospace\s*;/g,
    /font-family\s*:\s*(['"])JetBrains Mono\1[^;]+;/g
  ];

  for (const pattern of monoPatterns) {
    if (pattern.test(modified)) {
      modified = modified.replace(pattern, 'font-family: var(--font-mono);');
      replacements++;
    }
  }

  // 3. 替换 Space Grotesk 为 var(--font-sans)
  const spaceGroteskPattern = /font-family\s*:\s*(['"])Space Grotesk\1[^;]+;/g;
  if (spaceGroteskPattern.test(modified)) {
    modified = modified.replace(spaceGroteskPattern, 'font-family: var(--font-sans);');
    replacements++;
  }

  if (replacements > 0) {
    stats.fontReplacements += replacements;
  }

  return modified;
}

/**
 * 处理单个文件
 */
function processFile(filePath) {
  try {
    const original = fs.readFileSync(filePath, 'utf8');
    let content = original;

    // 1. 添加 Google Fonts
    content = addGoogleFonts(content);

    // 2. 添加 CSS 变量
    content = addFontVariables(content);

    // 3. 替换字体声明
    content = replaceFontDeclarations(content);

    // 保存文件（如果有变更）
    if (content !== original) {
      if (!CONFIG.dryRun) {
        fs.writeFileSync(filePath, content, 'utf8');
      }
      stats.processedFiles++;
      if (CONFIG.verbose) {
        console.log(`  ✅ ${filePath}`);
      }
    } else {
      stats.skippedFiles++;
      if (CONFIG.verbose) {
        console.log(`  ⏭️  ${filePath} (无需修改)`);
      }
    }
  } catch (error) {
    console.error(`  ❌ 错误: ${filePath} - ${error.message}`);
  }
}

/**
 * 生成报告
 */
function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log('🔤 字体系统迁移报告');
  console.log('='.repeat(60));
  console.log(`\n📊 统计:`);
  console.log(`  总文件:         ${stats.totalFiles}`);
  console.log(`  已处理:         ${stats.processedFiles} ✅`);
  console.log(`  跳过:           ${stats.skippedFiles} ⏭️`);
  console.log(`\n🔧 变更:`);
  console.log(`  Google Fonts:   ${stats.googleFontsAdded} 个文件添加`);
  console.log(`  CSS 变量:       ${stats.variablesAdded} 个文件添加`);
  console.log(`  字体替换:       ${stats.fontReplacements} 处`);
  console.log(`\n${CONFIG.dryRun ? '⚠️  试运行模式 - 文件未实际修改' : '✅ 迁移完成'}`);
  console.log('='.repeat(60) + '\n');
}

/**
 * 主函数
 */
function main() {
  console.log('\n🔤 字体系统统一工具\n');
  console.log(`模式: ${CONFIG.dryRun ? '试运行' : '正式迁移'}`);
  console.log(`匹配: ${CONFIG.targetPattern}\n`);

  const files = glob.sync(CONFIG.targetPattern).slice(0, CONFIG.maxFiles);
  stats.totalFiles = files.length;

  console.log(`找到 ${files.length} 个文件\n`);

  files.forEach(processFile);

  generateReport();
}

if (require.main === module) {
  main();
}

module.exports = { processFile };
