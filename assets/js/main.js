// ==================== DOM 元素 ====================
const searchInput = document.getElementById('search');
const toolsGrid = document.getElementById('tools-grid');
const categoriesContainer = document.getElementById('categories');
const noResults = document.getElementById('no-results');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const htmlElement = document.documentElement;
const searchResultsCount = document.getElementById('search-results-count');

let currentCategory = 'all';
let toolCards = [];
let toolRenderOrder = [];

const CATEGORY_PARAM = 'category';

function isKnownCategory(category) {
  return CATEGORIES.some((cat) => cat.id === category);
}

function getCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get(CATEGORY_PARAM);
  if (category && isKnownCategory(category)) {
    return category;
  }

  const hashCategory = window.location.hash.slice(1);
  if (hashCategory && isKnownCategory(hashCategory)) {
    return hashCategory;
  }

  return 'all';
}

function updateCategoryUrl(category) {
  const url = new URL(window.location.href);
  const hashCategory = url.hash.slice(1);
  if (hashCategory && isKnownCategory(hashCategory)) {
    url.hash = '';
  }

  if (category === 'all') {
    url.searchParams.delete(CATEGORY_PARAM);
  } else {
    url.searchParams.set(CATEGORY_PARAM, category);
  }

  if (url.href !== window.location.href) {
    history.pushState({ category }, '', url);
  }
}

function setCategory(category, options = {}) {
  const selectedCategory = isKnownCategory(category) ? category : 'all';
  const selectedButton = categoriesContainer.querySelector(
    '.category-btn[data-category="' + selectedCategory + '"]'
  );
  currentCategory = selectedButton ? selectedCategory : 'all';
  document.querySelectorAll('.category-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.category === currentCategory);
  });
  if (options.updateUrl) {
    updateCategoryUrl(currentCategory);
  }
  filterTools();
}

// ==================== 主题管理 ====================
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
  htmlElement.setAttribute('data-theme', 'light');
  themeIcon.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  if (newTheme === 'light') {
    htmlElement.setAttribute('data-theme', 'light');
    themeIcon.textContent = '☀️';
  } else {
    htmlElement.removeAttribute('data-theme');
    themeIcon.textContent = '🌙';
  }
  localStorage.setItem('theme', newTheme);
});

// ==================== 收藏管理 ====================
const FAVORITES_KEY = 'html_tools_favorites_v1';
let favorites = [];

try {
  const stored = localStorage.getItem(FAVORITES_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    favorites = Array.isArray(parsed) ? parsed : [];
  }
} catch (e) {
  console.warn('Could not load favorites:', e);
  favorites = [];
}

function saveFavorites() {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.warn('Could not save favorites:', e);
  }
}

function isFavorite(url) {
  return favorites.includes(url);
}

function updateToolRenderOrder() {
  toolRenderOrder = TOOLS.map((_, index) => index).sort((a, b) => {
    const aFavorite = isFavorite(TOOLS[a].url);
    const bFavorite = isFavorite(TOOLS[b].url);
    if (aFavorite !== bFavorite) {
      return aFavorite ? -1 : 1;
    }
    return a - b;
  });
}

function refreshToolsAfterFavoriteChange() {
  updateToolRenderOrder();
  renderTools();
  if (searchInput.value.trim() || currentCategory !== 'all') {
    filterTools();
  }
}

function toggleFavorite(url, btn, event) {
  event.preventDefault();
  event.stopPropagation();

  const index = favorites.indexOf(url);
  if (index > -1) {
    favorites.splice(index, 1);
    btn.classList.remove('active');
    btn.textContent = '☆';
  } else {
    favorites.push(url);
    btn.classList.add('active');
    btn.textContent = '★';
  }
  saveFavorites();
  refreshToolsAfterFavoriteChange();
}

