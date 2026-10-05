import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator, type Page } from '@playwright/test';

const WCAG_21_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const routes = [
  'hierarchy',
  'scheduling',
  'interaction-tools',
  'data-performance',
] as const;

async function expectSemantics(page: Page) {
  const result = await new AxeBuilder({ page })
    .include('main')
    .withTags(WCAG_21_AA)
    .analyze();
  expect(result.violations).toEqual([]);
}

async function expectDefaultColorSemantics(page: Page) {
  // axe 4.13 mixes authored text-fill colors with forced background colors.
  // https://github.com/dequelabs/axe-core/issues/3978
  // Assert behavior in forced colors, then run the complete axe gate normally.
  await page.emulateMedia({ forcedColors: 'none' });
  expect(
    await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
  ).toBe(false);
  await expectSemantics(page);
}

async function expectOutline(locator: Locator) {
  const outline = await locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return { width: parseFloat(style.outlineWidth), style: style.outlineStyle };
  });
  expect(outline.width).toBeGreaterThanOrEqual(1);
  expect(outline.style).not.toBe('none');
}

const exercise: Record<(typeof routes)[number], (page: Page) => Promise<void>> =
  {
    hierarchy: async (page) => {
      await page.getByRole('button', { name: 'Expand Design' }).click();
      await expect(
        page.getByRole('checkbox', { name: 'Select Landing page' }),
      ).toBeVisible();
    },
    scheduling: async (page) => {
      // The schedule becomes an agenda at narrow widths; events stay operable.
      const event = page.getByRole('button', { name: /Product planning,/ });
      await event.focus();
      await event.press('Enter');
      await expect(
        page.getByRole('complementary', { name: 'Appointment details' }),
      ).toContainText('Product planning');
    },
    'interaction-tools': async (page) => {
      await page
        .getByRole('button', { name: 'Move down: Accessibility audit' })
        .click();
      await page
        .locator('jp-carousel')
        .getByRole('button', { name: 'Next slide' })
        .click();
      await expect(
        page.getByRole('textbox', { name: 'Workspace note' }),
      ).toBeVisible();
    },
    'data-performance': async (page) => {
      await expect(page.locator('jp-chart .plot')).toHaveAttribute(
        'data-rendered',
        'true',
      );
      await page.getByText('View chart data', { selector: 'summary' }).click();
      await page
        .locator('jp-virtual-table')
        .getByRole('button', { name: 'Paginated rows' })
        .click();
      await expect(
        page.locator('jp-virtual-table jp-table tbody tr'),
      ).toHaveCount(50);
    },
  };

