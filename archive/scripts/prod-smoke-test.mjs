import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const TOOLS_JSON = path.join(ROOT_DIR, 'tools.json');

const BASE_URL = 'http://localhost:3001';

// We will fetch URLs in batches to avoid socket exhaustion
async function fetchUrl(url, extractAssets = false) {
  return new Promise((resolve) => {
    http
      .get(url, (res) => {
        let data = '';
        if (extractAssets) {
          res.on('data', (chunk) => (data += chunk));
        } else {
          res.resume();
        }
        res.on('end', () => {
          let assets = new Set();
          if (extractAssets && res.statusCode === 200 && url.endsWith('.html')) {
            try {
              const $ = cheerio.load(data);
              $('[src]').each((_, el) => {
                const src = $(el).attr('src');
                if (src && !src.startsWith('http') && !src.startsWith('data:')) {
                  assets.add(new URL(src, url).href);
                }
              });
              $('[href]').each((_, el) => {
                const href = $(el).attr('href');
                if (
                  href &&
                  !href.startsWith('http') &&
                  !href.startsWith('data:') &&
                  !href.startsWith('#')
                ) {
                  assets.add(new URL(href, url).href);
                }
              });
            } catch (e) {}
          }
          resolve({ url, status: res.statusCode, assets: Array.from(assets) });
        });
      })
      .on('error', (err) => {
        resolve({ url, status: 0, error: err.message, assets: [] });
      });
  });
}

async function runSmokeTest() {
  console.log(`🚀 Starting Production Smoke Test against ${BASE_URL}...`);

  if (!fs.existsSync(TOOLS_JSON)) {
    console.error('tools.json not found!');
    process.exit(1);
  }

  const toolsData = JSON.parse(fs.readFileSync(TOOLS_JSON, 'utf8'));
  const tools = Object.values(toolsData.tools);

  const urlsToTest = new Set();
  // 1. Home page
  urlsToTest.add(`${BASE_URL}/`);
  // 2. All category pages
  Object.keys(toolsData.categories).forEach((cat) => {
    urlsToTest.add(`${BASE_URL}/tools/${cat}/index.html`);
  });
  // 3. All tool pages
  tools.forEach((tool) => {
    urlsToTest.add(`${BASE_URL}/${tool.path}`);
  });

  console.log(`📋 Found ${urlsToTest.size} HTML URLs to test.`);

  let successCount = 0;
  let failCount = 0;
  const failures = [];

  const BATCH_SIZE = 50;
  const urlArray = Array.from(urlsToTest);
  const assetUrlsToTest = new Set();

  for (let i = 0; i < urlArray.length; i += BATCH_SIZE) {
    const batch = urlArray.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map((url) => fetchUrl(url, true)));

    results.forEach((res) => {
      if (res.status === 200) {
        successCount++;
        res.assets.forEach((a) => assetUrlsToTest.add(a));
      } else {
        failCount++;
        failures.push(res);
        console.error(`❌ FAILED HTML: ${res.status} - ${res.url}`);
      }
    });
    process.stdout.write(`\r🔄 HTML Progress: ${successCount + failCount}/${urlArray.length}`);
  }

  console.log(
    `\n\n🔍 Now verifying ${assetUrlsToTest.size} unique internal assets (JS, CSS, Images)...`
  );
  const assetArray = Array.from(assetUrlsToTest);
  let assetSuccessCount = 0;

  for (let i = 0; i < assetArray.length; i += BATCH_SIZE) {
    const batch = assetArray.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map((url) => fetchUrl(url, false)));

    results.forEach((res) => {
      if (res.status === 200) {
        assetSuccessCount++;
      } else {
        failCount++;
        failures.push(res);
        console.error(`❌ FAILED ASSET: ${res.status} - ${res.url}`);
      }
    });
    process.stdout.write(
      `\r🔄 Asset Progress: ${assetSuccessCount + failCount}/${assetArray.length}`
    );
  }

  console.log('\n\n==================================================');
  console.log(`🎉 Smoke Test Complete!`);
  console.log(`✅ Passed: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);

  if (failCount > 0) {
    console.error('\n🚨 Failed URLs:');
    failures.forEach((f) =>
      console.error(`  - [${f.status}] ${f.url} ${f.error ? '(' + f.error + ')' : ''}`)
    );
    process.exit(1);
  } else {
    console.log('\n🌟 PRODUCTION ENVIRONMENT IS 100% HEALTHY!');
  }
}

runSmokeTest();
