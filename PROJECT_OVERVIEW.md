# WebUtils 项目概览

## 🎯 项目简介

**WebUtils** 是一个纯前端在线工具集合，包含 638+ 个实用工具。采用**单文件架构**（无构建步骤），所有工具都是独立的 HTML 文件，可以离线使用，数据完全在本地处理，保护隐私。

- **在线访问**: https://chicogong.github.io/html-tools/
- **备用访问**: 
  - Vercel: https://html-tools-jade.vercel.app
  - Cloudflare: https://htmltools-bkt.pages.dev

## 📊 项目状态

```
✅ 仓库已克隆: html-tools/
✅ 依赖已安装: 287 packages (8s)
✅ 代码检查通过: 645 文件扫描完成
⚠️ 轻微警告: 11 个未使用变量 (不影响使用)
✅ Git 状态: 干净，无未提交更改
```

最新提交: `faf9d3a` - 修复卡片 hover 时的重复边框问题

## 🗂️ 项目结构

```
html-tools/
├── 📄 index.html              # 主页 - 工具目录（搜索 + 分类过滤）
├── 📁 tools/                  # 638+ 个工具（按分类组织）
│   ├── dev/                   # 开发工具
│   ├── text/                  # 文本处理
│   ├── time/                  # 时间工具
│   ├── generator/             # 生成器
│   ├── privacy/               # 隐私工具
│   ├── media/                 # 媒体工具
│   ├── security/              # 安全工具
│   ├── network/               # 网络工具
│   ├── calculator/            # 计算器
│   ├── extractor/             # 数据提取
│   ├── ai/                    # AI 工具
│   └── ...                    # 更多分类
├── 📁 templates/              # 工具模板
├── 📁 scripts/                # 构建脚本
│   ├── sync-tools.js          # 同步 tools.json → index.html
│   └── sync-readme.js         # 更新 README.md
├── 📄 tools.json              # 工具元数据（单一数据源）
├── 📄 package.json            # 依赖（仅用于代码检查）
├── 📄 CODEBUDDY.md            # AI 助手使用指南
└── 📄 README.md               # 项目文档
```

## 🛠️ 技术架构

### 核心特点
- **零构建**: 不需要 webpack/vite/npm build
- **单文件**: 每个工具都是独立的 HTML 文件（内联 CSS + JS）
- **离线优先**: 下载后可完全离线使用
- **隐私保护**: 100% 本地处理，数据不上传

### 技术栈
- **HTML5** - 结构
- **CSS3** - 样式（CSS Variables + Grid/Flexbox）
- **Vanilla JavaScript** - 逻辑（无框架）
- **CDN 依赖**（仅必要时）:
  - `js-yaml` - JSON ↔ YAML 转换
  - `jsdiff` - 文本对比
  - `marked` + `DOMPurify` - Markdown 预览
  - `QRCode.js` - 二维码生成

### 设计系统
- **主题**: Neo-Brutalist Tech Dark
- **配色**:
  - 背景: `#0a0a0f` (深黑)
  - 主色: `#00f5d4` (青色), `#f72585` (品红)
  - 分类色: 开发=青, 文本=蓝, 时间=黄, 生成=品红, 隐私=紫, 媒体=红
- **字体**:
  - 代码: JetBrains Mono
  - UI: Space Grotesk

## 🔧 开发命令

```bash
# 安装依赖（仅用于代码检查）
npm install

# 代码检查
npm run lint              # 运行所有检查
npm run lint:html         # HTMLHint
npm run lint:css          # Stylelint (HTML 内的 CSS)
npm run lint:js           # ESLint (HTML 内的 JS)
npm run lint:fix          # 自动修复 CSS 问题

# 同步工具列表
npm run sync:tools        # tools.json → index.html
npm run sync:readme       # 更新 README.md
npm run sync              # 同时运行上述两个命令

# 本地开发
open index.html           # macOS 直接打开
python3 -m http.server 8080  # 启动本地服务器（某些工具需要 HTTP）
```

## 📝 添加新工具流程

### 1. 创建工具文件
在 `tools/[分类]/[工具名].html` 创建文件，使用以下模板：

