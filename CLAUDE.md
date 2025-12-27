# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个纯前端工具集项目,每个工具都是独立的单文件 HTML。所有代码(HTML/CSS/JavaScript)都内联在单个文件中,无需任何构建步骤或打包工具。

**核心理念**:
- 单文件: 所有代码(HTML/CSS/JS)完全内联,无外部依赖文件
- 零构建: 无需 npm run build,直接打开 HTML 即可运行
- 纯前端: 所有处理在浏览器本地完成,不向服务器发送数据
- 离线可用: 下载 HTML 文件后可完全离线使用

## 项目结构

```
html-tools/
├── index.html              # 主页 (JSON 数据驱动的动态渲染)
├── tools.json              # 工具数据源 (Single Source of Truth)
├── tools/                  # 所有工具按类别组织
│   ├── dev/               # 开发工具 (JSON, JWT, Base64, URL, Regex 等)
│   ├── text/              # 文本工具 (Diff, Markdown, 字数统计)
│   ├── time/              # 时间工具 (时间戳, 时区, 日期计算)
│   ├── generator/         # 生成器 (UUID, QRCode, 密码)
│   ├── privacy/           # 隐私工具 (日志脱敏, 加密)
│   ├── media/             # 媒体工具 (图片压缩, SVG, 摄像头)
│   ├── security/          # 安全工具 (AES, RSA, 密码强度)
│   ├── network/           # 网络工具 (IP, 端口, MAC)
│   ├── calculator/        # 计算器 (百分比, 进度, 宽高比)
│   ├── converter/         # 转换器 (单位, 文件大小)
│   ├── extractor/         # 提取器 (链接, 文本)
│   └── ai/                # AI 工具 (Token 计数, Prompt 模板)
├── scripts/
│   └── sync-tools.js      # 工具同步脚本 (tools.json → index.html)
├── package.json           # lint 和 sync 脚本依赖
└── 部署配置文件:
    ├── vercel.json        # Vercel 配置
    ├── netlify.toml       # Netlify 配置
    ├── _headers           # Cloudflare Pages headers
    └── _redirects         # Cloudflare Pages redirects
```

## 开发命令

```bash
# 安装 lint 工具 (仅用于代码质量检查)
npm install

# 运行所有 lint 检查
npm run lint

# 单独运行各类 lint
npm run lint:html    # HTMLHint - 检查 HTML 结构
npm run lint:css     # Stylelint - 检查内联 CSS
npm run lint:js      # ESLint - 检查内联 JavaScript

# 自动修复 CSS 问题
npm run lint:fix

# 同步工具列表（将 tools.json 同步到 index.html）
npm run sync:tools
```

**注意**: 这个项目没有 `npm run build`、`npm start` 或 `npm test` 命令。

## 架构设计

### 1. 单文件架构

每个工具文件的典型结构:

```html
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8" />
  <title>工具名 - HTML Tools</title>

  <!-- 字体从 Google Fonts CDN 加载 -->
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:..." rel="stylesheet">

  <!-- 所有 CSS 内联在 <style> 标签中 -->
  <style>
    :root {
      /* CSS 变量定义暗色主题 */
      --bg-deep: #0a0a0f;
      --text-primary: #e8e8ed;
      --accent-cyan: #00f5d4;
      ...
    }

    [data-theme="light"] {
      /* 浅色主题覆盖变量 (如果支持主题切换) */
      --bg-deep: #fafafa;
      --text-primary: #1a1a1a;
      ...
    }
  </style>
</head>
<body>
  <!-- HTML 内容 -->

  <!-- 外部库从 CDN 加载 (如需要) -->
  <script src="https://cdn.jsdelivr.net/npm/..."></script>

  <!-- 所有 JavaScript 内联在 <script> 标签中 -->
  <script>
    // 工具逻辑
  </script>
</body>
</html>
```

### 2. 主页 (index.html) 架构

index.html 使用 **JSON 数据驱动的动态渲染** 架构：

```javascript
// 分类数据
const CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: 'favorites', name: '⭐ 收藏' },
  { id: 'dev', name: '开发工具' },
  // ...
];

// 工具数据
const TOOLS = [
  { url: 'tools/dev/json-formatter.html', category: 'dev', name: 'JSON 格式化', desc: '...', icon: '{}', keywords: '...' },
  // ...
];
```

