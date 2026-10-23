import { expect, test } from '@playwright/test';
const routes = [
  'hierarchy',
  'scheduling',
  'interaction-tools',
  'data-performance',
];
async function ready(page: import('@playwright/test').Page, route: string) {
  await page.goto('/' + route);
  await expect(page.locator('main .page')).toBeVisible();
  if (route === 'data-performance')
    await expect(page.locator('jp-chart .plot')).toHaveAttribute(
      'data-rendered',
      'true',
    );
}
for (const route of routes) {
  for (const accent of ['gold', 'neon', 'cobalt'])
    for (const density of ['default', 'compact'])
      test(
        'larger features visual desktop ' +
          route +
          ' ' +
          accent +
          ' ' +
          density,
        async ({ page }) => {
          await page.setViewportSize({ width: 1440, height: 1100 });
          await page.emulateMedia({ reducedMotion: 'reduce' });
          await ready(page, route);
          await page.evaluate(
            ({ accent, density }) => {
              document.documentElement.setAttribute('data-jp-accent', accent);
              document.documentElement.setAttribute('data-jp-density', density);
            },
            { accent, density },
          );
          if (route === 'data-performance')
            await expect(page.locator('jp-chart .plot')).toHaveAttribute(
              'data-rendered',
              'true',
            );
          let initialCalendarScroll: number | undefined;
          const calendarFrame = page.locator('jp-scheduling-calendar .days');
          if (route === 'scheduling') {
            await expect(
              page.getByRole('button', { name: /^Review Game 6 notes,/ }),
            ).toBeInViewport();
            initialCalendarScroll = await calendarFrame.evaluate(
              (element) => element.scrollTop,
            );
            const scrollable = await calendarFrame.evaluate(
              (element) => element.scrollHeight > element.clientHeight,
            );
            if (scrollable) expect(initialCalendarScroll).toBeGreaterThan(0);
            else {
              await expect(calendarFrame).toHaveClass(/overview/);
              for (const title of await calendarFrame
                .locator('.timed strong')
                .all()) {
                expect(
                  await title.evaluate(
                    (element) =>
                      element.scrollHeight <= element.clientHeight + 1,
                  ),
                ).toBe(true);
              }
              for (const time of await calendarFrame
                .locator('.timed span')
                .all())
                await expect(time).toBeVisible();
            }
            // Chromium's captureBeyondViewport resets this nested scroller.
            // Fit the page before capture and retain its natural scroll position.
            const pageHeight = await page.evaluate(() =>
              Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight,
              ),
            );
            await page.setViewportSize({
              width: 1440,
              height: Math.max(1100, pageHeight),
            });
            await expect(calendarFrame).toHaveJSProperty(
              'scrollTop',
              initialCalendarScroll,
            );
          }
          await expect(page).toHaveScreenshot(
            route + '-' + accent + '-' + density + '.png',
            { fullPage: true, animations: 'disabled', caret: 'hide' },
          );
          if (initialCalendarScroll !== undefined)
            await expect(calendarFrame).toHaveJSProperty(
              'scrollTop',
              initialCalendarScroll,
            );
        },
      );
  for (const dir of ['ltr', 'rtl'])
    test(
      'larger features visual mobile ' + route + ' ' + dir,
      async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await ready(page, route);
        await page.evaluate((dir) => (document.documentElement.dir = dir), dir);
        if (route === 'data-performance')
          await expect(page.locator('jp-chart .plot')).toHaveAttribute(
            'data-rendered',
            'true',
          );
        await expect(page).toHaveScreenshot(route + '-mobile-' + dir + '.png', {
          fullPage: true,
          animations: 'disabled',
          caret: 'hide',
        });
      },
    );
}
