/*
 * 首页“最近使用”控制器。
 *
 * 最近访问记录由 tool-chrome.js 在各工具页写入 localStorage；本文件只在首页按需加载，
 * 负责补齐“最近”分类按钮、过滤、排序和空状态，不修改 1000+ 个工具页面。
 */
(function () {
  'use strict';

  var RECENTS_KEY = 'html_tools_recents_v1';
  var MAX_RECENTS = 20;
  var CATEGORY_PARAM = 'category';

  var categories = document.getElementById('categories');
  var toolsGrid = document.getElementById('tools-grid');
  var searchInput = document.getElementById('search');
  var noResults = document.getElementById('no-results');
  var searchResultsCount = document.getElementById('search-results-count');

  if (!categories || !toolsGrid || !searchInput || !noResults) return;

  function readRecents() {
    try {
      var stored = localStorage.getItem(RECENTS_KEY);
      var parsed = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(parsed)) return [];

      return parsed
        .filter(function (item) {
          return typeof item === 'string' && item.indexOf('tools/') === 0;
        })
        .slice(0, MAX_RECENTS);
    } catch (error) {
      return [];
    }
  }

  function toolPathFromUrl(value) {
    if (!value) return null;

    try {
      var pathname = decodeURIComponent(new URL(value, window.location.href).pathname);
      var marker = '/tools/';
      var markerIndex = pathname.lastIndexOf(marker);
      if (markerIndex < 0) return null;

      var toolPath = 'tools/' + pathname.slice(markerIndex + marker.length).replace(/^\/+/, '');
      if (!toolPath || /\/$/.test(toolPath)) return null;
      if (!/\.[a-z0-9]+$/i.test(toolPath)) toolPath += '.html';
      return toolPath;
    } catch (error) {
      return null;
    }
  }

  function currentUrlCategory() {
    try {
      return new URL(window.location.href).searchParams.get(CATEGORY_PARAM);
    } catch (error) {
      return null;
    }
  }

  function updateRecentUrl() {
    try {
      var url = new URL(window.location.href);
      url.hash = '';
      url.searchParams.set(CATEGORY_PARAM, 'recent');
      if (url.href !== window.location.href) {
        history.pushState({ category: 'recent' }, '', url);
      }
    } catch (error) {}
  }

  function cardMatchesQuery(card, query) {
    if (!query) return true;

    var normalizedQuery = query.toLowerCase().replace(/\s+/g, '');
    var title = card.querySelector('h3');
    var text = [title ? title.textContent : '', card.textContent || '', card.dataset.keywords || '']
      .join(' ')
      .toLowerCase();

    if (text.includes(query) || text.replace(/\s+/g, '').includes(normalizedQuery)) {
      return true;
    }

    if (window.pinyinPro && window.pinyinPro.pinyin) {
      try {
        var pinyin = window.pinyinPro
          .pinyin(text, { toneType: 'none' })
          .replace(/\s+/g, '')
          .toLowerCase();
        return pinyin.includes(normalizedQuery);
      } catch (error) {}
    }

    return false;
  }

  function createRecentButton() {
    var existing = categories.querySelector('.category-btn[data-category="recent"]');
    if (existing) return existing;

    var button = document.createElement('button');
    button.className = 'category-btn';
    button.type = 'button';
    button.dataset.category = 'recent';

    var icon = document.createElement('span');
    icon.className = 'cat-icon';
    icon.textContent = '🕐';

    var label = document.createElement('span');
    label.textContent = '最近';

    var count = document.createElement('span');
    count.className = 'cat-count';
    count.hidden = true;

    button.appendChild(icon);
    button.appendChild(label);
    button.appendChild(count);

    var favoriteButton = categories.querySelector('.category-btn[data-category="favorites"]');
    if (favoriteButton && favoriteButton.nextSibling) {
      categories.insertBefore(button, favoriteButton.nextSibling);
    } else if (favoriteButton) {
      categories.appendChild(button);
    } else {
      categories.insertBefore(button, categories.firstChild);
    }

    return button;
  }

  var recentButton = createRecentButton();
  var recentMode = currentUrlCategory() === 'recent';

  function updateButtonCount(validCount) {
    var count = recentButton.querySelector('.cat-count');
    if (!count) return;

    count.textContent = String(validCount);
    count.hidden = validCount === 0;
  }

  function updateEmptyState(visibleCount, query) {
    var icon = noResults.querySelector('.no-results-icon');
    var text = noResults.querySelector('p');

    if (visibleCount === 0) {
      if (icon) icon.textContent = query ? '∅' : '🕐';
      if (text) text.textContent = query ? '最近使用中没有匹配的工具' : '还没有最近使用的工具';
      noResults.classList.add('show');
    } else {
      noResults.classList.remove('show');
    }

    if (searchResultsCount) {
      searchResultsCount.textContent = visibleCount > 0 ? '找到 ' + visibleCount + ' 个工具' : '';
    }
  }

  function applyRecentFilter() {
    if (!recentMode) return;

    var recents = readRecents();
    var rank = new Map();
    recents.forEach(function (path, index) {
      if (!rank.has(path)) rank.set(path, index);
    });

    var query = searchInput.value.toLowerCase().trim();
    var cards = Array.prototype.slice.call(toolsGrid.querySelectorAll('.tool-card'));
    var visibleCards = [];
    var validRecentPaths = new Set();

    cards.forEach(function (card) {
      var path = toolPathFromUrl(card.getAttribute('href') || card.href);
      var isRecent = path && rank.has(path);
      if (isRecent) validRecentPaths.add(path);

      var visible = isRecent && cardMatchesQuery(card, query);
      card.classList.toggle('hidden', !visible);
      if (visible) visibleCards.push({ card: card, path: path });
    });

    visibleCards
      .sort(function (a, b) {
        return rank.get(a.path) - rank.get(b.path);
      })
      .forEach(function (entry) {
        toolsGrid.appendChild(entry.card);
      });

    categories.querySelectorAll('.category-btn').forEach(function (button) {
      button.classList.toggle('active', button === recentButton);
    });

    updateButtonCount(validRecentPaths.size);
    updateEmptyState(visibleCards.length, query);
  }

  recentButton.addEventListener('click', function () {
    recentMode = true;
    updateRecentUrl();
    applyRecentFilter();
  });

  // 普通分类按钮仍由 main.js 处理；这里仅退出最近模式，避免干扰原有过滤逻辑。
  categories.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('.category-btn');
    if (button && button !== recentButton) recentMode = false;
  });

  // main.js 的搜索监听先执行，本监听随后将结果重新约束到最近访问集合。
  searchInput.addEventListener('input', function () {
    if (recentMode) applyRecentFilter();
  });

  window.addEventListener('popstate', function () {
    recentMode = currentUrlCategory() === 'recent';
    if (recentMode) requestAnimationFrame(applyRecentFilter);
  });

  window.addEventListener('storage', function (event) {
    if (event.key === RECENTS_KEY && recentMode) applyRecentFilter();
  });

  if (recentMode) requestAnimationFrame(applyRecentFilter);

  // 新增按钮后重新触发分类溢出检测。
  try {
    window.dispatchEvent(new Event('resize'));
  } catch (error) {}
})();
