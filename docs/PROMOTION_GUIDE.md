# 推广发布指南

本文档包含在各大技术社区发布 WebUtils 的文案模板和注意事项。

---

## 📱 V2EX 发布

### 发布板块
- **推荐**: `/t/create` - [分享创造](https://www.v2ex.com/go/create)
- **备选**: `/go/programmer` - 程序员板块

### 标题
```
[分享] 我开源了 132 个纯前端在线工具，单文件、零构建、可离线使用
```

### 正文
```markdown
大家好！

分享一个我最近开源的项目：**WebUtils** - 一个纯前端在线工具集。

## 🎯 特点

- **132 个实用工具**: JSON 格式化、时间戳转换、图片压缩、正则测试、Base64 编解码等
- **单文件架构**: 每个工具都是独立的 HTML 文件，JS/CSS 全部内联，无需构建步骤
- **隐私至上**: 所有处理都在浏览器本地完成，数据不上传服务器
- **完全离线**: 下载 HTML 文件后可以完全脱机使用
- **开源免费**: MIT 协议，无广告、无追踪

## 🔗 链接

- **在线体验**: https://tools.realtime-ai.chat
- **GitHub**: https://github.com/chicogong/html-tools

## 💡 为什么做这个？

市面上的在线工具网站大多需要上传数据到服务器，而且很多工具用 React/Vue 构建，加载缓慢。我想做一个：
- 完全本地处理的工具（保护隐私）
- 无需构建步骤（下载即用）
- 加载极快（无框架开销）

## 🛠️ 技术栈

纯 HTML/CSS/JavaScript，部分工具使用 CDN 库（如 marked.js, jsdiff 等）。

欢迎试用和反馈！⭐ Star 支持一下 😊
```

### 发布时间建议
- 工作日 **上午 10:00-11:00** 或 **下午 15:00-16:00**
- 避免周末和节假日

### 注意事项
- ✅ 语气友好，不要过度营销
- ✅ 突出"隐私保护"和"离线使用"特点
- ✅ 最后邀请 Star，但不要强求
- ❌ 不要刷屏或重复发帖

---

## 📝 掘金发布

### 发布分类
- **代码人生** 或 **前端**

### 标题
```
我用纯 HTML 开发了 132 个在线工具，不用 Vue/React，性能反而更好
```

### 正文
````markdown
## 前言

最近花了一些时间开发了一个在线工具集项目 —— **WebUtils**，目前已经包含 132 个实用工具。

与大多数在线工具网站不同的是，我**没有使用任何前端框架**（Vue/React/Angular），每个工具都是一个独立的 HTML 文件，JS 和 CSS 全部内联。

**项目地址**: https://github.com/chicogong/html-tools
**在线体验**: https://tools.realtime-ai.chat

## 🤔 为什么不用框架？

刚开始很多朋友问我："为什么不用 React/Vue？那样不是更容易吗？"

我的理由：

### 1. **性能更好**
- 无框架 overhead，首屏加载极快（< 50ms）
- 工具页面平均大小 < 20KB
- Lighthouse Performance 评分 90+

### 2. **隐私保护**
- 所有处理都在浏览器本地完成
- **数据不上传任何服务器**
- 用户可以下载 HTML 文件完全离线使用

### 3. **零构建步骤**
- 无需 `npm install`
- 无需 `npm run build`
- 直接打开 HTML 文件即可运行
- 非常适合企业内网环境

### 4. **易于分享和嵌入**
- 单个 HTML 文件可以通过邮件、U 盘、内网等任意方式分享
- 其他网站可以直接 iframe 嵌入

## 🛠️ 包含哪些工具？

目前包含 **11 个分类，132 个工具**：

### 开发工具 (48 个)
- JSON 格式化 / 压缩 / 校验
- 正则表达式测试器
- Base64 / URL / HTML 实体编解码
- JWT Token 解码器
- Hash / HMAC 生成器
- ... 更多

### 时间工具 (8 个)
- 时间戳转换
- 时区转换器
- Cron 表达式解析
- ...

### 媒体工具 (16 个)
- 图片压缩（本地压缩，不上传）
- 图片格式转换
- 二维码生成器
- ...

### 其他分类
文本工具、生成器、隐私安全、网络工具、计算器、转换器、提取器、AI 工具等。

**完整列表**: https://github.com/chicogong/html-tools#工具列表-132-个

## 💡 技术实现

### 核心架构

每个工具遵循以下模式：

```html
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8">
  <title>工具名称</title>
  <style>
    /* 所有 CSS 内联 */
  </style>
</head>
<body>
  <!-- HTML 结构 -->

  <script>
    // 所有 JavaScript 内联
    // 核心功能实现
  </script>
</body>
</html>
```

### URL 状态持久化

使用 `location.hash` 保存工具状态，刷新不丢失：

```javascript
function saveState() {
  const state = { input, output, options };
  history.replaceState(null, '', '#' + btoa(JSON.stringify(state)));
}

function loadState() {
  try {
    const hash = location.hash.slice(1);
    if (hash) return JSON.parse(atob(hash));
  } catch (e) {}
  return null;
}
```

### 第三方库使用

需要时通过 CDN 加载：

```html
<script src="https://cdn.jsdelivr.net/npm/marked@4.0.0/marked.min.js"></script>
```

## 📊 SEO 优化

为了让工具更容易被搜索到，做了完善的 SEO 优化：

- ✅ Schema.org 结构化数据（WebApplication, FAQPage, BreadcrumbList）
- ✅ Open Graph 社交媒体预览
- ✅ PWA 支持（可安装到桌面）
- ✅ Sitemap 包含所有工具页面
- ✅ 已提交到 Google/Bing/百度/头条等搜索引擎

预计 Lighthouse SEO 评分: **98/100**

## 🚀 部署方案

项目支持多平台一键部署：

- GitHub Pages（主站）
- Vercel
- Netlify
- Cloudflare Pages
- Render
- Surge

**CI/CD**: 推送到 master 自动部署到所有平台

## 🎨 设计风格

采用赛博朋克/暗色主题：

- 深色背景 + 霓虹色强调
- 支持明暗主题切换
- 响应式设计，移动端友好

## 📈 后续计划

- [ ] 添加更多工具（目标 200+）
- [ ] 浏览器扩展（快捷访问常用工具）
- [ ] 工具间相关推荐
- [ ] 多语言支持（英文版）

## 🤝 参与贡献

欢迎贡献新工具或改进现有工具！

```bash
# Fork 并 clone
git clone https://github.com/你的用户名/html-tools.git
cd html-tools

# 添加新工具
# 1. 在 tools/ 下创建 HTML 文件
# 2. 在 tools.json 中注册
# 3. 运行 npm run sync:tools
# 4. 提交 PR
```

## 总结

**单文件 HTML 工具**虽然看起来"老派"，但在特定场景下有独特优势：

- ✅ **隐私保护**: 数据不离开本地
- ✅ **极致性能**: 无框架开销
- ✅ **易于分享**: 单文件即可传播
- ✅ **永久可用**: 下载后永久离线使用

如果你也关注隐私和性能，欢迎试用 WebUtils！

**项目地址**: https://github.com/chicogong/html-tools
**在线体验**: https://tools.realtime-ai.chat

觉得有用的话，给个 ⭐ Star 支持一下吧！😊
````

### 发布时间建议
- 工作日 **早上 9:00-10:00** 或 **晚上 20:00-21:00**
- 周一或周三效果最好

---

## 🐦 Twitter/X 发布

### 推文文案（中文）
```
🎉 开源了一个纯前端工具集 WebUtils！

✅ 132 个实用工具
✅ 单文件架构，无需构建
✅ 完全离线可用
✅ 数据不上传服务器

包括：JSON 格式化、时间戳转换、图片压缩、正则测试、Hash 生成...应有尽有

🔗 https://tools.realtime-ai.chat
⭐ https://github.com/chicogong/html-tools

#开源 #WebDev #隐私保护
```

### 推文文案（英文）
```
🚀 Just open-sourced WebUtils - 132 pure frontend tools!

✅ Single-file HTML (no build step)
✅ 100% offline capable
✅ Privacy-first (all data stays local)
✅ Lightning fast (no framework overhead)

JSON formatter, timestamp converter, image compressor, regex tester & more

🔗 https://tools.realtime-ai.chat
⭐ https://github.com/chicogong/html-tools

#OpenSource #WebDev #Privacy
```

---

## 📧 Product Hunt 发布（未来计划）

### Tagline
```
132 privacy-first web tools - single file, zero build, offline-ready
```

### Description
```
WebUtils is a collection of 132 pure frontend tools built with vanilla HTML/CSS/JS. Every tool is a single self-contained HTML file - no build step, no frameworks, no data upload. Download once, use offline forever.

Perfect for developers who care about privacy, performance, and simplicity.
```

### Topics
- Developer Tools
- Open Source
- Privacy
- Productivity
- Utilities

---

## 📋 其他平台

### GitHub Discussions
在项目中启用 Discussions，设置以下分类：
- 💬 General - 通用讨论
- 💡 Ideas - 新工具建议
- 🐛 Bug Reports - 问题反馈
- 🙏 Q&A - 使用帮助

### Reddit
适合的 Subreddits：
- r/webdev
- r/javascript
- r/opensource
- r/InternetIsBeautiful

---

## 🎯 推广效果预估

| 平台 | 预期访问量 | 预期 Stars | 时间投入 |
|------|-----------|-----------|---------|
| V2EX | 200-800 | 10-50 | 5 分钟 |
| 掘金 | 1000-5000 | 20-100 | 30 分钟 |
| Twitter/X | 100-500 | 5-20 | 2 分钟 |
| Product Hunt | 500-2000 | 50-200 | 3 小时 |

---

## ⚠️ 注意事项

1. **不要过度营销**: 真诚分享，不要刷屏
2. **及时回复评论**: 积极互动建立社区
3. **选择合适时间**: 工作日上午或晚上效果最好
4. **一次一个平台**: 不要同时在多个平台发布
5. **准备好回答问题**: 常见问题提前准备答案

---

**祝推广顺利！🚀**
