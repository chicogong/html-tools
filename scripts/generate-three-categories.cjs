const fs = require('fs');
const path = require('path');

// 三个新分类的定义
const newCategories = {
  data: {
    name: '数据工具',
    icon: '📊',
    color: 'blue'
  },
  office: {
    name: '办公工具',
    icon: '📋',
    color: 'cyan'
  },
  travel: {
    name: '旅行工具',
    icon: '✈️',
    color: 'green'
  }
};

// 数据工具列表 (30个)
const dataTools = [
  { file: 'csv-viewer.html', name: 'CSV 查看器', desc: '在线 CSV 文件查看和编辑工具', keywords: 'csv viewer 查看器 表格', icon: '📄' },
  { file: 'excel-to-json.html', name: 'Excel 转 JSON', desc: 'Excel/CSV 转 JSON 格式转换器', keywords: 'excel json csv 转换', icon: '📊' },
  { file: 'json-to-csv.html', name: 'JSON 转 CSV', desc: 'JSON 数据转 CSV/Excel 格式', keywords: 'json csv excel 转换', icon: '📈' },
  { file: 'chart-maker.html', name: '图表生成器', desc: '在线数据可视化图表生成工具', keywords: 'chart 图表 可视化 visualization', icon: '📊' },
  { file: 'pie-chart.html', name: '饼图生成器', desc: '创建饼图和环形图', keywords: 'pie chart 饼图 环形图', icon: '🥧' },
  { file: 'bar-chart.html', name: '柱状图生成器', desc: '创建柱状图和条形图', keywords: 'bar chart 柱状图 条形图', icon: '📊' },
  { file: 'line-chart.html', name: '折线图生成器', desc: '创建折线图和曲线图', keywords: 'line chart 折线图 曲线图', icon: '📈' },
  { file: 'data-cleaner.html', name: '数据清洗工具', desc: '清理和标准化数据格式', keywords: 'data clean 清洗 标准化', icon: '🧹' },
  { file: 'data-merger.html', name: '数据合并工具', desc: '合并多个数据源', keywords: 'data merge 合并 join', icon: '🔗' },
  { file: 'data-filter.html', name: '数据筛选器', desc: '按条件筛选和过滤数据', keywords: 'data filter 筛选 过滤', icon: '🔍' },
  { file: 'data-sorter.html', name: '数据排序工具', desc: '多字段数据排序', keywords: 'data sort 排序', icon: '🔢' },
  { file: 'duplicate-remover.html', name: '去重工具', desc: '删除重复数据', keywords: 'duplicate 去重 唯一', icon: '🗑️' },
  { file: 'data-validator.html', name: '数据验证器', desc: '验证数据格式和完整性', keywords: 'data validate 验证 校验', icon: '✅' },
  { file: 'statistics-calculator.html', name: '统计计算器', desc: '计算均值、方差、标准差等', keywords: 'statistics 统计 mean variance', icon: '📐' },
  { file: 'pivot-table.html', name: '数据透视表', desc: '创建数据透视表', keywords: 'pivot table 透视表', icon: '📋' },
  { file: 'data-aggregator.html', name: '数据聚合器', desc: '分组聚合统计', keywords: 'aggregate 聚合 group by', icon: '📊' },
  { file: 'sql-query-builder.html', name: 'SQL 查询构建器', desc: '可视化 SQL 查询生成器', keywords: 'sql query builder 查询', icon: '🔍' },
  { file: 'data-sampler.html', name: '数据采样器', desc: '随机或等间隔采样', keywords: 'sample 采样 random', icon: '🎲' },
  { file: 'outlier-detector.html', name: '异常值检测', desc: '检测数据中的异常值', keywords: 'outlier 异常值 检测', icon: '🔔' },
  { file: 'correlation-analyzer.html', name: '相关性分析', desc: '分析变量间相关性', keywords: 'correlation 相关性 分析', icon: '🔗' },
  { file: 'histogram-generator.html', name: '直方图生成器', desc: '创建数据分布直方图', keywords: 'histogram 直方图 分布', icon: '📊' },
  { file: 'scatter-plot.html', name: '散点图生成器', desc: '创建散点图和气泡图', keywords: 'scatter plot 散点图', icon: '⚫' },
  { file: 'heatmap-generator.html', name: '热力图生成器', desc: '创建数据热力图', keywords: 'heatmap 热力图', icon: '🔥' },
  { file: 'data-exporter.html', name: '数据导出器', desc: '导出为多种格式', keywords: 'export 导出 download', icon: '📤' },
  { file: 'data-importer.html', name: '数据导入器', desc: '导入多种格式数据', keywords: 'import 导入 upload', icon: '📥' },
  { file: 'json-flattener.html', name: 'JSON 扁平化', desc: '将嵌套 JSON 扁平化', keywords: 'json flatten 扁平化', icon: '📄' },
  { file: 'json-unflatten.html', name: 'JSON 反扁平化', desc: '将扁平 JSON 还原为嵌套结构', keywords: 'json unflatten 反扁平化', icon: '📊' },
  { file: 'data-normalizer.html', name: '数据归一化', desc: '数据标准化和归一化', keywords: 'normalize 归一化 标准化', icon: '📏' },
  { file: 'data-diff.html', name: '数据对比工具', desc: '对比两个数据集的差异', keywords: 'diff 对比 compare', icon: '🔄' },
  { file: 'data-transformer.html', name: '数据转换器', desc: '批量数据格式转换', keywords: 'transform 转换 convert', icon: '🔀' },
];

