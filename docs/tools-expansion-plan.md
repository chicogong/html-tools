# WebUtils 工具扩展计划 (700 → 1000)

## 概述

- **当前工具数**: 700
- **目标工具数**: 1000
- **新增工具数**: 300
- **新增类别数**: 15

---

## 新增类别定义

| ID | 名称 | 图标 | 工具数量 |
|---|---|---|---|
| travel | 旅行工具 | ✈️ | 20 |
| sports | 运动健身 | 🏃 | 20 |
| pets | 宠物工具 | 🐾 | 15 |
| music | 音乐工具 | 🎵 | 15 |
| office | 办公工具 | 💼 | 20 |
| social | 社交工具 | 👥 | 15 |
| parenting | 育儿工具 | 👶 | 15 |
| photography | 摄影工具 | 📷 | 15 |
| diy | DIY工具 | 🔨 | 15 |
| legal | 法律工具 | ⚖️ | 15 |
| weather | 天气工具 | 🌤️ | 10 |
| shopping | 购物工具 | 🛒 | 15 |
| productivity | 效率工具 | ⚡ | 20 |
| language | 语言学习 | 🗣️ | 15 |
| art | 艺术工具 | 🎨 | 15 |

**扩展现有类别** (约65个):
- dev: +10
- game: +10
- health: +10
- education: +10
- calculator: +10
- fun: +5
- text: +5
- media: +5

---

## 详细工具列表

### 一、实用计算器/转换器 (约80个)

#### 1. 旅行相关计算 (travel)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 1 | 行李清单生成器 | packing-list.html | 根据目的地和天数智能生成行李清单 | 行李 清单 旅行 packing |
| 2 | 时差计算器 | jet-lag-calc.html | 计算两地时差和调整建议 | 时差 jet lag 飞行 |
| 3 | 里程积分计算器 | miles-calc.html | 计算飞行里程和积分价值 | 里程 积分 航空 miles |
| 4 | 旅行预算计算器 | travel-budget.html | 规划旅行各项支出预算 | 旅行 预算 travel budget |
| 5 | 行李重量计算器 | luggage-weight.html | 计算行李总重量避免超重 | 行李 重量 luggage weight |
| 6 | 航班延误赔偿计算 | delay-compensation.html | 计算航班延误应得赔偿 | 延误 赔偿 delay |
| 7 | 电压转换指南 | voltage-guide.html | 各国电压插头类型参考 | 电压 插头 voltage adapter |
| 8 | 旅行费用分摊 | trip-split.html | 多人旅行费用AA分摊 | 分摊 费用 AA trip |

#### 2. 运动健身计算 (sports)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 9 | 跑步配速计算器 | running-pace.html | 计算跑步配速和完赛时间 | 跑步 配速 马拉松 running |
| 10 | 热量消耗计算器 | calories-burned.html | 计算各运动消耗热量 | 热量 消耗 calories burned |
| 11 | 心率区间计算器 | heart-rate-zones.html | 计算训练心率区间 | 心率 区间 heart rate |
| 12 | 蛋白质摄入计算器 | protein-calc.html | 计算每日蛋白质需求 | 蛋白质 摄入 protein |
| 13 | 游泳距离计算器 | swim-distance.html | 计算游泳圈数和距离 | 游泳 距离 swimming |
| 14 | 骑行数据计算器 | cycling-calc.html | 计算骑行距离和消耗 | 骑行 自行车 cycling |
| 15 | 步数距离换算 | steps-distance.html | 步数与距离互相换算 | 步数 距离 steps |
| 16 | 运动补水计算器 | hydration-calc.html | 计算运动时补水量 | 补水 运动 hydration |
| 17 | 马拉松配速表 | marathon-pace.html | 各档配速完赛时间对照表 | 马拉松 配速 marathon |

#### 3. 摄影计算 (photography)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 18 | 曝光计算器 | exposure-calc.html | 计算正确曝光参数组合 | 曝光 计算 exposure |
| 19 | 景深计算器 | dof-calc.html | 计算镜头景深范围 | 景深 DOF depth |
| 20 | 黄金时段计算 | golden-hour.html | 计算日出日落黄金时段 | 黄金时段 golden hour |
| 21 | 照片尺寸计算 | print-size.html | 计算照片打印尺寸和DPI | 照片 尺寸 打印 print |
| 22 | 存储容量估算 | storage-estimate.html | 估算照片存储需求 | 存储 容量 storage |
| 23 | 闪光灯指数计算 | flash-guide.html | 计算闪光灯有效距离 | 闪光灯 指数 flash |
| 24 | 星空摄影计算器 | astro-calc.html | 星空摄影参数计算(500法则) | 星空 摄影 astro |

