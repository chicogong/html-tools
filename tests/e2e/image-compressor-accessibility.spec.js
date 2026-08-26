import { Buffer } from 'node:buffer';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => localStorage.clear());
  await context.route(/^https:\/\//, (route) =>
    route.fulfill({ status: 204, contentType: 'text/plain', body: '' })
  );
});

test('image compressor upload control is keyboard accessible', async ({ page }) => {
  await page.goto('/tools/media/image-compressor.html');

  const uploadButton = page.getByRole('button', { name: /点击或拖拽图片到这里/ });
  await expect(uploadButton).toBeVisible();
  await expect(uploadButton).toHaveAttribute('type', 'button');

  const fileInput = page.getByLabel('选择图片文件');
  await expect(fileInput).toHaveAttribute('name', 'image-file');
  await expect(fileInput).toHaveAttribute('accept', 'image/*');

  await uploadButton.focus();
  await expect(uploadButton).toBeFocused();

  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    uploadButton.press('Enter')
  ]);
  await fileChooser.setFiles({
    name: 'keyboard-upload.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
      'base64'
    )
  });

  await expect(page.locator('#previewArea')).toBeVisible();
  await expect(page.locator('#originalFormat')).toHaveText('PNG');
  await expect(page.locator('#uploadArea')).toBeHidden();
});
