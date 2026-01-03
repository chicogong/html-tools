const fs = require('fs');

// 读取日志
const logContent = fs.readFileSync('test_batch_750_1001.log', 'utf8');

// 按工具分割
const toolSections = logContent.split('📊 增强分析:');
const results = [];

for (let i = 1; i < toolSections.length; i++) {
  const section = toolSections[i];
  
  // 提取工具名称
  const nameMatch = section.match(/(.+?)\n/);
  const toolName = nameMatch ? nameMatch[1].trim() : 'Unknown';
  
  // 提取路径
  const pathMatch = section.match(/路径:\s*(.+?)\n/);
  const toolPath = pathMatch ? pathMatch[1].trim() : '';
  
  // 提取综合得分
  const scoreMatch = section.match(/综合得分:\s*(\d+)\/100/);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
  
  // 检查是否失败
  const hasFailed = section.includes('❌ 评估失败') || section.includes('分析失败');
  
  if (!hasFailed && score > 0) {
    results.push({
      name: toolName,
      path: toolPath,
      score: score
    });
  }
}

console.log(`提取了 ${results.length} 个成功的结果`);
console.log('前10个:', results.slice(0, 10));
console.log('后10个:', results.slice(-10));

// 统计分数分布
const excellent = results.filter(r => r.score >= 90).length;
const good = results.filter(r => r.score >= 75 && r.score < 90).length;
const needsImprovement = results.filter(r => r.score >= 60 && r.score < 75).length;

console.log(`\n分数分布:`);
console.log(`  优秀(90+): ${excellent}`);
console.log(`  良好(75-89): ${good}`);
console.log(`  需改进(60-74): ${needsImprovement}`);
