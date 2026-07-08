import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

function getHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      getHtmlFiles(path.join(dir, file), fileList);
    } else if (file.endsWith('.html') && !file.includes('ByteDance') && !file.includes('baidu')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const distFiles = getHtmlFiles(path.join(DIST_DIR, 'tools'));
let report = {
  missingDOMElementIDs: [],
  brokenLocalAssetLinks: [],
  strayHtmlTagsInFragment: [],
  missingInlineFunctions: [],
  invalidCdnUrls: [],
  nestedMainTags: [],
  fileSizeAnomalies: [],
  duplicateDOMElementIDs: [],
  emptyToolContent: []
};

console.log(`🔍 [10-Angle Deep Audit] Scanning ${distFiles.length} generated tools...\n`);

for (const filePath of distFiles) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);
  const relPath = path.relative(DIST_DIR, filePath);

  // 1 & 2: IDs
  const allIds = new Set();
  const dupes = new Set();
  $('[id]').each((_, el) => {
    const id = $(el).attr('id');
    if (id) {
      if (allIds.has(id)) dupes.add(id);
      allIds.add(id);
    }
  });
  if (dupes.size > 0)
    report.duplicateDOMElementIDs.push({ file: relPath, dupes: Array.from(dupes) });

  const scriptContent = $('script')
    .map((_, el) => $(el).html())
    .get()
    .join('\n');

  // Exclude known global/dynamically generated IDs
  const ignoredMissingIds = ['output', 'preview', 'result'];
  const getElementByIdMatches = scriptContent.matchAll(/getElementById\(['"]([^'"]+)['"]\)/g);
  for (const match of getElementByIdMatches) {
    const id = match[1];
    if (!allIds.has(id) && !ignoredMissingIds.includes(id)) {
      // It's possible the ID is created dynamically (e.g. document.createElement)
      if (!scriptContent.includes(`id = '${id}'`) && !scriptContent.includes(`id="${id}"`)) {
        report.missingDOMElementIDs.push({ file: relPath, id });
      }
    }
  }

  // 3: Broken Links
  $('img[src]').each((_, el) => {
    const src = $(el).attr('src');
    if (src && !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('blob:')) {
      const absPath = path.resolve(path.dirname(filePath), src.split('?')[0]);
      if (!fs.existsSync(absPath)) {
        report.brokenLocalAssetLinks.push({ file: relPath, src });
      }
    }
  });

  // 4: Stray HTML tags
  const sourcePath = path.join(ROOT_DIR, relPath);
  if (fs.existsSync(sourcePath)) {
    const sourceHtml = fs.readFileSync(sourcePath, 'utf8');
    if (
      sourceHtml.includes('<html') ||
      sourceHtml.includes('<body') ||
      sourceHtml.includes('<!DOCTYPE')
    ) {
      report.strayHtmlTagsInFragment.push(relPath);
    }
  }

  // 5: Missing Functions
  $('[onclick]').each((_, el) => {
    const onclick = $(el).attr('onclick');
    if (!onclick) return;
    const funcNameMatch = onclick.match(/([a-zA-Z0-9_]+)\s*\(/);
    if (funcNameMatch) {
      const funcName = funcNameMatch[1];
      const ignoredFuncs = [
        'toggleTheme',
        'alert',
        'console',
        'window',
        'document',
        'history',
        'navigator',
        'setTimeout'
      ];
      if (!ignoredFuncs.includes(funcName)) {
        if (
          !scriptContent.includes(`function ${funcName}`) &&
          !scriptContent.includes(`${funcName} =`) &&
          !scriptContent.includes(`${funcName}:`)
        ) {
          report.missingInlineFunctions.push({ file: relPath, func: funcName });
        }
      }
    }
  });

  // 6: Invalid CDNs
  $('[src], [href]').each((_, el) => {
    const url = $(el).attr('src') || $(el).attr('href');
    if (
      url &&
      url.startsWith('http') &&
      !url.startsWith('http://') &&
      !url.startsWith('https://')
    ) {
      report.invalidCdnUrls.push({ file: relPath, url });
    }
  });

  // 7: Nested main
  if ($('main main').length > 0) {
    report.nestedMainTags.push(relPath);
  }

  // 8: Size bloat > 1MB
  const stat = fs.statSync(filePath);
  if (stat.size > 1024 * 1024 * 2) {
    // 2MB threshold
    report.fileSizeAnomalies.push({ file: relPath, size: stat.size });
  }

  // 9: Empty Tool
  const text = $('main').text().trim();
  if (text.length < 20) {
    report.emptyToolContent.push(relPath);
  }
}

// 10: Service Worker Precache Check
console.log('Checking Angle 10: Service Worker Precache Integrity...');
const swPath = path.join(DIST_DIR, 'sw.js');
let swOk = false;
if (fs.existsSync(swPath)) {
  const swContent = fs.readFileSync(swPath, 'utf8');
  if (swContent.includes('PRECACHE_ASSETS') && swContent.includes('./')) {
    swOk = true;
  }
}

console.log('================ AUDIT RESULTS ================');
console.log(`1. DOM Elements (Missing IDs): ${report.missingDOMElementIDs.length} issues`);
console.log(`2. Duplicate Element IDs: ${report.duplicateDOMElementIDs.length} issues`);
console.log(`3. Broken Local Asset Links: ${report.brokenLocalAssetLinks.length} issues`);
console.log(`4. Stray <html>/<body> Tags: ${report.strayHtmlTagsInFragment.length} issues`);
console.log(
  `5. Missing Inline Functions (onclick): ${report.missingInlineFunctions.length} issues`
);
console.log(`6. Invalid CDN URLs: ${report.invalidCdnUrls.length} issues`);
console.log(`7. Nested <main> Tags: ${report.nestedMainTags.length} issues`);
console.log(`8. File Size Anomalies (>2MB): ${report.fileSizeAnomalies.length} issues`);
console.log(`9. Empty Tool Content: ${report.emptyToolContent.length} issues`);
console.log(`10. Service Worker Integrity: ${swOk ? 'OK' : 'FAILED'}`);
console.log('===============================================');

// Print detailed reports for failures if they exist
const hasFailures = Object.values(report).some((arr) => arr.length > 0);
if (hasFailures) {
  fs.writeFileSync(path.join(ROOT_DIR, 'audit-report.json'), JSON.stringify(report, null, 2));
  console.log('Detailed failures saved to audit-report.json');
}
