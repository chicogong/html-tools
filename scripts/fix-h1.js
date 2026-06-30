import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

function fixH1InFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;

  // 1. If there's NO H1 at all originally, upgrade the first H2 to H1
  let h1s = content.match(/<h1[^>]*>.*?<\/h1>/gs) || [];
  if (h1s.length === 0) {
    const h2s = content.match(/<h2[^>]*>.*?<\/h2>/gs) || [];
    if (h2s.length > 0) {
      content = content.replace(/<h2([^>]*)>(.*?)<\/h2>/s, '<h1$1>$2</h1>');
    }
  }

  // Recalculate H1s
  h1s = content.match(/<h1[^>]*>.*?<\/h1>/gs) || [];

  // 2. If there are multiple H1s, downgrade nav-title first
  if (h1s.length > 1) {
    if (content.includes('class="nav-title"')) {
      content = content.replace(
        /<h1([^>]*)class="nav-title"([^>]*)>(.*?)<\/h1>/gs,
        '<div$1class="nav-title"$2>$3</div>'
      );
    }

    // Check again
    h1s = content.match(/<h1[^>]*>.*?<\/h1>/gs) || [];
    if (h1s.length > 1) {
      // Still multiple, keep the first, downgrade the rest to h2
      let first = true;
      content = content.replace(/<h1([^>]*)>(.*?)<\/h1>/gs, (match, p1, p2) => {
        if (first) {
          first = false;
          return match;
        }
        return `<h2${p1}>${p2}</h2>`;
      });
    }

    // Wait, what if downgrading nav-title left ZERO H1s?
    // Example: A file had <h1 class="nav-title"> and <h1 class="nav-title"> (duplicate). That's rare.
    // Let's re-verify we didn't wipe out all H1s.
    h1s = content.match(/<h1[^>]*>.*?<\/h1>/gs) || [];
    if (h1s.length === 0) {
      // Fallback: upgrade the first H2 or DIV nav-title back to H1 if we screwed up
      content = content.replace(
        /<div([^>]*)class="nav-title"([^>]*)>(.*?)<\/div>/s,
        '<h1$1class="nav-title"$2>$3</h1>'
      );
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  return false;
}

function run() {
  const files = globSync('tools/**/*.html', { ignore: 'tools/**/node_modules/**' });
  let fixedCount = 0;

  files.forEach((file) => {
    if (fixH1InFile(file)) {
      fixedCount++;
      console.log('Fixed H1 in ' + file);
    }
  });

  console.log(`\nSuccessfully fixed H1 tags in ${fixedCount} files.`);
}

run();
