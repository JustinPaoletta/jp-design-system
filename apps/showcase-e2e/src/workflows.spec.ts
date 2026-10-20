import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/workflows');
});
test('workflows: commands filter metadata, skip disabled options, run, and restore focus', async ({
  page,
}) => {
  const opener = page.getByRole('button', { name: 'Open commands' });
  await opener.click();
  const search = page.getByRole('combobox', { name: 'Search commands' });
  await expect(search).toBeFocused();
  await expect(
    page.getByRole('option', { name: 'Archive club' }),
  ).toBeDisabled();
  await search.fill('dashboard');
  await expect(
    page.getByRole('option', { name: 'Open overview' }),
  ).toBeVisible();
  await search.fill('duplicate');
  await search.press('Enter');
  await expect(
    page.getByRole('status').filter({ hasText: 'Last action: duplicate' }),
  ).toBeVisible();
  await expect(opener).toBeFocused();
  await opener.press('Control+Shift+D');
  await expect(
    page.getByRole('status').filter({ hasText: 'Last action: duplicate' }),
  ).toBeVisible();
  await opener.press('Control+k');
  await expect(search).toBeFocused();
  await search.fill('missing command');
  await expect(
    page.getByRole('status').filter({ hasText: 'No commands found' }),
  ).toBeVisible();
  await search.press('Escape');
  await expect(opener).toBeFocused();
  await page.getByRole('button', { name: 'Edit: Club name' }).click();
  const name = page.getByRole('textbox', { name: 'Club name' });
  await name.press('Control+k');
  await expect(search).toHaveCount(0);
  await name.press('Escape');
});
test('workflows: context actions support pointer, keyboard and visible alternatives', async ({
  page,
}) => {
  const region = page.getByRole('group', { name: 'Game plan', exact: true });
  await region.click({ button: 'right' });
  const rename = page.getByRole('menuitem', { name: 'Rename' });
  await expect(rename).toBeFocused();
  await rename.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Duplicate' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(region).toBeFocused();
  await region.press('Shift+F10');
  await expect(rename).toBeFocused();
  await rename.press('Enter');
  await expect(
    page.getByRole('status').filter({ hasText: 'Last action: rename' }),
  ).toBeVisible();
  await expect(region).toBeFocused();
  await page.getByRole('button', { name: 'More actions: Game plan' }).click();
  await expect(rename).toBeFocused();
  await page.getByRole('button', { name: 'Open commands' }).click();
  await expect(
    page.getByRole('combobox', { name: 'Search commands' }),
  ).toBeFocused();
  await page.keyboard.press('Escape');
});
test('workflows: split actions and toggle use native keyboard controls', async ({
  page,
}) => {
  const favorite = page.getByRole('button', { name: 'Favorite', exact: true });
  await favorite.press('Space');
  await expect(favorite).toHaveAttribute('aria-pressed', 'true');
  await favorite.press('Enter');
  await expect(favorite).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Create club', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Last action: create' }),
  ).toBeVisible();
  const alternatives = page.getByRole('button', {
    name: 'More actions: Create club',
  });
  await alternatives.click();
  await page.getByRole('menuitem', { name: 'Rename' }).press('ArrowDown');
  await page.getByRole('menuitem', { name: 'Duplicate' }).press('Enter');
  await expect(
    page.getByRole('status').filter({ hasText: 'Last action: duplicate' }),
  ).toBeVisible();
  await expect(alternatives).toBeFocused();
});
test('workflows: inline saves preserve failed drafts, retry and abort without committing', async ({
  page,
}) => {
  const edit = page.getByRole('button', { name: 'Edit: Club name' });
  await edit.click();
  const input = page.getByRole('textbox', { name: 'Club name' });
  await expect(input).toBeFocused();
  await input.fill('Updated plan');
  await input.press('Enter');
  await expect(
    page.getByRole('alert').filter({ hasText: 'Could not save' }),
  ).toBeVisible();
  await expect(input).toHaveValue('Updated plan');
  await expect(input).toBeFocused();
  await input.press('Enter');
  await expect(edit).toBeFocused();
  await expect(
    page
      .getByRole('status')
      .filter({ hasText: 'Saved', hasNotText: 'Schedule' }),
  ).toBeVisible();
  await edit.click();
  await input.fill('Cancelled plan');
  await input.press('Enter');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(edit).toBeFocused();
  await expect(page.locator('jp-inline-edit')).toContainText('Updated plan');
  await expect(page.locator('jp-inline-edit')).not.toContainText(
    'Cancelled plan',
  );
});
test('workflows: themed date/time form validates ordered local values and focuses errors', async ({
  page,
}) => {
  await page.getByLabel('Game date', { exact: true }).fill('2024-09-30');
  await page.getByLabel('Start date', { exact: true }).fill('2024-10-30');
  await page.getByLabel('End date', { exact: true }).fill('2024-10-25');
  await page.getByLabel('First pitch', { exact: true }).fill('09:10');
  await page.getByRole('button', { name: 'Save schedule' }).click();
  const summary = page.getByRole('region', { name: 'There is a problem' });
  await expect(summary).toBeFocused();
  await expect(summary.getByRole('link')).toHaveCount(3);
  await summary
    .getByRole('link', {
      name: 'Choose an ordered date range in October 2024.',
    })
    .click();
  await expect(page.getByLabel('Start date', { exact: true })).toBeFocused();
  await page.getByLabel('Game date', { exact: true }).fill('2024-10-30');
  await page.getByLabel('Start date', { exact: true }).fill('2024-10-25');
  await page.getByLabel('End date', { exact: true }).fill('2024-10-30');
  await page.getByLabel('First pitch', { exact: true }).fill('09:15');
  await page.getByRole('button', { name: 'Save schedule' }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Schedule saved.' }),
  ).toBeVisible();
});
test('workflows: file constraints, progress, cancellation, retry and removal remain consumer-controlled', async ({
  page,
}) => {
  const field = page.getByLabel('Lineup files', { exact: true });
  await field.setInputFiles([
    { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('notes') },
    {
      name: 'bad.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('bad'),
    },
    { name: 'large.md', mimeType: 'text/markdown', buffer: Buffer.alloc(1025) },
  ]);
  await expect(page.locator('jp-file-upload')).toContainText(
    'bad.pdf: unsupported file type',
  );
  await expect(page.locator('jp-file-upload')).toContainText(
    'large.md: file is too large',
  );
  await expect(
    page.getByRole('button', { name: 'Remove: notes.txt' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Start demo upload' }).click();
  await expect(
    page.getByRole('progressbar', { name: 'Lineup files: notes.txt' }),
  ).toHaveAttribute('aria-valuenow', '40');
  await page.getByRole('button', { name: 'Cancel upload: notes.txt' }).click();
  await expect(
    page.getByRole('button', { name: 'Remove: notes.txt' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Fail demo upload' }).click();
  await page.getByRole('button', { name: 'Retry upload: notes.txt' }).click();
  await expect(
    page.getByRole('progressbar', { name: 'Lineup files: notes.txt' }),
  ).toHaveAttribute('aria-valuenow', '25');
  await page.getByRole('button', { name: 'Complete demo upload' }).click();
  await expect(page.locator('jp-file-upload')).toContainText('Uploaded');
  await page.getByRole('button', { name: 'Remove: notes.txt' }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'No files selected' }),
  ).toBeVisible();
});
test('workflows: inbox filters unread, recovers focus on dismissal, and retains read items', async ({
  page,
}) => {
  const inbox = page.getByRole('region', {
    name: 'Club messages',
    exact: true,
  });
  await inbox.getByRole('button', { name: 'Unread 2', exact: true }).click();
  await expect(inbox).not.toContainText('Club invitation accepted');
  await inbox
    .getByRole('button', { name: 'Mark as read: Jack Flaherty starts Game 5' })
    .press('Enter');
  await expect(
    inbox.getByRole('button', { name: 'Mark as read: Game report ready' }),
  ).toBeFocused();
  await expect(inbox).not.toContainText('Jack Flaherty starts Game 5');
  await inbox
    .getByRole('button', { name: 'Mark all as read', exact: true })
    .click();
  await expect(inbox.getByRole('status')).toHaveText('No unread notifications');
  await inbox.getByRole('button', { name: 'All', exact: true }).click();
  await expect(inbox).toContainText('Club invitation accepted');
  await inbox
    .getByRole('button', { name: 'Dismiss: Game report ready' })
    .click();
  await expect(
    page.locator('[aria-label="Notification updates"]'),
  ).toBeFocused();
  await expect(inbox).not.toContainText('Game report ready');
});
test('workflows: skip link moves native focus and mobile RTL reflows without overflow', async ({
  page,
}) => {
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await skip.focus();
  await skip.press('Enter');
  await expect(page.locator('#workflow-main')).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => (document.documentElement.dir = 'rtl'));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
for (const accent of ['neon', 'cobalt'])
  for (const density of ['default', 'compact'])
    test('workflows axe ' + accent + ' ' + density, async ({ page }) => {
      await page.evaluate(
        ({ accent, density }) => {
          document.documentElement.setAttribute('data-jp-accent', accent);
          document.documentElement.setAttribute('data-jp-density', density);
        },
        { accent, density },
      );
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
            .analyze()
        ).violations,
      ).toEqual([]);
      await page.getByRole('button', { name: 'Open commands' }).click();
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
            .analyze()
        ).violations,
      ).toEqual([]);
      await page.keyboard.press('Escape');
      await page
        .getByRole('button', { name: 'More actions: Game plan' })
        .click();
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
            .analyze()
        ).violations,
      ).toEqual([]);
    });
