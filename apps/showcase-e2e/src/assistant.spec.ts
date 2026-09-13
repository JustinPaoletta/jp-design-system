import { expect, test } from '@playwright/test';

test.describe('assistant system', () => {
  test('renders shell and opens assistant from context trigger', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/assistant');

    const shell = page.locator('jp-app-shell');
    await expect(shell).toBeVisible();
    await expect(page.locator('h1')).toContainText('Assistant System');

    await page.getByRole('button', { name: 'Ask about deployment' }).click();
    const panel = page.getByRole('complementary', { name: 'JP Assistant' });
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('Deployment dep-1042');
    await expect(panel).toContainText('Production rollout');

    await panel.locator('textarea').focus();
    await page.keyboard.press('Escape');
    await expect(
      page.locator('jp-assistant-panel .jp-assistant-panel__surface'),
    ).toHaveAttribute('aria-hidden', 'true');
  });

  test('seeds tone demo messages in the assistant panel', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/assistant');

    await page.getByRole('button', { name: 'Seed tone demo' }).click();
    const panel = page.getByRole('complementary', { name: 'JP Assistant' });
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('Tone refinement demo');
    await expect(panel).toContainText('calm sunken surface');
  });
});
