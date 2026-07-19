import { expect, test } from '@playwright/test';

test.describe('app shell', () => {
  test('renders shell landmarks and collapses the sidebar on desktop', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/app-shell');

    const shell = page.locator('jp-app-shell');
    const sidebar = page.locator('.jp-app-shell__sidebar');
    const main = page.locator('.jp-app-shell__main');
    const collapseToggle = page.locator('.jp-app-shell__collapse-toggle');
    const activeNav = page.locator('.jp-app-shell-nav-item--active');

    await expect(shell).toBeVisible();
    await expect(sidebar).toBeVisible();
    await expect(main).toBeVisible();
    await expect(page.locator('h1')).toContainText(
      'App Shell Dashboard',
    );
    await expect(activeNav).toContainText('Overview');
    await expect(sidebar).toHaveAttribute('aria-expanded', 'true');

    await collapseToggle.click();
    await expect(shell).toHaveClass(/jp-app-shell--collapsed/);
    await expect(sidebar).toHaveAttribute('aria-expanded', 'false');
    await expect(collapseToggle).toHaveAttribute(
      'aria-label',
      'Expand sidebar',
    );

    await collapseToggle.click();
    await expect(shell).not.toHaveClass(/jp-app-shell--collapsed/);
  });

  test('opens and closes the mobile drawer at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/app-shell');

    const shell = page.locator('jp-app-shell');
    const menuToggle = page.locator('.jp-app-shell__menu-toggle');
    const sidebar = page.locator('.jp-app-shell__sidebar');
    const scrim = page.locator('.jp-app-shell__scrim');

    await expect(menuToggle).toBeVisible();
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(scrim).toHaveCount(0);

    await menuToggle.click();
    await expect(shell).toHaveClass(/jp-app-shell--mobile-nav-open/);
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(scrim).toBeVisible();
    await expect(sidebar).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(shell).not.toHaveClass(/jp-app-shell--mobile-nav-open/);
    await expect(scrim).toHaveCount(0);

    await menuToggle.click();
    await expect(scrim).toBeVisible();
    await scrim.click({ position: { x: 300, y: 100 } });
    await expect(shell).not.toHaveClass(/jp-app-shell--mobile-nav-open/);
  });
});
