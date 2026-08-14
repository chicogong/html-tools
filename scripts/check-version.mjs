import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const pkg = readJson('package.json');
const lock = readJson('package-lock.json');
const changelog = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8');
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(pkg.version)) {
  throw new Error(`package.json contains an invalid SemVer version: ${pkg.version}`);
}

if (lock.version !== pkg.version || lock.packages?.['']?.version !== pkg.version) {
  throw new Error('package-lock.json version fields must match package.json');
}

const changelogVersions = [...changelog.matchAll(/^## \[([^\]]+)\]/gm)].map(
  (match) => match[1]
);
const matchingHeadings = changelogVersions.filter((version) => version === pkg.version);

if (matchingHeadings.length === 0) {
  throw new Error(`CHANGELOG.md does not contain a ${pkg.version} release heading`);
}
if (matchingHeadings.length > 1) {
  throw new Error(`CHANGELOG.md contains duplicate ${pkg.version} release headings`);
}
if (changelogVersions[0] !== pkg.version) {
  throw new Error(
    `package version ${pkg.version} is not the newest CHANGELOG.md release (${changelogVersions[0]})`
  );
}
if (!indexHtml.includes(`"softwareVersion": "${pkg.version}"`)) {
  throw new Error(`index.html softwareVersion must match package version ${pkg.version}`);
}

const releaseTag = process.env.RELEASE_TAG;
if (releaseTag && releaseTag !== `v${pkg.version}`) {
  throw new Error(`release tag ${releaseTag} does not match package version v${pkg.version}`);
}

console.log(`version metadata valid: ${pkg.version}`);
