#!/usr/bin/env node
/**
 * 工具列表同步脚本
 * 读取 tools.json 并更新 index.html 中的 TOOLS 和 CATEGORIES 数组
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const TOOLS_JSON = path.join(ROOT_DIR, 'tools.json');
const INDEX_HTML = path.join(ROOT_DIR, 'index.html');

function main() {
  // 读取 tools.json
  if (!fs.existsSync(TOOLS_JSON)) {
    console.error('❌ tools.json not found');
    process.exit(1);
  }
  
  const toolsData = JSON.parse(fs.readFileSync(TOOLS_JSON, 'utf8'));
  const { categories, tools } = toolsData;
  
  console.log(`📦 Found ${tools.length} tools in tools.json`);
  
  // 生成 CATEGORIES 数组
  const categoryOrder = ['all', 'favorites', 'dev', 'text', 'time', 'generator', 'privacy', 'media', 'security', 'network', 'calculator', 'converter', 'extractor', 'ai'];
  
  const categoriesArray = categoryOrder.map(id => {
    if (id === 'all') return { id: 'all', name: '全部' };
    if (id === 'favorites') return { id: 'favorites', name: '⭐ 收藏' };
    const cat = categories[id];
    return cat ? { id, name: cat.name } : null;
  }).filter(Boolean);
  
  const categoriesJs = `const CATEGORIES = ${JSON.stringify(categoriesArray, null, 2).replace(/"([^"]+)":/g, '$1:').replace(/"/g, "'")};`;
  
  // 生成 TOOLS 数组
  const toolsArray = tools.map(tool => ({
    url: tool.path,
    category: tool.category,
    name: tool.name,
    desc: tool.description || tool.name,
    icon: tool.icon || '🔧',
    keywords: tool.keywords || tool.name
  }));
  
  const toolsJs = `const TOOLS = ${JSON.stringify(toolsArray, null, 2).replace(/"([^"]+)":/g, '$1:').replace(/"/g, "'")};`;
  
  // 读取 index.html
  if (!fs.existsSync(INDEX_HTML)) {
    console.error('❌ index.html not found');
    process.exit(1);
  }
  
  let indexHtml = fs.readFileSync(INDEX_HTML, 'utf8');
  
  // 替换 CATEGORIES 数组
  const categoriesRegex = /const CATEGORIES = \[[\s\S]*?\];/;
  if (categoriesRegex.test(indexHtml)) {
    indexHtml = indexHtml.replace(categoriesRegex, categoriesJs);
    console.log('✅ Updated CATEGORIES array');
  } else {
    console.error('❌ Could not find CATEGORIES array in index.html');
  }
  
  // 替换 TOOLS 数组
  const toolsRegex = /const TOOLS = \[[\s\S]*?\];(\s*\/\/ ={20,})/;
  if (toolsRegex.test(indexHtml)) {
    indexHtml = indexHtml.replace(toolsRegex, toolsJs + '\n\n    $1');
    console.log('✅ Updated TOOLS array');
  } else {
    console.error('❌ Could not find TOOLS array in index.html');
  }
  
  // 更新 SEO meta 标签中的工具数量
  const toolCount = tools.length;
  indexHtml = indexHtml.replace(/包含 \d+ 个/g, `包含 ${toolCount} 个`);
  indexHtml = indexHtml.replace(/\d+\+ 个纯前端/g, `${toolCount}+ 个纯前端`);
  indexHtml = indexHtml.replace(/包含 \d+\+ 个/g, `包含 ${toolCount}+ 个`);
  
  // 写入更新后的 index.html
  fs.writeFileSync(INDEX_HTML, indexHtml);
  
  console.log(`\n✅ Updated index.html with ${tools.length} tools`);
  
  // 统计各分类数量
  const groupedTools = {};
  for (const tool of tools) {
    if (!groupedTools[tool.category]) {
      groupedTools[tool.category] = [];
    }
    groupedTools[tool.category].push(tool);
  }
  
  console.log('\n📊 Tools by category:');
  for (const cat of categoryOrder) {
    if (categories[cat] && groupedTools[cat]) {
      console.log(`   ${categories[cat].icon || '📦'} ${categories[cat].name}: ${groupedTools[cat].length}`);
    }
  }
}

main();
