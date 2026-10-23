import { expect, test } from '@playwright/test';

test.describe('data display', () => {
  test('renders shell, table, and status badges', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/data');

    const shell = page.locator('jp-app-shell');
    const table = page.locator('jp-table');
    const badge = page.locator('jp-table jp-badge').first();

    await expect(shell).toBeVisible();
    await expect(page.locator('h1')).toContainText('Game 6 roster');
    await expect(table).toBeVisible();
    await expect(page.locator('caption')).toContainText('Rays roster');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('Starter');
  });

  test('filters availability and keeps the embedded table readable on a phone', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/data');
    const table = page.getByRole('table', { name: 'Rays roster' });
    await expect(table.getByRole('row')).toHaveCount(5);
    await page
      .getByRole('button', { name: 'Show starters', exact: true })
      .click();
    await expect(table.getByRole('row')).toHaveCount(4);
    await expect(
      table.getByRole('cell', { name: /Freddy Peralta/ }),
    ).toBeVisible();
    await expect(table.getByRole('cell', { name: /Bryan Baker/ })).toHaveCount(
      0,
    );
    await expect(page.getByRole('status')).toHaveText('Game 6 starters');
    await page.getByRole('button', { name: 'Show all players' }).click();
    await expect(table.getByRole('cell', { name: /Yandy Díaz/ })).toBeVisible();
    await expect(
      page.getByRole('region', { name: 'Rays roster' }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);

    await page.setViewportSize({ width: 320, height: 844 });
    const positionLines = await page
      .locator('.roster-page__detail', { hasText: 'Shortstop' })
      .evaluate((detail) => {
        const text = detail.firstChild;
        if (!text) return 0;
        const start = text.textContent?.indexOf('Shortstop') ?? -1;
        if (start < 0) return 0;
        const word = document.createRange();
        word.setStart(text, start);
        word.setEnd(text, start + 'Shortstop'.length);
        return word.getClientRects().length;
      });
    expect(positionLines, 'Keep a position name on one line at 320px').toBe(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
});
