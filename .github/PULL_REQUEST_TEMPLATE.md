## 描述 / Description

请清晰且简洁地描述这个 PR 所做的修改。
如果是修复 Bug，请附带相关的 Issue 编号。

Fixes # (issue)

## 验证 / Validation

列出实际运行的命令、浏览器检查和未覆盖的风险。

## 检查清单 / Checklist

提交 PR 之前，请确保你已经核对以下项目：

- [ ] 我已运行 `npm run build && npm test && npm run lint && npm run format:check`。
- [ ] 我已检查 `git diff` / `git status --short`，差异只包含本 PR 预期改动。
- [ ] （如果是新工具）我已经将其录入到 `tools.json` 并运行了 `npm run sync:tools`。
- [ ] （如果是新工具）我已写明本地处理、浏览器权限、外部 API 和 CDN 依赖等数据边界。
- [ ] （如果改动交互）我已运行相关 `npm run test:e2e` 或说明手动浏览器验证。
- [ ] 我已经进行了自我代码审查。
