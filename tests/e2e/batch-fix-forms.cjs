#!/usr/bin/env node
/**
 * Batch Form Usability Fixer
 * Fixes form accessibility issues in tools scoring 75-89
 */

const fs = require('fs');
const path = require('path');

// Load tools that need form usability fixes
const allResults = require('./retest-merged.json');
const toolsNeedingFix = allResults
  .filter(t => t.score >= 75 && t.score < 90)
  .filter(t => t.details && t.details.formUsability < 15);

console.log(`📝 Found ${toolsNeedingFix.length} tools needing form usability fixes\n`);

const fixes = {
  // Fix 1: Add 'for' attribute to labels without it
  addLabelFor: {
    test: (content) => /<label>(?!.*for=)/.test(content),
    apply: (content) => {
      // Match labels followed by inputs and add for/id attributes
      return content.replace(
        /<label>(.*?)<\/label>\s*<input\s+(?!id=)/g,
        (match, labelText) => {
          const id = 'input-' + labelText.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20);
          return `<label for="${id}">${labelText}</label>\n              <input id="${id}" `;
        }
      );
    },
    description: 'Add for/id to label-input pairs'
  },

  // Fix 2: Add aria-label to inputs without labels
  addAriaLabel: {
    test: (content) => /<input\s+[^>]*type="(?:text|number|email|tel|url|search|password|color|date|time)"[^>]*(?!aria-label)/.test(content),
    apply: (content) => {
      return content.replace(
        /<input\s+([^>]*)type="(text|number|email|tel|url|search|password|color|date|time)"([^>]*)>/g,
        (match, before, type, after) => {
          if (match.includes('aria-label')) return match;
          const ariaLabel = type === 'text' ? '文本输入框' :
                          type === 'number' ? '数字输入框' :
                          type === 'email' ? '邮箱输入框' :
                          type === 'tel' ? '电话输入框' :
                          type === 'url' ? 'URL输入框' :
                          type === 'search' ? '搜索框' :
                          type === 'password' ? '密码输入框' :
                          type === 'color' ? '颜色选择器' :
                          type === 'date' ? '日期选择器' : '输入框';
          return `<input ${before}type="${type}"${after} aria-label="${ariaLabel}">`;
        }
      );
    },
    description: 'Add aria-label to inputs'
  },

  // Fix 3: Add placeholder to text inputs
  addPlaceholder: {
    test: (content) => /<input\s+[^>]*type="(?:text|number|email|tel|url|search)"[^>]*(?!placeholder)/.test(content),
    apply: (content) => {
      return content.replace(
        /<input\s+([^>]*)type="(text|number|email|tel|url|search)"([^>]*)>/g,
        (match, before, type, after) => {
          if (match.includes('placeholder')) return match;
          // Extract id or aria-label for context
          const idMatch = match.match(/id="([^"]*)"/);
          const labelMatch = match.match(/aria-label="([^"]*)"/);
          const placeholder = labelMatch ? `请输入${labelMatch[1]}` :
                            idMatch ? `请输入${idMatch[1]}` :
                            type === 'email' ? '请输入邮箱' :
                            type === 'tel' ? '请输入电话' :
                            type === 'url' ? '请输入URL' :
                            type === 'search' ? '请输入搜索内容' :
                            type === 'number' ? '请输入数字' : '请输入';
          return `<input ${before}type="${type}"${after} placeholder="${placeholder}">`;
        }
      );
    },
    description: 'Add placeholder to text inputs'
  },

  // Fix 4: Add aria-label to buttons without text content
  addButtonAriaLabel: {
    test: (content) => /<button\s+[^>]*onclick="[^"]*"(?!.*aria-label)[^>]*>(?:[^<]*<\/button>|[\s\S]*?<\/button>)/.test(content),
    apply: (content) => {
      return content.replace(
        /<button\s+([^>]*)onclick="([^"]*)"([^>]*)>(.*?)<\/button>/g,
        (match, before, onclick, after, innerText) => {
          if (match.includes('aria-label')) return match;
          const text = innerText.replace(/<[^>]*>/g, '').trim();
          if (text.length > 0 && text.length < 50) {
            return `<button ${before}onclick="${onclick}"${after} aria-label="${text}">${innerText}</button>`;
          }
          return match;
        }
      );
    },
    description: 'Add aria-label to buttons'
  }
};

let totalFixed = 0;
const log = [];

toolsNeedingFix.forEach((tool, index) => {
  const filePath = path.join(process.cwd(), tool.path);

  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${tool.path}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  const appliedFixes = [];

  // Apply each fix
  Object.entries(fixes).forEach(([name, fix]) => {
    if (fix.test(content)) {
      content = fix.apply(content);
      appliedFixes.push(fix.description);
    }
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    totalFixed++;
    log.push({
      tool: tool.name,
      path: tool.path,
      score: tool.score,
      fixes: appliedFixes
    });

    if ((index + 1) % 50 === 0) {
      console.log(`Progress: ${index + 1}/${toolsNeedingFix.length} tools processed`);
    }
  }
});

console.log(`\n✅ Fixed ${totalFixed} tools\n`);

// Save log
fs.writeFileSync(
  './tests/e2e/form-fix-log.json',
  JSON.stringify(log, null, 2)
);

console.log(`📋 Fix log saved to: tests/e2e/form-fix-log.json`);

// Summary
console.log(`\n📊 Summary:`);
console.log(`  Total tools analyzed: ${toolsNeedingFix.length}`);
console.log(`  Tools fixed: ${totalFixed}`);
console.log(`  Tools unchanged: ${toolsNeedingFix.length - totalFixed}`);
