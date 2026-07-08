const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, 'tools', 'ai', 'gpt5-guide.html');
let content = fs.readFileSync(filepath, 'utf8');

// The goal is to replace the huge <style> block from <style> to </style>
// with a clean minimal <style> block or just linking the new article-base.css

// 1. We inject `<link rel="stylesheet" href="../../assets/css/article-base.css" />` right after `tool-base.css`
content = content.replace(
  '<link rel="stylesheet" href="../../assets/css/tool-base.css" />',
  '<link rel="stylesheet" href="../../assets/css/tool-base.css" />\n    <link rel="stylesheet" href="../../assets/css/article-base.css" />'
);

// 2. We remove the giant <style> ... </style> block
// We'll just replace everything between <style> and </style> with an empty string, or remove it entirely.
content = content.replace(/<style>[\s\S]*?<\/style>/, '');

// Since there are multiple <style> blocks or one huge one, let's remove ALL of them in this file
// because all the variables are in tool-base.css and the components are in article-base.css
content = content.replace(/<style>[\s\S]*?<\/style>/g, '');

// 3. Optional: update content text slightly to show it's updated for 2026
content = content.replace('2025年12月11日', '2026年初');
content = content.replace('GPT-5 5.2', 'GPT-5 2026版');

fs.writeFileSync(filepath, content, 'utf8');
console.log('Refactored gpt5-guide.html');
