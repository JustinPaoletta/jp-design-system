import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// WCAG 2.0/2.1 A/AA only. axe-core 4.13's wcag22aa rule (target-size) stays
// disabled, and these tags do not enable it. See docs/qa/SUPPORT_MATRIX.md.
const WCAG_21_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

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
      .withTags(WCAG_21_AA)
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

async function prepareNeonDefault(
  page: Page,
  path: string,
  viewport: { width: number; height: number },
) {
  await page.setViewportSize(viewport);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(path);
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-jp-accent', 'neon');
    document.documentElement.removeAttribute('data-jp-density');
  });
  await expect(page.locator('h1')).toBeVisible();
}

// Single-theme extras. Titles stay under the CI grep `recipes visual`.
test('recipes visual neon default mobile shell', async ({ page }) => {
  await prepareNeonDefault(page, '/app-shell', { width: 390, height: 844 });
  await expect(
    page.getByRole('button', { name: 'Open navigation' }),
  ).toBeVisible();
  await expect(page).toHaveScreenshot('recipes-mobile-shell.png', {
    fullPage: true,
    animations: 'disabled',
    caret: 'hide',
  });
});

test('recipes visual neon default open dialog', async ({ page }) => {
  await prepareNeonDefault(page, '/overlays', { width: 1280, height: 900 });
  await page
    .getByRole('button', { name: 'Delete deployment', exact: true })
    .click();
  const dialog = page.getByRole('dialog', { name: 'Delete deployment?' });
  await expect(dialog).toBeVisible();
  await dialog.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });
  await expect(page).toHaveScreenshot('recipes-open-dialog.png', {
    animations: 'disabled',
    caret: 'hide',
  });
});

test('recipes visual neon default assistant response', async ({ page }) => {
  await prepareNeonDefault(page, '/assistant', { width: 1280, height: 900 });
  await page.getByRole('button', { name: 'Seed tone demo' }).click();
  const panel = page.getByRole('complementary', { name: 'JP Assistant' });
  await expect(panel).toContainText('calm sunken surface');
  await panel.locator('textarea').evaluate((element) => {
    if (element instanceof HTMLElement) element.blur();
  });
  await expect(page).toHaveScreenshot('recipes-assistant-response.png', {
    animations: 'disabled',
    caret: 'hide',
  });
});

test('recipes visual neon default settings error', async ({ page }) => {
  await prepareNeonDefault(page, '/product-recipes', {
    width: 1280,
    height: 900,
  });
  await page.getByRole('tab', { name: 'Settings', exact: true }).click();
  await page
    .getByRole('button', { name: 'Save settings', exact: true })
    .click();
  await expect(
    page.getByText('Enter a valid notification email.'),
  ).toBeVisible();
  await expect(page).toHaveScreenshot('recipes-settings-error.png', {
    fullPage: true,
    animations: 'disabled',
    caret: 'hide',
  });
});
