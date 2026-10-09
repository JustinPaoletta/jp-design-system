import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const failure of ['missing', 'throws'] as const) {
  test.describe(`overlay fallback: ${failure} native APIs`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((failure) => {
        const replacement =
          failure === 'missing'
            ? undefined
            : () => {
                throw new DOMException(
                  'Forced native failure',
                  'InvalidStateError',
                );
              };
        Object.defineProperty(HTMLElement.prototype, 'showPopover', {
          configurable: true,
          value: replacement,
        });
        Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
          configurable: true,
          value: replacement,
        });
      }, failure);
      await page.goto('/overlays');
    });

    test('dialog contains keyboard focus and restores its opener', async ({
      page,
    }) => {
      const opener = page.getByRole('button', {
        name: 'Delete deployment',
        exact: true,
      });
      await opener.focus();
      await opener.press('Enter');
      const dialog = page.getByRole('dialog', { name: 'Delete deployment?' });
      await expect(dialog).toBeVisible();
      expect(
        await dialog.evaluate((element) => element.matches(':modal')),
      ).toBe(false);
      for (let index = 0; index < 6; index++) {
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

    test('menu is visible, operable and restores keyboard focus', async ({
      page,
    }) => {
      const opener = page.getByRole('button', { name: 'Actions', exact: true });
      await opener.focus();
      await opener.press('Enter');
      const menu = page.getByRole('menu');
      await expect(menu).toBeVisible();
      await expect(menu).not.toHaveAttribute('popover');
      await expect(
        page.getByRole('menuitem', { name: 'Edit', exact: true }),
      ).toBeFocused();
      await page.keyboard.press('ArrowDown');
      await expect(
        page.getByRole('menuitem', { name: 'Delete…', exact: true }),
      ).toBeFocused();
      expect(
        (
          await new AxeBuilder({ page })
            .include('main')
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze()
        ).violations,
      ).toEqual([]);
      await page.keyboard.press('Escape');
      await expect(menu).toBeHidden();
      await expect(opener).toBeFocused();
    });

    test('popover survives outside dismissal and can reopen', async ({
      page,
    }) => {
      const opener = page.getByRole('button', { name: 'Filters', exact: true });
      await opener.click();
      const panel = page.locator('[jppopovercontent]');
      await expect(panel).toBeVisible();
      await expect(panel).not.toHaveAttribute('popover');
      await page.getByRole('heading', { name: 'Feedback & Overlays' }).click();
      await expect(panel).toBeHidden();
      await opener.click();
      await expect(panel).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(panel).toBeHidden();
    });
  });
}
