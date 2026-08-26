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
