# 贡献指南

感谢你对 WebUtils 的关注！我们欢迎各种形式的贡献。

## 贡献方式

### 1. 报告 Bug
- 使用 [Bug 报告模板](https://github.com/chicogong/html-tools/issues/new?template=bug_report.yml) 提交问题
- 请提供详细的复现步骤

### 2. 提议新工具
- 使用 [新工具提议模板](https://github.com/chicogong/html-tools/issues/new?template=new_tool.yml)
- 确保工具可以纯前端实现，数据不需要上传到服务器

### 3. 提交代码

#### 开发环境设置

```bash
# 克隆仓库
git clone https://github.com/chicogong/html-tools.git
cd html-tools

# 安装依赖
npm install

# 运行 lint 检查
npm run lint

# 同步工具列表
npm run sync:tools
```

#### 添加新工具

1. 在 `tools.json` 中添加工具信息：

```json
{
  "id": "tool-id",
  "name": "工具名称",
  "description": "工具描述",
  "category": "dev",
  "path": "tools/dev/tool-id.html",
  "icon": "🔧"
}
```

2. 在对应目录创建 HTML 文件，参考现有工具的结构

3. 运行 `npm run sync:tools` 同步到首页

4. 运行 `npm run lint` 确保代码规范

#### 代码规范

- **单文件架构**：每个工具一个 HTML 文件，包含所有 CSS 和 JS
- **无外部依赖**：尽量不使用外部框架（必要时可用 CDN）
- **隐私优先**：所有数据在本地处理，不上传到服务器
- **响应式设计**：支持移动端访问
- **无障碍支持**：合理使用语义化标签和 ARIA 属性

#### 提交规范

使用约定式提交（Conventional Commits）：

```
feat: 添加新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
perf: 性能优化
test: 测试相关
chore: 构建/工具相关
```

示例：
```
feat(dev): 添加 JSON 格式化工具
fix(time): 修复时间戳转换时区问题
docs: 更新 README 工具列表
```

### 4. 改进文档

- 修正错误或过时的信息
- 添加使用示例
- 改进翻译

## 工具开发模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>工具名称 - WebUtils</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">
    <style>
        /* 工具样式 */
    </style>
</head>
<body>
    <main class="container">
        <a href="../../index.html">← 返回工具列表</a>
        <h1>工具名称</h1>
        <p>工具描述</p>
        
        <!-- 工具界面 -->
        
    </main>
    
    <script>
        // 工具逻辑
    </script>
</body>
</html>
```

## 分类说明

| 分类 | 目录 | 说明 |
|------|------|------|
| dev | tools/dev/ | 开发工具：JSON、正则、编码等 |
| text | tools/text/ | 文本工具：转换、统计、处理 |
| time | tools/time/ | 时间工具：时间戳、日期计算 |
| generator | tools/generator/ | 生成器：二维码、密码、UUID |
| media | tools/media/ | 媒体工具：图片、音视频处理 |
| calculator | tools/calculator/ | 计算器：各类计算工具 |
| converter | tools/converter/ | 转换器：格式转换 |
| extractor | tools/extractor/ | 提取器：数据提取 |
| ai | tools/ai/ | AI 工具：Prompt、MCP 相关 |
| network | tools/network/ | 网络工具：API、WebSocket |
| seo | tools/seo/ | SEO 工具：站长工具 |
| security | tools/security/ | 安全工具：加密、校验 |

## 问题反馈

- Issues: https://github.com/chicogong/html-tools/issues
- Discussions: https://github.com/chicogong/html-tools/discussions

## 许可证

贡献的代码将采用 [MIT 许可证](LICENSE)。
