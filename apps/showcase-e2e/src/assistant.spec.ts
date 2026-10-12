import { expect, test } from '@playwright/test';

test.describe('assistant system', () => {
  test('renders shell and opens assistant from context trigger', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/assistant');

    const shell = page.locator('jp-app-shell');
    await expect(shell).toBeVisible();
    await expect(page.locator('h1')).toContainText('Falcons assistant');

    await page.getByRole('button', { name: 'Ask about the game' }).click();
    const panel = page.getByRole('complementary', { name: 'Falcons coach' });
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('Game FAL-1042');
    await expect(panel).toContainText('Falcons 5, Bears 3. Final score.');

    await panel.locator('textarea').focus();
    await page.keyboard.press('Escape');
    await expect(
      page.locator('jp-assistant-panel .jp-assistant-panel__surface'),
    ).toHaveAttribute('aria-hidden', 'true');
  });

  test('seeds tone demo messages in the assistant panel', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/assistant');

    await page.getByRole('button', { name: 'Load game summary' }).click();
    const panel = page.getByRole('complementary', { name: 'Falcons coach' });
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('The Falcons won 5–3');
    await expect(panel).toContainText(
      'Alex Morgan and Jordan Davis drove in runs',
    );
  });
});