#### 4. DIY计算 (diy)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 25 | 油漆用量计算器 | paint-calc.html | 计算墙面油漆用量 | 油漆 用量 paint |
| 26 | 木材切割计算 | lumber-calc.html | 计算木材最优切割方案 | 木材 切割 lumber |
| 27 | 瓷砖用量计算器 | tile-calc.html | 计算瓷砖铺设用量 | 瓷砖 用量 tile |
| 28 | 电线规格计算 | wire-gauge.html | 计算所需电线规格 | 电线 规格 wire gauge |
| 29 | 混凝土配比计算 | concrete-mix.html | 混凝土配比计算 | 混凝土 配比 concrete |
| 30 | 楼梯尺寸计算器 | stair-calc.html | 计算楼梯踏步尺寸 | 楼梯 尺寸 stair |
| 31 | 壁纸用量计算器 | wallpaper-calc.html | 计算壁纸铺贴用量 | 壁纸 用量 wallpaper |

#### 5. 购物计算 (shopping)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 32 | 单价比较器 | unit-price.html | 比较不同规格商品单价 | 单价 比较 unit price |
| 33 | 满减最优计算 | threshold-calc.html | 计算满减最优凑单方案 | 满减 最优 threshold |
| 34 | 关税计算器 | customs-duty.html | 计算跨境购物关税 | 关税 计算 customs |
| 35 | 分期付款计算 | installment-calc.html | 计算分期付款总费用 | 分期 付款 installment |
| 36 | 尺码对照表 | size-chart.html | 国际服装尺码对照 | 尺码 对照 size chart |
| 37 | 鞋码换算器 | shoe-size.html | 国际鞋码换算 | 鞋码 换算 shoe size |
| 38 | 戒指尺寸测量 | ring-size.html | 测量和换算戒指尺寸 | 戒指 尺寸 ring size |

#### 6. 法律计算 (legal)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 39 | 诉讼费计算器 | lawsuit-fee.html | 计算法院诉讼费用 | 诉讼费 计算 lawsuit |
| 40 | 劳动仲裁时效 | labor-arbitration.html | 劳动仲裁时效计算 | 劳动 仲裁 时效 |
| 41 | 工伤赔偿计算 | work-injury.html | 工伤赔偿金额计算 | 工伤 赔偿 work injury |
| 42 | 交通事故赔偿 | traffic-accident.html | 交通事故赔偿计算 | 交通事故 赔偿 |
| 43 | 遗产继承计算 | inheritance-calc.html | 遗产继承份额计算 | 遗产 继承 inheritance |
| 44 | 违约金计算器 | penalty-calc.html | 合同违约金计算 | 违约金 计算 penalty |

#### 7. 宠物计算 (pets)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 45 | 宠物年龄换算 | pet-age.html | 宠物与人类年龄换算 | 宠物 年龄 pet age |
| 46 | 宠物喂食计算器 | pet-feeding.html | 计算宠物每日喂食量 | 喂食 宠物 feeding |
| 47 | 宠物药物剂量 | pet-medicine.html | 计算宠物药物剂量 | 药物 剂量 pet medicine |
| 48 | 宠物BMI计算器 | pet-bmi.html | 判断宠物是否肥胖 | BMI 宠物 pet |

#### 8. 育儿计算 (parenting)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 49 | 宝宝身高预测 | height-predictor.html | 预测孩子成年身高 | 身高 预测 height |
| 50 | 奶粉冲调计算 | formula-calc.html | 计算奶粉冲调比例 | 奶粉 冲调 formula |
| 51 | 儿童药物剂量 | child-medicine.html | 计算儿童药物剂量 | 药物 剂量 儿童 |
| 52 | 儿童BMI计算 | child-bmi.html | 儿童BMI计算和评估 | BMI 儿童 child |
| 53 | 入学年龄计算 | school-age.html | 计算入学年龄 | 入学 年龄 school |
| 54 | 教育储蓄计算 | education-savings.html | 计算教育储蓄目标 | 教育 储蓄 savings |

#### 9. 音乐计算 (music)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 55 | 音符频率计算 | note-frequency.html | 计算音符对应的频率 | 音符 频率 note |
| 56 | 音程计算器 | interval-calc.html | 计算两个音的音程 | 音程 计算 interval |
| 57 | 移调工具 | transpose.html | 歌曲移调计算 | 移调 转调 transpose |

#### 10. 天气计算 (weather)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 58 | 体感温度计算 | feels-like-temp.html | 计算体感温度 | 体感 温度 feels like |
| 59 | 风寒指数计算 | wind-chill.html | 计算风寒效应 | 风寒 指数 wind chill |
| 60 | 露点温度计算 | dew-point.html | 计算露点温度 | 露点 温度 dew point |

#### 11. 现有类别扩展-计算器 (calculator)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 61 | 复合年增长率 | cagr-calc.html | 计算CAGR复合年增长率 | CAGR 复合 增长率 |
| 62 | 概率组合计算 | probability-calc.html | 计算概率和组合 | 概率 组合 probability |
| 63 | 对数计算器 | logarithm-calc.html | 各种底数对数计算 | 对数 计算 logarithm |
| 64 | 向量计算器 | vector-calc.html | 向量运算和可视化 | 向量 计算 vector |
| 65 | 复数计算器 | complex-calc.html | 复数运算计算器 | 复数 计算 complex |
| 66 | 分数计算器 | fraction-calc.html | 分数加减乘除计算 | 分数 计算 fraction |
| 67 | 最大公约数计算 | gcd-lcm-calc.html | 求最大公约数和最小公倍数 | 公约数 公倍数 GCD LCM |
| 68 | 质因数分解 | prime-factorization.html | 质因数分解计算 | 质因数 分解 prime |
| 69 | 工龄计算器 | seniority-calc.html | 计算工作年限 | 工龄 计算 seniority |
| 70 | 年化收益率计算 | annualized-return.html | 计算投资年化收益率 | 年化 收益率 return |

