#!/usr/bin/env node
/**
 * 给所有受影响的工具 HTML 注入 CSS 兼容垫片
 *
 * 背景：commit d03c9548 改了 :root 变量名但没改主体引用，
 *       导致 ~432 个工具的 var(--color-*) 全部解析失败、样式失效。
 *
 * 策略：在每个工具 HTML 的第一个 :root 块前面插入垫片 :root，
 *       后定义会覆盖前定义，所以工具自己的 :root 仍是最终值；
 *       但工具 CSS 主体里那些「孤儿引用」会从垫片里取到值。
 *
 * 幂等：通过标记注释 `/* CSS 变量兼容垫片` 检测，已注入则跳过。
 *
 * 用法：node scripts/inject-css-shim.cjs [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SHIM_PATH = path.join(__dirname, '_shim-content.css');
const SHIM_MARKER = '/* CSS 变量兼容垫片';
const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');

const shim = fs.readFileSync(SHIM_PATH, 'utf8').trimEnd();

const indentedShim = shim
  .split('\n')
  .map((line) => (line ? '      ' + line : ''))
  .join('\n');

const tools = execSync('find tools -name "*.html"', { cwd: ROOT })
  .toString()
  .trim()
  .split('\n')
  .map((p) => path.join(ROOT, p));

let modified = 0;
let skippedAlreadyInjected = 0;
let skippedNoStyle = 0;
let skippedNoRoot = 0;

for (const file of tools) {
  let content = fs.readFileSync(file, 'utf8');

  if (content.includes(SHIM_MARKER)) {
    if (!FORCE) {
      skippedAlreadyInjected++;
      continue;
    }
    // --force：剥离整个旧垫片（marker 行 + 后续连续的 :root { ... } / [data-theme=...] { ... } 块），
    // 直到遇到原 :root（其特征：定义 --bg-deep: 直值，而非 var()）。
    const markerIdx = content.indexOf(SHIM_MARKER);
    const markerLineStart = content.lastIndexOf('\n', markerIdx) + 1;

    // 从 markerLineStart 开始扫描，逐个跳过 { ... } 块，直到下一块的内容
    // 不再是兼容垫片（即不含 SHIM_MARKER 之后的内容也不再是 var(--... 风格的映射）。
    // 简化判断：垫片的 :root 第一行通常是 var(--bg-deep) 或注释；原 :root 第一行是 --bg-deep: #;
    let pos = markerLineStart;
    while (true) {
      const openBrace = content.indexOf('{', pos);
      if (openBrace === -1) break;
      // 取这个块的开头几个字符判定是否是垫片
      const firstLineEnd = content.indexOf('\n', openBrace);
      const firstContentLine = content.slice(openBrace + 1, firstLineEnd + 200);
      const looksLikeShim =
        firstContentLine.includes('var(--') || // 映射定义
        firstContentLine.includes('color-* 家族') || // 内嵌注释
        firstContentLine.includes('玻璃拟态') ||
        firstContentLine.includes('兼容垫片') ||
        firstContentLine.includes('浅色主题覆盖');
      if (!looksLikeShim) break;
      // 找匹配的 }
      let depth = 1;
      let i = openBrace + 1;
      while (i < content.length && depth > 0) {
        if (content[i] === '{') depth++;
        else if (content[i] === '}') depth--;
        i++;
      }
      pos = i;
      // 跳过空白和换行
      while (pos < content.length && /\s/.test(content[pos])) pos++;
    }
    // 删掉 [markerLineStart, pos)
    // 但要保留 pos 前的最后一个换行的缩进（让原 :root 上方有空行）
    const stripEnd = content.lastIndexOf('\n', pos) + 1;
    content = content.slice(0, markerLineStart) + content.slice(stripEnd);
  }

  const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
  if (!styleMatch) {
    skippedNoStyle++;
    continue;
  }

  const rootMatch = styleMatch[1].match(/(\s*):root\s*\{/);
  if (!rootMatch) {
    skippedNoRoot++;
    continue;
  }

  const rootStartInStyle = styleMatch[1].indexOf(rootMatch[0]);
  const styleStart = content.indexOf(styleMatch[0]);
  const insertAt = styleStart + '<style>'.length + rootStartInStyle + rootMatch[1].length;

  const before = content.slice(0, insertAt);
  const after = content.slice(insertAt);

  content = before + indentedShim + '\n\n      ' + after.trimStart();

  if (!DRY_RUN) fs.writeFileSync(file, content);
  modified++;
}

console.log(`Tool files scanned:        ${tools.length}`);
console.log(`Modified (shim injected):  ${modified}`);
console.log(`Skipped (already injected):${skippedAlreadyInjected}`);
console.log(`Skipped (no <style>):      ${skippedNoStyle}`);
console.log(`Skipped (no :root):        ${skippedNoRoot}`);
if (DRY_RUN) console.log('\n(dry-run mode — nothing written)');
