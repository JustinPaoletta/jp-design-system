import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const view of [
  { name: 'desktop', width: 1000, dir: 'ltr' },
  { name: 'narrow', width: 320, dir: 'ltr' },
  { name: 'narrow RTL', width: 320, dir: 'rtl' },
]) {
  test(`themed controls: calendar keyboard, constraints and range selection ${view.name}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: view.width, height: 850 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/workflows');
    await page.evaluate(
      (dir) => (document.documentElement.dir = dir),
      view.dir,
    );
    const field = page.getByLabel('Game date', { exact: true });
    await expect(field).toHaveAttribute('type', 'text');
    await field.focus();
    await field.press('ArrowDown');
    const calendar = page.getByRole('dialog', { name: 'Game date calendar' });
    await expect(calendar).toBeVisible();
    await expect(calendar.locator('[data-date="2026-10-19"]')).toBeFocused();
    await expect(calendar.locator('[data-date="2026-09-30"]')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    const panel = await calendar.boundingBox();
    expect(panel!.x).toBeGreaterThanOrEqual(0);
    expect(panel!.x + panel!.width).toBeLessThanOrEqual(view.width);
    expect(panel!.y + panel!.height).toBeLessThanOrEqual(850);
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(audit.violations).toEqual([]);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await expect(field).toHaveValue(
      view.dir === 'rtl' ? '2026-10-18' : '2026-10-20',
    );
    await expect(calendar).toBeHidden();
    await expect(field).toBeFocused();
    await field.press('ArrowDown');
    await page.keyboard.press('Escape');
    await expect(field).toBeFocused();
    const start = page.getByLabel('Start date', { exact: true });
    await start.press('ArrowDown');
    await page
      .getByRole('dialog', { name: 'Start date calendar' })
      .locator('[data-date="2026-10-12"]')
      .click();
    const end = page.getByLabel('End date', { exact: true });
    await end.press('ArrowDown');
    await page
      .getByRole('dialog', { name: 'End date calendar' })
      .locator('[data-date="2026-10-19"]')
      .click();
    await page
      .getByRole('button', { name: 'Save schedule', exact: true })
      .click();
    await expect(
      page.getByRole('status').filter({ hasText: 'Schedule saved.' }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
  });

  test(`themed controls: time draft, step, cancel and commit ${view.name}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: view.width, height: 850 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/workflows');
    await page.evaluate(
      (dir) => (document.documentElement.dir = dir),
      view.dir,
    );
    const field = page.getByRole('textbox', {
      name: 'Replay reminder',
      exact: true,
    });
    await expect(field).toHaveAttribute('type', 'text');
    await page
      .getByRole('button', { name: 'Choose time', exact: true })
      .click();
    const popup = page.getByRole('dialog', {
      name: 'Replay reminder',
      exact: true,
    });
    await expect(
      popup.getByRole('spinbutton', { name: 'Hour', exact: true }),
    ).toBeFocused();
    const minute = popup.getByRole('spinbutton', {
      name: 'Minute',
      exact: true,
    });
    await minute.fill('07');
    await expect(
      popup.getByRole('button', { name: 'Apply', exact: true }),
    ).toBeDisabled();
    await expect(field).toHaveValue('20:00');
    await minute.fill('15');
    const panel = await popup.boundingBox();
    expect(panel!.x).toBeGreaterThanOrEqual(0);
    expect(panel!.x + panel!.width).toBeLessThanOrEqual(view.width);
    expect(panel!.y + panel!.height).toBeLessThanOrEqual(850);
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(audit.violations).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(popup).toBeHidden();
    await expect(field).toHaveValue('20:00');
    await expect(field).toBeFocused();
    await field.press('Alt+ArrowDown');
    await expect(
      popup.getByRole('spinbutton', { name: 'Hour', exact: true }),
    ).toBeFocused();
    await popup
      .getByRole('spinbutton', { name: 'Minute', exact: true })
      .press('ArrowUp');
    await expect(
      popup.getByRole('spinbutton', { name: 'Minute', exact: true }),
    ).toHaveValue('15');
    await popup.getByRole('button', { name: 'Apply', exact: true }).click();
    await expect(field).toHaveValue('20:15');
    await expect(field).toBeFocused();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
  });
}

test('themed controls: upload trigger keeps file chooser behavior and hides browser chrome', async ({
  page,
}) => {
  await page.goto('/workflows');
  const input = page.getByLabel('Lineup files', { exact: true });
  await expect(input).toBeHidden();
  const chooser = page.waitForEvent('filechooser');
  await page
    .getByRole('button', { name: 'Choose files: Lineup files', exact: true })
    .click();
  await (
    await chooser
  ).setFiles({
    name: 'lineup.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('Rays lineup'),
  });
  await expect(page.locator('jp-file-upload')).toContainText('lineup.txt');
  await expect(page.locator('jp-file-upload')).toContainText('Ready');
});

test('themed controls: calendar pointer navigation keeps the popup open', async ({
  page,
}) => {
  await page.goto('/workflows');
  await page
    .getByRole('button', { name: 'Choose Game date', exact: true })
    .click();
  const popup = page.getByRole('dialog', { name: 'Game date calendar' });
  await popup.getByRole('button', { name: 'Next month' }).click();
  await expect(popup).toBeVisible();
  await expect(popup).toContainText('November 2026');
  await popup.getByRole('button', { name: 'Previous month' }).click();
  await expect(popup).toContainText('October 2026');
  await popup.locator('[data-date="2026-10-20"]').click();
  await expect(page.getByLabel('Game date', { exact: true })).toHaveValue(
    '2026-10-20',
  );
});

test('themed controls: compact parent fields fit dates and hosts do not create browser tooltips', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1000, height: 1000 });
  await page.goto('/workflows');
  await expect(page.locator('[title]')).toHaveCount(0);
  const start = page.getByLabel('Start date', { exact: true });
  const end = page.getByLabel('End date', { exact: true });
  const first = await start.boundingBox(),
    last = await end.boundingBox();
  expect(last!.y).toBeGreaterThan(first!.y + first!.height);
  for (const field of [start, end]) {
    expect(
      await field.evaluate(
        (el: HTMLInputElement) => el.scrollWidth - el.clientWidth,
      ),
    ).toBeLessThanOrEqual(1);
  }
});
