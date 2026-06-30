/* ============================================================
 * tool-chrome.js — 工具页运行时外壳
 *
 * 职责：
 *   1. 进入页面即应用保存的明暗主题（在 <head> 解析阶段执行，无闪烁）
 *   2. 注入悬浮「返回全部工具」胶囊 + 悬浮主题切换按钮
 *   3. 注入 SoftwareApplication / BreadcrumbList 结构化数据，利于 SEO
 *
 * 用法：在每个工具 HTML 的 <head> 内引入（不要加 defer）
 *   <script src="../../assets/js/tool-chrome.js"></script>
 *
 * 改一次外壳 = 全站生效。
 * ============================================================ */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var THEME_KEY = 'theme';
  var HOME_HREF = '../../index.html';

  /* ---------- Analytics 配置 ----------
   * 使用 Umami（开源 · 无 Cookie · GDPR 合规 · 隐私友好）
   * 注册: https://cloud.umami.is → 添加网站 → 复制 Website ID
   * 填入下方 UMAMI_SITE_ID 即可启用，留空则不加载（零副作用）
   * 免费额度：100K 页面浏览/月
   * ---------- */
  var ANALYTICS_ENABLED = true;
  var UMAMI_SITE_ID     = '';  // ← 填入 Umami Website ID 即可启用
  var UMAMI_SRC         = 'https://analytics.umami.is/script.js';

  /* ---------- 1. 尽早应用主题，避免首屏闪烁 ---------- */
  function readTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      return saved === 'light' || saved === 'dark' ? saved : null;
    } catch (e) {
      return null;
    }
  }

  var initial = readTheme();
  if (initial) {
    root.setAttribute('data-theme', initial);
  }

  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    // 切换瞬间关闭全页过渡，避免大面积颜色渐变造成的卡顿
    root.classList.add('tb-anim-off');
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* 隐私模式下 localStorage 不可写，忽略 */
    }
    var btn = doc.getElementById('tbThemeToggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'light' ? '切换到暗色主题' : '切换到亮色主题');
    }
    // 提交无过渡状态后，下一帧恢复过渡
    void root.offsetWidth;
    requestAnimationFrame(function () {
      root.classList.remove('tb-anim-off');
    });
  }

  function injectAnalytics() {
    if (!ANALYTICS_ENABLED || !UMAMI_SITE_ID) return;
    var s = doc.createElement('script');
    s.async = true;
    s.defer = true;
    s.src = UMAMI_SRC;
    s.setAttribute('data-website-id', UMAMI_SITE_ID);
    s.setAttribute('data-domains', location.hostname);
    doc.head.appendChild(s);
  }

  /* ---------- 2. 注入悬浮外壳 ---------- */
  var ICON_BACK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"' +
    ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<polyline points="15 18 9 12 15 6"></polyline></svg>';

  var ICON_MOON =
    '<svg class="tb-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
    ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

  var ICON_SUN =
    '<svg class="tb-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
    ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="5"></circle>' +
    '<line x1="12" y1="1" x2="12" y2="3"></line>' +
    '<line x1="12" y1="21" x2="12" y2="23"></line>' +
    '<line x1="4.2" y1="4.2" x2="5.6" y2="5.6"></line>' +
    '<line x1="18.4" y1="18.4" x2="19.8" y2="19.8"></line>' +
    '<line x1="1" y1="12" x2="3" y2="12"></line>' +
    '<line x1="21" y1="12" x2="23" y2="12"></line>' +
    '<line x1="4.2" y1="19.8" x2="5.6" y2="18.4"></line>' +
    '<line x1="18.4" y1="5.6" x2="19.8" y2="4.2"></line></svg>';

  function injectChrome() {
    if (doc.getElementById('tbChrome') || !doc.body) {
      return;
    }
    var wrap = doc.createElement('div');
    wrap.id = 'tbChrome';
    wrap.innerHTML =
      '<a class="tb-fab tb-fab-home" href="' +
      HOME_HREF +
      '" aria-label="返回全部工具">' +
      ICON_BACK +
      '<span>全部工具</span></a>' +
      '<button class="tb-fab tb-fab-theme" id="tbThemeToggle" type="button"' +
      ' aria-label="切换主题">' +
      ICON_MOON +
      ICON_SUN +
      '</button>';
    doc.body.appendChild(wrap);

    // 注入底部署名（防搬运）
    var credit = doc.createElement('div');
    credit.id = 'tbCredit';
    credit.innerHTML =
      '<a href="https://github.com/chicogong/html-tools" target="_blank" rel="noreferrer">' +
      'Powered by WebUtils · chicogong</a>';
    doc.body.appendChild(credit);

    doc.getElementById('tbThemeToggle').addEventListener('click', function () {
      applyTheme(currentTheme() === 'light' ? 'dark' : 'light');
      if (typeof umami !== 'undefined') {
        umami.track('theme_toggle', currentTheme());
      }
    });
    applyTheme(currentTheme());
  }

  /* ---------- 3. 注入结构化数据（SEO）---------- */
  function metaContent(selector) {
    var el = doc.querySelector(selector);
    return el ? el.getAttribute('content') || el.getAttribute('href') || '' : '';
  }

  function hasSchemaType(type) {
    var nodes = doc.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < nodes.length; i++) {
      if ((nodes[i].textContent || '').indexOf(type) !== -1) {
        return true;
      }
    }
    return false;
  }

  function addSchema(obj) {
    var s = doc.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(obj);
    doc.head.appendChild(s);
  }

  function injectSchema() {
    var name = (doc.title || '').split(' - ')[0].split(' | ')[0].trim();
    var url = metaContent('link[rel="canonical"]');
    var desc = metaContent('meta[name="description"]');
    if (!name || !url) {
      return;
    }

    if (!hasSchemaType('SoftwareApplication')) {
      addSchema({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: name,
        description: desc,
        url: url,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires a modern web browser',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      });
    }
  }

  /* ---------- 启动 ---------- */
  function start() {
    injectChrome();
    injectAnalytics();
    // 结构化数据非关键路径，放到空闲时再注入，避免占用首屏主线程
    if (window.requestIdleCallback) {
      window.requestIdleCallback(injectSchema);
    } else {
      window.setTimeout(injectSchema, 200);
    }
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
