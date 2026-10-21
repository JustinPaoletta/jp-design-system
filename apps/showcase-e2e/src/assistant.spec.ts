import { expect, test } from '@playwright/test';

test.describe('assistant system', () => {
  test('renders shell and opens assistant from context trigger', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/assistant');

    const shell = page.locator('jp-app-shell');
    await expect(shell).toBeVisible();
    await expect(page.locator('h1')).toContainText('Dodgers assistant');

    await page.getByRole('button', { name: 'Ask about the game' }).click();
    const panel = page.getByRole('complementary', { name: 'Dodgers manager' });
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('World Series Game 5');
    await expect(panel).toContainText('Dodgers 7, Yankees 6. Final score.');

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
    const panel = page.getByRole('complementary', { name: 'Dodgers manager' });
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('The Dodgers won 7–6');
    await expect(panel).toContainText(
      'Freddie Freeman and Mookie Betts drove in runs',
    );
  });
});
