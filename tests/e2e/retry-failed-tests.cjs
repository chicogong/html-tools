#!/usr/bin/env node

/**
 * Optimized E2E Test Retry Script
 * Re-tests failed/untested tools using smaller batches to avoid resource exhaustion
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Configuration
const BATCH_SIZE = 50; // Test 50 tools per batch (down from 250)
const TIMEOUT = 30000; // 30 seconds per tool
const CHECKPOINT_INTERVAL = 10; // Save every 10 tools
const MAX_RETRIES = 2; // Retry failed tests up to 2 times

// Paths
const ENHANCED_REPORT_PATH = path.join(__dirname, 'enhanced-report.json');
const TOOLS_JSON_PATH = path.join(__dirname, '../../tools.json');
const SCREENSHOTS_DIR = path.join(__dirname, 'ui-screenshots');

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Load existing results
let existingResults = [];
if (fs.existsSync(ENHANCED_REPORT_PATH)) {
  existingResults = JSON.parse(fs.readFileSync(ENHANCED_REPORT_PATH, 'utf8'));
  console.log(`📊 Loaded ${existingResults.length} existing test results`);
}

// Load tools.json
const toolsData = JSON.parse(fs.readFileSync(TOOLS_JSON_PATH, 'utf8'));
// Convert tools object to array (handles both array and object formats)
const allTools = Array.isArray(toolsData.tools)
  ? toolsData.tools
  : Object.values(toolsData.tools);

// Filter out already successfully tested tools
const testedPaths = new Set(
  existingResults
    .filter(r => r.scores && r.scores.overall > 0)
    .map(r => r.path)
);

const untestedTools = allTools.filter(t => !testedPaths.has(t.path));

console.log(`\n📋 Test Summary:`);
console.log(`   Total tools: ${allTools.length}`);
console.log(`   ✅ Already tested: ${testedPaths.size}`);
console.log(`   ❌ Untested: ${untestedTools.length}`);
console.log(`   📦 Batch size: ${BATCH_SIZE} tools\n`);

if (untestedTools.length === 0) {
  console.log('✅ All tools already tested!');
  process.exit(0);
}

// Calculate number of batches
const numBatches = Math.ceil(untestedTools.length / BATCH_SIZE);
console.log(`🚀 Starting ${numBatches} batches...\n`);

// Enhanced UI Quality Checker (from enhanced-ui-checker.cjs)
async function checkUIQuality(page, url, toolName) {
  const scores = {
    desktop: { total: 0, details: {} },
    mobile: { total: 0, details: {} },
    performance: { total: 0, details: {} },
    accessibility: { total: 0, details: {} },
    overall: 0,
    issues: [],
    suggestions: []
  };

  try {
    // Navigate to page
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Desktop checks (100 points)
    const desktopChecks = await page.evaluate(() => {
      const results = { responsive: 0, colorContrast: 0, formUsability: 0, interactivity: 0, typography: 0 };

      // 1. Responsive design (20 points)
      const hasViewport = !!document.querySelector('meta[name="viewport"]');
      const usesMediaQueries = Array.from(document.styleSheets).some(sheet => {
        try {
          return Array.from(sheet.cssRules || []).some(rule => rule.type === CSSRule.MEDIA_RULE);
        } catch (e) {
          return false;
        }
      });
      results.responsive = (hasViewport ? 10 : 0) + (usesMediaQueries ? 10 : 0);

      // 2. Color contrast (20 points)
      const style = getComputedStyle(document.body);
      const bgColor = style.backgroundColor;
      const textColor = style.color;
      const hasGoodContrast = bgColor !== textColor;
      results.colorContrast = hasGoodContrast ? 20 : 10;

      // 3. Form usability (20 points)
      const inputs = document.querySelectorAll('input, textarea, select');
      const hasLabels = Array.from(inputs).every(input => {
        return input.labels?.length > 0 || input.getAttribute('aria-label') || input.placeholder;
      });
      results.formUsability = inputs.length === 0 ? 20 : (hasLabels ? 20 : 10);

      // 4. Interactivity (20 points)
      const buttons = document.querySelectorAll('button, [role="button"]');
      const links = document.querySelectorAll('a');
      const hasInteractive = buttons.length > 0 || links.length > 0;
      results.interactivity = hasInteractive ? 20 : 10;

      // 5. Typography (20 points)
      const hasFontFamily = style.fontFamily && style.fontFamily !== 'serif';
      const hasReadableSize = parseFloat(style.fontSize) >= 14;
      results.typography = (hasFontFamily ? 10 : 0) + (hasReadableSize ? 10 : 0);

      return results;
    });
    scores.desktop.details = desktopChecks;
    scores.desktop.total = Object.values(desktopChecks).reduce((a, b) => a + b, 0);

    // Mobile checks (100 points)
    await page.setViewport({ width: 375, height: 667, isMobile: true });
    await new Promise(resolve => setTimeout(resolve, 500));

    const mobileChecks = await page.evaluate(() => {
      const results = { touchTargets: 0, textReadability: 0, noHorizontalScroll: 0, mobileLayout: 0 };

      // 1. Touch target size (30 points)
      const buttons = document.querySelectorAll('button, a, [role="button"]');
      let adequateSizeCount = 0;
      buttons.forEach(btn => {
        const rect = btn.getBoundingClientRect();
        if (rect.width >= 44 && rect.height >= 44) adequateSizeCount++;
      });
      results.touchTargets = buttons.length === 0 ? 30 : Math.round((adequateSizeCount / buttons.length) * 30);

      // 2. Text readability (25 points)
      const style = getComputedStyle(document.body);
      const fontSize = parseFloat(style.fontSize);
      results.textReadability = fontSize >= 16 ? 25 : (fontSize >= 14 ? 20 : 15);

      // 3. No horizontal scroll (25 points)
      const hasHorizontalScroll = document.body.scrollWidth > window.innerWidth;
      results.noHorizontalScroll = hasHorizontalScroll ? 15 : 25;

      // 4. Mobile-friendly layout (20 points)
      const hasViewport = !!document.querySelector('meta[name="viewport"]');
      results.mobileLayout = hasViewport ? 20 : 10;

      return results;
    });
    scores.mobile.details = mobileChecks;
    scores.mobile.total = Object.values(mobileChecks).reduce((a, b) => a + b, 0);

    // Performance checks (100 points)
    await page.setViewport({ width: 1920, height: 1080 });

    const performanceMetrics = await page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: perf?.loadEventEnd - perf?.fetchStart || 0,
        resources: performance.getEntriesByType('resource').length,
        jsHeapMB: (performance.memory?.usedJSHeapSize / 1024 / 1024).toFixed(2) || '0',
        domNodes: document.querySelectorAll('*').length
      };
    });

    const perfChecks = {
      loadTime: performanceMetrics.loadTime < 1000 ? 30 : (performanceMetrics.loadTime < 3000 ? 20 : 10),
      resourceCount: performanceMetrics.resources < 10 ? 25 : (performanceMetrics.resources < 30 ? 20 : 15),
      jsPerformance: parseFloat(performanceMetrics.jsHeapMB) < 5 ? 25 : (parseFloat(performanceMetrics.jsHeapMB) < 10 ? 20 : 15),
      domComplexity: performanceMetrics.domNodes < 500 ? 20 : (performanceMetrics.domNodes < 1000 ? 15 : 10),
      metrics: performanceMetrics
    };
    scores.performance.details = perfChecks;
    scores.performance.total = perfChecks.loadTime + perfChecks.resourceCount + perfChecks.jsPerformance + perfChecks.domComplexity;

    // Accessibility checks (100 points)
    const a11yChecks = await page.evaluate(() => {
      const results = { semanticHTML: 0, ariaAttributes: 0, keyboardNavigation: 0, altText: 0 };

      // 1. Semantic HTML (25 points)
      const hasSemanticTags = !!(
        document.querySelector('main, header, nav, section, article, aside, footer')
      );
      results.semanticHTML = hasSemanticTags ? 25 : 15;

      // 2. ARIA attributes (25 points)
      const elementsWithAria = document.querySelectorAll('[aria-label], [aria-labelledby], [role]');
      results.ariaAttributes = elementsWithAria.length > 0 ? 25 : 15;

      // 3. Keyboard navigation (25 points)
      const focusableElements = document.querySelectorAll('button, a, input, textarea, select, [tabindex="0"]');
      results.keyboardNavigation = focusableElements.length > 0 ? 25 : 0;

      // 4. Alt text for images (25 points)
      const images = document.querySelectorAll('img');
      const imagesWithAlt = Array.from(images).filter(img => img.alt).length;
      results.altText = images.length === 0 ? 25 : (imagesWithAlt === images.length ? 25 : 15);

      return results;
    });
    scores.accessibility.details = a11yChecks;
    scores.accessibility.total = Object.values(a11yChecks).reduce((a, b) => a + b, 0);

    // Calculate overall score (weighted average)
    scores.overall = Math.round(
      (scores.desktop.total * 0.25 +
       scores.mobile.total * 0.25 +
       scores.performance.total * 0.25 +
       scores.accessibility.total * 0.25)
    );

    // Generate suggestions
    if (scores.overall >= 90) {
      scores.suggestions.push('✅ 各方面表现优秀！');
    }
    if (scores.mobile.total < 80) {
      scores.issues.push('移动端体验需要改进：增大触摸目标、优化布局');
    }
    if (scores.accessibility.total < 70) {
      scores.issues.push('可访问性不足：添加 ARIA 属性、改善键盘导航');
    }
    if (scores.performance.total < 80) {
      scores.issues.push('性能有待优化：减少资源加载、优化 JavaScript');
    }

  } catch (error) {
    scores.issues.push(`测试错误: ${error.message}`);
  }

  return scores;
}

// Test a single tool
async function testTool(browser, tool, retries = 0) {
  const page = await browser.newPage();

  try {
    // Use file:// protocol for local testing
    const absolutePath = path.resolve(__dirname, '../../', tool.path);
    const url = `file://${absolutePath}`;
    console.log(`  Testing: ${tool.name}`);

    const scores = await checkUIQuality(page, url, tool.name);

    // Take screenshot
    const screenshotName = tool.path.replace(/\//g, '_').replace('.html', '.png');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, screenshotName),
      fullPage: true
    });

    await page.close();

    return {
      name: tool.name,
      path: tool.path,
      scores,
      screenshot: screenshotName
    };

  } catch (error) {
    await page.close();

    // Retry logic
    if (retries < MAX_RETRIES) {
      console.log(`    ⚠️ Retry ${retries + 1}/${MAX_RETRIES}: ${tool.name}`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
      return testTool(browser, tool, retries + 1);
    }

    console.log(`    ❌ Failed: ${tool.name} - ${error.message}`);
    return {
      name: tool.name,
      path: tool.path,
      error: error.message,
      scores: null
    };
  }
}

// Test a batch of tools
async function testBatch(batchNumber, tools) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📦 Batch ${batchNumber}/${numBatches} - Testing ${tools.length} tools`);
  console.log(`${'='.repeat(60)}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const results = [];

  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    const result = await testTool(browser, tool);
    results.push(result);

    // Save checkpoint every N tools
    if ((i + 1) % CHECKPOINT_INTERVAL === 0) {
      const allResults = [...existingResults, ...results];
      fs.writeFileSync(ENHANCED_REPORT_PATH, JSON.stringify(allResults, null, 2));
      console.log(`  💾 Checkpoint saved (${i + 1}/${tools.length} tools)`);
    }
  }

  await browser.close();

  // Save final batch results
  existingResults.push(...results);
  fs.writeFileSync(ENHANCED_REPORT_PATH, JSON.stringify(existingResults, null, 2));

  const successCount = results.filter(r => r.scores && r.scores.overall > 0).length;
  console.log(`\n✅ Batch ${batchNumber} completed: ${successCount}/${results.length} passed\n`);

  return results;
}

// Main execution
async function main() {
  const startTime = Date.now();

  for (let i = 0; i < numBatches; i++) {
    const start = i * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, untestedTools.length);
    const batch = untestedTools.slice(start, end);

    await testBatch(i + 1, batch);

    // Brief pause between batches to avoid resource exhaustion
    if (i < numBatches - 1) {
      console.log('⏸️  Pausing 5 seconds before next batch...\n');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

  // Final statistics
  const finalResults = JSON.parse(fs.readFileSync(ENHANCED_REPORT_PATH, 'utf8'));
  const totalTested = finalResults.filter(r => r.scores && r.scores.overall > 0).length;
  const totalFailed = finalResults.filter(r => !r.scores || r.scores.overall === 0).length;

  console.log(`\n${'='.repeat(60)}`);
  console.log(`🎉 All batches completed in ${duration} minutes`);
  console.log(`${'='.repeat(60)}`);
  console.log(`\n📊 Final Statistics:`);
  console.log(`   Total tools: ${allTools.length}`);
  console.log(`   ✅ Successfully tested: ${totalTested} (${(totalTested/allTools.length*100).toFixed(1)}%)`);
  console.log(`   ❌ Failed: ${totalFailed} (${(totalFailed/allTools.length*100).toFixed(1)}%)`);
  console.log(`\n📁 Results saved to: ${ENHANCED_REPORT_PATH}\n`);
}

// Run main function
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
