/**
 * IndexNow URL 提交脚本
 * 
 * 将网站 URL 即时推送到 Bing、Yandex 等搜索引擎
 * 
 * 使用方法:
 *   node scripts/submit-indexnow.js
 * 
 * 参考: https://www.indexnow.org/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const CONFIG = {
  host: 'tools.realtime-ai.chat',
  key: '03bdae3721054dfba79edd66e6157c3f',
  keyLocation: 'https://tools.realtime-ai.chat/03bdae3721054dfba79edd66e6157c3f.txt',
  // IndexNow API endpoints (任选一个，会自动共享给其他引擎)
  endpoints: [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow'
  ]
};

// 从 sitemap 读取 URL 或手动指定
function getUrlsToSubmit() {
  const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
  
  if (fs.existsSync(sitemapPath)) {
    const sitemap = fs.readFileSync(sitemapPath, 'utf-8');
    const urlRegex = /<loc>(.*?)<\/loc>/g;
    const urls = [];
    let match;
    
    while ((match = urlRegex.exec(sitemap)) !== null) {
      urls.push(match[1]);
    }
    
    return urls;
  }
  
  // 如果没有 sitemap，返回首页
  return [`https://${CONFIG.host}/`];
}

async function submitToIndexNow(urls) {
  const endpoint = CONFIG.endpoints[0]; // 使用第一个端点
  
  // IndexNow 支持批量提交（最多 10000 个 URL）
  const payload = {
    host: CONFIG.host,
    key: CONFIG.key,
    keyLocation: CONFIG.keyLocation,
    urlList: urls.slice(0, 10000) // 限制最多 10000 个
  };

  console.log(`\n📤 提交 ${payload.urlList.length} 个 URL 到 IndexNow...`);
  console.log(`   端点: ${endpoint}`);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok || response.status === 200 || response.status === 202) {
      console.log(`✅ 提交成功! 状态码: ${response.status}`);
      console.log(`   URL 将被共享给 Bing, Yandex, Seznam.cz, Naver 等搜索引擎`);
      return true;
    } else {
      const text = await response.text();
      console.error(`❌ 提交失败! 状态码: ${response.status}`);
      console.error(`   响应: ${text}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ 请求错误: ${error.message}`);
    return false;
  }
}

// 单个 URL 提交（用于测试）
async function submitSingleUrl(url) {
  const endpoint = CONFIG.endpoints[0];
  const params = new URLSearchParams({
    url: url,
    key: CONFIG.key
  });

  console.log(`\n📤 提交单个 URL: ${url}`);

  try {
    const response = await fetch(`${endpoint}?${params}`, {
      method: 'GET'
    });

    if (response.ok || response.status === 200 || response.status === 202) {
      console.log(`✅ 提交成功!`);
      return true;
    } else {
      console.error(`❌ 提交失败! 状态码: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ 请求错误: ${error.message}`);
    return false;
  }
}

// 主函数
async function main() {
  console.log('🔍 IndexNow URL 提交工具');
  console.log('========================');
  console.log(`主机: ${CONFIG.host}`);
  console.log(`Key: ${CONFIG.key}`);

  const urls = getUrlsToSubmit();
  console.log(`\n📋 找到 ${urls.length} 个 URL`);

  if (urls.length === 0) {
    console.log('没有 URL 需要提交');
    return;
  }

  // 显示前 5 个 URL
  console.log('\n前 5 个 URL:');
  urls.slice(0, 5).forEach(url => console.log(`  - ${url}`));
  if (urls.length > 5) {
    console.log(`  ... 还有 ${urls.length - 5} 个`);
  }

  // 提交
  await submitToIndexNow(urls);
}

main().catch(console.error);
