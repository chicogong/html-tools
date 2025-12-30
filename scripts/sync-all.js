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

// 网站域名 (不带尾部斜杠)
const SITE_URL = 'https://tools.realtime-ai.chat';

// 优先显示的分类顺序
const PRIORITY_CATEGORIES = [
  'dev', 'text', 'time', 'generator', 'media', 'privacy', 'security', 
  'network', 'calculator', 'converter', 'extractor', 'ai', 'life'
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
  
  return `      { url: '${url}', category: '${category}', name: '${name}', desc: '${desc}', icon: '${icon}', keywords: '${keywords}' },`;
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
  const undefinedCategories = Object.keys(groupedTools).filter(cat => !categories[cat]);
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
      categoriesItems.push(`      { id: '${catId}', name: '${escapeString(cat.name)}', icon: '${icon}' },`);
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
    github: updateGitHubDescription(toolCount)
  };
  
  // 统计各分类数量
  const activeCategories = sortedCategories.filter(cat => groupedTools[cat] && groupedTools[cat].length > 0);
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
  
  // 更新 SEO meta 中的工具数量
  html = html.replace(/(\d+)\+\s*个纯前端/g, `${toolCount}+ 个纯前端`);
  html = html.replace(/包含\s*\d+\+?\s*个工具/g, `包含 ${toolCount}+ 个工具`);
  
  // 更新统计初始值
  html = html.replace(
    /(<span[^>]*id="tool-count"[^>]*>)\d+(<\/span>)/g,
    `$1${toolCount}$2`
  );
  html = html.replace(
    /(<span[^>]*id="category-count"[^>]*>)\d+(<\/span>)/g,
    `$1${categoryCount}$2`
  );
  
  if (updated) {
    fs.writeFileSync(INDEX_HTML, html);
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
    
    // 更新描述中的工具数量
    manifest = manifest.replace(/\d+\+?\s*个.*工具/g, `${toolCount}+ 个纯前端工具`);
    manifest = manifest.replace(/\d+\+\s*纯前端/g, `${toolCount}+ 纯前端`);
    
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
 * 更新 GitHub 仓库描述
 */
function updateGitHubDescription(toolCount) {
  try {
    const result = execFileSync('gh', ['repo', 'view', '--json', 'description', '-q', '.description'], { 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
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
