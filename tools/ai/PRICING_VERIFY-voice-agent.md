# 核价表｜语音 Agent 成本对比

核价日期：**2026-10-20**（UTC）。缺官方数字的格子保持 **待核**，不编造。延迟均为厂商自报、未实测。

对照页：`tools/ai/voice-agent-cost.html`  
范围：Notion「范围说明｜C 语音 Agent 成本对比页」

## 单位与计算器假设（不是厂商报价）

- 月天数默认 **30**（可改）。
- 转写按 **用户说话分钟** = 每天通话分钟 × 用户占比。
- TTS 按 **助手说话分钟 × 每分钟字符**；默认 50% / 50% / **200 字符/分钟**（便于中文手算，非厂商语速）。
- 语音到语音若按连接时长计费，则按 **全部会话分钟**（可含静音）。
- **MAI 流式转写** 为限时价至 **2026-12-31**；计算器默认不选它，12 个月视图不把它 ×12。
- USD/CNY 留空则人民币行保持 CNY；填写时标明非官方汇率。

## 转写 STT

| 厂商                      | 模型                                       | 计费单位        | 公开价                         | 限时价？           | 自报延迟                              | 中文                              | 官方链接                                                           | 核价日     | 待核                                |
| ------------------------- | ------------------------------------------ | --------------- | ------------------------------ | ------------------ | ------------------------------------- | --------------------------------- | ------------------------------------------------------------------ | ---------- | ----------------------------------- |
| OpenAI                    | Whisper                                    | USD／分钟       | 0.006                          | 否                 | 待核                                  | 待核                              | https://platform.openai.com/docs/pricing                           | 2026-10-20 | 延迟、中文                          |
| OpenAI                    | gpt-4o-mini-transcribe                     | USD／分钟（估） | 0.003                          | 否                 | 待核                                  | 待核                              | https://platform.openai.com/docs/pricing                           | 2026-10-20 | 延迟、中文                          |
| OpenAI                    | gpt-4o-transcribe                          | USD／分钟（估） | 0.006                          | 否                 | 待核                                  | 待核                              | https://platform.openai.com/docs/pricing                           | 2026-10-20 | 延迟、中文                          |
| OpenAI                    | gpt-live-transcribe / gpt-realtime-whisper | USD／分钟       | 0.017                          | 否                 | 待核                                  | 待核                              | https://developers.openai.com/api/docs/pricing                     | 2026-10-20 | 延迟、中文                          |
| OpenAI                    | gpt-transcribe                             | USD／分钟       | 0.0045                         | 否                 | 待核                                  | 待核                              | https://developers.openai.com/api/docs/pricing                     | 2026-10-20 | 延迟、中文；非实时                  |
| Google Cloud              | Speech-to-Text V2 Standard                 | USD／分钟       | 0.016（0–50 万分钟档）         | 否                 | 待核                                  | 待核                              | https://cloud.google.com/speech-to-text/pricing                    | 2026-10-20 | 延迟、中文                          |
| ElevenLabs                | Scribe v2 Realtime                         | USD／音频小时   | 0.39                           | 否                 | ~150ms（厂商自报）                    | 90+ 语言                          | https://elevenlabs.io/pricing/api                                  | 2026-10-20 | 否（价与延迟已核）                  |
| Deepgram                  | Nova-3 Monolingual streaming PAYG          | USD／分钟       | 现价 0.0048（页上划掉 0.0077） | 是（截止日期待核） | 待核                                  | 该行 monolingual；系列写 45+ 语言 | https://deepgram.com/pricing                                       | 2026-10-20 | 促销结束日、延迟                    |
| 微软 MAI                  | MAI-Transcribe-2-Streaming                 | USD／音频小时   | 0.54                           | 是，至 2026 年底   | 首个 partial 略多于 100ms（厂商自报） | 公告写 60 种语言；是否含中文待核  | https://microsoft.ai/news/our-first-streaming-transcription-model/ | 2026-10-20 | 2027 起价格；中文是否在 60 种内     |
| 火山引擎                  | Doubao 流式语音识别                        | CNY／小时       | 4.5                            | 否（产品页按量价） | 待核                                  | 支持                              | https://www.volcengine.com/product/doubao                          | 2026-10-20 | 延迟；资源包价未登录核对            |
| Azure Speech 标准实时转写 | —                                          | USD／音频小时   | 待核                           | 待核               | 待核                                  | 待核                              | https://azure.microsoft.com/en-us/pricing/details/speech/          | 2026-10-20 | 是：公开页区域价为占位 `$-`，未登录 |

