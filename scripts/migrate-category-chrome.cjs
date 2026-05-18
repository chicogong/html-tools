#!/usr/bin/env node
/**
 * migrate-category-chrome.cjs — 把工具页接入共享基座
 *
 * 对目标范围下每个工具 HTML（纯增量、零破坏）：
 *   1. 在首个 <style> 前插入 <link> 引用 assets/css/tool-base.css
 *   2. 在 </head> 前插入 <script> 引用 assets/js/tool-chrome.js
 * 引用路径按文件所在深度自动计算（支持嵌套子目录如 tools/ai-coding/wiki/）。
 *
 * 旧版页内导航 / 主题按钮由 tool-base.css 隐藏，旧内联 JS 原样保留，
 * 因此本迁移不触碰工具自身逻辑，可安全重复执行（幂等）。
 *
 * 用法：
 *   node scripts/migrate-category-chrome.cjs <分类名>   迁移单个分类
 *   node scripts/migrate-category-chrome.cjs --all      迁移 tools/ 下全部
 *   追加 --dry-run 可只预演不写入
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TOOLS = path.join(ROOT, 'tools');
const arg = process.argv[2] || 'calculator';
const DRY_RUN = process.argv.includes('--dry-run');
const MARKER = 'assets/css/tool-base.css';

if (arg !== '--all' && !fs.existsSync(path.join(TOOLS, arg))) {
  console.error(`分类目录不存在: tools/${arg}`);
  process.exit(1);
}

const scanDir = arg === '--all' ? TOOLS : path.join(TOOLS, arg);

/** 递归收集目录下全部 .html */
function collect(dir) {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out = out.concat(collect(fp));
    } else if (entry.name.endsWith('.html')) {
      out.push(fp);
    }
  }
  return out;
}

/** 按文件所在目录深度计算到仓库根的相对前缀 */
function prefixFor(fp) {
  const rel = path.relative(ROOT, path.dirname(fp));
  return '../'.repeat(rel.split(path.sep).length);
}

const files = collect(scanDir);

let migrated = 0;
let skipped = 0;
const failed = [];

for (const fp of files) {
  let content = fs.readFileSync(fp, 'utf8');

  if (content.includes(MARKER)) {
    skipped++;
    continue;
  }

  const styleMatch = content.match(/(\r?\n)([ \t]*)<style>/);
  const headMatch = content.match(/(\r?\n)([ \t]*)<\/head>/i);
  if (!styleMatch || !headMatch) {
    failed.push(path.relative(TOOLS, fp));
    continue;
  }

  const prefix = prefixFor(fp);
  const link = `<link rel="stylesheet" href="${prefix}assets/css/tool-base.css" />`;
  const script = `<script src="${prefix}assets/js/tool-chrome.js"></script>`;

  // 在首个 <style> 前插入共享 CSS
  content = content.replace(/(\r?\n)([ \t]*)<style>/, `$1$2${link}$1$2<style>`);
  // 在 </head> 前插入外壳脚本
  content = content.replace(/(\r?\n)([ \t]*)<\/head>/i, `$1$2${script}$1$2</head>`);

  if (!DRY_RUN) {
    fs.writeFileSync(fp, content);
  }
  migrated++;
}

console.log(`范围:             ${arg === '--all' ? 'tools/（全部）' : 'tools/' + arg}`);
console.log(`HTML 文件总数:    ${files.length}`);
console.log(`已迁移:           ${migrated}`);
console.log(`跳过（已接入）:   ${skipped}`);
if (failed.length) {
  console.log(`失败（结构异常）: ${failed.length} -> ${failed.join(', ')}`);
}
if (DRY_RUN) {
  console.log('\n(dry-run 模式 — 未写入任何文件)');
}
