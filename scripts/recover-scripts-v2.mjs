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
let recovered = 0;

for (const filePath of allTools) {
  const relativePath = path.relative(ROOT_DIR, filePath);
  
  let currentHtml = fs.readFileSync(filePath, 'utf8');
  
  let originalHtml = '';
  try {
    originalHtml = execSync(`git show ab338cbd:${relativePath}`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  } catch (e) {
    console.error(`Failed to fetch original for ${relativePath}`);
    continue;
  }
  
  const $ = cheerio.load(originalHtml, null, false);
  let logicScripts = '';
  
  $('script:not([src]):not([type="application/ld+json"])').each((i, el) => {
    let scriptContent = $(el).html() || '';
    
    // We only strip umami.track to prevent duplicate tracking
    scriptContent = scriptContent.replace(/umami\.track\([^)]*\);?/g, '');
    
    // We leave initTheme and toggleTheme intact. They are harmless dead code.

    scriptContent = scriptContent.trim();
    if (scriptContent) {
      logicScripts += scriptContent + '\n\n';
    }
  });

  if (logicScripts.trim()) {
    // Only append if we haven't already
    const sampleTokens = logicScripts.trim().substring(0, 30);
    if (!currentHtml.includes(sampleTokens)) {
      currentHtml += `\n<script>\n${logicScripts.trim()}\n</script>\n`;
      fs.writeFileSync(filePath, currentHtml);
      recovered++;
    }
  }
}

console.log(`✅ Successfully recovered logic scripts for ${recovered} tools without breaking syntax.`);