## TTS

| 厂商         | 模型                           | 计费单位             | 公开价                                                                                               | 限时价？           | 自报延迟               | 中文                | 官方链接                                                           | 核价日     | 待核                                              |
| ------------ | ------------------------------ | -------------------- | ---------------------------------------------------------------------------------------------------- | ------------------ | ---------------------- | ------------------- | ------------------------------------------------------------------ | ---------- | ------------------------------------------------- |
| OpenAI       | tts-1                          | USD／百万字符        | 15                                                                                                   | 否                 | 待核                   | 待核                | https://platform.openai.com/docs/pricing                           | 2026-10-20 | 延迟、中文                                        |
| OpenAI       | tts-1-hd                       | USD／百万字符        | 30                                                                                                   | 否                 | 待核                   | 待核                | https://platform.openai.com/docs/pricing                           | 2026-10-20 | 延迟、中文                                        |
| OpenAI       | gpt-4o-mini-tts                | USD／1M audio tokens | 12（Audio 输出）                                                                                     | 否                 | 待核                   | 待核                | https://platform.openai.com/docs/pricing                           | 2026-10-20 | 分钟换算；与 tts-1 字符价勿混算。**未写入计算器** |
| Google Cloud | WaveNet / Standard             | USD／百万字符        | 4（超出每月 400 万字符免费档后）                                                                     | 否                 | 待核                   | 待核                | https://cloud.google.com/text-to-speech/pricing                    | 2026-10-20 | 延迟、中文                                        |
| 微软 MAI     | MAI-Voice-2.1                  | USD／百万字符        | 22                                                                                                   | 否                 | 待核                   | 公告写可切 Mandarin | https://microsoft.ai/news/our-first-streaming-transcription-model/ | 2026-10-20 | 延迟数字                                          |
| 微软 MAI     | MAI-Voice-2.1-Flash            | USD／百万字符        | 15                                                                                                   | 否                 | 45s 音频端到端约 150ms | 与 2.1 相同语言覆盖 | https://microsoft.ai/news/our-first-streaming-transcription-model/ | 2026-10-20 | 否（价与延迟已核）                                |
| Google Cloud | Chirp 3: HD voices             | USD／百万字符        | 30（超出每月 100 万字符免费档后）                                                                    | 否                 | 待核                   | 待核                | https://cloud.google.com/text-to-speech/pricing                    | 2026-10-20 | 延迟、中文                                        |
| Google Cloud | Gemini 3.8 Flash TTS (Preview) | text/audio tokens    | 至 2026-12-31：输入 $0.50/1M text、输出 $9/1M audio；2027-01-01 起 $1 / $18。官方 25 audio tokens/秒 | 是，至 2026-12-31  | 待核                   | 待核                | https://cloud.google.com/text-to-speech/pricing                    | 2026-10-20 | 分钟换算的输入 token；延迟。**未写入计算器默认**  |
| ElevenLabs   | Flash / Turbo                  | USD／千字符          | 0.04                                                                                                 | 否                 | ~75ms                  | 32 languages        | https://elevenlabs.io/pricing/api                                  | 2026-10-20 | 否                                                |
| ElevenLabs   | v4 Turbo                       | USD／千字符          | 0.04                                                                                                 | 否                 | ~100ms                 | 90+ languages       | https://elevenlabs.io/pricing/api                                  | 2026-10-20 | 否                                                |
| Deepgram     | Aura-2 PAYG                    | USD／千字符          | 0.03                                                                                                 | 否                 | 待核                   | 待核                | https://deepgram.com/pricing                                       | 2026-10-20 | 延迟、中文                                        |
| 火山引擎     | Doubao 语音合成                | CNY／万字符          | 5                                                                                                    | 否（产品页按量价） | 待核                   | 支持                | https://www.volcengine.com/product/doubao                          | 2026-10-20 | 延迟                                              |

