/**
 * 工具 HTML 文件的 <head> 结构校验：基础标签与 SEO 元数据。
 *
 * 仅读取每个文件开头部分（见 readHead），避免读入大段内联 CSS/JS。
 * 每个检查项遍历全部工具，汇总失败文件后一次性断言，保持输出整洁。
 */

import { section, test, assert, loadToolsData, readHead, readText } from './_harness.js';
import { load } from 'cheerio';
import { publicUrl } from '../scripts/public-url.mjs';

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

function openGraphUrl(head) {
  for (const meta of head.match(/<meta\b[^>]*>/gi) || []) {
    if (/\bproperty=["']og:url["']/i.test(meta)) {
      const content = meta.match(/\bcontent=["']([^"']+)["']/i);
      return content ? content[1] : null;
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
checkAll(
  'canonical 链接与生产环境最终 URL 一致',
  (t) => canonicalHref(t.head) === publicUrl(t.path)
);
checkAll(
  'Open Graph URL 与生产环境最终 URL 一致',
  (t) => openGraphUrl(t.head) === publicUrl(t.path)
);

test('工具页源代码中的站内链接使用最终 clean URL', () => {
  const bad = [];
  for (const tool of tools) {
    const $ = load(readText(tool.path));
    $('a[href]').each((_index, anchor) => {
      const href = $(anchor).attr('href');
      const isInternal =
        !/^(?:[a-z]+:|\/\/)/i.test(href) || href.startsWith('https://tools.realtime-ai.chat/');
      if (isInternal && /(?:^|\/)index\.html(?:[?#]|$)|\.html(?:[?#]|$)/i.test(href)) {
        bad.push(`#${tool.id} ${tool.path}: ${href}`);
      }
    });
  }

  assert(bad.length === 0, `${bad.length} 个站内链接仍暴露 .html:\n${bad.slice(0, 20).join('\n')}`);
});

test('每个工具页有且仅有一个非空 H1', () => {
  const bad = tools
    .map((t) => {
      const html = readText(t.path);
      const $ = load(html);
      $('script, style, template, noscript').remove();
      const headings = $('h1');
      const nonEmpty = headings.filter((_index, heading) => $(heading).text().trim().length > 0);
      return headings.length === 1 && nonEmpty.length === 1
        ? null
        : `#${t.id} ${t.path}: H1=${headings.length}, 非空=${nonEmpty.length}`;
    })
    .filter(Boolean);

  assert(bad.length === 0, `${bad.length} 个文件未通过:\n${bad.slice(0, 20).join('\n')}`);
});

test('H1 门禁忽略脚本、注释与惰性模板中的标签文本', () => {
  const $ = load(`
    <body>
      <script>const example = '<h1>脚本示例</h1>';</script>
      <!-- <h1>注释示例</h1> -->
      <template><h1>模板示例</h1></template>
      <h1>真实标题</h1>
    </body>
  `);
  $('script, style, template, noscript').remove();
  const headings = $('h1');

  assert(headings.length === 1, `期望 1 个真实 H1，实际 ${headings.length}`);
  assert(headings.first().text() === '真实标题', '错误地把非渲染上下文计为 H1');
});
