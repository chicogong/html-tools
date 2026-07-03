import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

const INCLUDE_DIRS = ['tools', 'assets', 'i18n'];
const INCLUDE_FILES = [
  'index.html',
  'manifest.json',
  'sitemap.xml',
  'robots.txt',
  'sw.js',
  'llms.txt',
  '_headers',
  '_redirects',
  'apple-touch-icon.png',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'favicon.svg',
  'social-preview.png',
  'offline.html',
  'baidu_verify_codeva-L08oitvCVO.html',
  'ByteDanceVerify.html',
  'BingSiteAuth.xml',
  'sogousiteverification.txt'
];

console.log('📦 Preparing dist/ directory for Cloudflare Pages deployment...');

// Create fresh dist directory
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

// Copy directories
for (const dir of INCLUDE_DIRS) {
  const src = path.join(ROOT_DIR, dir);
  const dest = path.join(DIST_DIR, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    console.log(`✅ Copied directory: ${dir}/`);
  }
}

// Copy files
for (const file of INCLUDE_FILES) {
  const src = path.join(ROOT_DIR, file);
  const dest = path.join(DIST_DIR, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✅ Copied file: ${file}`);
  }
}

console.log('\n🎉 Successfully created dist/ directory! Cloudflare Pages can now deploy it.');
