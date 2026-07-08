import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const TOOLS_JSON = path.join(ROOT_DIR, 'tools.json');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const TOOLS_DIR = path.join(ROOT_DIR, 'tools');

console.log('🔍 Starting Deep Integrity Audit (10-Point Check)...\n');

let score = 100;
const errors = [];

function assert(condition, message, penalty = 10) {
  if (!condition) {
    errors.push(`❌ ${message}`);
    score -= penalty;
    return false;
  }
  return true;
}

try {
  // 1. tools.json JSON Validity
  const data = JSON.parse(fs.readFileSync(TOOLS_JSON, 'utf8'));
  console.log('✅ 1. tools.json parse check: PASS');

  const tools = Object.values(data.tools);
  const categories = Object.keys(data.categories);

  // 2. Duplicate paths
  const paths = tools.map((t) => t.path);
  const uniquePaths = new Set(paths);
  assert(paths.length === uniquePaths.size, 'Duplicate tool paths found in tools.json');
  console.log('✅ 2. Unique URL path mapping check: PASS');

  // 3. Category Validation
  const toolCategories = new Set(tools.map((t) => t.category));
  let catMissing = false;
  toolCategories.forEach((c) => {
    if (!categories.includes(c)) {
      catMissing = true;
      assert(false, `Tool uses unregistered category: ${c}`);
    }
  });
  if (!catMissing) console.log('✅ 3. Category referential integrity: PASS');

  // 4. Source Files Existence
  let missingSource = false;
  tools.forEach((t) => {
    if (!fs.existsSync(path.join(ROOT_DIR, t.path))) {
      missingSource = true;
      assert(false, `Missing source file for registered tool: ${t.path}`);
    }
  });
  if (!missingSource) console.log('✅ 4. Source files physical existence check: PASS');

  // 5. Orphaned HTML files
  let hasOrphans = false;
  function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(file));
      } else if (file.endsWith('.html') && !file.endsWith('index.html')) {
        results.push(file);
      }
    });
    return results;
  }
  const allTools = walk(TOOLS_DIR).map((f) => path.relative(ROOT_DIR, f));
  allTools.forEach((f) => {
    if (!paths.includes(f.replace(/\\/g, '/'))) {
      hasOrphans = true;
      assert(false, `Orphaned tool file found: ${f}`);
    }
  });
  if (!hasOrphans) console.log('✅ 5. Orphaned files check (0 garbage files): PASS');

  // 6. Build Output (dist) Integrity
  let missingDist = false;
  tools.forEach((t) => {
    if (!fs.existsSync(path.join(DIST_DIR, t.path))) {
      missingDist = true;
      assert(false, `Compiled file missing from dist: ${t.path}`);
    }
  });
  if (!missingDist) console.log('✅ 6. SSG Output integrity (All tools compiled): PASS');

  // 7. Sitemap.xml coverage
  const sitemap = fs.readFileSync(path.join(ROOT_DIR, 'sitemap.xml'), 'utf8');
  let missingSitemap = false;
  tools.forEach((t) => {
    if (!sitemap.includes(t.path)) {
      missingSitemap = true;
      assert(false, `URL missing from sitemap.xml: ${t.path}`);
    }
  });
  if (!missingSitemap) console.log('✅ 7. Sitemap SEO URL coverage: PASS');

  // 8. Title & Meta Tags Check
  let missingSeo = false;
  tools.forEach((t) => {
    const distPath = path.join(DIST_DIR, t.path);
    if (fs.existsSync(distPath)) {
      const html = fs.readFileSync(distPath, 'utf8');
      if (!html.includes('<title>') || !html.includes('name="description"')) {
        missingSeo = true;
        assert(false, `Missing essential SEO tags in: ${t.path}`);
      }
    }
  });
  if (!missingSeo) console.log('✅ 8. SEO Meta structure (Title/Description) check: PASS');

  // 9. Layout Double-wrapping Check
  let doubleWrapped = false;
  categories.forEach((c) => {
    const p = path.join(DIST_DIR, 'tools', c, 'index.html');
    if (fs.existsSync(p)) {
      const html = fs.readFileSync(p, 'utf8');
      const roleMainCount = (html.match(/role="main"/g) || []).length;
      if (roleMainCount > 1) {
        doubleWrapped = true;
        assert(false, `Category page double wrapped in layout: ${c}`);
      }
    }
  });
  if (!doubleWrapped) console.log('✅ 9. HTML5 structure (No nested layouts) check: PASS');

  // 10. EJS Template Leak Check
  let templateLeak = false;
  allTools.forEach((f) => {
    const p = path.join(DIST_DIR, f);
    if (fs.existsSync(p)) {
      const html = fs.readFileSync(p, 'utf8');
      if (html.includes('<%=') || html.includes('<%=')) {
        templateLeak = true;
        assert(false, `EJS Template variable leaked into output: ${f}`);
      }
    }
  });
  if (!templateLeak) console.log('✅ 10. Template compilation safety check: PASS');
} catch (e) {
  assert(false, `Fatal Error during audit: ${e.message}`, 100);
}

console.log('\n=============================================');
if (errors.length === 0) {
  console.log(`🌟 FINAL INTEGRITY SCORE: 100/100`);
  console.log(`🌟 STATUS: PERFECT. ZERO ARCHITECTURAL FLAWS DETECTED.`);
} else {
  console.log(`⚠️ FINAL INTEGRITY SCORE: ${score}/100`);
  console.log('Errors found:');
  errors.forEach((e) => console.error(e));
}
console.log('=============================================\n');
