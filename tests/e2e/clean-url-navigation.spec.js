import path from 'path';
import { pathToFileURL } from 'url';
import http from 'http';
import { expect, test } from '@playwright/test';

test('homepage and category cards use clean URLs over HTTP', async ({ page }) => {
  await page.goto('/');

  const homepageCard = page.getByRole('link', { name: /JSON 格式化/ }).first();
  await expect(homepageCard).toHaveAttribute('href', 'tools/dev/json-formatter');
  await homepageCard.click();
  await expect(page).toHaveURL(/\/tools\/dev\/json-formatter$/);
  await expect(page.getByRole('heading', { level: 1, name: 'JSON 格式化' })).toBeVisible();

  await page.goto('/tools/dev/');
  const categoryCard = page.locator('.cat-card').first();
  const categoryCardName = (await categoryCard.locator('.cat-card-name').textContent()).trim();
  await expect(categoryCard).not.toHaveAttribute('href', /\.html$/);
  await categoryCard.click();
  await expect(page).not.toHaveURL(/\.html$/);
  await expect(page.getByRole('heading', { level: 1, name: categoryCardName })).toBeVisible();
});

test('development server resolves clean URLs whose slugs contain dots', async ({ page }) => {
  for (const pathname of [
    '/tools/ai/doubao-1.8-guide',
    '/tools/ai/gemini-2.5-pro-guide',
    '/tools/ai/wanxiang-2.6-guide'
  ]) {
    const response = await page.goto(pathname);
    expect(response.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
  }
});

test('direct file mode keeps physical HTML navigation', async ({ page }) => {
  const homepageFile = pathToFileURL(path.resolve('index.html')).href;
  await page.goto(homepageFile);

  const card = page.getByRole('link', { name: /JSON 格式化/ }).first();
  await expect(card).toHaveAttribute('href', 'tools/dev/json-formatter.html');
  await card.click();
  await expect(page).toHaveURL(/\/tools\/dev\/json-formatter\.html$/);
  await expect(page.getByRole('heading', { level: 1, name: 'JSON 格式化' })).toBeVisible();

  const home = page.getByRole('link', { name: '返回全部工具' });
  await expect(home).toHaveAttribute('href', /index\.html$/);
});

test('development server rejects malformed URL encoding without crashing', async ({ page }) => {
  const status = await new Promise((resolve, reject) => {
    const request = http.get(
      {
        hostname: '127.0.0.1',
        port: Number(process.env.PORT || 3000),
        path: '/%E0%A4%A'
      },
      (response) => {
        response.resume();
        response.on('end', () => resolve(response.statusCode));
      }
    );
    request.on('error', reject);
  });

  expect(status).toBe(400);
  await page.goto('/');
  await expect(page).toHaveTitle(/WebUtils/);
});
