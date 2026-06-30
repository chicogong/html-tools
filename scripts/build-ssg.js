import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const TOOLS_DIR = path.join(ROOT_DIR, 'tools');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const TOOLS_JSON = path.join(ROOT_DIR, 'tools.json');

// 1. Clean dist
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

// 2. Copy static assets
console.log('Copying static assets...');
const copyDirs = ['assets', 'i18n'];
for (const dir of copyDirs) {
  if (fs.existsSync(path.join(ROOT_DIR, dir))) {
    execSync(`cp -r ${path.join(ROOT_DIR, dir)} ${path.join(DIST_DIR, dir)}`);
  }
}
const copyFiles = ['index.html', 'sitemap.xml', 'manifest.json', 'robots.txt', 'favicon.ico', 'llms.txt', 'social-preview.png'];
for (const file of copyFiles) {
  if (fs.existsSync(path.join(ROOT_DIR, file))) {
    fs.copyFileSync(path.join(ROOT_DIR, file), path.join(DIST_DIR, file));
  }
}

// 3. Load layout
const layoutEjs = fs.readFileSync(path.join(SRC_DIR, 'layout.ejs'), 'utf8');

// 4. Load tools.json
const toolsData = JSON.parse(fs.readFileSync(TOOLS_JSON, 'utf8'));
const categories = toolsData.categories;
const tools = Object.values(toolsData.tools);

const SITE_URL = 'https://tools.realtime-ai.chat';

let builtCount = 0;

for (const tool of tools) {
  const fragmentPath = path.join(ROOT_DIR, tool.path);
  if (!fs.existsSync(fragmentPath)) {
    console.warn(`⚠️ Fragment not found: ${tool.path}`);
    continue;
  }

  const fragmentHtml = fs.readFileSync(fragmentPath, 'utf8');
  
  // Parse fragment
  const $ = cheerio.load(fragmentHtml, null, false);
  
  let styles = '';
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

  // Prepare SEO Data
  const catName = categories[tool.category]?.name || tool.category;
  
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: SITE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: catName, item: `${SITE_URL}/tools/${tool.category}/index.html` },
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

  const templateData = {
    title: tool.name,
    description: tool.description || tool.name,
    keywords: tool.keywords || tool.name,
    path: tool.path,
    breadcrumb,
    softwareApp,
    styles,
    scripts,
    bodyContent
  };

  const fullHtml = ejs.render(layoutEjs, templateData);

  const outPath = path.join(DIST_DIR, tool.path);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, fullHtml);
  builtCount++;
}

console.log(`✅ Built ${builtCount} tools to dist/.`);

// 5. Copy category index pages (tools/**/index.html)
console.log('Copying category pages...');
for (const catId of Object.keys(categories)) {
  const catIndex = path.join(TOOLS_DIR, catId, 'index.html');
  if (fs.existsSync(catIndex)) {
    const dest = path.join(DIST_DIR, 'tools', catId, 'index.html');
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(catIndex, dest);
  }
}

console.log('🎉 SSG Build Complete!');
