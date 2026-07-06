#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const DEFAULT_OUT_DIR = 'dist-standalone';

function usage() {
  console.error('Usage: npm run export:standalone -- <tool-html-path> [output-dir]');
  console.error('Example: npm run export:standalone -- tools/design/aurora-generator.html');
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function isExternalUrl(value) {
  return /^(https?:)?\/\//i.test(value) || /^(data|mailto|tel):/i.test(value);
}

function relativeFromRoot(filePath) {
  return toPosix(path.relative(ROOT, filePath));
}

function isInsideRoot(filePath) {
  const relative = path.relative(ROOT, filePath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function assertInsideRoot(filePath, label) {
  if (!isInsideRoot(filePath)) {
    throw new Error(`Refusing to ${label} outside repository: ${filePath}`);
  }
}

function escapeInlineScript(js) {
  return js.replace(/<\/script/gi, '<\\/script');
}

function escapeInlineStyle(css) {
  return css.replace(/<\/style/gi, '<\\/style');
}

function readFileIfExists(filePath) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    throw new Error(`Missing local dependency: ${relativeFromRoot(filePath)}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function resolveLocalDependency(htmlPath, ref) {
  const localPath = path.resolve(path.dirname(htmlPath), ref);
  assertInsideRoot(localPath, 'inline dependency');
  return localPath;
}

function stripLocalNonEssentialLinks(html, htmlPath) {
  return html.replace(/\s*<link\b([^>]*?)\s*>/gi, (tag, attrs) => {
    const href = attrs.match(/\bhref=["']([^"']+)["']/i)?.[1];
    if (!href || isExternalUrl(href)) return tag;

    const isIcon = /\brel=["'][^"']*(icon|apple-touch-icon)[^"']*["']/i.test(attrs);
    const isManifest = /\brel=["']manifest["']/i.test(attrs);
    if (!isIcon && !isManifest) return tag;

    const localPath = resolveLocalDependency(htmlPath, href);
    const relPath = relativeFromRoot(localPath);
    return `\n    <!-- Standalone export omitted local ${isManifest ? 'manifest' : 'icon'}: ${relPath} -->`;
  });
}

function inlineLocalStylesheets(html, htmlPath) {
  return html.replace(/<link\b([^>]*?)\s*>/gi, (tag, attrs) => {
    const href = attrs.match(/\bhref=["']([^"']+)["']/i)?.[1];
    const rel = attrs.match(/\brel=["']([^"']+)["']/i)?.[1] || '';
    if (!href || isExternalUrl(href) || !/\bstylesheet\b/i.test(rel)) return tag;

    const localPath = resolveLocalDependency(htmlPath, href);
    const css = escapeInlineStyle(readFileIfExists(localPath));
    const relPath = relativeFromRoot(localPath);
    return `<style data-standalone-inlined="${relPath}">\n${css}\n</style>`;
  });
}

function inlineLocalScripts(html, htmlPath) {
  return html.replace(
    /<script\b([^>]*)\bsrc=["']([^"']+)["']([^>]*)>\s*<\/script>/gi,
    (tag, before, src, after) => {
      if (isExternalUrl(src)) return tag;

      const localPath = resolveLocalDependency(htmlPath, src);
      const js = escapeInlineScript(readFileIfExists(localPath));
      const relPath = relativeFromRoot(localPath);
      const attrs = `${before}${after}`
        .replace(/\s*defer\b/gi, '')
        .replace(/\s*async\b/gi, '')
        .trim();
      const attrText = attrs ? ` ${attrs}` : '';
      return `<script${attrText} data-standalone-inlined="${relPath}">\n${js}\n</script>`;
    }
  );
}

function addStandaloneBanner(html, toolPath) {
  const generatedAt = new Date().toISOString();
  const banner = `<!--\n  WebUtils Standalone Tool\n  Source: https://tools.realtime-ai.chat/${toolPath}\n  Generated: ${generatedAt}\n  Privacy: This tool is designed to run locally in your browser.\n  Note: Local shared CSS/JS dependencies are inlined. External CDN resources, if any, remain as external links.\n-->`;

  return html.replace(/^<!doctype html>\s*/i, (doctype) => `${doctype}\n${banner}\n`);
}

function assertRegisteredTool(toolPath) {
  const toolsJsonPath = path.join(ROOT, 'tools.json');
  const data = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf8'));
  const registered = new Set(Object.values(data.tools).map((tool) => tool.path));
  if (!registered.has(toolPath)) {
    throw new Error(`${toolPath} is not registered in tools.json`);
  }
}

function outputPathFor(toolPath, outDir) {
  const baseDir = path.isAbsolute(outDir) ? outDir : path.join(ROOT, outDir);
  return path.join(baseDir, toolPath);
}

const input = process.argv[2];
const outDir = process.argv[3] || DEFAULT_OUT_DIR;

if (!input) {
  usage();
  process.exit(1);
}

const toolPath = toPosix(path.normalize(input));
const htmlPath = path.resolve(ROOT, toolPath);

try {
  assertInsideRoot(htmlPath, 'read tool');
  assertRegisteredTool(toolPath);
  let html = readFileIfExists(htmlPath);
  html = stripLocalNonEssentialLinks(html, htmlPath);
  html = inlineLocalStylesheets(html, htmlPath);
  html = inlineLocalScripts(html, htmlPath);
  html = addStandaloneBanner(html, toolPath);

  const outPath = outputPathFor(toolPath, outDir);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);

  console.log(`✅ Standalone HTML exported: ${toPosix(outPath)}`);
} catch (error) {
  console.error(`❌ ${error.message}`);
  process.exit(1);
}
