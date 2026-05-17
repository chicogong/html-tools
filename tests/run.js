#!/usr/bin/env node
/**
 * 测试入口：依次加载 tests/ 下所有 *.test.js（每个文件在被 import 时执行其用例），
 * 输出汇总，并以退出码反映结果（0 = 全部通过，1 = 有失败）。
 *
 * 用法: npm test
 */

import { summary, section } from './_harness.js';

const TEST_FILES = [
  'tools-json.test.js',
  'data-quality.test.js',
  'sync.test.js',
  'html-structure.test.js',
  'redirects.test.js',
  'assets.test.js'
];

let crashed = 0;

for (const file of TEST_FILES) {
  try {
    await import('./' + file);
  } catch (e) {
    crashed++;
    section(`致命错误: ${file}`);
    console.log('  ✗ 该测试文件在加载阶段抛错，未能执行');
    console.log('    ' + (e && e.stack ? e.stack : String(e)));
  }
}

const failCount = summary();
process.exit(failCount > 0 || crashed > 0 ? 1 : 0);
