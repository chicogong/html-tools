#!/usr/bin/env node
/**
 * 工具列表同步脚本
 * 
 * 从 tools.json 读取数据并同步到以下位置：
 * - index.html: CATEGORIES 数组、TOOLS 数组、SEO meta、统计数字
 * - README.md: 徽章、标题、工具列表标题
 * - GitHub 仓库描述
 * 
 * 用法: npm run sync:tools
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync, execFileSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const TOOLS_JSON = path.join(ROOT_DIR, 'tools.json');
const INDEX_HTML = path.join(ROOT_DIR, 'index.html');
const README_MD = path.join(ROOT_DIR, 'README.md');

// 优先显示的分类顺序（其他分类按 tools.json 中定义的顺序追加）
const PRIORITY_CATEGORIES = [
  'dev', 'text', 'time', 'generator', 'media', 'privacy', 'security', 
  'network', 'calculator', 'converter', 'extractor', 'ai', 'life'
];

/**
 * 转义特殊字符（反斜杠和单引号）
 */
function escapeString(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/**
 * 生成单个工具的单行 JS 对象字符串
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
 * 优先分类在前，其他分类按 tools.json 定义顺序追加
 */
function getSortedCategories(categories) {
  const allCatIds = Object.keys(categories);
  const sorted = [];
  
  // 先添加优先分类
  for (const catId of PRIORITY_CATEGORIES) {
    if (categories[catId]) {
      sorted.push(catId);
    }
  }
  
  // 追加其他分类（保持 tools.json 中的顺序）
  for (const catId of allCatIds) {
    if (!sorted.includes(catId)) {
      sorted.push(catId);
    }
  }
  
  return sorted;
}

function main() {
  // 读取 tools.json
  if (!fs.existsSync(TOOLS_JSON)) {
    console.error('❌ tools.json not found');
    process.exit(1);
  }
  
  const toolsData = JSON.parse(fs.readFileSync(TOOLS_JSON, 'utf8'));
  const { categories, tools: toolsObj } = toolsData;
  
  // 将 tools 对象转换为数组
  const tools = Object.values(toolsObj);
  
  const toolCount = tools.length;
  const categoryCount = Object.keys(categories).length;
  const sortedCategories = getSortedCategories(categories);
  
  console.log(`📦 Found ${toolCount} tools in ${categoryCount} categories`);
  
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
    console.warn(`⚠️  Warning: Tools with undefined categories: ${undefinedCategories.join(', ')}`);
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
  
  // 生成 TOOLS 数组（按分类分组）
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
  
  // 更新 index.html
  updateIndexHtml(categoriesJs, toolsJs, toolCount, categoryCount);
  
  // 统计各分类数量
  const activeCategories = sortedCategories.filter(cat => groupedTools[cat] && groupedTools[cat].length > 0);
  console.log(`\n📊 Tools by category (${activeCategories.length} active):`);
  for (const cat of activeCategories) {
    const catInfo = categories[cat];
    const count = groupedTools[cat]?.length || 0;
    console.log(`   ${catInfo?.icon || '📦'} ${catInfo?.name || cat}: ${count}`);
  }
  
  // 更新 GitHub 仓库描述
  updateGitHubDescription(toolCount);
  
  // 更新 README.md
  updateReadme(toolCount, categoryCount);
}

/**
 * 更新 index.html
 */
function updateIndexHtml(categoriesJs, toolsJs, toolCount, categoryCount) {
  if (!fs.existsSync(INDEX_HTML)) {
    console.error('❌ index.html not found');
    process.exit(1);
  }
  
  let html = fs.readFileSync(INDEX_HTML, 'utf8');
  let updated = false;
  
  // 替换 CATEGORIES 数组
  const categoriesRegex = /const CATEGORIES = \[\s*[\s\S]*?\n\s*\];/;
  if (categoriesRegex.test(html)) {
    html = html.replace(categoriesRegex, () => categoriesJs);
    console.log('✅ Updated CATEGORIES array');
    updated = true;
  } else {
    console.error('❌ Could not find CATEGORIES array');
  }
  
  // 替换 TOOLS 数组
  const toolsRegex = /const TOOLS = \[\s*[\s\S]*?\n\s*\];/;
  if (toolsRegex.test(html)) {
    html = html.replace(toolsRegex, () => toolsJs);
    console.log('✅ Updated TOOLS array');
    updated = true;
  } else {
    console.error('❌ Could not find TOOLS array');
  }
  
  // 更新 SEO meta 中的工具数量
  html = html.replace(/(\d+)\+\s*个纯前端/g, `${toolCount}+ 个纯前端`);
  html = html.replace(/包含\s*\d+\+?\s*个工具/g, `包含 ${toolCount}+ 个工具`);
  
  // 更新 HTML 中的统计初始值 (tool-count 和 category-count)
  // 匹配: <span class="stat-number" id="tool-count">数字</span>
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
    console.log(`\n✅ Updated index.html with ${toolCount} tools, ${categoryCount} categories`);
  }
}

/**
 * 更新 GitHub 仓库描述
 */
function updateGitHubDescription(toolCount) {
  try {
    const result = execSync('gh repo view --json description -q .description', { 
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
      console.log(`✅ Updated GitHub repo description: ${toolCount}+ 纯前端在线工具集`);
    } else {
      console.log(`📋 GitHub repo description already up to date`);
    }
  } catch {
    console.log('⚠️  Could not update GitHub repo description (gh CLI not available or not authenticated)');
  }
}

/**
 * 更新 README.md
 */
function updateReadme(toolCount, categoryCount) {
  try {
    if (!fs.existsSync(README_MD)) {
      return;
    }
    
    let readme = fs.readFileSync(README_MD, 'utf8');
    const original = readme;
    
    // 更新 badge: Tools-164+-blue -> Tools-638+-blue
    readme = readme.replace(/Tools-\d+\+-/g, `Tools-${toolCount}+-`);
    
    // 更新标题: 🚀 164+ 纯前端 -> 🚀 638+ 纯前端
    // 也处理没有 emoji 的情况
    readme = readme.replace(/(🚀\s*)?\d+\+\s*纯前端/g, `🚀 ${toolCount}+ 纯前端`);
    
    // 更新工具列表标题: 工具列表 (164 个) -> 工具列表 (638 个)
    readme = readme.replace(/工具列表[^)]*\(\d+\s*个\)/g, `工具列表 (${toolCount} 个)`);
    readme = readme.replace(/#工具列表-\d+-个/g, `#工具列表-${toolCount}-个`);
    
    if (readme !== original) {
      fs.writeFileSync(README_MD, readme);
      console.log(`✅ Updated README.md: ${toolCount}+ tools`);
    } else {
      console.log(`📋 README.md already up to date`);
    }
  } catch (err) {
    console.log(`⚠️  Could not update README.md: ${err.message}`);
  }
}

main();
