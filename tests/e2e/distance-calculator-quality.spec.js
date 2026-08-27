import { expect, test } from '@playwright/test';

test('distance calculator presents a clear Beijing to Shanghai result', async ({ page }) => {
  await page.goto('/tools/travel/distance-calculator.html');

  await expect(page).toHaveTitle(/两地距离计算器/);
  await expect(page.getByRole('heading', { name: '两地距离计算器' })).toBeVisible();

  await page.getByLabel('选择起点城市').selectOption('北京');
  await page.getByLabel('选择终点城市').selectOption('上海');
  await page.getByRole('button', { name: '计算距离' }).click();

  const status = page.getByRole('status');
  await expect(status).toBeVisible();
  await expect(status).toBeFocused();
  await expect(page.locator('#resultKm')).toHaveText('1,067.3 公里');
  await expect(page.locator('#resultMiles')).toHaveText('663.2 英里');
  await expect(page.locator('#resultDetails')).toContainText('北京');
  await expect(page.locator('#resultDetails')).toContainText('上海');
});

test('distance calculator stays usable with keyboard at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/tools/travel/distance-calculator.html');

  const widths = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)
  }));
  expect(widths.scroll - widths.client).toBeLessThanOrEqual(1);

  const calculateButton = page.getByRole('button', { name: '计算距离' });
  await calculateButton.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toContainText('请为起点和终点输入有效坐标');
  await expect(page.getByRole('status')).toBeFocused();

  const preset = page.getByRole('button', { name: '北京 → 上海' });
  await preset.focus();
  await expect(preset).toBeFocused();
  await page.keyboard.press('Enter');

  const status = page.getByRole('status');
  await expect(status).toBeFocused();
  await expect(page.locator('#resultKm')).toHaveText('1,067.3 公里');
  await expect(status).toHaveAttribute('aria-live', 'polite');

  await page.getByLabel('起点纬度').fill('999');
  await calculateButton.click();
  await expect(status).toContainText('请为起点和终点输入有效坐标');
});
