/**
 * 静态资源与 i18n 完整性校验。
 *
 * 覆盖 sync 脚本不触及、但同样需要保持一致的文件：
 *  - i18n/en.json 与 i18n/zh-CN.json 的翻译键应一一对应
 *  - sw.js 预缓存清单、manifest.json 图标 / 截图 / 快捷方式引用的文件应真实存在
 */

import { section, test, assert, readText, fileExists } from './_harness.js';

section('静态资源与 i18n');

/** 把嵌套对象的键扁平化为点分路径数组（数组视为叶子值） */
function flattenKeys(obj, prefix = '') {
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      keys.push(...flattenKeys(v, full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

/** 去掉前导斜杠，得到相对仓库根目录的路径 */
function toRel(urlPath) {
  return urlPath.replace(/^\//, '');
}

// ───────────────────────────── i18n ─────────────────────────────

let en;
let zh;

test('i18n/en.json 与 zh-CN.json 均为合法 JSON', () => {
  en = JSON.parse(readText('i18n/en.json'));
  zh = JSON.parse(readText('i18n/zh-CN.json'));
  assert(en && typeof en === 'object', 'en.json 解析失败');
  assert(zh && typeof zh === 'object', 'zh-CN.json 解析失败');
});

test('i18n 两种语言的翻译键完全一致', () => {
  const enKeys = new Set(flattenKeys(en));
  const zhKeys = new Set(flattenKeys(zh));
  const onlyEn = [...enKeys].filter((k) => !zhKeys.has(k));
  const onlyZh = [...zhKeys].filter((k) => !enKeys.has(k));
  assert(
    onlyEn.length === 0 && onlyZh.length === 0,
    `仅 en 存在: ${onlyEn.join(', ') || '无'}\n仅 zh-CN 存在: ${onlyZh.join(', ') || '无'}`
  );
});

// ─────────────────────────── sw.js 预缓存 ───────────────────────────

test('sw.js PRECACHE_ASSETS 引用的文件都存在', () => {
  const sw = readText('sw.js');
  const m = sw.match(/PRECACHE_ASSETS\s*=\s*\[([\s\S]*?)\]/);
  assert(m, '未找到 PRECACHE_ASSETS 数组');
  const assets = [...m[1].matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]);
  assert(assets.length > 0, 'PRECACHE_ASSETS 为空');
  const missing = assets.filter((a) => a !== '/' && !fileExists(toRel(a)));
  assert(missing.length === 0, `缺失文件: ${missing.join(', ')}`);
});

test('offline.html 存在（sw.js 的离线回退页）', () => {
  assert(fileExists('offline.html'), 'offline.html 缺失');
});

// ─────────────────────────── manifest.json ───────────────────────────

const manifest = JSON.parse(readText('manifest.json'));

test('manifest.json icons 引用的文件都存在', () => {
  const missing = (manifest.icons || [])
    .map((i) => i.src)
    .filter((src) => src && !fileExists(toRel(src)));
  assert(missing.length === 0, `缺失图标: ${missing.join(', ')}`);
});

test('manifest.json screenshots 引用的文件都存在', () => {
  const missing = (manifest.screenshots || [])
    .map((s) => s.src)
    .filter((src) => src && !fileExists(toRel(src)));
  assert(missing.length === 0, `缺失截图: ${missing.join(', ')}`);
});

test('manifest.json shortcuts 的 url 都指向真实文件', () => {
  const missing = (manifest.shortcuts || [])
    .map((s) => s.url)
    .filter((url) => url && url !== '/' && !url.endsWith('/'))
    .filter((url) => !fileExists(toRel(url)));
  assert(missing.length === 0, `shortcuts 指向缺失页面: ${missing.join(', ')}`);
});
