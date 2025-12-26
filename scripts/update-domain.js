#!/usr/bin/env node

/**
 * 更新所有页面中的域名
 * 从 chicogong.github.io/html-tools 更新为 tools.realtime-ai.chat/html-tools
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const TOOLS_JSON = path.join(ROOT_DIR, 'tools.json');

const OLD_DOMAIN = 'https://chicogong.github.io/html-tools';
const NEW_DOMAIN = 'https://tools.realtime-ai.chat/html-tools';

// 读取 tools.json
const toolsData = JSON.parse(fs.readFileSync(TOOLS_JSON, 'utf8'));

/**
 * 替换文件中的域名
 */
function updateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  文件不存在: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes(OLD_DOMAIN)) {
    console.log(`⏭️  无需更新: ${filePath}`);
    return false;
  }
  
  content = content.replaceAll(OLD_DOMAIN, NEW_DOMAIN);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ 已更新: ${filePath}`);
  return true;
}

// 主程序
console.log('🚀 开始更新域名...');
console.log(`   旧域名: ${OLD_DOMAIN}`);
console.log(`   新域名: ${NEW_DOMAIN}\n`);

let updated = 0;

// 更新 index.html
if (updateFile(path.join(ROOT_DIR, 'index.html'))) updated++;

// 更新 sitemap.xml
if (updateFile(path.join(ROOT_DIR, 'sitemap.xml'))) updated++;

// 更新所有工具页面
for (const tool of toolsData.tools) {
  const filePath = path.join(ROOT_DIR, tool.path);
  if (updateFile(filePath)) updated++;
}

// 更新脚本中的默认域名
const scripts = ['add-seo-tags.js', 'add-og-image.js', 'generate-sitemap.js'];
for (const script of scripts) {
  const filePath = path.join(ROOT_DIR, 'scripts', script);
  if (updateFile(filePath)) updated++;
}

console.log(`\n📊 完成: 更新了 ${updated} 个文件`);
