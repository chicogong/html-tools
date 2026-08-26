import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { section, test, assert, readText, ROOT } from './_harness.js';

section('发布说明');

const pkg = JSON.parse(readText('package.json'));
const script = path.join(ROOT, 'scripts', 'extract-release-notes.mjs');

test(`可提取当前版本 ${pkg.version} 的独立更新日志`, () => {
  const notes = execFileSync(process.execPath, [script, pkg.version], {
    cwd: ROOT,
    encoding: 'utf8'
  });

  assert(notes.includes('### 新增'), '发布说明缺少“新增”段落');
  assert(!notes.includes('## [2.1.0]'), '发布说明不应包含上一版本标题');
  assert(!notes.trimEnd().endsWith('---'), '发布说明不应以 CHANGELOG 分隔线结尾');
});

test('拒绝提取 CHANGELOG 中不存在的版本', () => {
  let rejected = false;
  try {
    execFileSync(process.execPath, [script, '999.0.0'], {
      cwd: ROOT,
      stdio: 'pipe'
    });
  } catch {
    rejected = true;
  }
  assert(rejected, '不存在的版本应返回非零退出码');
});
