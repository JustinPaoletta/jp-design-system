import { expect, test } from '@playwright/test';

for (const view of [
  { name: 'desktop', width: 1280, height: 900, direction: 'ltr' },
  { name: 'mobile-ltr', width: 320, height: 700, direction: 'ltr' },
  { name: 'mobile-rtl', width: 320, height: 700, direction: 'rtl' },
]) {
  test(`select visual open time zone ${view.name}`, async ({ page }) => {
    await page.setViewportSize({ width: view.width, height: view.height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/scheduling');
    await page.evaluate(
      (direction) => document.documentElement.setAttribute('dir', direction),
      view.direction,
    );
    const select = page.getByRole('combobox', {
      name: 'Time zone',
      exact: true,
    });
    await select.scrollIntoViewIfNeeded();
    await select.focus();
    await select.press('Enter');
    const choices = page.getByRole('listbox', {
      name: 'Time zone',
      exact: true,
    });
    await expect(choices).toBeVisible();
    await expect(
      choices.getByRole('option', { name: 'America/New_York', exact: true }),
    ).toHaveAttribute('aria-selected', 'true');
    const field = await page.locator('jp-select.time-zone').boundingBox();
    const popup = await choices.boundingBox();
    if (!field || !popup)
      throw new Error('Expected the field and its open list');
    const x = Math.max(0, Math.min(field.x, popup.x) - 8);
    const y = Math.max(0, Math.min(field.y, popup.y) - 8);
    const right = Math.min(
      view.width,
      Math.max(field.x + field.width, popup.x + popup.width) + 8,
    );
    const bottom = Math.min(
      view.height,
      Math.max(field.y + field.height, popup.y + popup.height) + 8,
    );
    await expect(page).toHaveScreenshot(`select-time-zone-${view.name}.png`, {
      clip: { x, y, width: right - x, height: bottom - y },
      animations: 'disabled',
      caret: 'hide',
    });
  });
}
