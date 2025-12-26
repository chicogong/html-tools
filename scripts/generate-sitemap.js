#!/usr/bin/env node

/**
 * 生成 sitemap.xml
 * 基于 tools.json 中的工具列表
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const TOOLS_JSON = path.join(ROOT_DIR, 'tools.json');
const SITEMAP_PATH = path.join(ROOT_DIR, 'sitemap.xml');
const BASE_URL = 'https://chicogong.github.io/html-tools';

// 读取 tools.json
const toolsData = JSON.parse(fs.readFileSync(TOOLS_JSON, 'utf8'));

// 获取今天的日期
const today = new Date().toISOString().split('T')[0];

// 生成 sitemap XML
function generateSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 首页 -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

  // 按类别分组工具
  const categories = {};
  for (const tool of toolsData.tools) {
    if (!categories[tool.category]) {
      categories[tool.category] = [];
    }
    categories[tool.category].push(tool);
  }

  // 添加每个工具页面
  for (const tool of toolsData.tools) {
    xml += `
  <url>
    <loc>${BASE_URL}/${tool.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  xml += `
</urlset>
`;

  return xml;
}

// 写入 sitemap.xml
const sitemap = generateSitemap();
fs.writeFileSync(SITEMAP_PATH, sitemap, 'utf8');

console.log(`✅ sitemap.xml 已生成`);
console.log(`   📍 位置: ${SITEMAP_PATH}`);
console.log(`   📄 页面数: ${toolsData.tools.length + 1}`);
