import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

function run() {
  const files = globSync('tools/**/*.html', { ignore: 'tools/**/node_modules/**' });
  let missingCount = 0;

  files.forEach((file) => {
    let content = fs.readFileSync(file, 'utf-8');
    content = content.replace(
      /<h1([^>]*)class="nav-title"([^>]*)>(.*?)<\/h1>/gs,
      '<div$1class="nav-title"$2>$3</div>'
    );

    const h1s = content.match(/<h1[^>]*>.*?<\/h1>/gs) || [];

    if (h1s.length === 0) {
      const h2Match = content.match(/<h2[^>]*>(.*?)<\/h2>/s);
      const h2Text = h2Match ? h2Match[0].trim() : 'NO H2 FOUND';
      console.log(
        `\n[Missing H1] ${file} -> First H2: ${h2Text.substring(0, 100).replace(/\n/g, '')}`
      );
      missingCount++;
    }
  });

  console.log(`\nTotal: ${missingCount} files missing H1.`);
}

run();
