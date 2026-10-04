import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator } from '@playwright/test';
async function boxFor(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Expected visible element for pointer test');
  return box;
}
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/advanced-layout');
  await expect(
    page.getByRole('heading', {
      name: 'Advanced layout and data',
      exact: true,
    }),
  ).toBeVisible();
});
test('advanced layout: table visibility and exact widths persist, normalize, and reset', async ({
  page,
}) => {
  await page.getByText('Columns', { selector: 'summary' }).click();
  await page.getByRole('checkbox', { name: 'Owner', exact: true }).uncheck();
  await expect(
    page.getByRole('columnheader', { name: 'Owner', exact: true }),
  ).toHaveCount(0);
  const width = page.getByRole('spinbutton', {
    name: 'Width in pixels: Service',
  });
  await width.fill('330');
  await width.press('Tab');
  await expect(width).toHaveValue('330');
  await page.reload();
  await page.getByText('Columns', { selector: 'summary' }).click();
  await expect(width).toHaveValue('330');
  await expect(
    page.getByRole('checkbox', { name: 'Owner', exact: true }),
  ).not.toBeChecked();
  await page.getByRole('checkbox', { name: 'Region', exact: true }).uncheck();
  await page.getByRole('checkbox', { name: 'Status', exact: true }).uncheck();
  await expect(
    page.getByRole('checkbox', { name: 'Service', exact: true }),
  ).toBeDisabled();
  await page.getByRole('button', { name: 'Reset preferences' }).click();
  await expect(width).toHaveValue('220');
  await expect(
    page.getByRole('checkbox', { name: 'Owner', exact: true }),
  ).toBeChecked();
  await page.evaluate(() =>
    localStorage.setItem(
      'jp-demo-table-v1',
      '{"version":1,"visibleColumnKeys":["removed"],"columnWidths":{"name":9000,"removed":300}}',
    ),
  );
  await page.reload();
  await page.getByText('Columns', { selector: 'summary' }).click();
  await expect(width).toHaveValue('480');
  await expect(
    page.getByRole('columnheader', { name: 'Service', exact: true }),
  ).toBeVisible();
});
test('advanced layout: row details and selection stay independent', async ({
  page,
}) => {
  const expand = page.locator(
    '#service-inventory-detail-string-service-0-button',
  );
  await expand.click();
  await expect(expand).toHaveAttribute('aria-expanded', 'true');
  const row = page.locator('.jp-table__detail-row');
  await expect(row).toContainText('managed by Product in us-east-1');
  await row.getByRole('button', { name: 'Review deployment' }).click();
  await expect(page.getByRole('status')).toContainText(
    'Reviewed API gateway 1',
  );
  await page
    .getByRole('checkbox', { name: 'Select API gateway 1', exact: true })
    .check();
  await expect(
    page.getByRole('checkbox', { name: 'Select API gateway 1', exact: true }),
  ).toBeChecked();
  await page
    .getByRole('button', { name: 'Hide details: API gateway 1', exact: true })
    .click();
  await expect(row).toHaveCount(0);
  await expect(
    page.getByRole('checkbox', { name: 'Select API gateway 1', exact: true }),
  ).toBeChecked();
});
for (const dir of ['ltr', 'rtl'])
  test(
    'advanced layout: pointer resizing and sticky regions ' + dir,
    async ({ page }) => {
      await page.evaluate((dir) => (document.documentElement.dir = dir), dir);
      const frame = page.getByRole('region', { name: 'Services', exact: true });
      const header = page.getByRole('columnheader', {
        name: 'Service',
        exact: true,
      });
      const cell = page
        .locator('.jp-table__row')
        .first()
        .locator('.jp-table__pin');
      const initial = await boxFor(header);
      const cellInitial = await boxFor(cell);
      await frame.evaluate((el) => {
        el.scrollTop = 150;
        el.scrollLeft = el.ownerDocument.dir === 'rtl' ? -300 : 300;
      });
      const moved = await boxFor(header);
      const cellMoved = await boxFor(cell);
      expect(Math.abs(moved.y - initial.y)).toBeLessThan(45);
      expect(Math.abs(cellMoved.x - cellInitial.x)).toBeLessThan(2);
      await frame.evaluate((el) => {
        el.scrollTop = 0;
        el.scrollLeft = 0;
      });
      const handle = header.locator('.jp-table__resize');
      const box = await boxFor(handle);
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(
        box.x + box.width / 2 + (dir === 'rtl' ? -60 : 60),
        box.y + box.height / 2,
      );
      await page.mouse.up();
      await page.getByText('Columns', { selector: 'summary' }).click();
      await expect(
        page.getByRole('spinbutton', { name: 'Width in pixels: Service' }),
      ).toHaveValue('280');
    },
  );
