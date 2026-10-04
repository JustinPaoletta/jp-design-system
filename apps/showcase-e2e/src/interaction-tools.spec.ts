import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/interaction-tools');
  await expect(
    page.getByRole('heading', { name: 'Interaction tools', exact: true }),
  ).toBeVisible();
});
test('interaction tools: click alternatives persist priorities and retain focus', async ({
  page,
}) => {
  const list = page.getByRole('list', { name: 'Release priorities' });
  const down = page.getByRole('button', {
    name: 'Move down: Accessibility audit',
  });
  await down.click();
  await expect(list.getByRole('listitem').nth(1)).toContainText(
    'Accessibility audit',
  );
  await expect(down).toBeFocused();
  await page.reload();
  await expect(list.getByRole('listitem').nth(1)).toContainText(
    'Accessibility audit',
  );
  await page.getByRole('button', { name: 'Reset priorities' }).click();
  await expect(list.getByRole('listitem').first()).toContainText(
    'Accessibility audit',
  );
  const boundary = page.getByRole('button', {
    name: 'Move up: Accessibility audit',
  });
  await expect(boundary).toHaveAttribute('aria-disabled', 'true');
  await boundary.evaluate((button) => (button as HTMLButtonElement).click());
  await expect(list.getByRole('listitem').first()).toContainText(
    'Accessibility audit',
  );
});
test('interaction tools: keyboard reorder supports pickup, boundaries, drop and cancellation', async ({
  page,
}) => {
  const list = page.getByRole('list', { name: 'Release priorities' });
  const handle = page.locator(
    'jp-reorder button[data-item=audit][data-action=handle]',
  );
  await handle.focus();
  await handle.press('Space');
  await handle.press('End');
  await expect(list.getByRole('listitem').last()).toContainText(
    'Accessibility audit',
  );
  await expect(page.locator('jp-reorder [role=status]')).toContainText(
    'position 4 of 4',
  );
  await handle.press('Escape');
  await expect(list.getByRole('listitem').first()).toContainText(
    'Accessibility audit',
  );
  await expect(handle).toBeFocused();
  await handle.press('Space');
  await handle.press('ArrowDown');
  await handle.press('Enter');
  await expect(list.getByRole('listitem').nth(1)).toContainText(
    'Accessibility audit',
  );
  await expect(handle).toBeFocused();
  await page.reload();
  await expect(list.getByRole('listitem').nth(1)).toContainText(
    'Accessibility audit',
  );
});
test('interaction tools: pointer handle drag commits once and retains focus', async ({
  page,
}) => {
  const handle = page.locator(
    'jp-reorder button[data-item=audit][data-action=handle]',
  );
  const list = page.getByRole('list', { name: 'Release priorities' });
  const start = await handle.boundingBox();
  const end = await list.getByRole('listitem').last().boundingBox();
  if (!start || !end) throw new Error('Expected draggable priorities');
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
  await page.mouse.down();
  await page.mouse.move(start.x + start.width / 2, end.y + end.height - 5, {
    steps: 6,
  });
  await page.mouse.up();
  await expect(list.getByRole('listitem').last()).toContainText(
    'Accessibility audit',
  );
  await expect(handle).toBeFocused();
  await page.reload();
  await expect(list.getByRole('listitem').last()).toContainText(
    'Accessibility audit',
  );
});
test('interaction tools: pointer cancellation restores draft without saving', async ({
  page,
}) => {
  const handle = page.locator(
    'jp-reorder button[data-item=audit][data-action=handle]',
  );
  const list = page.getByRole('list', { name: 'Release priorities' });
  const box = await handle.boundingBox();
  const end = await list.getByRole('listitem').last().boundingBox();
  if (!box || !end) throw new Error('Expected priorities');
  await handle.evaluate((el) =>
    el.addEventListener(
      'pointerdown',
      (event) =>
        el.setAttribute(
          'data-test-pointer',
          String((event as PointerEvent).pointerId),
        ),
      { once: true },
    ),
  );
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, end.y + end.height - 5, {
    steps: 3,
  });
  const pointerId = Number(await handle.getAttribute('data-test-pointer'));
  await page
    .locator('jp-reorder')
    .dispatchEvent('pointercancel', { pointerId });
  await page.mouse.up();
  await expect(list.getByRole('listitem').first()).toContainText(
    'Accessibility audit',
  );
  await page.reload();
  await expect(list.getByRole('listitem').first()).toContainText(
    'Accessibility audit',
  );
});
test('interaction tools: reference controls hide inactive content and preserve form input', async ({
  page,
}) => {
  const carousel = page.getByRole('region', { name: 'Workspace reference' });
  await expect(
    carousel.getByRole('button', { name: 'Open invitations' }),
  ).toBeVisible();
  await carousel.getByRole('button', { name: 'Next slide' }).click();
  await expect(
    carousel.getByRole('button', { name: 'Open invitations' }),
  ).toHaveCount(0);
  const note = carousel.getByRole('textbox', { name: 'Workspace note' });
  await note.fill('Review access');
  await note.press('ArrowRight');
  await expect(note).toBeVisible();
  await carousel
    .getByRole('button', { name: 'Review progress', exact: true })
    .click();
  await expect(note).toHaveCount(0);
  await carousel.getByRole('button', { name: 'Schedule a review' }).click();
  await expect(page.getByRole('status').last()).toHaveText('Review scheduled');
  await carousel
    .getByRole('button', { name: 'Set priorities', exact: true })
    .click();
  await expect(note).toHaveValue('Review access');
  await expect(carousel.locator('.slide[hidden]')).toHaveCount(2);
  await expect(carousel.locator('.slide[hidden]').first()).toHaveAttribute(
    'inert',
    '',
  );
});
test('interaction tools: viewport keys and RTL swipe direction are deliberate', async ({
  page,
}) => {
  await page.locator('html').evaluate((el) => el.setAttribute('dir', 'rtl'));
  const carousel = page.getByRole('region', { name: 'Workspace reference' });
  const viewport = carousel.locator('.viewport');
  await viewport.focus();
  await viewport.press('ArrowLeft');
  await expect(
    carousel.getByRole('heading', { name: 'Set priorities' }),
  ).toBeVisible();
  await viewport.press('End');
  await expect(
    carousel.getByRole('heading', { name: 'Review progress' }),
  ).toBeVisible();
  await viewport.press('Home');
  await expect(
    carousel.getByRole('heading', { name: 'Invite your team' }),
  ).toBeVisible();
  const box = await viewport.boundingBox();
  if (!box) throw new Error('Expected viewport');
  await page.mouse.move(box.x + 30, box.y + 10);
  await page.mouse.down();
  await page.mouse.move(box.x + 140, box.y + 10, { steps: 3 });
  await page.mouse.up();
  await expect(
    carousel.getByRole('heading', { name: 'Set priorities' }),
  ).toBeVisible();
});
test('interaction tools: mobile priorities and cards fit their containing page', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('html').evaluate((el) => el.setAttribute('dir', 'rtl'));
  await expect(
    page.getByRole('button', { name: 'Move down: Accessibility audit' }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Move down: Accessibility audit' })
    .click();
  await expect(
    page
      .getByRole('list', { name: 'Release priorities' })
      .getByRole('listitem')
      .nth(1),
  ).toContainText('Accessibility audit');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
for (const direction of ['ltr', 'rtl'] as const) {
  test(`interaction tools: accessible semantics with open draft, form slide and ${direction} direction`, async ({
    page,
  }) => {
    await page
      .locator('html')
      .evaluate((el, dir) => el.setAttribute('dir', dir), direction);
    await page
      .getByRole('button', { name: 'Reorder: Accessibility audit' })
      .click();
    await page
      .getByRole('button', { name: 'Set priorities', exact: true })
      .click();
    const scan = await new AxeBuilder({ page })
      .include('.page')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(scan.violations).toEqual([]);
  });
}
