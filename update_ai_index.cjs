const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, 'tools', 'ai', 'index.html');
let content = fs.readFileSync(filepath, 'utf8');

const newCard = `
        <a class="cat-card" href="prompt-generator.html">
          <span class="cat-card-icon">✨</span>
          <span class="cat-card-body">
            <span class="cat-card-name">结构化提示词生成器</span>
            <span class="cat-card-desc">根据 CREATE 框架快速生成高质量 AI Prompt，提升大模型输出准确率</span>
          </span>
        </a>`;

// Insert after the <section class="cat-grid">
content = content.replace('<section class="cat-grid">', '<section class="cat-grid">' + newCard);

fs.writeFileSync(filepath, content, 'utf8');
console.log('Added to tools/ai/index.html');
