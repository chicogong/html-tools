#!/usr/bin/env node

/**
 * 为所有工具页面添加 SEO 和 Open Graph 标签
 * 基于 tools.json 中的元数据
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const TOOLS_JSON = path.join(ROOT_DIR, 'tools.json');
const BASE_URL = 'https://chicogong.github.io/html-tools';

// 读取 tools.json
const toolsData = JSON.parse(fs.readFileSync(TOOLS_JSON, 'utf8'));

/**
 * 生成 SEO meta 标签
 */
function generateSeoTags(tool) {
  const url = `${BASE_URL}/${tool.path}`;
  const title = `${tool.name} - WebUtils`;
  const description = tool.description || tool.name;
  const keywords = tool.keywords || tool.name;
  
  return `
  <!-- SEO Meta Tags -->
  <meta name="description" content="${description}" />
  <meta name="keywords" content="${keywords}" />
  <meta name="author" content="WebUtils" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${url}" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="WebUtils" />
  <meta property="og:locale" content="zh_CN" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
`;
}

/**
 * 处理单个工具文件
 */
function processToolFile(tool) {
  const filePath = path.join(ROOT_DIR, tool.path);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  文件不存在: ${tool.path}`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 检查是否已有 og:title 标签（避免重复添加）
  if (content.includes('og:title')) {
    console.log(`⏭️  已有 OG 标签: ${tool.path}`);
    return false;
  }
  
  // 在 </head> 之前插入 SEO 标签
  const seoTags = generateSeoTags(tool);
  
  // 找到 <title> 标签后的位置插入
  const titleMatch = content.match(/<title>[^<]*<\/title>/);
  if (titleMatch) {
    const insertPos = content.indexOf(titleMatch[0]) + titleMatch[0].length;
    content = content.slice(0, insertPos) + seoTags + content.slice(insertPos);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ 已添加 SEO 标签: ${tool.path}`);
    return true;
  } else {
    console.log(`⚠️  未找到 <title> 标签: ${tool.path}`);
    return false;
  }
}

// 主程序
console.log('🚀 开始为工具页面添加 SEO/OG 标签...\n');

let updated = 0;
let skipped = 0;
let failed = 0;

for (const tool of toolsData.tools) {
  const result = processToolFile(tool);
  if (result === true) {
    updated++;
  } else if (result === false) {
    // 检查是否是跳过还是失败
    const filePath = path.join(ROOT_DIR, tool.path);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('og:title')) {
        skipped++;
      } else {
        failed++;
      }
    } else {
      failed++;
    }
  }
}

console.log(`\n📊 完成统计:`);
console.log(`   ✅ 已更新: ${updated}`);
console.log(`   ⏭️  已跳过: ${skipped}`);
console.log(`   ⚠️  失败: ${failed}`);
console.log(`   📁 总计: ${toolsData.tools.length}`);
