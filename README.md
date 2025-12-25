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

### 开发工具

| 工具 | 描述 |
|------|------|
| [JSON 格式化](tools/json-formatter.html) | JSON 格式化、压缩、校验，支持错误定位和统计 |
| [JSON-YAML 转换](tools/json-yaml.html) | JSON 与 YAML 格式互转，支持格式化输出 |
| [JWT 解码器](tools/jwt-decoder.html) | 解码 JWT Token，查看 Header、Payload 和签名信息 |
| [Base64 编解码](tools/base64.html) | Base64 编码与解码，支持文本和文件 |
| [URL 编解码](tools/url-codec.html) | URL 编码与解码，支持完整 URL 或组件编码 |
| [正则测试器](tools/regex-tester.html) | 正则表达式测试，匹配高亮，捕获组展示 |
| [剪贴板查看器](tools/clipboard-viewer.html) | 查看剪贴板中的各种格式数据 |

### 文本工具

| 工具 | 描述 |
|------|------|
| [文本 Diff](tools/text-diff.html) | 文本差异对比，高亮显示增删改内容 |

### 时间工具

| 工具 | 描述 |
|------|------|
| [时间戳转换](tools/timestamp.html) | 时间戳与日期互转，支持多种格式和时区 |

### 生成器

| 工具 | 描述 |
|------|------|
| [UUID/ULID 生成器](tools/uuid-generator.html) | 生成 UUID v4/v7 和 ULID，支持批量生成 |

### 隐私工具

| 工具 | 描述 |
|------|------|
| [日志脱敏](tools/log-masker.html) | 自动识别并脱敏 IP、邮箱、手机号等敏感信息 |

### 媒体工具

| 工具 | 描述 |
|------|------|
| [图片压缩](tools/image-compressor.html) | 本地图片压缩，支持调整质量、尺寸和格式转换 |
| [摄像头拍照](tools/camera-demo.html) | 调用摄像头拍照并保存到本地 |

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

## 通用功能

每个工具都支持以下功能：

- **粘贴**: 从剪贴板粘贴内容
- **复制输出**: 将处理结果复制到剪贴板
- **分享链接**: 生成包含当前输入内容的 URL，方便分享
- **清空**: 清空输入输出并重置状态
- **自动保存**: 输入内容自动保存到 localStorage，防止意外丢失

## 技术栈

- 纯 HTML/CSS/JavaScript
- CDN 依赖:
  - [js-yaml](https://github.com/nodeca/js-yaml) - JSON-YAML 工具使用
  - [jsdiff](https://github.com/kpdecker/jsdiff) - 文本 Diff 工具使用

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

本项目受 [Simon Willison](https://simonwillison.net/) 的 [Useful patterns for building HTML tools](https://simonwillison.net/2025/Jan/13/useful-patterns-for-html-tools/) 文章启发。

## License

[MIT](LICENSE)
