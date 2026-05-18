# 测试套件

零依赖的 Node 测试套件，与项目「单文件、零构建」理念一致——不引入 Jest / Vitest 等第三方框架。

## 运行

```bash
npm test          # 运行全部测试（node tests/run.js）
```

退出码：全部通过为 `0`，有失败为 `1`。CI（`.github/workflows/lint.yml`）会执行 `npm test`。

## 结构

| 文件                     | 职责                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| `_harness.js`            | 零依赖测试框架（`test` / `assert` / `section` / `summary`）+ 仓库辅助函数                |
| `run.js`                 | 入口：依次加载并运行所有 `*.test.js`，输出汇总与退出码                                   |
| `tools-json.test.js`     | `tools.json` 结构：字段齐全、引用有效、ID 连续、文件存在                                 |
| `data-quality.test.js`   | 数据质量：名称不重复、路径规范、字段取值范围、无游离文件                                 |
| `sync.test.js`           | 同步一致性：`tools.json` 与 `index.html` / `sitemap.xml` / `manifest.json` / `README.md` |
| `html-structure.test.js` | 每个工具 HTML 的 `<head>`：doctype、lang、SEO 元数据、canonical                          |
| `redirects.test.js`      | `_redirects` 与 `vercel.json` 重定向目标有效、两份配置一致                               |
| `assets.test.js`         | 静态资源与 i18n：sw 预缓存清单、manifest 图标/快捷方式、en/zh 翻译键一一对应             |

## 新增测试

在 `tests/` 下新建 `<名称>.test.js`，从 `./_harness.js` 导入 `section` / `test` / `assert`，
然后把文件名加入 `run.js` 的 `TEST_FILES` 数组即可。
