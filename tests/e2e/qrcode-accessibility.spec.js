import { expect, test } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  await context.route(/^https:\/\//, (route) =>
    route.fulfill({ status: 204, contentType: 'text/plain', body: '' })
  );
});

test('QR generator exposes labelled controls and a semantic generate button', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tools/generator/qrcode-generator.html');

  const textInput = page.getByLabel('文本或 URL', { exact: true });
  await expect(textInput).toBeVisible();
  await expect(textInput).toHaveAttribute('name', 'qr-text');
  await expect(textInput).toHaveAttribute('autocomplete', 'off');
  await expect(textInput).toHaveAttribute('placeholder', '输入要编码的文本或 URL…');

  const sizeInput = page.getByLabel('二维码大小 (px)', { exact: true });
  await expect(sizeInput).toHaveValue('256');
  await expect(sizeInput).toHaveAttribute('name', 'qr-size');
  await expect(sizeInput).toHaveAttribute('autocomplete', 'off');
  await expect(sizeInput).toHaveAttribute('placeholder', '例如 256');

  const foregroundColor = page.getByLabel('前景色', { exact: true });
  await expect(foregroundColor).toHaveValue('#000000');
  await expect(foregroundColor).toHaveAttribute('name', 'foreground-color');
  await expect(foregroundColor).toHaveAttribute('autocomplete', 'off');

  const backgroundColor = page.getByLabel('背景色', { exact: true });
  await expect(backgroundColor).toHaveValue('#ffffff');
  await expect(backgroundColor).toHaveAttribute('name', 'background-color');
  await expect(backgroundColor).toHaveAttribute('autocomplete', 'off');

  const generateButton = page.getByRole('button', { name: '生成二维码', exact: true });
  await expect(generateButton).toBeVisible();
  await expect(generateButton).toHaveAttribute('type', 'button');
});