```html
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>[工具名] - HTML Tools</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&family=Space+Grotesk&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-deep: #0a0a0f;
      --accent-cyan: #00f5d4;
      /* ... 其他 CSS 变量 ... */
    }
    /* 工具样式 */
  </style>
</head>
<body>
  <div class="bg-grid"></div>
  <div class="container">
    <a href="../../index.html" class="back-link">← 返回</a>
    <!-- 工具 UI -->
  </div>
  <script>
    // 工具逻辑
  </script>
</body>
</html>
```

### 2. 更新 tools.json
```json
{
  "path": "tools/[分类]/[工具名].html",
  "name": "工具显示名称",
  "category": "[分类]",
  "keywords": "关键词1 关键词2 keyword3"
}
```

### 3. 同步和提交
```bash
npm run sync:tools        # 同步到 index.html
npm run sync:readme       # 更新 README.md
npm run lint              # 检查代码
git add .
git commit -m "feat: 添加 [工具名]"
git push
```

## 🔍 工具必备功能

每个工具应该实现：

1. **粘贴按钮** - 从剪贴板读取
2. **复制按钮** - 输出复制到剪贴板
3. **分享按钮** - 编码状态到 URL hash
4. **清除按钮** - 重置状态和 localStorage
5. **自动保存** - 输入变化时保存到 localStorage

示例代码：
```javascript
// 自动保存
const LS_KEY = 'tool-name-state';
input.addEventListener('input', () => {
  localStorage.setItem(LS_KEY, input.value);
});

// URL 分享
function saveToUrl() {
  location.hash = btoa(encodeURIComponent(input.value));
}

// 剪贴板操作
async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text);
}
```

## 🚀 CI/CD 流程

### GitHub Actions
- **Lint**: PR 触发 → HTMLHint + Stylelint + ESLint
- **Tools Sync Check**: 验证 `tools.json` 和 `index.html` 同步状态
- **Deploy**: Push 到 master → 自动部署到 GitHub Pages
- **Release**: Push tag → 创建 GitHub Release

### 部署平台
- **GitHub Pages**: 主站
- **Vercel**: 备用（自动部署）
- **Cloudflare Pages**: 备用（自动部署）

## 📚 可用工具分类

| 分类 | 工具数 | 示例工具 |
|------|--------|----------|
| 🔧 开发工具 | 100+ | JSON 格式化, JWT 解码, 正则测试 |
| 📝 文本处理 | 80+ | Markdown 预览, 文本对比, 字数统计 |
| ⏰ 时间工具 | 40+ | 时间戳转换, Cron 解析, 日期计算 |
| 🎲 生成器 | 60+ | UUID, 二维码, 密码生成器 |
| 🔒 隐私工具 | 30+ | 日志脱敏, 数据匿名化 |
| 🎨 媒体工具 | 50+ | 图片压缩, 图片裁剪, SVG 编辑 |
| 🔐 安全工具 | 40+ | 哈希计算, 加密解密 |
| 🌐 网络工具 | 50+ | IP 查询, DNS 检查, HTTP 客户端 |
| 🧮 计算器 | 70+ | 进制转换, 科学计算器 |
| 📊 数据提取 | 60+ | 表格提取, 数据清洗 |
| 🤖 AI 工具 | 58+ | Prompt 模板, AI 编码指南 |

**总计**: 638+ 工具

## 🎯 下一步开发建议

### 优化方向
1. **性能优化**: 
   - 懒加载工具卡片（index.html）
   - 优化搜索算法（使用 Web Worker）

2. **功能增强**:
   - 添加工具收藏功能
   - 实现工具使用历史记录
   - 添加快捷键支持

3. **国际化**:
   - 添加英文版本
   - 实现多语言切换

4. **PWA 支持**:
   - 添加 Service Worker
   - 实现离线缓存
   - 支持安装到桌面

### 新工具想法
- 代码美化器（多语言支持）
- API 测试工具
- 颜色选择器
- 字体预览工具
- CSS 动画生成器

## 🤝 贡献指南

参考 `CONTRIBUTING.md` 了解详细的贡献流程。

简要步骤：
1. Fork 仓库
2. 创建分支 `git checkout -b feature/new-tool`
3. 添加工具并测试
4. 提交 PR

## 📞 联系方式

- **GitHub Issues**: https://github.com/chicogong/html-tools/issues
- **作者**: chicogong

---

*最后更新: 2025-12-29*
*项目版本: 1.0.0*
*工具数量: 638+*
