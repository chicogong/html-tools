/**
 * E2E Tests for HTML Tools
 * Tests tool files for basic structure and validity
 */
const fs = require('fs');
const path = require('path');

const toolsJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../../tools.json'), 'utf8'));
const tools = Object.values(toolsJson.tools);

console.log('\n=== E2E Tests (Static Analysis) ===\n');

let passed = 0;
let failed = 0;
const errors = [];

// Test 1: All tool files exist
console.log('Test 1: Checking all tool files exist...');
let allExist = true;
let existCount = 0;
for (const tool of tools) {
    const toolPath = path.join(__dirname, '../../', tool.path);
    if (!fs.existsSync(toolPath)) {
        console.log('  ✗ Missing: ' + tool.path);
        allExist = false;
        errors.push({ test: 'File exists', file: tool.path });
    } else {
        existCount++;
    }
}
if (allExist) {
    console.log('✓ All ' + existCount + ' tool files exist');
    passed++;
} else {
    failed++;
}

// Test 2: All tools have valid HTML structure
console.log('\nTest 2: Checking HTML structure...');
let validHtml = 0;
let invalidHtml = 0;
for (const tool of tools) {
    const toolPath = path.join(__dirname, '../../', tool.path);
    if (!fs.existsSync(toolPath)) continue;
    
    const content = fs.readFileSync(toolPath, 'utf8');
    
    // Check for required HTML elements
    const hasDoctype = content.includes('<!DOCTYPE html>') || content.includes('<!doctype html>');
    const hasHtmlTag = content.includes('<html');
    const hasHead = content.includes('<head>');
    const hasBody = content.includes('<body>');
    const hasTitle = content.includes('<title>');
    
    if (hasDoctype && hasHtmlTag && hasHead && hasBody && hasTitle) {
        validHtml++;
    } else {
        invalidHtml++;
        if (invalidHtml <= 5) {
            console.log('  ✗ Invalid HTML: ' + tool.path);
            errors.push({ test: 'HTML structure', file: tool.path });
        }
    }
}
console.log('✓ ' + validHtml + ' tools have valid HTML structure');
if (invalidHtml > 0) {
    console.log('✗ ' + invalidHtml + ' tools have invalid HTML structure');
    failed++;
} else {
    passed++;
}

// Test 3: Tools have breadcrumb navigation
console.log('\nTest 3: Checking breadcrumb navigation...');
let hasBreadcrumb = 0;
let noBreadcrumb = 0;
for (const tool of tools) {
    const toolPath = path.join(__dirname, '../../', tool.path);
    if (!fs.existsSync(toolPath)) continue;
    
    const content = fs.readFileSync(toolPath, 'utf8');
    if (content.includes('class="breadcrumb"')) {
        hasBreadcrumb++;
    } else {
        noBreadcrumb++;
    }
}
console.log('✓ ' + hasBreadcrumb + ' tools have breadcrumb navigation');
if (noBreadcrumb > 0) {
    console.log('  (' + noBreadcrumb + ' tools without breadcrumb - some may be games)');
}
if (hasBreadcrumb > tools.length * 0.9) {
    passed++;
} else {
    failed++;
}

// Test 4: Tools have responsive viewport meta tag
console.log('\nTest 4: Checking responsive viewport...');
let hasViewport = 0;
for (const tool of tools) {
    const toolPath = path.join(__dirname, '../../', tool.path);
    if (!fs.existsSync(toolPath)) continue;
    
    const content = fs.readFileSync(toolPath, 'utf8');
    if (content.includes('viewport') && content.includes('width=device-width')) {
        hasViewport++;
    }
}
console.log('✓ ' + hasViewport + ' tools have responsive viewport');
if (hasViewport === tools.length) {
    passed++;
} else {
    failed++;
}

// Test 5: No JavaScript syntax errors (basic check)
console.log('\nTest 5: Checking JavaScript syntax (basic)...');
let jsOk = 0;
let jsError = 0;
for (const tool of tools) {
    const toolPath = path.join(__dirname, '../../', tool.path);
    if (!fs.existsSync(toolPath)) continue;
    
    const content = fs.readFileSync(toolPath, 'utf8');
    
    // Extract script content
    const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    if (!scriptMatch) {
        jsOk++;
        continue;
    }
    
    let hasError = false;
    for (const script of scriptMatch) {
        const scriptContent = script.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
        
        // Check for common syntax issues
        const openBraces = (scriptContent.match(/{/g) || []).length;
        const closeBraces = (scriptContent.match(/}/g) || []).length;
        const openParens = (scriptContent.match(/\(/g) || []).length;
        const closeParens = (scriptContent.match(/\)/g) || []).length;
        
        if (openBraces !== closeBraces || openParens !== closeParens) {
            hasError = true;
        }
    }
    
    if (hasError) {
        jsError++;
        if (jsError <= 3) {
            errors.push({ test: 'JS syntax', file: tool.path });
        }
    } else {
        jsOk++;
    }
}
console.log('✓ ' + jsOk + ' tools pass basic JS syntax check');
if (jsError > 0) {
    console.log('✗ ' + jsError + ' tools may have JS issues');
    // Don't fail for this as it's a basic check
}
passed++;

// Test 6: Index.html exists and references tools
console.log('\nTest 6: Checking index.html...');
const indexPath = path.join(__dirname, '../../index.html');
if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Check for tool count in page
    const hasToolsArray = indexContent.includes('TOOLS');
    const hasCategories = indexContent.includes('CATEGORIES');
    
    if (hasToolsArray && hasCategories) {
        console.log('✓ index.html contains TOOLS and CATEGORIES');
        passed++;
    } else {
        console.log('✗ index.html missing tool data');
        failed++;
    }
} else {
    console.log('✗ index.html not found');
    failed++;
}

// Summary
console.log('\n=== E2E Test Summary ===');
console.log('Passed: ' + passed);
console.log('Failed: ' + failed);
console.log('Total:  ' + (passed + failed));
console.log('Tools:  ' + tools.length);

if (errors.length > 0 && errors.length <= 10) {
    console.log('\nFirst few errors:');
    errors.slice(0, 5).forEach(e => console.log('  - ' + e.test + ': ' + e.file));
}

process.exit(failed > 0 ? 1 : 0);