## 语音到语音 / 会话

| 厂商       | 模型                          | 计费单位            | 公开价                      | 限时价？ | 自报延迟 | 中文          | 官方链接                                                                                                                                                   | 核价日     | 待核                                                                                             |
| ---------- | ----------------------------- | ------------------- | --------------------------- | -------- | -------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------ |
| OpenAI     | gpt-live-1                    | USD／分钟           | 0.05                        | 否       | 待核     | 待核          | https://developers.openai.com/api/docs/pricing                                                                                                             | 2026-10-20 | 延迟、中文；后端 LLM 另计                                                                        |
| OpenAI     | gpt-realtime-2.1              | USD／百万音频 token | 入 32 / 出 64               | 否       | 待核     | 待核          | https://developers.openai.com/api/docs/pricing ；换算 https://developers.openai.com/api/docs/guides/voice-latency-cost                                     | 2026-10-20 | 上下文累加与文本 token；延迟。计算器只估当轮音频下限（官方 1 token/100ms 入、1 token/50ms 出）   |
| ElevenLabs | Speech Engine 套餐外分钟      | USD／分钟           | 0.08（突发 0.16）           | 否       | 待核     | 90+ languages | https://elevenlabs.io/pricing/api                                                                                                                          | 2026-10-20 | LLM 另计                                                                                         |
| Deepgram   | Voice Agent API Standard PAYG | USD／分钟           | 0.075（websocket 连接时长） | 否       | 待核     | 待核          | https://deepgram.com/pricing                                                                                                                               | 2026-10-20 | 延迟、中文。此为管道价，不是单一 S2S 模型                                                        |
| AWS        | Nova 2.5 Sonic                |                     |                             |          |          |               | https://aws.amazon.com/about-aws/whats-new/2026/10/amazon-nova-2.5-sonic/ ；https://aws.amazon.com/nova/pricing/ ；https://aws.amazon.com/bedrock/pricing/ | 2026-10-20 | **是**。What's New 仅写 same pricing as Nova 2 Sonic；价页未见可抄美元表。价／延迟／中文留空不编 |

## 手算对照（与页内算例按钮同一输入）

公共假设：每天 **60** 分钟、每月 **30** 天、用户/助手各 **50%**、助手 **200 字符/分钟**。起算日 **2026-10-20**。

### 算例 A · 转写 + TTS（OpenAI Whisper + tts-1）

- 转写：Whisper $0.006/分钟
- TTS：`tts-1` $15/百万字符
- 转写分钟：60 × 0.5 × 30 = **900**
- 转写成本：900 × 0.006 = **$5.40**
- TTS 字符：60 × 0.5 × 30 × 200 = **180,000**
- TTS 成本：180,000 / 1,000,000 × 15 = **$2.70**
- **页内合计 $8.10**

### 算例 B · 语音到语音（GPT-Live）

- `gpt-live-1` $0.05/分钟（会话时长，含静音；后端 LLM 未计）
- 会话分钟：60 × 30 = **1,800**
- **页内合计 $90.00**

### 算例 C · MAI 限时转写 + Flash TTS（只报月，不年化）

- 转写：MAI-Transcribe-2-Streaming $0.54/音频小时
- TTS：MAI-Voice-2.1-Flash $15/百万字符
- 转写成本：(60 × 0.5 × 30 / 60) × 0.54 = **$8.10**
- TTS 成本：180,000 / 1,000,000 × 15 = **$2.70**
- **页内月合计 $10.80**
- **不得**写成 $10.80 × 12 = $129.60/年
- 限时窗口 2026-10-20 至 2026-12-31 含首尾：12 + 30 + 31 = **73** 天；2027 起转写价 **待核**

页加载时会对 A/B/C 做自检；差超过 $0.001 会在「手算对照算例」下报警。
