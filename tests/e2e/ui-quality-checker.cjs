/**
 * UI Quality Checker
 * 评估所有工具的UI质量并生成优化建议
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');
const handler = require('serve-handler');

const toolsJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../../tools.json'), 'utf8'));
const tools = Object.values(toolsJson.tools);

// Simple static file server
function startServer(port = 8889) {
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

async function evaluateUIQuality(page, toolPath, toolName) {
  const scores = {
    total: 0,
    details: {},
    issues: [],
    suggestions: []
  };

  try {
    // 1. 检查响应式设计 (20分)
    const viewportWidth = page.viewport().width;
    const hasViewportMeta = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]');
      return meta && meta.content.includes('width=device-width');
    });
    if (hasViewportMeta) {
      scores.details.responsive = 20;
      scores.total += 20;
    } else {
      scores.issues.push('缺少响应式viewport meta标签');
    }

    // 2. 检查色彩对比度和可读性 (15分)
    const colorContrast = await page.evaluate(() => {
      const body = document.body;
      const style = window.getComputedStyle(body);
      const bgColor = style.backgroundColor;
      const textColor = style.color;
      return { bgColor, textColor };
    });
    if (colorContrast.bgColor && colorContrast.textColor) {
      scores.details.colorContrast = 15;
      scores.total += 15;
    }

    // 3. 检查表单可用性 (15分)
    const formUsability = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input, textarea, select');
      const hasLabels = Array.from(inputs).some(input => {
        return input.labels && input.labels.length > 0 ||
               input.getAttribute('aria-label') ||
               input.getAttribute('placeholder');
      });
      return { hasInputs: inputs.length > 0, hasLabels };
    });
    if (formUsability.hasInputs) {
      if (formUsability.hasLabels) {
        scores.details.formUsability = 15;
        scores.total += 15;
      } else {
        scores.details.formUsability = 8;
        scores.total += 8;
        scores.issues.push('部分输入框缺少标签或占位符');
      }
    } else {
      scores.details.formUsability = 15; // 没有表单则不扣分
      scores.total += 15;
    }

    // 4. 检查按钮和交互元素 (15分)
    const interactivity = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button, .btn, [role="button"]');
      const hasClickHandlers = Array.from(buttons).some(btn => {
        return btn.onclick || btn.hasAttribute('onclick');
      });
      return { buttonCount: buttons.length, hasClickHandlers };
    });
    if (interactivity.buttonCount > 0) {
      scores.details.interactivity = 15;
      scores.total += 15;
    } else {
      scores.details.interactivity = 5;
      scores.total += 5;
      scores.issues.push('交互元素较少');
    }

    // 5. 检查布局和间距 (10分)
    const layout = await page.evaluate(() => {
      const containers = document.querySelectorAll('div, section, main');
      const hasPadding = Array.from(containers).some(el => {
        const style = window.getComputedStyle(el);
        return parseFloat(style.padding) > 0;
      });
      return { hasPadding };
    });
    if (layout.hasPadding) {
      scores.details.layout = 10;
      scores.total += 10;
    } else {
      scores.details.layout = 5;
      scores.total += 5;
      scores.issues.push('布局间距可能不够充分');
    }

    // 6. 检查字体和排版 (10分)
    const typography = await page.evaluate(() => {
      const body = document.body;
      const style = window.getComputedStyle(body);
      const fontSize = parseFloat(style.fontSize);
      const lineHeight = parseFloat(style.lineHeight);
      const fontFamily = style.fontFamily;
      return { fontSize, lineHeight, fontFamily };
    });
    if (typography.fontSize >= 14 && typography.lineHeight >= 1.4) {
      scores.details.typography = 10;
      scores.total += 10;
    } else {
      scores.details.typography = 5;
      scores.total += 5;
      scores.issues.push('字体大小或行高可能需要调整');
    }

    // 7. 检查加载性能 (10分)
    const performanceMetrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: perfData?.domContentLoadedEventEnd - perfData?.domContentLoadedEventStart,
        loadComplete: perfData?.loadEventEnd - perfData?.loadEventStart
      };
    });
    if (performanceMetrics.domContentLoaded < 1000) {
      scores.details.performance = 10;
      scores.total += 10;
    } else {
      scores.details.performance = 5;
      scores.total += 5;
      scores.issues.push('页面加载可能较慢');
    }

    // 8. 检查错误处理和反馈 (5分)
    const errorHandling = await page.evaluate(() => {
      const hasErrorMessages = document.querySelectorAll('.error, .warning, [role="alert"]').length > 0;
      return { hasErrorMessages };
    });
    scores.details.errorHandling = 5; // 基础分
    scores.total += 5;

    // 生成优化建议
    if (scores.total < 60) {
      scores.suggestions.push('🚨 需要大幅优化UI设计和用户体验');
    } else if (scores.total < 75) {
      scores.suggestions.push('⚠️ 建议优化部分UI元素以提升用户体验');
    } else if (scores.total < 90) {
      scores.suggestions.push('✨ UI质量良好，可进行细节优化');
    } else {
      scores.suggestions.push('✅ UI质量优秀！');
    }

    return scores;

  } catch (error) {
    console.error(`评估工具 ${toolName} 时出错:`, error.message);
    return scores;
  }
}

async function analyzeToolUI(browser, toolPath, toolName) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  const url = `http://localhost:8889/${toolPath}`;

  try {
    console.log(`\n📊 分析: ${toolName}`);

    // Navigate to tool
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 15000
    });

    // Wait for page to settle
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 评估UI质量
    const scores = await evaluateUIQuality(page, toolPath, toolName);

    // Take screenshot
    const screenshotDir = path.join(__dirname, 'ui-screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const screenshotName = toolPath.replace(/\//g, '_').replace('.html', '.png');
    await page.screenshot({
      path: path.join(screenshotDir, screenshotName),
      fullPage: true
    });

    console.log(`   得分: ${scores.total}/100`);
    console.log(`   详细评分:`);
    console.log(`   - 响应式设计: ${scores.details.responsive || 0}/20`);
    console.log(`   - 色彩对比度: ${scores.details.colorContrast || 0}/15`);
    console.log(`   - 表单可用性: ${scores.details.formUsability || 0}/15`);
    console.log(`   - 交互性: ${scores.details.interactivity || 0}/15`);
    console.log(`   - 布局间距: ${scores.details.layout || 0}/10`);
    console.log(`   - 字体排版: ${scores.details.typography || 0}/10`);
    console.log(`   - 加载性能: ${scores.details.performance || 0}/10`);
    console.log(`   - 错误处理: ${scores.details.errorHandling || 0}/5`);

    if (scores.issues.length > 0) {
      console.log(`   问题:`);
      scores.issues.forEach(issue => console.log(`   - ${issue}`));
    }

    if (scores.suggestions.length > 0) {
      console.log(`   建议:`);
      scores.suggestions.forEach(sug => console.log(`   - ${sug}`));
    }

    return {
      name: toolName,
      path: toolPath,
      score: scores.total,
      details: scores.details,
      issues: scores.issues,
      suggestions: scores.suggestions,
      screenshot: screenshotName
    };

  } catch (error) {
    console.log(`   ❌ 分析失败: ${error.message}`);
    return {
      name: toolName,
      path: toolPath,
      score: 0,
      error: error.message
    };
  } finally {
    await page.close();
  }
}

async function runUIAnalysis() {
  console.log('\n🎨 UI质量分析器\n');
  console.log(`分析 ${tools.length} 个工具的UI质量...\n`);

  // Start local server
  const server = await startServer();

  // Launch browser
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  console.log('🌐 Browser launched');

  const results = [];

  // 限制测试数量以节省时间（可通过环境变量调整）
  const maxTools = process.env.MAX_TOOLS ? parseInt(process.env.MAX_TOOLS) : 20;
  const toolsToAnalyze = tools.slice(0, Math.min(maxTools, tools.length));

  console.log(`\n将分析前 ${toolsToAnalyze.length} 个工具 (设置 MAX_TOOLS=N 可调整数量)\n`);

  for (const tool of toolsToAnalyze) {
    const result = await analyzeToolUI(browser, tool.path, tool.name);
    results.push(result);
  }

  // 按分数排序
  results.sort((a, b) => b.score - a.score);

  // 生成报告
  console.log('\n' + '='.repeat(70));
  console.log('📈 UI质量报告');
  console.log('='.repeat(70));

  // 分数区间统计
  const excellent = results.filter(r => r.score >= 90);
  const good = results.filter(r => r.score >= 75 && r.score < 90);
  const needsImprovement = results.filter(r => r.score >= 60 && r.score < 75);
  const poor = results.filter(r => r.score < 60);

  console.log(`\n分数分布:`);
  console.log(`  ✅ 优秀 (90-100分): ${excellent.length} 个`);
  console.log(`  ✨ 良好 (75-89分): ${good.length} 个`);
  console.log(`  ⚠️  需改进 (60-74分): ${needsImprovement.length} 个`);
  console.log(`  🚨 急需优化 (<60分): ${poor.length} 个`);

  // 前10名工具
  console.log(`\n🏆 得分最高的工具:`);
  results.slice(0, 10).forEach((result, index) => {
    console.log(`  ${index + 1}. ${result.name} - ${result.score}/100`);
  });

  // 需要优化的工具
  if (poor.length > 0) {
    console.log(`\n🚨 急需优化的工具 (分数 < 60):`);
    poor.forEach((result, index) => {
      console.log(`\n  ${index + 1}. ${result.name} - ${result.score}/100`);
      console.log(`     路径: ${result.path}`);
      if (result.issues && result.issues.length > 0) {
        console.log(`     问题:`);
        result.issues.forEach(issue => console.log(`     - ${issue}`));
      }
    });
  }

  // 保存详细报告
  const reportPath = path.join(__dirname, 'ui-quality-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 详细报告已保存到: ${reportPath}`);

  // 生成Markdown报告
  let mdReport = `# UI质量分析报告\n\n`;
  mdReport += `分析时间: ${new Date().toLocaleString('zh-CN')}\n`;
  mdReport += `分析工具数: ${results.length}\n\n`;

  mdReport += `## 分数分布\n\n`;
  mdReport += `- ✅ 优秀 (90-100分): ${excellent.length} 个\n`;
  mdReport += `- ✨ 良好 (75-89分): ${good.length} 个\n`;
  mdReport += `- ⚠️ 需改进 (60-74分): ${needsImprovement.length} 个\n`;
  mdReport += `- 🚨 急需优化 (<60分): ${poor.length} 个\n\n`;

  mdReport += `## 详细评分\n\n`;
  mdReport += `| 排名 | 工具名称 | 总分 | 响应式 | 色彩 | 表单 | 交互 | 布局 | 字体 | 性能 | 错误处理 |\n`;
  mdReport += `|------|---------|------|--------|------|------|------|------|------|------|---------|\n`;

  results.forEach((result, index) => {
    mdReport += `| ${index + 1} | ${result.name} | ${result.score} | `;
    mdReport += `${result.details?.responsive || 0}/20 | `;
    mdReport += `${result.details?.colorContrast || 0}/15 | `;
    mdReport += `${result.details?.formUsability || 0}/15 | `;
    mdReport += `${result.details?.interactivity || 0}/15 | `;
    mdReport += `${result.details?.layout || 0}/10 | `;
    mdReport += `${result.details?.typography || 0}/10 | `;
    mdReport += `${result.details?.performance || 0}/10 | `;
    mdReport += `${result.details?.errorHandling || 0}/5 |\n`;
  });

  if (poor.length > 0) {
    mdReport += `\n## 🚨 急需优化的工具\n\n`;
    poor.forEach(result => {
      mdReport += `### ${result.name} (${result.score}/100)\n\n`;
      mdReport += `路径: \`${result.path}\`\n\n`;
      if (result.issues && result.issues.length > 0) {
        mdReport += `**问题:**\n`;
        result.issues.forEach(issue => mdReport += `- ${issue}\n`);
        mdReport += `\n`;
      }
      if (result.suggestions && result.suggestions.length > 0) {
        mdReport += `**建议:**\n`;
        result.suggestions.forEach(sug => mdReport += `- ${sug}\n`);
        mdReport += `\n`;
      }
    });
  }

  const mdReportPath = path.join(__dirname, 'ui-quality-report.md');
  fs.writeFileSync(mdReportPath, mdReport);
  console.log(`📄 Markdown报告已保存到: ${mdReportPath}`);

  // Cleanup
  await browser.close();
  server.close();

  console.log('\n✨ 分析完成！\n');
}

// Run analysis
runUIAnalysis().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
