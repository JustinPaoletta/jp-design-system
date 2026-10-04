import { expect, test } from '@playwright/test';

// macOS Chromium baselines run in the existing dedicated visual CI job.
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/component-expansion');
  await expect(
    page.getByRole('heading', { name: 'Component expansion', exact: true }),
  ).toBeVisible();
});

for (const accent of ['neon', 'cobalt']) {
  for (const density of ['default', 'compact']) {
    test(`component expansion visual desktop ${accent} ${density}`, async ({
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
        `components-${accent}-${density}.png`,
        { fullPage: true, animations: 'disabled', caret: 'hide' },
      );
    });
  }
}

for (const direction of ['ltr', 'rtl']) {
  test(`component expansion visual mobile ${direction}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(
      (direction) => document.documentElement.setAttribute('dir', direction),
      direction,
    );
    await expect(page).toHaveScreenshot(`components-mobile-${direction}.png`, {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
    });
  });
}

test('component expansion visual drawer desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.getByRole('button', { name: 'Open details' }).click();
  await expect(
    page.getByRole('dialog', { name: 'Project details' }),
  ).toBeVisible();
  await expect(page).toHaveScreenshot('components-drawer-desktop.png', {
    animations: 'disabled',
    caret: 'hide',
  });
});

test('component expansion visual drawer mobile rtl', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() =>
    document.documentElement.setAttribute('dir', 'rtl'),
  );
  await page.getByRole('button', { name: 'Open details' }).click();
  await expect(
    page.getByRole('dialog', { name: 'Project details' }),
  ).toBeVisible();
  await expect(page).toHaveScreenshot('components-drawer-mobile-rtl.png', {
    animations: 'disabled',
    caret: 'hide',
  });
});