---

### 二、工作效率工具 (约80个)

#### 12. 办公工具 (office)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 71 | 会议时间协调 | meeting-scheduler.html | 协调多人会议时间 | 会议 时间 协调 meeting |
| 72 | 工作日计算器 | workday-calc.html | 计算两日期间工作日 | 工作日 计算 workday |
| 73 | 请假天数计算 | leave-calc.html | 计算请假天数和扣款 | 请假 天数 leave |
| 74 | 加班费计算器 | overtime-calc.html | 计算加班工资 | 加班 费用 overtime |
| 75 | 出差报销单 | expense-report.html | 生成出差报销单 | 出差 报销 expense |
| 76 | 打卡时间记录 | clock-in-log.html | 记录每日打卡时间 | 打卡 时间 clock in |
| 77 | 项目进度追踪 | project-tracker.html | 追踪项目完成进度 | 项目 进度 project |
| 78 | 任务优先级排序 | task-priority.html | 任务优先级矩阵 | 任务 优先级 task |
| 79 | 工作周报模板 | weekly-report.html | 生成工作周报 | 周报 模板 weekly |
| 80 | OKR追踪器 | okr-tracker.html | 追踪OKR完成情况 | OKR 目标 追踪 |
| 81 | 工时统计工具 | work-hours.html | 统计项目工时 | 工时 统计 work hours |
| 82 | 绩效评分计算 | performance-score.html | 计算绩效考核分数 | 绩效 评分 performance |
| 83 | 团队排班表 | shift-schedule.html | 生成团队排班表 | 排班 团队 shift |
| 84 | 面试评估表 | interview-eval.html | 面试评估记录表 | 面试 评估 interview |
| 85 | 入职清单 | onboarding-list.html | 新员工入职清单 | 入职 清单 onboarding |
| 86 | 离职交接清单 | offboarding-list.html | 离职交接事项清单 | 离职 交接 offboarding |
| 87 | 公文模板生成 | document-template.html | 生成常用公文模板 | 公文 模板 document |
| 88 | 会议纪要模板 | meeting-notes.html | 生成会议纪要模板 | 会议 纪要 meeting notes |
| 89 | 通讯录生成器 | contact-list.html | 生成团队通讯录 | 通讯录 联系人 contact |
| 90 | 薪资结构计算 | salary-structure.html | 分析薪资结构组成 | 薪资 结构 salary |

#### 13. 效率工具 (productivity)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 91 | 番茄工作法Plus | pomodoro-plus.html | 增强版番茄工作法计时器 | 番茄 工作法 pomodoro |
| 92 | 时间块规划 | time-blocking.html | 时间块工作法规划 | 时间块 规划 time |
| 93 | GTD清单管理 | gtd-list.html | GTD任务管理系统 | GTD 清单 管理 |
| 94 | 艾森豪威尔矩阵 | eisenhower-matrix.html | 紧急重要四象限 | 艾森豪威尔 矩阵 |
| 95 | 每日回顾模板 | daily-review.html | 每日回顾反思模板 | 回顾 每日 daily |
| 96 | 周回顾模板 | weekly-review-productivity.html | 每周回顾反思模板 | 周回顾 weekly |
| 97 | 目标追踪器 | goal-tracker.html | 追踪长期目标进度 | 目标 追踪 goal |
| 98 | 专注模式计时 | focus-timer.html | 深度工作计时器 | 专注 计时 focus |
| 99 | 会议成本计算 | meeting-cost.html | 计算会议时间成本 | 会议 成本 meeting |
| 100 | 阅读进度追踪 | reading-progress.html | 追踪书籍阅读进度 | 阅读 进度 reading |
| 101 | 习惯打卡器 | habit-streak.html | 记录习惯连续天数 | 习惯 打卡 habit |
| 102 | 精力管理日志 | energy-log.html | 记录精力高峰低谷 | 精力 管理 energy |
| 103 | 决策日志 | decision-log.html | 记录重要决策过程 | 决策 日志 decision |
| 104 | 复盘模板 | retrospective.html | 项目复盘分析模板 | 复盘 模板 retrospective |
| 105 | 任务分解器 | task-breakdown.html | 大任务分解工具 | 任务 分解 task |
| 106 | 干扰记录器 | distraction-log.html | 记录工作干扰因素 | 干扰 记录 distraction |
| 107 | 能量恢复计时 | break-timer.html | 合理安排休息时间 | 休息 计时 break |
| 108 | 时间审计工具 | time-audit.html | 分析时间使用情况 | 时间 审计 time audit |
| 109 | 批处理模板 | batch-processing.html | 任务批处理规划 | 批处理 模板 batch |
| 110 | 最小可行任务 | mvt-planner.html | 规划最小可行任务 | 最小 可行 MVT |

