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
├── tools/                  # 所有工具按类别组织 (22 个分类)
│   ├── dev/               # 开发工具 (JSON, JWT, Base64, URL, Regex 等)
│   ├── text/              # 文本工具 (Diff, Markdown, 字数统计)
│   ├── time/              # 时间工具 (时间戳, 时区, 日期计算)
│   ├── generator/         # 生成器 (UUID, QRCode, 密码)
│   ├── media/             # 媒体工具 (图片压缩, SVG, 摄像头, GIF)
│   ├── privacy/           # 隐私安全 (日志脱敏, 加密)
│   ├── security/          # 安全工具 (AES, RSA, 密码强度)
│   ├── network/           # 网络工具 (IP, 端口, MAC)
│   ├── calculator/        # 计算器 (百分比, 进度, 宽高比)
│   ├── converter/         # 转换器 (单位, 文件大小)
│   ├── extractor/         # 提取器 (链接, 文本)
│   ├── ai/                # AI 工具 (Token 计数, Prompt 模板)
│   ├── ai-coding/         # AI 编程 (Cursor, Claude 指南)
│   ├── seo/               # SEO 工具 (Meta 标签, OG 预览)
│   ├── fun/               # 趣味工具 (记忆测试, 反应测试)
│   ├── game/              # 小游戏 (贪吃蛇, 俄罗斯方块)
│   ├── life/              # 生活工具 (剪贴板, 便签, 计数器)
│   ├── finance/           # 财务工具 (房贷, 复利, 汇率)
│   ├── health/            # 医疗健康 (BMI, BMR, 预产期)
│   ├── education/         # 教育学习 (打字测试, 记忆训练)
│   ├── food/              # 餐饮食品 (菜谱, 营养计算)
│   └── chinese/           # 中文工具 (拼音, 繁简转换)
├── scripts/
│   └── sync-all.js        # 统一同步脚本 (tools.json → index.html, README, sitemap, manifest)
├── package.json           # lint 和 sync 脚本依赖
├── PWA 相关文件:
│   ├── sw.js              # Service Worker (离线缓存、请求拦截)
│   ├── offline.html       # 离线回退页面 (断网时显示已缓存工具列表)
│   └── manifest.json      # PWA 清单 (应用名称、图标、快捷方式)
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

# 运行 tools.json 验证测试
npm test
```

**注意**: 这个项目没有 `npm run build` 或 `npm start` 命令。`npm test` 用于验证 tools.json 的完整性（检查必需字段、文件存在、分类引用等）。

## 架构设计

### 1. 单文件架构

每个工具文件的典型结构:

```html
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8" />
  <title>工具名 - WebUtils</title>

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
- **分类筛选**: 按工具类别筛选 (共 22 个分类，见项目结构)
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
- **PWA 离线支持**:
  - Service Worker (`sw.js`) 拦截网络请求并缓存资源
  - 离线页面 (`offline.html`) 显示已缓存的工具列表
  - 支持"添加到主屏幕"功能
- **国际化 (i18n)**:
  - 支持中文/英文切换 (右上角语言按钮)
  - 语言偏好保存在 localStorage (`html_tools_lang_v1`)
  - 分类名、搜索框、空状态文案等动态切换
- **最近使用功能**:
  - 新增「最近」分类,记录最近使用的 20 个工具
  - 点击工具卡片时自动记录
  - 数据保存在 localStorage (`html_tools_recent_v1`)

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

## Sitemap 维护

sitemap.xml 用于 SEO，帮助搜索引擎发现和索引所有工具页面。

### 何时需要重新生成 Sitemap

- 添加新工具后
- 删除工具后
- 修改工具 URL 后
- 定期检查（确保 sitemap 与 tools.json 同步）

### Sitemap 生成步骤

**1. 检查当前状态**
```bash
# 统计 sitemap 中的 URL 数量
grep -c "<loc>" sitemap.xml

# 统计 tools.json 中的工具数量
node -e "const data = require('./tools.json'); console.log('Total tools:', data.tools.length);"
```

