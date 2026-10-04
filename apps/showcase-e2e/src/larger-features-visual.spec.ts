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
  for (const accent of ['neon', 'cobalt'])
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
          await expect(page).toHaveScreenshot(
            route + '-' + accent + '-' + density + '.png',
            { fullPage: true, animations: 'disabled', caret: 'hide' },
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
