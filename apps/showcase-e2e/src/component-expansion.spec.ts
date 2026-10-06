import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/component-expansion');
});

test('component expansion: native disclosure keyboard operation and exclusive grouping', async ({
  page,
}) => {
  const general = page
    .locator('summary')
    .filter({ hasText: 'General settings' });
  const advanced = page
    .locator('summary')
    .filter({ hasText: 'Advanced settings' });
  // Assert the native grouping contract in both supported browser engines.
  await expect(general.locator('..')).toHaveJSProperty(
    'name',
    'showcase-settings',
  );
  await expect(advanced.locator('..')).toHaveJSProperty(
    'name',
    'showcase-settings',
  );
  await general.focus();
  await page.keyboard.press('Enter');
  await expect(general.locator('..')).toHaveAttribute('open', '');
  await advanced.click();
  await expect(advanced.locator('..')).toHaveAttribute('open', '');
  await expect(general.locator('..')).not.toHaveAttribute('open', '');
  await general.focus();
  await general.press('Space');
  await expect(general.locator('..')).toHaveAttribute('open', '');
  await expect(advanced.locator('..')).not.toHaveAttribute('open', '');
});

test('component expansion: search clearing, password reveal, and form validation recovery', async ({
  page,
}) => {
  const search = page.getByRole('searchbox', { name: 'Search projects' });
  await search.fill('gateway');
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(search).toHaveValue('');
  await expect(search).toBeFocused();
  const password = page.getByLabel('Password', { exact: true });
  await password.fill('example-password');
  await page.getByRole('button', { name: 'Show password' }).click();
  await expect(password).toHaveAttribute('type', 'text');
  await expect(password).toHaveValue('example-password');
  await page.getByRole('button', { name: 'Hide password' }).click();
  await expect(password).toHaveAttribute('type', 'password');
  await page.getByRole('button', { name: 'Save preferences' }).click();
  const summary = page.getByRole('region', { name: 'There is a problem' });
  await expect(summary).toBeFocused();
  await summary
    .getByRole('link', { name: 'Enter a valid email address.' })
    .click();
  await expect(
    page.getByRole('textbox', { name: 'Email', exact: true }),
  ).toBeFocused();
  await page
    .getByRole('textbox', { name: 'Email', exact: true })
    .fill('ada@example.com');
  await page.getByRole('button', { name: 'Save preferences' }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Preferences saved' }),
  ).toBeVisible();
  await expect(summary).toHaveCount(0);
});

test('component expansion: multi-select preserves selections, supports keys, and handles disabled options', async ({
  page,
}) => {
  const query = page.getByRole('combobox', { name: 'Reviewers' });
  await query.focus();
  await query.fill('grace');
  await page.keyboard.press('Enter');
  await expect(page.locator('jp-multi-select jp-chip')).toHaveCount(2);
  await expect(query).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(query).toHaveAttribute('aria-expanded', 'false');
  await query.click();
  await query.fill('Unavailable');
  await expect(
    page.getByRole('option', { name: 'Unavailable reviewer' }),
  ).toHaveAttribute('aria-disabled', 'true');
  await page.keyboard.press('Enter');
  await expect(page.locator('jp-multi-select jp-chip')).toHaveCount(2);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Remove Grace Hopper' }).click();
  await expect(page.locator('jp-multi-select jp-chip')).toHaveCount(1);
  await expect(query).toBeFocused();
});

test('component expansion: drawer traps focus, dismisses, and returns to its opener', async ({
  page,
}) => {
  const opener = page.getByRole('button', { name: 'Open details' });
  await opener.click();
  const drawer = page.getByRole('dialog', { name: 'Project details' });
  await expect(drawer).toBeVisible();
  await expect(
    drawer.getByRole('button', { name: 'Close panel' }),
  ).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(drawer.getByRole('button', { name: 'Done' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(drawer).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test('component expansion: rendered and expanded states pass axe across accents and densities', async ({
  page,
}) => {
  for (const accent of ['neon', 'cobalt']) {
    for (const density of ['default', 'compact']) {
      await page.evaluate(
        ({ accent, density }) => {
          document.documentElement.setAttribute('data-jp-accent', accent);
          document.documentElement.setAttribute('data-jp-density', density);
        },
        { accent, density },
      );
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(result.violations).toEqual([]);
    }
  }
  await page.getByRole('button', { name: 'Save preferences' }).click();
  await page.getByRole('combobox', { name: 'Reviewers' }).focus();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Open details' }).click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test('component expansion: mobile RTL layout fits the viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() =>
    document.documentElement.setAttribute('dir', 'rtl'),
  );
  await expect(
    page.getByRole('heading', { name: 'Component expansion', exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole('button', { name: 'Open details' }).click();
  await expect(
    page.getByRole('dialog', { name: 'Project details' }),
  ).toBeVisible();
  expect(
    await page
      .getByRole('dialog', { name: 'Project details' })
      .evaluate((el) => el.getBoundingClientRect().left),
  ).toBeLessThan(5);
  await page.screenshot({
    path: 'dist/.playwright/component-expansion-mobile-rtl.png',
    fullPage: true,
  });
});
