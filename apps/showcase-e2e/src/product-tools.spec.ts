import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/product-tools');
});
test('product tools: wizard validates, focuses recovery, and preserves values on back', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  const summary = page.getByRole('region', { name: 'There is a problem' });
  await expect(summary).toBeFocused();
  await summary
    .getByRole('link', { name: 'Enter a valid email address.' })
    .click();
  const email = page.getByRole('textbox', { name: 'Notification email' });
  await expect(email).toBeFocused();
  await email.fill('ada@example.com');
  const seats = page.getByRole('spinbutton', { name: 'Seats' });
  await seats.fill('11');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(summary).toBeFocused();
  await summary
    .getByRole('link', { name: 'Choose between one and ten seats.' })
    .click();
  await expect(seats).toBeFocused();
  await seats.fill('3');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Review project', exact: true }),
  ).toBeFocused();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(email).toHaveValue('ada@example.com');
  await expect(seats).toHaveValue('3');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Save project', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Project saved.' }),
  ).toBeVisible();
});
test('product tools: nested checklist exposes mixed completion and keeps disabled tasks unchanged', async ({
  page,
}) => {
  const parent = page.getByRole('checkbox', { name: 'Quality checks' });
  expect(
    await parent.evaluate((el: HTMLInputElement) => el.indeterminate),
  ).toBe(true);
  await parent.press('Space');
  await expect(
    page.getByRole('checkbox', { name: 'Review accessibility' }),
  ).toBeChecked();
  await expect(
    page.getByRole('checkbox', { name: 'External approval' }),
  ).toBeDisabled();
  await expect(
    page.getByRole('status').filter({ hasText: '2 of 4 completed' }),
  ).toBeVisible();
  await page.getByRole('checkbox', { name: 'Run tests' }).uncheck();
  await expect(
    page.getByRole('status').filter({ hasText: '1 of 4 completed' }),
  ).toBeVisible();
});
test('product tools: numeric stepping and range keyboard/exact entry stay bounded', async ({
  page,
}) => {
  const volume = page.getByRole('slider', { name: 'Volume' });
  await volume.focus();
  await page.keyboard.press('ArrowRight');
  await expect(volume).toHaveValue('45');
  await page.keyboard.press('End');
  await expect(volume).toHaveValue('100');
  await page.keyboard.press('Home');
  await expect(volume).toHaveValue('0');
  const exact = page.getByRole('spinbutton', { name: 'Volume' });
  // Wait for the controlled numeric alternative to receive the range change.
  // The native range value changes before Angular renders its sibling input.
  await expect(exact).toHaveValue('0');
  await exact.fill('37');
  await exact.press('Tab');
  await expect(volume).toHaveValue('35');
  await expect(exact).toHaveValue('35');
  const from = page.getByRole('slider', { name: 'From' });
  await from.focus();
  await page.keyboard.press('ArrowRight');
  await expect(from).toHaveValue('25');
  const to = page.getByRole('spinbutton', { name: 'To' });
  await to.fill('10');
  await to.press('Tab');
  await expect(to).toHaveValue('25');
  await expect(page.getByRole('slider', { name: 'To' })).toHaveAttribute(
    'min',
    '25',
  );
  const seats = page.getByRole('spinbutton', { name: 'Seats' });
  await seats.fill('10');
  await expect(
    page.getByRole('button', { name: 'Increase Seats' }),
  ).toBeDisabled();
  await seats.fill('');
  await page.getByRole('button', { name: 'Increase Seats' }).click();
  await expect(seats).toHaveValue('1');
});
test('product tools: overflow content is reachable by keyboard and restores focus on escape', async ({
  page,
  browserName,
}) => {
  const opener = page.getByRole('button', {
    name: 'Show 3 more items: Other reviewers',
  });
  await opener.focus();
  await page.keyboard.press('Space');
  await expect(opener).toHaveAttribute('aria-expanded', 'true');
  // WebKit follows macOS link navigation: Option+Tab includes links.
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  await expect(page.getByRole('link', { name: 'Ada Lovelace' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(opener).toHaveAttribute('aria-expanded', 'false');
  await expect(opener).toBeFocused();
});
test('product tools: code copy announces denial then recovery against a controlled clipboard boundary', async ({
  page,
}) => {
  await page.evaluate(() => {
    let calls = 0;
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          if (++calls === 1) throw new Error('Denied');
          document.documentElement.setAttribute('data-copied-text', text);
        },
      },
    });
  });
  const copy = page.getByRole('button', { name: 'Copy', exact: true });
  await copy.click();
  await expect(page.locator('jp-copy-button [role=status]')).toHaveText(
    /Could not copy/,
  );
  await copy.click();
  await expect(page.locator('jp-copy-button [role=status]')).toHaveText(
    'Copied',
  );
  await expect(page.locator('html')).toHaveAttribute(
    'data-copied-text',
    '<jp-number-stepper label="Seats" [min]="1" [max]="10" [formControl]="seats" />',
  );
  await expect(page.locator('jp-code-block code')).toHaveText(
    '<jp-number-stepper label="Seats" [min]="1" [max]="10" [formControl]="seats" />',
  );
});
test('product tools: default, overflow, and invalid states pass WCAG AA across themes', async ({
  page,
}) => {
  for (const accent of ['neon', 'cobalt'])
    for (const density of ['default', 'compact']) {
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
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze()
        ).violations,
      ).toEqual([]);
    }
  await page
    .getByRole('button', { name: 'Show 3 more items: Other reviewers' })
    .click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
});
test('product tools: mobile RTL reflows without page-level overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() =>
    document.documentElement.setAttribute('dir', 'rtl'),
  );
  await expect(
    page.getByRole('heading', { name: 'Product tools', exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole('button', { name: 'Show 3 more items: Other reviewers' })
    .click();
  expect(
    await page
      .getByRole('region', { name: 'Other reviewers' })
      .evaluate((el) => {
        const r = el.getBoundingClientRect();
        return r.left >= 0 && r.right <= window.innerWidth;
      }),
  ).toBe(true);
});
