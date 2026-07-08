/* ==========================================================
 * tool-chrome.js  v2.0
 *
 * 「一行脚本」运行时外壳 —— 完全自包含，单文件直接拿去用。
 *
 * 功能：
 *   1. 无闪烁主题初始化（localStorage + prefers-color-scheme）
 *   2. 注入悬浮 FAB：返回主页胶囊 + 主题切换圆钮
 *   3. 内联 fallback CSS（当工具页不引入 tool-base.css 时兜底）
 *   4. 智能主页 URL 推断（无论文件在几层目录都能正确返回）
 *   5. 暴露 window.ToolChrome 扩展钩子（埋点 / 多语言 / 其他）
 *   6. 注册 Service Worker（有 sw.js 时自动生效）
 *
 * 用法（放在 <body> 末尾或 <head> 均可）：
 *   <script src="../../assets/js/tool-chrome.js"></script>
 *
 * 覆盖主页地址（可选）：
 *   <meta name="home-url" content="/index.html">
 *
 * ========================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------
   * 0. 工具函数
   * ------------------------------------------------------ */
  var doc = document;
  var root = doc.documentElement;
  // ⚠️ 必须在 IIFE 顶层同步捕获 —— DOMContentLoaded 回调里 currentScript 已是 null
  var _currentScript = doc.currentScript;
  var THEME_KEY = 'theme';

  /** 安全读取 localStorage */
  function lsGet(k) {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return null;
    }
  }
  /** 安全写入 localStorage */
  function lsSet(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch (e) {}
  }

  /* --------------------------------------------------------
   * 1. 主题：尽早应用，避免首屏闪烁
   *    （此块在脚本解析时同步执行，不等 DOMContentLoaded）
   * ------------------------------------------------------ */
  var saved = lsGet(THEME_KEY);
  var initTheme =
    saved === 'light' || saved === 'dark'
      ? saved
      : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

  root.setAttribute('data-theme', initTheme);

  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    // 切换瞬间禁掉全页过渡，避免大面积颜色渐变卡顿
    root.classList.add('tc-anim-off');
    root.setAttribute('data-theme', theme);
    lsSet(THEME_KEY, theme);

    var btn = doc.getElementById('tcThemeBtn');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'light' ? '切换到暗色主题' : '切换到亮色主题');
      btn.setAttribute('title', theme === 'light' ? '切换到暗色主题' : '切换到亮色主题');
    }

    void root.offsetWidth; // force reflow
    requestAnimationFrame(function () {
      root.classList.remove('tc-anim-off');
    });

    // 通知扩展钩子
    if (window.ToolChrome && window.ToolChrome.onThemeChange) {
      window.ToolChrome.onThemeChange(theme);
    }
  }

  /* --------------------------------------------------------
   * 2. 智能主页 URL 推断
   *
   *    优先级：
   *    a. <meta name="home-url" content="...">  （显式覆盖，最高优先）
   *    b. 根据 <script src="..."> 路径逆推        （自动计算）
   *    c. 兜底 '/index.html'
   * ------------------------------------------------------ */
  function resolveHomeUrl() {
    // a. meta 显式指定（最高优先）
    var meta = doc.querySelector('meta[name="home-url"]');
    if (meta && meta.content) return meta.content;

    // b. 从 IIFE 顶层捕获的 script.src 推断（准确，适用于服务器和 file://）
    if (_currentScript && _currentScript.src) {
      try {
        var scriptUrl = new URL(_currentScript.src);
        var parts = scriptUrl.pathname.split('/');
        var assetIdx = parts.lastIndexOf('assets');
        if (assetIdx > 0) {
          var rootPath = parts.slice(0, assetIdx).join('/') || '';
          return rootPath + '/index.html';
        }
      } catch (e) {}
    }

    // c. 兜底：从 window.location.pathname 的目录层级计算相对路径
    //    正确算法：找到 'tools' 目录，计算从当前文件到 tools 父目录的 .. 层数
    //    tools/dev/base64.html      -> ../../index.html      (afterTools=['dev'], depth=2)
    //    tools/ai/wiki/page.html    -> ../../../index.html   (afterTools=['ai','wiki'], depth=3)
    try {
      var segs = window.location.pathname.split('/').filter(Boolean);
      var toolsIdx = segs.indexOf('tools');
      if (toolsIdx >= 0) {
        // afterTools：tools 后面的路径段，去掉最后一段（文件名）
        var afterTools = segs.slice(toolsIdx + 1, -1);
        var depth = afterTools.length + 1; // +1 for 'tools' itself
        return Array(depth).fill('..').join('/') + '/index.html';
      }
    } catch (e) {}

    return '/index.html';
  }

  /* --------------------------------------------------------
   * 3. 注入 fallback CSS（当页面没有引入 tool-base.css 时兜底）
   *    使用 @layer 保证不污染已有样式，优先级最低
   * ------------------------------------------------------ */
  function injectFallbackCSS() {
    if (doc.getElementById('tc-style')) return;

    var css = [
      /* 主题变量 — 暗色（默认） */
      ':root,[data-theme="dark"]{',
      '  --tc-bg:rgba(20,20,30,.82);',
      '  --tc-border:rgba(255,255,255,.10);',
      '  --tc-text:#e8e8ed;',
      '  --tc-accent:#00f5d4;',
      '  --tc-shadow:0 4px 24px rgba(0,0,0,.45);',
      '  --tc-radius-pill:9999px;',
      '  --tc-radius-circle:50%;',
      '}',
      /* 主题变量 — 亮色 */
      '[data-theme="light"]{',
      '  --tc-bg:rgba(255,255,255,.88);',
      '  --tc-border:rgba(0,0,0,.08);',
      '  --tc-text:#1a1a1a;',
      '  --tc-accent:#00b8a0;',
      '  --tc-shadow:0 4px 24px rgba(0,0,0,.12);',
      '}',
      /* 外壳容器 */
      '#tcChrome{position:fixed;bottom:20px;left:0;right:0;pointer-events:none;z-index:2147483000}',
      /* FAB 公共 */
      '.tc-fab{',
      '  pointer-events:auto;',
      '  display:inline-flex;align-items:center;justify-content:center;gap:7px;',
      '  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;',
      '  font-size:13.5px;font-weight:600;',
      '  color:var(--tc-text,#e8e8ed);',
      '  text-decoration:none;',
      '  background:var(--tc-bg,rgba(20,20,30,.82));',
      '  border:1.5px solid var(--tc-border,rgba(255,255,255,.1));',
      '  box-shadow:var(--tc-shadow);',
      '  cursor:pointer;',
      '  -webkit-backdrop-filter:blur(12px) saturate(160%);',
      '  backdrop-filter:blur(12px) saturate(160%);',
      '  transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease;',
      '}',
      '.tc-fab:hover{transform:translateY(-2px);border-color:var(--tc-accent);box-shadow:var(--tc-shadow),0 0 0 1px var(--tc-accent)}',
      '.tc-fab:active{transform:translateY(0)}',
      '.tc-fab:focus-visible{outline:2px solid var(--tc-accent);outline-offset:3px}',
      /* 返回主页胶囊 */
      '#tcHome{position:fixed;bottom:20px;left:20px;padding:10px 16px 10px 13px;border-radius:var(--tc-radius-pill)}',
      '#tcHome svg{width:16px;height:16px;flex-shrink:0}',
      /* 主题切换圆钮 */
      '#tcThemeBtn{position:fixed;bottom:20px;right:20px;width:46px;height:46px;padding:0;border-radius:var(--tc-radius-circle);background:none;border:1.5px solid var(--tc-border)}',
      '#tcThemeBtn svg{width:18px;height:18px}',
      /* 日/月图标切换 */
      '.tc-icon-sun{display:none}',
      '[data-theme="light"] .tc-icon-sun{display:block}',
      '[data-theme="light"] .tc-icon-moon{display:none}',
      /* 移动端 */
      '@media(max-width:600px){',
      '  #tcHome{left:14px;bottom:14px;width:46px;height:46px;padding:0;border-radius:var(--tc-radius-circle)}',
      '  #tcHome .tc-label{display:none}',
      '  #tcThemeBtn{right:14px;bottom:14px}',
      '}',
      /* 打印隐藏 */
      '@media print{#tcChrome{display:none}}',
      /* 切换主题时禁掉全页过渡 */
      '.tc-anim-off,.tc-anim-off *,.tc-anim-off *::before,.tc-anim-off *::after{transition:none!important}'
    ].join('\n');

    var style = doc.createElement('style');
    style.id = 'tc-style';
    style.textContent = css;
    doc.head.appendChild(style);
  }

  /* --------------------------------------------------------
   * 4. SVG 图标
   * ------------------------------------------------------ */
  var SVG_BACK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>';

  var SVG_MOON =
    '<svg class="tc-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

  var SVG_SUN =
    '<svg class="tc-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';

  /* --------------------------------------------------------
   * 5. 注入 FAB 外壳
   * ------------------------------------------------------ */
  function injectChrome() {
    if (doc.getElementById('tcChrome') || !doc.body) return;

    var homeUrl = resolveHomeUrl();
    var theme = currentTheme();

    var wrap = doc.createElement('div');
    wrap.id = 'tcChrome';

    // 返回主页胶囊
    var home = doc.createElement('a');
    home.id = 'tcHome';
    home.className = 'tc-fab';
    home.href = homeUrl;
    home.setAttribute('aria-label', '返回全部工具');
    home.setAttribute('title', '返回全部工具');
    home.innerHTML = SVG_BACK + '<span class="tc-label">全部工具</span>';

    // 主题切换圆钮
    var themeBtn = doc.createElement('button');
    themeBtn.id = 'tcThemeBtn';
    themeBtn.className = 'tc-fab';
    themeBtn.type = 'button';
    themeBtn.setAttribute('aria-label', theme === 'light' ? '切换到暗色主题' : '切换到亮色主题');
    themeBtn.setAttribute('title', theme === 'light' ? '切换到暗色主题' : '切换到亮色主题');
    themeBtn.innerHTML = SVG_MOON + SVG_SUN;
    themeBtn.addEventListener('click', function () {
      applyTheme(currentTheme() === 'light' ? 'dark' : 'light');
    });

    wrap.appendChild(home);
    wrap.appendChild(themeBtn);
    doc.body.appendChild(wrap);

    // 通知扩展钩子
    if (window.ToolChrome && window.ToolChrome.onReady) {
      window.ToolChrome.onReady({ homeUrl: homeUrl });
    }
  }

  /* --------------------------------------------------------
   * 6. Service Worker 注册
   * ------------------------------------------------------ */
  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    // 使用 IIFE 顶层捕获的 _currentScript，DOMContentLoaded 时 currentScript 已是 null
    if (!_currentScript || !_currentScript.src) return;
    var swSrc = _currentScript.src;
    window.addEventListener('load', function () {
      try {
        var swUrl = new URL('../../sw.js', swSrc).href;
        navigator.serviceWorker.register(swUrl).catch(function () {});
      } catch (e) {}
    });
  }

  /* --------------------------------------------------------
   * 7. 暴露全局扩展钩子  window.ToolChrome
   *
   * 使用方式（在 tool-chrome.js 引入之前设置）：
   *   <script>
   *     window.ToolChrome = {
   *       homeUrl: '/custom/index.html',   // 覆盖主页路径
   *       onReady: function(ctx) { ... },  // FAB 注入完成后触发
   *       onThemeChange: function(theme) { ... }, // 主题切换时触发
   *     };
   *   </script>
   *   <script src="tool-chrome.js"></script>
   * ------------------------------------------------------ */
  window.ToolChrome = Object.assign(
    {
      version: '2.0',
      getTheme: currentTheme,
      setTheme: applyTheme
    },
    window.ToolChrome || {}
  );

  /* --------------------------------------------------------
   * 启动
   * ------------------------------------------------------ */
  function start() {
    injectFallbackCSS();
    injectChrome();
    registerSW();
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
