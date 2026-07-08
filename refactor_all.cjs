const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'tools', 'ai');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.html'));

let changedCount = 0;

for (const file of files) {
  if (file === 'index.html' || file === 'gpt5-guide.html') continue;

  const filepath = path.join(dir, file);
  let content = fs.readFileSync(filepath, 'utf8');
  let originalContent = content;

  // Insert link to article-base.css if not present
  if (!content.includes('article-base.css')) {
    content = content.replace(
      '<link rel="stylesheet" href="../../assets/css/tool-base.css" />',
      '<link rel="stylesheet" href="../../assets/css/tool-base.css" />\n    <link rel="stylesheet" href="../../assets/css/article-base.css" />'
    );
  }

  // Remove all <style> blocks entirely
  content = content.replace(/<style>[\s\S]*?<\/style>/g, '');

  if (content !== originalContent) {
    fs.writeFileSync(filepath, content, 'utf8');
    changedCount++;
    console.log(`Refactored ${file}`);
  }
}

console.log(`Refactored ${changedCount} files.`);
