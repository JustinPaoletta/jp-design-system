import { expect, test } from '@playwright/test';

test.describe('feedback overlays', () => {
  test('renders shell and opens dialog from delete action', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/overlays');

    const shell = page.locator('jp-app-shell');
    await expect(shell).toBeVisible();
    await expect(page.locator('h1')).toContainText('Club alerts');

    await page.getByRole('button', { name: 'Remove player' }).click();
    const dialog = page.getByRole('dialog', { name: 'Remove player?' });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Remove player?');

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });

  test('shows a success toast from the toast controls', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/overlays');

    await page.getByRole('button', { name: 'Success', exact: true }).click();
    await expect(page.locator('jp-toast')).toContainText('Lineup saved');
  });
});