for (const dir of ['ltr', 'rtl'])
  test(
    'advanced layout: splitter keyboard and pointer operation ' + dir,
    async ({ page }) => {
      await page.evaluate((dir) => (document.documentElement.dir = dir), dir);
      const separator = page.getByRole('separator', {
        name: 'Service overview',
      });
      await separator.focus();
      await separator.press(dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
      await expect(separator).toHaveAttribute('aria-valuenow', '36');
      await separator.press('End');
      await expect(separator).toHaveAttribute('aria-valuenow', '70');
      await separator.press('Enter');
      await expect(separator).toHaveAttribute('aria-valuenow', '0');
      await expect(
        page.getByRole('heading', { name: 'Service overview', exact: true }),
      ).toHaveCount(0);
      await separator.press('Enter');
      await expect(separator).toHaveAttribute('aria-valuenow', '70');
      await separator.press('Home');
      await expect(separator).toHaveAttribute('aria-valuenow', '20');
      const box = await boxFor(separator);
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(
        box.x + box.width / 2 + (dir === 'rtl' ? -90 : 90),
        box.y + box.height / 2,
      );
      await page.mouse.up();
      expect(
        Number(await separator.getAttribute('aria-valuenow')),
      ).toBeGreaterThan(25);
      const saved = await separator.getAttribute('aria-valuenow');
      await page.reload();
      await expect(separator).toHaveAttribute('aria-valuenow', saved ?? '');
    },
  );
test('advanced layout: mobile stacking restores both panes and focuses hidden separator safely', async ({
  page,
}) => {
  const separator = page.getByRole('separator', { name: 'Service overview' });
  await separator.focus();
  await separator.press('Enter');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(separator).toHaveCount(0);
  await expect(
    page.getByRole('heading', { name: 'Service overview', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Service inventory', exact: true }),
  ).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.locator('#service-workspace-primary')).toBeFocused();
  for (const dir of ['ltr', 'rtl']) {
    await page.evaluate((dir) => (document.documentElement.dir = dir), dir);
    const frame = page.getByRole('region', { name: 'Services', exact: true });
    await frame.evaluate((el) => {
      el.scrollTop = 0;
      el.scrollLeft = 0;
    });
    const cell = page
      .locator('.jp-table__row')
      .first()
      .locator('.jp-table__pin');
    const initial = await boxFor(cell);
    await frame.evaluate((el) => {
      el.scrollLeft = el.ownerDocument.dir === 'rtl' ? -180 : 180;
    });
    const moved = await boxFor(cell);
    expect(Math.abs(moved.x - initial.x)).toBeGreaterThan(100);
  }
});
test('advanced layout: meaningful image fallback and source recovery', async ({
  page,
}) => {
  await expect(
    page.getByRole('img', { name: 'Diagram of the service architecture' }),
  ).toBeVisible();
  await expect(page.locator('jp-media [aria-busy]')).toHaveAttribute(
    'aria-busy',
    'false',
  );
  await page.getByRole('button', { name: 'Show image error' }).click();
  await expect(
    page.getByRole('img', { name: 'Diagram of the service architecture' }),
  ).toHaveText('Image unavailable');
  await page.getByRole('button', { name: 'Restore image' }).click();
  await expect(page.locator('jp-media img')).toBeVisible();
  await expect(page.locator('jp-media [aria-busy]')).toHaveAttribute(
    'aria-busy',
    'false',
  );
});
for (const accent of ['neon', 'cobalt'])
  for (const density of ['default', 'compact'])
    test(
      'advanced layout: accessible controls ' + accent + ' ' + density,
      async ({ page }) => {
        await page.evaluate(
          ({ accent, density }) => {
            document.documentElement.setAttribute('data-jp-accent', accent);
            document.documentElement.setAttribute('data-jp-density', density);
          },
          { accent, density },
        );
        await page.getByText('Columns', { selector: 'summary' }).click();
        await page
          .getByRole('button', {
            name: 'Show details: API gateway 1',
            exact: true,
          })
          .click();
        const result = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        expect(result.violations).toEqual([]);
      },
    );
