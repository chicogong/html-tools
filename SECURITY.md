# Security Policy

[English](#english) | [简体中文](#简体中文)

## English

### Supported versions

Security fixes are applied to the current production deployment and the latest release. Older release archives are not maintained after a newer version is published.

| Version                             | Supported |
| ----------------------------------- | --------- |
| Current production / latest release | Yes       |
| Earlier releases                    | No        |

### Report a vulnerability privately

Do not open a public issue for a suspected vulnerability or include secrets, personal data, access tokens, or an unpatched proof of concept in public discussions.

Use [GitHub private vulnerability reporting](https://github.com/chicogong/html-tools/security/advisories/new). Include, when possible:

- the affected tool URL, file, release, or commit;
- the security impact and who may be affected;
- minimal reproduction steps or a sanitized proof of concept;
- relevant browser, operating system, and standalone-export context;
- any known mitigation or suggested fix.

We aim to acknowledge a report within 7 calendar days and provide an initial assessment within 14 calendar days. These are response targets, not guarantees. Please allow time for a fix and coordinated disclosure before publishing details.

### Scope

Useful reports include:

- script injection or unsafe HTML execution caused by WebUtils code;
- unintended disclosure or transmission of input that is documented as local;
- unsafe external requests, permission handling, or standalone-export behavior;
- compromised dependencies, release archives, checksums, or repository automation;
- credentials or sensitive personal paths committed to the public repository.

Usually out of scope:

- behavior controlled entirely by an external API, CDN, browser, or extension;
- self-XSS that requires pasting and executing code with no boundary bypass;
- availability or rate limits of third-party services;
- unsupported browsers or theoretical issues without a practical security impact.

## 简体中文

### 支持范围

安全修复面向当前生产版本和最新 Release。新版本发布后，旧版发布归档不再继续维护。

| 版本                      | 是否支持 |
| ------------------------- | -------- |
| 当前生产版 / 最新 Release | 是       |
| 更早的 Release            | 否       |

### 私密报告漏洞

请勿为疑似漏洞创建公开 Issue，也不要在公开 Discussions 中提交密钥、个人数据、访问令牌或尚未修复的利用细节。

请使用 [GitHub 私密漏洞报告](https://github.com/chicogong/html-tools/security/advisories/new)，并尽量提供：

- 受影响的工具 URL、文件、Release 或 Commit；
- 安全影响与可能受影响的用户；
- 最小复现步骤或已脱敏的概念验证；
- 相关浏览器、操作系统与 standalone 导出环境；
- 已知缓解方案或修复建议。

我们的目标是在 7 个自然日内确认收到报告，并在 14 个自然日内给出初步评估。这是响应目标，不是时限保证。在修复和协调披露完成前，请暂缓公开细节。

### 适用范围

欢迎报告：WebUtils 代码导致的脚本注入、标称本地处理的输入被意外传输、不安全的外部请求或权限处理、standalone 导出边界问题、依赖/归档/校验和仓库自动化供应链问题，以及公开仓库中的凭据或敏感个人路径。

通常不在范围内：完全由外部 API、CDN、浏览器或扩展控制的行为；需要用户自行粘贴并执行代码且没有突破信任边界的 self-XSS；第三方服务的可用性或限流；不支持的浏览器；没有实际安全影响的理论问题。
