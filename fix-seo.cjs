const fs = require('fs');
const path = require('path');
const glob = require('glob'); // May need to install or use fs.readdirSync

function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (filePath.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = findHtmlFiles(path.join(__dirname, 'tools'));
let multipleDescCount = 0;
let missingH1Count = 0;
let multipleH1Count = 0;
let shortDescCount = 0;

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Multiple meta description
  const descRegex = /<meta\s+name="description"\s+content="([^"]*)"\s*\/?>/g;
  let match;
  let descs = [];
  while ((match = descRegex.exec(content)) !== null) {
    descs.push({ full: match[0], content: match[1], index: match.index });
  }

  if (descs.length > 1) {
    multipleDescCount++;
    // Keep the longest or most specific one
    let bestDesc = descs[0];
    for (let i = 1; i < descs.length; i++) {
      if (descs[i].content.length > bestDesc.content.length && !descs[i].content.includes('WebUtils')) {
        bestDesc = descs[i];
      } else if (descs[i].content.length > bestDesc.content.length) {
         bestDesc = descs[i];
      }
    }
    
    // Remove others
    descs.forEach(d => {
      if (d !== bestDesc) {
        content = content.replace(d.full, '');
        changed = true;
      }
    });

    // Also update og:description and twitter:description if we have a better one
    content = content.replace(/<meta property="og:description" content="[^"]*" \/>/g, `<meta property="og:description" content="${bestDesc.content}" />`);
    content = content.replace(/<meta name="twitter:description" content="[^"]*" \/>/g, `<meta name="twitter:description" content="${bestDesc.content}" />`);
  }

  // 2. Check H1
  const h1Regex = /<h1[^>]*>([\s\S]*?)<\/h1>/g;
  let h1Count = 0;
  while (h1Regex.exec(content) !== null) {
    h1Count++;
  }
  if (h1Count === 0) {
    missingH1Count++;
    console.log(`Missing H1: ${file}`);
  } else if (h1Count > 1) {
    multipleH1Count++;
    console.log(`Multiple H1: ${file}`);
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log(`Fixed multiple descriptions in ${multipleDescCount} files.`);
console.log(`Missing H1: ${missingH1Count} files.`);
console.log(`Multiple H1: ${multipleH1Count} files.`);