// CSS viewport equivalents of a 1280px window at 200% and 400% zoom.
// These assertions do not stand in for actual browser zoom or screen readers.
for (const route of routes) {
  for (const [width, dir] of [
    [640, 'ltr'],
    [320, 'ltr'],
    [320, 'rtl'],
  ] as const) {
    const scan =
      width === 320 && dir === 'ltr'
        ? expectSemantics
        : () => Promise.resolve();
    test(`acceptance reflow: ${route} ${width}px ${dir}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(`/${route}`);
      await page.evaluate((dir) => (document.documentElement.dir = dir), dir);
      await expect(page.locator('h1')).toBeVisible();

      await exercise[route](page);

      // Tables may scroll inside their frames; the document must fit the viewport.
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
      ).toBeLessThanOrEqual(1);
      await scan(page);
    });
  }
}

test.describe('acceptance forced colors', () => {
  test.beforeEach(async ({ page, browserName }) => {
    // The supported forced-colors emulation target is explicitly Chromium.
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip(
      browserName !== 'chromium',
      'Forced-colors emulation is asserted in Chromium; Windows high contrast remains manual.',
    );
    await page.emulateMedia({
      forcedColors: 'active',
      reducedMotion: 'reduce',
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/hierarchy');
    expect(
      await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
    ).toBe(true);
  });

  test('tree and table keep selection and keyboard focus cues', async ({
    page,
  }) => {
    const item = page.getByRole('treeitem', {
      name: 'Wordmark.svg',
      exact: true,
    });
    await item.focus();
    await item.press('Space');
    await expect(item).toHaveAttribute('aria-selected', 'true');
    const row = item.locator(':scope > .row');
    await expectOutline(row);
    await expect(row).toHaveCSS('border-top-width', '1px');
    await page
      .getByRole('checkbox', { name: 'Select Website launch', exact: true })
      .check();
    const selected = page.locator('jp-tree-table tr.selected');
    await expectOutline(selected);
    const disclosure = page.locator('#project-breakdown-row-design button');
    await expect(disclosure).toHaveAccessibleName('Expand Design');
    await disclosure.focus();
    await disclosure.press('Enter');
    await expect(disclosure).toHaveAccessibleName('Collapse Design');
    await expectOutline(disclosure);
    await expect(
      page.getByRole('checkbox', { name: 'Select Landing page' }),
    ).toBeVisible();
    await expectDefaultColorSemantics(page);
  });

  test('reordering and carousel retain explicit controls and state', async ({
    page,
  }) => {
    await page.goto('/interaction-tools');
    const handle = page.locator(
      'jp-reorder button[data-item=audit][data-action=handle]',
    );
    await handle.focus();
    await handle.press('Space');
    await expectOutline(page.locator('jp-reorder li.picked'));
    await handle.press('ArrowDown');
    await handle.press('Enter');
    await expect(
      page
        .getByRole('list', { name: 'Release priorities' })
        .getByRole('listitem')
        .nth(1),
    ).toContainText('Accessibility audit');
    await expect(handle).toBeFocused();
    const next = page
      .locator('jp-carousel')
      .getByRole('button', { name: 'Next slide' });
    await next.focus();
    await next.press('Enter');
    await expectOutline(next);
    await expect(
      page.getByRole('textbox', { name: 'Workspace note' }),
    ).toBeVisible();
    await expect(
      page.locator('jp-carousel .pickers button.current'),
    ).toHaveAttribute('aria-disabled', 'true');
    await expectDefaultColorSemantics(page);
  });

  test('schedule keeps mode cues and appointment activation', async ({
    page,
  }) => {
    await page.goto('/scheduling');
    const agenda = page.getByRole('button', { name: 'Agenda', exact: true });
    await agenda.click();
    await expect(agenda).toHaveAttribute('aria-pressed', 'true');
    await expectOutline(agenda);
    const event = page.getByRole('button', { name: /Product planning,/ });
    await event.focus();
    await event.press('Enter');
    await expectOutline(event);
    await expect(
      page.getByRole('complementary', { name: 'Appointment details' }),
    ).toContainText('Product planning');
    await expectDefaultColorSemantics(page);
  });

  test('chart exposes equivalent data and table selection stays visible', async ({
    page,
  }) => {
    await page.goto('/data-performance');
    const chart = page.locator('jp-chart');
    await expect(chart.locator('.plot')).toBeHidden();
    await expect(chart.locator('details')).toHaveAttribute('open', '');
    const data = chart.getByRole('table', { name: 'Completed work by team' });
    await expect(data).toBeVisible();
    await expect(data.getByRole('row')).toHaveCount(7);
    await chart
      .getByRole('combobox', { name: 'Inspect category' })
      .selectOption('5');
    await expect(chart.locator('dl')).toContainText('57');
    const table = page.locator('jp-virtual-table');
    await table
      .getByRole('checkbox', { name: 'Select Service 00001', exact: true })
      .check();
    await expectOutline(table.locator('tr.selected'));
    await table.getByRole('button', { name: 'Paginated rows' }).click();
    await expect(
      table.getByRole('checkbox', {
        name: 'Select Service 00001',
        exact: true,
      }),
    ).toBeChecked();
    // Verify the runtime preference listener, not only startup under the preference.
    await page.emulateMedia({ forcedColors: 'none' });
    await expect(chart.locator('.plot')).toBeVisible();
    await expect(chart.locator('.plot')).toHaveAttribute(
      'data-rendered',
      'true',
    );
    await expect(chart.locator('details')).not.toHaveAttribute('open', '');
    await expectSemantics(page);
  });
});
