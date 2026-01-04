const data = require('./tests/e2e/enhanced-report.json');

const withScore = data.filter(t => t.scores && t.scores.overall > 0);
const withoutScore = data.filter(t => !t.scores || t.scores.overall === 0);

console.log('═══════════════════════════════════════════════');
console.log('📊 完整 E2E 测试结果分析');
console.log('═══════════════════════════════════════════════\n');

console.log('总工具数:', data.length);
console.log('✅ 成功测试:', withScore.length, `(${(withScore.length/data.length*100).toFixed(1)}%)`);
console.log('❌ 失败/未测试:', withoutScore.length, `(${(withoutScore.length/data.length*100).toFixed(1)}%)`);

if (withoutScore.length > 0) {
  console.log('\n失败工具示例:');
  withoutScore.slice(0, 10).forEach(t => {
    console.log(`  • ${t.name}: ${t.error || 'Unknown error'}`);
  });
}

if (withScore.length > 0) {
  const scores = withScore.map(t => t.scores.overall);
  const avg = scores.reduce((a,b) => a+b, 0) / scores.length;

  console.log('\n═══════════════════════════════════════════════');
  console.log('✅ 成功测试的工具 (', withScore.length, '个)');
  console.log('═══════════════════════════════════════════════');

  console.log('\n总体得分:');
  console.log('  平均分:', avg.toFixed(2));
  console.log('  最高分:', Math.max(...scores));
  console.log('  最低分:', Math.min(...scores));

  const perfect = withScore.filter(t => t.scores.overall === 100);
  const excellent = withScore.filter(t => t.scores.overall >= 95);
  const good = withScore.filter(t => t.scores.overall >= 90);
  const fair = withScore.filter(t => t.scores.overall >= 80);
  const needsWork = withScore.filter(t => t.scores.overall >= 70);
  const poor = withScore.filter(t => t.scores.overall < 70);

  console.log('\n分数分布:');
  console.log('  100分 (完美):', perfect.length, `(${(perfect.length/withScore.length*100).toFixed(1)}%)`);
  console.log('  95-99 (优秀):', excellent.length - perfect.length, `(${((excellent.length - perfect.length)/withScore.length*100).toFixed(1)}%)`);
  console.log('  90-94 (良好):', good.length - excellent.length, `(${((good.length - excellent.length)/withScore.length*100).toFixed(1)}%)`);
  console.log('  80-89 (及格):', fair.length - good.length, `(${((fair.length - good.length)/withScore.length*100).toFixed(1)}%)`);
  console.log('  70-79 (需改进):', needsWork.length - fair.length, `(${((needsWork.length - fair.length)/withScore.length*100).toFixed(1)}%)`);
  console.log('  <70 (较差):', poor.length, `(${(poor.length/withScore.length*100).toFixed(1)}%)`);

  const desktop = withScore.map(t => t.scores.desktop.total);
  const mobile = withScore.map(t => t.scores.mobile.total);
  const performance = withScore.map(t => t.scores.performance.total);
  const accessibility = withScore.map(t => t.scores.accessibility.total);

  console.log('\n按类别统计 (平均分):');
  console.log('  桌面端:', (desktop.reduce((a,b) => a+b)/desktop.length).toFixed(1), '/ 100');
  console.log('  移动端:', (mobile.reduce((a,b) => a+b)/mobile.length).toFixed(1), '/ 100');
  console.log('  性能:', (performance.reduce((a,b) => a+b)/performance.length).toFixed(1), '/ 100');
  console.log('  可访问性:', (accessibility.reduce((a,b) => a+b)/accessibility.length).toFixed(1), '/ 100');

  console.log('\n最佳工具 (Top 10):');
  const sorted = [...withScore].sort((a,b) => b.scores.overall - a.scores.overall);
  sorted.slice(0, 10).forEach((t, i) => {
    console.log(`  ${i+1}. ${t.name} - ${t.scores.overall}分`);
  });

  console.log('\n需要改进的工具 (Bottom 10):');
  sorted.slice(-10).reverse().forEach((t, i) => {
    console.log(`  ${i+1}. ${t.name} - ${t.scores.overall}分`);
  });
}

console.log('\n═══════════════════════════════════════════════\n');
