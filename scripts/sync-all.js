#!/usr/bin/env node
/**
 * 统一同步脚本
 *
 * 从 tools.json 同步到所有相关文件：
 * - index.html: CATEGORIES 数组、TOOLS 数组、SEO meta、统计数字
 * - README.md: 徽章、标题、工具数量
 * - sitemap.xml: 所有工具 URL
 * - manifest.json: 描述中的工具数量
 * - GitHub 仓库描述
 *
 * 用法: npm run sync
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const TOOLS_JSON = path.join(ROOT_DIR, 'tools.json');
const INDEX_HTML = path.join(ROOT_DIR, 'index.html');
const README_MD = path.join(ROOT_DIR, 'README.md');
const SITEMAP_XML = path.join(ROOT_DIR, 'sitemap.xml');
const MANIFEST_JSON = path.join(ROOT_DIR, 'manifest.json');
const LLMS_TXT = path.join(ROOT_DIR, 'llms.txt');
const EN_JSON = path.join(ROOT_DIR, 'i18n', 'en.json');
const ZH_JSON = path.join(ROOT_DIR, 'i18n', 'zh-CN.json');

// 网站域名 (不带尾部斜杠)
const SITE_URL = 'https://tools.realtime-ai.chat';

// 优先显示的分类顺序
const PRIORITY_CATEGORIES = [
  'dev',
  'text',
  'time',
  'generator',
  'media',
  'privacy',
  'security',
  'network',
  'calculator',
  'converter',
  'extractor',
  'ai',
  'life'
];

/**
 * 转义特殊字符
 */
