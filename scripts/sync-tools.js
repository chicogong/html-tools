#!/usr/bin/env node
/**
 * 工具列表同步脚本
 * 读取 tools.json 并更新 index.html 中的 TOOLS 和 CATEGORIES 数组
 * 同时更新 GitHub 仓库描述中的工具数量
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

// 分类顺序
const CATEGORY_ORDER = ['dev', 'text', 'time', 'generator', 'media', 'privacy', 'security', 'network', 'calculator', 'converter', 'extractor', 'ai', 'life'];

// 分类中文注释
const CATEGORY_COMMENTS = {
  dev: '开发工具',
  text: '文本工具',
  time: '时间工具',
  generator: '生成器',
  media: '媒体工具',
  privacy: '隐私安全',
  security: '安全工具',
  network: '网络工具',
  calculator: '计算器',
  converter: '转换器',
  extractor: '提取器',
  ai: 'AI 工具'
};

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

function main() {
  // 读取 tools.json
  if (!fs.existsSync(TOOLS_JSON)) {
    console.error('❌ tools.json not found');
    process.exit(1);
  }
  
  const toolsData = JSON.parse(fs.readFileSync(TOOLS_JSON, 'utf8'));
  const { categories, tools } = toolsData;
  
  console.log(`📦 Found ${tools.length} tools in tools.json`);
  
  // 按分类分组
  const groupedTools = {};
  for (const tool of tools) {
    if (!groupedTools[tool.category]) {
      groupedTools[tool.category] = [];
    }
    groupedTools[tool.category].push(tool);
  }
  
  // 生成 CATEGORIES 数组（单行格式，包含 icon）
  const categoriesItems = [
    "      { id: 'all', name: '全部', icon: '🏠' },",
    "      { id: 'favorites', name: '收藏', icon: '⭐' },"
  ];
  
  for (const catId of CATEGORY_ORDER) {
    const cat = categories[catId];
    if (cat) {
      const icon = escapeString(cat.icon || '📦');
      categoriesItems.push(`      { id: '${catId}', name: '${escapeString(cat.name)}', icon: '${icon}' },`);
    }
  }
  
  const categoriesJs = `const CATEGORIES = [\n${categoriesItems.join('\n')}\n    ];`;
  
  // 生成 TOOLS 数组（按分类分组，每个工具一行）
  const toolsLines = [];
  
  for (const catId of CATEGORY_ORDER) {
    const catTools = groupedTools[catId];
    if (catTools && catTools.length > 0) {
      // 添加分类注释
      toolsLines.push(`      // ${CATEGORY_COMMENTS[catId] || catId}`);
      
      // 添加该分类的所有工具
      for (const tool of catTools) {
        toolsLines.push(toolToJsLine(tool));
      }
    }
  }
  
  const toolsJs = `const TOOLS = [\n${toolsLines.join('\n')}\n    ];`;
  
  // 读取 index.html
  if (!fs.existsSync(INDEX_HTML)) {
    console.error('❌ index.html not found');
    process.exit(1);
  }
  
  let indexHtml = fs.readFileSync(INDEX_HTML, 'utf8');
  
  // 替换 CATEGORIES 数组
  // 匹配: const CATEGORIES = [...];
  const categoriesRegex = /const CATEGORIES = \[\s*[\s\S]*?\n\s*\];/;
  if (categoriesRegex.test(indexHtml)) {
    // 使用函数作为替换参数，避免 $ 被解释为特殊字符
    indexHtml = indexHtml.replace(categoriesRegex, () => categoriesJs);
    console.log('✅ Updated CATEGORIES array');
  } else {
    console.error('❌ Could not find CATEGORIES array in index.html');
  }
  
  // 替换 TOOLS 数组
  // 匹配: const TOOLS = [...]; (直到遇到 ];)
  const toolsRegex = /const TOOLS = \[\s*[\s\S]*?\n\s*\];/;
  if (toolsRegex.test(indexHtml)) {
    // 使用函数作为替换参数，避免 $ 被解释为特殊字符
    indexHtml = indexHtml.replace(toolsRegex, () => toolsJs);
    console.log('✅ Updated TOOLS array');
  } else {
    console.error('❌ Could not find TOOLS array in index.html');
  }
  
  // 更新 SEO meta 标签中的工具数量
  // 注意：只匹配 "包含 X 个工具" 或 "包含 X+ 个工具"，避免误改 "包含 12 个主要类别" 等文本
  const toolCount = tools.length;
  indexHtml = indexHtml.replace(/包含 \d+ 个工具/g, `包含 ${toolCount} 个工具`);
  indexHtml = indexHtml.replace(/\d+\+ 个纯前端/g, `${toolCount}+ 个纯前端`);
  indexHtml = indexHtml.replace(/包含 \d+\+ 个工具/g, `包含 ${toolCount}+ 个工具`);
  
  // 写入更新后的 index.html
  fs.writeFileSync(INDEX_HTML, indexHtml);
  
  console.log(`\n✅ Updated index.html with ${tools.length} tools`);
  
  // 统计各分类数量
  console.log('\n📊 Tools by category:');
  for (const cat of CATEGORY_ORDER) {
    if (categories[cat] && groupedTools[cat]) {
      console.log(`   ${categories[cat].icon || '📦'} ${categories[cat].name}: ${groupedTools[cat].length}`);
    }
  }
  
  // 更新 GitHub 仓库描述
  updateGitHubDescription(toolCount);
}

/**
 * 更新 GitHub 仓库描述中的工具数量
 */
function updateGitHubDescription(toolCount) {
  try {
    // 获取当前仓库描述
    const result = execSync('gh repo view --json description -q .description', { 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    const currentDesc = result.trim();
    
    // 替换描述中的工具数量 (匹配 "数字+" 格式)
    const newDesc = currentDesc.replace(/\d+\+\s*纯前端/, `${toolCount}+ 纯前端`);
    
    if (newDesc !== currentDesc) {
      // 更新仓库描述 - 使用 execFileSync 配合数组参数避免 shell 注入
      execFileSync('gh', ['repo', 'edit', '--description', newDesc], {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      console.log(`\n✅ Updated GitHub repo description: ${toolCount}+ 纯前端在线工具集`);
    } else {
      console.log(`\n📋 GitHub repo description already up to date`);
    }
  } catch {
    // gh CLI 可能未安装或未认证，静默忽略
    console.log('\n⚠️  Could not update GitHub repo description (gh CLI not available or not authenticated)');
  }
}

main();
