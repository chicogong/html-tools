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
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], {
    origin: 'http://127.0.0.1:3000'
  });
  await context.route(/^https:\/\//, (route) =>
    route.fulfill({ status: 204, contentType: 'text/plain', body: '' })
  );
});

test('MCP 客户端目录保持卡片、分类和推荐资源布局', async ({ page }) => {
  const errors = collectPageErrors(page);

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 900 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/tools/ai/mcp-clients.html');

    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'MCP 客户端大全' })).toBeVisible();
    await expect(page.locator('.category')).toHaveCount(4);
    await expect(page.locator('.client-card').first()).toBeVisible();
    await expect(page.locator('.resources')).toBeVisible();
    await expect(page.locator('.resource-item').first()).toBeVisible();

    const gridLayouts = await page.locator('.client-grid').evaluateAll((grids) => {
      const documentElement = grids[0].ownerDocument.documentElement;
      const body = grids[0].ownerDocument.body;
      return grids.map((grid) => {
        const cards = Array.from(grid.querySelectorAll('.client-card'), (card) => {
          const rect = card.getBoundingClientRect();
          return { top: rect.top, left: rect.left, right: rect.right };
        });
        const firstRowTop = cards[0]?.top;
        return {
          cards,
          firstRowCount: cards.filter((card) => Math.abs(card.top - firstRowTop) < 1).length,
          gridWidth: grid.getBoundingClientRect().width,
          viewportWidth: documentElement.clientWidth,
          documentWidth: Math.max(documentElement.scrollWidth, body.scrollWidth)
        };
      });
    });

    expect(gridLayouts).toHaveLength(4);
    for (const layout of gridLayouts) {
      expect(layout.documentWidth - layout.viewportWidth).toBeLessThanOrEqual(1);
      expect(layout.gridWidth).toBeLessThanOrEqual(layout.viewportWidth);
      expect(layout.firstRowCount).toBe(
        viewport.width === 390 ? 1 : Math.min(layout.cards.length, 3)
      );
    }

    const resourceLayout = await page.locator('.resource-grid').evaluate((grid) => {
      const items = Array.from(grid.querySelectorAll('.resource-item'), (item) => {
        const rect = item.getBoundingClientRect();
        return { top: rect.top, left: rect.left, right: rect.right };
      });
      const firstRowTop = items[0]?.top;
      const documentElement = grid.ownerDocument.documentElement;
      const body = grid.ownerDocument.body;
      return {
        itemCount: items.length,
        firstRowCount: items.filter((item) => Math.abs(item.top - firstRowTop) < 1).length,
        gridWidth: grid.getBoundingClientRect().width,
        viewportWidth: documentElement.clientWidth,
        documentWidth: Math.max(documentElement.scrollWidth, body.scrollWidth)
      };
    });
    expect(resourceLayout.itemCount).toBeGreaterThan(1);
    if (viewport.width === 390) {
      expect(resourceLayout.firstRowCount).toBe(1);
    } else {
      expect(resourceLayout.firstRowCount).toBeGreaterThan(1);
    }
    expect(resourceLayout.documentWidth - resourceLayout.viewportWidth).toBeLessThanOrEqual(1);
    expect(resourceLayout.gridWidth).toBeLessThanOrEqual(resourceLayout.viewportWidth);

    const commandWidths = await page.locator('.install-cmd').evaluateAll((commands) =>
      commands.map((command) => ({
        clientWidth: command.clientWidth,
        scrollWidth: command.scrollWidth,
        textLength: command.textContent.trim().length
      }))
    );
    for (const command of commandWidths.filter((command) => command.textLength > 40)) {
      expect(command.scrollWidth - command.clientWidth).toBeLessThanOrEqual(1);
    }
  }

  const unsafeLinks = await page
    .locator('a[target="_blank"]')
    .evaluateAll((links) =>
      links.filter((link) => !link.rel.split(/\s+/).includes('noopener')).map((link) => link.href)
    );
  expect(unsafeLinks).toEqual([]);
  expect(errors).toEqual([]);
});

test('MCP 客户端复制控件写入剪贴板并支持失败重试与连续点击', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tools/ai/mcp-clients.html');

  const copyButton = page.locator('.install-header button').first();
  const status = page.getByRole('status');
  const expectedText = await copyButton.evaluate(
    (button) => button.closest('.install-block').querySelector('.install-cmd').textContent
  );

  await copyButton.click();
  await expect(copyButton).toHaveText('已复制');
  await expect(status).toHaveText('配置文件路径已复制');
  expect(await page.evaluate(() => globalThis.navigator.clipboard.readText())).toBe(
    expectedText.trim()
  );

  await copyButton.dblclick();
  await expect(copyButton).toHaveText('已复制');
  await expect(copyButton).toHaveAttribute('data-original-label', '复制');
  await expect(copyButton).toHaveText('复制', { timeout: 3000 });

  await page.evaluate(() => {
    globalThis.__originalClipboardWriteText = globalThis.navigator.clipboard.writeText.bind(
      globalThis.navigator.clipboard
    );
    Object.defineProperty(globalThis.navigator.clipboard, 'writeText', {
      configurable: true,
      value: () => Promise.reject(new Error('clipboard denied'))
    });
  });
  await copyButton.click();
  await expect(copyButton).toHaveText('重试');
  await expect(copyButton).toHaveClass(/copy-error/);
  await expect(status).toContainText('复制失败');
  await expect(copyButton).toBeVisible();

  await page.evaluate(() => {
    Object.defineProperty(globalThis.navigator.clipboard, 'writeText', {
      configurable: true,
      value: globalThis.__originalClipboardWriteText
    });
    delete globalThis.__originalClipboardWriteText;
  });
  await copyButton.click();
  await expect(copyButton).toHaveText('已复制');
  await expect(status).toHaveText('配置文件路径已复制');
  expect(await page.evaluate(() => globalThis.navigator.clipboard.readText())).toBe(
    expectedText.trim()
  );

  expect(errors).toEqual([]);
});

test('MCP 客户端目录支持 skip link、键盘焦点和 reduced motion', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tools/ai/mcp-clients.html');

  const skipLink = page.getByRole('link', { name: '跳到主要内容' });
  await skipLink.focus();
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();

  const transitionDurationMs = await page
    .locator('.client-card')
    .first()
    .evaluate((card) =>
      card.ownerDocument.defaultView
        .getComputedStyle(card)
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
