/**
 * HTML可视化报告生成器
 * 基于JSON测试结果生成交互式HTML报告
 */
const fs = require('fs');
const path = require('path');

function generateHTMLReport(jsonReportPath, outputPath) {
  const results = JSON.parse(fs.readFileSync(jsonReportPath, 'utf8'));

  // 计算统计数据
  const stats = {
    total: results.length,
    excellent: results.filter(r => (r.score || r.scores?.overall || 0) >= 90).length,
    good: results.filter(r => {
      const score = r.score || r.scores?.overall || 0;
      return score >= 75 && score < 90;
    }).length,
    needsImprovement: results.filter(r => {
      const score = r.score || r.scores?.overall || 0;
      return score >= 60 && score < 75;
    }).length,
    poor: results.filter(r => (r.score || r.scores?.overall || 0) < 60).length,
    avgScore: Math.round(
      results.reduce((sum, r) => sum + (r.score || r.scores?.overall || 0), 0) / results.length
    )
  };

  // 检查是否是增强版报告
  const isEnhanced = results.some(r => r.scores && r.scores.desktop);

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UI质量测试报告 - WebUtils</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #333;
      line-height: 1.6;
      padding: 20px;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }

    .header h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
    }

    .header p {
      font-size: 1.1rem;
      opacity: 0.9;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      padding: 40px;
      background: #f8f9fa;
    }

    .stat-card {
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-card .number {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .stat-card .label {
      color: #666;
      font-size: 0.9rem;
    }

    .excellent { color: #10b981; }
    .good { color: #3b82f6; }
    .needs-improvement { color: #f59e0b; }
    .poor { color: #ef4444; }

    .filters {
      padding: 20px 40px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      align-items: center;
    }

    .filter-btn {
      padding: 10px 20px;
      border: 2px solid #e5e7eb;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .filter-btn:hover {
      border-color: #667eea;
      background: #f0f4ff;
    }

    .filter-btn.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .search-box {
      flex: 1;
      min-width: 250px;
      padding: 10px 15px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.9rem;
    }

    .search-box:focus {
      outline: none;
      border-color: #667eea;
    }

    .results {
      padding: 40px;
    }

    .tool-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
      transition: all 0.2s;
    }

    .tool-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .tool-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .tool-name {
      font-size: 1.3rem;
      font-weight: 600;
      color: #1f2937;
    }

    .tool-score {
      font-size: 2rem;
      font-weight: bold;
      padding: 8px 20px;
      border-radius: 8px;
      background: #f3f4f6;
    }

    .tool-path {
      color: #6b7280;
      font-size: 0.9rem;
      font-family: 'Monaco', 'Courier New', monospace;
      margin-bottom: 16px;
    }

    .score-breakdown {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
      margin-top: 16px;
    }

    .score-item {
      background: #f9fafb;
      padding: 12px;
      border-radius: 8px;
    }

    .score-item-label {
      font-size: 0.85rem;
      color: #6b7280;
      margin-bottom: 4px;
    }

    .score-item-value {
      font-size: 1.2rem;
      font-weight: 600;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 12px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s;
    }

    .issues {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
    }

    .issue-tag {
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 0.85rem;
      margin-right: 8px;
      margin-bottom: 8px;
    }

    .chart-container {
      padding: 40px;
      background: #f8f9fa;
    }

    .chart {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
    }

    .chart-title {
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .bar-chart {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .bar-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .bar-label {
      min-width: 120px;
      font-size: 0.9rem;
      color: #4b5563;
    }

    .bar {
      flex: 1;
      height: 30px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
      position: relative;
    }

    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 12px;
      color: white;
      font-weight: 600;
      font-size: 0.85rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎨 UI质量测试报告</h1>
      <p>生成时间: ${new Date().toLocaleString('zh-CN')} | 测试工具数: ${stats.total}</p>
    </div>

    <div class="stats">
      <div class="stat-card">
        <div class="number">${stats.total}</div>
        <div class="label">测试工具总数</div>
      </div>
      <div class="stat-card">
        <div class="number excellent">${stats.excellent}</div>
        <div class="label">优秀 (90-100)</div>
      </div>
      <div class="stat-card">
        <div class="number good">${stats.good}</div>
        <div class="label">良好 (75-89)</div>
      </div>
      <div class="stat-card">
        <div class="number needs-improvement">${stats.needsImprovement}</div>
        <div class="label">需改进 (60-74)</div>
      </div>
      <div class="stat-card">
        <div class="number poor">${stats.poor}</div>
        <div class="label">较差 (<60)</div>
      </div>
      <div class="stat-card">
        <div class="number">${stats.avgScore}</div>
        <div class="label">平均分数</div>
      </div>
    </div>

    <div class="filters">
      <button class="filter-btn active" onclick="filterTools('all')">全部</button>
      <button class="filter-btn" onclick="filterTools('excellent')">优秀</button>
      <button class="filter-btn" onclick="filterTools('good')">良好</button>
      <button class="filter-btn" onclick="filterTools('needs-improvement')">需改进</button>
      <button class="filter-btn" onclick="filterTools('poor')">较差</button>
      <input type="text" class="search-box" placeholder="搜索工具名称..." oninput="searchTools(this.value)">
    </div>

    <div class="chart-container">
      <div class="chart">
        <div class="chart-title">📊 分数分布</div>
        <div class="bar-chart">
          <div class="bar-item">
            <div class="bar-label">优秀 (90-100)</div>
            <div class="bar">
              <div class="bar-fill excellent" style="width: ${(stats.excellent / stats.total * 100)}%">
                ${stats.excellent}
              </div>
            </div>
          </div>
          <div class="bar-item">
            <div class="bar-label">良好 (75-89)</div>
            <div class="bar">
              <div class="bar-fill good" style="width: ${(stats.good / stats.total * 100)}%">
                ${stats.good}
              </div>
            </div>
          </div>
          <div class="bar-item">
            <div class="bar-label">需改进 (60-74)</div>
            <div class="bar">
              <div class="bar-fill needs-improvement" style="width: ${(stats.needsImprovement / stats.total * 100)}%">
                ${stats.needsImprovement}
              </div>
            </div>
          </div>
          <div class="bar-item">
            <div class="bar-label">较差 (<60)</div>
            <div class="bar">
              <div class="bar-fill poor" style="width: ${(stats.poor / stats.total * 100)}%">
                ${stats.poor}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="results" id="results">
      ${results.map(tool => {
        const score = tool.score || tool.scores?.overall || 0;
        const scoreClass = score >= 90 ? 'excellent' : score >= 75 ? 'good' : score >= 60 ? 'needs-improvement' : 'poor';

        return `
          <div class="tool-card" data-score="${score}" data-category="${scoreClass}" data-name="${tool.name.toLowerCase()}">
            <div class="tool-header">
              <div class="tool-name">${tool.name}</div>
              <div class="tool-score ${scoreClass}">${score}</div>
            </div>
            <div class="tool-path">${tool.path}</div>

            ${isEnhanced && tool.scores ? `
              <div class="score-breakdown">
                <div class="score-item">
                  <div class="score-item-label">桌面端</div>
                  <div class="score-item-value">${tool.scores.desktop?.total || 0}</div>
                </div>
                <div class="score-item">
                  <div class="score-item-label">移动端</div>
                  <div class="score-item-value">${tool.scores.mobile?.total || 0}</div>
                </div>
                <div class="score-item">
                  <div class="score-item-label">性能</div>
                  <div class="score-item-value">${tool.scores.performance?.total || 0}</div>
                </div>
                <div class="score-item">
                  <div class="score-item-label">可访问性</div>
                  <div class="score-item-value">${tool.scores.accessibility?.total || 0}</div>
                </div>
              </div>
            ` : `
              <div class="score-breakdown">
                ${tool.details ? `
                  <div class="score-item">
                    <div class="score-item-label">响应式</div>
                    <div class="score-item-value">${tool.details.responsive || 0}/20</div>
                  </div>
                  <div class="score-item">
                    <div class="score-item-label">色彩对比</div>
                    <div class="score-item-value">${tool.details.colorContrast || 0}/15</div>
                  </div>
                  <div class="score-item">
                    <div class="score-item-label">表单</div>
                    <div class="score-item-value">${tool.details.formUsability || 0}/15</div>
                  </div>
                  <div class="score-item">
                    <div class="score-item-label">交互性</div>
                    <div class="score-item-value">${tool.details.interactivity || 0}/15</div>
                  </div>
                ` : ''}
              </div>
            `}

            <div class="progress-bar">
              <div class="progress-fill" style="width: ${score}%"></div>
            </div>

            ${tool.issues && tool.issues.length > 0 ? `
              <div class="issues">
                ${tool.issues.map(issue => `<span class="issue-tag">⚠️ ${issue}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    </div>
  </div>

  <script>
    let currentFilter = 'all';
    let currentSearch = '';

    function filterTools(category) {
      currentFilter = category;
      applyFilters();

      // 更新按钮状态
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      event.target.classList.add('active');
    }

    function searchTools(query) {
      currentSearch = query.toLowerCase();
      applyFilters();
    }

    function applyFilters() {
      const cards = document.querySelectorAll('.tool-card');

      cards.forEach(card => {
        const category = card.dataset.category;
        const name = card.dataset.name;

        const matchesCategory = currentFilter === 'all' || category === currentFilter;
        const matchesSearch = !currentSearch || name.includes(currentSearch);

        if (matchesCategory && matchesSearch) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(outputPath, html);
  console.log(`✅ HTML报告已生成: ${outputPath}`);
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  const jsonPath = args[0] || path.join(__dirname, 'ui-quality-report.json');
  const outputPath = args[1] || path.join(__dirname, 'ui-quality-report.html');

  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ 找不到JSON报告: ${jsonPath}`);
    console.log('使用方法: node generate-html-report.cjs [json文件路径] [输出html路径]');
    process.exit(1);
  }

  console.log(`📊 读取测试结果: ${jsonPath}`);
  generateHTMLReport(jsonPath, outputPath);
  console.log(`\n🎉 完成！在浏览器中打开查看: file://${path.resolve(outputPath)}`);
}

if (require.main === module) {
  main();
}

module.exports = { generateHTMLReport };
