import { expect, test } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  await context.route(/^https:\/\//, (route) =>
    route.fulfill({ status: 204, contentType: 'text/plain', body: '' })
  );
});

test('discount calculator uses Chinese discount notation and calculates the final price', async ({
  page
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/tools/calculator/discount-calculator.html');

  await expect(page).toHaveTitle('折扣计算器 - 在线计算折后价与优惠金额 | WebUtils');
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: '🏷️ 在线折扣计算器' })).toBeVisible();

  const originalPrice = page.getByLabel('原价', { exact: true });
  const customDiscount = page.getByLabel('自定义折扣率', { exact: true });
  const discountGroup = page.getByRole('group', { name: '常用折扣' });
  const eightyPercentButton = discountGroup.getByRole('button', { name: '8折', exact: true });

  await expect(originalPrice).toHaveAttribute('name', 'original-price');
  await expect(customDiscount).toHaveAttribute('name', 'custom-discount-rate');
  await expect(eightyPercentButton).toHaveAttribute('type', 'button');

  await originalPrice.fill('100');
  await eightyPercentButton.click();

  await expect(eightyPercentButton).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#discountRate')).toHaveText('80%');
  await expect(page.locator('#finalPrice')).toHaveText('¥80.00');
  await expect(page.locator('#savedAmount')).toHaveText('节省 ¥20.00');
  await expect(page.locator('#actualDiscount')).toHaveText('8');
  await expect(page.locator('#compareList')).toContainText('9.5折');
  await expect(page.locator('#compareList')).toContainText('8折');
  await expect(page.locator('body')).not.toContainText('95折');
  await expect(page.locator('body')).not.toContainText('80折');

  await customDiscount.fill('100');
  await expect(page.locator('#discountRate')).toHaveText('100%');
  await expect(page.locator('#finalPrice')).toHaveText('¥100.00');
  await expect(page.locator('#actualDiscount')).toHaveText('10');
  await expect(discountGroup.locator('[aria-pressed="true"]')).toHaveCount(0);

  await originalPrice.fill('-100');
  await expect(originalPrice).toHaveAttribute('aria-invalid', 'true');
  await expect(
    page.getByRole('alert').filter({ hasText: '请输入大于或等于 0 的原价' })
  ).toBeVisible();
  await expect(page.locator('#finalPrice')).not.toHaveText('¥-100.00');

  await customDiscount.fill('101');
  await expect(customDiscount).toHaveAttribute('aria-invalid', 'true');
  await expect(
    page.getByRole('alert').filter({ hasText: '请输入大于 0 且不超过 100 的折扣率' })
  ).toBeVisible();

  const widths = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)
  }));
  expect(widths.scroll - widths.client).toBeLessThanOrEqual(1);
});

test('discount calculator keeps keyboard focus visible', async ({ page }) => {
  await page.goto('/tools/calculator/discount-calculator');

  await page.getByLabel('原价').focus();
  await expect(page.getByLabel('原价')).toHaveCSS('outline-style', 'solid');

  const discountButton = page.getByRole('button', { name: '9.5折' });
  await discountButton.focus();
  await expect(discountButton).toHaveCSS('outline-style', 'solid');
});