// ==================== 渲染分类按钮 ====================
function renderCategories() {
  const categoryCounts = {};
  TOOLS.forEach((tool) => {
    categoryCounts[tool.category] = (categoryCounts[tool.category] || 0) + 1;
  });

  const activeCategories = CATEGORIES.filter(
    (cat) => cat.id === 'all' || cat.id === 'favorites' || categoryCounts[cat.id]
  );

  if (!activeCategories.some((cat) => cat.id === currentCategory)) {
    currentCategory = 'all';
  }

  // Update stats
  document.getElementById('tool-count').textContent = TOOLS.length;
  document.getElementById('category-count').textContent = activeCategories.length - 2; // Exclude 'all' and 'favorites'

  activeCategories.forEach((cat) => {
    const btn = document.createElement('button');
    btn.className = 'category-btn' + (cat.id === currentCategory ? ' active' : '');
    btn.dataset.category = cat.id;

    const icon = document.createElement('span');
    icon.className = 'cat-icon';
    icon.textContent = cat.icon;
    btn.appendChild(icon);

    const span = document.createElement('span');
    span.textContent = cat.name;
    btn.appendChild(span);

    if (cat.id !== 'all' && cat.id !== 'favorites' && categoryCounts[cat.id]) {
      const count = document.createElement('span');
      count.className = 'cat-count';
      count.textContent = categoryCounts[cat.id];
      btn.appendChild(count);
    }

    btn.addEventListener('click', () => {
      setCategory(cat.id, { updateUrl: true });
    });
    categoriesContainer.appendChild(btn);
  });
}

// ==================== 渲染工具卡片 (优化版：懒加载 + 分批渲染) ====================
const BATCH_SIZE = 30; // 每批渲染数量（减少以提升性能）
const INITIAL_LOAD = 60; // 首屏加载数量
let renderedCount = 0;
let isRendering = false;
let lazyLoadObserver = null;

function createToolCard(tool, index) {
  const card = document.createElement('a');
  card.href = tool.url;
  card.className = 'tool-card';
  card.dataset.category = tool.category;
  card.dataset.keywords = tool.keywords;
  card.dataset.index = index; // 存储原始TOOLS索引，用于搜索排序后保持正确关联
  // 只对前20个卡片添加动画延迟
  if (index < 20) {
    card.style.animationDelay = index * 0.02 + 's';
  }

  const header = document.createElement('div');
  header.className = 'tool-card-header';

  const titleGroup = document.createElement('div');
  titleGroup.className = 'tool-title-group';

  const iconDiv = document.createElement('div');
  iconDiv.className = 'tool-icon';
  iconDiv.textContent = tool.icon;

  const h3 = document.createElement('h3');
  h3.textContent = tool.name;

  titleGroup.appendChild(iconDiv);
  titleGroup.appendChild(h3);

  const favBtn = document.createElement('button');
  favBtn.className = 'favorite-btn' + (isFavorite(tool.url) ? ' active' : '');
  favBtn.type = 'button';
  favBtn.setAttribute('aria-label', '收藏');
  favBtn.tabIndex = 0;
  favBtn.textContent = isFavorite(tool.url) ? '★' : '☆';
  favBtn.addEventListener('click', (e) => toggleFavorite(tool.url, favBtn, e));
  favBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(tool.url, favBtn, e);
    }
  });

  header.appendChild(titleGroup);
  header.appendChild(favBtn);

  const desc = document.createElement('p');
  desc.textContent = tool.desc;

  const footer = document.createElement('div');
  footer.className = 'tool-card-footer';

  const tag = document.createElement('span');
  tag.className = 'tool-tag';
  tag.textContent = tool.category;

  const arrow = document.createElement('span');
  arrow.className = 'tool-arrow';
  arrow.textContent = '→';

  footer.appendChild(tag);
  footer.appendChild(arrow);

  card.appendChild(header);
  card.appendChild(desc);
  card.appendChild(footer);

  return card;
}

// 创建懒加载观察器
function setupLazyLoading() {
  if ('IntersectionObserver' in window) {
    lazyLoadObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && renderedCount < TOOLS.length && !isRendering) {
            renderBatch();
          }
        });
      },
      {
        rootMargin: '200px' // 提前 200px 开始加载
      }
    );
  }
}

