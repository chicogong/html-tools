const fs = require('fs');

// 读取合并的结果
const results = JSON.parse(fs.readFileSync('tests/e2e/verify-batch-750-1001-complete.json', 'utf8'));

console.log('\n' + '='.repeat(70));
console.log('批量可访问性优化验证报告 (工具 750-1001)');
console.log('='.repeat(70));

// 基本统计
const validResults = results.filter(r => r.scores);
const totalTests = validResults.length;
const avgScore = validResults.reduce((sum, r) => sum + r.scores.overall, 0) / totalTests;

console.log('\n1. 总体统计:');
console.log('  总测试工具数: ' + totalTests + '个');
console.log('  平均分: ' + avgScore.toFixed(2) + '/100');
console.log('  最高分: ' + Math.max(...validResults.map(r => r.scores.overall)));
console.log('  最低分: ' + Math.min(...validResults.map(r => r.scores.overall)));

// 按分数段分布
const excellent = validResults.filter(r => r.scores.overall >= 90);
const good = validResults.filter(r => r.scores.overall >= 75 && r.scores.overall < 90);
const needsImprovement = validResults.filter(r => r.scores.overall >= 60 && r.scores.overall < 75);
const poor = validResults.filter(r => r.scores.overall < 60);

console.log('\n2. 分数分布:');
console.log('  优秀 (90-100分): ' + excellent.length + '个 (' + (excellent.length/totalTests*100).toFixed(1) + '%)');
console.log('  良好 (75-89分): ' + good.length + '个 (' + (good.length/totalTests*100).toFixed(1) + '%)');
console.log('  需改进 (60-74分): ' + needsImprovement.length + '个 (' + (needsImprovement.length/totalTests*100).toFixed(1) + '%)');
console.log('  急需优化 (<60分): ' + poor.length + '个');

// 详细分数段
console.log('\n3. 详细分数分布:');
const scores95plus = validResults.filter(r => r.scores.overall >= 95).length;
const scores90to94 = validResults.filter(r => r.scores.overall >= 90 && r.scores.overall < 95).length;
const scores85to89 = validResults.filter(r => r.scores.overall >= 85 && r.scores.overall < 90).length;
const scores80to84 = validResults.filter(r => r.scores.overall >= 80 && r.scores.overall < 85).length;
const scores75to79 = validResults.filter(r => r.scores.overall >= 75 && r.scores.overall < 80).length;

console.log('  95-100分: ' + scores95plus + '个');
console.log('  90-94分: ' + scores90to94 + '个');
console.log('  85-89分: ' + scores85to89 + '个');
console.log('  80-84分: ' + scores80to84 + '个');
console.log('  75-79分: ' + scores75to79 + '个');

// 按评分维度分析
console.log('\n4. 维度评分分析 (取样):');
const sampleResults = validResults.filter(r => r.scores.desktop).slice(0, 5);
if (sampleResults.length > 0) {
  const avgDesktop = sampleResults.reduce((sum, r) => sum + r.scores.desktop.total, 0) / sampleResults.length;
  const avgMobile = sampleResults.reduce((sum, r) => sum + r.scores.mobile.total, 0) / sampleResults.length;
  const avgPerformance = sampleResults.reduce((sum, r) => sum + r.scores.performance.total, 0) / sampleResults.length;
  const avgAccessibility = sampleResults.reduce((sum, r) => sum + r.scores.accessibility.total, 0) / sampleResults.length;

  console.log('  桌面端评分: ' + avgDesktop.toFixed(1) + '/100');
  console.log('  移动端评分: ' + avgMobile.toFixed(1) + '/100');
  console.log('  性能评分: ' + avgPerformance.toFixed(1) + '/100');
  console.log('  可访问性评分: ' + avgAccessibility.toFixed(1) + '/100');
}

// 低于90分的工具
console.log('\n5. 低于90分的工具 (共' + (good.length + needsImprovement.length + poor.length) + '个):');
console.log('\n  85-89分工具 (前10个):');
good.filter(r => r.scores.overall >= 85).slice(0, 10).forEach((r, i) => {
  console.log('    ' + (i+1) + '. ' + r.name + ': ' + r.scores.overall);
});

console.log('\n  80-84分工具 (前10个):');
good.filter(r => r.scores.overall >= 80 && r.scores.overall < 85).slice(0, 10).forEach((r, i) => {
  console.log('    ' + (i+1) + '. ' + r.name + ': ' + r.scores.overall);
});

console.log('\n  75-79分工具 (前10个):');
good.filter(r => r.scores.overall >= 75 && r.scores.overall < 80).slice(0, 10).forEach((r, i) => {
  console.log('    ' + (i+1) + '. ' + r.name + ': ' + r.scores.overall);
});

console.log('\n6. 关键发现:');
console.log('  ✅ 成功率: ' + ((excellent.length + good.length) / totalTests * 100).toFixed(1) + '%的工具达到75分以上');
console.log('  ✅ 优秀率: ' + (excellent.length / totalTests * 100).toFixed(1) + '%的工具达到90分以上');
console.log('  ⚠️ 改进方向: 关注75-89分工具的可访问性和响应式设计');

console.log('\n' + '='.repeat(70) + '\n');
