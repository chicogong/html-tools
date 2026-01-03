# 可访问性改进路线图

## 目标和收益分析

### 当前状态 (现有成绩)
```
总工具数:     750
平均分数:     92.06 分
90+ 分工具:   501 个 (66.8%)
80-89 分工具: 242 个 (32.3%)
错误工具:     7 个  (0.9%)
```

### 改进目标
```
修复后预期:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
90+ 分工具:   ~678 个 (90%+)
平均分数:     ~94.5 分
完美工具:     112 个 (改进 2x)
```

---

## 分阶段改进计划

### 第 1 阶段：快速胜利 (1-2 周) 🚀

**目标**：从 501 → 679 个 90+ 工具 (180 个的改进)

#### 1.1 修复 178 个 85 分工具 (表单标签缺失)

**预期成果**：
- 将 178 个工具从 85 分提升到 90+ 分
- 增加 178 个 90+ 分工具 (占改进总数的 98%)

**具体行动**：
```bash
# 第一步：扫描所有 85 分工具的表单元素
for each tool in score==85:
  - 识别 <input>, <select>, <textarea> 元素
  - 检查是否有关联的 <label>
  - 检查是否有有效的 aria-label

# 第二步：添加必要的标签
优先级顺序:
  1. 添加 <label for="id"> 标签 (首选)
  2. 添加 aria-label 属性 (备选)
  3. 确保 placeholder 不作为唯一标签

# 第三步：测试验证
- 运行 npm run lint 检查语法
- 用 enhanced-ui-checker 重新测试

# 第四步：提交 PR
- 创建单个大 PR，修复全部 178 个工具
- 详细说明修复内容
```

**工具清单** (共 178 个)：

| 类别 | 工具数 | 工具示例 |
|------|--------|---------|
| 生成器 | 10 | 渐变色卡、NanoID、SVG Blob、波浪背景、白噪音等 |
| 图片编辑 | 24 | 证件照裁剪、模糊、加边框、拼接、裁剪、滤镜等 |
| 计算器 | 15 | 三角函数、单位、复利、存储、年龄、房贷等 |
| 加密货币 | 14 | Gas费、APY/APR、ICO、交易手续费、杠杆等 |
| 开发工具 | 17 | CSS 生成器、Cron、Bezier、表格生成器等 |
| 转换器 | 10 | 体积、文件大小、时间、温度、速度、重量等 |
| 金融 | 11 | 个税、债务、储蓄、利润、复利、投资回报等 |
| 房地产 | 11 | LPR 利率、投资 ROI、房贷、提前还款、首付等 |
| 其他 | 66 | 天文、美食、健康、时间、旅行、教育等 |

**预期成果**：
- 这一步可解决 71% 的低分工具问题
- 工具总数提升到 679 个 90+ (从 501)
- 平均分数提升到 93.4 分 (从 92.06)

#### 1.2 调查和修复 2 个 PDF 工具 (0 分)

**受影响工具**:
- PDF 合并工具 (tools/media/pdf-merge.html)
- PDF 拆分工具 (tools/media/pdf-split.html)

**诊断步骤**:
```bash
# 1. 检查是否是 PDF.js 加载失败
grep -n "PDF.js\|pdf.min.js" tools/media/pdf-*.html

# 2. 检查是否是权限/沙箱问题
# - 在 enhanced-ui-checker.cjs 中增加特殊处理
# - 增加超时时间 (从 15s → 30s)
# - 添加重试机制

# 3. 检查是否是内存不足
# - 检查 Puppeteer 是否崩溃
# - 考虑分批处理

# 4. 运行单独测试
node -e "
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch();
  // 单独测试 PDF 工具...
"
```

**修复选项**:
- Option A: 修复 PDF.js 加载 (首选，5~10 分钟)
- Option B: 跳过 PDF 工具特殊处理，增加超时 (10~20 分钟)
- Option C: 暂时从测试中排除，稍后单独处理 (1~2 天)

