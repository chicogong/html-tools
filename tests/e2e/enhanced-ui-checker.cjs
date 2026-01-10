/**
 * Enhanced UI Quality Checker
 * 包含移动端、性能和可访问性测试
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');
const handler = require('serve-handler');

const toolsJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../../tools.json'), 'utf8'));
const tools = Object.values(toolsJson.tools);

// 全局服务器端口
let SERVER_PORT = 8890;

// 启动服务器
function startServer(port = 8890) {
  const server = http.createServer((request, response) => {
    return handler(request, response, {
      public: path.join(__dirname, '../../'),
      cleanUrls: false
    });
  });

  return new Promise((resolve, reject) => {
    server.listen(port, '127.0.0.1', () => {
      SERVER_PORT = port;
      console.log(`📡 测试服务器运行在 http://localhost:${port}`);
      resolve(server);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ 端口 ${port} 被占用，尝试 ${port + 1}...`);
        startServer(port + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

// 增强版UI质量评估
async function enhancedEvaluation(page, toolPath, toolName) {
  const scores = {
    desktop: { total: 0, details: {} },
    mobile: { total: 0, details: {} },
    performance: { total: 0, details: {} },
    accessibility: { total: 0, details: {} },
    overall: 0,
    issues: [],
    suggestions: []
  };

  const url = `http://127.0.0.1:${SERVER_PORT}/${toolPath}`;

  try {
    // ============ 桌面端测试 ============
    console.log(`   📱 桌面端测试...`);
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 1000));

    scores.desktop = await evaluateBasicUI(page);

    // ============ 移动端测试 ============
    console.log(`   📱 移动端测试...`);
    await page.setViewport({ width: 375, height: 667 }); // iPhone SE
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 1000));

    scores.mobile = await evaluateMobileUI(page);

    // ============ 性能测试 ============
    console.log(`   ⚡ 性能测试...`);
    await page.setViewport({ width: 1920, height: 1080 });
    const performanceMetrics = await page.goto(url, { waitUntil: 'load', timeout: 30000 });

    scores.performance = await evaluatePerformance(page, performanceMetrics);

    // ============ 可访问性测试 ============
    console.log(`   ♿ 可访问性测试...`);
    scores.accessibility = await evaluateAccessibility(page);

    // 计算总分
    scores.overall = Math.round(
      (scores.desktop.total * 0.3 +
       scores.mobile.total * 0.25 +
       scores.performance.total * 0.25 +
       scores.accessibility.total * 0.2)
    );

    // 生成建议
    if (scores.overall < 60) {
      scores.suggestions.push('🚨 急需全面优化UI、性能和可访问性');
    } else if (scores.overall < 75) {
      scores.suggestions.push('⚠️ 建议改进移动端体验和性能');
    } else if (scores.overall < 90) {
      scores.suggestions.push('✨ 总体良好，可进行细节优化');
    } else {
      scores.suggestions.push('✅ 各方面表现优秀！');
    }

    return scores;

  } catch (error) {
    console.error(`   ❌ 评估失败: ${error.message}`);
    scores.error = error.message;
    return scores;
  }
}

// 基础UI评估
async function evaluateBasicUI(page) {
  const scores = { total: 0, details: {} };

  // 响应式设计 (20分)
  const hasViewportMeta = await page.evaluate(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    return meta && meta.content.includes('width=device-width');
  });
  scores.details.responsive = hasViewportMeta ? 20 : 0;
  scores.total += scores.details.responsive;

  // 色彩对比度 (20分)
  const colorContrast = await page.evaluate(() => {
    const body = document.body;
    const style = window.getComputedStyle(body);
    return { bgColor: style.backgroundColor, textColor: style.color };
  });
  scores.details.colorContrast = (colorContrast.bgColor && colorContrast.textColor) ? 20 : 0;
  scores.total += scores.details.colorContrast;

  // 表单可用性 (20分)
  const formUsability = await page.evaluate(() => {
    const inputs = document.querySelectorAll('input, textarea, select');
    const totalInputs = inputs.length;
    const withLabels = Array.from(inputs).filter(input => {
      return input.labels && input.labels.length > 0 ||
             input.getAttribute('aria-label') ||
             input.getAttribute('placeholder');
    }).length;
    return { totalInputs, withLabels };
  });
  if (formUsability.totalInputs > 0) {
    scores.details.formUsability = Math.round((formUsability.withLabels / formUsability.totalInputs) * 20);
  } else {
    scores.details.formUsability = 20; // 没有表单不扣分
  }
  scores.total += scores.details.formUsability;

  // 交互性 (20分)
  const interactivity = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button, .btn, [role="button"], a[href]');
    return { buttonCount: buttons.length };
  });
  scores.details.interactivity = interactivity.buttonCount > 0 ? 20 : 5;
  scores.total += scores.details.interactivity;

  // 字体排版 (20分)
  const typography = await page.evaluate(() => {
    const body = document.body;
    const style = window.getComputedStyle(body);
    const fontSize = parseFloat(style.fontSize);
    const lineHeight = parseFloat(style.lineHeight);
    return { fontSize, lineHeight };
  });
  if (typography.fontSize >= 14 && typography.lineHeight >= 1.4 * typography.fontSize) {
    scores.details.typography = 20;
  } else {
    scores.details.typography = 10;
  }
  scores.total += scores.details.typography;

  return scores;
}

// 移动端UI评估
async function evaluateMobileUI(page) {
  const scores = { total: 0, details: {} };

  // 触摸目标大小 (30分)
  const touchTargets = await page.evaluate(() => {
    const interactiveElements = document.querySelectorAll('button, a, input, select, [role="button"]');
    const smallTargets = Array.from(interactiveElements).filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width < 44 || rect.height < 44; // 最小推荐44x44px
    });
    return {
      total: interactiveElements.length,
      small: smallTargets.length
    };
  });
  if (touchTargets.total > 0) {
    const ratio = 1 - (touchTargets.small / touchTargets.total);
    scores.details.touchTargets = Math.round(ratio * 30);
  } else {
    scores.details.touchTargets = 30;
  }
  scores.total += scores.details.touchTargets;

  // 文字可读性 (25分)
  const textReadability = await page.evaluate(() => {
    const body = document.body;
    const style = window.getComputedStyle(body);
    const fontSize = parseFloat(style.fontSize);
    return { fontSize };
  });
  scores.details.textReadability = textReadability.fontSize >= 16 ? 25 : 15;
  scores.total += scores.details.textReadability;

  // 水平滚动 (25分)
  const hasHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  scores.details.noHorizontalScroll = hasHorizontalScroll ? 15 : 25;
  scores.total += scores.details.noHorizontalScroll;

  // 移动端友好布局 (20分)
  const mobileLayout = await page.evaluate(() => {
    const flexGridElements = document.querySelectorAll('[style*="flex"], [style*="grid"], [class*="flex"], [class*="grid"]');
    return { count: flexGridElements.length };
  });
  scores.details.mobileLayout = mobileLayout.count > 0 ? 20 : 10;
  scores.total += scores.details.mobileLayout;

  return scores;
}

// 性能评估
async function evaluatePerformance(page, response) {
  const scores = { total: 0, details: {} };

  // 页面加载时间 (30分)
  const metrics = await page.metrics();
  const performanceData = await page.evaluate(() => {
    const perfData = performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded: perfData?.domContentLoadedEventEnd - perfData?.domContentLoadedEventStart,
      loadComplete: perfData?.loadEventEnd - perfData?.loadEventStart,
      responseTime: perfData?.responseEnd - perfData?.requestStart
    };
  });

  if (performanceData.loadComplete < 1000) {
    scores.details.loadTime = 30;
  } else if (performanceData.loadComplete < 2000) {
    scores.details.loadTime = 20;
  } else if (performanceData.loadComplete < 3000) {
    scores.details.loadTime = 10;
  } else {
    scores.details.loadTime = 5;
  }
  scores.total += scores.details.loadTime;

  // 资源数量 (25分)
  const resources = await page.evaluate(() => {
    const entries = performance.getEntriesByType('resource');
    return {
      total: entries.length,
      scripts: entries.filter(e => e.initiatorType === 'script').length,
      styles: entries.filter(e => e.initiatorType === 'link' || e.initiatorType === 'css').length,
      images: entries.filter(e => e.initiatorType === 'img').length
    };
  });
  if (resources.total < 20) {
    scores.details.resourceCount = 25;
  } else if (resources.total < 50) {
    scores.details.resourceCount = 15;
  } else {
    scores.details.resourceCount = 5;
  }
  scores.total += scores.details.resourceCount;

  // JavaScript执行时间 (25分)
  const jsHeapSize = metrics.JSHeapUsedSize / (1024 * 1024); // MB
  if (jsHeapSize < 5) {
    scores.details.jsPerformance = 25;
  } else if (jsHeapSize < 10) {
    scores.details.jsPerformance = 15;
  } else {
    scores.details.jsPerformance = 5;
  }
  scores.total += scores.details.jsPerformance;

  // DOM节点数量 (20分)
  const domStats = await page.evaluate(() => {
    return {
      nodeCount: document.querySelectorAll('*').length,
      depth: getMaxDepth(document.body)
    };
    function getMaxDepth(element) {
      let maxDepth = 0;
      Array.from(element.children).forEach(child => {
        maxDepth = Math.max(maxDepth, getMaxDepth(child) + 1);
      });
      return maxDepth;
    }
  });
  if (domStats.nodeCount < 500) {
    scores.details.domComplexity = 20;
  } else if (domStats.nodeCount < 1000) {
    scores.details.domComplexity = 15;
  } else {
    scores.details.domComplexity = 5;
  }
  scores.total += scores.details.domComplexity;

  scores.details.metrics = {
    loadTime: performanceData.loadComplete,
    resources: resources.total,
    jsHeapMB: jsHeapSize.toFixed(2),
    domNodes: domStats.nodeCount
  };

  return scores;
}

// 可访问性评估
async function evaluateAccessibility(page) {
  const scores = { total: 0, details: {} };

  // 语义化HTML (25分)
  const semanticHTML = await page.evaluate(() => {
    const semanticTags = document.querySelectorAll('main, header, footer, nav, article, section, aside');
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    return {
      semanticCount: semanticTags.length,
      headingCount: headings.length,
      hasH1: document.querySelector('h1') !== null
    };
  });
  let semanticScore = 0;
  if (semanticHTML.semanticCount > 0) semanticScore += 10;
  if (semanticHTML.headingCount > 0) semanticScore += 10;
  if (semanticHTML.hasH1) semanticScore += 5;
  scores.details.semanticHTML = semanticScore;
  scores.total += semanticScore;

  // ARIA属性 (25分)
  const ariaUsage = await page.evaluate(() => {
    const elementsWithAria = document.querySelectorAll('[role], [aria-label], [aria-labelledby], [aria-describedby]');
    const buttons = document.querySelectorAll('button');
    const buttonsWithAria = document.querySelectorAll('button[aria-label], button[aria-labelledby]');
    return {
      ariaCount: elementsWithAria.length,
      buttonCount: buttons.length,
      buttonsWithAriaCount: buttonsWithAria.length
    };
  });
  scores.details.ariaAttributes = ariaUsage.ariaCount > 0 ? 25 : 10;
  scores.total += scores.details.ariaAttributes;

  // 键盘导航 (25分)
  const keyboardNav = await page.evaluate(() => {
    const focusableElements = document.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const withFocusStyles = Array.from(focusableElements).filter(el => {
      const styles = window.getComputedStyle(el);
      return styles.outlineWidth !== '0px' || styles.outlineStyle !== 'none';
    });
    return {
      focusableCount: focusableElements.length,
      withFocusStylesCount: withFocusStyles.length
    };
  });
  if (keyboardNav.focusableCount > 0) {
    const ratio = keyboardNav.withFocusStylesCount / keyboardNav.focusableCount;
    scores.details.keyboardNavigation = Math.round(ratio * 25);
  } else {
    scores.details.keyboardNavigation = 25;
  }
  scores.total += scores.details.keyboardNavigation;

  // Alt文本 (25分)
  const altText = await page.evaluate(() => {
    const images = document.querySelectorAll('img');
    const imagesWithAlt = document.querySelectorAll('img[alt]');
    return {
      imageCount: images.length,
      imagesWithAltCount: imagesWithAlt.length
    };
  });
  if (altText.imageCount > 0) {
    const ratio = altText.imagesWithAltCount / altText.imageCount;
    scores.details.altText = Math.round(ratio * 25);
  } else {
    scores.details.altText = 25; // 没有图片不扣分
  }
  scores.total += scores.details.altText;

  return scores;
}

// 主测试函数
async function analyzeToolEnhanced(browser, toolPath, toolName) {
  const page = await browser.newPage();

  try {
    console.log(`\n📊 增强分析: ${toolName}`);
    console.log(`   路径: ${toolPath}`);

    const scores = await enhancedEvaluation(page, toolPath, toolName);

    console.log(`\n   🎯 综合得分: ${scores.overall}/100`);
    console.log(`   📊 详细评分:`);
    console.log(`      桌面端: ${scores.desktop.total}/100`);
    console.log(`      移动端: ${scores.mobile.total}/100`);
    console.log(`      性能: ${scores.performance.total}/100`);
    console.log(`      可访问性: ${scores.accessibility.total}/100`);

    if (scores.performance.details.metrics) {
      console.log(`   ⚡ 性能指标:`);
      console.log(`      加载时间: ${scores.performance.details.metrics.loadTime}ms`);
      console.log(`      资源数量: ${scores.performance.details.metrics.resources}`);
      console.log(`      JS堆大小: ${scores.performance.details.metrics.jsHeapMB}MB`);
      console.log(`      DOM节点: ${scores.performance.details.metrics.domNodes}`);
    }

    if (scores.suggestions.length > 0) {
      console.log(`   💡 建议:`);
      scores.suggestions.forEach(sug => console.log(`      ${sug}`));
    }

    // 截图
    const screenshotDir = path.join(__dirname, 'enhanced-screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const screenshotName = toolPath.replace(/\//g, '_').replace('.html', '.png');
    await page.setViewport({ width: 1920, height: 1080 });
    await page.screenshot({
      path: path.join(screenshotDir, screenshotName),
      fullPage: true
    });

    return {
      name: toolName,
      path: toolPath,
      scores,
      screenshot: screenshotName
    };

  } catch (error) {
    console.log(`   ❌ 分析失败: ${error.message}`);
    return {
      name: toolName,
      path: toolPath,
      error: error.message,
      score: 0,
      details: {}
    };
  } finally {
    try {
      if (page && !page.isClosed()) {
        await page.close();
      }
    } catch (closeError) {
      console.log(`   ⚠️ 页面关闭失败: ${closeError.message}`);
    }
  }
}

// 运行增强测试
async function runEnhancedTests() {
  console.log('\n🚀 增强版UI质量分析器');
  console.log('包含：桌面端、移动端、性能和可访问性测试\n');

  const server = await startServer();
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  console.log('🌐 浏览器已启动');

  // 解析命令行参数
  let startIdx = 0;
  let endIdx = tools.length;
  let outputFile = null;

  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i].startsWith('--start=')) {
      startIdx = parseInt(process.argv[i].split('=')[1]) || 0;
    } else if (process.argv[i].startsWith('--end=')) {
      endIdx = parseInt(process.argv[i].split('=')[1]) || tools.length;
    } else if (process.argv[i].startsWith('--output=')) {
      outputFile = process.argv[i].split('=')[1];
    }
  }

  // 优先使用环境变量
  const maxTools = process.env.MAX_TOOLS ? parseInt(process.env.MAX_TOOLS) : null;
  if (maxTools) {
    endIdx = Math.min(maxTools, tools.length);
    startIdx = 0;
  }

  const toolsToTest = tools.slice(startIdx, Math.min(endIdx, tools.length));

  console.log(`\n将分析工具 ${startIdx} 至 ${Math.min(endIdx, tools.length) - 1}，共 ${toolsToTest.length} 个工具\n`);

  // 添加定期保存机制
  const CHECKPOINT_INTERVAL = 50; // 每50个工具保存一次

  const results = [];
  for (let i = 0; i < toolsToTest.length; i++) {
    const tool = toolsToTest[i];
    try {
      const result = await analyzeToolEnhanced(browser, tool.path, tool.name);
      results.push(result);
    } catch (toolError) {
      console.error(`❌ 工具 ${tool.name} 处理出错: ${toolError.message}`);
      results.push({
        name: tool.name,
        path: tool.path,
        error: toolError.message
      });
    }

    // 定期保存检查点
    if ((i + 1) % 50 === 0) {
      const checkpointPath = path.join(__dirname, `checkpoint-${startIdx}-${startIdx + i + 1}.json`);
      fs.writeFileSync(checkpointPath, JSON.stringify(results, null, 2));
      console.log(`\n✅ 检查点已保存: ${checkpointPath} (${i + 1}/${toolsToTest.length})`);
    }
  }

  // 生成报告
  console.log('\n' + '='.repeat(70));
  console.log('📈 增强版测试报告');
  console.log('='.repeat(70));

  // 按综合得分排序
  results.sort((a, b) => (b.scores?.overall || 0) - (a.scores?.overall || 0));

  const excellent = results.filter(r => r.scores?.overall >= 90);
  const good = results.filter(r => r.scores?.overall >= 75 && r.scores?.overall < 90);
  const needsImprovement = results.filter(r => r.scores?.overall >= 60 && r.scores?.overall < 75);
  const poor = results.filter(r => r.scores?.overall < 60);

  console.log(`\n综合得分分布:`);
  console.log(`  ✅ 优秀 (90-100分): ${excellent.length} 个`);
  console.log(`  ✨ 良好 (75-89分): ${good.length} 个`);
  console.log(`  ⚠️  需改进 (60-74分): ${needsImprovement.length} 个`);
  console.log(`  🚨 急需优化 (<60分): ${poor.length} 个`);

  // 保存JSON报告
  const reportPath = outputFile
    ? path.join(__dirname, outputFile)
    : path.join(__dirname, 'enhanced-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 详细报告已保存: ${reportPath}`);

  await browser.close();
  server.close();

  console.log('\n✨ 增强测试完成！\n');
}

runEnhancedTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
