import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Semantic checks complement keyboard behavior tests; never suppress violations.
for (const route of [
  'controls',
  'data',
  'overlays',
  'assistant',
  'product-recipes',
]) {
  test(`${route} meets WCAG AA`, async ({ page }) => {
    await page.goto(`/${route}`);
    await expect(page.locator('h1')).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

for (const accent of ['neon', 'cobalt']) {
  for (const density of ['default', 'compact']) {
    test(`recipes visual ${accent} ${density}`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/product-recipes');
      await page.evaluate(
        ({ accent, density }) => {
          document.documentElement.setAttribute('data-jp-accent', accent);
          document.documentElement.setAttribute('data-jp-density', density);
        },
        { accent, density },
      );
      await expect(page.locator('h1')).toBeVisible();
      await expect(page).toHaveScreenshot(`recipes-${accent}-${density}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
}
