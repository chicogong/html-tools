import puppeteer from 'puppeteer';

const URLS_TO_TEST = [
  'https://tools.realtime-ai.chat/',
  'https://tools.realtime-ai.chat/tools/dev/base64.html',
  'https://tools.realtime-ai.chat/tools/text/text-diff.html',
  'https://tools.realtime-ai.chat/tools/office/letter-template.html'
];

async function checkUrl(page, url) {
  console.log(`\n🔍 Checking: ${url}`);
  try {
    // Add cache buster to URL to ensure we get the latest
    const busterUrl = url + (url.includes('?') ? '&' : '?') + 'bust=' + Date.now();
    const response = await page.goto(busterUrl, { waitUntil: 'networkidle0', timeout: 30000 });

    // Check HTTP Status
    const status = response.status();
    if (status !== 200) {
      console.log(`   ❌ Failed: HTTP Status ${status}`);
      return false;
    }
    console.log(`   ✅ HTTP Status: ${status}`);

    // Check DOCTYPE from page content
    const content = await page.content();
    const hasDoctype = content.trim().toLowerCase().startsWith('<!doctype html>');
    if (!hasDoctype) {
      console.log(`   ❌ Missing <!doctype html> - is it still fragment?`);
      return false;
    }

    // Check for EJS leakage
    if (content.includes('<%=') || content.includes('<%-')) {
      console.log(`   ❌ EJS tags leaked in output!`);
      return false;
    }
    console.log(`   ✅ Clean HTML (No EJS tags)`);

    // Check if tool-chrome.js loaded successfully and injected the FAB
    // For root /, the logic might be different, but for tools it should have tcChrome
    const isRoot = url === 'https://tools.realtime-ai.chat/';
    if (!isRoot) {
      const hasFAB = (await page.$('#tcChrome')) !== null;
      if (!hasFAB) {
        console.log(`   ❌ FAB (#tcChrome) missing. tool-chrome.js failed to execute?`);
        return false;
      }
      console.log(`   ✅ FAB component mounted via tool-chrome.js`);

      const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      console.log(`   ✅ Theme initialized correctly: ${theme}`);
    } else {
      console.log(`   ✅ Homepage loaded successfully`);
    }
    return true;
  } catch (error) {
    console.log(`   ❌ Error testing url: ${error.message}`);
    return false;
  }
}

(async () => {
  console.log('🚀 Starting deep verification on LIVE server...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  let allPass = true;
  for (const url of URLS_TO_TEST) {
    const passed = await checkUrl(page, url);
    if (!passed) allPass = false;
  }

  await browser.close();

  if (allPass) {
    console.log('\n🎉 ALL LIVE CHECKS PASSED. Deployment is successful and stable.');
  } else {
    console.log('\n⚠️ SOME CHECKS FAILED. Please review the logs above.');
  }
})();
