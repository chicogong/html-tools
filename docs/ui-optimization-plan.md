# UI 优化计划

## 概述

将旧模板工具逐步迁移到新的 glassmorphism 设计系统。

**已完成的模板特征**：

- Glassmorphism 导航栏 (`.nav-bar`)
- 柔和主色 `#00d4aa`（替代刺眼的 `#00f5d4`）
- Inter + JetBrains Mono 字体
- CSS 变量 `--color-*` 前缀
- 双主题支持（深色/浅色）
- 移动端响应式 + safe-area 支持

**参考模板**: `tools/dev/json-formatter.html`

---

## 已完成 ✅

1. `tools/dev/json-formatter.html` - JSON 格式化
2. `tools/calculator/loan-calculator.html` - 贷款计算器
3. `tools/text/text-diff.html` - 文本对比
4. `tools/dev/regex-tester.html` - 正则测试器

---

## P0 - 高优先级（核心开发工具） ✅ 已完成

这些是开发者最常用的工具，已完成优化（PR #135）：

### 开发工具 (dev) - 5/5 ✅

- [x] `tools/dev/jwt-decoder.html` - JWT 解码
- [x] `tools/dev/base64.html` - Base64 编解码
- [x] `tools/dev/url-codec.html` - URL 编解码
- [x] `tools/dev/json-yaml.html` - JSON/YAML 转换
- [x] `tools/dev/clipboard-viewer.html` - 剪贴板查看

### 时间工具 (time) - 2/2 ✅

- [x] `tools/time/timestamp.html` - 时间戳转换
- [x] `tools/time/timezone-converter.html` - 时区转换

### 生成器 (generator) - 3/3 ✅

- [x] `tools/generator/uuid-generator.html` - UUID 生成
- [x] `tools/generator/qrcode-generator.html` - 二维码生成
- [x] `tools/generator/password-generator.html` - 密码生成

**完成状态**: 10/10 工具 (100%)
**相关 PR**: [#135 - Migrate all 10 P0 tools to Glassmorphism design](https://github.com/chicogong/html-tools/pull/135)

---

## P1 - 中优先级（常用工具）

### 文本工具 (text)

- [ ] `tools/text/markdown-preview.html` - Markdown 预览
- [ ] `tools/text/word-counter.html` - 字数统计
- [ ] `tools/text/case-converter.html` - 大小写转换

### 媒体工具 (media)

- [ ] `tools/media/image-compressor.html` - 图片压缩
- [ ] `tools/media/image-resize.html` - 图片缩放
- [ ] `tools/media/svg-render.html` - SVG 渲染

### 隐私工具 (privacy)

- [ ] `tools/privacy/log-masker.html` - 日志脱敏
- [ ] `tools/privacy/hash-generator.html` - 哈希生成

### 计算器 (calculator)

- [ ] `tools/calculator/percentage-calculator.html` - 百分比计算
- [ ] `tools/calculator/unit-converter.html` - 单位转换
- [ ] `tools/calculator/bmi-calculator.html` - BMI 计算

---

## P2 - 低优先级（其他工具）

其他约 960+ 工具，按使用频率逐步优化。

### 建议批量处理方式：

1. 按分类逐个目录处理
2. 每次处理 5-10 个工具
3. 统一测试后提交

---

## 模板迁移检查清单

每个工具迁移时需检查：

- [ ] 替换旧面包屑为 glassmorphism nav-bar
- [ ] 更新 CSS 变量命名（`--color-*` 前缀）
- [ ] 主色改为 `#00d4aa`
- [ ] 添加双主题支持
- [ ] 字体改为 Inter + JetBrains Mono
- [ ] 移动端响应式适配
- [ ] 运行 lint 检查
- [ ] 功能测试

---

## 更新日志

- 2024-12-31: 创建计划，完成 text-diff.html 和 regex-tester.html
