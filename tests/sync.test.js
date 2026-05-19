/**
 * 同步一致性校验：tools.json 与衍生文件是否保持同步。
 *
 * 对应 CLAUDE.md「常见陷阱 2」：改了 tools.json 忘记 `npm run sync:tools`。
 * 本测试为只读校验（不运行 sync），因此不受 sitemap.xml 每日 lastmod 变化影响。
 */

import { section, test, assert, loadToolsData, readText, SITE } from './_harness.js';

section('同步一致性');

const data = loadToolsData();
const entries = Object.entries(data.tools);
const toolCount = entries.length;
const toolPaths = entries.map(([, t]) => t.path);
const activeCategoryCount = new Set(entries.map(([, t]) => t.category)).size;

const indexHtml = readText('index.html');
const sitemap = readText('sitemap.xml');

// 从 index.html 内联的 TOOLS 数组提取 url 列表
const toolsArrMatch = indexHtml.match(/const TOOLS = \[([\s\S]*?)\n\s*\];/);
const indexUrls = toolsArrMatch
  ? [...toolsArrMatch[1].matchAll(/^\s*url:\s*["']([^"']+)["']/gm)].map((m) => m[1])
  : [];

test('index.html 含内联 TOOLS 数组', () => {
  assert(toolsArrMatch, '未找到 const TOOLS = [ ... ];');
  assert(indexUrls.length > 0, 'TOOLS 数组为空');
});

test(`index.html TOOLS 数量与 tools.json 一致 (${toolCount})`, () => {
  assert(
    indexUrls.length === toolCount,
    `index.html 有 ${indexUrls.length} 个，tools.json 有 ${toolCount} 个 —— 请运行 npm run sync:tools`
  );
});

test('每个工具 path 都出现在 index.html TOOLS 中', () => {
  const set = new Set(indexUrls);
  const missing = toolPaths.filter((p) => !set.has(p));
  assert(missing.length === 0, `index.html 缺少:\n${missing.slice(0, 20).join('\n')}`);
});

test(`index.html tool-count 数字与工具数一致 (${toolCount})`, () => {
  const m = indexHtml.match(/id="tool-count"[^>]*>(\d+)</);
  assert(m, '未找到 id="tool-count" 的数字');
  assert(Number(m[1]) === toolCount, `显示 ${m[1]}，应为 ${toolCount}`);
});

test(`index.html category-count 数字与活跃分类数一致 (${activeCategoryCount})`, () => {
  const m = indexHtml.match(/id="category-count"[^>]*>(\d+)</);
  assert(m, '未找到 id="category-count" 的数字');
  assert(Number(m[1]) === activeCategoryCount, `显示 ${m[1]}，应为 ${activeCategoryCount}`);
});

// 分类落地页：每个分类生成 tools/<cat>/index.html，已登记为工具的分类首页（如 ai-coding）除外
const registeredPaths = new Set(toolPaths);
const categoryPagePaths = Object.keys(data.categories)
  .map((c) => `tools/${c}/index.html`)
  .filter((p) => !registeredPaths.has(p));
const expectedLocs = toolCount + 1 + categoryPagePaths.length;

test(`sitemap.xml <loc> 数量为 工具数 + 首页 + 分类落地页 (${expectedLocs})`, () => {
  const locs = sitemap.match(/<loc>/g) || [];
  assert(
    locs.length === expectedLocs,
    `sitemap 有 ${locs.length} 个 <loc>，应为 ${expectedLocs} —— 请运行 npm run sync:tools`
  );
});

test('sitemap.xml 含首页 URL', () => {
  assert(sitemap.includes(`<loc>${SITE}/</loc>`), `未找到 <loc>${SITE}/</loc>`);
});

test('每个工具 path 都出现在 sitemap.xml 中', () => {
  const missing = toolPaths.filter((p) => !sitemap.includes(`<loc>${SITE}/${p}</loc>`));
  assert(missing.length === 0, `sitemap.xml 缺少:\n${missing.slice(0, 20).join('\n')}`);
});

test('每个分类落地页都出现在 sitemap.xml 中', () => {
  const missing = categoryPagePaths.filter((p) => !sitemap.includes(`<loc>${SITE}/${p}</loc>`));
  assert(missing.length === 0, `sitemap.xml 缺少分类落地页:\n${missing.join('\n')}`);
});

test(`manifest.json 描述含工具数 "${toolCount}+"`, () => {
  const manifest = readText('manifest.json');
  assert(
    manifest.includes(`${toolCount}+`),
    `manifest.json 未提及 ${toolCount}+ —— 请运行 npm run sync:tools`
  );
});

test(`README.md 徽章为 Tools-${toolCount}+`, () => {
  const readme = readText('README.md');
  assert(
    readme.includes(`Tools-${toolCount}+`),
    `README.md 徽章不是 Tools-${toolCount}+ —— 请运行 npm run sync:tools`
  );
});

test(`i18n 副标题工具数为 "${toolCount}+"`, () => {
  for (const file of ['i18n/en.json', 'i18n/zh-CN.json']) {
    const json = readText(file);
    assert(
      new RegExp(`"subtitle"\\s*:\\s*"${toolCount}\\+`).test(json),
      `${file} 副标题工具数不是 ${toolCount}+ —— 请运行 npm run sync:tools`
    );
  }
});
