/**
 * 重定向规则校验：_redirects 与 vercel.json。
 *
 * 近期多次提交都在修重定向（裸 URL 形式、跨分类去重等），故加测试守护：
 *  - 重定向目标文件必须真实存在
 *  - 已迁移工具的旧路径不应再有同名文件（否则重定向被遮蔽）
 *  - 两份配置（_redirects / vercel.json）的规则应保持对应
 */

import { section, test, assert, readText, fileExists } from './_harness.js';

section('重定向规则');

/** 把 /tools/foo 或 /tools/foo.html 解析为相对仓库根目录的文件路径 */
function targetFile(urlPath) {
  let rel = urlPath.replace(/^\//, '');
  if (!rel.endsWith('.html')) rel += '.html';
  return rel;
}

/** 是否为可解析的本地工具路径（排除通配符 * 与占位符 :splat） */
function isLocalToolPath(p) {
  return p.startsWith('/tools/') && !p.includes('*') && !p.includes(':');
}

// ───────── _redirects ─────────

const redirectRules = readText('_redirects')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'))
  .map((l) => l.split(/\s+/))
  .filter((parts) => parts.length >= 3)
  .map(([from, to, code]) => ({ from, to, code }));

test('_redirects 能解析出重定向规则', () => {
  assert(redirectRules.length > 0, '未解析到任何规则');
});

test('_redirects 所有重定向目标文件都存在', () => {
  const broken = redirectRules
    .filter((r) => isLocalToolPath(r.to) && !fileExists(targetFile(r.to)))
    .map((r) => `${r.from} -> ${r.to}`);
  assert(broken.length === 0, `目标文件缺失:\n${broken.join('\n')}`);
});

test('_redirects 的 301 源路径不应再是真实文件', () => {
  const shadowed = redirectRules
    .filter((r) => r.code === '301' && isLocalToolPath(r.from) && fileExists(targetFile(r.from)))
    .map((r) => r.from);
  assert(shadowed.length === 0, `源路径仍存在同名文件（重定向被遮蔽）:\n${shadowed.join('\n')}`);
});

test('_redirects 中 baidu 验证文件重定向目标存在', () => {
  const baidu = redirectRules.find((r) => r.from.includes('baidu_verify'));
  if (baidu) {
    assert(fileExists(baidu.to.replace(/^\//, '')), `缺少 ${baidu.to}`);
  }
});

// ───────── vercel.json ─────────

const vercel = JSON.parse(readText('vercel.json'));
const vercelRedirects = vercel.redirects || [];

test('vercel.json 所有重定向目标文件都存在', () => {
  const broken = vercelRedirects
    .filter((r) => isLocalToolPath(r.destination) && !fileExists(targetFile(r.destination)))
    .map((r) => `${r.source} -> ${r.destination}`);
  assert(broken.length === 0, `目标文件缺失:\n${broken.join('\n')}`);
});

test('vercel.json 每条具体重定向在 _redirects 中都有对应规则', () => {
  const froms = new Set(redirectRules.map((r) => r.from));
  const missing = vercelRedirects
    .filter((r) => !r.source.includes('*') && !r.source.includes(':'))
    .map((r) => r.source)
    .filter((src) => !froms.has(src));
  assert(missing.length === 0, `_redirects 缺少对应规则: ${missing.join(', ')}`);
});

test('vercel.json 与 _redirects 的重定向目标一致', () => {
  const ruleByFrom = new Map(redirectRules.map((r) => [r.from, r]));
  const mismatch = [];
  for (const r of vercelRedirects) {
    if (r.source.includes('*') || r.source.includes(':')) continue;
    const rule = ruleByFrom.get(r.source);
    if (rule && rule.to !== r.destination) {
      mismatch.push(`${r.source}: vercel→${r.destination} ≠ _redirects→${rule.to}`);
    }
  }
  assert(mismatch.length === 0, `重定向目标不一致:\n${mismatch.join('\n')}`);
});
