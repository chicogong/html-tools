import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const TOOLS_DIR = path.join(ROOT_DIR, 'tools');

function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      getHtmlFiles(path.join(dir, file), fileList);
    } else if (file.endsWith('.html') && file !== 'index.html') {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const allTools = getHtmlFiles(TOOLS_DIR);
let recoveredDeps = 0;

for (const filePath of allTools) {
  const relativePath = path.relative(ROOT_DIR, filePath);

  let currentHtml = fs.readFileSync(filePath, 'utf8');

  let originalHtml = '';
  try {
    originalHtml = execSync(`git show ab338cbd:${relativePath}`, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024
    });
  } catch (e) {
    console.error(`Failed to fetch original for ${relativePath}`);
    continue;
  }

  const $ = cheerio.load(originalHtml, null, false);
  let depsHtml = '';

  // 1. Recover external stylesheets (ignore local ones because layout.ejs handles local base css)
  $('link[rel="stylesheet"]').each((i, el) => {
    const href = $(el).attr('href');
    if (href && href.startsWith('http')) {
      depsHtml += $.html(el) + '\n';
    }
  });

  // 2. Recover external scripts (ignore local ones like tool-chrome.js)
  $('script[src]').each((i, el) => {
    const src = $(el).attr('src');
    if (src && src.startsWith('http')) {
      depsHtml += $.html(el) + '\n';
    }
  });

  if (depsHtml.trim()) {
    // Inject at the very top of the fragment so they load before inline scripts
    const sampleTokens = depsHtml.trim().substring(0, 30);
    if (!currentHtml.includes(sampleTokens)) {
      currentHtml = depsHtml.trim() + '\n\n' + currentHtml;
      fs.writeFileSync(filePath, currentHtml);
      recoveredDeps++;
    }
  }
}

console.log(`✅ Successfully recovered external CDN dependencies for ${recoveredDeps} tools.`);
