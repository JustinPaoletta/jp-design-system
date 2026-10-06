import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// Same tags as quality.spec.ts. Do not add wcag22aa until target-size is an
// intentional, enabled gate. See docs/qa/SUPPORT_MATRIX.md.
const WCAG_21_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

async function expectWcag21Aa(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_21_AA).analyze();
  expect(results.violations).toEqual([]);
}

async function openOverlays(page: Page) {
  await page.goto('/overlays');
  await expect(
    page.getByRole('heading', { name: 'Feedback & Overlays' }),
  ).toBeVisible();
}

async function openRecipes(page: Page) {
  await page.goto('/product-recipes');
  await expect(
    page.getByRole('heading', { name: 'Product recipes' }),
  ).toBeVisible();
}

test.describe('a11y state coverage', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  test('open dialog meets WCAG AA', async ({ page }) => {
    await openOverlays(page);
    await page
      .getByRole('button', { name: 'Delete deployment', exact: true })
      .click();
    await expect(
      page.getByRole('dialog', { name: 'Delete deployment?' }),
    ).toBeVisible();
    await expectWcag21Aa(page);
  });

  test('open menu meets WCAG AA', async ({ page }) => {
    await openOverlays(page);
    await page.getByRole('button', { name: 'Actions', exact: true }).click();
    await expect(page.getByRole('menu')).toBeVisible();
    await expect(
      page.getByRole('menuitem', { name: 'Edit', exact: true }),
    ).toBeVisible();
    await expectWcag21Aa(page);
  });

  test('open popover meets WCAG AA', async ({ page }) => {
    await openOverlays(page);
    await page.getByRole('button', { name: 'Filters', exact: true }).click();
    await expect(page.getByText('Environment filters')).toBeVisible();
    await expectWcag21Aa(page);
  });

  test('combobox results meet WCAG AA', async ({ page }) => {
    await openRecipes(page);
    await page.getByRole('tab', { name: 'Settings', exact: true }).click();
    const region = page.getByRole('combobox', { name: 'Region' });
    await region.focus();
    await expect(region).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('option', { name: 'Europe' })).toBeVisible();
    await expectWcag21Aa(page);
  });

  test('validation error meets WCAG AA', async ({ page }) => {
    await openRecipes(page);
    await page.getByRole('tab', { name: 'Settings', exact: true }).click();
    await page
      .getByRole('button', { name: 'Save settings', exact: true })
      .click();
    const email = page.getByLabel('Notification email');
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(
      page.getByRole('alert').filter({
        hasText: 'Enter a valid notification email.',
      }),
    ).toBeVisible();
    await expectWcag21Aa(page);
  });

  test('selected table row meets WCAG AA', async ({ page }) => {
    await openRecipes(page);
    await page.getByRole('checkbox', { name: 'Select Payments API' }).check();
    await expect(page.getByRole('row', { name: /Payments API/ })).toHaveClass(
      /jp-table__row--selected/,
    );
    await expectWcag21Aa(page);
  });

  test('active tab meets WCAG AA', async ({ page }) => {
    await openRecipes(page);
    const services = page.getByRole('tab', { name: 'Services', exact: true });
    const settings = page.getByRole('tab', { name: 'Settings', exact: true });
    await expect(services).toHaveAttribute('aria-selected', 'true');
    await settings.click();
    await expect(settings).toHaveAttribute('aria-selected', 'true');
    await expect(services).toHaveAttribute('aria-selected', 'false');
    await expect(
      page.getByRole('heading', { name: 'Account settings' }),
    ).toBeVisible();
    await expectWcag21Aa(page);
  });

  test('assistant response meets WCAG AA', async ({ page }) => {
    await page.goto('/assistant');
    await expect(
      page.getByRole('heading', { name: 'Assistant System' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Ask about deployment' }).click();
    const panel = page.getByRole('complementary', { name: 'JP Assistant' });
    const composer = page.getByRole('textbox', {
      name: 'Message the assistant',
    });
    await expect(composer).toBeFocused();
    await composer.fill('What is the deployment status?');
    await composer.press('Enter');
    await expect(panel).toContainText(
      'Status looks healthy with one degraded dependency.',
    );
    await expectWcag21Aa(page);
  });

  test('keyboard opens and closes the actions menu and returns focus', async ({
    page,
  }) => {
    await openOverlays(page);
    const trigger = page.getByRole('button', { name: 'Actions', exact: true });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(
      page.getByRole('menuitem', { name: 'Edit', exact: true }),
    ).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('keyboard opens and closes the filters popover', async ({ page }) => {
    await openOverlays(page);
    const trigger = page.getByRole('button', { name: 'Filters', exact: true });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText('Environment filters')).toBeVisible();
    await expect(trigger).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.getByText('Environment filters')).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('keyboard opens combobox results and Escape keeps focus on the field', async ({
    page,
  }) => {
    await openRecipes(page);
    await page.getByRole('tab', { name: 'Settings', exact: true }).click();
    const region = page.getByRole('combobox', { name: 'Region' });
    await region.focus();
    await expect(region).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('ArrowDown');
    await expect(region).toHaveAttribute('aria-activedescendant', /.+/);
    await page.keyboard.press('Escape');
    await expect(region).toHaveAttribute('aria-expanded', 'false');
    await expect(region).toBeFocused();
  });

  test('keyboard closes the assistant and returns focus to the trigger', async ({
    page,
  }) => {
    await page.goto('/assistant');
    const trigger = page.getByRole('button', {
      name: 'Ask about deployment',
    });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(
      page.getByRole('textbox', { name: 'Message the assistant' }),
    ).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(
      page.locator('jp-assistant-panel .jp-assistant-panel__surface'),
    ).toHaveAttribute('aria-hidden', 'true');
    await expect(trigger).toBeFocused();
  });

  test('reduced motion removes shell and assistant transitions', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/app-shell');
    const sidebar = page.locator('.jp-app-shell__sidebar');
    await expect(sidebar).toBeVisible();
    await expect
      .poll(() =>
        sidebar.evaluate(
          (element) => getComputedStyle(element).transitionDuration,
        ),
      )
      .not.toBe('0s');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await expect(sidebar).toBeVisible();
    const shellMotion = await sidebar.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        property: style.transitionProperty,
        duration: style.transitionDuration,
      };
    });
    expect(shellMotion.property).toBe('none');
    expect(shellMotion.duration).toBe('0s');

    const toggle = page.locator('.jp-app-shell__collapse-toggle');
    await expect(toggle).toBeVisible();
    expect(
      await toggle.evaluate(
        (element) => getComputedStyle(element).transitionProperty,
      ),
    ).toBe('none');

    await page.goto('/assistant');
    const surface = page.locator('.jp-assistant-panel__surface');
    await expect(surface).toBeAttached();
    const panelMotion = await surface.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        property: style.transitionProperty,
        duration: style.transitionDuration,
      };
    });
    expect(panelMotion.property).toBe('none');
    expect(panelMotion.duration).toBe('0s');
  });
});
