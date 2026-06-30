/* ============================================================
 * tool-chrome.js — 工具页运行时核心 (v2.0 SSG)
 *
 * 职责：
 *   1. 进入页面即应用保存的明暗主题（在 <head> 解析阶段执行，无闪烁）
 *   2. 加载 Umami 统计
 *   3. 注册 Service Worker
 *
 * 用法：在每个工具 HTML 的 <head> 内引入（不要加 defer）
 * ============================================================ */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var THEME_KEY = 'theme';

  var ANALYTICS_ENABLED = true;
  var UMAMI_SITE_ID     = '';
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
  } else {
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
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

  /* ---------- 2. 注册 Service Worker ---------- */
  function start() {
    injectAnalytics();
    
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').catch(function(err) {
          console.log('SW registration failed:', err);
        });
      });
    }
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
