import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = process.argv[2] || pkg.version;
const changelog = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8');
const headings = [...changelog.matchAll(/^## \[([^\]]+)\][^\n]*$/gm)];
const headingIndex = headings.findIndex((match) => match[1] === version);

if (headingIndex === -1) {
  throw new Error(`CHANGELOG.md does not contain release notes for ${version}`);
}

const start = headings[headingIndex].index + headings[headingIndex][0].length;
const end = headings[headingIndex + 1]?.index ?? changelog.length;
const notes = changelog
  .slice(start, end)
  .replace(/^\s+|\s+$/g, '')
  .replace(/\n---\s*$/, '');

if (!notes) {
  throw new Error(`CHANGELOG.md release notes for ${version} are empty`);
}

process.stdout.write(`${notes}\n`);
