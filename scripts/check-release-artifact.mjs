import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const artifactDir = path.resolve(root, process.argv[2] || 'dist');
const requiredFiles = [
  'index.html',
  'manifest.json',
  'sitemap.xml',
  'README.md',
  'README.en.md',
  'LICENSE',
  'NOTICE'
];

const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

for (const name of requiredFiles) {
  const source = path.join(root, name);
  const artifact = path.join(artifactDir, name);
  if (!fs.existsSync(artifact)) {
    throw new Error(`release artifact is missing ${name}`);
  }
  if (sha256(source) !== sha256(artifact)) {
    throw new Error(`release artifact ${name} differs from the repository source`);
  }
}

console.log(`release artifact required files valid: ${requiredFiles.join(', ')}`);
