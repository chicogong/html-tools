/* ============================================================
 * tool-chrome.js — 工具页运行时外壳
 *
 * 职责：
 *   1. 进入页面即应用保存的明暗主题（在 <head> 解析阶段执行，无闪烁）
 *   2. 注入悬浮「返回全部工具」胶囊 + 悬浮主题切换按钮
 *   3. 注入 SoftwareApplication / BreadcrumbList 结构化数据，利于 SEO
 *   4. 加载 Umami 统计与 Service Worker
 * ============================================================ */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var THEME_KEY = 'theme';
  var HOME_HREF = '../../index.html';

  var ANALYTICS_ENABLED = true;
  var UMAMI_SITE_ID = '';
  var UMAMI_SRC = 'https://analytics.umami.is/script.js';
  var scriptSrc = document.currentScript ? document.currentScript.src : window.location.href;

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
  } else {
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
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
    } catch (e) {}
    
    var btn = doc.getElementById('tbThemeToggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'light' ? '切换到暗色主题' : '切换到亮色主题');
    }
    
    // 提交无过渡状态后，下一帧恢复过渡
    void root.offsetWidth;
    requestAnimationFrame(function () {
      root.classList.remove('tb-anim-off');
    });

    // 追踪主题切换事件
    if (typeof umami !== 'undefined') {
      umami.track('theme_toggle', { theme: theme });
    }
  }

  /* ---------- 2. 注入悬浮外壳 (FAB) ---------- */
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

    doc.getElementById('tbThemeToggle').addEventListener('click', function () {
      applyTheme(currentTheme() === 'light' ? 'dark' : 'light');
    });
    
    // 初始化 Aria-label
    var btn = doc.getElementById('tbThemeToggle');
    if (btn) {
      btn.setAttribute('aria-label', currentTheme() === 'light' ? '切换到暗色主题' : '切换到亮色主题');
    }
  }

  /* ---------- 3. 统计与 Service Worker ---------- */
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

  function registerSW() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        var swUrl = new URL('../../sw.js', scriptSrc).href;
        navigator.serviceWorker.register(swUrl).catch(function (err) {
          console.log('SW registration failed:', err);
        });
      });
    }
  }

  /* ---------- 启动 ---------- */
  function start() {
    injectChrome();
    injectAnalytics();
    registerSW();
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
