import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1800, height: 1100 });
  await page.goto('/scheduling');
  await expect(
    page.getByRole('heading', { name: 'Club events', exact: true }),
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
  const planning = calendar.getByRole('button', { name: /Lineup meeting,/ });
  await planning.focus();
  await planning.press('Enter');
  await expect(
    page.getByRole('complementary', { name: 'Appointment details' }),
  ).toContainText('Dave Roberts managed the 2024 Dodgers');
  await planning.press('Space');
  await expect(
    page.getByRole('heading', { name: 'Lineup meeting', exact: true }),
  ).toBeVisible();
  await calendar.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(planning).toHaveCount(0);
  await expect(
    calendar.getByRole('button', { name: /Meet the coaches,/ }),
  ).toBeVisible();
  await calendar.getByRole('button', { name: 'Previous', exact: true }).click();
  await expect(planning).toHaveCount(1);
  await calendar.getByRole('button', { name: 'Today', exact: true }).click();
  await calendar.getByRole('button', { name: 'Week', exact: true }).click();
  await expect(calendar.locator('.day')).toHaveCount(7);
  await expect(
    calendar.getByRole('button', { name: /Away series,/ }),
  ).toHaveCount(2);
});
test('scheduling: simultaneous appointments occupy separate lanes', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Day', exact: true }).click();
  const items = page.locator('jp-scheduling-calendar .timed li');
  await expect(page.locator('jp-scheduling-calendar .day')).toHaveCount(1);
  await expect(items.first()).toHaveCSS('position', 'absolute');
  const first = await items.nth(0).boundingBox();
  const second = await items.nth(1).boundingBox();
  const third = await items.nth(2).boundingBox();
  if (!first || !second || !third)
    throw new Error('Expected appointment placement');
  expect(Math.abs(first.x - second.x)).toBeGreaterThan(20);
  expect(Math.abs(second.x - third.x)).toBeGreaterThan(20);
  expect(first.x + first.width).toBeLessThanOrEqual(second.x + 1);
  expect(second.x + second.width).toBeLessThanOrEqual(third.x + 1);
  const day = await page
    .locator('jp-scheduling-calendar .day')
    .first()
    .boundingBox();
  if (!day) throw new Error('Expected the shared day column');
  expect(first.width).toBeGreaterThanOrEqual(24);
  expect(first.x).toBeGreaterThanOrEqual(day.x);
  expect(third.x + third.width).toBeLessThanOrEqual(day.x + day.width + 1);
  await page.evaluate(() => {
    document.documentElement.dir = 'rtl';
  });
  const rtlFirst = await items.nth(0).boundingBox();
  const rtlSecond = await items.nth(1).boundingBox();
  expect(rtlFirst?.x ?? 0).toBeGreaterThan(rtlSecond?.x ?? 0);
});
test('scheduling: spacious week shares aligned time tracks with equal day columns and contained scrolling', async ({
  page,
}) => {
  // Let this test exercise a component wider than the example page's normal limit.
  await page
    .locator('app-scheduling-page .page')
    .evaluate((element: HTMLElement) => {
      element.style.maxInlineSize = 'none';
    });
  await page.setViewportSize({ width: 3000, height: 1100 });
  const frame = page.locator('jp-scheduling-calendar .days');
  await expect(frame).toHaveAttribute('role', 'region');
  await expect(frame).toHaveAttribute('tabindex', '0');
  await expect(frame).not.toHaveClass(/overview/);
  await expect(
    page.getByRole('button', { name: /Lineup meeting,/ }),
  ).toHaveCount(1);
  await expect(frame.locator('.time-gutter')).toHaveCount(1);
  const dayGeometry = await frame.locator('.day').evaluateAll((days) =>
    days.map((day) => ({
      width: day.getBoundingClientRect().width,
      top: day.querySelector('.timeline')!.getBoundingClientRect().top,
    })),
  );
  expect(dayGeometry).toHaveLength(7);
  for (const day of dayGeometry) {
    expect(Math.abs(day.width - dayGeometry[0].width)).toBeLessThanOrEqual(1);
    expect(Math.abs(day.top - dayGeometry[0].top)).toBeLessThanOrEqual(1);
  }
  const planning = page.getByRole('button', { name: /Lineup meeting,/ });
  await expect(planning).toHaveAttribute(
    'title',
    /Lineup meeting.*9:00\sAM GMT-4.*10:30\sAM GMT-4/,
  );
  await expect(planning).toBeInViewport();
  // Friday's overnight continuation starts at midnight. The initial viewport
  // must include it instead of scrolling to Monday's first appointment.
  expect(await frame.evaluate((element) => element.scrollTop)).toBe(0);
  await expect(
    page.locator('.day[aria-label^="Fri"] .timed button'),
  ).toBeInViewport();
  expect(
    await frame.evaluate(
      (element) => element.scrollWidth - element.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
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
  ).toBeLessThanOrEqual(1);
});
test('scheduling: crowded week shows complete event rows and preserves focus through a layout change', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  const frame = page.locator('jp-scheduling-calendar .days');
  await expect(frame).toHaveClass(/overview/);
  await expect(frame.locator('.time-gutter')).toBeHidden();
  const widths = await frame
    .locator('.day')
    .evaluateAll((days) => days.map((day) => day.clientWidth));
  expect(widths).toHaveLength(7);
  expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(1);
  for (const event of await frame.locator('.timed button').all()) {
    await expect(event.locator('strong')).toBeVisible();
    await expect(event.locator('span')).toBeVisible();
    expect(
      await event
        .locator('strong')
        .evaluate((title) => title.scrollHeight <= title.clientHeight + 1),
    ).toBe(true);
  }
  expect(
    await frame.evaluate((el) => el.scrollWidth - el.clientWidth),
  ).toBeLessThanOrEqual(1);
  const friday = page.locator('.day[aria-label^="Fri"] .timed button');
  await friday.focus();
  // Let this test exercise a component wider than the example page's normal limit.
  await page
    .locator('app-scheduling-page .page')
    .evaluate((element: HTMLElement) => {
      element.style.maxInlineSize = 'none';
    });
  await page.setViewportSize({ width: 3000, height: 1100 });
  await expect(frame).not.toHaveClass(/overview/);
  await expect(friday).toBeFocused();
  await expect(friday).toBeInViewport();
});
test('scheduling: short slots preserve a title line and restore times in agenda and mobile rows', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.getByRole('button', { name: 'Day', exact: true }).click();
  const event = page.getByRole('button', { name: /Pitching practice,/ });
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
  await expect(time).toContainText(/10–10:45\sAM/);
  await expect(page.locator('jp-scheduling-calendar .period')).toContainText(
    'America/New_York',
  );
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
  const zone = page.getByRole('combobox', { name: 'Time zone', exact: true });
  await expect(zone).toHaveText('America/New_York');
  await zone.focus();
  await zone.press('Enter');
  await expect(page.getByRole('listbox')).toBeVisible();
  await expect(
    page.getByRole('option', { name: 'America/New_York', exact: true }),
  ).toHaveAttribute('aria-selected', 'true');
  await zone.press('ArrowDown');
  await zone.press('Escape');
  await expect(page.getByRole('listbox')).toBeHidden();
  await expect(zone).toBeFocused();
  await expect(zone).toHaveText('America/New_York');
  await expect(
    page.getByRole('button', { name: /Lineup meeting,.*9:00\sAM GMT-4/ }),
  ).toHaveCount(1);
  await zone.click();
  await page.getByRole('option', { name: 'UTC', exact: true }).click();
  await expect(zone).toHaveText('UTC');
  await expect(page.getByRole('listbox')).toBeHidden();
  await expect(
    page.getByRole('button', { name: /Lineup meeting,.*1:00\sPM GMT/ }),
  ).toHaveCount(1);
  await page
    .getByRole('button', { name: 'Inspect clock change', exact: true })
    .click();
  await expect(zone).toHaveText('America/New_York');
  const before = page.getByRole('button', {
    name: /Early field check,.*GMT-4/,
  });
  const after = page.getByRole('button', {
    name: /Late field check,.*GMT-5/,
  });
  await expect(before).toHaveCount(1);
  await expect(after).toHaveCount(1);
  await expect(page.locator('.time-gutter .hours')).toContainText(
    '1:00 AM GMT-4',
  );
  await expect(page.locator('.time-gutter .hours')).toContainText(
    '1:00 AM GMT-5',
  );
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
    calendar.getByRole('button', { name: /Lineup meeting,/ }),
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
    calendar.getByRole('button', { name: /Lineup meeting,/ }),
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
      name: /Pitching practice,/,
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
    ).toContainText('Jack Flaherty started');
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
        await page.getByRole('button', { name: /Batting practice,/ }).click();
        const result = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        expect(result.violations).toEqual([]);
      },
    );
