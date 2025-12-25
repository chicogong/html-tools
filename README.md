# HTML Tools

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Lint](https://github.com/chicogong/html-tools/actions/workflows/lint.yml/badge.svg)](https://github.com/chicogong/html-tools/actions/workflows/lint.yml)
[![Deploy](https://github.com/chicogong/html-tools/actions/workflows/deploy.yml/badge.svg)](https://github.com/chicogong/html-tools/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-brightgreen?logo=github)](https://chicogong.github.io/html-tools/)

[![GitHub last commit](https://img.shields.io/github/last-commit/chicogong/html-tools)](https://github.com/chicogong/html-tools/commits/master)
[![GitHub stars](https://img.shields.io/github/stars/chicogong/html-tools?style=social)](https://github.com/chicogong/html-tools/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/chicogong/html-tools?style=social)](https://github.com/chicogong/html-tools/network/members)
[![GitHub issues](https://img.shields.io/github/issues/chicogong/html-tools)](https://github.com/chicogong/html-tools/issues)
[![GitHub repo size](https://img.shields.io/github/repo-size/chicogong/html-tools)](https://github.com/chicogong/html-tools)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![No Build](https://img.shields.io/badge/Build-None-success)

> 纯前端工具集 - 单文件、零构建、可离线使用 | Pure HTML Tools - Single file, Zero build, Offline-ready

## 特点

- **单文件**: 每个工具都是一个独立的 HTML 文件，JS/CSS 全部内联
- **零构建**: 无需 npm、webpack 或任何构建步骤，直接复制粘贴即可使用
- **纯前端**: 所有处理都在浏览器本地完成，不上传任何数据到服务器
- **可分享**: 支持通过 URL 分享当前状态
- **离线友好**: 下载 HTML 文件后可完全离线使用

## 在线体验

**https://chicogong.github.io/html-tools/**

## 工具列表

### 开发工具 (3)

| 工具 | 描述 |
|------|------|
| [JSON-YAML 转换](tools/json-yaml.html) | JSON 与 YAML 格式互转，支持格式化输出 |
| [Base64 编解码](tools/base64.html) | Base64 编码与解码，支持文本和文件 |
| [URL 编解码](tools/url-codec.html) | URL 编码与解码，支持完整 URL 或组件编码 |

### 文本处理 (3)

| 工具 | 描述 |
|------|------|
| [Markdown 预览](tools/markdown-preview.html) | 实时 Markdown 预览，支持 GFM 语法，可导出 HTML |
| [字数统计](tools/word-counter.html) | 统计字符、单词、句子、段落数量，支持目标字数进度追踪 |
| [剪贴板查看器](tools/clipboard-viewer.html) | 查看剪贴板中所有数据类型，调试复制粘贴功能 |

### 图像工具 (4)

| 工具 | 描述 |
|------|------|
| [二维码生成器](tools/qrcode-generator.html) | 生成自定义颜色和大小的二维码，支持下载 PNG |
| [SVG 渲染器](tools/svg-render.html) | 将 SVG 代码渲染为 PNG/JPEG 图片，支持自定义尺寸和背景 |
| [图片压缩对比](tools/image-resize.html) | 比较不同质量设置下的图片压缩效果，找到最佳平衡点 |
| [摄像头拍照](tools/camera-demo.html) | 调用摄像头拍照并保存到本地 |

### 时间日期 (3)

| 工具 | 描述 |
|------|------|
| [时间戳转换](tools/timestamp-converter.html) | Unix 时间戳与日期时间互转，支持秒和毫秒格式 |
| [时区转换器](tools/timezone-converter.html) | 在不同时区之间转换时间，方便跨时区协作 |
| [日期计算器](tools/date-calculator.html) | 计算日期差异、日期推算、工作日统计 |

### 隐私工具 (1)

| 工具 | 描述 |
|------|------|
| [日志脱敏](tools/log-masker.html) | 自动识别并脱敏 IP、邮箱、手机号等敏感信息 |

## 使用方式

### 在线使用

访问 GitHub Pages: https://chicogong.github.io/html-tools/

### 本地使用

1. Clone 仓库或下载单个 HTML 文件
2. 直接在浏览器中打开即可使用

```bash
git clone https://github.com/chicogong/html-tools.git
cd html-tools
open index.html  # macOS
# 或者
start index.html  # Windows
```

### 部署到 GitHub Pages

1. Fork 本仓库
2. 进入 Settings → Pages
3. Source 选择 "GitHub Actions"
4. 等待 CI 运行完成后即可访问 `https://你的用户名.github.io/html-tools/`

### 部署到其他平台

本项目已配置支持多平台部署：

- **Vercel**: 直接导入 GitHub 仓库即可
- **Netlify**: 直接导入 GitHub 仓库即可
- **Cloudflare Pages**: 直接连接 GitHub 仓库即可

配置文件：
- `vercel.json` - Vercel 配置
- `netlify.toml` - Netlify 配置
- `_headers` / `_redirects` - Cloudflare Pages 配置

## 通用功能

每个工具都支持以下功能：

- **粘贴**: 从剪贴板粘贴内容
- **复制输出**: 将处理结果复制到剪贴板
- **分享链接**: 生成包含当前输入内容的 URL，方便分享
- **清空**: 清空输入输出并重置状态
- **自动保存**: 输入内容自动保存到 URL hash，防止意外丢失

## 技术栈

- 纯 HTML/CSS/JavaScript
- CDN 依赖：
  - [js-yaml](https://github.com/nodeca/js-yaml) - YAML 解析
  - [marked](https://github.com/markedjs/marked) - Markdown 渲染
  - [DOMPurify](https://github.com/cure53/DOMPurify) - XSS 防护
  - [QRCode.js](https://github.com/soldair/node-qrcode) - 二维码生成

## 开发

```bash
# 安装 lint 依赖
npm install

# 运行 lint 检查
npm run lint

# 单独检查
npm run lint:html  # HTMLHint
npm run lint:css   # Stylelint
npm run lint:js    # ESLint
```

## CI/CD

- **Lint**: 每次 PR 自动运行 HTMLHint + Stylelint + ESLint
- **Deploy**: 每次推送到 master 自动部署到 GitHub Pages
- **Release**: 推送 tag 自动创建 Release
- **Dependabot**: 自动检查依赖更新

## 灵感来源

本项目受 [Simon Willison](https://simonwillison.net/) 的 [tools.simonwillison.net](https://tools.simonwillison.net/) 和他的博客文章 [Useful patterns for building HTML tools](https://simonwillison.net/2025/Jan/13/useful-patterns-for-html-tools/) 启发。

## License

[MIT](LICENSE)