function renderBatch() {
  if (isRendering) return;
  isRendering = true;

  const fragment = document.createDocumentFragment();
  const end = Math.min(renderedCount + BATCH_SIZE, TOOLS.length);

  for (let i = renderedCount; i < end; i++) {
    const toolIndex = toolRenderOrder[i];
    fragment.appendChild(createToolCard(TOOLS[toolIndex], toolIndex));
  }

  toolsGrid.appendChild(fragment);
  renderedCount = end;

  // 如果还有更多内容，创建一个加载触发器
  if (renderedCount < TOOLS.length) {
    let loadTrigger = document.getElementById('load-trigger');
    if (!loadTrigger) {
      loadTrigger = document.createElement('div');
      loadTrigger.id = 'load-trigger';
      loadTrigger.style.height = '1px';
      loadTrigger.style.margin = '0';
      toolsGrid.appendChild(loadTrigger);
    }

    if (lazyLoadObserver) {
      lazyLoadObserver.observe(loadTrigger);
    }
  } else {
    // 渲染完成，清理触发器
    const loadTrigger = document.getElementById('load-trigger');
    if (loadTrigger) {
      loadTrigger.remove();
    }
    // 更新卡片引用
    toolCards = document.querySelectorAll('.tool-card');
  }

  isRendering = false;
}

function renderTools() {
  renderedCount = 0;
  toolsGrid.innerHTML = ''; // 清空现有内容

  // 首屏快速加载
  const fragment = document.createDocumentFragment();
  const initialEnd = Math.min(INITIAL_LOAD, TOOLS.length);

  for (let i = 0; i < initialEnd; i++) {
    const toolIndex = toolRenderOrder[i];
    fragment.appendChild(createToolCard(TOOLS[toolIndex], toolIndex));
  }

  toolsGrid.appendChild(fragment);
  renderedCount = initialEnd;

  // 如果还有更多，设置懒加载
  if (renderedCount < TOOLS.length) {
    let loadTrigger = document.getElementById('load-trigger');
    if (!loadTrigger) {
      loadTrigger = document.createElement('div');
      loadTrigger.id = 'load-trigger';
      loadTrigger.style.height = '1px';
      loadTrigger.style.margin = '0';
      toolsGrid.appendChild(loadTrigger);
    }

    if (lazyLoadObserver) {
      lazyLoadObserver.observe(loadTrigger);
    }
  }

  // 立即更新卡片引用（用于过滤）
  toolCards = document.querySelectorAll('.tool-card');
}

// ==================== 增强搜索功能 ====================

// 同义词/翻译对照表 (精简版，只保留最常用的映射)
const SYNONYMS = {
  // 格式化
  format: ['格式化', 'beautify', 'pretty'],
  格式化: ['format', 'beautify', 'pretty'],
  // 压缩
  compress: ['压缩', 'minify'],
  压缩: ['compress', 'minify'],
  // 转换
  convert: ['转换', 'transform'],
  转换: ['convert', 'transform'],
  // 编码/解码
  encode: ['编码', '加密'],
  decode: ['解码', '解密'],
  编码: ['encode'],
  解码: ['decode'],
  // 生成
  generate: ['生成', 'create'],
  生成: ['generate', 'create'],
  // 计算
  calc: ['计算', 'calculate'],
  计算: ['calc', 'calculate'],
  // 颜色
  color: ['颜色', 'colour'],
  颜色: ['color', 'colour'],
  // 图片
  image: ['图片', 'img'],
  图片: ['image', 'img'],
  // 时间
  time: ['时间', 'timestamp'],
  时间: ['time', 'timestamp'],
  // 正则
  regex: ['正则', 'regexp'],
  正则: ['regex', 'regexp'],
  // 二维码
  qr: ['二维码', 'qrcode'],
  二维码: ['qr', 'qrcode']
};

// 获取中文拼音 - 使用 pinyin-pro 库
function getPinyin(str) {
  // 检查 pinyin-pro 是否已加载
  if (typeof pinyinPro !== 'undefined' && pinyinPro.pinyin) {
    return pinyinPro.pinyin(str, { toneType: 'none' }).replace(/\s+/g, '').toLowerCase();
  }
  // 降级：直接返回原字符串
  return str.toLowerCase();
}

