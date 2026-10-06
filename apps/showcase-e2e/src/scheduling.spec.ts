import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1800, height: 1100 });
  await page.goto('/scheduling');
  await expect(
    page.getByRole('heading', { name: 'Scheduling calendar', exact: true }),
  ).toBeVisible();
});
test('scheduling: date navigation and native appointment keyboard activation', async ({
  page,
}) => {
  const calendar = page.getByRole('region', {
    name: 'Team appointments',
    exact: true,
  });
  await calendar.getByRole('button', { name: 'Day', exact: true }).click();
  await expect(calendar.locator('.day')).toHaveCount(1);
  const planning = calendar.getByRole('button', { name: /Product planning,/ });
  await planning.focus();
  await planning.press('Enter');
  await expect(
    page.getByRole('complementary', { name: 'Appointment details' }),
  ).toContainText('Review the next release');
  await planning.press('Space');
  await expect(
    page.getByRole('heading', { name: 'Product planning', exact: true }),
  ).toBeVisible();
  await calendar.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(planning).toHaveCount(0);
  await expect(
    calendar.getByRole('button', { name: /Office hours,/ }),
  ).toBeVisible();
  await calendar.getByRole('button', { name: 'Previous', exact: true }).click();
  await expect(planning).toHaveCount(1);
  await calendar.getByRole('button', { name: 'Today', exact: true }).click();
  await calendar.getByRole('button', { name: 'Week', exact: true }).click();
  await expect(calendar.locator('.day')).toHaveCount(7);
  await expect(
    calendar.getByRole('button', { name: /Release window,/ }),
  ).toHaveCount(2);
});
test('scheduling: simultaneous appointments occupy separate lanes', async ({
  page,
}) => {
  const items = page.locator('jp-scheduling-calendar .timed li');
  const first = await items.nth(0).boundingBox();
  const second = await items.nth(1).boundingBox();
  const third = await items.nth(2).boundingBox();
  if (!first || !second || !third)
    throw new Error('Expected appointment placement');
  expect(Math.abs(first.x - second.x)).toBeGreaterThan(20);
  expect(Math.abs(second.x - third.x)).toBeGreaterThan(20);
  expect(first.x + first.width).toBeLessThanOrEqual(second.x + 1);
  expect(second.x + second.width).toBeLessThanOrEqual(third.x + 1);
  expect(first.width).toBeGreaterThanOrEqual(190);
  await page.evaluate(() => {
    document.documentElement.dir = 'rtl';
  });
  const rtlFirst = await items.nth(0).boundingBox();
  const rtlSecond = await items.nth(1).boundingBox();
  expect(rtlFirst?.x ?? 0).toBeGreaterThan(rtlSecond?.x ?? 0);
});
test('scheduling: dense desktop week keeps readable appointment labels and contained scrolling', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  const frame = page.locator('jp-scheduling-calendar .days');
  await expect(frame).toHaveAttribute('role', 'region');
  await expect(frame).toHaveAttribute('tabindex', '0');
  await expect(
    page.getByRole('button', { name: /Product planning,/ }),
  ).toHaveCount(1);
  const fit = await page
    .locator('.timed button[aria-label^="Product planning,"] strong')
    .evaluate((element) => ({
      width: element.clientWidth,
      content: element.scrollWidth,
    }));
  expect(
    await page
      .locator('.timed button[aria-label^="Product planning,"]')
      .evaluate((element) => element.clientWidth),
  ).toBeGreaterThanOrEqual(170);
  expect(fit.content).toBeLessThanOrEqual(fit.width + 1);
  expect(
    await frame.evaluate(
      (element) => element.scrollWidth > element.clientWidth,
    ),
  ).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
  const friday = page.locator('.day[aria-label^="Fri"] .timed button');
  await friday.focus();
  await expect(friday).toBeInViewport();
  expect(
    await frame.evaluate((element) => Math.abs(element.scrollLeft)),
  ).toBeGreaterThan(100);
});
test('scheduling: short slots preserve a title line and restore times in agenda and mobile rows', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  const event = page.getByRole('button', { name: /Engineering handoff,/ });
  const title = event.locator('strong');
  const time = event.locator('span');
  await expect(event).toHaveClass(/appointment--short/);
  await expect(title).toBeVisible();
  await expect(time).toBeHidden();
  const typography = await event.evaluate((element) => {
    const title = element.querySelector('strong') as HTMLElement;
    const titleRect = title.getBoundingClientRect();
    const buttonRect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      titleHeight: title.clientHeight,
      titleContent: title.scrollHeight,
      lineHeight: parseFloat(getComputedStyle(title).lineHeight),
      titleBottom: titleRect.bottom,
      availableBottom:
        buttonRect.bottom -
        parseFloat(style.paddingBottom) -
        parseFloat(style.borderBottomWidth),
    };
  });
  expect(typography.titleHeight + 1).toBeGreaterThanOrEqual(
    typography.lineHeight,
  );
  expect(typography.titleContent).toBeLessThanOrEqual(
    typography.titleHeight + 1,
  );
  expect(typography.titleBottom).toBeLessThanOrEqual(
    typography.availableBottom + 1,
  );
  await expect(event).toHaveAttribute(
    'aria-label',
    /10:00\sAM GMT-4.*10:45\sAM GMT-4/,
  );
  await expect(event).toHaveAttribute(
    'title',
    /10:00\sAM GMT-4.*10:45\sAM GMT-4/,
  );
  await page.getByRole('button', { name: 'Agenda', exact: true }).click();
  await expect(time).toBeVisible();
  await expect(time).toContainText(/10:00\sAM GMT-4.*10:45\sAM GMT-4/);
  await page.getByRole('button', { name: 'Schedule', exact: true }).click();
  await expect(time).toBeHidden();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(time).toBeVisible();
  const readable = await title.evaluate(
    (element) => element.scrollHeight <= element.clientHeight + 1,
  );
  expect(readable).toBe(true);
});
test('scheduling: time-zone conversion and clock-change instances remain distinct', async ({
  page,
}) => {
  await page
    .getByRole('combobox', { name: 'Time zone', exact: true })
    .selectOption('UTC');
  await expect(
    page.getByRole('button', { name: /Product planning,.*1:00\sPM GMT/ }),
  ).toHaveCount(1);
  await page
    .getByRole('button', { name: 'Inspect clock change', exact: true })
    .click();
  const before = page.getByRole('button', {
    name: /Before the clock change,.*GMT-4/,
  });
  const after = page.getByRole('button', {
    name: /After the clock change,.*GMT-5/,
  });
  await expect(before).toHaveCount(1);
  await expect(after).toHaveCount(1);
  const first = await before.boundingBox();
  const second = await after.boundingBox();
  expect((second?.y ?? 0) - (first?.y ?? 0)).toBeGreaterThan(40);
  await after.focus();
  await after.press('Enter');
  await expect(
    page.getByRole('complementary', { name: 'Appointment details' }),
  ).toContainText('Second occurrence');
});
test('scheduling: loading, retry and empty navigation recover without losing controls', async ({
  page,
}) => {
  const calendar = page.getByRole('region', {
    name: 'Team appointments',
    exact: true,
  });
  await page.getByRole('button', { name: 'Show loading', exact: true }).click();
  await expect(calendar).toHaveAttribute('aria-busy', 'true');
  await expect(
    calendar.getByRole('button', { name: /Product planning,/ }),
  ).toHaveCount(0);
  await page
    .getByRole('button', { name: 'Restore schedule', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Show calendar error', exact: true })
    .click();
  await expect(calendar.getByRole('alert')).toContainText(
    'Appointments could not be loaded',
  );
  await calendar.getByRole('button', { name: 'Retry', exact: true }).click();
  await expect(
    calendar.getByRole('button', { name: /Product planning,/ }),
  ).toHaveCount(1);
  await calendar.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(calendar).toContainText('No appointments');
});
for (const dir of ['ltr', 'rtl'])
  test('scheduling: readable mobile agenda ' + dir, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate((dir) => {
      document.documentElement.dir = dir;
    }, dir);
    const appointment = page.getByRole('button', {
      name: /Engineering handoff,/,
    });
    await expect(appointment).toBeVisible();
    const position = await appointment.evaluate(
      (el) => getComputedStyle(el.parentElement as HTMLElement).position,
    );
    expect(position).toBe('static');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    await appointment.click();
    await expect(
      page.getByRole('complementary', { name: 'Appointment details' }),
    ).toContainText('API boundaries');
  });
for (const accent of ['neon', 'cobalt'])
  for (const density of ['default', 'compact'])
    test(
      'scheduling: accessible appointments ' + accent + ' ' + density,
      async ({ page }) => {
        await page.evaluate(
          ({ accent, density }) => {
            document.documentElement.setAttribute('data-jp-accent', accent);
            document.documentElement.setAttribute('data-jp-density', density);
          },
          { accent, density },
        );
        await page.getByRole('button', { name: 'Agenda', exact: true }).click();
        await page.getByRole('button', { name: /Design review,/ }).click();
        const result = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        expect(result.violations).toEqual([]);
      },
    );
