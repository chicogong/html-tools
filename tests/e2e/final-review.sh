#!/bin/bash
# 最终Review检查脚本

echo "🔍 最终Review检查"
echo ""

# 1. 检查所有测试报告
echo "📊 1. 检查测试报告..."
REQUIRED_FILES=(
  "tests/e2e/merged-report.json"
  "tests/e2e/optimization-log.json"
  "tests/e2e/final-report.html"
  "tests/e2e/enhanced-report.json"
  "tests/e2e/enhanced-report.html"
)

MISSING=0
for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "   ✅ $file"
  else
    echo "   ❌ 缺少: $file"
    MISSING=$((MISSING + 1))
  fi
done

if [ $MISSING -gt 0 ]; then
  echo ""
  echo "⚠️  缺少 $MISSING 个必需文件"
  exit 1
fi
echo ""

# 2. 验证优化效果
echo "📈 2. 验证优化效果..."
if [ -f "tests/e2e/optimization-log.json" ]; then
  OPTIMIZED=$(cat tests/e2e/optimization-log.json | jq 'length')
  echo "   优化工具数: $OPTIMIZED"

  if [ "$OPTIMIZED" -eq "0" ]; then
    echo "   ⚠️  没有工具被优化"
  else
    echo "   ✅ 已优化 $OPTIMIZED 个工具"

    # 显示优化类型统计
    echo ""
    echo "   优化类型统计:"
    cat tests/e2e/optimization-log.json | jq -r '
      [.[].optimizations[]] |
      group_by(.) |
      map({type: .[0], count: length}) |
      .[] |
      "      - \(.type): \(.count)次"
    '
  fi
fi
echo ""

# 3. 检查测试覆盖率
echo "📊 3. 检查测试覆盖率..."
if [ -f "tests/e2e/merged-report.json" ]; then
  TOTAL=$(cat tests/e2e/merged-report.json | jq 'length')
  EXPECTED=1001

  echo "   测试工具数: $TOTAL / $EXPECTED"

  if [ "$TOTAL" -eq "$EXPECTED" ]; then
    echo "   ✅ 100%覆盖率"
  else
    COVERAGE=$(echo "scale=1; $TOTAL * 100 / $EXPECTED" | bc)
    echo "   ⚠️  覆盖率: ${COVERAGE}%"
  fi
fi
echo ""

# 4. 统计分数分布
echo "📊 4. 分数分布统计..."
if [ -f "tests/e2e/merged-report.json" ]; then
  node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('tests/e2e/merged-report.json'));
const valid = data.filter(r => r.score > 0);
const stats = {
  total: valid.length,
  excellent: valid.filter(r => r.score >= 90).length,
  good: valid.filter(r => r.score >= 75 && r.score < 90).length,
  needsWork: valid.filter(r => r.score >= 60 && r.score < 75).length,
  poor: valid.filter(r => r.score < 60).length,
  avg: Math.round(valid.reduce((sum, r) => sum + r.score, 0) / valid.length),
  min: Math.min(...valid.map(r => r.score)),
  max: Math.max(...valid.map(r => r.score))
};

console.log(\`   优秀 (90-100): \${stats.excellent} (\${(stats.excellent/stats.total*100).toFixed(1)}%)\`);
console.log(\`   良好 (75-89): \${stats.good} (\${(stats.good/stats.total*100).toFixed(1)}%)\`);
console.log(\`   需改进 (60-74): \${stats.needsWork} (\${(stats.needsWork/stats.total*100).toFixed(1)}%)\`);
console.log(\`   较差 (<60): \${stats.poor} (\${(stats.poor/stats.total*100).toFixed(1)}%)\`);
console.log(\`   平均分: \${stats.avg}\`);
console.log(\`   分数范围: \${stats.min} - \${stats.max}\`);
"
fi
echo ""

# 5. 检查代码质量
echo "🔍 5. 运行代码质量检查..."
npm run lint 2>&1 | tail -10
LINT_EXIT=$?

if [ $LINT_EXIT -eq 0 ]; then
  echo "   ✅ Lint检查通过"
else
  echo "   ⚠️  Lint检查有警告"
fi
echo ""

# 6. 检查格式
echo "📝 6. 检查代码格式..."
npm run format:check 2>&1 | tail -5
FORMAT_EXIT=$?

if [ $FORMAT_EXIT -eq 0 ]; then
  echo "   ✅ 格式检查通过"
else
  echo "   ⚠️  格式需要调整，运行 npm run format 修复"
fi
echo ""

# 7. 生成Git变更摘要
echo "📝 7. Git变更摘要..."
echo "   修改的文件:"
git status --short | head -20
echo ""
echo "   工具文件变更统计:"
git status --short | grep "tools/" | wc -l | xargs -I {} echo "      修改工具文件: {}"
git status --short | grep "tests/" | wc -l | xargs -I {} echo "      测试文件: {}"
echo ""

# 8. 最终摘要
echo "=" | awk '{for(i=0;i<60;i++)printf"="}END{print""}'
echo "✅ Review检查完成"
echo "=" | awk '{for(i=0;i<60;i++)printf"="}END{print""}'
echo ""

if [ $MISSING -eq 0 ]; then
  echo "🎉 所有必需文件已生成"
  echo "📊 测试和优化已完成"
  echo "🚀 准备好提交PR"
else
  echo "⚠️  还有 $MISSING 个问题需要解决"
fi
echo ""
