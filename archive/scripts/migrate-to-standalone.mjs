import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const TOOLS_DIR = path.join(ROOT_DIR, 'tools');
const TOOLS_JSON = path.join(ROOT_DIR, 'tools.json');

const toolsData = JSON.parse(fs.readFileSync(TOOLS_JSON, 'utf8'));
const categories = toolsData.categories;
const tools = Object.values(toolsData.tools);
const SITE_URL = 'https://tools.realtime-ai.chat';

let successCount = 0;
let failCount = 0;

for (const tool of tools) {
  const filePath = path.join(ROOT_DIR, tool.path);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ Tool file not found: ${tool.path}`);
    failCount++;
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');

  // 如果已经包含 DOCTYPE，可能已经是完整 HTML 或者分类 index，跳过
  if (html.trim().toLowerCase().startsWith('<!doctype')) {
    console.log(`⏭️  Skipping already standalone: ${tool.path}`);
    continue;
  }

  const $ = cheerio.load(html, null, false);

  // Extract pieces
  let styles = '';
  $('link[rel="stylesheet"]').each((i, el) => {
    styles += $.html(el) + '\n';
  });
  $('link[rel="stylesheet"]').remove();

  $('style').each((i, el) => {
    styles += $.html(el) + '\n';
  });
  $('style').remove();

  let scripts = '';
  $('script').each((i, el) => {
    scripts += $.html(el) + '\n';
  });
  $('script').remove();

  const bodyContent = $.html();

  // SEO Data
  const catName = categories[tool.category]?.name || tool.category;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: SITE_URL + '/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: catName,
        item: `${SITE_URL}/tools/${tool.category}/index.html`
      },
      { '@type': 'ListItem', position: 3, name: tool.name, item: `${SITE_URL}/${tool.path}` }
    ]
  };

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${tool.name} - WebUtils`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };

  const depth = tool.path.split('/').length - 1;
  const relativeRoot = '../'.repeat(depth) || './';

  const title = `${tool.name} - WebUtils`;
  const description = tool.description || tool.name;
  const keywords = tool.keywords || tool.name;

  const fullHtml = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>${title}</title>

    <!-- SEO Meta Tags -->
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${keywords}" />
    <meta name="author" content="WebUtils" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${SITE_URL}/${tool.path}" />

    <!-- Open Graph -->
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${SITE_URL}/${tool.path}" />
    <meta property="og:site_name" content="WebUtils" />
    <meta property="og:locale" content="zh_CN" />
    <meta property="og:image" content="${SITE_URL}/social-preview.png" />
    <meta property="og:image:width" content="1280" />
    <meta property="og:image:height" content="640" />
    <meta property="og:image:type" content="image/png" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${SITE_URL}/social-preview.png" />

    <!-- Favicon & PWA -->
    <link rel="icon" type="image/svg+xml" href="${relativeRoot}favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="${relativeRoot}favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="${relativeRoot}favicon-16x16.png" />
    <link rel="apple-touch-icon" href="${relativeRoot}apple-touch-icon.png" />
    <meta name="theme-color" content="#0a0a0f" />
    <link rel="manifest" href="${relativeRoot}manifest.json" />

    <!-- Structured Data -->
    <script type="application/ld+json">
      ${JSON.stringify(breadcrumb, null, 2)}
    </script>
    <script type="application/ld+json">
      ${JSON.stringify(softwareApp, null, 2)}
    </script>

    <!-- Global & Tool Styles -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="${relativeRoot}assets/css/tool-base.css" />
    
    ${styles.trim()}
  </head>
  <body>
    <div class="tool-main" role="main">
      ${bodyContent.trim()}
    </div>
    
    ${scripts.trim()}
    
    <!-- 全局 UI 注入 -->
    <script src="${relativeRoot}assets/js/tool-chrome.js"></script>
  </body>
</html>
`;

  fs.writeFileSync(filePath, fullHtml);
  successCount++;
}

console.log(`✅ Migrated ${successCount} tool fragments to standalone HTML.`);
if (failCount > 0) {
  console.log(`❌ Failed: ${failCount}`);
}
