const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'tools.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Find the max key in tools
let maxId = 0;
for (const key of Object.keys(data.tools)) {
  const id = parseInt(key, 10);
  if (id > maxId) maxId = id;
}

const newId = (maxId + 1).toString();

data.tools[newId] = {
  path: 'tools/ai/prompt-generator.html',
  name: '结构化提示词生成器',
  category: 'ai',
  keywords: '提示词生成 prompt generator create 框架 ai',
  icon: '✨',
  description: '根据 CREATE 框架结构化生成高质量 AI Prompt，提升大模型输出准确率',
  popularity: 100 // Give it a boost to show up at the top
};

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Successfully registered tool with ID: ${newId}`);