// 办公工具列表 (30个)
const officeTools = [
  { file: 'meeting-timer.html', name: '会议计时器', desc: '会议倒计时和时间管理', keywords: 'meeting timer 会议 计时', icon: '⏱️' },
  { file: 'agenda-maker.html', name: '议程生成器', desc: '创建会议议程', keywords: 'agenda 议程 会议', icon: '📋' },
  { file: 'minutes-template.html', name: '会议纪要模板', desc: '会议纪要快速生成', keywords: 'minutes 纪要 会议', icon: '📝' },
  { file: 'timesheet.html', name: '工时记录表', desc: '记录工作时间和项目', keywords: 'timesheet 工时 时间', icon: '⏰' },
  { file: 'invoice-maker.html', name: '发票生成器', desc: '在线发票制作工具', keywords: 'invoice 发票 账单', icon: '🧾' },
  { file: 'receipt-maker.html', name: '收据生成器', desc: '创建收据凭证', keywords: 'receipt 收据 凭证', icon: '🧾' },
  { file: 'contract-template.html', name: '合同模板', desc: '常用合同模板生成器', keywords: 'contract 合同 template', icon: '📄' },
  { file: 'letter-template.html', name: '信函模板', desc: '商务信函模板', keywords: 'letter 信函 template', icon: '✉️' },
  { file: 'resume-maker.html', name: '简历生成器', desc: '在线简历制作工具', keywords: 'resume cv 简历', icon: '📄' },
  { file: 'business-card-maker.html', name: '名片设计器', desc: '在线名片设计工具', keywords: 'business card 名片', icon: '💳' },
  { file: 'label-maker.html', name: '标签生成器', desc: '打印标签制作工具', keywords: 'label 标签 打印', icon: '🏷️' },
  { file: 'barcode-label.html', name: '条形码标签', desc: '条形码标签生成器', keywords: 'barcode label 条形码', icon: '📊' },
  { file: 'signature-pad.html', name: '电子签名板', desc: '在线电子签名工具', keywords: 'signature 签名 electronic', icon: '✍️' },
  { file: 'stamp-generator.html', name: '印章生成器', desc: '在线印章制作工具', keywords: 'stamp seal 印章', icon: '🔴' },
  { file: 'letterhead-maker.html', name: '信纸生成器', desc: '公司信纸模板制作', keywords: 'letterhead 信纸 template', icon: '📃' },
  { file: 'presentation-timer.html', name: '演讲计时器', desc: '演讲时间控制工具', keywords: 'presentation timer 演讲', icon: '⏲️' },
  { file: 'slide-notes.html', name: '演讲笔记', desc: '演示文稿笔记工具', keywords: 'slide notes 笔记 演讲', icon: '📝' },
  { file: 'gantt-chart.html', name: '甘特图生成器', desc: '项目进度甘特图', keywords: 'gantt chart 甘特图 项目', icon: '📊' },
  { file: 'project-timeline.html', name: '项目时间线', desc: '可视化项目时间线', keywords: 'timeline 时间线 项目', icon: '📅' },
  { file: 'task-tracker.html', name: '任务跟踪器', desc: '任务管理和跟踪', keywords: 'task tracker 任务 管理', icon: '✅' },
  { file: 'work-log.html', name: '工作日志', desc: '每日工作记录', keywords: 'work log 日志 记录', icon: '📖' },
  { file: 'attendance-sheet.html', name: '考勤表', desc: '员工考勤记录表', keywords: 'attendance 考勤 打卡', icon: '📋' },
  { file: 'leave-calculator.html', name: '请假计算器', desc: '计算请假天数和工资', keywords: 'leave 请假 计算', icon: '🏖️' },
  { file: 'overtime-calculator.html', name: '加班计算器', desc: '加班时间和工资计算', keywords: 'overtime 加班 计算', icon: '⏰' },
  { file: 'expense-report.html', name: '报销单', desc: '费用报销单生成器', keywords: 'expense 报销 费用', icon: '💰' },
  { file: 'purchase-order.html', name: '采购订单', desc: '采购订单生成器', keywords: 'purchase order 采购', icon: '🛒' },
  { file: 'quotation-maker.html', name: '报价单生成器', desc: '商品报价单制作', keywords: 'quotation 报价 quote', icon: '💵' },
  { file: 'checklist-maker.html', name: '检查清单', desc: '创建工作检查清单', keywords: 'checklist 清单 todo', icon: '☑️' },
  { file: 'org-chart.html', name: '组织架构图', desc: '公司组织架构图生成器', keywords: 'org chart 组织架构', icon: '🏢' },
  { file: 'seating-chart.html', name: '座位图生成器', desc: '会议/办公室座位安排', keywords: 'seating chart 座位', icon: '💺' },
];

