const fs = require('fs');
const path = require('path');

const toolsJsonPath = 'tools.json';
const toolsData = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf8'));

// Get all registered paths
const registeredPaths = new Set(Object.values(toolsData.tools).map(t => t.path));

// Category mapping based on directory
const categoryMap = {
  'data': 'data',
  'office': 'office',
  'travel': 'travel',
  'design': 'design',
  'math': 'math',
  'dev': 'dev',
  'converter': 'converter',
  'calculator': 'calculator',
  'generator': 'generator',
  'game': 'game',
  'life': 'life',
  'text': 'text',
  'network': 'network',
  'fun': 'fun',
  'real-estate': 'realestate'
};

// Get max tool ID
let maxId = Math.max(...Object.keys(toolsData.tools).map(Number));

// Find all HTML files in tools directory
const toolsDir = 'tools';
const dirs = fs.readdirSync(toolsDir);

let addedCount = 0;

for (const dir of dirs) {
  const dirPath = path.join(toolsDir, dir);
  if (!fs.statSync(dirPath).isDirectory()) continue;
  
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));
  
  for (const file of files) {
    const filePath = path.join(toolsDir, dir, file);
    
    if (!registeredPaths.has(filePath)) {
      // Extract tool name from filename
      const toolName = file.replace('.html', '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      const category = categoryMap[dir] || dir;
      
      maxId++;
      toolsData.tools[maxId] = {
        path: filePath,
        name: toolName,
        category: category,
        keywords: toolName.toLowerCase(),
        icon: '🔧',
        description: toolName
      };
      
      addedCount++;
      console.log('Added: ' + filePath);
    }
  }
}

// Ensure categories exist
const defaultCategories = {
  'data': { name: '数据工具', icon: '📊', color: 'blue' },
  'office': { name: '办公工具', icon: '📋', color: 'gray' }
};

for (const [cat, info] of Object.entries(defaultCategories)) {
  if (!toolsData.categories[cat]) {
    toolsData.categories[cat] = info;
    console.log('Added category: ' + cat);
  }
}

fs.writeFileSync(toolsJsonPath, JSON.stringify(toolsData, null, 2));
console.log('\nTotal added: ' + addedCount + ' tools');
console.log('New total: ' + Object.keys(toolsData.tools).length + ' tools');