function escapeString(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/**
 * 生成工具的 JS 对象字符串
 */
function toolToJsLine(tool) {
  const url = escapeString(tool.path);
  const category = escapeString(tool.category);
  const name = escapeString(tool.name);
  const desc = escapeString(tool.description || tool.name);
  const icon = escapeString(tool.icon || '🔧');
  const keywords = escapeString(tool.keywords || tool.name);
  const pop = Number.isFinite(tool.popularity) ? tool.popularity : 0;

  return `      { url: '${url}', category: '${category}', name: '${name}', desc: '${desc}', icon: '${icon}', keywords: '${keywords}', pop: ${pop} },`;
}

/**
 * 获取排序后的分类列表
 */
function getSortedCategories(categories) {
  const allCatIds = Object.keys(categories);
  const sorted = [];

  for (const catId of PRIORITY_CATEGORIES) {
    if (categories[catId]) {
      sorted.push(catId);
    }
  }

  for (const catId of allCatIds) {
    if (!sorted.includes(catId)) {
      sorted.push(catId);
    }
  }

  return sorted;
}

/**
 * 主函数
 */
function main() {
  console.log('🔄 开始同步...\n');

  // 读取 tools.json
  if (!fs.existsSync(TOOLS_JSON)) {
    console.error('❌ tools.json not found');
    process.exit(1);
  }

  const toolsData = JSON.parse(fs.readFileSync(TOOLS_JSON, 'utf8'));
  const { categories, tools: toolsObj } = toolsData;
  const tools = Object.values(toolsObj);

  const toolCount = tools.length;
  const categoryCount = Object.keys(categories).length;
  const sortedCategories = getSortedCategories(categories);

  console.log(`📦 数据源: ${toolCount} 工具, ${categoryCount} 分类\n`);

  // 按分类分组
  const groupedTools = {};
  for (const tool of tools) {
    if (!groupedTools[tool.category]) {
      groupedTools[tool.category] = [];
    }
    groupedTools[tool.category].push(tool);
  }

  // 检查未定义的分类
  const undefinedCategories = Object.keys(groupedTools).filter((cat) => !categories[cat]);
  if (undefinedCategories.length > 0) {
    console.warn(`⚠️  未定义的分类: ${undefinedCategories.join(', ')}`);
  }

  // 生成 CATEGORIES 数组
  const categoriesItems = [
    "      { id: 'all', name: '全部', icon: '🏠' },",
    "      { id: 'favorites', name: '收藏', icon: '⭐' },",
    "      { id: 'recent', name: '最近', icon: '🕐' },"
  ];

  for (const catId of sortedCategories) {
    const cat = categories[catId];
    if (cat && groupedTools[catId] && groupedTools[catId].length > 0) {
      const icon = escapeString(cat.icon || '📦');
      categoriesItems.push(
        `      { id: '${catId}', name: '${escapeString(cat.name)}', icon: '${icon}' },`
      );
    }
  }

  const categoriesJs = `const CATEGORIES = [\n${categoriesItems.join('\n')}\n    ];`;

  // 生成 TOOLS 数组
  const toolsLines = [];

  for (const catId of sortedCategories) {
    const catTools = groupedTools[catId];
    if (catTools && catTools.length > 0) {
      const catName = categories[catId]?.name || catId;
      toolsLines.push(`      // ${catName}`);

      for (const tool of catTools) {
        toolsLines.push(toolToJsLine(tool));
      }
    }
  }

  const toolsJs = `const TOOLS = [\n${toolsLines.join('\n')}\n    ];`;

  // 执行所有同步
  const results = {
    indexHtml: updateIndexHtml(categoriesJs, toolsJs, toolCount, categoryCount),
    readme: updateReadme(toolCount, categoryCount),
    sitemap: updateSitemap(tools, toolCount),
    manifest: updateManifest(toolCount),
    i18n: updateI18n(toolCount),
    llmsTxt: updateLlmsTxt(toolCount, categories, groupedTools, sortedCategories),
    github: updateGitHubDescription(toolCount)
  };

  // 统计各分类数量
  const activeCategories = sortedCategories.filter(
    (cat) => groupedTools[cat] && groupedTools[cat].length > 0
  );
  console.log(`\n📊 分类统计 (${activeCategories.length} 个活跃分类):`);
  for (const cat of activeCategories) {
    const catInfo = categories[cat];
    const count = groupedTools[cat]?.length || 0;
    console.log(`   ${catInfo?.icon || '📦'} ${catInfo?.name || cat}: ${count}`);
  }

  // 汇总结果
  console.log('\n' + '='.repeat(50));
  console.log('📋 同步结果汇总:');
  console.log(`   index.html:    ${results.indexHtml ? '✅ 已更新' : '⏭️  无变化'}`);
  console.log(`   README.md:     ${results.readme ? '✅ 已更新' : '⏭️  无变化'}`);
  console.log(`   sitemap.xml:   ${results.sitemap ? '✅ 已更新' : '⏭️  无变化'}`);
  console.log(`   manifest.json: ${results.manifest ? '✅ 已更新' : '⏭️  无变化'}`);
  console.log(`   i18n:          ${results.i18n ? '✅ 已更新' : '⏭️  无变化'}`);
  console.log(`   llms.txt:      ${results.llmsTxt ? '✅ 已更新' : '⏭️  无变化'}`);
  console.log(`   GitHub 描述:   ${results.github ? '✅ 已更新' : '⏭️  无变化'}`);
  console.log('='.repeat(50));
}

/**
 * 更新 index.html
 */
function updateIndexHtml(categoriesJs, toolsJs, toolCount, categoryCount) {
  if (!fs.existsSync(INDEX_HTML)) {
    console.error('❌ index.html not found');
    return false;
  }

  let html = fs.readFileSync(INDEX_HTML, 'utf8');
  let updated = false;

  // 替换 CATEGORIES 数组
  const categoriesRegex = /const CATEGORIES = \[\s*[\s\S]*?\n\s*\];/;
  if (categoriesRegex.test(html)) {
    html = html.replace(categoriesRegex, () => categoriesJs);
    updated = true;
  }

  // 替换 TOOLS 数组
  const toolsRegex = /const TOOLS = \[\s*[\s\S]*?\n\s*\];/;
  if (toolsRegex.test(html)) {
    html = html.replace(toolsRegex, () => toolsJs);
    updated = true;
  }

  // 更新 SEO meta / OG / Twitter / JSON-LD 中所有 "X+ 个 [修饰词] 工具(集)?" 表述
  // 覆盖：包含 1001+ 个实用工具 / 1001+ 个纯前端实用工具 / 1001+ 个纯前端开发者工具集 / 1001+ 个工具
  // 长修饰词放前以便 alternation 优先匹配
  html = html.replace(
    /\d+\+?\s*个(纯前端实用|纯前端开发者|纯前端|实用|开发者)?\s*工具(集)?/g,
    (_m, modifier, suffix) => `${toolCount}+ 个${modifier || ''}工具${suffix || ''}`
  );
  // 同步类别数（如 "等 35 个类别"、"覆盖 35 个类别"）
  html = html.replace(/\d+\s*个类别/g, `${categoryCount} 个类别`);

  // 更新统计初始值
  html = html.replace(/(<span[^>]*id="tool-count"[^>]*>)\d+(<\/span>)/g, `$1${toolCount}$2`);
  html = html.replace(
    /(<span[^>]*id="category-count"[^>]*>)\d+(<\/span>)/g,
    `$1${categoryCount}$2`
  );

  if (updated) {
    fs.writeFileSync(INDEX_HTML, html);
    // 运行 prettier 格式化，确保与项目代码风格一致
    try {
      execFileSync('npx', ['prettier', '--write', INDEX_HTML], {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
    } catch {
      // prettier 不可用时静默失败
    }
    console.log(`✅ index.html: ${toolCount} 工具, ${categoryCount} 分类`);
    return true;
  }

  console.log('⏭️  index.html: 无需更新');
  return false;
}

/**
 * 更新 README.md
 */
function updateReadme(toolCount, categoryCount) {
  try {
    if (!fs.existsSync(README_MD)) {
      return false;
    }

    let readme = fs.readFileSync(README_MD, 'utf8');
    const original = readme;

    // 更新 badge
    readme = readme.replace(/Tools-\d+\+-/g, `Tools-${toolCount}+-`);

    // 更新标题
    readme = readme.replace(/(🚀\s*)?\d+\+\s*纯前端/g, `🚀 ${toolCount}+ 纯前端`);

    // 更新工具列表标题
    readme = readme.replace(/工具列表[^)]*\(\d+\s*个\)/g, `工具列表 (${toolCount} 个)`);
    readme = readme.replace(/#工具列表-\d+-个/g, `#工具列表-${toolCount}-个`);

    // 更新正文中所有 "X+ 个 [修饰词] 工具(集)?" 表述（如 "查看全部 1001+ 个工具"）
    readme = readme.replace(
      /\d+\+?\s*个(纯前端实用|纯前端开发者|纯前端|实用|开发者)?\s*工具(集)?/g,
      (_m, modifier, suffix) => `${toolCount}+ 个${modifier || ''}工具${suffix || ''}`
    );

    if (readme !== original) {
      fs.writeFileSync(README_MD, readme);
      console.log(`✅ README.md: ${toolCount}+ 工具`);
      return true;
    }

    console.log('⏭️  README.md: 无需更新');
    return false;
  } catch (err) {
    console.log(`⚠️  README.md: ${err.message}`);
    return false;
  }
}

/**
 * 更新 sitemap.xml
 */
function updateSitemap(tools, toolCount) {
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 首页 -->
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

  // 添加每个工具页面
  for (const tool of tools) {
    xml += `
  <url>
    <loc>${SITE_URL}/${tool.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  xml += `
</urlset>
`;

  // 检查是否有变化
  if (fs.existsSync(SITEMAP_XML)) {
    const existing = fs.readFileSync(SITEMAP_XML, 'utf8');
    const existingCount = (existing.match(/<loc>/g) || []).length;

    if (existingCount === toolCount + 1) {
      console.log(`⏭️  sitemap.xml: 无需更新 (${existingCount} URLs)`);
      return false;
    }
  }

  fs.writeFileSync(SITEMAP_XML, xml);
  console.log(`✅ sitemap.xml: ${toolCount + 1} URLs`);
  return true;
}

/**
 * 更新 manifest.json
 */
function updateManifest(toolCount) {
  try {
    if (!fs.existsSync(MANIFEST_JSON)) {
      return false;
    }

    let manifest = fs.readFileSync(MANIFEST_JSON, 'utf8');
    const original = manifest;

    // 更新描述中的工具数量 (覆盖所有 "X+ 个 [修饰词] 工具(集)?" 表述)
    manifest = manifest.replace(
      /\d+\+?\s*个(纯前端实用|纯前端开发者|纯前端|实用|开发者)?\s*工具(集)?/g,
      (_m, modifier, suffix) => `${toolCount}+ 个${modifier || ''}工具${suffix || ''}`
    );

    if (manifest !== original) {
      fs.writeFileSync(MANIFEST_JSON, manifest);
      console.log(`✅ manifest.json: ${toolCount}+ 工具`);
      return true;
    }

    console.log('⏭️  manifest.json: 无需更新');
    return false;
  } catch (err) {
    console.log(`⚠️  manifest.json: ${err.message}`);
    return false;
  }
}

/**
 * 更新 i18n 翻译文件中的工具数
 *
 * en.json / zh-CN.json 的 subtitle 含 "N+ ..." 形式的工具数，
 * 这里只替换数字，保留各语言原有措辞。
 */
function updateI18n(toolCount) {
  let changed = false;
  for (const file of [EN_JSON, ZH_JSON]) {
    try {
      if (!fs.existsSync(file)) continue;
      const original = fs.readFileSync(file, 'utf8');
      const updated = original.replace(/("subtitle"\s*:\s*")\d+(\+)/, `$1${toolCount}$2`);
      if (updated !== original) {
        fs.writeFileSync(file, updated);
        changed = true;
      }
    } catch (err) {
      console.log(`⚠️  ${path.basename(file)}: ${err.message}`);
    }
  }
  console.log(changed ? `✅ i18n: ${toolCount}+ 工具` : '⏭️  i18n: 无需更新');
  return changed;
}

/**
 * 更新 llms.txt
 *
 * 内容由 tools.json 完整重生成：固定头部 + 每个分类取 popularity 最高的 N 个工具 + 固定尾部。
 * 不再手工维护内部链接，避免工具改名/移动后产生死链。
 */
function updateLlmsTxt(toolCount, categories, groupedTools, sortedCategories) {
  try {
    const TOP_PER_CATEGORY = 6;

    const header = `# WebUtils

> WebUtils 是一个纯前端开发者工具集，包含 ${toolCount}+ 个实用工具。每个工具都是独立的 HTML 文件，内联 CSS/JS，无需构建，可离线使用。所有数据处理都在浏览器端完成，不上传服务器，保护用户隐私。

WebUtils 提供开发者日常工作中常用的各类工具：JSON/YAML/XML 格式化与转换、Base64/URL/Unicode 编解码、时间戳与时区转换、二维码生成、图片压缩、正则表达式测试、哈希计算等。

技术特点：

- 单文件架构：每个工具是独立 HTML 文件
- 零构建：无需 npm、webpack，直接打开使用
- 可离线：下载到本地即可断网使用
- 隐私安全：所有数据处理在浏览器端完成
`;

    const sections = [];
    for (const catId of sortedCategories) {
      const catTools = groupedTools[catId];
      const catInfo = categories[catId];
      if (!catTools || catTools.length === 0 || !catInfo) continue;

      const top = [...catTools]
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, TOP_PER_CATEGORY);

      const lines = top.map((t) => {
        const desc = (t.description || t.name).replace(/\s+/g, ' ').trim();
        return `- [${t.name}](${SITE_URL}/${t.path}): ${desc}`;
      });

      sections.push(`## ${catInfo.name}\n\n${lines.join('\n')}`);
    }

    const footer = `## Optional

- [GitHub 仓库](https://github.com/chicogong/html-tools): 源代码、Issue 反馈、贡献指南
- [完整工具列表](${SITE_URL}/): 首页查看全部 ${toolCount}+ 工具
`;

    const txt = `${header}\n${sections.join('\n\n')}\n\n${footer}`;

    const existing = fs.existsSync(LLMS_TXT) ? fs.readFileSync(LLMS_TXT, 'utf8') : '';
    if (existing === txt) {
      console.log('⏭️  llms.txt: 无需更新');
      return false;
    }

    fs.writeFileSync(LLMS_TXT, txt);
    console.log(`✅ llms.txt: ${toolCount}+ 工具，${sections.length} 个分类`);
    return true;
  } catch (err) {
    console.log(`⚠️  llms.txt: ${err.message}`);
    return false;
  }
}

/**
 * 更新 GitHub 仓库描述
 */
function updateGitHubDescription(toolCount) {
  try {
    const result = execFileSync(
      'gh',
      ['repo', 'view', '--json', 'description', '-q', '.description'],
      {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      }
    );
    const currentDesc = result.trim();

    const newDesc = currentDesc.replace(/\d+\+\s*纯前端/, `${toolCount}+ 纯前端`);

    if (newDesc !== currentDesc) {
      execFileSync('gh', ['repo', 'edit', '--description', newDesc], {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      console.log(`✅ GitHub 描述: ${toolCount}+ 纯前端`);
      return true;
    }

    console.log('⏭️  GitHub 描述: 无需更新');
    return false;
  } catch {
    console.log('⚠️  GitHub 描述: gh CLI 不可用');
    return false;
  }
}

main();
