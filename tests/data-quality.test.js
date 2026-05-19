/**
 * tools.json 数据质量校验：命名、路径规范、字段取值范围、与磁盘文件的一致性。
 */

import fs from 'fs';
import path from 'path';
import { section, test, assert, loadToolsData, listToolHtmlFiles, ROOT } from './_harness.js';

section('数据质量');

const data = loadToolsData();
const entries = Object.entries(data.tools);
const categoryIds = Object.keys(data.categories);

test('工具名称不重复', () => {
  const seen = new Map();
  const dups = [];
  for (const [key, tool] of entries) {
    const name = tool.name.trim();
    if (seen.has(name)) dups.push(`"${name}" (#${seen.get(name)} 与 #${key})`);
    else seen.set(name, key);
  }
  assert(dups.length === 0, `重复名称:\n${dups.join('\n')}`);
});

test('工具 path 结构规范 (tools/<分类>/.../<名>.html)', () => {
  const bad = [];
  for (const [key, tool] of entries) {
    const p = tool.path;
    const segs = p.split('/');
    const ok =
      segs[0] === 'tools' &&
      segs.length >= 3 &&
      segs.every((s) => s.length > 0) &&
      p.endsWith('.html');
    if (!ok) bad.push(`#${key}: ${p}`);
  }
  assert(bad.length === 0, `不规范 path:\n${bad.join('\n')}`);
});

test('工具 path 不含危险片段 (.. // \\ 前导斜杠)', () => {
  const bad = [];
  for (const [key, tool] of entries) {
    const p = tool.path;
    if (p.includes('..') || p.includes('//') || p.includes('\\') || p.startsWith('/')) {
      bad.push(`#${key}: ${p}`);
    }
  }
  assert(bad.length === 0, `非法 path:\n${bad.join('\n')}`);
});

test('工具 path 的首层目录真实存在', () => {
  const bad = [];
  for (const [key, tool] of entries) {
    const dir = tool.path.split('/')[1];
    if (!fs.existsSync(path.join(ROOT, 'tools', dir))) bad.push(`#${key}: tools/${dir}`);
  }
  assert(bad.length === 0, `目录不存在:\n${bad.join('\n')}`);
});

test('每个分类至少被一个工具使用', () => {
  const used = new Set(entries.map(([, t]) => t.category));
  const empty = categoryIds.filter((c) => !used.has(c));
  assert(empty.length === 0, `空分类（无工具）: ${empty.join(', ')}`);
});

test('工具名称非空且长度 ≤ 60', () => {
  const bad = [];
  for (const [key, tool] of entries) {
    const n = (tool.name || '').trim();
    if (!n) bad.push(`#${key}: 空名称`);
    else if (n.length > 60) bad.push(`#${key}: 名称过长 (${n.length})`);
  }
  assert(bad.length === 0, bad.join('\n'));
});

test('工具描述非空且长度 ≤ 150', () => {
  const bad = [];
  for (const [key, tool] of entries) {
    const d = (tool.description || '').trim();
    if (!d) bad.push(`#${key}: 空描述`);
    else if (d.length > 150) bad.push(`#${key}: 描述过长 (${d.length})`);
  }
  assert(bad.length === 0, bad.join('\n'));
});

test('工具 keywords 非空', () => {
  const bad = entries.filter(([, t]) => !(t.keywords || '').trim()).map(([k]) => `#${k}`);
  assert(bad.length === 0, `空 keywords: ${bad.join(', ')}`);
});

test('工具 icon 非空且长度合理 (≤ 12 码点)', () => {
  const bad = [];
  for (const [key, tool] of entries) {
    const len = [...(tool.icon || '')].length;
    if (len === 0) bad.push(`#${key}: 空 icon`);
    else if (len > 12) bad.push(`#${key}: icon 过长 (${len}) "${tool.icon}"`);
  }
  assert(bad.length === 0, bad.join('\n'));
});

test('popularity 若存在则为非负有限数', () => {
  const bad = [];
  for (const [key, tool] of entries) {
    if (tool.popularity === undefined) continue;
    if (
      typeof tool.popularity !== 'number' ||
      !Number.isFinite(tool.popularity) ||
      tool.popularity < 0
    ) {
      bad.push(`#${key}: ${JSON.stringify(tool.popularity)}`);
    }
  }
  assert(bad.length === 0, `popularity 非法:\n${bad.join('\n')}`);
});

test('tools/ 下的 .html 文件都已登记在 tools.json（无游离文件）', () => {
  const registered = new Set(entries.map(([, t]) => t.path));
  // 分类落地页 tools/<cat>/index.html 由 sync 脚本生成，是独立页面类型，不登记为工具
  const orphans = listToolHtmlFiles().filter(
    (f) => !registered.has(f) && !/\/index\.html$/.test(f)
  );
  assert(orphans.length === 0, `未登记的文件:\n${orphans.join('\n')}`);
});
