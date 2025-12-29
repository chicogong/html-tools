const fs = require('fs');
const path = require('path');

// Read tools.json to get category info
const toolsJson = JSON.parse(fs.readFileSync('tools.json', 'utf8'));

// Category name mapping
const categoryNames = {};
for (const [id, cat] of Object.entries(toolsJson.categories)) {
    categoryNames[id] = cat.name;
}

// Breadcrumb CSS to inject
const breadcrumbCSS = `
        .breadcrumb { position: fixed; top: 10px; left: 10px; z-index: 1000; background: rgba(255,255,255,0.95); padding: 8px 15px; border-radius: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); font-size: 0.85rem; }
        .breadcrumb a { color: #667eea; text-decoration: none; }
        .breadcrumb a:hover { text-decoration: underline; }
        .breadcrumb span { color: #999; margin: 0 5px; }`;

// Breadcrumb HTML
function getBreadcrumbHTML(categoryId, toolName) {
    const catName = categoryNames[categoryId] || categoryId;
    return `    <nav class="breadcrumb"><a href="../../index.html">首页</a><span>›</span><a href="../../index.html#${categoryId}">${catName}</a><span>›</span>${toolName}</nav>`;
}

// Process each tool
let updated = 0;
for (const [id, tool] of Object.entries(toolsJson.tools)) {
    const filePath = tool.path;
    if (!fs.existsSync(filePath)) continue;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already has breadcrumb
    if (content.includes('class="breadcrumb"')) continue;
    
    // Add breadcrumb CSS before </style>
    if (content.includes('</style>')) {
        content = content.replace('</style>', breadcrumbCSS + '\n    </style>');
    }
    
    // Add breadcrumb HTML after <body>
    const breadcrumbHTML = getBreadcrumbHTML(tool.category, tool.name);
    if (content.includes('<body>')) {
        content = content.replace('<body>', '<body>\n' + breadcrumbHTML);
    }
    
    fs.writeFileSync(filePath, content);
    updated++;
    
    // Only update first 100 for testing
    if (updated >= 100) break;
}

console.log(`Added breadcrumbs to ${updated} tools`);