**2. 重新生成 sitemap.xml**

sitemap.xml 需要根据 tools.json 手动生成，包含：
- 1 个主页 URL (priority: 1.0, changefreq: weekly)
- N 个工具页 URL (priority: 0.8, changefreq: monthly)
- 正确的域名: `tools.realtime-ai.chat`
- 当前日期作为 lastmod

**3. 验证 XML 格式**
```bash
# 验证 XML 格式是否正确
xmllint --noout sitemap.xml && echo "✅ XML 格式验证通过"
```

**4. 提交更改**
```bash
# 提交 sitemap 更新
git add sitemap.xml
git commit -m "chore: regenerate sitemap with all N tools from tools.json"
git push
```

### Sitemap 格式规范

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 主页 -->
  <url>
    <loc>https://tools.realtime-ai.chat/</loc>
    <lastmod>2025-12-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- 工具页 -->
  <url>
    <loc>https://tools.realtime-ai.chat/tools/dev/json-formatter.html</loc>
    <lastmod>2025-12-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- ... 更多工具 ... -->
</urlset>
```

### 重要提醒

- **数据源**: sitemap.xml 应该基于 tools.json 生成，确保两者一致
- **URL 数量**: 总 URL 数 = 1 (主页) + tools.json 中的工具数量
- **域名**: 必须使用 `tools.realtime-ai.chat`，不能是 GitHub Pages 域名
- **日期格式**: lastmod 使用 `YYYY-MM-DD` 格式 (ISO 8601)
- **验证**: 提交前必须用 xmllint 验证 XML 格式

## 样式约定

- **字体**:
  - 正文: Space Grotesk (sans-serif)
  - 代码/输入: JetBrains Mono (monospace)
- **颜色系统**: 通过 CSS 变量定义,支持明暗主题
- **设计风格**: 赛博朋克/暗色主题为主,带有霓虹渐变和发光效果
- **响应式**: 使用 `clamp()` 和媒体查询适配移动端

## SEO 优化模板

### 面包屑导航 (Breadcrumb Navigation)

为了提升 SEO 和用户体验,工具页面应该包含面包屑导航。参考实现: `tools/dev/json-formatter.html`

**1. 在 `<head>` 中添加 JSON-LD BreadcrumbList Schema:**

```html
<!-- JSON-LD BreadcrumbList Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "首页",
      "item": "https://tools.realtime-ai.chat/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "开发工具",  <!-- 根据工具类别修改: dev/text/time/generator/privacy/media 等 -->
      "item": "https://tools.realtime-ai.chat/#dev"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "JSON 格式化",  <!-- 修改为实际工具名称 -->
      "item": "https://tools.realtime-ai.chat/tools/dev/json-formatter.html"
    }
  ]
}
</script>
```

**2. 在 `<style>` 中添加面包屑 CSS (放在 `.back-link` 样式前):**

```css
/* Breadcrumb Navigation */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  padding: 8px 14px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  flex-wrap: wrap;
}

.breadcrumb a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb a:hover {
  color: var(--accent-cyan);
}

.breadcrumb-separator {
  color: var(--text-muted);
  user-select: none;
}

.breadcrumb-current {
  color: var(--text-primary);
  font-weight: 500;
}
```

**3. 在 `<body>` 中替换 `.back-link` 为面包屑导航:**

```html
<!-- 旧版本: -->
<a href="../../index.html" class="back-link">← 返回</a>

<!-- 新版本: -->
<nav class="breadcrumb" aria-label="Breadcrumb">
  <a href="../../index.html">首页</a>
  <span class="breadcrumb-separator">/</span>
  <a href="../../index.html#dev">开发工具</a>  <!-- 修改类别: #dev #text #time #generator #privacy #media 等 -->
  <span class="breadcrumb-separator">/</span>
  <span class="breadcrumb-current">JSON 格式化</span>  <!-- 修改为实际工具名称 -->
