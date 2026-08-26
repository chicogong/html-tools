import { expect, test } from '@playwright/test';

test('timestamp converter fits a narrow mobile viewport and converts Unix time', async ({
  page
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/tools/time/timestamp.html');

  const widths = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth
  }));

  expect(widths.scroll).toBe(widths.client);

  await page.getByLabel('输入时间戳').fill('0');
  await page.getByLabel('时间戳单位').selectOption('s');
  await page.getByRole('button', { name: '转换', exact: true }).first().click();

  await expect(page.locator('#resultIso')).toHaveText('1970-01-01T00:00:00.000Z');
  await expect(page.locator('#tsStatus')).toHaveText('转换成功');
});
