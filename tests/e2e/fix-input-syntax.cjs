#!/usr/bin/env node
/**
 * Fix Input Tag Syntax Errors
 * Removes incorrect '/ ' before aria-label and placeholder attributes
 * caused by batch-fix-forms.cjs regex bugs
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Fixing input tag syntax errors...\n');

// Find all HTML files
const files = glob.sync('tools/**/*.html');
let fixedCount = 0;
const fixedFiles = [];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  const original = content;

  // Fix: / aria-label → aria-label
  content = content.replace(/\s*\/\s+aria-label=/g, ' aria-label=');

  // Fix: / placeholder → placeholder
  content = content.replace(/\s*\/\s+placeholder=/g, ' placeholder=');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf-8');
    fixedCount++;
    fixedFiles.push(file);
  }
});

console.log(`✅ Fixed ${fixedCount} files with syntax errors\n`);

if (fixedCount > 0) {
  console.log('Sample of fixed files:');
  fixedFiles.slice(0, 10).forEach(f => console.log(`  - ${f}`));
  if (fixedCount > 10) {
    console.log(`  ... and ${fixedCount - 10} more files`);
  }
}
