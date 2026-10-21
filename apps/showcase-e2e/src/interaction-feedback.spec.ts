import { expect, test } from '@playwright/test';

test('press feedback is immediate without activating early or moving the button', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/controls');
  const save = page.getByRole('button', { name: 'Save', exact: true });
  await save.hover();
  await save.evaluate((element) =>
    Promise.all(element.getAnimations().map((animation) => animation.finished)),
  );
  const before = await save.boundingBox();
  const shadow = await save.evaluate(
    (element) => getComputedStyle(element).boxShadow,
  );
  await page.mouse.down();
  expect(
    await save.evaluate((element) => getComputedStyle(element).boxShadow),
  ).not.toBe(shadow);
  expect(
    await save.evaluate(
      (element) => getComputedStyle(element).transitionDuration,
    ),
  ).toBe('0s');
  expect(await save.boundingBox()).toEqual(before);
  await expect(page.getByRole('status')).toHaveCount(0);
  await page.mouse.up();
  await expect(page.getByRole('status')).toHaveText(
    'Lineup saved in this preview.',
  );

  await page.keyboard.press('Tab');
  await save.focus();
  const style = await save.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      outline: style.outlineStyle,
      width: style.outlineWidth,
      properties: style.transitionProperty
        .split(',')
        .map((property) => property.trim()),
      durations: style.transitionDuration.split(',').map(parseFloat),
    };
  });
  expect(style.outline).toBe('solid');
  expect(style.width).toBe('2px');
  expect(
    style.properties.every((property) =>
      ['background-color', 'border-color', 'color'].includes(property),
    ),
  ).toBe(true);
  expect(
    style.durations.every((duration) => duration > 0 && duration <= 0.1),
  ).toBe(true);
});

test('refresh preserves button dimensions and roster position until recovery', async ({
  page,
}) => {
  await page.goto('/product-recipes');
  const refresh = page
    .locator('jp-button')
    .filter({ hasText: 'Refresh roster' })
    .locator('button');
  const results = page.getByRole('region', { name: 'Roster results' });
  const table = results.getByRole('table');
  await expect(table).toBeVisible();
  await page.clock.install();
  await page.clock.pauseAt(new Date());
  const buttonBefore = await refresh.boundingBox();
  const tableBefore = await table.boundingBox();
  const rowsBefore = await table.getByRole('row').allTextContents();
  await refresh.click();
  await page.clock.runFor(32);
  await expect(refresh).toHaveAccessibleName('Refreshing');
  await expect(refresh).toBeDisabled();
  await expect(results).toHaveAttribute('aria-busy', 'true');
  await expect(
    results.getByRole('progressbar', { name: 'Refreshing roster' }),
  ).toBeVisible();
  expect(await refresh.boundingBox()).toEqual(buttonBefore);
  expect(await table.boundingBox()).toEqual(tableBefore);
  expect(await table.getByRole('row').allTextContents()).toEqual(rowsBefore);
  expect(
    await refresh.evaluate(
      (element) =>
        getComputedStyle(element.querySelector('.jp-button__content')!)
          .visibility,
    ),
  ).toBe('hidden');
  const busyShadow = await refresh.evaluate(
    (element) => getComputedStyle(element).boxShadow,
  );
  await refresh.hover();
  await page.mouse.down();
  expect(
    await refresh.evaluate((element) => getComputedStyle(element).boxShadow),
  ).toBe(busyShadow);
  await page.mouse.up();
  await page.clock.fastForward(500);
  await page.clock.runFor(32);
  await expect(
    page.getByText(
      'The roster could not be refreshed. Existing players remain available.',
    ),
  ).toBeVisible();
  await expect(refresh).toBeEnabled();
  await expect(refresh).toHaveAccessibleName('Refresh roster');
  expect(await refresh.boundingBox()).toEqual(buttonBefore);
  await page
    .getByRole('button', { name: 'Retry refresh', exact: true })
    .click();
  await page.clock.fastForward(500);
  await page.clock.runFor(32);
  await expect(results).not.toHaveAttribute('aria-busy');
  await expect(results.getByRole('progressbar')).toHaveCount(0);
  expect(await table.getByRole('row').allTextContents()).toEqual(rowsBefore);
});