#### 14. 开发工具扩展 (dev)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 111 | GraphQL Schema生成 | graphql-schema-gen.html | 生成GraphQL Schema定义 | GraphQL Schema |
| 112 | Prisma Schema生成 | prisma-schema-gen.html | 生成Prisma数据模型 | Prisma Schema |
| 113 | TypeScript接口生成 | ts-interface-gen.html | 从JSON生成TS接口 | TypeScript 接口 |
| 114 | SQL建表语句生成 | sql-create-table.html | 生成SQL建表语句 | SQL 建表 CREATE TABLE |
| 115 | API文档生成器 | api-docs-gen.html | 生成API文档模板 | API 文档 |
| 116 | 正则表达式库 | regex-library.html | 常用正则表达式库 | 正则 库 regex |
| 117 | Shell命令生成器 | shell-cmd-gen.html | 生成常用Shell命令 | Shell 命令 |
| 118 | Docker命令生成 | docker-cmd-gen.html | 生成Docker常用命令 | Docker 命令 |
| 119 | K8s YAML生成器 | k8s-yaml-gen.html | 生成K8s配置YAML | K8s Kubernetes YAML |
| 120 | Terraform模板生成 | terraform-gen.html | 生成Terraform配置 | Terraform 模板 |

---

### 三、生活服务工具 (约80个)

#### 15. 健康扩展 (health)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 121 | 用药提醒设置 | medication-reminder.html | 设置用药提醒时间 | 用药 提醒 medication |
| 122 | 视力测试表 | vision-test-chart.html | 在线视力检测表 | 视力 测试 vision |
| 123 | 听力年龄测试 | hearing-age-test.html | 测试听力年龄 | 听力 年龄 hearing |
| 124 | 体检指标解读 | checkup-guide.html | 体检报告指标解读 | 体检 指标 checkup |
| 125 | 生理周期追踪 | menstrual-tracker.html | 女性生理周期追踪 | 生理 周期 menstrual |
| 126 | 疲劳度评估 | fatigue-assessment.html | 评估疲劳程度 | 疲劳 评估 fatigue |
| 127 | 饮食日记 | diet-diary.html | 记录每日饮食 | 饮食 日记 diet |
| 128 | 过敏原记录 | allergy-log.html | 记录过敏原信息 | 过敏 记录 allergy |
| 129 | 血糖记录追踪 | blood-sugar-log.html | 追踪血糖变化 | 血糖 记录 blood sugar |
| 130 | 心理健康测评 | mental-health-test.html | 心理健康自测问卷 | 心理 健康 mental |

#### 16. 宠物工具 (pets)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 131 | 宠物体重追踪 | pet-weight.html | 追踪宠物体重变化 | 体重 宠物 pet weight |
| 132 | 疫苗接种提醒 | vaccine-reminder.html | 宠物疫苗接种时间表 | 疫苗 接种 vaccine |
| 133 | 遛狗距离记录 | dog-walk-log.html | 记录每日遛狗距离 | 遛狗 距离 dog walk |
| 134 | 宠物食物禁忌 | pet-food-toxins.html | 宠物不能吃的食物列表 | 食物 禁忌 toxic |
| 135 | 宠物开销记录 | pet-expenses.html | 记录宠物相关开销 | 开销 费用 pet expenses |
| 136 | 宠物寄养清单 | pet-boarding.html | 宠物寄养准备清单 | 寄养 清单 boarding |
| 137 | 猫咪体重图表 | cat-weight-chart.html | 猫咪健康体重参考 | 猫咪 体重 cat weight |
| 138 | 狗狗品种查询 | dog-breeds.html | 狗狗品种信息查询 | 品种 狗狗 dog breeds |
| 139 | 宠物生日提醒 | pet-birthday.html | 设置宠物生日提醒 | 生日 提醒 pet birthday |
| 140 | 宠物急救指南 | pet-first-aid.html | 宠物急救常识参考 | 急救 指南 first aid |
| 141 | 宠物驱虫日历 | deworming-calendar.html | 驱虫时间规划日历 | 驱虫 日历 deworming |

#### 17. 育儿工具 (parenting)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 142 | 喂奶记录器 | feeding-log.html | 记录喂奶时间和量 | 喂奶 记录 feeding |
| 143 | 睡眠记录器 | sleep-log.html | 记录宝宝睡眠情况 | 睡眠 记录 sleep |
| 144 | 生长曲线图 | growth-chart.html | 绘制宝宝生长曲线 | 生长 曲线 growth |
| 145 | 疫苗接种日历 | vaccination-calendar.html | 儿童疫苗接种时间表 | 疫苗 接种 vaccination |
| 146 | 辅食添加指南 | solid-food-guide.html | 辅食添加时间和顺序 | 辅食 添加 solid food |
| 147 | 换尿布记录 | diaper-log.html | 记录换尿布次数 | 尿布 记录 diaper |
| 148 | 孕期计算器 | pregnancy-calc.html | 计算孕周和预产期 | 孕期 计算 pregnancy |
| 149 | 亲子活动推荐 | activity-ideas.html | 亲子活动创意推荐 | 活动 亲子 activity |

