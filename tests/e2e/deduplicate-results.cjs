#!/usr/bin/env node

/**
 * Deduplicate Enhanced Report Results
 * Removes duplicate entries and keeps only the latest test result for each tool
 */

const fs = require('fs');
const path = require('path');

const ENHANCED_REPORT_PATH = path.join(__dirname, 'enhanced-report.json');
const DEDUPLICATED_PATH = path.join(__dirname, 'enhanced-report-clean.json');

console.log('📊 Deduplicating E2E test results...\n');

// Load existing results
const results = JSON.parse(fs.readFileSync(ENHANCED_REPORT_PATH, 'utf8'));
console.log(`Original entries: ${results.length}`);

// Deduplicate by path, keeping the latest (last) occurrence
const deduplicatedMap = new Map();

results.forEach(result => {
  if (result.path) {
    // Keep the latest occurrence (overwrite previous)
    deduplicatedMap.set(result.path, result);
  }
});

// Convert back to array and sort by path
const deduplicated = Array.from(deduplicatedMap.values())
  .sort((a, b) => a.path.localeCompare(b.path));

console.log(`Deduplicated entries: ${deduplicated.length}`);

// Count success/failure
const successful = deduplicated.filter(r => r.scores && r.scores.overall > 0);
const failed = deduplicated.filter(r => !r.scores || r.scores.overall === 0);

console.log(`✅ Successfully tested: ${successful.length}`);
console.log(`❌ Failed: ${failed.length}`);

// Save deduplicated results
fs.writeFileSync(DEDUPLICATED_PATH, JSON.stringify(deduplicated, null, 2));
console.log(`\n✅ Clean results saved to: ${DEDUPLICATED_PATH}`);

// Calculate average score
if (successful.length > 0) {
  const avgScore = successful.reduce((sum, r) => sum + r.scores.overall, 0) / successful.length;
  console.log(`📈 Average score: ${avgScore.toFixed(2)}/100\n`);
}