**预期成果**:
- 2 个工具从 0 分 → 80+ 分
- 添加 2 个 90+ 工具 (如果修复成功)
- 总数提升到 681 (80%+ 的目标)

---

### 第 2 阶段：解决其他低分工具 (2-3 周) 🔧

**目标**：从 681 → 710+ 个 90+ 工具

#### 2.1 分析 87-89 分工具 (59 工具)

**评分细则**:
```
Score 87:  11 工具 (border-radius, 条形码, 图片加文字等)
Score 88:  23 工具 (代码截图, 占位图, 文字卡片等)
Score 89:  25 工具 (env编辑器, Mock数据, 二维码生成等)
```

**诊断步骤**:
```javascript
// 分析这些工具缺少哪些评分项
for each tool in score==87-89:
  missing_points = 100 - score
  potential_issues = [
    (formUsability < 15) ? "表单标签不完整",
    (colorContrast < 15) ? "色彩对比度不足",
    (responsive < 20) ? "响应式设计问题",
    ...
  ]
```

**修复优先级**:
1. formUsability (如果 < 15) → 添加标签 (最常见)
2. colorContrast (如果 < 15) → 调整配色
3. 其他项目 → 根据具体情况

**预期成果**:
- 最多可修复 30-40 个工具到 90+ 分
- 总数提升到 710-720 (95%+ 的目标)

#### 2.2 分析 83-84 分工具 (2 工具)

**受影响工具**:
- Cron 表达式解析器 (83 分)
- 随机数生成器 (84 分)

**修复建议**:
- 逐个分析缺少的 16-17 分
- 可能是多个小项目的组合问题
- 需要手动调查

---

### 第 3 阶段：长期维护 (持续) 🔄

#### 3.1 建立最佳实践指南

**更新 CLAUDE.md**:
```markdown
## 表单无障碍实现规范

### 标准做法
1. 为每个 input/select/textarea 添加 <label for="id">
2. 或使用 aria-label/aria-labelledby
3. placeholder 不能作为唯一标签

### 代码示例
✓ 正确做法:
<label for="email">邮箱</label>
<input type="email" id="email" placeholder="请输入邮箱" />

✗ 错误做法:
<input type="email" placeholder="邮箱" /> <!-- 无标签 -->

### 检查清单
- [ ] 所有 input 都有 id 属性
- [ ] 所有 input 都有关联的 label 或 aria-label
- [ ] placeholder 仅用于辅助提示，不是主标签
- [ ] select 元素有清晰的标签
- [ ] textarea 有完整的标签
```

#### 3.2 自动化 CI 检查

**在 eslint.config.js 中添加 a11y 规则**:
```javascript
// 检查表单无障碍
{
  rules: {
    'jsx-a11y/label-has-associated-control': 'warn',
    'jsx-a11y/aria-role': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn'
  }
}
```

**更新 npm 脚本**:
```json
{
  "lint:a11y": "eslint tools/**/*.html --rule 'jsx-a11y/*'",
  "check:form-labels": "node scripts/check-form-labels.js"
}
```

#### 3.3 新工具审查流程

**添加到 PR 模板**:
```markdown
## Accessibility Checklist
- [ ] 所有表单输入都有标签 (label/aria-label)
- [ ] 色彩对比度 >= 4.5:1 (WCAG AA)
- [ ] 键盘可导航
- [ ] 屏幕阅读器友好
- [ ] 移动端友好
```

#### 3.4 定期审计计划

**月度检查**:
```bash
# 每月跑一次完整测试
npm run test:accessibility

# 生成报告
node tests/e2e/enhanced-ui-checker.cjs \
  --output=tests/e2e/monthly-audit-$(date +%Y-%m).json

# 对比前月数据，追踪改进
```

---

## 时间表和里程碑

