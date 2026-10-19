import { expect, test } from '@playwright/test';

test.describe('controls', () => {
  test('renders shell, primary button, and accepts input', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/controls');

    const shell = page.locator('jp-app-shell');
    const primaryButton = page.locator('jp-button.jp-button--primary button');
    const emailInput = page.getByRole('textbox', {
      name: 'Email',
      exact: true,
    });

    await expect(shell).toBeVisible();
    await expect(page.locator('h1')).toContainText('Controls');
    await expect(primaryButton).toBeVisible();
    await expect(primaryButton).toContainText('Save');

    await emailInput.fill('assistant@falcons.example');
    await expect(emailInput).toHaveValue('assistant@falcons.example');
  });

  test('preview density preserves lineup form values', async ({ page }) => {
    await page.goto('/controls');
    const email = page.getByRole('textbox', { name: 'Email', exact: true });
    const notes = page.getByRole('textbox', { name: 'Coach notes' });
    const role = page.getByRole('combobox', { name: 'Club role' });
    const messages = page.getByRole('checkbox', { name: 'Get club messages' });
    const save = page.getByRole('button', { name: 'Save', exact: true });
    const preview = page
      .locator('details')
      .filter({ hasText: 'Preview settings' });
    const compact = page.getByRole('switch', { name: 'Compact density' });

    await email.fill('assistant@falcons.example');
    await notes.fill('Confirm the batting order before warmups.');
    await role.selectOption('admin');
    await messages.uncheck();
    const defaultHeight = await save.evaluate(
      (el) => el.getBoundingClientRect().height,
    );
    await expect(compact).toBeHidden();
    await preview.locator('summary').click();
    await compact.click();
    await expect(compact).toHaveAttribute('aria-checked', 'true');
    await expect
      .poll(() => save.evaluate((el) => el.getBoundingClientRect().height))
      .toBeLessThan(defaultHeight);
    await preview.locator('summary').click();
    await expect(compact).toBeHidden();

    await expect(email).toHaveValue('assistant@falcons.example');
    await expect(notes).toHaveValue(
      'Confirm the batting order before warmups.',
    );
    await expect(role).toHaveValue('admin');
    await expect(messages).not.toBeChecked();

    await preview.locator('summary').click();
    await compact.click();
    await expect(compact).toHaveAttribute('aria-checked', 'false');
    await expect
      .poll(() => save.evaluate((el) => el.getBoundingClientRect().height))
      .toBe(defaultHeight);
  });

  test('saves, cancels, resets, and removes a lineup in the preview', async ({
    page,
  }) => {
    await page.goto('/controls');
    const email = page.getByRole('textbox', { name: 'Email', exact: true });
    const notes = page.getByRole('textbox', { name: 'Coach notes' });
    const role = page.getByRole('combobox', { name: 'Club role' });
    const messages = page.getByRole('checkbox', { name: 'Get club messages' });
    const status = page.getByRole('status');

    await email.fill('assistant@falcons.example');
    await notes.fill('Confirm the batting order before warmups.');
    await role.selectOption('admin');
    await messages.uncheck();
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(status).toHaveText('Lineup saved in this preview.');

    await email.fill('unsaved@falcons.example');
    await notes.fill('Unsaved lineup change.');
    await role.selectOption('viewer');
    await messages.check();
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(email).toHaveValue('assistant@falcons.example');
    await expect(notes).toHaveValue(
      'Confirm the batting order before warmups.',
    );
    await expect(role).toHaveValue('admin');
    await expect(messages).not.toBeChecked();
    await expect(status).toHaveText('Changes canceled.');

    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(email).toHaveValue('coach@falcons.example');
    await expect(notes).toHaveValue('');
    await expect(role).toHaveValue('editor');
    await expect(messages).toBeChecked();
    await expect(status).toHaveText('Default lineup restored.');

    const remove = page.getByRole('button', {
      name: 'Delete lineup',
      exact: true,
    });
    await remove.click();
    await expect(status).toHaveText('Saved lineup removed from this preview.');
    await expect(remove).toBeDisabled();
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(remove).toBeEnabled();
  });
});
