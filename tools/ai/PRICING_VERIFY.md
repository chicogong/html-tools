# 核价表｜AI API 价格计算器

对照 Notion 壳：<https://app.notion.com/p/3ff0384c12ef8185bd7eccbeaa5dd333>

- 核价日期：2026-10-20（Asia/Singapore）
- 单位：除非另注，均为 **USD / 1M tokens**
- 缓存价列默认写 **cache read**；write 价写在备注
- 规则：缺官方价 → 待核＝是，价格格留空，**不编造**
- 页内旧值不可写入产品

## 核价表

| 厂商      | 模型                             | 输入价 | 输出价 | 缓存价（read） | 官方链接                                                | 核价日期   | 待核 | 页内旧值（仅对照） | 备注                                                                                                                                          |
| --------- | -------------------------------- | ------ | ------ | -------------- | ------------------------------------------------------- | ---------- | ---- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| OpenAI    | GPT-4o                           | 2.50   | 10     | 1.25           | https://platform.openai.com/docs/pricing                | 2026-10-20 | 否   | 旧 2.5 / 10        | 官方 Standard、短上下文。`openai.com/api/pricing` 是 ChatGPT 商务套餐，不是 API token 价表。                                                  |
| OpenAI    | GPT-4o Mini                      | 0.15   | 0.60   | 0.075          | https://platform.openai.com/docs/pricing                | 2026-10-20 | 否   | 旧 0.15 / 0.6      | Standard。                                                                                                                                    |
| OpenAI    | GPT-4 Turbo                      | 10     | 30     |                | https://platform.openai.com/docs/pricing                | 2026-10-20 | 否   | 旧 10 / 30         | 官方行名 `gpt-4-turbo-2024-04-09`。未列 cached input，缓存列留空。                                                                            |
| OpenAI    | o1                               | 15     | 60     | 7.50           | https://platform.openai.com/docs/pricing                | 2026-10-20 | 否   | 旧 15 / 60         | Standard。                                                                                                                                    |
| OpenAI    | o1-mini                          |        |        |                | https://platform.openai.com/docs/pricing                | 2026-10-20 | 是   | 旧 3 / 12          | 当日官方 Standard 价表无 `o1-mini` 行，不写数字。                                                                                             |
| OpenAI    | o3-mini                          | 1.10   | 4.40   | 0.55           | https://platform.openai.com/docs/pricing                | 2026-10-20 | 否   | 旧 1.1 / 4.4       | Standard。                                                                                                                                    |
| OpenAI    | GPT-6 Sol                        | 2.00   | 10     | 0.20           | https://platform.openai.com/docs/pricing                | 2026-10-20 | 否   | 旧 —               | 短上下文 ≤272K。长上下文为 4 / 15 / cache 0.40。cache write 2.50。                                                                            |
| OpenAI    | GPT-6 Luna                       | 0.10   | 0.50   | 0.01           | https://platform.openai.com/docs/pricing                | 2026-10-20 | 否   | 旧 —               | 短上下文 ≤272K。cache write 0.125。                                                                                                           |
| OpenAI    | GPT-6.1 Sol                      | 2.00   | 10     | 0.10           | https://platform.openai.com/docs/pricing                | 2026-10-20 | 否   | 旧 —               | 短上下文 ≤272K。cache write 2.50。                                                                                                            |
| OpenAI    | GPT-5.6 Sol                      | 4.00   | 20     | 0.40           | https://platform.openai.com/docs/pricing                | 2026-10-20 | 否   | 旧 —               | 短上下文 ≤272K。页内未默认勾选。促销说明写到至少 2026-11-21。                                                                                 |
| Anthropic | Claude Opus 4                    | 15     | 75     | 1.50           | https://docs.anthropic.com/en/docs/about-claude/pricing | 2026-10-20 | 否   | 旧 15 / 75         | 官方标 retired（Bedrock / Google Cloud 仍可能提供）。5m cache write 18.75。页内不列入当前对比。                                               |
| Anthropic | Claude Sonnet 4                  | 3      | 15     | 0.30           | https://docs.anthropic.com/en/docs/about-claude/pricing | 2026-10-20 | 否   | 旧 3 / 15          | 官方标 retired（Bedrock / Google Cloud 仍可能提供）。5m cache write 3.75。页内不列入当前对比。                                                |
| Anthropic | Claude 3.5 Sonnet                |        |        |                | https://docs.anthropic.com/en/docs/about-claude/pricing | 2026-10-20 | 是   | 旧 3 / 15          | 当日官方模型价表无此行（有 Haiku 3.5 retired，无 Sonnet 3.5），不写数字。                                                                     |
| Anthropic | Claude 3.5 Haiku                 | 0.80   | 4      | 0.08           | https://docs.anthropic.com/en/docs/about-claude/pricing | 2026-10-20 | 否   | 旧 0.8 / 4         | 官方行名 Claude Haiku 3.5，retired except on Google Cloud。5m cache write 1.00。页内不列入当前对比。                                          |
| Anthropic | Claude Haiku 5.5（prompt ≤100K） | 0.10   | 0.50   | 0.01           | https://www.anthropic.com/claude-haiku-5-5              | 2026-10-20 | 否   | 旧 —               | 与 docs 价表一致。5m cache write 0.125。算例 A 子模型用此档。                                                                                 |
| Anthropic | Claude Haiku 5.5（prompt >100K） | 0.50   | 2.50   | 0.05           | https://docs.anthropic.com/en/docs/about-claude/pricing | 2026-10-20 | 否   | 旧 —               | 页内单独列出，不与 ≤100K 档混用。                                                                                                             |
| Anthropic | Claude Sonnet 5.5                | 2.00   | 10     | 0.10           | https://www.anthropic.com/claude-haiku-5-5              | 2026-10-20 | 否   | 旧 —               | 2026-10-07 起 cache read 减半到 0.10（原 0.20）。5m cache write 2.50。算例 A 主模型。                                                         |
| Anthropic | Claude Opus 5.5                  | 4.00   | 20     | 0.20           | https://docs.anthropic.com/en/docs/about-claude/pricing | 2026-10-20 | 否   | 旧 —               | 5m cache write 5.00。页内可选。                                                                                                               |
| Google    | Gemini 2.5 Pro                   | 1.25   | 10     | 0.125          | https://ai.google.dev/gemini-api/docs/pricing           | 2026-10-20 | 否   | 旧 1.25 / 10       | Paid Standard，prompt ≤200K。>200K 为 2.50 / 15 / cache 0.25。另有按小时存储价，估算器未计入。                                                |
| Google    | Gemini 2.5 Flash                 | 0.30   | 2.50   | 0.03           | https://ai.google.dev/gemini-api/docs/pricing           | 2026-10-20 | 否   | 旧 0.15 / 0.6      | Paid Standard，text/image/video。旧页 0.15/0.6 与当日官方不符，已改。audio 输入 1.00 未采用。                                                 |
| Google    | Gemini 2.0 Flash                 |        |        |                | https://ai.google.dev/gemini-api/docs/pricing           | 2026-10-20 | 是   | 旧 0.1 / 0.4       | 当日官方 Gemini API 价表无 `gemini-2.0-flash` 行，不写数字。                                                                                  |
| Google    | Gemini 4 Argon                   | 2.00   | 10     | 0.10           | https://ai.google.dev/gemini-api/docs/pricing           | 2026-10-20 | 否   | 旧 —               | Paid Standard 促销价，至 2026-11-30；自 2026-12-01 官方写 4 / 20 / cache 0.20。算例 C 主模型用核价日促销价。implicit cache only。             |
| Google    | Gemini 3.8 Flash                 | 0.75   | 3.75   | 0.075          | https://ai.google.dev/gemini-api/docs/pricing           | 2026-10-20 | 否   | 旧 —               | Paid Standard 促销价，至 2026-12-31；自 2027-01-01 官方写 1.50 / 7.50 / cache 0.15。                                                          |
| Google    | Gemini 3.5 Flash-Lite            | 0.30   | 2.50   | 0.03           | https://ai.google.dev/gemini-api/docs/pricing           | 2026-10-20 | 否   | 旧 —               | Paid Standard，text/image/video/audio。算例 C 子模型。                                                                                        |
| DeepSeek  | DeepSeek V3                      |        |        |                | https://api-docs.deepseek.com/quick_start/pricing       | 2026-10-20 | 是   | 旧 0.27 / 1.1      | 当日官方价表只有 `deepseek-flash` 与 `deepseek-v4-pro`，不写 V3 数字。                                                                        |
| DeepSeek  | DeepSeek R1                      |        |        |                | https://api-docs.deepseek.com/quick_start/pricing       | 2026-10-20 | 是   | 旧 0.55 / 2.19     | 同上，不写数字。                                                                                                                              |
| DeepSeek  | DeepSeek Flash                   | 0.30   | 1.20   | 0.006          | https://api-docs.deepseek.com/quick_start/pricing       | 2026-10-20 | 否   | 旧 —               | **高峰价**（UTC 周一至五 01:00–04:00 与 06:00–10:00，不含中国公假）。cache miss＝输入，cache hit＝缓存读。非高峰为半价：0.15 / 0.60 / 0.003。 |
| DeepSeek  | DeepSeek V4 Pro                  | 1.32   | 3.96   | 0.044          | https://api-docs.deepseek.com/quick_start/pricing       | 2026-10-20 | 否   | 旧 —               | **高峰价**。非高峰半价：0.66 / 1.98 / 0.022。                                                                                                 |
| Meta      | Llama 3.3 70B                    |        |        |                |                                                         | 2026-10-20 | 是   | 旧 0.8 / 0.8       | 未登录、未付费。未找到 Meta 第一方官方 API 价单；第三方价不能冒充官方，不写数字。                                                             |
| Meta      | Llama 3.1 405B                   |        |        |                |                                                         | 2026-10-20 | 是   | 旧 3 / 3           | 同上。                                                                                                                                        |