// 获取首字母 - 使用 pinyin-pro 库
function getInitials(str) {
  let initials = '';
  const words = str.split(/[\s\-_]+/);

  for (const word of words) {
    if (!word) continue;

    // 检查是否是纯英文单词
    const isAllEnglish = /^[a-zA-Z]+$/.test(word);
    // 检查是否是全大写的英文缩写（如 JSON、CSS、HTML）
    const isAllUpperCase = isAllEnglish && word === word.toUpperCase();

    if (isAllUpperCase) {
      // 全大写英文缩写只取第一个字母
      initials += word[0].toLowerCase();
    } else if (isAllEnglish) {
      // 普通英文单词：取首字母，驼峰命名取每个大写字母
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        if (i === 0 || char === char.toUpperCase()) {
          initials += char.toLowerCase();
        }
      }
    } else {
      // 包含中文的混合内容：使用 pinyin-pro 获取首字母
      if (typeof pinyinPro !== 'undefined' && pinyinPro.pinyin) {
        initials += pinyinPro
          .pinyin(word, { pattern: 'first', toneType: 'none' })
          .replace(/\s+/g, '')
          .toLowerCase();
      } else {
        // 降级：只取英文字母
        for (const char of word) {
          if (/[a-zA-Z]/.test(char)) {
            initials += char.toLowerCase();
          }
        }
      }
    }
  }
  return initials;
}

// 扩展查询词（同义词）
function expandQuery(query) {
  const q = query.toLowerCase();
  const expanded = new Set([q]);

  // 直接同义词
  if (SYNONYMS[q]) {
    SYNONYMS[q].forEach((s) => expanded.add(s.toLowerCase()));
  }

  // 检查是否是同义词的一部分
  for (const [key, values] of Object.entries(SYNONYMS)) {
    if (key.toLowerCase().includes(q) || q.includes(key.toLowerCase())) {
      expanded.add(key.toLowerCase());
      values.forEach((v) => expanded.add(v.toLowerCase()));
    }
  }

  return Array.from(expanded);
}

// 容错匹配（允许跳过字符或忽略重复）
function fuzzyMatchWithTolerance(text, query) {
  text = text.toLowerCase();
  query = query.toLowerCase();

  // 去除连续重复字符 (jsoon -> json)
  const normalizedQuery = query.replace(/(.)\1+/g, '$1');

  if (text.includes(normalizedQuery)) {
    return { matched: true, score: 15 };
  }

  // 允许跳过1个字符的模糊匹配
  let ti = 0,
    qi = 0,
    skipped = 0;
  while (ti < text.length && qi < query.length) {
    if (text[ti] === query[qi]) {
      ti++;
      qi++;
    } else {
      ti++;
      // 只有在还没匹配到第一个字符时才允许跳过
      if (qi > 0) {
        skipped++;
        if (skipped > 1) break;
      }
    }
  }

  if (qi === query.length) {
    return { matched: true, score: 10 - skipped * 2 };
  }

  return { matched: false, score: 0 };
}

