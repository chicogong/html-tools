/**
 * Tools.json validation tests
 * Run: node tests/tools-json.test.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOOLS_JSON_PATH = path.join(__dirname, '..', 'tools.json');

// Test utilities
let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passCount++;
  } catch (e) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${e.message}`);
    failCount++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

// Tests
console.log('\n=== Tools.json Tests ===\n');

let toolsData;

test('tools.json file exists', () => {
  assert(fs.existsSync(TOOLS_JSON_PATH), 'tools.json not found');
});

test('tools.json is valid JSON', () => {
  const content = fs.readFileSync(TOOLS_JSON_PATH, 'utf8');
  toolsData = JSON.parse(content);
  assert(typeof toolsData === 'object', 'Should be an object');
});

test('has categories object', () => {
  assert(toolsData.categories, 'categories object missing');
  assert(typeof toolsData.categories === 'object', 'categories should be an object');
});

test('has tools object', () => {
  assert(toolsData.tools, 'tools object missing');
  assert(typeof toolsData.tools === 'object', 'tools should be an object');
});

test('each category has required fields', () => {
  const categories = toolsData.categories;
  for (const [key, cat] of Object.entries(categories)) {
    assert(cat.name, `Category ${key} missing name`);
    assert(cat.icon, `Category ${key} missing icon`);
    assert(cat.color, `Category ${key} missing color`);
  }
});

test('each tool has required fields', () => {
  const tools = toolsData.tools;
  for (const [key, tool] of Object.entries(tools)) {
    assert(tool.path, `Tool ${key} missing path`);
    assert(tool.name, `Tool ${key} missing name`);
    assert(tool.category, `Tool ${key} missing category`);
    assert(tool.keywords, `Tool ${key} missing keywords`);
    assert(tool.icon, `Tool ${key} missing icon`);
    assert(tool.description, `Tool ${key} missing description`);
  }
});

test('tool categories reference valid categories', () => {
  const categories = Object.keys(toolsData.categories);
  const tools = toolsData.tools;
  for (const [key, tool] of Object.entries(tools)) {
    assert(
      categories.includes(tool.category),
      `Tool ${key} has invalid category: ${tool.category}`
    );
  }
});

test('tool files exist', () => {
  const tools = toolsData.tools;
  const missing = [];
  for (const [key, tool] of Object.entries(tools)) {
    const filePath = path.join(__dirname, '..', tool.path);
    if (!fs.existsSync(filePath)) {
      missing.push(`${key}: ${tool.path}`);
    }
  }
  assert(missing.length === 0, `Missing files:\n  ${missing.join('\n  ')}`);
});

test('tool paths are unique', () => {
  const tools = toolsData.tools;
  const paths = Object.values(tools).map((t) => t.path);
  const uniquePaths = [...new Set(paths)];
  assert(paths.length === uniquePaths.length, 'Duplicate paths found');
});

test('tool IDs are sequential', () => {
  const ids = Object.keys(toolsData.tools).map(Number);
  ids.sort((a, b) => a - b);
  for (let i = 0; i < ids.length; i++) {
    assert(ids[i] === i + 1, `Missing or out of sequence ID around ${ids[i]}`);
  }
});

// Summary
console.log('\n=== Summary ===');
console.log(`Passed: ${passCount}`);
console.log(`Failed: ${failCount}`);
console.log(`Total:  ${passCount + failCount}`);
console.log(`Tools:  ${Object.keys(toolsData.tools).length}`);
console.log(`Categories: ${Object.keys(toolsData.categories).length}`);

process.exit(failCount > 0 ? 1 : 0);
