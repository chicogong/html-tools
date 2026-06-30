import puppeteer from 'puppeteer';
import http from 'http';

async function runTests() {
  console.log('🚀 Starting Comprehensive E2E Tests...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const results = [];
  
  // Track console errors
  page.on('pageerror', err => {
    console.log(`❌ Page Error: ${err.message}`);
  });
  page.on('console', msg => {
    console.log(`[Browser Console]: ${msg.text()}`);
  });
  
  const testUrls = [
    { name: 'Homepage (PWA & Lazy Load)', url: 'http://localhost:3001/' },
    { name: 'Category Page', url: 'http://localhost:3001/tools/dev/' },
    { name: 'Tool Page (JSON Formatter)', url: 'http://localhost:3001/tools/dev/json-formatter.html' }
  ];

  for (const { name, url } of testUrls) {
    console.log(`\n🔍 Testing: ${name} (${url})`);
    try {
      const response = await page.goto(url, { waitUntil: 'load' });
      
      // 1. Status Code
      const status = response.status();
      if (status !== 200) throw new Error(`HTTP Status ${status}`);
      
      // 2. Title
      const title = await page.title();
      console.log(`   - Title: ${title}`);
      
      // 3. Manifest
      const manifest = await page.$eval('link[rel="manifest"]', el => el.href).catch(() => null);
      console.log(`   - Manifest: ${manifest ? '✅ Found' : '❌ Missing'}`);
      
      // Wait 2 seconds for deferred scripts to run
      await new Promise(r => setTimeout(r, 2000));
      
      // 4. Service Worker
      const sw = await page.evaluate(async () => {
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          return regs.length > 0;
        }
        return false;
      });
      console.log(`   - Service Worker: ${sw ? '✅ Registered' : '❌ Missing'}`);
      
      // 5. Dark mode check
      const isDarkMode = await page.$eval('html', el => el.classList.contains('dark')).catch(() => false);
      console.log(`   - Dark Mode Initial State: ${isDarkMode}`);

      results.push({ name, status: 'PASS' });
    } catch (e) {
      console.error(`   ❌ Failed: ${e.message}`);
      results.push({ name, status: 'FAIL', error: e.message });
    }
  }

  await browser.close();
  
  console.log('\n📊 Test Summary:');
  results.forEach(r => {
    console.log(`   ${r.status === 'PASS' ? '✅' : '❌'} ${r.name}`);
  });
  
  if (results.some(r => r.status === 'FAIL')) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(console.error);
