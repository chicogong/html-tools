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

test('MCP guide preserves card/code presentation and config disclosure at 390px and 1440px', async ({
  page
}) => {
  const errors = collectPageErrors(page);

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 900 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/tools/ai/mcp-guide.html');

    await expect(page.getByRole('heading', { name: 'MCP 配置指南' })).toBeVisible();
    await expect(page.locator('.server-grid')).toHaveCSS('display', 'grid');
    await expect(page.locator('.server-card').first()).toBeVisible();
    await expect(page.locator('.code-block').first()).toBeVisible();
    await expect(page.locator('.server-install').first()).toBeVisible();

    if (viewport.width === 390) {
      const titleAreaGeometry = await page.locator('.title-area').evaluate((titleArea) => {
        const lastContent = titleArea.lastElementChild;
        if (!lastContent) return { hasContent: false, extraHeight: 0 };
        return {
          hasContent: true,
          extraHeight:
            titleArea.getBoundingClientRect().bottom - lastContent.getBoundingClientRect().bottom
        };
      });
      expect(titleAreaGeometry.hasContent).toBe(true);
      expect(titleAreaGeometry.extraHeight).toBeLessThanOrEqual(1);
    }

    const copyStatus = page.getByRole('status');
    await expect(copyStatus).toHaveAttribute('aria-live', 'polite');
    await page.locator('.code-header button').first().click();
    await expect(copyStatus).toHaveText('代码已复制');
    await page.locator('.install-header button').first().click();
    await expect(copyStatus).toHaveText('安装命令已复制');

    const layout = await page.locator('.server-grid').evaluate((grid) => {
      const documentElement = grid.ownerDocument.documentElement;
      const body = grid.ownerDocument.body;
      const cards = Array.from(grid.querySelectorAll('.server-card'), (card) => {
        const rect = card.getBoundingClientRect();
        return { top: rect.top, left: rect.left, right: rect.right };
      });
      return {
        cards,
        gridWidth: grid.getBoundingClientRect().width,
        viewportWidth: documentElement.clientWidth,
        documentWidth: Math.max(documentElement.scrollWidth, body.scrollWidth)
      };
    });

    expect(layout.documentWidth - layout.viewportWidth).toBeLessThanOrEqual(1);
    expect(layout.gridWidth).toBeLessThanOrEqual(layout.viewportWidth);
    const firstRowTop = layout.cards[0].top;
    const firstRowCards = layout.cards.filter((card) => Math.abs(card.top - firstRowTop) < 1);
    expect(firstRowCards).toHaveLength(viewport.width === 390 ? 1 : 3);

    const toggle = page.locator('.config-toggle').first();
    const panel = page.locator('#config-filesystem');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAttribute('aria-controls', 'config-filesystem');
    await expect(panel).toBeHidden();

    await toggle.focus();
    await expect(toggle).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
    await expect(panel).not.toHaveAttribute('hidden', '');

    await page.keyboard.press('Space');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();
  }

  const unsafeLinks = await page
    .locator('a[target="_blank"]')
    .evaluateAll((links) =>
      links.filter((link) => !link.rel.split(/\s+/).includes('noopener')).map((link) => link.href)
    );
  expect(unsafeLinks).toEqual([]);
  expect(errors).toEqual([]);
});

test('MCP guide keeps reduced-motion styles and skip link keyboard focus', async ({ page }) => {
  const errors = collectPageErrors(page);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tools/ai/mcp-guide.html');

  const skipLink = page.getByRole('link', { name: '跳到主要内容' });
  await skipLink.focus();
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();

  const transitionDurationMs = await page
    .locator('.server-card')
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