#### 18. 旅行工具 (travel) - 非计算类
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 150 | 签证信息查询 | visa-info.html | 查询各国签证要求 | 签证 护照 visa |
| 151 | 行程规划器 | itinerary-planner.html | 规划每日行程安排 | 行程 规划 itinerary |
| 152 | 旅行清单模板 | travel-checklist.html | 出行前准备事项清单 | 清单 模板 checklist |
| 153 | 语言翻译卡片 | travel-phrases.html | 常用旅行短语翻译 | 翻译 短语 phrases |
| 154 | 紧急联系卡生成 | emergency-card.html | 生成紧急联系信息卡 | 紧急 联系 emergency |
| 155 | 旅行日记模板 | travel-journal.html | 记录旅行见闻的模板 | 日记 旅行 journal |

#### 19. 购物工具 (shopping) - 非计算类
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 156 | 购物清单管理 | shopping-list.html | 管理购物清单 | 购物 清单 shopping list |
| 157 | 购物预算管理 | shopping-budget.html | 购物预算管理 | 预算 购物 budget |
| 158 | 优惠券计算器 | coupon-calc.html | 计算优惠后价格 | 优惠券 计算 coupon |
| 159 | 信用卡返现计算 | cashback-calc.html | 计算信用卡返现 | 返现 信用卡 cashback |

#### 20. 社交工具 (social)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 160 | 个人简介生成 | bio-generator.html | 生成社交媒体简介 | 简介 个人 bio |
| 161 | 话题标签生成 | hashtag-generator.html | 生成热门话题标签 | 话题 标签 hashtag |
| 162 | 表情符号搜索 | emoji-search.html | 搜索和复制表情符号 | 表情 符号 emoji |
| 163 | 社交帖子模板 | post-templates.html | 社交媒体帖子模板 | 帖子 模板 post |
| 164 | 粉丝增长计算 | follower-growth.html | 计算粉丝增长率 | 粉丝 增长 follower |
| 165 | 发帖时间建议 | best-post-time.html | 最佳发帖时间建议 | 发帖 时间 posting |
| 166 | 互动率计算器 | engagement-rate.html | 计算社交互动率 | 互动 率 engagement |
| 167 | 用户名检查器 | username-checker.html | 检查用户名可用性 | 用户名 检查 username |
| 168 | 社交卡片生成 | social-card.html | 生成分享卡片图 | 卡片 社交 social card |
| 169 | 直播倒计时 | livestream-countdown.html | 直播开始倒计时 | 直播 倒计时 livestream |
| 170 | 抽奖器 | giveaway-picker.html | 社交媒体抽奖工具 | 抽奖 随机 giveaway |
| 171 | 评论模板生成 | comment-templates.html | 常用评论回复模板 | 评论 模板 comment |
| 172 | 链接缩短器 | link-shortener.html | 缩短长链接 | 链接 缩短 link shortener |
| 173 | 艾特生成器 | mention-generator.html | 批量生成艾特文本 | 艾特 at mention |
| 174 | 社交头像生成 | avatar-generator.html | 生成个性化社交头像 | 头像 社交 avatar |

#### 21. 天气工具 (weather) - 非计算类
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 175 | 紫外线指数解读 | uv-index.html | 紫外线强度和防护建议 | 紫外线 指数 UV |
| 176 | 空气质量参考 | air-quality.html | 空气质量指数解读 | 空气 质量 AQI |
| 177 | 穿衣建议 | clothing-advice.html | 根据天气穿衣建议 | 穿衣 建议 clothing |
| 178 | 洗车指数 | car-wash-index.html | 是否适合洗车 | 洗车 指数 car wash |
| 179 | 降水概率解读 | rain-probability.html | 降水概率含义解读 | 降水 概率 rain |
| 180 | 气压单位转换 | pressure-converter-weather.html | 气压单位互转 | 气压 单位 pressure |

---

### 四、专业领域工具 (约60个)

#### 22. 音乐工具 (music)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 181 | BPM节拍器 | metronome.html | 可视化音乐节拍器 | 节拍器 BPM metronome |
| 182 | 吉他调音器 | guitar-tuner.html | 在线吉他调音工具 | 吉他 调音 tuner |
| 183 | 和弦查询器 | chord-finder.html | 查询各种和弦指法 | 和弦 吉他 钢琴 chord |
| 184 | 音阶参考表 | scale-reference.html | 各种音阶参考 | 音阶 参考 scale |
| 185 | 歌词同步编辑器 | lyric-sync.html | 制作LRC歌词文件 | 歌词 同步 LRC |
| 186 | 音乐节奏训练 | rhythm-trainer.html | 节奏感训练工具 | 节奏 训练 rhythm |
| 187 | 乐谱转换器 | sheet-converter.html | 五线谱与简谱互转 | 乐谱 转换 简谱 |
| 188 | 调式查询器 | key-finder.html | 查询歌曲调式 | 调式 调号 key |
| 189 | 练琴计时器 | practice-timer.html | 乐器练习计时器 | 练琴 计时 practice |
| 190 | 音高检测器 | pitch-detector.html | 检测声音音高 | 音高 检测 pitch |
| 191 | 速度标记参考 | tempo-markings.html | 音乐速度术语参考 | 速度 标记 tempo |
| 192 | 节拍划分器 | beat-divider.html | 复杂节拍划分工具 | 节拍 划分 beat |

