#!/usr/bin/env node

/**
 * Test migrated tools to ensure they work correctly
 */

const puppeteer = require('puppeteer');
const http = require('http');
const handler = require('serve-handler');
const path = require('path');

// Sample tools from different categories
const SAMPLE_TOOLS = [
  'tools/dev/json-formatter.html',
  'tools/text/markdown-editor.html',
  'tools/time/timestamp.html',
  'tools/calculator/percentage-calc.html',
  'tools/converter/length-converter.html',
  'tools/design/color-picker.html',
  'tools/generator/qrcode-generator.html',
  'tools/ai/token-counter.html'
];

const PORT = 3456;
let server;
let browser;

async function startServer() {
  return new Promise((resolve) => {
    server = http.createServer((request, response) => {
      return handler(request, response, {
        public: path.join(__dirname),
        cleanUrls: false
      });
    });

    server.listen(PORT, () => {
      console.log(`✅ Server started on http://localhost:${PORT}\n`);
      resolve();
    });
  });
}

async function testTool(toolPath) {
  const url = `http://localhost:${PORT}/${toolPath}`;
  const page = await browser.newPage();

  try {
    console.log(`Testing: ${toolPath}`);

    // Load the page
    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // Check HTTP status
    const status = response.status();
    if (status !== 200) {
      throw new Error(`HTTP ${status}`);
    }

    // Check for JavaScript errors
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    // Wait a bit for any async operations
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if Google Fonts loaded
    const hasFonts = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[href*="fonts.googleapis.com"]'));
      return links.length > 0;
    });

    // Check if CSS variables are defined
    const hasVariables = await page.evaluate(() => {
      const root = document.documentElement;
      const style = getComputedStyle(root);
      const bgDeep = style.getPropertyValue('--color-bg-deep').trim();
      const fontSans = style.getPropertyValue('--font-sans').trim();
      return bgDeep !== '' && fontSans !== '';
    });

    // Check if page title exists
    const title = await page.title();

    // Check for console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    const result = {
      path: toolPath,
      status: 'PASS',
      httpStatus: status,
      title: title,
      hasFonts: hasFonts,
      hasVariables: hasVariables,
      jsErrors: errors.length,
      consoleErrors: consoleErrors.length
    };

    // Determine if test passed
    if (errors.length > 0 || !hasVariables) {
      result.status = 'FAIL';
      result.issues = [];
      if (!hasVariables) result.issues.push('Missing CSS variables');
      if (errors.length > 0) result.issues.push(`${errors.length} JS errors`);
    } else if (!hasFonts) {
      result.status = 'WARN';
      result.issues = ['Google Fonts not loaded'];
    }

    return result;

  } catch (error) {
    return {
      path: toolPath,
      status: 'ERROR',
      error: error.message
    };
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('🧪 Testing Migrated Tools\n');
  console.log(`Testing ${SAMPLE_TOOLS.length} sample tools...\n`);

  await startServer();

  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];

  for (const toolPath of SAMPLE_TOOLS) {
    const result = await testTool(toolPath);
    results.push(result);

    // Print result
    const icon = result.status === 'PASS' ? '✅' : result.status === 'WARN' ? '⚠️' : '❌';
    console.log(`  ${icon} ${result.path}`);

    if (result.status === 'PASS') {
      console.log(`     HTTP: ${result.httpStatus}, Fonts: ${result.hasFonts}, Variables: ${result.hasVariables}`);
    } else if (result.status === 'WARN') {
      console.log(`     Issues: ${result.issues.join(', ')}`);
    } else if (result.status === 'FAIL') {
      console.log(`     Issues: ${result.issues.join(', ')}`);
    } else {
      console.log(`     Error: ${result.error}`);
    }
    console.log();
  }

  // Summary
  const passed = results.filter(r => r.status === 'PASS').length;
  const warned = results.filter(r => r.status === 'WARN').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const errored = results.filter(r => r.status === 'ERROR').length;

  console.log('='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  console.log(`✅ Passed:  ${passed}/${SAMPLE_TOOLS.length}`);
  console.log(`⚠️  Warnings: ${warned}/${SAMPLE_TOOLS.length}`);
  console.log(`❌ Failed:  ${failed}/${SAMPLE_TOOLS.length}`);
  console.log(`🔥 Errors:  ${errored}/${SAMPLE_TOOLS.length}`);
  console.log('='.repeat(60));

  const allGood = failed === 0 && errored === 0;
  console.log(allGood ? '\n✅ All tools working!' : '\n⚠️ Some issues found');

  // Cleanup
  await browser.close();
  server.close();

  process.exit(allGood ? 0 : 1);
}

main().catch(error => {
  console.error('Fatal error:', error);
  if (browser) browser.close();
  if (server) server.close();
  process.exit(1);
});
