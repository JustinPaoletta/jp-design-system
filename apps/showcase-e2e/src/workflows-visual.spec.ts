import { expect, test } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/workflows');
  await expect(
    page.getByRole('heading', { name: 'Everyday workflows', exact: true }),
  ).toBeVisible();
});
for (const accent of ['neon', 'cobalt'])
  for (const density of ['default', 'compact'])
    test(
      'workflow visual desktop ' + accent + ' ' + density,
      async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 1400 });
        await page.evaluate(
          ({ accent, density }) => {
            document.documentElement.setAttribute('data-jp-accent', accent);
            document.documentElement.setAttribute('data-jp-density', density);
          },
          { accent, density },
        );
        await expect(page).toHaveScreenshot(
          'workflow-' + accent + '-' + density + '.png',
          { fullPage: true, animations: 'disabled', caret: 'hide' },
        );
      },
    );
for (const dir of ['ltr', 'rtl'])
  test('workflow visual mobile ' + dir, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate((dir) => (document.documentElement.dir = dir), dir);
    await expect(page).toHaveScreenshot('workflow-mobile-' + dir + '.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
    });
  });
test('workflow visual commands', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1400 });
  await page.getByRole('button', { name: 'Open commands' }).click();
  await expect(page.getByRole('combobox')).toBeFocused();
  await expect(page).toHaveScreenshot('workflow-commands.png', {
    animations: 'disabled',
    caret: 'hide',
  });
});
test('workflow visual context menu', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1400 });
  await page.getByRole('button', { name: 'More actions: Launch plan' }).click();
  await expect(page.getByRole('menuitem', { name: 'Rename' })).toBeFocused();
  await expect(page).toHaveScreenshot('workflow-context.png', {
    animations: 'disabled',
    caret: 'hide',
  });
});
test('workflow visual failed inline save', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1400 });
  await page.getByRole('button', { name: 'Edit: Project name' }).click();
  await page
    .getByRole('textbox', { name: 'Project name' })
    .fill('Updated plan');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(
    page.getByRole('alert').filter({ hasText: 'Could not save' }),
  ).toBeVisible();
  await expect(page).toHaveScreenshot('workflow-save-error.png', {
    fullPage: true,
    animations: 'disabled',
    caret: 'hide',
  });
});
test('workflow visual failed upload', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1600 });
  await page.getByLabel('Attachments', { exact: true }).setInputFiles({
    name: 'notes.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('notes'),
  });
  await page.getByRole('button', { name: 'Fail demo upload' }).click();
  await expect(
    page.getByRole('button', { name: 'Retry upload: notes.txt' }),
  ).toBeVisible();
  await expect(page).toHaveScreenshot('workflow-upload-error.png', {
    fullPage: true,
    animations: 'disabled',
    caret: 'hide',
  });
});