#### 23. 摄影工具 (photography) - 非计算类
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 193 | 快门速度换算 | shutter-speed.html | 快门速度档位换算 | 快门 速度 shutter |
| 194 | ISO噪点参考 | iso-noise.html | 各ISO噪点参考 | ISO 噪点 noise |
| 195 | 镜头焦段参考 | focal-length.html | 各焦段拍摄效果 | 焦段 镜头 focal |
| 196 | 构图参考线 | composition-grid.html | 构图参考线叠加 | 构图 参考 composition |
| 197 | 滤镜效果模拟 | filter-simulator.html | 模拟物理滤镜效果 | 滤镜 效果 filter |
| 198 | 白平衡参考 | white-balance.html | 各场景白平衡参考 | 白平衡 参考 white balance |
| 199 | 镜头对比器 | lens-compare.html | 对比不同镜头参数 | 镜头 对比 lens |

#### 24. DIY工具 (diy) - 非计算类
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 200 | 螺丝规格参考 | screw-guide.html | 螺丝规格型号参考 | 螺丝 规格 screw |
| 201 | 水管尺寸参考 | pipe-size.html | 水管尺寸规格参考 | 水管 尺寸 pipe |
| 202 | 钻头尺寸参考 | drill-bit-guide.html | 钻头尺寸规格参考 | 钻头 尺寸 drill |
| 203 | 砂纸目数参考 | sandpaper-guide.html | 砂纸目数用途参考 | 砂纸 目数 sandpaper |
| 204 | 胶水选择指南 | glue-guide.html | 各种胶水用途指南 | 胶水 选择 glue |
| 205 | 颜色调配器 | color-mixer-diy.html | DIY颜色调配计算 | 颜色 调配 color |
| 206 | 测量单位转换 | measure-converter.html | DIY常用单位转换 | 测量 单位 measure |
| 207 | 工具清单生成 | tool-checklist.html | DIY项目工具清单 | 工具 清单 tool |

#### 25. 法律工具 (legal) - 非计算类
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 208 | 合同模板生成 | contract-template.html | 生成常用合同模板 | 合同 模板 contract |
| 209 | 法律时效查询 | statute-limitations.html | 各类法律时效查询 | 时效 法律 statute |
| 210 | 法律术语查询 | legal-terms.html | 常用法律术语解释 | 法律 术语 legal terms |
| 211 | 起诉状模板 | complaint-template.html | 民事起诉状模板 | 起诉状 模板 complaint |
| 212 | 借条模板生成 | iou-template.html | 生成规范借条 | 借条 模板 IOU |
| 213 | 仲裁协议模板 | arbitration-template.html | 仲裁协议模板 | 仲裁 协议 arbitration |
| 214 | 律师费估算器 | lawyer-fee.html | 估算律师代理费用 | 律师费 估算 lawyer |
| 215 | 赔偿金计算器 | compensation-calc.html | 计算各类赔偿金额 | 赔偿金 计算 compensation |

#### 26. 艺术工具 (art)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 216 | 调色板生成 | palette-generator.html | AI生成配色方案 | 调色板 生成 palette |
| 217 | 黄金比例计算 | golden-ratio.html | 计算黄金分割比例 | 黄金 比例 golden ratio |
| 218 | 三分法参考线 | rule-of-thirds.html | 三分法构图参考 | 三分法 参考 rule of thirds |
| 219 | 色轮工具 | color-wheel.html | 交互式色轮工具 | 色轮 颜色 color wheel |
| 220 | 透视参考线 | perspective-guide.html | 透视辅助参考线 | 透视 参考 perspective |
| 221 | 人体比例参考 | body-proportions.html | 人体比例参考图 | 人体 比例 body proportions |
| 222 | 笔刷模拟器 | brush-simulator.html | 模拟各种笔刷效果 | 笔刷 模拟 brush |
| 223 | 渐变生成器 | gradient-maker.html | 创建渐变色效果 | 渐变 生成 gradient |
| 224 | 图案生成器 | pattern-generator.html | 生成无缝平铺图案 | 图案 生成 pattern |
| 225 | 艺术风格参考 | art-styles.html | 各种艺术风格参考 | 艺术 风格 art styles |
| 226 | 字体配对建议 | font-pairing.html | 字体搭配建议 | 字体 配对 font |
| 227 | 颜色情绪参考 | color-emotions.html | 颜色的情感含义 | 颜色 情绪 color emotions |
| 228 | 灵感随机器 | inspiration-random.html | 随机创意灵感生成 | 灵感 随机 inspiration |
| 229 | 色彩对比分析 | color-contrast-art.html | 分析色彩对比效果 | 色彩 对比 color contrast |
| 230 | 像素网格生成 | pixel-grid.html | 生成像素画网格 | 像素 网格 pixel |

