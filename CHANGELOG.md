# Changelog

所有重要的版本变更都会记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.0.0] - 2025-12-27

首个正式版本，包含 161 个纯前端工具。

### 新增

#### 开发工具 (dev)
- HTML/CSS/JavaScript/SQL/XML 格式化
- JSON 格式化、Diff、TypeScript 类型生成、Go Struct 转换
- 正则表达式测试器和速查表
- Base64/URL/Unicode/HTML 实体编解码
- JWT 解码器、Hash 生成器、HMAC 生成器
- 颜色转换器、配色方案生成器、对比度检查器
- CSS Border Radius/Box Shadow/动画生成器
- Flexbox 可视化编辑器
- Cron 生成器、Chmod 计算器
- cURL 转换器、HTTP 状态码参考
- ASCII 码表、ASCII 艺术生成
- Git 命令速查、.gitignore 生成器
- Emoji 选择器、Keycode 查看器
- MIME 类型查询、端口查询
- OTP 验证码生成器、RSA 密钥对生成器
- Protobuf 解码器、Hex 查看器
- Semver 比较器、Slug 生成器
- i18n Key 生成器、IP 地址转换器
- Punycode 转换器、字符集转换器
- HTML/README/License 模板生成器

#### 文本工具 (text)
- 文本 Diff、文本对比增强版
- 文本排序、去重、随机化
- 文本统计、字数统计
- 大小写转换、字符串转义
- 空白字符清理、盘古之白
- Markdown 预览、表格生成器
- HTML ⇄ Markdown 转换
- CSV ⇄ JSON 转换
- Lorem Ipsum 生成器
- 摩尔斯电码、罗马数字转换
- NATO 字母表、Slugify
- 文本加密/解密、文本模板填充器

#### 时间工具 (time)
- 时间戳转换
- 时区转换器、世界时钟
- 日期计算器、年龄计算器
- 倒计时器、秒表计时器
- 工时计算器
- Cron 表达式解析

#### 生成器 (generator)
- 二维码生成器、扫描器
- 条形码生成器
- 密码生成器、随机数生成器
- UUID/ULID/NanoID 生成器
- 假数据生成器、Mock 数据生成器
- 头像生成器、占位图生成器
- CSS 渐变生成器
- WiFi 二维码生成器
- Open Graph 预览器

#### 媒体工具 (media)
- 图片压缩、格式转换、裁剪
- 图片水印、压缩对比
- 图片转 ASCII 艺术
- Base64 图片转换
- EXIF 信息查看
- Favicon 生成器、ICO 查看器
- SVG 渲染器、SVG 占位图生成器
- 截图美化工具
- 摄像头拍照
- 文字转语音、音频可视化器

#### 隐私安全 (privacy)
- 密码强度检测
- 日志脱敏
- 随机密钥生成器
- 随机身份生成
- 文件哈希校验
- 信用卡验证器
- AES/RSA 加密解密

#### 安全工具 (security)
- URL 安全化（脱敏处理）

#### 网络工具 (network)
- IP 子网计算器、IP 地址工具
- MAC 地址查询、端口查询器
- HTTP 头解析器
- User Agent 解析器
- 设备信息

#### 计算器 (calculator)
- 百分比计算器
- 存储单位换算
- 进度计算器
- 宽高比计算器
- 位运算计算器
- 数学表达式计算器
- BMI 计算器
- 贷款计算器
- 进制计算器

#### 转换器 (converter)
- 单位转换器
- 文件大小计算器
- JSON ⇄ YAML 转换
- CSV ⇄ JSON 转换
- cURL to Code

#### 提取器 (extractor)
- 链接提取器
- 文本信息提取器
- 正则提取器

#### AI 工具 (ai)
- Prompt 模板库
- Token 计数器
- Claude Skills 精选
- MCP 配置指南
- MCP 客户端大全

### 特性
- 纯前端实现，数据不上传服务器
- 单文件设计，无需构建步骤
- 可离线使用，支持 PWA
- 响应式布局，适配移动端
- 深色/浅色主题切换
- 工具收藏功能
- 快捷键搜索（按 / 聚焦）

### 基础设施
- GitHub Actions CI/CD
- 自动化 Release 工作流
- Issue/PR 模板
- 贡献指南 (CONTRIBUTING.md)
- SEO 优化（sitemap、Open Graph、Schema.org）
- 多平台部署（Vercel、Cloudflare Pages）

---

[在线体验](https://tools.realtime-ai.chat) | [GitHub](https://github.com/chicogong/html-tools)
