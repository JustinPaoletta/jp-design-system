import { expect, test } from '@playwright/test';

const actionGroups = [
  {
    path: '/workflows',
    selectors: [
      'jp-split-button .primary',
      'jp-inline-edit button',
      'jp-notification-list .actions button',
    ],
  },
  {
    path: '/hierarchy',
    selectors: [
      'jp-tree-view .row:not(.disabled)',
      'jp-tree-table .disclosure:not(:disabled)',
    ],
  },
  {
    path: '/interaction-tools',
    selectors: [
      'jp-reorder .actions button:not([aria-disabled="true"])',
      'jp-carousel .controls button:not(:disabled)',
    ],
  },
  {
    path: '/component-expansion',
    selectors: ['jp-banner .dismiss', 'jp-avatar-group .overflow'],
  },
  {
    path: '/product-tools',
    selectors: ['jp-overflow-chip button', 'jp-stepper button:not(:disabled)'],
  },
  {
    path: '/data-performance',
    selectors: [
      'jp-virtual-table .modes button',
      'jp-virtual-table th button',
      'jp-chart .legend button',
      'jp-page-header a',
    ],
  },
  {
    path: '/scheduling',
    selectors: [
      'jp-scheduling-calendar .toggle button',
      'jp-scheduling-calendar .appointment',
    ],
  },
  { path: '/product-recipes', selectors: ['jp-table .jp-table__sort'] },
];

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`system feedback: immediate press without movement or early activation (${reducedMotion})`, async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.emulateMedia({ reducedMotion });
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const group of actionGroups) {
      await page.goto(group.path);
      for (const selector of group.selectors) {
        await test.step(`${group.path}: ${selector}`, async () => {
          const target = page.locator(selector).first();
          await expect(target).toBeVisible();
          await target.hover();
          await target.evaluate((element) =>
            Promise.all(
              element.getAnimations().map((animation) => animation.finished),
            ),
          );
          const before = await target.boundingBox();
          const style = await target.evaluate((element) => {
            const style = getComputedStyle(element);
            (window as Window & { feedbackClicks?: number }).feedbackClicks = 0;
            element.addEventListener(
              'click',
              () => {
                (window as Window & { feedbackClicks?: number })
                  .feedbackClicks!++;
              },
              { once: true },
            );
            return {
              color: style.color,
              background: style.backgroundColor,
              shadow: style.boxShadow,
              duration: style.transitionDuration,
            };
          });
          if (reducedMotion === 'reduce') expect(style.duration).toBe('0s');
          await page.mouse.down();
          const pressed = await target.evaluate((element) => {
            const style = getComputedStyle(element);
            return {
              color: style.color,
              background: style.backgroundColor,
              shadow: style.boxShadow,
              duration: style.transitionDuration,
              clicks: (window as Window & { feedbackClicks?: number })
                .feedbackClicks,
            };
          });
          expect(pressed.duration).toBe('0s');
          expect(pressed.clicks).toBe(0);
          expect(
            pressed.color !== style.color ||
              pressed.background !== style.background ||
              pressed.shadow !== style.shadow,
          ).toBe(true);
          expect(await target.boundingBox()).toEqual(before);
          await page.mouse.move(1430, 990);
          await page.mouse.up();
        });
      }
    }
  });
}

test('system feedback: slider dragging and keyboard changes preserve the control geometry', async ({
  page,
}) => {
  await page.goto('/product-tools');
  for (const selector of ['jp-slider .slider', 'jp-range-slider .slider']) {
    const slider = page.locator(selector).first();
    await slider.scrollIntoViewIfNeeded();
    const before = (await slider.boundingBox())!;
    await slider.press('Home');
    const initial = Number(await slider.inputValue());
    await slider.press('ArrowRight');
    await expect
      .poll(async () => Number(await slider.inputValue()))
      .toBeGreaterThan(initial);
    expect(await slider.boundingBox()).toEqual(before);
    await page.mouse.move(
      before.x + before.width * 0.25,
      before.y + before.height / 2,
    );
    await page.mouse.down();
    const valueBeforeMove = Number(await slider.inputValue());
    await page.mouse.move(
      before.x + before.width * 0.6,
      before.y + before.height / 2,
      { steps: 4 },
    );
    await expect
      .poll(async () => Number(await slider.inputValue()))
      .toBeGreaterThan(valueBeforeMove);
    expect(await slider.boundingBox()).toEqual(before);
    await page.mouse.up();
  }
});

test('system feedback: inline saving keeps the save and cancel controls in position', async ({
  page,
}) => {
  await page.goto('/workflows');
  await page.getByRole('button', { name: 'Edit: Collection name' }).click();
  const field = page.getByRole('textbox', { name: 'Collection name' });
  await field.fill('Game 6 archive');
  const save = page.locator('jp-inline-edit jp-button button');
  const cancel = page
    .locator('jp-inline-edit button')
    .filter({ hasText: 'Cancel' });
  const before = await save.boundingBox();
  const cancelBefore = await cancel.boundingBox();
  await page.clock.install();
  await page.clock.pauseAt(new Date());
  await save.click();
  await page.clock.runFor(32);
  await expect(save).toBeDisabled();
  await expect(save).toHaveAttribute('aria-busy', 'true');
  expect(await save.boundingBox()).toEqual(before);
  expect(await cancel.boundingBox()).toEqual(cancelBefore);
  await page.clock.fastForward(600);
  await page.clock.runFor(32);
  await expect(save).toBeEnabled();
  await expect(field).toHaveValue('Game 6 archive');
  expect(await save.boundingBox()).toEqual(before);
});

test('system feedback: password reveal keeps the field and action widths constant', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto('/component-expansion');
  const host = page.locator('jp-password-field');
  const field = host.locator('input');
  const reveal = host.locator('button');
  await field.fill('Rays-demo');
  await reveal.scrollIntoViewIfNeeded();
  const fieldBefore = await field.boundingBox();
  const actionBefore = await reveal.boundingBox();
  await reveal.click();
  await expect(field).toHaveAttribute('type', 'text');
  await expect(reveal).toHaveAccessibleName(/hide/i);
  expect(await field.boundingBox()).toEqual(fieldBefore);
  expect(await reveal.boundingBox()).toEqual(actionBefore);
  await reveal.press('Space');
  await expect(field).toHaveAttribute('type', 'password');
  await expect(field).toHaveValue('Rays-demo');
  await expect(reveal).toHaveAccessibleName(/show/i);
  expect(await field.boundingBox()).toEqual(fieldBefore);
});
