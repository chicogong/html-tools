/**
 * tools.json 结构校验：确保数据源本身结构完整、字段齐全、引用有效。
 */

import { section, test, assert, loadToolsData, fileExists } from './_harness.js';

section('tools.json 结构');

let data;

test('tools.json 存在且为合法 JSON', () => {
  data = loadToolsData();
  assert(data && typeof data === 'object', '应解析为对象');
});

test('包含非空 categories 对象', () => {
  assert(data.categories && typeof data.categories === 'object', 'categories 缺失');
  assert(Object.keys(data.categories).length > 0, 'categories 为空');
});

test('包含非空 tools 对象', () => {
  assert(data.tools && typeof data.tools === 'object', 'tools 缺失');
  assert(Object.keys(data.tools).length > 0, 'tools 为空');
});

test('每个分类都有 name / icon / color', () => {
  for (const [key, cat] of Object.entries(data.categories)) {
    assert(cat.name, `分类 ${key} 缺少 name`);
    assert(cat.icon, `分类 ${key} 缺少 icon`);
    assert(cat.color, `分类 ${key} 缺少 color`);
  }
});

test('每个工具都有必填字段', () => {
  const required = ['path', 'name', 'category', 'keywords', 'icon', 'description'];
  for (const [key, tool] of Object.entries(data.tools)) {
    for (const field of required) {
      assert(tool[field], `工具 ${key} 缺少 ${field}`);
    }
  }
});

test('工具的 category 都指向已定义分类', () => {
  const cats = Object.keys(data.categories);
  for (const [key, tool] of Object.entries(data.tools)) {
    assert(cats.includes(tool.category), `工具 ${key} 的分类无效: ${tool.category}`);
  }
});

test('所有工具文件都存在于磁盘', () => {
  const missing = [];
  for (const [key, tool] of Object.entries(data.tools)) {
    if (!fileExists(tool.path)) missing.push(`${key}: ${tool.path}`);
  }
  assert(missing.length === 0, `缺失文件:\n${missing.join('\n')}`);
});

test('工具 path 唯一', () => {
  const paths = Object.values(data.tools).map((t) => t.path);
  const dup = [...new Set(paths.filter((p, i) => paths.indexOf(p) !== i))];
  assert(dup.length === 0, `重复 path:\n${dup.join('\n')}`);
});

test('工具 ID 从 1 开始连续编号', () => {
  const ids = Object.keys(data.tools)
    .map(Number)
    .sort((a, b) => a - b);
  for (let i = 0; i < ids.length; i++) {
    assert(ids[i] === i + 1, `ID 不连续：位置 ${i} 期望 ${i + 1}，实际 ${ids[i]}`);
  }
});
