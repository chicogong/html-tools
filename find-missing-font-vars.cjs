const fs = require('fs');
const glob = require('glob');

const files = glob.sync('tools/**/*.html');
const missing = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const usesFontSans = content.includes('var(--font-sans)');
  const definesFontSans = /--font-sans:\s*/.test(content);

  if (usesFontSans && !definesFontSans) {
    missing.push(file);
  }
});

console.log(`Files using but not defining --font-sans: ${missing.length}\n`);
missing.slice(0, 20).forEach(f => console.log(f));

if (missing.length > 20) {
  console.log(`\n... and ${missing.length - 20} more`);
}
