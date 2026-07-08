const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'tools', 'ai');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let changedCount = 0;

for (const file of files) {
  const filepath = path.join(dir, file);
  let content = fs.readFileSync(filepath, 'utf8');
  
  let originalContent = content;
  
  // Remove dark mode overrides from :root
  content = content.replace(/:root\s*{[^}]*?--bg-gradient:\s*linear-gradient[^}]*?}/gs, (match) => {
    return match.replace(/--bg-gradient:[^;]+;/g, '')
                .replace(/--pico-card-background-color:[^;]+;/g, '')
                .replace(/--pico-muted-border-color:[^;]+;/g, '')
                .replace(/--pico-muted-color:[^;]+;/g, '');
  });

  // Remove body background override
  content = content.replace(/body\s*{[^}]*?background:\s*var\(--bg-gradient\)[^}]*?}/gs, (match) => {
    return match.replace(/background:\s*var\(--bg-gradient\)[^;]*;/g, '');
  });
  
  // Clean up empty or mostly empty :root / body blocks
  content = content.replace(/:root\s*{\s*}/g, '');
  content = content.replace(/body\s*{\s*min-height:\s*100vh;\s*}/g, ''); // Since tool-base.css provides this too
  
  if (originalContent !== content) {
    fs.writeFileSync(filepath, content, 'utf8');
    changedCount++;
    console.log(`Fixed ${file}`);
  }
}

console.log(`Fixed ${changedCount} files.`);
