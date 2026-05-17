# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

纯前端工具集，每个工具是独立的单文件 HTML（HTML/CSS/JS 全部内联）。无构建步骤，浏览器直接打开即可运行。所有数据处理在本地完成，不向服务器发送用户数据。

## 开发命令

```bash
npm install                # 安装 lint 工具（仅开发时需要）
npm run lint               # 运行全部 lint（HTMLHint + Stylelint + ESLint）
npm run lint:html          # 仅 HTMLHint
npm run lint:css           # 仅 Stylelint
npm run lint:js            # 仅 ESLint
npm run lint:fix           # 自动修复 CSS 问题
npm run format             # Prettier 格式化
npm run format:check       # 检查格式（不修改）
npm run sync:tools         # 将 tools.json 同步到 index.html/README/sitemap/manifest
npm test                   # 运行测试套件（tools.json/数据质量/同步/HTML 结构/重定向）
```

**没有** `npm run build` 或 `npm start`。提交前必须通过：`npm run lint && npm run format:check && npm test`

## 核心架构

### 数据流：tools.json → 多文件同步

`tools.json` 是工具列表的 **Single Source of Truth**。结构：

```json
{
  "categories": { "dev": { "name": "开发工具", "icon": "⚡", "color": "cyan" }, ... },
  "tools": { "1": { "path": "tools/dev/json-formatter.html", "name": "JSON 格式化", "category": "dev", "keywords": "...", "icon": "{}", "description": "..." }, ... }
}
```

注意：`tools` 是以数字字符串为 key 的对象（非数组）。

运行 `npm run sync:tools`（即 `scripts/sync-all.js`）会同步更新：

- `index.html` 中的 CATEGORIES/TOOLS 数组和 SEO meta
- `README.md` 中的工具数量
- `sitemap.xml` 中的 URL 列表
- `manifest.json` 中的描述
- `llms.txt` 工具列表
- `i18n/*.json` 副标题中的工具数

**CI 会检查同步状态，不同步则构建失败。**

### index.html 主页

JavaScript 从内联的 TOOLS/CATEGORIES 数组动态渲染工具卡片（`renderTools()` 函数，使用 `document.createElement`）。

**关键 DOM 约定**：工具卡片使用 `<span class="tool-name">` 存储名称，所有 JS 必须用 `.tool-name` 选择器（非 `h3`）：

```html
<a href="..." class="tool-card" data-category="..." data-keywords="...">
  <div class="tool-card-header">
    <span class="tool-icon">⚡</span>
    <span class="tool-name">工具名</span>
  </div>
</a>
```

主页功能：分类筛选、实时搜索、收藏（localStorage `html_tools_favorites_v1`）、最近使用（`html_tools_recent_v1`）、中英文切换（`html_tools_lang_v1`）、明暗主题切换（`data-theme="light"`）、PWA 离线支持。

### 单文件工具架构

每个工具文件包含：

- 内联 `<style>`（CSS 变量定义主题）+ 内联 `<script>`（工具逻辑）
- 字体从 Google Fonts CDN 加载，外部库从 jsDelivr 等 CDN 加载
- 通用功能模式：URL Hash 持久化输入、剪贴板读写、分享链接、清空重置

## 添加新工具

1. 在 `tools/<category>/` 下创建 `.html` 文件（复制 `tools/dev/json-formatter.html` 作模板，包含最新设计系统、面包屑导航、SEO Schema）
2. 在 `tools.json` 的 `tools` 对象中添加条目（key 为下一个数字）
3. 运行 `npm run sync:tools`
4. 运行 `npm run lint && npm run format:check && npm test` 确认通过

## 样式约定

- **字体**: Space Grotesk（正文）、JetBrains Mono（代码/输入）
- **主题**: 暗色赛博朋克为主，CSS 变量驱动，支持 `[data-theme="light"]` 覆盖
- **域名**: `tools.realtime-ai.chat`（sitemap、canonical URL、OG 标签等）

## CI/CD

- PR 触发：HTMLHint + Stylelint + ESLint + Prettier check + 测试套件（`npm test`）+ tools.json 同步检查
- 推送 master：自动部署到 GitHub Pages、Vercel、Netlify、Cloudflare Pages

## 常见陷阱

1. **DOM 选择器**：工具卡片名称是 `.tool-name`（不是 `h3`），用 `querySelector('.tool-name')` 并做 null 检查
2. **同步遗忘**：改了 `tools.json` 忘记 `npm run sync:tools` → CI 失败
3. **ESLint 误报**：HTML 内联 JS 中 `onclick` 调用的函数会被报未使用，已通过 `varsIgnorePattern: '^_'` 配置缓解