// 旅行工具列表 (30个)
const travelTools = [
  { file: 'timezone-converter.html', name: '时区转换器', desc: '全球时区时间转换', keywords: 'timezone 时区 转换 time', icon: '🌍' },
  { file: 'time-difference.html', name: '时差计算器', desc: '计算两地时差', keywords: 'time difference 时差 计算', icon: '⏰' },
  { file: 'world-clock.html', name: '世界时钟', desc: '查看全球各地时间', keywords: 'world clock 世界时钟', icon: '🕐' },
  { file: 'currency-exchange.html', name: '汇率换算器', desc: '实时汇率货币换算', keywords: 'currency exchange 汇率 货币', icon: '💱' },
  { file: 'trip-budget.html', name: '旅行预算计算器', desc: '旅行费用预算规划', keywords: 'trip budget 预算 旅行', icon: '💰' },
  { file: 'packing-list.html', name: '行李清单', desc: '旅行打包检查清单', keywords: 'packing list 行李 清单', icon: '🧳' },
  { file: 'luggage-calculator.html', name: '行李限额计算', desc: '航班行李重量计算', keywords: 'luggage 行李 weight', icon: '⚖️' },
  { file: 'flight-time.html', name: '飞行时间计算', desc: '计算飞行时长', keywords: 'flight time 飞行 时间', icon: '✈️' },
  { file: 'distance-calculator.html', name: '距离计算器', desc: '两地距离和路线计算', keywords: 'distance 距离 route', icon: '📏' },
  { file: 'fuel-cost.html', name: '油费计算器', desc: '自驾游油费估算', keywords: 'fuel cost 油费 汽油', icon: '⛽' },
  { file: 'toll-calculator.html', name: '过路费计算', desc: '高速公路过路费计算', keywords: 'toll 过路费 高速', icon: '🛣️' },
  { file: 'trip-cost-splitter.html', name: '旅行费用分摊', desc: '多人旅行费用分摊计算', keywords: 'split cost 分摊 费用', icon: '🧮' },
  { file: 'tip-guide.html', name: '小费指南', desc: '各国小费习俗和计算', keywords: 'tip 小费 guide', icon: '💵' },
  { file: 'visa-checker.html', name: '签证查询', desc: '查询签证要求和政策', keywords: 'visa 签证 passport', icon: '🛂' },
  { file: 'vaccine-checker.html', name: '疫苗要求查询', desc: '旅行目的地疫苗要求', keywords: 'vaccine 疫苗 travel', icon: '💉' },
  { file: 'weather-planner.html', name: '天气规划器', desc: '目的地天气预报和建议', keywords: 'weather 天气 forecast', icon: '🌤️' },
  { file: 'season-guide.html', name: '最佳旅行季节', desc: '各地最佳旅行时间推荐', keywords: 'season 季节 best time', icon: '📆' },
  { file: 'itinerary-planner.html', name: '行程规划器', desc: '旅行行程安排工具', keywords: 'itinerary 行程 planner', icon: '🗓️' },
  { file: 'hotel-cost.html', name: '住宿费用计算', desc: '酒店费用预算计算', keywords: 'hotel cost 住宿 费用', icon: '🏨' },
  { file: 'travel-insurance.html', name: '旅行保险计算', desc: '旅行保险费用估算', keywords: 'insurance 保险 travel', icon: '🛡️' },
  { file: 'baggage-tracker.html', name: '行李追踪', desc: '记录行李托运信息', keywords: 'baggage track 行李 追踪', icon: '📦' },
  { file: 'emergency-contacts.html', name: '紧急联系方式', desc: '旅行紧急联系信息', keywords: 'emergency contact 紧急', icon: '🆘' },
  { file: 'phrase-book.html', name: '常用语手册', desc: '旅行常用外语短语', keywords: 'phrase language 短语', icon: '💬' },
  { file: 'size-converter.html', name: '尺码转换器', desc: '服装鞋码国际转换', keywords: 'size 尺码 clothes', icon: '👕' },
  { file: 'power-adapter.html', name: '电源插座指南', desc: '各国电源插座类型', keywords: 'power adapter 插座 电源', icon: '🔌' },
  { file: 'driving-side.html', name: '行车方向指南', desc: '各国驾驶方向查询', keywords: 'driving side 行车 方向', icon: '🚗' },
  { file: 'passport-photo.html', name: '证件照规格', desc: '各国证件照尺寸要求', keywords: 'passport photo 证件照', icon: '📸' },
  { file: 'baggage-limit.html', name: '行李限制查询', desc: '航空公司行李规定', keywords: 'baggage limit 行李 限制', icon: '✈️' },
  { file: 'sim-card-guide.html', name: 'SIM 卡指南', desc: '旅行目的地 SIM 卡信息', keywords: 'sim card 电话卡', icon: '📱' },
  { file: 'travel-checklist.html', name: '旅行准备清单', desc: '出行前准备事项清单', keywords: 'checklist 清单 准备', icon: '✅' },
];

