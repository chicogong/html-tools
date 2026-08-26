import { Buffer } from 'node:buffer';
import { expect, test } from '@playwright/test';

function collectPageErrors(page) {
  const errors = [];

  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  return errors;
}

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => localStorage.clear());
  await context.route(/^https:\/\//, (route) =>
    route.fulfill({ status: 204, contentType: 'text/plain', body: '' })
  );
});

test('homepage discovery, favorites, and recent tools work', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/');

  const search = page.locator('#search');
  await search.fill('JSON');
  await expect(page.locator('.tool-card', { hasText: 'JSON 格式化' })).toBeVisible();
  await expect(page.locator('.tool-card[href="tools/time/timestamp.html"]')).toBeHidden();
  await search.fill('');

  await page.locator('.category-btn[data-category="dev"]').click();
  await expect(page).toHaveURL(/\?category=dev$/);

  const jsonCard = page.locator('.tool-card[href="tools/dev/json-formatter.html"]');
  const favoriteButton = jsonCard.locator('.favorite-btn');
  await favoriteButton.focus();
  await page.keyboard.press('Enter');
  await expect(favoriteButton).toHaveClass(/active/);
  await expect
    .poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('html_tools_favorites_v1'))))
    .toContain('tools/dev/json-formatter.html');

  await jsonCard.click({ position: { x: 32, y: 72 } });
  await expect(page).toHaveURL(/tools\/dev\/json-formatter\.html$/);
  await expect
    .poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('html_tools_recents_v1'))?.[0]))
    .toBe('tools/dev/json-formatter.html');

  expect(errors).toEqual([]);
});

test('representative calculator works without browser errors', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/tools/calculator/tip-calculator.html');
  await page.getByLabel('账单金额').fill('100');
  await page.getByRole('button', { name: '增加人数' }).click();

  await expect(page.locator('#perPerson')).toHaveText('¥57.50');
  await expect(page.getByRole('link', { name: '返回全部工具' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('JSON formatter exposes labeled controls and formats input', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/tools/dev/json-formatter.html');
  await page.getByLabel('输入').fill('{"name":"WebUtils","active":true}');
  await page.getByLabel('缩进:').selectOption('4');
  await page.getByRole('button', { name: '格式化' }).click();

  await expect(page.getByLabel('输出')).toHaveValue(
    '{\n    "name": "WebUtils",\n    "active": true\n}'
  );
  await expect(page.getByRole('status')).toHaveText('格式化成功');

  await page.getByLabel('输入').fill('{"name":}');
  await page.getByRole('button', { name: '校验' }).click();
  const errorDetail = page.locator('#errorDetail');
  await expect(errorDetail).toBeVisible();
  const errorText = await errorDetail.textContent();
  expect(errorText).toBeTruthy();
  await expect(page.locator('#errorAnnouncement')).toHaveText(errorText);
  expect(errors).toEqual([]);
});

test('timestamp converter exposes labeled controls and converts Unix time', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/tools/time/timestamp.html');
  await page.getByLabel('输入时间戳').fill('0');
  await page.getByLabel('时间戳单位').selectOption('s');
  await page.getByRole('button', { name: '转换', exact: true }).first().click();

  await expect(page.locator('#resultIso')).toHaveText('1970-01-01T00:00:00.000Z');
  await expect(page.locator('#tsStatus')).toHaveText('转换成功');
  expect(errors).toEqual([]);
});

test('URL codec exposes semantic controls and encodes input', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/tools/dev/url-codec.html');
  await expect(page.getByRole('group', { name: '编码模式' })).toBeVisible();
  await page.getByLabel('输入').fill('https://example.com/路径?q=你好');
  await page.getByRole('button', { name: '编码', exact: true }).click();

  await expect(page.getByLabel('输出')).toHaveValue(
    'https%3A%2F%2Fexample.com%2F%E8%B7%AF%E5%BE%84%3Fq%3D%E4%BD%A0%E5%A5%BD'
  );
  await expect(page.locator('#status')).toHaveText('编码成功');

  await page.getByRole('button', { name: '解析 URL' }).click();
  await expect(page.getByRole('table', { name: 'URL 解析结果' })).toBeVisible();
  await expect(page.locator('#urlHost')).toHaveText('example.com');
  expect(errors).toEqual([]);
});

test('Base64 tool encodes Unicode text and local files', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.goto('/tools/dev/base64.html');
  const input = page.getByLabel('输入');
  await input.fill('你好，WebUtils');
  await page.getByRole('button', { name: '编码 (Text → Base64)' }).click();
  await expect(page.getByLabel('输出')).toHaveValue('5L2g5aW977yMV2ViVXRpbHM=');

  await input.fill('5L2g5aW977yMV2ViVXRpbHM=');
  await page.getByRole('button', { name: '解码 (Base64 → Text)' }).click();
  await expect(page.getByLabel('输出')).toHaveValue('你好，WebUtils');

  const bomText = '\uFEFFhello';
  await input.fill(bomText);
  await page.getByRole('button', { name: '编码 (Text → Base64)' }).click();
  await expect(page.getByLabel('输出')).toHaveValue('77u/aGVsbG8=');
  await input.fill('77u/aGVsbG8=');
  await page.getByRole('button', { name: '解码 (Base64 → Text)' }).click();
  await expect(page.getByLabel('输出')).toHaveValue(bomText);

  await page.getByLabel('选择文件').setInputFiles({
    name: 'hello.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('hello')
  });
  await expect(page.getByLabel('输出')).toHaveValue('aGVsbG8=');
  await expect(page.locator('#fileName')).toContainText('hello.txt');
  await expect(page.locator('#status')).toContainText('文件编码成功');
  expect(errors).toEqual([]);
});

test('homepage has no horizontal overflow on a mobile viewport', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const widths = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth
  }));

  expect(widths.scroll).toBe(widths.client);
  expect(errors).toEqual([]);
});
