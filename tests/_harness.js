/**
 * 零依赖测试框架 + 仓库辅助函数，供 tests/ 下所有测试文件共用。
 *
 * 通过 `npm test`（即 node tests/run.js）运行全部测试。
 * 不依赖任何第三方测试库，与项目「单文件、零构建」的理念保持一致。
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** 仓库根目录绝对路径 */
export const ROOT = path.join(__dirname, '..');

/** 站点域名（不带尾部斜杠），与 sitemap / canonical / og:url 保持一致 */
export const SITE = 'https://tools.realtime-ai.chat';

// ───────────────────────── 测试框架 ─────────────────────────

let passCount = 0;
let failCount = 0;
let currentSection = '-';
const failedNames = [];

/** 声明一个测试分组（仅用于分隔输出） */
export function section(title) {
  currentSection = title;
  console.log(`\n=== ${title} ===\n`);
}

/** 运行单个测试用例；fn 抛错即为失败 */
export function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passCount++;
  } catch (e) {
    const msg = e && e.message ? e.message : String(e);
    console.log(`  ✗ ${name}`);
    console.log('    ' + msg.split('\n').join('\n    '));
    failCount++;
    failedNames.push(`[${currentSection}] ${name}`);
  }
}

/** 断言：condition 为假时抛出 message */
export function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

/** 输出汇总并返回失败用例数 */
export function summary() {
  console.log('\n' + '='.repeat(54));
  console.log('📋 测试汇总');
  console.log(`   通过: ${passCount}`);
  console.log(`   失败: ${failCount}`);
  console.log(`   合计: ${passCount + failCount}`);
  if (failedNames.length > 0) {
    console.log('\n   失败用例:');
    for (const n of failedNames) console.log(`   ✗ ${n}`);
  }
  console.log('='.repeat(54));
  return failCount;
}

// ──────────────────────── 仓库辅助函数 ────────────────────────

let _toolsData = null;

/** 读取并解析 tools.json（结果缓存）；文件缺失或非法 JSON 会抛错 */
export function loadToolsData() {
  if (!_toolsData) {
    const raw = fs.readFileSync(path.join(ROOT, 'tools.json'), 'utf8');
    _toolsData = JSON.parse(raw);
  }
  return _toolsData;
}

/** 相对仓库根目录读取整个文本文件 */
export function readText(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

/** 读取文件开头的若干字节（用于只检查 <head>，避免读入大段内联 CSS/JS） */
export function readHead(relPath, bytes = 24000) {
  const fd = fs.openSync(path.join(ROOT, relPath), 'r');
  try {
    const buf = Buffer.alloc(bytes);
    const n = fs.readSync(fd, buf, 0, bytes, 0);
    return buf.toString('utf8', 0, n);
  } finally {
    fs.closeSync(fd);
  }
}

/** 判断文件是否存在（相对仓库根目录） */
export function fileExists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

/** 递归列出 tools/ 下全部 .html 文件，返回相对仓库根目录的正斜杠路径 */
export function listToolHtmlFiles() {
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fp = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(fp);
      else if (entry.isFile() && entry.name.endsWith('.html')) {
        out.push(path.relative(ROOT, fp).split(path.sep).join('/'));
      }
    }
  };
  walk(path.join(ROOT, 'tools'));
  return out.sort();
}