// 工具 HTML 模板生成函数
function generateToolHTML(tool, category, categoryInfo) {
  const categoryName = categoryInfo.name;
  const accentColor = categoryInfo.color === 'blue' ? 'var(--accent-cyan)' :
                     categoryInfo.color === 'cyan' ? 'var(--accent-cyan)' :
                     categoryInfo.color === 'green' ? 'var(--accent-green)' : 'var(--accent-cyan)';

  return `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${tool.name} - WebUtils</title>
  <!-- SEO Meta Tags -->
  <meta name="description" content="${tool.desc}" />
  <meta name="keywords" content="${tool.keywords}" />
  <meta name="author" content="WebUtils" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://tools.realtime-ai.chat/tools/${category}/${tool.file}" />

  <!-- Open Graph -->
  <meta property="og:title" content="${tool.name} - WebUtils" />
  <meta property="og:description" content="${tool.desc}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://tools.realtime-ai.chat/tools/${category}/${tool.file}" />
  <meta property="og:site_name" content="WebUtils" />
  <meta property="og:locale" content="zh_CN" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${tool.name} - WebUtils" />
  <meta name="twitter:description" content="${tool.desc}" />
  <!-- OG Image -->
  <meta property="og:image" content="https://tools.realtime-ai.chat/social-preview.png" />
  <meta property="og:image:width" content="1280" />
  <meta property="og:image:height" content="640" />
  <meta property="og:image:type" content="image/png" />
  <meta name="twitter:image" content="https://tools.realtime-ai.chat/social-preview.png" />

  <!-- JSON-LD BreadcrumbList Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "首页",
        "item": "https://tools.realtime-ai.chat/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "${categoryName}",
        "item": "https://tools.realtime-ai.chat/#${category}"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "${tool.name}",
        "item": "https://tools.realtime-ai.chat/tools/${category}/${tool.file}"
      }
    ]
  }
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-deep: #0a0a0f;
      --bg-surface: #12121a;
      --bg-card: #1a1a24;
      --bg-input: #0e0e14;
      --text-primary: #e8e8ed;
      --text-secondary: #8888a0;
      --text-muted: #55556a;
      --border-subtle: #2a2a3a;
      --border-strong: #3a3a4a;
      --accent-cyan: #00f5d4;
      --accent-green: #10b981;
      --accent-red: #f43f5e;
      --accent-yellow: #fbbf24;
      --accent-purple: #a855f7;
      --glow-cyan: rgb(0, 245, 212, 0.15);
      --glow-green: rgb(16, 185, 129, 0.15);
      --radius-sm: 4px;
      --radius-md: 8px;
      --radius-lg: 12px;
    }
    [data-theme="light"]{--bg-deep:#fafafa;--bg-surface:#fff;--bg-card:#fff;--bg-input:#f5f5f5;--bg-hover:#f5f5f5;--text-primary:#1a1a1a;--text-secondary:#666;--text-muted:#999;--border-subtle:#e5e5e5;--border-strong:#d5d5d5}
    .theme-toggle{position:fixed;top:1rem;right:1rem;width:40px;height:40px;border-radius:50%;border:1px solid var(--border-subtle);background:var(--bg-card);cursor:pointer;font-size:1.2rem;z-index:100;transition:all .2s}.theme-toggle:hover{transform:scale(1.1)}

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Space Grotesk', system-ui, sans-serif;
      background: var(--bg-deep);
      color: var(--text-primary);
      min-height: 100vh;
      line-height: 1.6;
    }

    .bg-grid {
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(${accentColor.replace('var(--accent-', 'rgb(0, 245, 212').replace(')', ', 0.02)')}) 1px, transparent 1px),
        linear-gradient(90deg, ${accentColor.replace('var(--accent-', 'rgb(0, 245, 212').replace(')', ', 0.02)')}) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
      z-index: 0;
    }

    .container {
      position: relative;
      z-index: 1;
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      padding: 8px 14px;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      flex-wrap: wrap;
    }

    .breadcrumb a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .breadcrumb a:hover {
      color: ${accentColor};
    }

    .breadcrumb-separator {
      color: var(--text-muted);
      user-select: none;
    }

    .breadcrumb-current {
      color: var(--text-primary);
      font-weight: 500;
    }

    .title-section {
      flex: 1;
    }

    .title-section h1 {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.5rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .title-section h1 .icon {
      font-size: 1.8rem;
    }

    .title-section p {
      color: var(--text-secondary);
      margin-top: 4px;
      font-size: 0.9rem;
    }

    .main-content {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 24px;
      flex: 1;
    }

    .tool-section {
      margin-bottom: 24px;
    }

    .section-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .input-group {
      margin-bottom: 16px;
    }

    .input-label {
      display: block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }

    input[type="text"], input[type="number"], select, textarea {
      width: 100%;
      padding: 10px 14px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9rem;
      background: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      transition: border-color 0.2s;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: ${accentColor};
    }

    textarea {
      min-height: 120px;
      resize: vertical;
    }

    .btn-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn {
      flex: 1;
      min-width: 120px;
      padding: 12px 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      font-weight: 500;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-primary {
      background: ${accentColor};
      color: var(--bg-deep);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px ${accentColor.replace('var(--accent-', 'var(--glow-')};
    }

    .btn-secondary {
      background: var(--bg-surface);
      color: var(--text-primary);
      border: 1px solid var(--border-subtle);
    }

    .btn-secondary:hover {
      border-color: ${accentColor};
      color: ${accentColor};
    }

    .result-box {
      background: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9rem;
      color: ${accentColor};
      min-height: 60px;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: var(--accent-green);
      color: var(--bg-deep);
      padding: 12px 24px;
      border-radius: var(--radius-md);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      font-weight: 500;
      opacity: 0;
      transition: all 0.3s ease;
      z-index: 1000;
    }

    .toast.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }

    @media (max-width: 600px) {
      .container {
        padding: 16px;
      }

      .btn-row {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="bg-grid"></div>
  <button class="theme-toggle" onclick="toggleTheme()" title="切换主题">🌓</button>

  <div class="container">
    <header class="header">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="../../index.html">首页</a>
        <span class="breadcrumb-separator">/</span>
        <a href="../../index.html#${category}">${categoryName}</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">${tool.name}</span>
      </nav>
      <div class="title-section">
        <h1><span class="icon">${tool.icon}</span>${tool.name}</h1>
        <p>${tool.desc}</p>
      </div>
    </header>

    <main class="main-content">
      <div class="tool-section">
        <div class="section-title">工具功能</div>
        <div class="input-group">
          <label class="input-label">输入内容</label>
          <textarea id="input" placeholder="在此输入..."></textarea>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" onclick="processData()">📋 处理</button>
          <button class="btn btn-secondary" onclick="clearAll()">🔄 清空</button>
        </div>
      </div>

      <div class="tool-section">
        <div class="section-title">处理结果</div>
        <div class="result-box" id="result">处理结果将显示在这里...</div>
        <div class="btn-row" style="margin-top: 16px;">
          <button class="btn btn-primary" onclick="copyResult()">📋 复制结果</button>
        </div>
      </div>
    </main>
  </div>

  <div class="toast" id="toast">操作成功</div>

  <script>
    // 主题切换
    function toggleTheme() {
      const body = document.body;
      const isDark = body.getAttribute('data-theme') !== 'light';
      body.setAttribute('data-theme', isDark ? 'light' : 'dark');
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
    }

    // 加载主题
    (function() {
      const saved = localStorage.getItem('theme');
      if (saved === 'light') {
        document.body.setAttribute('data-theme', 'light');
      }
    })();

    // 处理数据
    function processData() {
      const input = document.getElementById('input').value;
      if (!input.trim()) {
        showToast('请输入内容');
        return;
      }

      // 这里添加具体的处理逻辑
      const result = \`输入: \${input}\\n\\n处理结果: \${input.length} 个字符\`;

      document.getElementById('result').textContent = result;
      showToast('处理完成');
    }

    // 复制结果
    function copyResult() {
      const result = document.getElementById('result').textContent;
      if (!result || result === '处理结果将显示在这里...') {
        showToast('没有可复制的内容');
        return;
      }

      navigator.clipboard.writeText(result).then(() => {
        showToast('已复制到剪贴板');
      });
    }

    // 清空所有内容
    function clearAll() {
      document.getElementById('input').value = '';
      document.getElementById('result').textContent = '处理结果将显示在这里...';
      showToast('已清空');
    }

    // 显示提示
    function showToast(msg) {
      const toast = document.getElementById('toast');
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    }
  </script>
</body>
</html>`;
}

