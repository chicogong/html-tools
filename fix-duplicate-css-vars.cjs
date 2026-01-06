#!/usr/bin/env node

/**
 * Fix duplicate CSS variable definitions
 * Removes duplicate --color-bg-surface and --font-mono definitions
 */

const fs = require('fs');
const path = require('path');

// Files with duplicate --color-bg-surface
const filesWithDuplicateBgSurface = [
  'tools/calculator/bmi-calculator.html',
  'tools/calculator/loan-calculator.html',
  'tools/calculator/percentage-calculator.html',
  'tools/calculator/unit-converter.html',
  'tools/dev/base64.html',
  'tools/dev/clipboard-viewer.html',
  'tools/dev/hash-generator.html',
  'tools/dev/json-formatter.html',
  'tools/dev/json-yaml.html',
  'tools/dev/jwt-decoder.html',
  'tools/dev/regex-tester.html',
  'tools/dev/url-codec.html',
  'tools/generator/password-generator.html',
  'tools/generator/qrcode-generator.html',
  'tools/generator/uuid-generator.html',
  'tools/health/alcohol-metabolism.html',
  'tools/health/bac-calculator.html',
  'tools/health/blood-pressure.html',
  'tools/health/body-fat.html',
  'tools/health/calorie-burn-calculator.html',
  'tools/health/calorie-calculator.html',
  'tools/health/hearing-test.html',
  'tools/media/image-compressor.html',
  'tools/media/image-resize.html',
  'tools/media/svg-render.html',
  'tools/privacy/file-hash.html',
  'tools/privacy/log-masker.html',
  'tools/text/case-converter.html',
  'tools/text/markdown-preview.html',
  'tools/text/text-diff.html',
  'tools/text/word-counter.html',
  'tools/time/new-year-countdown.html',
  'tools/time/timestamp.html',
  'tools/time/timezone-converter.html',
];

// Files with duplicate --font-mono
const filesWithDuplicateFontMono = [
  'tools/media/svg-placeholder.html',
  'tools/privacy/encrypt-decrypt.html',
];

console.log('🔧 Fixing duplicate CSS variable definitions...\n');

let totalFixed = 0;

// Fix duplicate --color-bg-surface
filesWithDuplicateBgSurface.forEach(file => {
  const filePath = path.join(__dirname, file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Remove first duplicate in :root (keep the second value)
  content = content.replace(
    /(:root\s*\{[\s\S]*?)(--color-bg-surface:\s*#[a-f0-9]{6};\s*\n\s*--color-bg-surface:\s*#[a-f0-9]{6};)/i,
    (match, prefix, duplicates) => {
      // Extract both values
      const matches = duplicates.match(/--color-bg-surface:\s*(#[a-f0-9]{6});/gi);
      if (matches && matches.length === 2) {
        // Keep only the second value
        const secondValue = matches[1];
        return prefix + secondValue;
      }
      return match;
    }
  );

  // Remove second duplicate in [data-theme="light"] (keep the second value)
  content = content.replace(
    /(\[data-theme="light"\]\s*\{[\s\S]*?)(--color-bg-surface:\s*#[a-f0-9]{3,6};\s*\n\s*--color-bg-surface:\s*#[a-f0-9]{3,6};)/i,
    (match, prefix, duplicates) => {
      // Extract both values
      const matches = duplicates.match(/--color-bg-surface:\s*(#[a-f0-9]{3,6});/gi);
      if (matches && matches.length === 2) {
        // Keep only the second value
        const secondValue = matches[1];
        return prefix + secondValue;
      }
      return match;
    }
  );

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${file}`);
    totalFixed++;
  } else {
    console.log(`⏭️  Skipped (no changes): ${file}`);
  }
});

// Fix duplicate --font-mono
filesWithDuplicateFontMono.forEach(file => {
  const filePath = path.join(__dirname, file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Remove first duplicate --font-mono (keep the second value)
  content = content.replace(
    /(--font-mono:\s*[^;]+;\s*\n\s*--font-mono:\s*[^;]+;)/,
    (match) => {
      // Extract both values
      const matches = match.match(/--font-mono:\s*([^;]+);/g);
      if (matches && matches.length === 2) {
        // Keep only the second value
        return matches[1];
      }
      return match;
    }
  );

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${file}`);
    totalFixed++;
  } else {
    console.log(`⏭️  Skipped (no changes): ${file}`);
  }
});

console.log(`\n✨ Fixed ${totalFixed} files!`);
console.log('🔍 Run "npm run lint:css" to verify...\n');
