import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const pkg = readJson('package.json');
const lock = readJson('package-lock.json');
const changelog = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8');

if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(pkg.version)) {
  throw new Error(`package.json contains an invalid SemVer version: ${pkg.version}`);
}

if (lock.version !== pkg.version || lock.packages?.['']?.version !== pkg.version) {
  throw new Error('package-lock.json version fields must match package.json');
}

if (!changelog.includes(`## [${pkg.version}]`)) {
  throw new Error(`CHANGELOG.md does not contain a ${pkg.version} release heading`);
}

const releaseTag = process.env.RELEASE_TAG;
if (releaseTag && releaseTag !== `v${pkg.version}`) {
  throw new Error(`release tag ${releaseTag} does not match package version v${pkg.version}`);
}

console.log(`version metadata valid: ${pkg.version}`);