// ==================== 搜索匹配评分函数 ====================
function getSearchScore(tool, query) {
  const name = tool.name.toLowerCase();
  const desc = tool.desc.toLowerCase();
  const keywords = tool.keywords.toLowerCase();
  const q = query.toLowerCase();

  // 预计算拼音和首字母（用于拼音搜索和首字母搜索）
  // 去掉空格便于匹配
  const namePinyin = getPinyin(tool.name).replace(/\s+/g, '');
  const nameInitials = getInitials(tool.name);
  const keywordsPinyin = getPinyin(tool.keywords).replace(/\s+/g, '');
  // 去掉空格的关键词（用于连续字符搜索，如"新年倒计时"匹配"新年 倒计时"）
  const keywordsNoSpace = keywords.replace(/\s+/g, '');

  let score = 0;

  // ===== 1. 原始查询匹配 =====
  // 完全匹配名称 - 最高分
  if (name === q) return 1000;

  // 名称开头匹配 - 高分
  if (name.startsWith(q)) score += 100;

  // 名称包含完整词 - 较高分
  if (name.includes(q)) score += 50;

  // 关键词匹配（包括去掉空格后的匹配）
  if (keywords.includes(q) || keywordsNoSpace.includes(q)) score += 30;

  // 描述匹配
  if (desc.includes(q)) score += 20;

  // ===== 2. 拼音搜索 =====
  if (score === 0) {
    // 拼音完全匹配
    if (namePinyin === q) score += 80;
    // 拼音开头匹配
    else if (namePinyin.startsWith(q)) score += 60;
    // 拼音包含
    else if (namePinyin.includes(q)) score += 40;
    // 关键词拼音匹配
    else if (keywordsPinyin.includes(q)) score += 25;
  }

  // ===== 3. 首字母搜索 =====
  if (score === 0) {
    // 首字母完全匹配
    if (nameInitials === q) score += 70;
    // 首字母开头匹配
    else if (nameInitials.startsWith(q)) score += 55;
    // 首字母包含
    else if (nameInitials.includes(q)) score += 35;
  }

  // ===== 4. 同义词搜索 =====
  if (score === 0) {
    const expandedQueries = expandQuery(q);
    for (const eq of expandedQueries) {
      if (eq === q) continue; // 跳过原始查询
      if (name.includes(eq)) {
        score += 45;
        break;
      }
      if (keywords.includes(eq)) {
        score += 28;
        break;
      }
      if (desc.includes(eq)) {
        score += 18;
        break;
      }
    }
  }

  // ===== 5. 容错匹配 =====
  if (score === 0) {
    // 在名称中容错匹配
    const nameResult = fuzzyMatchWithTolerance(name, q);
    if (nameResult.matched) {
      score += nameResult.score;
    } else {
      // 在拼音中容错匹配
      const pinyinResult = fuzzyMatchWithTolerance(namePinyin, q);
      if (pinyinResult.matched) {
        score += pinyinResult.score - 2;
      }
    }
  }

  // ===== 6. 原有模糊匹配：查询词中的每个字符按顺序出现 =====
  if (score === 0) {
    let fuzzyScore = 0;
    let nameIdx = -1;
    let kwIdx = -1;
    let matched = true;

    for (const char of q) {
      // 优先在名称中查找
      const foundInName = name.indexOf(char, nameIdx + 1);
      if (foundInName !== -1) {
        // 连续匹配加分
        if (foundInName === nameIdx + 1) fuzzyScore += 3;
        else fuzzyScore += 2;
        nameIdx = foundInName;
      } else {
        // 在关键词中尝试模糊匹配
        const foundInKw = keywords.indexOf(char, kwIdx + 1);
        if (foundInKw !== -1) {
          fuzzyScore += 1;
          kwIdx = foundInKw;
        } else {
          matched = false;
          break;
        }
      }
    }

    if (matched) score = fuzzyScore;
  }

  return score;
}