**数据同步流程**：
1. `tools.json` 是工具列表的唯一数据源（Single Source of Truth）
2. 运行 `npm run sync:tools` 将 tools.json 同步到 index.html 的 TOOLS/CATEGORIES 数组
3. CI 会检查两者是否同步，不同步则构建失败

**主页特性**：
- **动态渲染**: 工具卡片通过 JavaScript 从 TOOLS 数组动态生成 (使用 document.createElement)
- **主题切换**: 通过 `data-theme="light"` 属性切换明暗主题,状态保存在 localStorage
- **分类筛选**: 按工具类别筛选 (dev/text/time/generator/privacy/media/security/network/calculator/converter/extractor/ai)
- **搜索功能**: 基于工具名称、描述和 keywords 的实时搜索,显示结果数量
- **收藏系统**:
  - 收藏的工具 URL 保存在 localStorage (`html_tools_favorites_v1`)
  - 空收藏状态显示友好提示和使用指引
- **键盘导航支持**:
  - `/` 键聚焦搜索框
  - `Esc` 键失焦搜索框
  - `Tab` 键导航到工具卡片和收藏按钮,支持 `:focus-visible` 焦点样式
  - `Enter` 或 `Space` 键触发收藏操作
- **SEO 优化**:
  - meta description、keywords、author、robots
  - Open Graph 标签 (og:title, og:description 等)
  - Twitter Card 标签
  - JSON-LD 结构化数据 (WebApplication schema)
  - canonical URL

**DOM 结构和选择器（重要！）**：
- 工具卡片使用 `<span class="tool-name">` 而非 `<h3>` 来存储工具名称
- 筛选和搜索逻辑必须使用 `querySelector('.tool-name')` 而非 `querySelector('h3')`
- 为了向后兼容，建议使用：`querySelector('.tool-name') || querySelector('h3')`
- 工具卡片的完整结构：
  ```html
  <a href="..." class="tool-card" data-category="..." data-keywords="...">
    <div class="tool-card-header">
      <span class="tool-icon">⚡</span>
      <span class="tool-name">工具名</span>
      <!-- 收藏按钮由 JavaScript 动态添加 -->
    </div>
  </a>
  ```

**DOM 渲染逻辑**：
- 工具卡片通过 `renderTools()` 函数从 TOOLS 数组动态生成
- 使用 `document.createElement()` 而非 innerHTML (更安全)
- 收藏按钮在渲染时动态添加,支持键盘事件 (`Enter` 和 `Space` 键)
- **关键注意**：任何操作工具卡片的 JavaScript 都必须使用 `.tool-name` 选择器

### 3. 通用功能模式

大多数工具都包含以下标准功能 (通过纯 JavaScript 实现):

- **URL Hash 持久化**: 输入内容自动编码到 URL hash,刷新页面不丢失
- **剪贴板操作**:
  - 粘贴按钮: 从剪贴板读取内容
  - 复制按钮: 将结果复制到剪贴板
- **分享链接**: 生成包含当前输入的完整 URL
- **清空重置**: 清空所有输入输出并重置 URL hash

### 4. 外部依赖使用

项目通过 CDN 加载外部库,常用的有:
- **js-yaml**: YAML 解析 (json-yaml.html)
- **jsdiff**: 文本差异对比 (text-diff.html)
- **marked**: Markdown 渲染 (markdown-preview.html)
- **DOMPurify**: XSS 防护 (markdown-preview.html)
- **QRCode.js**: 二维码生成 (qrcode-generator.html)

## 添加新工具

1. 在 `tools/<category>/` 下创建新的 `.html` 文件
2. 复制现有工具作为模板,确保包含:
   - 完整的 `<head>` 设置 (charset, viewport, title, fonts)
   - 内联 CSS 和 JavaScript
   - 返回主页的链接: `<a href="../../index.html">← 返回</a>`
3. 在 `tools.json` 的 `tools` 数组中添加工具元数据:
   ```json
   {
     "path": "tools/<category>/<file>.html",
     "name": "工具名",
     "category": "<category>",
     "keywords": "关键词1 关键词2 keyword1",
     "icon": "🔧",
     "description": "工具描述"
   }
   ```
4. 运行 `npm run sync:tools` 同步到 index.html (更新 TOOLS 数组和 SEO 元数据)
5. 提交更改（CI 会检查同步状态）

