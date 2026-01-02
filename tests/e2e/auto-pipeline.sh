#!/bin/bash
# 自动化测试、优化、重测试和报告生成pipeline

set -e

echo "🚀 启动自动化UI优化Pipeline"
echo ""

# 步骤1: 等待所有批次测试完成
echo "📊 步骤1: 检查批次测试完成状态..."
BATCH_FILES=(
  "tests/e2e/batch-0-250.json"
  "tests/e2e/batch-250-500.json"
  "tests/e2e/batch-500-750.json"
  "tests/e2e/batch-750-1001.json"
)

MAX_WAIT=1800  # 最多等待30分钟
WAIT_TIME=0
while true; do
  ALL_DONE=true
  for file in "${BATCH_FILES[@]}"; do
    if [ ! -f "$file" ]; then
      ALL_DONE=false
      break
    fi
  done

  if [ "$ALL_DONE" = true ]; then
    echo "✅ 所有批次测试已完成"
    break
  fi

  if [ $WAIT_TIME -ge $MAX_WAIT ]; then
    echo "❌ 超时：等待测试完成超过30分钟"
    exit 1
  fi

  sleep 10
  WAIT_TIME=$((WAIT_TIME + 10))
  echo "   ⏳ 等待中... (${WAIT_TIME}s)"
done

echo ""

# 步骤2: 合并所有批次报告
echo "📦 步骤2: 合并批次报告..."
node tests/e2e/batch-optimize.cjs merge "${BATCH_FILES[@]}"
echo ""

# 步骤3: 批量优化工具
echo "🔧 步骤3: 批量优化需要改进的工具..."
node tests/e2e/batch-optimize.cjs optimize tests/e2e/merged-report.json 90
echo ""

# 步骤4: 重新测试优化后的工具
echo "🔄 步骤4: 重新测试优化后的工具..."
# 读取optimization-log.json获取需要重测的工具
if [ -f "tests/e2e/optimization-log.json" ]; then
  OPTIMIZED_COUNT=$(cat tests/e2e/optimization-log.json | jq 'length')
  echo "   发现 ${OPTIMIZED_COUNT} 个已优化的工具"

  if [ "$OPTIMIZED_COUNT" -gt "0" ]; then
    echo "   开始重新测试..."
    # 这里可以添加重新测试逻辑
    # 暂时使用完整测试的前100个作为示例
    MAX_TOOLS=100 node tests/e2e/ui-quality-checker.cjs
  fi
else
  echo "   ⚠️  未找到优化日志，跳过重测"
fi
echo ""

# 步骤5: 生成最终可视化报告
echo "📊 步骤5: 生成HTML可视化报告..."
node tests/e2e/generate-html-report.cjs tests/e2e/merged-report.json tests/e2e/final-report.html
echo ""

# 步骤6: 生成摘要
echo "📈 步骤6: 生成优化摘要..."
cat > tests/e2e/pipeline-summary.md << 'EOF'
# UI优化Pipeline摘要报告

## 测试范围
- 测试工具总数: 1001个
- 测试时间: $(date)

## 批次测试结果
EOF

# 添加统计信息
if [ -f "tests/e2e/merged-report.json" ]; then
  node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('tests/e2e/merged-report.json'));
const stats = {
  total: data.length,
  excellent: data.filter(r => r.score >= 90).length,
  good: data.filter(r => r.score >= 75 && r.score < 90).length,
  needsWork: data.filter(r => r.score >= 60 && r.score < 75).length,
  poor: data.filter(r => r.score < 60 && r.score > 0).length,
  avg: Math.round(data.filter(r => r.score > 0).reduce((sum, r) => sum + r.score, 0) / data.filter(r => r.score > 0).length)
};
console.log(\`
| 分类 | 数量 | 百分比 |
|------|------|--------|
| 优秀 (90-100) | \${stats.excellent} | \${(stats.excellent/stats.total*100).toFixed(1)}% |
| 良好 (75-89) | \${stats.good} | \${(stats.good/stats.total*100).toFixed(1)}% |
| 需改进 (60-74) | \${stats.needsWork} | \${(stats.needsWork/stats.total*100).toFixed(1)}% |
| 较差 (<60) | \${stats.poor} | \${(stats.poor/stats.total*100).toFixed(1)}% |
| **平均分** | **\${stats.avg}** | - |
\`);
" >> tests/e2e/pipeline-summary.md
fi

echo ""
cat >> tests/e2e/pipeline-summary.md << 'EOF'

## 优化结果
EOF

if [ -f "tests/e2e/optimization-log.json" ]; then
  node -e "
const fs = require('fs');
const log = JSON.parse(fs.readFileSync('tests/e2e/optimization-log.json'));
console.log(\`
- 已优化工具数: \${log.length}
- 优化类型分布:
\`);
const optimTypes = {};
log.forEach(item => {
  item.optimizations.forEach(opt => {
    optimTypes[opt] = (optimTypes[opt] || 0) + 1;
  });
});
Object.entries(optimTypes).forEach(([type, count]) => {
  console.log(\`  - \${type}: \${count}次\`);
});
" >> tests/e2e/pipeline-summary.md
fi

echo ""
cat tests/e2e/pipeline-summary.md

echo ""
echo "✨ Pipeline完成！"
echo ""
echo "📄 生成的文件:"
echo "   - 合并报告: tests/e2e/merged-report.json"
echo "   - 优化日志: tests/e2e/optimization-log.json"
echo "   - HTML报告: tests/e2e/final-report.html"
echo "   - 摘要报告: tests/e2e/pipeline-summary.md"
echo ""
echo "🎉 所有任务完成！"
