/**
 * Standalone HTML export checks: representative registered tools can be exported
 * as single HTML files with local shared assets inlined.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { section, test, assert, ROOT } from './_harness.js';

section('独立 HTML 导出');

const toolPaths = [
  'tools/dev/json-formatter.html',
  'tools/design/aurora-generator.html',
  'tools/converter/json-yaml.html',
  'tools/generator/qrcode-generator.html',
  'tools/media/image-format-converter.html'
];
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'webutils-standalone-'));

function outFileFor(toolPath) {
  return path.join(outDir, toolPath);
}

function exportedHtml(toolPath) {
  return fs.readFileSync(outFileFor(toolPath), 'utf8');
}

function runExport(toolPath) {
  execFileSync('node', ['scripts/export-standalone.mjs', toolPath, outDir], {
    cwd: ROOT,
    stdio: 'pipe'
  });
}

test('可导出多个代表性已登记工具为 standalone HTML', () => {
  const missing = [];
  for (const toolPath of toolPaths) {
    runExport(toolPath);
    if (!fs.existsSync(outFileFor(toolPath))) missing.push(toolPath);
  }
  assert(missing.length === 0, `导出文件不存在:\n${missing.join('\n')}`);
});

test('standalone HTML 内联本地共享 CSS/JS', () => {
  const bad = [];
  for (const toolPath of toolPaths) {
    const html = exportedHtml(toolPath);
    if (!html.includes('WebUtils Standalone Tool'))
      bad.push(`${toolPath}: 缺少 standalone 文件头说明`);
    if (!html.includes('data-standalone-inlined="assets/css/tool-base.css"')) {
      bad.push(`${toolPath}: 未内联 tool-base.css`);
    }
    if (!html.includes('data-standalone-inlined="assets/js/tool-chrome.js"')) {
      bad.push(`${toolPath}: 未内联 tool-chrome.js`);
    }
  }
  assert(bad.length === 0, bad.join('\n'));
});

test('standalone HTML 不保留本地共享资源引用', () => {
  const bad = [];
  for (const toolPath of toolPaths) {
    const html = exportedHtml(toolPath)
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');
    if (/<link[^>]+href=["']\.\.\/\.\.\/assets\//i.test(html)) {
      bad.push(`${toolPath}: 仍包含真实本地 assets link`);
    }
    if (/<script[^>]+src=["']\.\.\/\.\.\/assets\//i.test(html)) {
      bad.push(`${toolPath}: 仍包含真实本地 assets script`);
    }
  }
  assert(bad.length === 0, bad.join('\n'));
});
