# 搜索引擎提交指南

本文档说明如何将 WebUtils 提交到各大搜索引擎，加速收录和索引。

---

## ✅ 已完成的 SEO 优化

在提交搜索引擎之前，我们已经完成：

- ✅ Sitemap.xml (包含 150+ URLs)
- ✅ robots.txt
- ✅ Schema.org 结构化数据
- ✅ Open Graph 标签
- ✅ 面包屑导航
- ✅ PWA manifest.json
- ✅ Favicon 多尺寸支持

---

## 🌐 Google Search Console

### 1. 验证网站所有权

**方法一：DNS 验证（推荐）**

1. 访问 [Google Search Console](https://search.google.com/search-console)
2. 添加资源 → 输入 `https://tools.realtime-ai.chat`
3. 选择"DNS 记录"验证方式
4. 将提供的 TXT 记录添加到域名 DNS 设置
5. 等待 DNS 生效后点击"验证"

**方法二：HTML 文件验证**

1. 下载验证文件（如 `googlexxxxxxxxxxxx.html`）
2. 上传到网站根目录
3. 确保可以访问 `https://tools.realtime-ai.chat/googlexxxxxxxxxxxx.html`
4. 点击"验证"

**方法三：Meta 标签验证**

1. 复制提供的 meta 标签
2. 添加到 `index.html` 的 `<head>` 部分
3. 部署后点击"验证"

### 2. 提交 Sitemap

验证成功后：

1. 进入 Search Console 控制台
2. 左侧菜单 → **站点地图 (Sitemaps)**
3. 输入: `https://tools.realtime-ai.chat/sitemap.xml`
4. 点击"提交"

**检查索引状态：**
- 覆盖率报告：查看哪些页面已被索引
- URL 检查工具：测试单个页面的索引状态

### 3. 请求编入索引（可选）

对于重要页面，可以手动请求索引：

1. 使用"URL 检查"工具
2. 输入页面 URL（如首页）
3. 点击"请求编入索引"

**建议优先索引：**
- 首页: `https://tools.realtime-ai.chat/`
- 热门工具: JSON 格式化、时间戳转换、图片压缩等

---

## 🅱️ Bing Webmaster Tools

### 1. 验证网站

1. 访问 [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. 添加站点 → 输入 `https://tools.realtime-ai.chat`
3. 验证方式：
   - **XML 文件**: 上传 `BingSiteAuth.xml` 到根目录（已完成）
   - **Meta 标签**: 添加到 `<head>`
   - **CNAME 记录**: DNS 验证

### 2. 提交 Sitemap

1. 左侧菜单 → **站点地图 (Sitemaps)**
2. 输入: `https://tools.realtime-ai.chat/sitemap.xml`
3. 点击"提交"

### 3. URL 提交 API（可选）

Bing 支持通过 API 批量提交 URL：

```bash
# 获取 API Key（在 Settings → API Access）
API_KEY="your-api-key"

# 提交 URL
curl -X POST \
  "https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?apikey=${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "siteUrl": "https://tools.realtime-ai.chat",
    "urlList": [
      "https://tools.realtime-ai.chat/",
      "https://tools.realtime-ai.chat/tools/dev/json-formatter.html"
    ]
  }'
```

**每日限额**: 10,000 URLs

---

## 🔍 百度搜索资源平台

### 1. 验证网站

1. 访问 [百度搜索资源平台](https://ziyuan.baidu.com)
2. 用户中心 → 站点管理 → 添加网站
3. 输入: `https://tools.realtime-ai.chat`
4. 验证方式：
   - **HTML 标签**: 添加 meta 标签到 `<head>`（已完成）
   - **文件验证**: 上传验证文件

### 2. 提交 Sitemap

1. 链接提交 → **sitemap**
2. 输入: `https://tools.realtime-ai.chat/sitemap.xml`
3. 提交

### 3. 主动推送（推荐）

百度支持主动推送新页面，收录更快：

```bash
# 准备 URL 列表（每行一个）
cat > urls.txt <<EOF
https://tools.realtime-ai.chat/
https://tools.realtime-ai.chat/tools/dev/json-formatter.html
https://tools.realtime-ai.chat/tools/dev/base64.html
EOF

# 推送到百度
curl -H 'Content-Type:text/plain' \
  --data-binary @urls.txt \
  "http://data.zz.baidu.com/urls?site=https://tools.realtime-ai.chat&token=YOUR_TOKEN"
```

**获取 Token**: 资源平台 → 链接提交 → 主动推送 → 查看 Token

**每日配额**: 通常 500-5000 条（根据站点质量）

---

## 🦆 360 搜索站长平台

### 1. 验证网站

1. 访问 [360 站长平台](https://zhanzhang.so.com)
2. 站点管理 → 添加网站
3. 验证方式：文件验证或 meta 标签

### 2. 提交 Sitemap

1. Sitemap 提交
2. 输入: `https://tools.realtime-ai.chat/sitemap.xml`

---

## 🐕 搜狗站长平台

### 1. 验证网站

1. 访问 [搜狗站长平台](https://zhanzhang.sogou.com)
2. 添加网站
3. 上传验证文件 `sogousiteverification.txt`（已完成）

### 2. 提交 Sitemap

1. Sitemap 提交
2. 输入: `https://tools.realtime-ai.chat/sitemap.xml`

---

## 🎯 头条搜索站长平台

### 1. 验证网站

1. 访问 [头条搜索站长平台](https://om.toutiao.com/webmaster/)
2. 添加网站
3. 验证方式：
   - HTML 文件: `ByteDanceVerify.html`（已完成）
   - Meta 标签（已完成）

### 2. 提交 Sitemap

1. Sitemap 管理
2. 添加 Sitemap: `https://tools.realtime-ai.chat/sitemap.xml`

---

## 🚀 IndexNow

IndexNow 是一个由 Microsoft 和 Yandex 支持的快速索引协议，支持 Bing、Yandex、Seznam 等搜索引擎。

### 1. 生成 API Key

已生成并放置在根目录：`03bdae3721054dfba79edd66e6157c3f.txt`

### 2. 提交 URL

当有新页面或更新时，通过 API 通知搜索引擎：

```bash
API_KEY="03bdae3721054dfba79edd66e6157c3f"

curl "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d '{
    "host": "tools.realtime-ai.chat",
    "key": "'${API_KEY}'",
    "keyLocation": "https://tools.realtime-ai.chat/'${API_KEY}'.txt",
    "urlList": [
      "https://tools.realtime-ai.chat/",
      "https://tools.realtime-ai.chat/tools/dev/json-formatter.html"
    ]
  }'
```

**每日限额**: 10,000 URLs

---

## 📊 提交后的监控

### Google Search Console
- **覆盖率报告**: 查看索引状态
- **搜索分析**: 关键词排名和点击率
- **Core Web Vitals**: 性能指标

### Bing Webmaster
- **索引状态**: 已索引页面数量
- **关键词研究**: 搜索词流量
- **SEO 报告**: 优化建议

### 百度搜索资源平台
- **索引量**: 每日索引变化
- **流量与关键词**: 搜索来源分析
- **抓取诊断**: 抓取错误和异常

---

## ⏰ 预期收录时间

| 搜索引擎 | 预期收录时间 | 完全索引时间 |
|---------|------------|------------|
| Google | 1-3 天 | 1-2 周 |
| Bing | 1-5 天 | 2-3 周 |
| 百度 | 3-7 天 | 2-4 周 |
| 360 搜索 | 5-10 天 | 3-4 周 |
| 搜狗 | 5-10 天 | 3-4 周 |
| 头条搜索 | 3-7 天 | 2-3 周 |

---

## 🎯 加速收录技巧

1. **高质量外链**: 在其他网站提及并链接
2. **社交媒体分享**: Twitter、V2EX、掘金等
3. **定期更新**: 添加新工具、更新现有工具
4. **内部链接**: 工具之间互相推荐
5. **主动推送**: 使用百度主动推送、IndexNow

---

## ✅ 检查清单

提交前确认：

- [ ] Sitemap.xml 可访问且格式正确
- [ ] robots.txt 允许搜索引擎抓取
- [ ] 所有页面包含 meta description
- [ ] Schema.org 结构化数据正确
- [ ] 移动端适配良好
- [ ] 页面加载速度快（< 3 秒）
- [ ] HTTPS 正常工作
- [ ] 无 404 错误页面

提交后：

- [ ] 验证 Sitemap 提交成功
- [ ] 检查首页是否被索引
- [ ] 监控索引页面数量增长
- [ ] 分析搜索关键词流量
- [ ] 根据搜索数据优化页面

---

**祝收录顺利！📈**