// ==================== 过滤工具 ====================
function filterTools() {
  // 每次过滤前强制加载所有工具卡片
  if (renderedCount < TOOLS.length) {
    // 一次性渲染所有剩余工具
    const fragment = document.createDocumentFragment();
    for (let i = renderedCount; i < TOOLS.length; i++) {
      const toolIndex = toolRenderOrder[i];
      fragment.appendChild(createToolCard(TOOLS[toolIndex], toolIndex));
    }
    toolsGrid.appendChild(fragment);
    renderedCount = TOOLS.length;
    // 移除懒加载触发器
    const loadTrigger = document.getElementById('load-trigger');
    if (loadTrigger) loadTrigger.remove();
  }

  // 每次过滤时重新获取卡片引用，确保索引同步
  toolCards = document.querySelectorAll('.tool-card');

  const query = searchInput.value.toLowerCase().trim();
  let visibleCount = 0;

  // 计算搜索评分并排序
  const toolsWithScores = [];

  toolCards.forEach((card) => {
    // 使用存储的原始索引而不是DOM迭代索引，避免排序后索引错乱
    const toolIndex = parseInt(card.dataset.index, 10);
    const tool = TOOLS[toolIndex];
    const matchesCategory =
      currentCategory === 'all' ||
      (currentCategory === 'favorites' && isFavorite(tool.url)) ||
      tool.category === currentCategory;

    let matchesSearch = !query;
    let searchScore = 0;

    if (query && matchesCategory) {
      searchScore = getSearchScore(tool, query);
      matchesSearch = searchScore > 0;
    }

    if (matchesCategory && matchesSearch) {
      card.classList.remove('hidden');
      visibleCount++;
      if (query) {
        toolsWithScores.push({
          card,
          score: searchScore,
          toolIndex,
          isFav: isFavorite(tool.url)
        });
      }
    } else {
      card.classList.add('hidden');
    }
  });

  // 如果有搜索词，按评分重新排序卡片
  if (query && toolsWithScores.length > 0) {
    toolsWithScores.sort((a, b) => {
      if (a.isFav !== b.isFav) {
        return a.isFav ? -1 : 1;
      }
      if (a.score !== b.score) {
        return b.score - a.score;
      }
      return a.toolIndex - b.toolIndex;
    });
    toolsWithScores.forEach(({ card }) => {
      toolsGrid.appendChild(card);
    });
  }

  const noResultsIcon = noResults.querySelector('.no-results-icon');
  const noResultsText = noResults.querySelector('p');

  if (visibleCount === 0) {
    if (currentCategory === 'favorites' && !query) {
      noResultsIcon.textContent = '⭐';
      noResultsText.textContent = '还没有收藏的工具';
    } else {
      noResultsIcon.textContent = '∅';
      noResultsText.textContent = '没有找到匹配的工具';
    }
    noResults.classList.add('show');
  } else {
    noResults.classList.remove('show');
  }

  if (query || currentCategory !== 'all') {
    searchResultsCount.textContent = visibleCount > 0 ? '找到 ' + visibleCount + ' 个工具' : '';
  } else {
    searchResultsCount.textContent = '';
  }
}

// ==================== 事件绑定 ====================
searchInput.addEventListener('input', filterTools);

window.addEventListener('popstate', () => {
  setCategory(getCategoryFromUrl());
});

document.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
  }
  if (e.key === 'Escape' && document.activeElement === searchInput) {
    searchInput.blur();
  }
});

// ==================== 分类展开/收起 ====================
function setupCategoriesExpand() {
  const wrapper = document.getElementById('categories-wrapper');
  const categories = document.getElementById('categories');
  const expandBtn = document.getElementById('categories-expand-btn');
  const expandBtnDesktop = document.getElementById('categories-expand-btn-desktop');
  if (!wrapper || !categories) return;

  // 桌面端展开按钮
  if (expandBtnDesktop) {
    expandBtnDesktop.addEventListener('click', () => {
      const isExpanded = wrapper.classList.toggle('expanded');
      expandBtnDesktop.querySelector('.expand-text').textContent = isExpanded
        ? '收起分类'
        : '更多分类';
    });
  }

  // 移动端展开按钮
  if (expandBtn) {
    const checkOverflow = () => {
      // 只在移动端检查
      if (window.innerWidth > 640) {
        expandBtn.style.display = 'none';
        // 移动端收起时不影响桌面端状态
        return;
      }

      // 如果已展开，保持按钮显示
      const isExpanded = wrapper.classList.contains('expanded');
      if (isExpanded) {
        expandBtn.style.display = 'flex';
        return;
      }

      // 检查是否溢出
      const isOverflowing = categories.scrollHeight > categories.clientHeight + 5;
      expandBtn.style.display = isOverflowing ? 'flex' : 'none';
    };

    expandBtn.addEventListener('click', () => {
      const isExpanded = wrapper.classList.toggle('expanded');
      expandBtn.querySelector('.expand-text').textContent = isExpanded ? '收起' : '更多分类';
      if (expandBtnDesktop) {
        expandBtnDesktop.querySelector('.expand-text').textContent = isExpanded
          ? '收起分类'
          : '更多分类';
      }
    });

    // 初始检查 + resize 监听
    setTimeout(checkOverflow, 100);
    window.addEventListener('resize', checkOverflow);
  }
}

// ==================== 初始化 ====================
currentCategory = getCategoryFromUrl();
updateToolRenderOrder();
setupLazyLoading();
renderCategories();
renderTools();
if (currentCategory !== 'all') {
  filterTools();
}
setupCategoriesExpand();
