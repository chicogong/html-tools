const fs = require('fs');

// 读取之前提取的212个结果
const logContent = fs.readFileSync('test_batch_750_1001.log', 'utf8');
const toolSections = logContent.split('📊 增强分析:');
const previousResults = [];

for (let i = 1; i < toolSections.length; i++) {
  const section = toolSections[i];
  const nameMatch = section.match(/(.+?)\n/);
  const toolName = nameMatch ? nameMatch[1].trim() : 'Unknown';
  const pathMatch = section.match(/路径:\s*(.+?)\n/);
  const toolPath = pathMatch ? pathMatch[1].trim() : '';
  const scoreMatch = section.match(/综合得分:\s*(\d+)\/100/);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
  const hasFailed = section.includes('❌ 评估失败') || section.includes('分析失败');

  if (!hasFailed && score > 0) {
    previousResults.push({
      name: toolName,
      path: toolPath,
      scores: { overall: score }
    });
  }
}

// 读取965-1001的结果
const newData = JSON.parse(fs.readFileSync('tests/e2e/verify-batch-965-1001.json', 'utf8'));

// 合并
const allResults = previousResults.concat(newData);

console.log('\n合并结果统计:');
console.log('  之前的结果: ' + previousResults.length);
console.log('  新的结果: ' + newData.length);
console.log('  总计: ' + allResults.length);

// 统计分数分布
const excellent = allResults.filter(r => r.scores?.overall >= 90).length;
const good = allResults.filter(r => r.scores?.overall >= 75 && r.scores?.overall < 90).length;
const needsImprovement = allResults.filter(r => r.scores?.overall >= 60 && r.scores?.overall < 75).length;
const poor = allResults.filter(r => r.scores?.overall < 60).length;
const failed = allResults.filter(r => r.error).length;

console.log('\n分数分布 (' + (excellent + good + needsImprovement + poor) + '个有效结果):');
console.log('  优秀 (90+分): ' + excellent);
console.log('  良好 (75-89分): ' + good);
console.log('  需改进 (60-74分): ' + needsImprovement);
console.log('  急需优化 (<60分): ' + poor);
console.log('  失败/错误: ' + failed);

// 计算平均分
const validScores = allResults.filter(r => r.scores?.overall).map(r => r.scores.overall);
const avgScore = validScores.reduce((a, b) => a + b, 0) / validScores.length;
console.log('\n平均分: ' + avgScore.toFixed(2));

console.log('\n低于90分的工具列表:');
const belowExcellent = allResults.filter(r => r.scores && r.scores.overall < 90).sort((a, b) => b.scores.overall - a.scores.overall);
console.log('\n分数 80-89 的工具（前15个）:');
belowExcellent.filter(r => r.scores.overall >= 80).slice(0, 15).forEach(r => {
  console.log('  ' + r.name + ': ' + r.scores.overall);
});

console.log('\n分数 75-79 的工具（前15个）:');
belowExcellent.filter(r => r.scores.overall >= 75 && r.scores.overall < 80).slice(0, 15).forEach(r => {
  console.log('  ' + r.name + ': ' + r.scores.overall);
});

// 保存合并结果
fs.writeFileSync('tests/e2e/verify-batch-750-1001-complete.json', JSON.stringify(allResults, null, 2));
console.log('\n✅ 合并结果已保存到: tests/e2e/verify-batch-750-1001-complete.json');
