#!/usr/bin/env node

/**
 * 为所有工具页面添加 og:image 标签
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const TOOLS_JSON = path.join(ROOT_DIR, 'tools.json');
const BASE_URL = 'https://chicogong.github.io/html-tools';
const OG_IMAGE_URL = `${BASE_URL}/social-preview.png`;

// 读取 tools.json
const toolsData = JSON.parse(fs.readFileSync(TOOLS_JSON, 'utf8'));

// og:image 标签
const ogImageTags = `
  <!-- OG Image -->
  <meta property="og:image" content="${OG_IMAGE_URL}" />
  <meta property="og:image:width" content="1280" />
  <meta property="og:image:height" content="640" />
  <meta property="og:image:type" content="image/png" />
  <meta name="twitter:image" content="${OG_IMAGE_URL}" />`;

/**
 * 处理单个工具文件
 */
function processToolFile(tool) {
  const filePath = path.join(ROOT_DIR, tool.path);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  文件不存在: ${tool.path}`);
    return 'failed';
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 检查是否已有 og:image 标签
  if (content.includes('og:image')) {
    console.log(`⏭️  已有 og:image: ${tool.path}`);
    return 'skipped';
  }
  
  // 在 Twitter Card 部分后面插入 og:image
  const twitterCardMatch = content.match(/<meta name="twitter:description"[^>]*\/>/);
  if (twitterCardMatch) {
    const insertPos = content.indexOf(twitterCardMatch[0]) + twitterCardMatch[0].length;
    content = content.slice(0, insertPos) + ogImageTags + content.slice(insertPos);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ 已添加 og:image: ${tool.path}`);
    return 'updated';
  } else {
    console.log(`⚠️  未找到 Twitter Card 标签: ${tool.path}`);
    return 'failed';
  }
}

// 主程序
console.log('🚀 开始为工具页面添加 og:image 标签...\n');

let updated = 0;
let skipped = 0;
let failed = 0;

for (const tool of toolsData.tools) {
  const result = processToolFile(tool);
  if (result === 'updated') {
    updated++;
  } else if (result === 'skipped') {
    skipped++;
  } else {
    failed++;
  }
}

console.log(`\n📊 完成统计:`);
console.log(`   ✅ 已更新: ${updated}`);
console.log(`   ⏭️  已跳过: ${skipped}`);
console.log(`   ⚠️  失败: ${failed}`);
console.log(`   📁 总计: ${toolsData.tools.length}`);

// 处理 index.html
console.log('\n📄 处理 index.html...');
const indexPath = path.join(ROOT_DIR, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

if (!indexContent.includes('og:image')) {
  // 在 og:locale 后面插入
  const localeMatch = indexContent.match(/<meta property="og:locale"[^>]*\/>/);
  if (localeMatch) {
    const insertPos = indexContent.indexOf(localeMatch[0]) + localeMatch[0].length;
    indexContent = indexContent.slice(0, insertPos) + ogImageTags + indexContent.slice(insertPos);
    fs.writeFileSync(indexPath, indexContent, 'utf8');
    console.log('✅ index.html 已添加 og:image');
  }
} else {
  console.log('⏭️  index.html 已有 og:image');
}
