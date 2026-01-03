/**
 * Browser Automation E2E Tests
 * Uses Puppeteer to test tools in a real browser environment
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');
const handler = require('serve-handler');

const toolsJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../../tools.json'), 'utf8'));
const tools = Object.values(toolsJson.tools);

// Simple static file server
function startServer(port = 8888) {
  const server = http.createServer((request, response) => {
    return handler(request, response, {
      public: path.join(__dirname, '../../'),
      cleanUrls: false
    });
  });

  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`📡 Test server running at http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function testTool(browser, toolPath, toolName) {
  const page = await browser.newPage();
  const url = `http://localhost:8888/${toolPath}`;

  try {
    console.log(`\n🧪 Testing: ${toolName}`);
    console.log(`   URL: ${url}`);

    // Navigate to tool
    const response = await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 10000
    });

    // Check if page loaded successfully
    if (!response || !response.ok()) {
      throw new Error(`Failed to load page: ${response?.status()}`);
    }

    // Check for JavaScript errors
    const errors = [];
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    // Wait a bit for any async operations
    await page.waitForTimeout(1000);

    // Check page title
    const title = await page.title();
    console.log(`   ✓ Title: ${title}`);

    // Check if there are any console errors
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleLogs.push(msg.text());
      }
    });

    // Take screenshot
    const screenshotDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const screenshotName = toolPath.replace(/\//g, '_').replace('.html', '.png');
    await page.screenshot({
      path: path.join(screenshotDir, screenshotName),
      fullPage: true
    });
    console.log(`   ✓ Screenshot saved: ${screenshotName}`);

    // Check if page has basic structure
    const hasContainer = await page.$('body > *');
    if (!hasContainer) {
      throw new Error('No content found in page');
    }
    console.log(`   ✓ Page has content`);

    // Report any errors
    if (errors.length > 0) {
      console.log(`   ⚠️  JavaScript errors found:`);
      errors.forEach(err => console.log(`      - ${err}`));
      return { success: false, errors };
    }

    console.log(`   ✅ Test passed`);
    return { success: true, errors: [] };

  } catch (error) {
    console.log(`   ❌ Test failed: ${error.message}`);
    return { success: false, errors: [error.message] };
  } finally {
    await page.close();
  }
}

async function runTests() {
  console.log('\n🚀 Browser Automation E2E Tests\n');
  console.log(`Testing ${tools.length} tools...\n`);

  // Start local server
  const server = await startServer();

  // Launch browser
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  console.log('🌐 Browser launched');

  let passed = 0;
  let failed = 0;
  const failedTools = [];

  // Test a sample of tools (not all to keep tests fast)
  const sampleSize = process.env.TEST_ALL ? tools.length : Math.min(10, tools.length);
  const toolsToTest = process.env.TEST_ALL
    ? tools
    : tools.slice(0, sampleSize);

  console.log(`\nTesting ${toolsToTest.length} tools (use TEST_ALL=1 to test all):\n`);

  for (const tool of toolsToTest) {
    const result = await testTool(browser, tool.path, tool.name);
    if (result.success) {
      passed++;
    } else {
      failed++;
      failedTools.push({ name: tool.name, path: tool.path, errors: result.errors });
    }
  }

  // Test index.html
  console.log(`\n🧪 Testing: Index Page`);
  const indexPage = await browser.newPage();
  await indexPage.goto('http://localhost:8888/index.html', { waitUntil: 'networkidle2' });
  const indexTitle = await indexPage.title();
  console.log(`   ✓ Title: ${indexTitle}`);

  // Check if tools are rendered
  const toolCards = await indexPage.$$('.tool-card');
  console.log(`   ✓ Found ${toolCards.length} tool cards`);

  if (toolCards.length > 0) {
    passed++;
    console.log(`   ✅ Index page test passed`);
  } else {
    failed++;
    console.log(`   ❌ Index page test failed: No tool cards found`);
  }

  await indexPage.close();

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}/${toolsToTest.length + 1}`);
  console.log(`❌ Failed: ${failed}/${toolsToTest.length + 1}`);

  if (failedTools.length > 0) {
    console.log('\n❌ Failed Tools:');
    failedTools.forEach(tool => {
      console.log(`   - ${tool.name} (${tool.path})`);
      tool.errors.forEach(err => console.log(`     • ${err}`));
    });
  }

  // Cleanup
  await browser.close();
  server.close();

  console.log('\n✨ Tests complete!\n');
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