**工具同步机制**:
- `tools.json` 是工具列表的唯一数据源（Single Source of Truth）
- `npm run sync:tools` 读取 tools.json 并更新:
  - index.html 中的 CATEGORIES 数组
  - index.html 中的 TOOLS 数组
  - SEO meta 标签中的工具数量
- CI 会检查两者是否同步，不同步则构建失败

## 样式约定

- **字体**:
  - 正文: Space Grotesk (sans-serif)
  - 代码/输入: JetBrains Mono (monospace)
- **颜色系统**: 通过 CSS 变量定义,支持明暗主题
- **设计风格**: 赛博朋克/暗色主题为主,带有霓虹渐变和发光效果
- **响应式**: 使用 `clamp()` 和媒体查询适配移动端

## CI/CD 和部署

- **Lint CI**: 每次 PR 自动运行 HTMLHint + Stylelint + ESLint
- **Tools Sync Check**: CI 检查 tools.json 与 index.html 是否同步
- **Deploy CI**: 推送到 master 自动部署到 GitHub Pages
- **多平台部署**: 同时部署到 GitHub Pages, Vercel, Netlify, Cloudflare Pages

## 开发注意事项

1. **保持单文件原则**: 新增工具必须是完全独立的 HTML 文件,不要引用本地文件
2. **CDN 优先**: 外部库必须从 CDN 加载,不要使用 npm 包
3. **无构建依赖**: 工具必须直接在浏览器打开即可运行,不能依赖任何构建步骤
4. **隐私优先**: 所有数据处理必须在本地完成,不要向外部服务器发送用户数据
5. **主题适配**: 新工具应支持明暗主题切换 (可选但推荐)
6. **语义化**: 使用语义化的 CSS class 命名 (如 `.tool-card`, `.input-panel`)
7. **键盘无障碍**: 确保交互元素支持键盘导航和焦点样式:
   - 为按钮和可交互元素添加 `:focus-visible` 样式
   - 支持 `Enter` 和 `Space` 键触发操作
   - 使用 `tabindex="0"` 使元素可聚焦 (如果不是原生可聚焦元素)

## 常见陷阱和错误

### 1. DOM 选择器不匹配

**问题**: 修改 index.html 的工具卡片结构后，JavaScript 代码可能使用错误的选择器

**症状**: 工具列表无法显示，浏览器控制台报 "Cannot read property 'textContent' of null" 错误

**解决方案**:
- 工具卡片使用 `<span class="tool-name">` 而非 `<h3>`
- 始终使用 `querySelector('.tool-name')` 或添加 fallback: `querySelector('.tool-name') || querySelector('h3')`
- 修改 HTML 结构后，检查所有相关的 JavaScript 选择器

**示例**:
```javascript
// ❌ 错误 - 假设使用 h3
const title = card.querySelector('h3').textContent;

// ✅ 正确 - 使用 .tool-name 并添加 null 检查
const titleEl = card.querySelector('.tool-name');
const title = titleEl ? titleEl.textContent : '';

// ✅ 最佳 - 向后兼容
const titleEl = card.querySelector('.tool-name') || card.querySelector('h3');
const title = titleEl ? titleEl.textContent : '';
```

### 2. 同步状态不一致

**问题**: tools.json 和 index.html 中的工具列表不同步

**症状**: CI 构建失败，提示 "Tools sync check failed"

**解决方案**:
- 修改 tools.json 后必须运行 `npm run sync:tools`
- 提交前运行 `npm run lint` 检查同步状态
- CI 会自动检测，本地先检查可避免失败的 CI

### 3. ESLint 误报未使用的变量

**问题**: HTML 内联 JavaScript 中的函数在 onclick 属性中调用，ESLint 误报为未使用

**解决方案**: 已在 eslint.config.js 中配置忽略模式：
```javascript
'no-unused-vars': ['warn', {
  argsIgnorePattern: '^_|^e$|^event$|^error$',
  varsIgnorePattern: '^_'
}]
```

### 4. CDN 缓存问题

**问题**: 部署后新版本未生效，用户仍看到旧版本

**解决方案**:
- GitHub Pages/Cloudflare 等平台有 CDN 缓存
- 用户需要强制刷新（Ctrl+F5 / Cmd+Shift+R）或清除缓存
- 部署后等待 1-2 分钟让 CDN 更新

## 相关文档

- 灵感来源: [Useful patterns for building HTML tools](https://simonwillison.net/2025/Jan/13/useful-patterns-for-html-tools/)
- 在线演示: https://chicogong.github.io/html-tools/
