#!/usr/bin/env node

const fs = require('fs');
const glob = require('glob');

const FONT_VARIABLES = `  /* 字体变量 */
  --font-sans: 'Space Grotesk', -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
`;

const files = glob.sync('tools/**/*.html');
let fixed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const usesFontSans = content.includes('var(--font-sans)');
  const definesFontSans = /--font-sans:\s*/.test(content);

  if (usesFontSans && !definesFontSans) {
    // Add font variables to :root block
    const rootPattern = /(:root\s*\{)/;
    if (rootPattern.test(content)) {
      content = content.replace(rootPattern, `$1\n${FONT_VARIABLES}`);
      fs.writeFileSync(file, content, 'utf8');
      fixed++;
      console.log(`✅ Fixed: ${file}`);
    } else {
      console.log(`⚠️  No :root block found in: ${file}`);
    }
  }
});

console.log(`\n✅ Fixed ${fixed} files`);
