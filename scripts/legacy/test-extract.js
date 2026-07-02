import fs from 'fs';
import * as cheerio from 'cheerio';

function extractTool(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  // Extract specific styles (ignore tool-base.css or google fonts)
  let styles = '';
  $('style').each((i, el) => {
    styles += $(el).html() + '\n';
  });

  // Extract body content
  let bodyContent = '';
  const main = $('main.tool-main');
  if (main.length > 0) {
    bodyContent = main.html();
  } else {
    // PR 152 style: usually has a <div class="container">
    const container = $('body > .container, body > .cat-main, body > main');
    if (container.length > 0) {
      bodyContent = container.html();
    } else {
      // Fallback: get everything in body except scripts and a tags with fixed style (PR 152 back button)
      $('body > script').remove();
      $('body > a[href="../../index.html"]').remove();
      $('body > header.site-header').remove();
      $('body > footer.site-footer').remove();
      bodyContent = $('body').html();
    }
  }

  // Extract specific scripts (ignore tool-chrome.js, umami, theme init)
  let scripts = '';
  $('script:not([src])').each((i, el) => {
    let scriptContent = $(el).html();
    if (
      !scriptContent.includes('application/ld+json') &&
      !scriptContent.includes('const prefersDark') &&
      !scriptContent.includes('umami.track')
    ) {
      scripts += scriptContent + '\n';
    }
  });

  console.log('--- ' + filePath + ' ---');
  console.log('STYLE LENGTH:', styles.length);
  console.log('BODY LENGTH:', bodyContent.trim().length);
  console.log('SCRIPT LENGTH:', scripts.length);
}

extractTool('tools/dev/base64.html');
extractTool('tools/astronomy/stargazing-tonight.html');
