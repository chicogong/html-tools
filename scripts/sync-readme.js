#!/usr/bin/env node
/**
 * README 工具列表同步脚本
 * 从 tools.json 自动生成 README.md 中的工具列表部分
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const TOOLS_JSON = path.join(ROOT_DIR, 'tools.json');
const README_MD = path.join(ROOT_DIR, 'README.md');

// 分类顺序
const CATEGORY_ORDER = ['dev', 'text', 'time', 'generator', 'media', 'privacy', 'security', 'network', 'calculator', 'converter', 'extractor', 'ai'];

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
  
  // 生成工具列表 Markdown
  let toolsListMd = '';
  
  for (const cat of CATEGORY_ORDER) {
    if (groupedTools[cat] && groupedTools[cat].length > 0) {
      const catInfo = categories[cat];
      toolsListMd += `### ${catInfo.name}\n\n`;
      toolsListMd += '| 工具 | 描述 |\n';
      toolsListMd += '|------|------|\n';
      
      for (const tool of groupedTools[cat]) {
        const name = tool.name;
        const path = tool.path;
        const desc = tool.description || tool.name;
        toolsListMd += `| [${name}](${path}) | ${desc} |\n`;
      }
      
      toolsListMd += '\n';
    }
  }
  
  // 读取 README.md
  if (!fs.existsSync(README_MD)) {
    console.error('❌ README.md not found');
    process.exit(1);
  }
  
  let readme = fs.readFileSync(README_MD, 'utf8');
  
  // 查找并替换工具列表部分
  // 标记: ## 工具列表 ... ## 使用方式
  const startMarker = '## 工具列表\n';
  const endMarker = '\n## 使用方式';
  
  const startIdx = readme.indexOf(startMarker);
  const endIdx = readme.indexOf(endMarker);
  
  if (startIdx === -1 || endIdx === -1) {
    console.error('❌ Could not find tool list markers in README.md');
    console.error('   Expected "## 工具列表" and "## 使用方式" sections');
    process.exit(1);
  }
  
  const newReadme = readme.substring(0, startIdx + startMarker.length) + 
                    '\n' + toolsListMd +
                    readme.substring(endIdx);
  
  // 写入更新后的 README.md
  fs.writeFileSync(README_MD, newReadme);
  
  console.log(`✅ Updated README.md with ${tools.length} tools`);
  
  // 统计各分类数量
  console.log('\n📊 Tools by category:');
  for (const cat of CATEGORY_ORDER) {
    if (groupedTools[cat]) {
      const catInfo = categories[cat];
      console.log(`   ${catInfo.icon || '📦'} ${catInfo.name}: ${groupedTools[cat].length}`);
    }
  }
}

main();
