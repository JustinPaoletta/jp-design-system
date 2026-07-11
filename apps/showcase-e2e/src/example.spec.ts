import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/phase-3-dashboard/);
  await expect(page.locator('h1')).toContainText('Phase 3 App Shell Dashboard');
});

test('phase 2 dashboard remains available', async ({ page }) => {
  await page.goto('/phase-2-dashboard');

  await expect(page).toHaveURL(/phase-2-dashboard/);
  await expect(page.locator('h1')).toContainText('Phase 2 Layout Dashboard');
});
