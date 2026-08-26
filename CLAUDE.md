# CLAUDE.md

本文件说明 WebUtils 仓库的工程约定。事实以当前 `package.json`、`tools.json` 和 CI 工作流为准。

## 项目概述

WebUtils 是静态优先的浏览器工具集。每个工具以独立 HTML 页面交付，源码共享 `tool-base.css` 和 `tool-chrome.js`，发布时通过构建脚本生成 `dist/`。

多数格式化、计算和生成任务在浏览器本地处理；网络客户端、公共 API、CDN、字体和图片等功能会连接页面标明或用户选择的第三方。不要对全部工具统一承诺“完全离线”或“绝不联网”。

## 开发命令

```bash
npm ci                    # 按锁文件安装依赖
npm run dev               # 本地开发服务器
npm run build             # 同步数据并生成 dist/
npm test                  # 结构、数据、同步、工具页、重定向和共享能力测试
npm run lint              # HTMLHint + Stylelint + ESLint
npm run format:check      # Prettier 只读检查
npm run format            # Prettier 写入格式化
npm run sync:tools        # 同步 tools.json 到生成内容
npm run check:version     # 校验版本元数据
```

提交前至少运行：

```bash
npm run build
npm test
npm run lint
npm run format:check
git status --short
```

## 数据与生成边界

`tools.json` 是工具目录的单一事实源。`tools` 是以连续数字字符串为 key 的对象，不是数组。

`npm run sync:tools` 会更新：

- `index.html` 内联的分类、工具、计数和 SEO 信息；
- `README.md`、`sitemap.xml`、`manifest.json`、`llms.txt`；
- `i18n/*.json` 的工具数；
- `tools/<分类>/index.html` 分类落地页。

修改 `tools.json` 后必须同步并检查生成差异。不要手工修改会被同步脚本覆盖的数据区块。

## 首页架构

- `index.html`：语义结构、产品文案和内联工具数据；
- `assets/css/main.css`：首页 token、布局和组件；
- `assets/js/main.js`：搜索、分类、收藏、URL 状态和卡片渲染；
- `assets/js/recent-tools.js`：最近使用过滤；
- `assets/js/tool-chrome.js`：主题初始化、最近访问记录、工具页外壳和 Service Worker。

首页控制器依赖 `.tool-card` 的 `data-category`、`data-keywords` 等属性。调整卡片结构或选择器前，必须同时检查搜索、分类、收藏与最近使用逻辑。

## 工具页与共享设计层

所有存量工具共享：

- `assets/css/tool-base.css`：设计 token、兼容变量、基础组件、焦点/动效规则；
- `assets/js/tool-chrome.js`：返回首页、主题切换、最近访问和 fallback 样式。

工具内联 CSS 只实现任务特有布局。新增颜色、间距或通用控件前，先判断是否应进入共享层。视觉与无障碍标准见 `docs/design-system.md`。

新工具推荐以 `tools/calculator/tip-calculator.html` 为结构参考，并确保：

- 一个非空 `<h1>` 和一个 `<main>`；
- 标签、键盘操作、可见焦点和移动触控目标完整；
- 隐私、联网和离线能力描述准确；
- 使用共享 token，不复制新的全局主题；
- 不使用 `transition: all`，支持 `prefers-reduced-motion`。

## 添加工具

1. 在 `tools/<category>/` 创建 HTML 文件。
2. 在 `tools.json.tools` 中使用下一个连续数字 key 注册完整元数据。
3. 运行 `npm run sync:tools`。
4. 运行完整本地门禁并检查生成差异。

项目已有 1000+ 工具，默认优先修复和打磨高价值工具，不以继续增加数量为目标。

## CI/CD 边界

PR/`master` CI 包含构建、版本、依赖审计、历史泄漏/个人路径扫描、制品许可证、lint、格式、测试和同步检查。

推送 `master` 会触发 GitHub Pages、Vercel 和 Cloudflare Pages 生产部署；Render 与 Surge 受显式变量控制，Netlify 工作流已禁用。合并、Tag、Release 与启用部署渠道是不同外部动作，分别审批。

## 常见陷阱

1. 修改 `tools.json` 后忘记同步生成文件。
2. 把“静态优先”误写成“没有构建流程”。
3. 把多数工具本地处理误写成全部工具不联网。
4. 用跨标签全局正则批量改写 1000+ HTML 页面。
5. 将本地测试通过当作线上部署、真实用户或设备验收证据。
