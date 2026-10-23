import { expect, test, type Locator, type Page } from '@playwright/test';

async function expectFits(page: Page, panel: Locator) {
  const bounds = await panel.boundingBox();
  const viewport = page.viewportSize();
  expect(bounds).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport!.width + 1);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport!.height + 1);
  expect(
    await panel.evaluate(
      (element) => element.scrollWidth - element.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
}

for (const dir of ['ltr', 'rtl']) {
  test(`picker acceptance: enlarged root text ${dir}`, async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/workflows');
    // A text-size stress test, separate from actual browser/text-only zoom.
    await page.evaluate((direction) => {
      document.documentElement.dir = direction;
      document.documentElement.style.fontSize = '200%';
    }, dir);
    const date = page.getByLabel('Game date', { exact: true });
    await date.press('ArrowDown');
    const calendar = page.getByRole('dialog', { name: 'Game date calendar' });
    await expectFits(page, calendar);
    await page.keyboard.press('Escape');
    await expect(date).toBeFocused();
    const time = page.getByRole('textbox', {
      name: 'First pitch',
      exact: true,
    });
    await time.press('Alt+ArrowDown');
    const popup = page.getByRole('dialog', {
      name: 'First pitch',
      exact: true,
    });
    await expectFits(page, popup);
    await popup
      .getByRole('spinbutton', { name: 'Minute', exact: true })
      .press('ArrowUp');
    await popup.getByRole('button', { name: 'Apply', exact: true }).click();
    await expect(time).toHaveValue('20:15');
    await expect(time).toBeFocused();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
    ).toBeLessThanOrEqual(1);
  });
}

for (const accent of ['gold', 'neon', 'cobalt']) {
  test(`picker acceptance: forced colors ${accent}`, async ({
    page,
    browserName,
  }) => {
    // These are Chromium emulation checks, not real Windows palette acceptance.
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip(
      browserName !== 'chromium',
      'Forced-colors emulation is supported here in Chromium.',
    );
    await page.emulateMedia({
      forcedColors: 'active',
      reducedMotion: 'reduce',
    });
    await page.goto('/workflows');
    await page.evaluate(
      (value) => document.documentElement.setAttribute('data-jp-accent', value),
      accent,
    );
    const date = page.getByLabel('Game date', { exact: true });
    await date.press('ArrowDown');
    const calendar = page.getByRole('dialog', { name: 'Game date calendar' });
    const selected = calendar.locator('[data-date="2024-10-30"]');
    await expect(selected).toBeFocused();
    await expect(selected.locator('..')).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(selected).toHaveCSS('border-top-style', 'solid');
    await expect(selected).toHaveCSS('border-top-width', '1px');
    await expect(selected).toHaveCSS('outline-style', 'solid');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await expect(date).toHaveValue('2024-10-31');
    await expect(date).toBeFocused();
    const time = page.getByRole('textbox', {
      name: 'First pitch',
      exact: true,
    });
    await time.press('Alt+ArrowDown');
    const popup = page.getByRole('dialog', {
      name: 'First pitch',
      exact: true,
    });
    const minute = popup.getByRole('spinbutton', {
      name: 'Minute',
      exact: true,
    });
    await minute.fill('07');
    await expect(minute).toHaveAttribute('aria-invalid', 'true');
    await expect(
      popup.getByRole('button', { name: 'Apply', exact: true }),
    ).toBeDisabled();
    await minute.fill('15');
    await popup.getByRole('button', { name: 'Apply', exact: true }).click();
    await expect(time).toHaveValue('20:15');
    await expect(time).toBeFocused();
    await page.goto('/scheduling');
    const zone = page.getByRole('combobox', { name: 'Time zone', exact: true });
    await zone.press('Enter');
    await expect(
      page.getByRole('option', { name: 'America/New_York', exact: true }),
    ).toHaveAttribute('aria-selected', 'true');
    await zone.press('End');
    await zone.press('Enter');
    await expect(zone).toHaveText('Europe/London');
    await expect(zone).toBeFocused();
  });
}

test.describe('picker acceptance touch', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  test.skip(
    ({ browserName }) => browserName === 'firefox',
    'Firefox does not implement Playwright touch emulation.',
  );
  test('narrow touch emulation', async ({ page }) => {
    await page.goto('/workflows');
    await page
      .getByRole('button', { name: 'Choose Game date', exact: true })
      .tap();
    const calendar = page.getByRole('dialog', { name: 'Game date calendar' });
    await expect(calendar).toBeVisible();
    await expectFits(page, calendar);
    await calendar.locator('[data-date="2024-10-31"]').tap();
    await expect(page.getByLabel('Game date', { exact: true })).toHaveValue(
      '2024-10-31',
    );
    await page.getByRole('button', { name: 'Choose time', exact: true }).tap();
    const popup = page.getByRole('dialog', {
      name: 'First pitch',
      exact: true,
    });
    await expect(popup).toBeVisible();
    await expectFits(page, popup);
    await popup
      .getByRole('group', { name: 'Minute', exact: true })
      .getByRole('button', { name: 'Increase', exact: true })
      .tap();
    await expect(popup).toBeVisible();
    await popup.getByRole('button', { name: 'Apply', exact: true }).tap();
    await expect(
      page.getByRole('textbox', { name: 'First pitch', exact: true }),
    ).toHaveValue('20:15');
  });
});
