import { expect, test } from '@playwright/test';

const countries = [
  ['DE', 22],
  ['FR', 27],
  ['GB', 22],
  ['ES', 24],
  ['IT', 27],
  ['NL', 18],
  ['BE', 16],
  ['CH', 21],
  ['AT', 20],
  ['PL', 28]
];

const knownIbans = [
  ['DE89370400440532013000', 'DE'],
  ['GB82WEST12345698765432', 'GB'],
  ['NL91ABNA0417164300', 'NL']
];

function collectPageErrors(page) {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

async function expectNoHorizontalOverflow(page) {
  const widths = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)
  }));
  expect(widths.scroll - widths.client).toBeLessThanOrEqual(1);
}

function ibanRemainder(iban) {
  let remainder = 0;
  for (const character of iban.slice(4) + iban.slice(0, 4)) {
    const numericValue = /[A-Z]/.test(character) ? character.charCodeAt(0) - 55 : Number(character);
    for (const digit of String(numericValue)) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }
  return remainder;
}

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    const marker = '__iban_generator_e2e_initialized';
    if (!globalThis.sessionStorage.getItem(marker)) {
      globalThis.localStorage.clear();
      globalThis.sessionStorage.setItem(marker, '1');
    }
  });
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], {
    origin: 'http://127.0.0.1:3000'
  });
  await context.route(/^https:\/\//, (route) =>
    route.fulfill({ status: 204, contentType: 'text/plain', body: '' })
  );
});

test('IBAN generator keeps valid checksums and fits narrow layouts', async ({ page }) => {
  const errors = collectPageErrors(page);

  for (const viewport of [
    { width: 320, height: 844 },
    { width: 390, height: 844 },
    { width: 1440, height: 900 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/tools/generator/iban-generator.html');

    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'IBAN 生成器' })).toBeVisible();
    await expect(page.locator('label[for="country"]')).toHaveText('国家/地区');
    await expect(page.locator('label[for="count"]')).toHaveText('生成数量');
    await expect(page.getByLabel('国家/地区')).toHaveAttribute('name', 'country');
    await expect(page.getByLabel('生成数量')).toHaveAttribute('name', 'count');

    await expectNoHorizontalOverflow(page);

    await page.getByLabel('生成数量').fill('-4');
    await page.getByRole('button', { name: '生成 IBAN' }).click();
    await expect(page.getByLabel('生成数量')).toHaveValue('1');
    await page.getByLabel('生成数量').fill('99');
    await page.getByRole('button', { name: '生成 IBAN' }).click();
    await expect(page.getByLabel('生成数量')).toHaveValue('10');
    await page.getByLabel('生成数量').fill('1e2');
    await page.getByRole('button', { name: '生成 IBAN' }).click();
    await expect(page.getByLabel('生成数量')).toHaveValue('10');

    for (const [country, length] of countries) {
      await page.getByLabel('国家/地区').selectOption(country);
      await page.getByRole('button', { name: '生成 IBAN' }).click();
      const iban = await page.locator('#ibanResult').textContent();
      expect(iban).toMatch(new RegExp(`^${country}[A-Z0-9]+$`));
      expect(iban).toHaveLength(length);
      expect(iban).not.toContain('NaN');

      expect(ibanRemainder(iban)).toBe(1);
    }

    await expectNoHorizontalOverflow(page);
  }

  for (const [iban, country] of knownIbans) {
    expect(iban.startsWith(country)).toBe(true);
    expect(ibanRemainder(iban)).toBe(1);
  }

  expect(errors).toEqual([]);
});

test('IBAN generator provides keyboard history and clipboard feedback', async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tools/generator/iban-generator.html');

  const copyButton = page.locator('#copy-iban');
  const countInput = page.getByLabel('生成数量');
  const pageUrl = page.url();
  await countInput.fill('3');
  await countInput.press('Enter');
  await expect(countInput).toHaveValue('3');
  expect(page.url()).toBe(pageUrl);

  const iban = await page.locator('#ibanResult').textContent();
  await copyButton.click();
  await expect(copyButton).toHaveText('已复制');
  await expect(page.getByRole('status')).toHaveText('IBAN已复制');
  const copiedIban = await page.evaluate(() => globalThis.navigator.clipboard.readText());
  expect(copiedIban).toBe(iban);

  await copyButton.dblclick();
  await expect(copyButton).toHaveText('已复制');
  await expect(copyButton).toHaveText('复制');

  const historyButton = page.locator('.history-item').first();
  const historyValue = await historyButton.getAttribute('data-iban');
  await expect(historyButton).toHaveAttribute('type', 'button');
  await historyButton.focus();
  await expect(historyButton).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('IBAN已复制');
  const copiedHistoryIban = await page.evaluate(() => globalThis.navigator.clipboard.readText());
  expect(copiedHistoryIban).toBe(historyValue);

  const originalWriteText = await page.evaluate(() => {
    globalThis.__originalWriteText = globalThis.navigator.clipboard.writeText.bind(
      globalThis.navigator.clipboard
    );
    globalThis.navigator.clipboard.writeText = () => Promise.reject(new Error('clipboard denied'));
    return true;
  });
  expect(originalWriteText).toBe(true);
  await copyButton.click();
  await expect(copyButton).toHaveText('重试');
  await expect(page.getByRole('status')).toHaveText('IBAN复制失败，请重试');
  await expect(copyButton).toHaveClass(/copy-error/);

  await page.evaluate(() => {
    globalThis.navigator.clipboard.writeText = globalThis.__originalWriteText;
  });
  await copyButton.click();
  await expect(copyButton).toHaveText('已复制');
  expect(errors).toEqual([]);
});

test('IBAN generator moves skip-link focus into main and honors reduced motion', async ({
  page
}) => {
  const errors = collectPageErrors(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tools/generator/iban-generator.html');

  const skipLink = page.getByRole('link', { name: '跳到主要内容' });
  await skipLink.focus();
  await expect(skipLink).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();

  const themeButton = page.locator('#tcThemeBtn');
  await expect(themeButton).toBeVisible();
  const initialTheme = await page.locator('html').getAttribute('data-theme');
  const nextTheme = initialTheme === 'light' ? 'dark' : 'light';
  await themeButton.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', nextTheme);
  await expect(themeButton).toHaveAttribute(
    'aria-label',
    nextTheme === 'light' ? '切换到暗色主题' : '切换到亮色主题'
  );
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    'content',
    nextTheme === 'light' ? '#fafafa' : '#0a0a0f'
  );
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', nextTheme);

  const transitionDurationMs = await page
    .locator('.btn')
    .first()
    .evaluate((button) =>
      button.ownerDocument.defaultView
        .getComputedStyle(button)
        .transitionDuration.split(',')
        .reduce((total, duration) => {
          const value = Number.parseFloat(duration);
          if (!Number.isFinite(value)) return total;
          return total + (duration.trim().endsWith('ms') ? value : value * 1000);
        }, 0)
    );
  expect(transitionDurationMs).toBeLessThan(1);
  expect(errors).toEqual([]);
});
