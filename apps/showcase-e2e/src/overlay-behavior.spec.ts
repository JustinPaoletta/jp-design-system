import { expect, test } from '@playwright/test';

test.describe('native overlay behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/overlays');
    await expect(
      page.getByRole('heading', { name: 'Feedback & Overlays' }),
    ).toBeVisible();
  });

  test('modal dialog contains keyboard focus and restores its opener', async ({
    page,
  }) => {
    const opener = page.getByRole('button', {
      name: 'Delete deployment',
      exact: true,
    });
    await opener.click();
    const dialog = page.getByRole('dialog', { name: 'Delete deployment?' });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveJSProperty('open', true);
    expect(await dialog.evaluate((element) => element.matches(':modal'))).toBe(
      true,
    );
    for (let index = 0; index < 5; index++) {
      await page.keyboard.press('Tab');
      expect(
        await dialog.evaluate((element) =>
          element.contains(document.activeElement),
        ),
      ).toBe(true);
    }
    await page.keyboard.press('Shift+Tab');
    expect(
      await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBe(true);
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(opener).toBeFocused();
  });

  test('menu-to-dialog handoff restores focus to the menu trigger', async ({
    page,
  }) => {
    const trigger = page.getByRole('button', { name: 'Actions', exact: true });
    await trigger.click();
    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    expect(
      await menu.evaluate((element) => element.matches(':popover-open')),
    ).toBe(true);
    await expect(
      page.getByRole('menuitem', { name: 'Edit', exact: true }),
    ).toBeFocused();
    await page.getByRole('menuitem', { name: 'Delete…', exact: true }).click();
    await expect(menu).toBeHidden();
    const dialog = page.getByRole('dialog', { name: 'Delete deployment?' });
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate((element) => element.matches(':modal'))).toBe(
      true,
    );
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test('popover escapes a transformed clipping container and flips above the viewport edge', async ({
    page,
  }) => {
    // Constrain the existing Filters component; its Angular view and handlers stay intact.
    await page.locator('jp-popover').evaluate((host) => {
      const clip = document.createElement('div');
      clip.id = 'overlay-clip-boundary';
      clip.style.cssText =
        'position:fixed;right:8px;bottom:8px;width:180px;height:44px;overflow:hidden;transform:translateZ(0);z-index:100';
      host.parentElement?.insertBefore(clip, host);
      clip.append(host);
    });
    await page.getByRole('button', { name: 'Filters', exact: true }).click();
    const panel = page.locator('[jppopovercontent]');
    await expect(panel).toBeVisible();
    expect(
      await panel.evaluate((element) => element.matches(':popover-open')),
    ).toBe(true);
    // ResizeObserver must keep the final panel inside the same strict bounds
    // after WebKit's first-frame font/layout metrics settle.
    await expect
      .poll(async () =>
        panel.evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          return (
            bounds.right <= innerWidth - 7 && bounds.bottom <= innerHeight - 7
          );
        }),
      )
      .toBe(true);
    const geometry = await panel.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      const clip = document
        .getElementById('overlay-clip-boundary')!
        .getBoundingClientRect();
      const hit = document.elementFromPoint(
        bounds.left + bounds.width / 2,
        bounds.top + bounds.height / 2,
      );
      return {
        left: bounds.left,
        top: bounds.top,
        right: bounds.right,
        bottom: bounds.bottom,
        clipTop: clip.top,
        viewportWidth: innerWidth,
        viewportHeight: innerHeight,
        receivesPointer: !!hit && element.contains(hit),
      };
    });
    expect(geometry.top).toBeLessThan(geometry.clipTop);
    expect(geometry.left).toBeGreaterThanOrEqual(7);
    expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth - 7);
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight - 7);
    expect(geometry.receivesPointer).toBe(true);
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
  });

  test('Escape dismisses only the topmost of two open showcase panels', async ({
    page,
  }) => {
    // Programmatic clicks intentionally omit outside-pointer dismissal so both
    // existing sibling panels are open, exercising the shared overlay stack.
    const filters = page.getByRole('button', { name: 'Filters', exact: true });
    await filters.dispatchEvent('click');
    const popover = page.locator('[jppopovercontent]');
    await expect(popover).toBeVisible();
    await page
      .getByRole('button', { name: 'Actions', exact: true })
      .dispatchEvent('click');
    await expect(page.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toBeHidden();
    await expect(popover).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(popover).toBeHidden();
  });

  test('tooltip remains hoverable and preserves the trigger description on Escape', async ({
    page,
  }) => {
    const trigger = page.getByRole('button', { name: 'Copy ID', exact: true });
    await trigger.evaluate((element) =>
      element.setAttribute('aria-describedby', 'existing-description'),
    );
    await trigger.hover();
    const tooltip = page.getByRole('tooltip', { name: 'Copy deployment ID' });
    await expect(tooltip).toBeVisible();
    expect(
      await tooltip.evaluate((element) => element.matches(':popover-open')),
    ).toBe(true);
    await expect(trigger).toHaveAttribute(
      'aria-describedby',
      /existing-description jp-tooltip-/,
    );
    await tooltip.hover();
    await page.waitForTimeout(150); // Beyond the documented pointer-transfer grace interval.
    await expect(tooltip).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(tooltip).toHaveCount(0);
    await expect(trigger).toHaveAttribute(
      'aria-describedby',
      'existing-description',
    );
  });
});
