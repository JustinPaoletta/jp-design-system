import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.goto('/data-performance');
  await expect(page.locator('jp-chart .plot')).toHaveAttribute(
    'data-rendered',
    'true',
  );
});
test('chart renders real pixels, legend controls, category inspection and equivalent data', async ({
  page,
}) => {
  const canvas = page.locator('jp-chart canvas');
  expect(
    await canvas.evaluate((element: HTMLCanvasElement) => {
      const pixels = element
        .getContext('2d')!
        .getImageData(0, 0, element.width, element.height).data;
      let painted = 0;
      for (let i = 3; i < pixels.length; i += 4) if (pixels[i] > 0) painted++;
      return painted;
    }),
  ).toBeGreaterThan(1000);
  await page.getByRole('button', { name: 'Product' }).click();
  await expect(page.getByRole('button', { name: 'Product' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  await page
    .getByRole('combobox', { name: 'Inspect category' })
    .selectOption('5');
  await expect(page.locator('jp-chart dl')).toContainText('57');
  await page.getByText('View chart data', { selector: 'summary' }).click();
  await expect(
    page.getByRole('table', { name: 'Completed work by team' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Show line chart' }).click();
  await expect(
    page.getByRole('button', { name: 'Show bar chart' }),
  ).toBeVisible();
  await expect(page.locator('jp-chart .plot')).toHaveAttribute(
    'data-rendered',
    'true',
  );
});
test('10,000-row table bounds DOM, reaches final rows and retains cross-window selection', async ({
  page,
}) => {
  const table = page.locator('jp-virtual-table');
  const frame = table.getByRole('region', { name: 'Large service inventory' });
  expect(await table.locator('tr[data-row-index]').count()).toBeLessThan(30);
  await expect(table.getByRole('table')).toHaveAttribute(
    'aria-rowcount',
    '10001',
  );
  await table
    .getByRole('checkbox', { name: 'Select Service 00001', exact: true })
    .check();
  const geometry = await table
    .locator('tr[data-row-index]')
    .first()
    .evaluate((e) => e.getBoundingClientRect().height);
  expect(geometry).toBeCloseTo(48, 0);
  await frame.evaluate((e) => {
    e.scrollTop = e.scrollHeight;
  });
  await expect(
    table.getByRole('cell', { name: 'Service 10000', exact: true }),
  ).toBeVisible();
  await table
    .getByRole('checkbox', { name: 'Select Service 10000', exact: true })
    .check();
  await expect(page.getByRole('status')).toContainText('2 services selected');
  await frame.evaluate((e) => {
    e.scrollTop = 0;
  });
  await expect(
    table.getByRole('checkbox', { name: 'Select Service 00001', exact: true }),
  ).toBeChecked();
});
test('paginated alternative exposes every row and controlled sorting', async ({
  page,
}) => {
  const table = page.locator('jp-virtual-table');
  await table.getByRole('button', { name: 'Paginated rows' }).click();
  await expect(table.locator('jp-table tbody tr')).toHaveCount(50);
  await table.getByRole('button', { name: 'Last page', exact: true }).click();
  await expect(
    table.getByRole('cell', { name: 'Service 10000', exact: true }),
  ).toBeVisible();
  await table.getByRole('button', { name: 'Requests', exact: false }).click();
  await table.getByRole('button', { name: 'Requests', exact: false }).click();
  await table.getByRole('button', { name: 'First page', exact: true }).click();
  await expect(table.locator('jp-table tbody tr').first()).toContainText(
    'Service 10000',
  );
});
test('zero overscan covers the full viewport across sticky-header and partial-row boundaries', async ({
  page,
}) => {
  await page.getByText('Rendering options', { selector: 'summary' }).click();
  await page
    .getByRole('spinbutton', { name: 'Extra rows around viewport' })
    .fill('0');
  const table = page.locator('jp-virtual-table');
  const frame = table.locator('.frame');
  const rows = table.locator('tr[data-row-index]');
  // The first index remains zero when this control updates; wait for the
  // buffered rows to leave before testing the zero-overscan geometry.
  await expect(rows).toHaveCount(7);
  for (const [offset, first, end] of [
    [24, 0, 8],
    [48, 1, 8],
    [1000, 20, 28],
  ]) {
    await frame.evaluate((element, value) => {
      element.scrollTop = value;
    }, offset);
    await expect(rows.first()).toHaveAttribute('data-row-index', String(first));
    await expect(rows.last()).toHaveAttribute(
      'data-row-index',
      String(end - 1),
    );
    await expect(rows).toHaveCount(end - first);
    const geometry = await frame.evaluate((element) => {
      const frame = element.getBoundingClientRect();
      const header = element.querySelector('thead th')?.getBoundingClientRect();
      const rows = Array.from(element.querySelectorAll('tr[data-row-index]'));
      const first = rows[0]?.getBoundingClientRect();
      const last = rows[rows.length - 1]?.getBoundingClientRect();
      if (!header || !first || !last)
        throw new Error('Expected complete virtual viewport');
      return {
        first: first.top,
        header: header.bottom,
        last: last.bottom,
        bottom: frame.bottom,
        count: rows.length,
      };
    });
    expect(geometry.first).toBeLessThanOrEqual(geometry.header + 1);
    expect(geometry.last).toBeGreaterThanOrEqual(geometry.bottom - 2);
    expect(geometry.count).toBeLessThanOrEqual(8);
  }
});
test('choosing an active table mode preserves its scrolled window and native page', async ({
  page,
}) => {
  const table = page.locator('jp-virtual-table');
  const frame = table.locator('.frame');
  await frame.evaluate((element) => {
    element.scrollTop = 48000;
  });
  await expect(table.locator('tr[data-row-index]').first()).toHaveAttribute(
    'data-row-index',
    '994',
  );
  await table
    .getByRole('button', { name: 'Scrollable rows', exact: true })
    .click();
  await expect(table.locator('tr[data-row-index]').first()).toHaveAttribute(
    'data-row-index',
    '994',
  );
  expect(await frame.evaluate((element) => element.scrollTop)).toBe(48000);
  await table
    .getByRole('button', { name: 'Paginated rows', exact: true })
    .click();
  await table.getByRole('button', { name: 'Last page', exact: true }).click();
  await table
    .getByRole('button', { name: 'Paginated rows', exact: true })
    .click();
  await expect(
    table.getByRole('cell', { name: 'Service 10000', exact: true }),
  ).toBeVisible();
  await expect(table.locator('jp-table tbody tr').first()).toContainText(
    'Service 09951',
  );
});
test('consumer sorting recovers focused checkbox before its row is recycled', async ({
  page,
}) => {
  const table = page.locator('jp-virtual-table');
  const frame = table.locator('.frame');
  const checkbox = table.getByRole('checkbox', {
    name: 'Select Service 00001',
    exact: true,
  });
  const requests = table.getByRole('columnheader', {
    name: 'Requests',
    exact: false,
  });
  await requests
    .getByRole('button')
    .evaluate((button: HTMLButtonElement) => button.click());
  await expect(requests).toHaveAttribute('aria-sort', 'ascending');
  await checkbox.focus();
  await requests
    .getByRole('button')
    .evaluate((button: HTMLButtonElement) => button.click());
  await expect(requests).toHaveAttribute('aria-sort', 'descending');
  await expect(frame).toBeFocused();
  await expect(checkbox).toHaveCount(0);
});
test('virtualization measurement records native full-table baseline and bounded consumer DOM', async ({
  page,
}, testInfo) => {
  const bounded = await page
    .locator('jp-virtual-table tr[data-row-index]')
    .count();
  const sample = await page.evaluate(() => {
    const start = performance.now();
    const table = document.createElement('table');
    table.style.position = 'absolute';
    table.style.insetInlineStart = '-100000px';
    const body = document.createElement('tbody');
    table.append(body);
    for (let i = 0; i < 10000; i++) {
      const row = document.createElement('tr');
      for (const text of ['Service ' + i, 'us-east-1', String(i * 17)]) {
        const cell = document.createElement('td');
        cell.textContent = text;
        row.append(cell);
      }
      body.append(row);
    }
    document.body.append(table);
    const height = table.offsetHeight;
    const ms = performance.now() - start;
    const nodes = table.querySelectorAll('*').length;
    table.remove();
    return { ms, nodes, height };
  });
  const measurement = {
    datasetRows: 10000,
    columns: 3,
    boundedRows: bounded,
    baseline:
      'native full-table construction plus layout, not Angular rendering',
    ...sample,
  };
  console.log('Virtualization measurement: ' + JSON.stringify(measurement));
  await testInfo.attach('virtualization-measurement', {
    body: JSON.stringify(measurement, null, 2),
    contentType: 'application/json',
  });
  expect(bounded).toBeLessThan(30);
  expect(sample.nodes).toBeGreaterThan(39000);
});
for (const accent of ['neon', 'cobalt'])
  for (const density of ['default', 'compact'])
    test(
      'analytics accessibility ' + accent + ' ' + density,
      async ({ page }) => {
        await page.evaluate(
          ({ accent, density }) => {
            document.documentElement.setAttribute('data-jp-accent', accent);
            document.documentElement.setAttribute('data-jp-density', density);
          },
          { accent, density },
        );
        await page
          .getByText('View chart data', { selector: 'summary' })
          .click();
        expect(
          (await new AxeBuilder({ page }).include('main').analyze()).violations,
        ).toEqual([]);
        await page
          .locator('jp-virtual-table')
          .getByRole('button', { name: 'Paginated rows' })
          .click();
        expect(
          (await new AxeBuilder({ page }).include('main').analyze()).violations,
        ).toEqual([]);
      },
    );
test('mobile RTL analytics remain readable and scroll without page overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => (document.documentElement.dir = 'rtl'));
  await expect(
    page.getByRole('combobox', { name: 'Inspect category' }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const frame = page.locator('jp-virtual-table .frame');
  await frame.evaluate((e) => {
    e.scrollTop = e.scrollHeight;
  });
  await expect(
    page.locator('jp-virtual-table tr[data-row-index]').last(),
  ).toContainText('Service 10000');
});
