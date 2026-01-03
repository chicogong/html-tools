/**
 * 批量测试脚本 - 支持分批次测试
 * 使用: OFFSET=0 LIMIT=250 node batch-test.cjs
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');
const handler = require('serve-handler');

const toolsJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../../tools.json'), 'utf8'));
const tools = Object.values(toolsJson.tools);

const offset = parseInt(process.env.OFFSET || '0');
const limit = parseInt(process.env.LIMIT || tools.length);
const port = parseInt(process.env.PORT || '8891');
const outputFile = process.env.OUTPUT || path.join(__dirname, `batch-${offset}-${offset + limit}.json`);

console.log(`📊 批量测试配置:`);
console.log(`   工具范围: ${offset} - ${Math.min(offset + limit, tools.length)}`);
console.log(`   端口: ${port}`);
console.log(`   输出: ${outputFile}`);

// 启动服务器
function startServer() {
  const server = http.createServer((request, response) => {
    return handler(request, response, {
      public: path.join(__dirname, '../../'),
      cleanUrls: false
    });
  });

  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`📡 服务器运行在 http://localhost:${port}`);
      resolve(server);
    });
  });
}

// 快速UI评估（简化版，只测核心指标）
async function quickEvaluate(page) {
  const scores = { total: 0, details: {} };

  try {
    // 响应式 (20分)
    const hasViewportMeta = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]');
      return meta && meta.content.includes('width=device-width');
    });
    scores.details.responsive = hasViewportMeta ? 20 : 0;
    scores.total += scores.details.responsive;

    // 色彩对比度 (15分)
    const colorContrast = await page.evaluate(() => {
      const body = document.body;
      const style = window.getComputedStyle(body);
      return { bgColor: style.backgroundColor, textColor: style.color };
    });
    scores.details.colorContrast = (colorContrast.bgColor && colorContrast.textColor) ? 15 : 0;
    scores.total += scores.details.colorContrast;

    // 表单可用性 (15分)
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
      scores.details.formUsability = Math.round((formUsability.withLabels / formUsability.totalInputs) * 15);
    } else {
      scores.details.formUsability = 15;
    }
    scores.total += scores.details.formUsability;

    // 交互性 (15分)
    const interactivity = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button, .btn, [role="button"], a[href]');
      return { buttonCount: buttons.length };
    });
    scores.details.interactivity = interactivity.buttonCount > 0 ? 15 : 5;
    scores.total += scores.details.interactivity;

    // 布局间距 (10分)
    const layout = await page.evaluate(() => {
      const containers = document.querySelectorAll('div, section, main');
      const hasPadding = Array.from(containers).some(el => {
        const style = window.getComputedStyle(el);
        return parseFloat(style.padding) > 0;
      });
      return { hasPadding };
    });
    scores.details.layout = layout.hasPadding ? 10 : 5;
    scores.total += scores.details.layout;

    // 字体排版 (10分)
    const typography = await page.evaluate(() => {
      const body = document.body;
      const style = window.getComputedStyle(body);
      const fontSize = parseFloat(style.fontSize);
      const lineHeight = parseFloat(style.lineHeight);
      return { fontSize, lineHeight };
    });
    if (typography.fontSize >= 14 && typography.lineHeight >= 1.4 * typography.fontSize) {
      scores.details.typography = 10;
    } else {
      scores.details.typography = 5;
    }
    scores.total += scores.details.typography;

    // 加载性能 (10分)
    const performanceData = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      return {
        loadComplete: perfData?.loadEventEnd - perfData?.loadEventStart
      };
    });
    if (performanceData.loadComplete < 1000) {
      scores.details.performance = 10;
    } else if (performanceData.loadComplete < 2000) {
      scores.details.performance = 5;
    } else {
      scores.details.performance = 2;
    }
    scores.total += scores.details.performance;

    // 错误处理 (5分)
    scores.details.errorHandling = 5;
    scores.total += 5;

  } catch (error) {
    console.error(`评估错误: ${error.message}`);
  }

  return scores;
}

async function testTool(browser, tool) {
  const page = await browser.newPage();
  const url = `http://localhost:${port}/${tool.path}`;

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 500));

    const scores = await quickEvaluate(page);

    return {
      name: tool.name,
      path: tool.path,
      score: scores.total,
      details: scores.details
    };
  } catch (error) {
    return {
      name: tool.name,
      path: tool.path,
      score: 0,
      error: error.message
    };
  } finally {
    await page.close();
  }
}

async function runBatchTest() {
  const server = await startServer();
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const toolsToTest = tools.slice(offset, Math.min(offset + limit, tools.length));
  console.log(`\n开始测试 ${toolsToTest.length} 个工具...\n`);

  const results = [];
  let completed = 0;

  for (const tool of toolsToTest) {
    const result = await testTool(browser, tool);
    results.push(result);
    completed++;

    if (completed % 50 === 0 || completed === toolsToTest.length) {
      console.log(`✓ 已完成: ${completed}/${toolsToTest.length} (${Math.round(completed / toolsToTest.length * 100)}%)`);
    }
  }

  // 保存结果
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`\n✅ 结果已保存: ${outputFile}`);

  // 统计
  const stats = {
    excellent: results.filter(r => r.score >= 90).length,
    good: results.filter(r => r.score >= 75 && r.score < 90).length,
    needsWork: results.filter(r => r.score < 75).length,
    avg: Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
  };

  console.log(`\n📊 统计:`);
  console.log(`   优秀 (≥90): ${stats.excellent}`);
  console.log(`   良好 (75-89): ${stats.good}`);
  console.log(`   需改进 (<75): ${stats.needsWork}`);
  console.log(`   平均分: ${stats.avg}`);

  await browser.close();
  server.close();
}

runBatchTest().catch(console.error);