#### 27. 语言学习 (language)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 231 | 词汇量测试 | vocabulary-test.html | 测试英语词汇量 | 词汇量 测试 vocabulary |
| 232 | 单词发音练习 | pronunciation.html | 练习单词发音 | 发音 练习 pronunciation |
| 233 | 语法检查器 | grammar-checker.html | 检查语法错误 | 语法 检查 grammar |
| 234 | 同义词查询 | synonym-finder.html | 查询英文同义词 | 同义词 查询 synonym |
| 235 | 词根词缀学习 | word-roots.html | 学习英语词根词缀 | 词根 词缀 word roots |
| 236 | 句子结构分析 | sentence-parser.html | 分析英语句子结构 | 句子 结构 sentence |
| 237 | 阅读理解练习 | reading-practice.html | 英语阅读理解练习 | 阅读 理解 reading |
| 238 | 写作模板库 | writing-templates.html | 各类英文写作模板 | 写作 模板 writing |
| 239 | 口语话题练习 | speaking-topics.html | 口语练习话题库 | 口语 话题 speaking |
| 240 | 俚语学习器 | slang-learner.html | 学习英语俚语表达 | 俚语 学习 slang |
| 241 | 常见错误纠正 | common-mistakes.html | 常见英语错误纠正 | 错误 纠正 common mistakes |
| 242 | 日语假名练习 | kana-practice.html | 日语假名练习 | 日语 假名 kana |
| 243 | 韩语字母练习 | hangul-practice.html | 韩语字母练习 | 韩语 字母 hangul |
| 244 | 语言学习日历 | language-calendar.html | 语言学习打卡日历 | 学习 日历 language |
| 245 | 生词本管理 | vocabulary-book.html | 管理个人生词本 | 生词 本 vocabulary |

#### 28. 运动工具 (sports) - 非计算类
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 246 | HIIT训练计时器 | hiit-timer.html | 高强度间歇训练计时 | HIIT 间歇 训练 |
| 247 | 力量训练记录 | strength-log.html | 记录力量训练数据 | 力量 训练 记录 |
| 248 | 健身计划生成器 | workout-plan.html | 生成个性化健身计划 | 健身 计划 workout |
| 249 | 休息时间计时器 | rest-timer.html | 组间休息计时器 | 休息 时间 rest |
| 250 | 运动损伤记录 | injury-log.html | 记录运动损伤和恢复 | 损伤 记录 injury |
| 251 | 瑜伽体式库 | yoga-poses.html | 瑜伽体式参考库 | 瑜伽 体式 yoga |
| 252 | 训练周期规划 | training-cycle.html | 规划训练周期 | 周期 训练 training |
| 253 | 引体向上进度 | pullup-progress.html | 追踪引体向上进步 | 引体向上 进度 pullup |
| 254 | 俯卧撑挑战 | pushup-challenge.html | 俯卧撑训练挑战计划 | 俯卧撑 挑战 pushup |
| 255 | 运动音乐节拍器 | workout-metronome.html | 按BPM节奏运动 | 节拍 音乐 运动 |

#### 29. 游戏扩展 (game)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 256 | 打字游戏 | typing-game.html | 打字练习小游戏 | 打字 游戏 typing |
| 257 | 连连看 | link-game.html | 经典连连看游戏 | 连连看 link game |
| 258 | 推箱子 | sokoban.html | 经典推箱子游戏 | 推箱子 sokoban |
| 259 | 井字棋 | tic-tac-toe.html | 经典井字棋游戏 | 井字棋 tic tac toe |
| 260 | 五子棋 | gomoku.html | 经典五子棋游戏 | 五子棋 gomoku |
| 261 | 华容道 | klotski.html | 经典华容道游戏 | 华容道 klotski |
| 262 | 记忆卡片 | memory-cards.html | 记忆力翻牌游戏 | 记忆 卡片 memory |
| 263 | 消消乐 | match-three.html | 三消游戏 | 消消乐 match three |
| 264 | 弹球游戏 | breakout.html | 经典弹球打砖块 | 弹球 breakout |
| 265 | 飞行棋 | flying-chess.html | 简化版飞行棋 | 飞行棋 flying chess |

#### 30. 教育扩展 (education)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 266 | 数学公式速查 | math-formulas.html | 常用数学公式参考 | 数学 公式 math formulas |
| 267 | 物理公式查询 | physics-formulas.html | 常用物理公式参考 | 物理 公式 physics |
| 268 | 化学元素测验 | element-quiz.html | 化学元素记忆测验 | 化学 元素 element |
| 269 | 历史年表 | history-timeline.html | 历史事件年表 | 历史 年表 history |
| 270 | 地理知识卡 | geography-cards.html | 地理知识卡片 | 地理 知识 geography |
| 271 | 化学方程式配平增强 | chemistry-balancer.html | 化学方程式自动配平 | 化学 配平 balancer |
| 272 | 古诗词默写 | poetry-dictation.html | 古诗词默写练习 | 古诗 默写 poetry |
| 273 | 成语填空游戏 | idiom-game.html | 成语填空游戏 | 成语 填空 idiom |
| 274 | 拼音声调练习 | pinyin-tones.html | 拼音声调练习 | 拼音 声调 pinyin |
| 275 | 数学口算练习 | math-drill.html | 数学口算练习 | 口算 练习 math drill |

