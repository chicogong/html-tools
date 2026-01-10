const fs = require('fs');
const path = require('path');

const tested = require('./merged-report.json');
const optimized = require('./optimization-log.json');

const optimizedPaths = new Set(optimized.map(o => o.path));
const needsOptimization = tested.filter(r => 
  r.score >= 80 && r.score < 90 && !optimizedPaths.has(r.path)
);

console.log(`\n🚀 批量增强优化：${needsOptimization.length} 个工具\n`);

let count = 0;
const newOptimizations = [];

for (const tool of needsOptimization) {
  const filePath = path.join(__dirname, '../../', tool.path);
  
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const applied = [];

  // 方法1: 如果body有line-height但没有font-size，添加font-size
  if (content.match(/body\s*\{[^}]*line-height:[^}]*\}/s) && 
      !content.match(/body\s*\{[^}]*font-size:[^}]*\}/s)) {
    content = content.replace(
      /(body\s*\{[^}]*)(line-height:\s*[^;]+;)/s,
      '$1font-size: 16px;\n        $2'
    );
    modified = true;
    applied.push('添加font-size: 16px到body');
  }

  // 方法2: 如果body完全没有font-size和line-height，添加两者
  if (!content.match(/body\s*\{[^}]*font-size:[^}]*\}/s) && 
      !content.match(/body\s*\{[^}]*line-height:[^}]*\}/s)) {
    content = content.replace(
      /(body\s*\{)/,
      '$1\n        font-size: 16px;\n        line-height: 1.6;'
    );
    modified = true;
    applied.push('添加font-size和line-height到body');
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    count++;
    newOptimizations.push({
      tool: tool.name,
      path: tool.path,
      score: tool.score,
      optimizations: applied
    });

    if (count <= 10 || count % 20 === 0) {
      console.log(`✅ [${count}/${needsOptimization.length}] ${tool.name} (${tool.score}分)`);
    }
  }
}

// 更新优化日志
const allOptimizations = [...optimized, ...newOptimizations];
fs.writeFileSync(
  path.join(__dirname, 'optimization-log.json'),
  JSON.stringify(allOptimizations, null, 2)
);

console.log(`\n✅ 批量增强优化完成: ${count} 个工具\n`);
console.log(`📊 总优化工具数: ${allOptimizations.length} 个\n`);
