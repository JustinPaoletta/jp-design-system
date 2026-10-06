import { expect, test } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/advanced-layout');
  await expect(page.locator('jp-media [aria-busy]')).toHaveAttribute(
    'aria-busy',
    'false',
  );
});
for (const accent of ['neon', 'cobalt'])
  for (const density of ['default', 'compact'])
    test(
      'advanced layout visual desktop ' + accent + ' ' + density,
      async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 1100 });
        await page.evaluate(
          ({ accent, density }) => {
            document.documentElement.setAttribute('data-jp-accent', accent);
            document.documentElement.setAttribute('data-jp-density', density);
          },
          { accent, density },
        );
        await expect(page).toHaveScreenshot(
          'advanced-' + accent + '-' + density + '.png',
          { fullPage: true, animations: 'disabled', caret: 'hide' },
        );
      },
    );
for (const dir of ['ltr', 'rtl'])
  test('advanced layout visual mobile ' + dir, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate((dir) => (document.documentElement.dir = dir), dir);
    await expect(page.getByRole('separator')).toHaveCount(0);
    await expect(page).toHaveScreenshot('advanced-mobile-' + dir + '.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
    });
  });
test('advanced layout visual preferences and detail', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1300 });
  await page.getByText('Columns', { selector: 'summary' }).click();
  await page
    .getByRole('button', { name: 'Show details: API gateway 1', exact: true })
    .click();
  await expect(page).toHaveScreenshot('advanced-controls-detail.png', {
    fullPage: true,
    animations: 'disabled',
    caret: 'hide',
  });
});
test('advanced layout visual image fallback', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.getByRole('button', { name: 'Show image error' }).click();
  await expect(
    page.getByRole('img', { name: 'Diagram of the service architecture' }),
  ).toHaveText('Image unavailable');
  await expect(page).toHaveScreenshot('advanced-image-error.png', {
    fullPage: true,
    animations: 'disabled',
    caret: 'hide',
  });
});