</nav>
```

**类别对照表:**
- `dev` → 开发工具
- `text` → 文本工具
- `time` → 时间工具
- `generator` → 生成器
- `privacy` → 隐私工具
- `media` → 媒体工具
- `security` → 安全工具
- `network` → 网络工具
- `calculator` → 计算器
- `converter` → 转换器
- `extractor` → 提取器
- `ai` → AI 工具

### Favicon & App Icons

项目使用简约的 3×3 网格设计作为品牌图标,象征工具集合。

**已创建的图标文件:**
```
favicon.svg           # 矢量图标 (可缩放到任意尺寸)
favicon-16x16.png     # 标准浏览器标签页图标
favicon-32x32.png     # 高清浏览器图标
apple-touch-icon.png  # iOS/macOS 添加到主屏幕图标 (180x180)
```

**设计规范:**
- **背景色**: `#0a0a0f` (项目主题深色)
- **图案色**: 青色渐变 `#00f5d4` → `#00d9ff`
- **图案**: 3×3 网格,每个方块 16×16px,圆角 3px,间距 6px
- **边距**: 四周 20px 留白
- **圆角**: 外框圆角 20px

**生成命令** (使用 rsvg-convert):
```bash
# 从 SVG 生成各尺寸 PNG
rsvg-convert -w 16 -h 16 favicon.svg -o favicon-16x16.png
rsvg-convert -w 32 -h 32 favicon.svg -o favicon-32x32.png
rsvg-convert -w 180 -h 180 favicon.svg -o apple-touch-icon.png
```

**在 HTML 中引用** (已添加到 index.html):
```html
<link rel="icon" type="image/svg+xml" href="favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
<meta name="theme-color" content="#0a0a0f" />
```

### PWA Manifest (manifest.json)

Progressive Web App 配置文件,允许用户将网站安装到设备主屏幕。

**核心配置:**
```json
{
  "name": "WebUtils - 纯前端工具集",
  "short_name": "WebUtils",
  "display": "standalone",
  "theme_color": "#0a0a0f",
  "background_color": "#0a0a0f"
}
```

**已配置功能:**
- **App Shortcuts**: 4 个快捷方式到常用工具 (JSON/时间戳/Base64/二维码)
- **Icons**: 多尺寸图标支持 PWA 安装
- **Categories**: utilities, productivity, developer tools
- **截图**: 使用 social-preview.png 作为应用预览

**在 HTML 中引用** (已添加到 index.html):
```html
<link rel="manifest" href="manifest.json" />
```

### FAQ Schema (常见问题结构化数据)

在 index.html 中添加 FAQPage Schema,帮助 Google 在搜索结果中显示常见问题。

**已添加的 8 个问答:**
1. WebUtils 是什么？
2. 这些工具安全吗？我的数据会被上传到服务器吗？
3. 如何使用这些工具？
4. 可以离线使用吗？
5. 支持哪些浏览器？
6. 有哪些主要工具类别？
7. 工具是否收费？
8. 如何分享处理结果？

**实现位置**: index.html 的 `<head>` 中,在 WebSite Schema 之后

**格式示例:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "问题内容",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "答案内容"
      }
    }
  ]
}
</script>
```

### 字体加载优化

使用 preload 和 "print media hack" 优化 Google Fonts 加载,避免阻塞渲染。

**优化策略:**
```html
<!-- 1. DNS 预连接 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- 2. 预加载字体 CSS -->
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap">

<!-- 3. 使用 print media hack 异步加载 -->
<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet" media="print" onload="this.media='all'">

<!-- 4. 无 JS 降级方案 -->
<noscript><link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet"></noscript>
```

**工作原理:**
- `preload` 提前下载 CSS,不阻塞渲染
- `media="print"` 让浏览器认为是打印样式,低优先级加载
- `onload="this.media='all'"` 加载完成后切换为全局样式
- `display=swap` 参数确保文字立即显示,使用系统字体过渡

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
