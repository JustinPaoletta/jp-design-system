import { expect, test } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/product-tools');
  await expect(
    page.getByRole('heading', { name: 'Product tools', exact: true }),
  ).toBeVisible();
});
for (const accent of ['neon', 'cobalt'])
  for (const density of ['default', 'compact']) {
    test(`product tools visual desktop ${accent} ${density}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.evaluate(
        ({ accent, density }) => {
          document.documentElement.setAttribute('data-jp-accent', accent);
          document.documentElement.setAttribute('data-jp-density', density);
        },
        { accent, density },
      );
      await expect(page).toHaveScreenshot(
        `product-tools-${accent}-${density}.png`,
        { fullPage: true, animations: 'disabled', caret: 'hide' },
      );
    });
  }
for (const direction of ['ltr', 'rtl'])
  test(`product tools visual mobile ${direction}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(
      (direction) => document.documentElement.setAttribute('dir', direction),
      direction,
    );
    await expect(page).toHaveScreenshot(
      `product-tools-mobile-${direction}.png`,
      { fullPage: true, animations: 'disabled', caret: 'hide' },
    );
  });
test('product tools visual invalid wizard', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(
    page.getByRole('region', { name: 'There is a problem' }),
  ).toBeFocused();
  await expect(page).toHaveScreenshot('product-tools-invalid.png', {
    fullPage: true,
    animations: 'disabled',
    caret: 'hide',
  });
});
test('product tools visual open overflow', async ({ page }) => {
  // Keep the trigger and native top-layer panel in the viewport. A full-page
  // capture of a scrolled page resizes the viewport while positioning the panel.
  await page.setViewportSize({ width: 1280, height: 1400 });
  await page
    .getByRole('button', { name: 'Show 3 more items: Other reviewers' })
    .click();
  await expect(
    page.getByRole('region', { name: 'Other reviewers' }),
  ).toBeVisible();
  await expect(page).toHaveScreenshot('product-tools-overflow.png', {
    fullPage: true,
    animations: 'disabled',
    caret: 'hide',
  });
});
