import { expect, test } from '@playwright/test';

test('validated settings keep input through failed save and retry', async ({
  page,
}) => {
  await page.goto('/product-recipes');
  await page.getByRole('tab', { name: 'Settings', exact: true }).click();
  await page
    .getByRole('button', { name: 'Save settings', exact: true })
    .click();
  await expect(
    page.getByText('Enter a valid notification email.'),
  ).toBeVisible();
  const email = page.getByLabel('Notification email');
  await email.fill('justin@example.com');
  await page
    .getByRole('button', { name: 'Save settings', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Saving settings', exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByText('Settings could not be saved. Your entries are preserved.'),
  ).toBeVisible();
  await expect(email).toHaveValue('justin@example.com');
  await page.getByRole('button', { name: 'Retry save', exact: true }).click();
  await expect(page.getByText('Your changes are now saved.')).toBeVisible();
});

test('sort, search, pagination, selection and destructive retry compose', async ({
  page,
}) => {
  await page.goto('/product-recipes');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('table')).toContainText('Billing worker');
  await page.getByLabel('Search services').fill('Payments');
  await expect(page.getByRole('table')).toContainText('Payments API');
  await page.getByRole('checkbox', { name: /Select Payments API/ }).check();
  await page
    .getByRole('button', { name: 'Delete selected', exact: true })
    .click();
  const dialog = page.getByRole('dialog', {
    name: 'Delete selected services?',
  });
  await dialog
    .getByRole('button', { name: 'Confirm deletion', exact: true })
    .click();
  await expect(
    dialog.getByText('The selected services could not be deleted. Try again.'),
  ).toBeVisible();
  await dialog
    .getByRole('button', { name: 'Confirm deletion', exact: true })
    .click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText('No matching services')).toBeVisible();
});
