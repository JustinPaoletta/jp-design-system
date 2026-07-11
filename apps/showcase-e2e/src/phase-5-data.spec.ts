import { expect, test } from '@playwright/test';

test.describe('phase 5 data display', () => {
  test('renders shell, table, and status badges', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/phase-5-data');

    const shell = page.locator('jp-app-shell');
    const table = page.locator('jp-table');
    const badge = page.locator('jp-table jp-badge').first();

    await expect(shell).toBeVisible();
    await expect(page.locator('h1')).toContainText('Phase 5 Data Display');
    await expect(table).toBeVisible();
    await expect(page.locator('caption')).toContainText('Recent deployments');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('Healthy');
  });
});