// 主函数
async function main() {
  const toolsJsonPath = path.join(__dirname, '../tools.json');

  // 1. 读取 tools.json
  const toolsData = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf8'));

  // 2. 添加三个新分类
  Object.entries(newCategories).forEach(([id, info]) => {
    if (!toolsData.categories[id]) {
      toolsData.categories[id] = info;
      console.log(`✅ 已添加 ${id} 分类`);
    }
  });

  // 3. 获取最大 ID
  const existingIds = Object.keys(toolsData.tools).map(Number);
  let nextId = Math.max(...existingIds) + 1;

  // 4. 创建三个分类的工具
  const allTools = [
    { category: 'data', tools: dataTools, info: newCategories.data },
    { category: 'office', tools: officeTools, info: newCategories.office },
    { category: 'travel', tools: travelTools, info: newCategories.travel },
  ];

  for (const { category, tools, info } of allTools) {
    const categoryDir = path.join(__dirname, '../tools', category);

    // 创建分类目录
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
      console.log(`\n📁 创建 ${category} 目录`);
    }

    // 创建工具文件
    for (const tool of tools) {
      const filePath = path.join(categoryDir, tool.file);

      // 生成 HTML 文件
      fs.writeFileSync(filePath, generateToolHTML(tool, category, info));
      console.log(`✅ 创建 ${tool.file}`);

      // 添加到 tools.json
      toolsData.tools[nextId] = {
        path: `tools/${category}/${tool.file}`,
        name: tool.name,
        category: category,
        keywords: tool.keywords,
        icon: tool.icon,
        description: tool.desc
      };
      nextId++;
    }
  }

  // 5. 写回 tools.json
  fs.writeFileSync(toolsJsonPath, JSON.stringify(toolsData, null, 2));
  console.log(`\n✅ 已更新 tools.json`);
  console.log(`📊 当前工具总数: ${Object.keys(toolsData.tools).length}`);
  console.log(`📁 当前分类数: ${Object.keys(toolsData.categories).length}`);
}

main().catch(console.error);