```
Week 1:
  ✓ 第 1.1 阶段：修复 178 个表单标签工具
    时间：3-5 天
    结果：90+ 分工具 501 → 679 (+178)

Week 2:
  ✓ 第 1.2 阶段：修复 2 个 PDF 工具
    时间：2-3 天
    结果：90+ 分工具 679 → 681 (+2)

  ✓ 第 2.1 阶段：分析 87-89 分工具
    时间：2-3 天
    结果：90+ 分工具 681 → 710+ (+30)

Week 3-4:
  ✓ 第 2.2 阶段：手动修复遗漏工具
    时间：持续
    结果：目标 750 个工具中 700+ (93%+) 达到 90+

Week 5+:
  ✓ 第 3 阶段：建立长期流程
    时间：持续改进
    目标：维持 90+ 工具占比 > 90%
```

---

## 资源分配

### 需要的技能
- HTML/CSS/JS 基础知识 ✓
- 熟悉 Web 无障碍标准 (WCAG)
- 会用 npm/git 工具 ✓

### 预期工作量
| 阶段 | 任务 | 工时 | 优先级 |
|------|------|------|--------|
| 1.1 | 修复 178 个表单标签 | 3-5h | 🔴 高 |
| 1.2 | 调试 2 个 PDF 工具 | 2-3h | 🟡 中 |
| 2.1 | 分析 59 个 87-89 工具 | 2-3h | 🟡 中 |
| 2.2 | 修复 87-89 工具 | 3-5h | 🟡 中 |
| 3.x | 建立长期流程 | 2-3h | 🟢 低 |
| **总计** | | **12-19h** | |

### 预期 ROI
```
投入: 12-19 工作小时
产出:
  • 90+ 分工具: +179 个 (35% 改进)
  • 平均分数: +2.4 分 (改进 2.6%)
  • 完美工具: +56 个 (2x 增长)
  • 可访问性: 显著改进

时间成本：<1周 (密集工作) 或 2-3周 (正常进度)
```

---

## 成功指标

### 目标 1：提升 90+ 分工具占比到 90%+
```
Current:  501/750 = 66.8%
Target:   > 675/750 = 90%+
Timeline: 2 周内达成
```

### 目标 2：零 0 分工具
```
Current:  7 个
Target:   0 个
Timeline: 1 周内达成
```

### 目标 3：建立防护机制
```
目标：每个新工具都在添加时就达到 90+ 分
验证方式：
  - 新工具 PR 必须通过可访问性检查
  - CI 自动检查表单标签完整性
  - 月度审计报告
```

---

## 风险和缓解策略

### 风险 1：修复导致其他问题

**缓解**: 
- 修改前先创建备份分支
- 小范围测试 (5-10 个工具先)
- 逐步扩展

### 风险 2：表单标签修复不当

**缓解**:
- 参考 WCAG 最佳实践文档
- 让懂无障碍的人 review
- 用屏幕阅读器测试

### 风险 3：PDF 工具修复困难

**缓解**:
- 如果无法在 1 天内修复，暂时跳过
- 记录为技术债，日后处理
- 不影响整体目标 (只差 2 个工具)

---

## 参考资源

### Web 无障碍标准
- [WCAG 2.1 无障碍指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [HTML 表单无障碍最佳实践](https://www.w3.org/WAI/tutorials/forms/)
- [aria-label 使用指南](https://www.w3.org/WAI/ARIA/apg/patterns/button/)

### 测试工具
- [axe DevTools](https://www.deque.com/axe/devtools/) - 浏览器插件
- [WAVE](https://wave.webaim.org/) - 在线检查工具
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Chrome 内置

### 现有资源
- 测试脚本：`tests/e2e/enhanced-ui-checker.cjs`
- 测试结果：`tests/e2e/batch-*.json`
- 项目指南：`CLAUDE.md`

---

**报告生成时间**: 2026-01-03  
**文档版本**: 1.0  
**状态**: 📋 执行准备就绪
