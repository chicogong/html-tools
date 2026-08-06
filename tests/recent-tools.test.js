/**
 * 最近使用工具：共享外壳负责记录，首页控制器负责展示与排序。
 */

import vm from 'vm';
import { section, test, assert, readText } from './_harness.js';

section('最近使用工具');

const toolChromeSource = readText('assets/js/tool-chrome.js');
const recentControllerSource = readText('assets/js/recent-tools.js');

function createClassList() {
  return {
    add() {},
    remove() {},
    toggle() {}
  };
}

function createElement(tagName) {
  return {
    tagName: tagName.toUpperCase(),
    id: '',
    className: '',
    href: '',
    src: '',
    type: '',
    innerHTML: '',
    textContent: '',
    style: {},
    children: [],
    classList: createClassList(),
    setAttribute() {},
    getAttribute() {
      return null;
    },
    addEventListener() {},
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    querySelector() {
      return null;
    }
  };
}

function runToolChrome({ href, canonicalHref, stored, categoryPage = false }) {
  const values = new Map();
  if (stored !== undefined) values.set('html_tools_recents_v1', stored);

  const localStorage = {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, value);
    }
  };

  const domListeners = {};
  const rootAttributes = new Map();
  const documentElement = {
    classList: createClassList(),
    offsetWidth: 0,
    setAttribute(name, value) {
      rootAttributes.set(name, value);
    },
    getAttribute(name) {
      return rootAttributes.get(name) || null;
    }
  };

  const document = {
    documentElement,
    currentScript: { src: 'https://tools.realtime-ai.chat/assets/js/tool-chrome.js' },
    readyState: 'loading',
    head: createElement('head'),
    body: createElement('body'),
    querySelector(selector) {
      if (selector === 'link[rel="canonical"]') {
        return canonicalHref ? { href: canonicalHref } : null;
      }
      if (selector === '.cat-main') return categoryPage ? {} : null;
      return null;
    },
    getElementById() {
      return null;
    },
    createElement,
    addEventListener(name, listener) {
      domListeners[name] = listener;
    }
  };

  const parsedUrl = new URL(href);
  const window = {
    location: {
      href,
      pathname: parsedUrl.pathname
    },
    matchMedia() {
      return { matches: false };
    },
    addEventListener() {},
    ToolChrome: null
  };

  const context = {
    Array,
    JSON,
    Map,
    Object,
    URL,
    console,
    document,
    history: { pushState() {} },
    localStorage,
    navigator: {},
    requestAnimationFrame(callback) {
      callback();
    },
    window
  };

  vm.runInNewContext(toolChromeSource, context, { filename: 'tool-chrome.js' });
  assert(domListeners.DOMContentLoaded, 'tool-chrome 应等待 DOMContentLoaded 启动');
  domListeners.DOMContentLoaded();

  return values.get('html_tools_recents_v1');
}

test('最近记录倒序、去重并限制为 20 个', () => {
  const current = 'tools/dev/json-formatter.html';
  const existing = Array.from({ length: 25 }, (_, index) => `tools/dev/tool-${index}.html`);
  existing.splice(8, 0, current);

  const stored = runToolChrome({
    href: 'https://tools.realtime-ai.chat/tools/dev/json-formatter.html',
    canonicalHref: 'https://tools.realtime-ai.chat/tools/dev/json-formatter.html',
    stored: JSON.stringify(existing)
  });

  const recent = JSON.parse(stored);
  assert(recent.length === 20, `期望 20 条，实际 ${recent.length}`);
  assert(recent[0] === current, '当前工具应排在第一位');
  assert(recent.filter((item) => item === current).length === 1, '当前工具不应重复');
});

test('损坏的 localStorage 内容不会阻断记录', () => {
  const stored = runToolChrome({
    href: 'https://tools.realtime-ai.chat/tools/dev/base64.html',
    canonicalHref: 'https://tools.realtime-ai.chat/tools/dev/base64.html',
    stored: '{not-json'
  });

  assert(
    JSON.parse(stored)[0] === 'tools/dev/base64.html',
    '损坏记录后仍应保存当前工具'
  );
});

test('无 .html 的工具地址会归一化为登记路径', () => {
  const stored = runToolChrome({
    href: 'https://tools.realtime-ai.chat/tools/dev/json-formatter',
    canonicalHref: null
  });

  assert(
    JSON.parse(stored)[0] === 'tools/dev/json-formatter.html',
    'clean URL 应补齐 .html'
  );
});

test('分类落地页不会进入最近使用', () => {
  const original = JSON.stringify(['tools/dev/base64.html']);
  const stored = runToolChrome({
    href: 'https://tools.realtime-ai.chat/tools/dev/index.html',
    canonicalHref: 'https://tools.realtime-ai.chat/tools/dev/index.html',
    stored: original,
    categoryPage: true
  });

  assert(stored === original, '分类落地页不应改写最近记录');
});

test('首页控制器包含分类、URL、空状态和搜索联动', () => {
  const indexHtml = readText('index.html');
  const missing = [];

  if (!toolChromeSource.includes("new URL('recent-tools.js'")) missing.push('按需加载控制器');
  if (!/id:\s*["']recent["']/.test(indexHtml)) missing.push('首页 recent 分类元数据');
  if (!recentControllerSource.includes("dataset.category = 'recent'")) missing.push('最近分类按钮');
  if (!recentControllerSource.includes('history.pushState')) missing.push('分类 URL 状态');
  if (!recentControllerSource.includes("searchInput.addEventListener('input'")) {
    missing.push('搜索联动');
  }
  if (!recentControllerSource.includes('还没有最近使用的工具')) missing.push('最近空状态');

  assert(missing.length === 0, `缺失能力: ${missing.join(', ')}`);
});
