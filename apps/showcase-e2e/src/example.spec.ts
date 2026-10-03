import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/assistant/);
  await expect(page.locator('h1')).toContainText('Assistant System');
});

test('layout dashboard remains available', async ({ page }) => {
  await page.goto('/layout-dashboard');

  await expect(page).toHaveURL(/layout-dashboard/);
  await expect(page.locator('h1')).toContainText('Layout Dashboard');
});
