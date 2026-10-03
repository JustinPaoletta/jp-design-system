import { expect, test } from '@playwright/test';

test.describe('controls', () => {
  test('renders shell, primary button, and accepts input', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/controls');

    const shell = page.locator('jp-app-shell');
    const primaryButton = page.locator('jp-button.jp-button--primary button');
    const emailInput = page.locator('jp-input input');

    await expect(shell).toBeVisible();
    await expect(page.locator('h1')).toContainText('Controls');
    await expect(primaryButton).toBeVisible();
    await expect(primaryButton).toContainText('Save');

    await emailInput.fill('demo@jp.dev');
    await expect(emailInput).toHaveValue('demo@jp.dev');
  });
});
