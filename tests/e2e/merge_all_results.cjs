const fs = require('fs');

// 读取三个批次的结果
const batch1 = JSON.parse(fs.readFileSync('tests/e2e/verify-batch-750-1001-complete.json', 'utf8')); // 750-1001 (248个)
const batch2 = JSON.parse(fs.readFileSync('tests/e2e/verify-batch-850-965.json', 'utf8')); // 850-965 (115个)

console.log('合并三个批次的结果...');
console.log('批次1 (750-1001): ' + batch1.length + '个结果');
console.log('批次2 (850-965): ' + batch2.length + '个结果');

// 合并 (先按路径去重，避免重复)
const allResults = [];
const seenPaths = new Set();

[...batch1, ...batch2].forEach(result => {
  if (!seenPaths.has(result.path)) {
    seenPaths.add(result.path);
    allResults.push(result);
  }
});

console.log('合并后总计: ' + allResults.length + '个结果 (已去重)');

// 保存合并结果
fs.writeFileSync('tests/e2e/verify-batch-750-1001-all-combined.json', JSON.stringify(allResults, null, 2));
console.log('✅ 完整合并结果已保存: tests/e2e/verify-batch-750-1001-all-combined.json');

// 基本统计
const validResults = allResults.filter(r => r.scores);
const totalTests = validResults.length;
const avgScore = validResults.reduce((sum, r) => sum + r.scores.overall, 0) / totalTests;

console.log('\n总体统计:');
console.log('  总工具数: ' + totalTests);
console.log('  平均分: ' + avgScore.toFixed(2));
console.log('  最高分: ' + Math.max(...validResults.map(r => r.scores.overall)));
console.log('  最低分: ' + Math.min(...validResults.map(r => r.scores.overall)));

// 分数分布
const excellent = validResults.filter(r => r.scores.overall >= 90).length;
const good = validResults.filter(r => r.scores.overall >= 75 && r.scores.overall < 90).length;
const needsImprovement = validResults.filter(r => r.scores.overall >= 60 && r.scores.overall < 75).length;

console.log('\n分数分布:');
console.log('  90+分: ' + excellent + '个 (' + (excellent/totalTests*100).toFixed(1) + '%)');
console.log('  75-89分: ' + good + '个 (' + (good/totalTests*100).toFixed(1) + '%)');
console.log('  60-74分: ' + needsImprovement + '个');
