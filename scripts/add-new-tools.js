#!/usr/bin/env node
/**
 * 添加新类别工具到 tools.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toolsJsonPath = path.join(__dirname, '..', 'tools.json');
const toolsJson = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf-8'));

// 新工具定义
const newTools = [
  // 财务工具 (finance)
  { path: 'tools/finance/stock-calculator.html', name: '股票收益计算器', category: 'finance', keywords: '股票 收益 盈亏 成本价 投资 回报', icon: '📈', description: '计算股票投资盈亏、成本均价和收益率' },
  { path: 'tools/finance/compound-interest.html', name: '复利计算器', category: 'finance', keywords: '复利 利息 投资 收益 定投 理财', icon: '💹', description: '计算复利增长、定投收益和资产积累' },
  { path: 'tools/finance/currency-converter.html', name: '汇率换算器', category: 'finance', keywords: '汇率 外汇 货币 换算 转换', icon: '💱', description: '多种货币实时汇率换算' },
  { path: 'tools/finance/tax-calculator.html', name: '个人所得税计算器', category: 'finance', keywords: '个税 所得税 工资 五险一金 专项扣除', icon: '💰', description: '计算中国个人所得税' },
  { path: 'tools/finance/budget-planner.html', name: '家庭预算规划器', category: 'finance', keywords: '预算 收支 家庭 理财 规划', icon: '📊', description: '合理规划收支，实现财务自由' },
  { path: 'tools/finance/mortgage-calculator.html', name: '房贷计算器', category: 'finance', keywords: '房贷 贷款 等额本息 等额本金 月供', icon: '🏠', description: '等额本息/等额本金对比计算' },
  { path: 'tools/finance/investment-return.html', name: '投资回报率计算器', category: 'finance', keywords: '投资 回报率 ROI 年化收益 IRR', icon: '📊', description: '计算ROI、年化收益率等投资指标' },
  { path: 'tools/finance/salary-calculator.html', name: '工资计算器', category: 'finance', keywords: '工资 薪资 税前税后 五险一金 社保', icon: '💼', description: '计算税前税后工资、五险一金明细' },
  { path: 'tools/finance/debt-payoff.html', name: '债务还款计算器', category: 'finance', keywords: '债务 还款 雪球法 雪崩法 信用卡', icon: '💳', description: '制定债务还款计划，比较还款策略' },
  { path: 'tools/finance/retirement-calculator.html', name: '退休计算器', category: 'finance', keywords: '退休 养老 储蓄 规划 养老金', icon: '🏖️', description: '计算退休所需资金和储蓄计划' },
  { path: 'tools/finance/profit-margin.html', name: '利润率计算器', category: 'finance', keywords: '利润率 毛利率 净利率 成本 定价', icon: '💵', description: '计算毛利率、净利率、盈亏平衡点' },
  { path: 'tools/finance/tip-calculator.html', name: '小费计算器', category: 'finance', keywords: '小费 账单 AA 分摊 餐厅', icon: '🍽️', description: '快速计算餐厅小费和AA账单' },
  { path: 'tools/finance/discount-calculator.html', name: '折扣计算器', category: 'finance', keywords: '折扣 优惠 打折 促销 节省', icon: '🏷️', description: '计算折扣后价格、节省金额和折扣率' },
  { path: 'tools/finance/exchange-split.html', name: 'AA记账分摊器', category: 'finance', keywords: 'AA 分摊 记账 聚餐 旅行', icon: '🧾', description: '聚餐、旅行费用分摊计算' },
  { path: 'tools/finance/savings-goal.html', name: '储蓄目标计算器', category: 'finance', keywords: '储蓄 目标 理财 规划 每月', icon: '🎯', description: '设定目标，计算每月储蓄金额' },
  { path: 'tools/finance/depreciation.html', name: '资产折旧计算器', category: 'finance', keywords: '折旧 资产 直线法 余额递减 年数总和', icon: '📉', description: '计算固定资产折旧' },

  // 医疗健康 (health)
  { path: 'tools/health/bmr-calculator.html', name: '基础代谢率计算器', category: 'health', keywords: 'BMR TDEE 基础代谢 热量 卡路里', icon: '🔥', description: '计算基础代谢率和每日热量需求' },
  { path: 'tools/health/due-date.html', name: '预产期计算器', category: 'health', keywords: '预产期 怀孕 孕期 末次月经', icon: '👶', description: '根据末次月经计算预产期' },
  { path: 'tools/health/menstrual-cycle.html', name: '月经周期追踪器', category: 'health', keywords: '月经 周期 排卵期 安全期 经期', icon: '📅', description: '追踪月经周期，预测排卵期' },
  { path: 'tools/health/body-fat.html', name: '体脂率计算器', category: 'health', keywords: '体脂率 身体成分 脂肪 肌肉', icon: '⚖️', description: '多种方法计算体脂率' },
  { path: 'tools/health/water-intake.html', name: '每日饮水量计算器', category: 'health', keywords: '饮水 喝水 水分 补水', icon: '💧', description: '计算每日推荐饮水量' },
  { path: 'tools/health/calorie-calculator.html', name: '卡路里需求计算器', category: 'health', keywords: '卡路里 热量 减肥 增肌 营养', icon: '🍎', description: '计算每日热量需求和宏量营养素' },
  { path: 'tools/health/heart-rate-zone.html', name: '心率区间计算器', category: 'health', keywords: '心率 运动 训练 有氧 燃脂', icon: '❤️', description: '计算运动心率区间' },
  { path: 'tools/health/blood-pressure.html', name: '血压分析工具', category: 'health', keywords: '血压 高血压 低血压 健康', icon: '🩺', description: '血压分类评估和健康建议' },
  { path: 'tools/health/sleep-calculator.html', name: '睡眠时间计算器', category: 'health', keywords: '睡眠 起床 入睡 睡眠周期', icon: '😴', description: '基于睡眠周期计算最佳时间' },
  { path: 'tools/health/ideal-weight.html', name: '理想体重计算器', category: 'health', keywords: '理想体重 BMI 健康体重', icon: '🏃', description: '多公式计算理想体重' },
  { path: 'tools/health/alcohol-metabolism.html', name: '酒精代谢计算器', category: 'health', keywords: '酒精 代谢 醒酒 血液酒精', icon: '🍺', description: '估算酒精代谢时间' },
  { path: 'tools/health/medication-reminder.html', name: '服药提醒器', category: 'health', keywords: '服药 提醒 药物 健康管理', icon: '💊', description: '药物管理和服药提醒' },
  { path: 'tools/health/vision-test.html', name: '视力测试工具', category: 'health', keywords: '视力 眼睛 测试 视力表', icon: '👁️', description: '在线视力测试' },
  { path: 'tools/health/hearing-test.html', name: '听力测试工具', category: 'health', keywords: '听力 耳朵 测试 频率', icon: '👂', description: '在线听力测试' },
  { path: 'tools/health/bac-calculator.html', name: '血液酒精浓度计算器', category: 'health', keywords: 'BAC 血液酒精 酒驾 饮酒', icon: '🚗', description: '计算血液酒精浓度' },

  // 教育学习 (education)
  { path: 'tools/education/gpa-calculator.html', name: 'GPA计算器', category: 'education', keywords: 'GPA 绩点 成绩 学分', icon: '🎓', description: '计算GPA绩点（中/美/英制）' },
  { path: 'tools/education/grade-calculator.html', name: '成绩计算器', category: 'education', keywords: '成绩 分数 加权 平均分', icon: '📝', description: '加权平均成绩计算' },
  { path: 'tools/education/study-timer.html', name: '学习计时器', category: 'education', keywords: '番茄钟 学习 计时 专注', icon: '⏱️', description: '番茄钟学习计时器' },
  { path: 'tools/education/flashcard.html', name: '单词卡片工具', category: 'education', keywords: '单词 记忆 卡片 学习', icon: '🃏', description: '单词记忆卡片' },
  { path: 'tools/education/citation-generator.html', name: '论文引用格式生成器', category: 'education', keywords: '引用 论文 参考文献 APA MLA', icon: '📚', description: '生成APA/MLA/Chicago格式引用' },
  { path: 'tools/education/reading-speed.html', name: '阅读速度测试', category: 'education', keywords: '阅读 速度 测试 理解', icon: '📖', description: '测试阅读速度和理解能力' },
  { path: 'tools/education/typing-speed.html', name: '打字速度测试', category: 'education', keywords: '打字 速度 测试 WPM', icon: '⌨️', description: '测试打字速度' },
  { path: 'tools/education/math-solver.html', name: '数学方程求解器', category: 'education', keywords: '数学 方程 求解 一元二次', icon: '🔢', description: '求解各类数学方程' },
  { path: 'tools/education/unit-circle.html', name: '三角函数单位圆', category: 'education', keywords: '三角函数 单位圆 sin cos tan', icon: '⭕', description: '三角函数单位圆可视化' },
  { path: 'tools/education/periodic-table.html', name: '元素周期表', category: 'education', keywords: '元素 周期表 化学 原子', icon: '⚗️', description: '交互式元素周期表' },
  { path: 'tools/education/physics-formulas.html', name: '物理公式速查', category: 'education', keywords: '物理 公式 力学 电学', icon: '🔬', description: '常用物理公式速查' },
  { path: 'tools/education/chemical-equation.html', name: '化学方程式配平', category: 'education', keywords: '化学 方程式 配平 反应', icon: '⚗️', description: '化学方程式配平工具' },
  { path: 'tools/education/probability.html', name: '概率计算器', category: 'education', keywords: '概率 排列 组合 统计', icon: '🎲', description: '排列组合和概率计算' },
  { path: 'tools/education/statistics.html', name: '统计学计算器', category: 'education', keywords: '统计 均值 方差 标准差', icon: '📊', description: '统计学基础计算' },
  { path: 'tools/education/binary-tree.html', name: '二叉树可视化', category: 'education', keywords: '二叉树 数据结构 算法 可视化', icon: '🌳', description: '二叉树操作可视化' },

  // 餐饮食品 (food)
  { path: 'tools/food/cooking-converter.html', name: '烹饪单位转换器', category: 'food', keywords: '烹饪 单位 转换 克 杯 汤匙', icon: '🥄', description: '烹饪单位互转' },
  { path: 'tools/food/recipe-scaler.html', name: '配方缩放工具', category: 'food', keywords: '配方 缩放 份量 调整', icon: '📐', description: '按份量调整食材用量' },
  { path: 'tools/food/nutrition-calculator.html', name: '营养成分计算器', category: 'food', keywords: '营养 热量 蛋白质 碳水 脂肪', icon: '🥗', description: '计算食谱营养成分' },
  { path: 'tools/food/baking-calculator.html', name: '烘焙比例计算器', category: 'food', keywords: '烘焙 面包 比例 酵母', icon: '🍞', description: '烘焙配方比例计算' },
  { path: 'tools/food/coffee-ratio.html', name: '咖啡冲泡比例', category: 'food', keywords: '咖啡 冲泡 比例 水粉比', icon: '☕', description: '咖啡冲泡比例计算' },
  { path: 'tools/food/wine-pairing.html', name: '葡萄酒配餐指南', category: 'food', keywords: '葡萄酒 配餐 红酒 白酒', icon: '🍷', description: '葡萄酒与食物搭配建议' },
  { path: 'tools/food/meat-temperature.html', name: '肉类温度参考', category: 'food', keywords: '肉类 温度 熟度 烹饪', icon: '🥩', description: '肉类最佳烹饪温度' },
  { path: 'tools/food/food-cost.html', name: '菜品成本计算器', category: 'food', keywords: '成本 菜品 餐厅 定价', icon: '💰', description: '计算菜品成本和利润' },
  { path: 'tools/food/shopping-list.html', name: '购物清单生成器', category: 'food', keywords: '购物 清单 食材 超市', icon: '🛒', description: '生成购物清单' },
  { path: 'tools/food/meal-planner.html', name: '周餐计划器', category: 'food', keywords: '餐计划 一周 菜单 营养', icon: '📋', description: '规划一周餐食' },
  { path: 'tools/food/fermentation-timer.html', name: '发酵计时器', category: 'food', keywords: '发酵 面团 酵母 时间', icon: '⏰', description: '面团发酵计时' },
  { path: 'tools/food/serving-size.html', name: '食物份量计算器', category: 'food', keywords: '份量 食物 热量 减肥', icon: '🍽️', description: '计算食物份量' },
  { path: 'tools/food/food-storage.html', name: '食材保存时间查询', category: 'food', keywords: '保存 冰箱 保鲜 过期', icon: '❄️', description: '查询食材保存时间' },
  { path: 'tools/food/drink-mixer.html', name: '鸡尾酒配方工具', category: 'food', keywords: '鸡尾酒 调酒 配方 饮品', icon: '🍸', description: '鸡尾酒配方查询' },
  { path: 'tools/food/tea-timer.html', name: '泡茶计时器', category: 'food', keywords: '泡茶 茶叶 冲泡 时间 温度', icon: '🍵', description: '不同茶类冲泡计时' },
  { path: 'tools/food/calorie-counter.html', name: '食物卡路里查询', category: 'food', keywords: '卡路里 热量 食物 查询', icon: '🔍', description: '查询食物热量和营养' },

  // 中文工具 (chinese)
  { path: 'tools/chinese/idcard-generator.html', name: '身份证号码生成器', category: 'chinese', keywords: '身份证 生成 测试 18位', icon: '🆔', description: '生成测试用身份证号码' },
  { path: 'tools/chinese/idcard-validator.html', name: '身份证号码验证器', category: 'chinese', keywords: '身份证 验证 解析 校验', icon: '✅', description: '验证和解析身份证号码' },
  { path: 'tools/chinese/uscc-validator.html', name: '统一社会信用代码验证器', category: 'chinese', keywords: '社会信用代码 企业 营业执照', icon: '🏢', description: '验证企业统一社会信用代码' },
  { path: 'tools/chinese/license-plate.html', name: '车牌号归属地查询', category: 'chinese', keywords: '车牌 归属地 查询 省份', icon: '🚗', description: '查询车牌号归属地' },
  { path: 'tools/chinese/lunar-calendar.html', name: '农历阳历转换', category: 'chinese', keywords: '农历 阳历 公历 转换 日期', icon: '📅', description: '农历阳历日期互转' },
  { path: 'tools/chinese/chinese-zodiac.html', name: '生肖查询工具', category: 'chinese', keywords: '生肖 属相 年份 十二生肖', icon: '🐲', description: '根据年份查询生肖' },
  { path: 'tools/chinese/bank-card-bin.html', name: '银行卡BIN查询', category: 'chinese', keywords: '银行卡 BIN 发卡行 卡类型', icon: '💳', description: '查询银行卡发卡行信息' },
  { path: 'tools/chinese/phone-attribution.html', name: '手机号归属地查询', category: 'chinese', keywords: '手机号 归属地 运营商', icon: '📱', description: '查询手机号归属地' },
  { path: 'tools/chinese/chinese-number.html', name: '中文大写数字转换', category: 'chinese', keywords: '大写数字 金额 人民币', icon: '壹', description: '数字转中文大写金额' },
  { path: 'tools/chinese/idiom-dictionary.html', name: '成语词典', category: 'chinese', keywords: '成语 词典 释义 出处', icon: '📖', description: '查询成语释义和用法' },
  { path: 'tools/chinese/ancient-poetry.html', name: '古诗词查询', category: 'chinese', keywords: '古诗 诗词 唐诗 宋词', icon: '📜', description: '古典诗词查询' },
  { path: 'tools/chinese/stroke-order.html', name: '汉字笔画顺序', category: 'chinese', keywords: '笔画 笔顺 汉字 书写', icon: '✍️', description: '查询汉字笔画顺序' },
  { path: 'tools/chinese/pinyin-tone.html', name: '拼音声调标注', category: 'chinese', keywords: '拼音 声调 注音 汉字', icon: 'pīn', description: '为汉字添加拼音注音' },
  { path: 'tools/chinese/radicals.html', name: '汉字偏旁部首查询', category: 'chinese', keywords: '偏旁 部首 汉字 查询', icon: '⺀', description: '查询汉字偏旁部首' },
  { path: 'tools/chinese/couplet-generator.html', name: '对联生成器', category: 'chinese', keywords: '对联 春联 传统 文化', icon: '🧧', description: '生成传统对联' },
];

// 检查工具是否已存在
const existingPaths = new Set(toolsJson.tools.map(t => t.path));

let addedCount = 0;
for (const tool of newTools) {
  if (!existingPaths.has(tool.path)) {
    // 检查文件是否存在
    const fullPath = path.join(__dirname, '..', tool.path);
    if (fs.existsSync(fullPath)) {
      toolsJson.tools.push(tool);
      addedCount++;
      console.log(`✅ Added: ${tool.name}`);
    } else {
      console.log(`⚠️ File not found: ${tool.path}`);
    }
  } else {
    console.log(`⏭️ Already exists: ${tool.name}`);
  }
}

// 保存更新后的 tools.json
fs.writeFileSync(toolsJsonPath, JSON.stringify(toolsJson, null, 2));

console.log(`\n📦 Added ${addedCount} new tools to tools.json`);
console.log(`📊 Total tools: ${toolsJson.tools.length}`);
