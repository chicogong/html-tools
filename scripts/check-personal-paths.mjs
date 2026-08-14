import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const allowedUsers = new Set([
  'alice',
  'bob',
  'example',
  'me',
  'user',
  'username',
  'you',
  'yourname'
]);
const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean);
const findings = [];

for (const file of files) {
  const stat = fs.statSync(file);
  if (stat.size > 2_000_000) continue;
  const content = fs.readFileSync(file);
  if (content.includes(0)) continue;

  const lines = content.toString('utf8').split('\n');
  lines.forEach((line, index) => {
    const matches = [
      ...line.matchAll(/\/Users\/([A-Za-z0-9._-]+)(?=\/)/g),
      ...line.matchAll(/\/home\/([A-Za-z0-9._-]+)(?=\/)/g),
      ...line.matchAll(/[A-Za-z]:\\Users\\([^\\\s"'<>]+)/g)
    ];
    if (matches.some((match) => !allowedUsers.has(match[1].toLowerCase()))) {
      findings.push(`${file}:${index + 1}: non-placeholder personal home path`);
    }
  });
}

if (findings.length > 0) {
  console.error(findings.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`tracked personal path scan passed (${files.length} files)`);
}