test('menus open and dismiss without layout animation or delayed keyboard focus', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/controls');
  const select = page.getByRole('combobox', { name: 'Club role' });
  await select.focus();
  await select.press('Enter');
  const menu = page.getByRole('listbox', { name: 'Club role' });
  await expect(menu).toBeVisible();
  await expect(select).toHaveAttribute('aria-expanded', 'true');
  expect(
    await menu.evaluate((element) => ({
      animation: getComputedStyle(element).animationName,
      transform: getComputedStyle(element).transform,
    })),
  ).toEqual({ animation: 'none', transform: 'none' });
  const before = await menu.boundingBox();
  await select.press('ArrowDown');
  expect(await menu.boundingBox()).toEqual(before);
  await select.press('Escape');
  await expect(menu).toBeHidden();
  await expect(select).toBeFocused();
});

for (const dir of ['ltr', 'rtl']) {
  test(`switch movement keeps its track fixed in ${dir}`, async ({ page }) => {
    await page.goto('/controls');
    await page
      .locator('html')
      .evaluate(
        (element, direction) => element.setAttribute('dir', direction),
        dir,
      );
    await page
      .locator('summary')
      .filter({ hasText: 'Preview settings' })
      .click();
    const control = page.getByRole('switch', { name: 'Compact density' });
    const track = control.locator('.jp-switch__track');
    const thumb = control.locator('.jp-switch__thumb');
    const before = await track.boundingBox();
    const thumbBefore = await thumb.boundingBox();
    await control.click();
    await expect(control).toHaveAttribute('aria-checked', 'true');
    await thumb.evaluate((element) =>
      Promise.all(
        element.getAnimations().map((animation) => animation.finished),
      ),
    );
    const after = (await track.boundingBox())!;
    const thumbAfter = (await thumb.boundingBox())!;
    expect(after.width).toBe(before!.width);
    expect(after.height).toBe(before!.height);
    expect(thumbAfter.width).toBe(thumbBefore!.width);
    expect(thumbAfter.x).toBeGreaterThanOrEqual(after.x);
    expect(thumbAfter.x + thumbAfter.width).toBeLessThanOrEqual(
      after.x + after.width,
    );
    expect(
      dir === 'rtl'
        ? thumbAfter.x < thumbBefore!.x
        : thumbAfter.x > thumbBefore!.x,
    ).toBe(true);
  });
}

test('reduced motion removes hover, switch, drawer and loading animation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/controls');
  const save = page.getByRole('button', { name: 'Save', exact: true });
  expect(
    await save.evaluate(
      (element) => getComputedStyle(element).transitionDuration,
    ),
  ).toBe('0s');
  await page.locator('summary').filter({ hasText: 'Preview settings' }).click();
  expect(
    await page
      .locator('.jp-switch__thumb')
      .evaluate((element) => getComputedStyle(element).transitionDuration),
  ).toBe('0s');
  await page.goto('/component-expansion');
  await page.getByRole('button', { name: 'Open details' }).click();
  const drawer = page.getByRole('dialog', { name: 'Club details' });
  expect(
    await drawer.evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('none');
  await expect(
    drawer.getByRole('button', { name: 'Close panel' }),
  ).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(drawer).toHaveCount(0);
  await page.goto('/product-recipes');
  await expect(
    page.getByRole('button', { name: 'Refresh roster', exact: true }),
  ).toBeVisible();
  await page.clock.install();
  await page.clock.pauseAt(new Date());
  await page
    .getByRole('button', { name: 'Refresh roster', exact: true })
    .click();
  await page.clock.runFor(32);
  for (const selector of ['.jp-button__spinner', '.jp-progress__fill']) {
    expect(
      await page
        .locator(selector)
        .evaluate((element) => getComputedStyle(element).animationName),
    ).toBe('none');
  }
});