## 大／小模型＋缓存｜算例

算法（页内与手算同一条，**不含**首次 cache write 溢价、Batch、Fast、区域 1.1x、Gemini 缓存存储小时费）：

```
单模型成本 =
  缓存前缀 × 命中率 × cacheRead / 1e6
  + 缓存前缀 × (1 − 命中率) × 输入价 / 1e6
  + 未缓存输入 × 输入价 / 1e6
  + 输出 × 输出价 / 1e6

一次任务 = 主 Agent 成本 + 子 Agent 单次成本 × 调用次数
```

| 算例名 | 主模型                                              | 子模型                                             | 是否开缓存 | 输入/输出 token 假设                                                                                                     | 手算结果                                                 | 页内结果  | 是否一致 | 备注                                                                                                                                                                       |
| ------ | --------------------------------------------------- | -------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- | --------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 算例 A | Claude Sonnet 5.5（2 / 10 / cache 0.10）            | Claude Haiku 5.5 ≤100K（0.10 / 0.50 / cache 0.01） | 是         | 主：缓存前缀 20,000、命中 90%、未缓存 3,000、输出 2,000。子：4 次；缓存前缀 8,000、命中 85%、未缓存 1,500、输出 800。    | 主 0.031800；子 0.000738×4＝0.002952；合计 **$0.034752** | $0.034752 | 是       | 手算：20k×0.9×0.10 + 20k×0.1×2 + 3k×2 + 2k×10 = 1800+4000+6000+20000 = 31800 / 1e6。子：8k×0.85×0.01 + 8k×0.15×0.10 + 1.5k×0.10 + 800×0.50 = 68+120+150+400 = 738 / 1e6。  |
| 算例 B | GPT-6 Sol（2 / 10 / cache 0.20）                    | GPT-6 Luna（0.10 / 0.50 / cache 0.01）             | 是         | 主：缓存前缀 40,000、命中 80%、未缓存 5,000、输出 4,000。子：6 次；缓存前缀 10,000、命中 90%、未缓存 2,000、输出 1,000。 | 主 0.072400；子 0.000890×6＝0.005340；合计 **$0.077740** | $0.077740 | 是       | 手算：40k×0.8×0.20 + 40k×0.2×2 + 5k×2 + 4k×10 = 6400+16000+10000+40000 = 72400 / 1e6。子：10k×0.9×0.01 + 10k×0.1×0.10 + 2k×0.10 + 1k×0.50 = 90+100+200+500 = 890 / 1e6。   |
| 算例 C | Gemini 4 Argon（2 / 10 / cache 0.10，核价日促销价） | Gemini 3.5 Flash-Lite（0.30 / 2.50 / cache 0.03）  | 是         | 主：缓存前缀 15,000、命中 70%、未缓存 2,000、输出 1,500。子：3 次；缓存前缀 5,000、命中 80%、未缓存 1,000、输出 600。    | 主 0.029050；子 0.002220×3＝0.006660；合计 **$0.035710** | $0.035710 | 是       | 手算：15k×0.7×0.10 + 15k×0.3×2 + 2k×2 + 1.5k×10 = 1050+9000+4000+15000 = 29050 / 1e6。子：5k×0.8×0.03 + 5k×0.2×0.30 + 1k×0.30 + 600×2.50 = 120+300+300+1500 = 2220 / 1e6。 |

## 官方价入口（核价日实际打开）

- OpenAI API token 价表：<https://platform.openai.com/docs/pricing>（打开成功）
- OpenAI `openai.com/api/pricing`：ChatGPT Business / Enterprise 套餐，**不是** API 按 token 价，未用来填数字
- Anthropic API 价表：<https://docs.anthropic.com/en/docs/about-claude/pricing>
- Anthropic 产品页 API 区：<https://www.anthropic.com/pricing>
- Claude Haiku 5.5 公告（含 Sonnet 5.5 cache read 减半）：<https://www.anthropic.com/claude-haiku-5-5>
- Gemini Developer API：<https://ai.google.dev/gemini-api/docs/pricing>
- DeepSeek：<https://api-docs.deepseek.com/quick_start/pricing>

未登录、未付费、未打开需账号的控制台。