#### 31. 趣味扩展 (fun)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 276 | 塔罗牌抽取 | tarot-draw.html | 随机抽取塔罗牌 | 塔罗 抽取 tarot |
| 277 | 星座运势生成 | horoscope-gen.html | 生成星座运势文案 | 星座 运势 horoscope |
| 278 | 性格测试 | personality-test.html | 趣味性格测试 | 性格 测试 personality |
| 279 | 缘分测试 | compatibility-test.html | 姓名缘分配对测试 | 缘分 测试 compatibility |
| 280 | 藏头诗生成器 | acrostic-poem.html | 生成藏头诗 | 藏头诗 生成 acrostic |

#### 32. 文本工具扩展 (text)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 281 | 文本加密解密增强 | text-cipher.html | 多种古典密码加解密 | 文本 加密 解密 cipher |
| 282 | 文本摘要生成 | text-summary.html | 自动生成文本摘要 | 摘要 生成 summary |
| 283 | 关键词提取 | keyword-extractor.html | 从文本提取关键词 | 关键词 提取 keyword |
| 284 | 文本风格转换 | style-converter.html | 文本风格转换(正式/口语) | 风格 转换 style |
| 285 | 段落重排工具 | paragraph-reorder.html | 拖拽重排段落顺序 | 段落 重排 reorder |

#### 33. 媒体工具扩展 (media)
| # | 工具名称 | 文件名 | 功能描述 | 关键词 |
|---|---|---|---|---|
| 286 | 视频帧提取 | video-frame-extractor.html | 从视频提取帧 | 视频 帧 提取 frame |
| 287 | 音频波形可视化 | audio-waveform.html | 音频波形可视化 | 音频 波形 waveform |
| 288 | 图片元数据编辑 | image-metadata-edit.html | 编辑图片元数据 | 图片 元数据 metadata |
| 289 | 多图拼贴 | photo-collage.html | 多张图片拼贴 | 图片 拼贴 collage |
| 290 | 图片尺寸批量调整 | batch-resize.html | 批量调整图片尺寸 | 批量 调整 尺寸 |

---

### 补充工具 (291-300)

#### 34. 其他实用工具
| # | 工具名称 | 类别 | 文件名 | 功能描述 |
|---|---|---|---|---|
| 291 | 车辆油耗记录 | life | fuel-log.html | 记录车辆油耗 |
| 292 | 快递费估算 | shopping | shipping-calc.html | 估算快递运费 |
| 293 | 房租分摊计算 | calculator | rent-split.html | 计算室友房租分摊 |
| 294 | 节假日计算器 | time | holiday-calc.html | 计算到某节假日天数 |
| 295 | 纪念日管理 | life | anniversary-manager.html | 管理各类纪念日 |
| 296 | 生日提醒设置 | life | birthday-reminder.html | 设置生日提醒 |
| 297 | 饮水提醒 | health | water-reminder.html | 定时饮水提醒 |
| 298 | 眼睛休息提醒 | health | eye-break-reminder.html | 20-20-20护眼提醒 |
| 299 | 站立提醒 | health | stand-reminder.html | 久坐站立提醒 |
| 300 | 冥想计时器 | health | meditation-timer.html | 冥想练习计时器 |

---

## 总结

### 工具分布统计

| 类型 | 数量 | 占比 |
|---|---|---|
| 实用计算器/转换器 | 80 | 27% |
| 工作效率工具 | 80 | 27% |
| 生活服务工具 | 80 | 27% |
| 专业领域工具 | 60 | 20% |
| **总计** | **300** | **100%** |

### 类别分布统计

| 类别 | 新增数量 |
|---|---|
| travel | 20 |
| sports | 20 |
| office | 20 |
| productivity | 20 |
| social | 15 |
| shopping | 15 |
| pets | 15 |
| parenting | 15 |
| music | 15 |
| photography | 15 |
| diy | 15 |
| legal | 15 |
| language | 15 |
| art | 15 |
| weather | 10 |
| game | 10 |
| health | 10 |
| dev | 10 |
| calculator | 10 |
| education | 10 |
| fun | 5 |
| text | 5 |
| media | 5 |
| life | 5 |
| time | 1 |

---

## 下一步计划

1. **确认本规划文档** - 请确认工具列表是否符合需求
2. **逐个精心开发** - 每个工具都将精心设计，保证质量
3. **测试验证** - 每个工具开发后进行测试
4. **同步更新** - 更新 tools.json 和 index.html
5. **创建PR** - 提交代码并创建 Pull Request

---

*文档生成时间: 2025-12-29*
