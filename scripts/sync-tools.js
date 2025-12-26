#!/usr/bin/env node
/**
 * 工具列表同步脚本
 * 读取 tools.json 并更新 index.html 中的工具卡片
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const TOOLS_JSON = path.join(ROOT_DIR, 'tools.json');
const INDEX_HTML = path.join(ROOT_DIR, 'index.html');

// 颜色映射
const COLOR_MAP = {
  cyan: 'var(--accent-cyan)',
  yellow: 'var(--accent-yellow)',
  magenta: 'var(--accent-magenta)',
  purple: 'var(--accent-purple)',
  blue: 'var(--accent-blue)',
  green: '#10b981',
  red: '#ef4444'
};

function generateToolCard(tool, categories) {
  const category = categories[tool.category] || { icon: '🔧', color: 'cyan' };
  const color = COLOR_MAP[category.color] || COLOR_MAP.cyan;
  
  return `      <a href="${tool.path}" class="tool-card" data-category="${tool.category}" data-keywords="${tool.keywords}" style="--card-accent: ${color}">
        <div class="tool-card-header">
          <span class="tool-icon">${category.icon}</span>
          <span class="tool-name">${tool.name}</span>
        </div>
      </a>`;
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
  
  // 生成工具卡片 HTML
  const categoryOrder = ['dev', 'text', 'time', 'generator', 'media', 'privacy', 'security', 'network', 'calculator', 'converter', 'extractor', 'ai'];
  
  let cardsHtml = '';
  for (const cat of categoryOrder) {
    if (groupedTools[cat]) {
      const catInfo = categories[cat];
      cardsHtml += `\n      <!-- ${catInfo.name} -->\n`;
      for (const tool of groupedTools[cat]) {
        cardsHtml += generateToolCard(tool, categories) + '\n';
      }
    }
  }
  
  // 读取 index.html
  if (!fs.existsSync(INDEX_HTML)) {
    console.error('❌ index.html not found');
    process.exit(1);
  }
  
  let indexHtml = fs.readFileSync(INDEX_HTML, 'utf8');
  
  // 查找并替换工具卡片区域
  const startMarker = '<div class="tools-grid" id="tools-grid">';
  const endMarker = '</div>\n\n    <footer';
  
  const startIdx = indexHtml.indexOf(startMarker);
  const endIdx = indexHtml.indexOf(endMarker);
  
  if (startIdx === -1 || endIdx === -1) {
    console.error('❌ Could not find tools-grid markers in index.html');
    process.exit(1);
  }
  
  const newHtml = indexHtml.substring(0, startIdx + startMarker.length) + 
                  cardsHtml + 
                  '    ' + indexHtml.substring(endIdx);
  
  // 写入更新后的 index.html
  fs.writeFileSync(INDEX_HTML, newHtml);
  
  console.log(`✅ Updated index.html with ${tools.length} tools`);
  
  // 统计各分类数量
  console.log('\n📊 Tools by category:');
  for (const cat of categoryOrder) {
    if (groupedTools[cat]) {
      const catInfo = categories[cat];
      console.log(`   ${catInfo.icon} ${catInfo.name}: ${groupedTools[cat].length}`);
    }
  }
}

main();
