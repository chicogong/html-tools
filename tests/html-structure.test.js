/**
 * 工具 HTML 文件的 <head> 结构校验：基础标签与 SEO 元数据。
 *
 * 仅读取每个文件开头部分（见 readHead），避免读入大段内联 CSS/JS。
 * 每个检查项遍历全部工具，汇总失败文件后一次性断言，保持输出整洁。
 */

import { section, test, assert, loadToolsData, readHead, SITE } from './_harness.js';

section('工具 HTML 结构');

const data = loadToolsData();
const tools = Object.entries(data.tools).map(([id, t]) => {
  let head = null;
  try {
    head = readHead(t.path);
  } catch {
    head = null;
  }
  return { id, path: t.path, head };
});

/** 取出 <head> 中 rel="canonical" 的 href（容忍属性顺序与换行换行） */
function canonicalHref(head) {
  for (const link of head.match(/<link\b[^>]*>/gi) || []) {
    if (/\brel=["']canonical["']/i.test(link)) {
      const h = link.match(/\bhref=["']([^"']+)["']/i);
      return h ? h[1] : null;
    }
  }
  return null;
}

/** 对全部工具运行同一个谓词，汇总不通过的文件 */
function checkAll(label, predicate) {
  test(label, () => {
    const bad = tools
      .filter((t) => t.head === null || !predicate(t))
      .map((t) => `#${t.id} ${t.path}`);
    assert(bad.length === 0, `${bad.length} 个文件未通过:\n${bad.slice(0, 20).join('\n')}`);
  });
}

checkAll('均以 <!doctype html> 开头', (t) => /^﻿?\s*<!doctype html>/i.test(t.head));
checkAll('均含 <html lang="...">', (t) => /<html[^>]*\blang=/i.test(t.head));
checkAll('均含非空 <title>', (t) => /<title>\s*[^<\s][^<]*<\/title>/i.test(t.head));
checkAll('均含 <meta charset>', (t) => /<meta[^>]+charset=/i.test(t.head));
checkAll('均含 <meta name="viewport">', (t) => /<meta[^>]+name=["']viewport["']/i.test(t.head));
checkAll('均含 <meta name="description">', (t) =>
  /<meta[^>]+name=["']description["']/i.test(t.head)
);
checkAll('均含 <link rel="canonical">', (t) => canonicalHref(t.head) !== null);
checkAll('canonical 链接与工具实际路径一致', (t) => canonicalHref(t.head) === `${SITE}/${t.path}`);
