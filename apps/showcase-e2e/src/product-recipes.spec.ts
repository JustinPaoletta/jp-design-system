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
  const email = page.getByLabel('Coach email');
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
  await email.fill('assistant@falcons.example');
  await expect(page.getByText('Your changes are now saved.')).toHaveCount(0);
  await page.clock.install();
  await page
    .getByRole('button', { name: 'Save settings', exact: true })
    .click();
  await email.fill('manager@falcons.example');
  await page.clock.fastForward(500);
  await expect(
    page.getByRole('button', { name: 'Save settings', exact: true }),
  ).toBeEnabled();
  await expect(page.getByText('Your changes are now saved.')).toHaveCount(0);
  await expect(email).toHaveValue('manager@falcons.example');
  await page
    .getByRole('button', { name: 'Save settings', exact: true })
    .click();
  await page.clock.fastForward(500);
  await expect(page.getByText('Your changes are now saved.')).toBeVisible();
});

test('sort, search, pagination, selection and destructive retry compose', async ({
  page,
}) => {
  await page.goto('/product-recipes');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('table')).toContainText('Maya Chen');
  await page.getByLabel('Search players').fill('Alex');
  await expect(page.getByRole('table')).toContainText('Alex Morgan');
  await page.getByRole('checkbox', { name: /Select Alex Morgan/ }).check();
  await page
    .getByRole('button', { name: 'Remove player', exact: true })
    .click();
  const dialog = page.getByRole('dialog', {
    name: 'Remove selected players?',
  });
  await dialog
    .getByRole('button', { name: 'Confirm deletion', exact: true })
    .click();
  await expect(
    dialog.getByText('The selected players could not be removed. Try again.'),
  ).toBeVisible();
  await dialog
    .getByRole('button', { name: 'Confirm deletion', exact: true })
    .click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText('No matching players')).toBeVisible();
});
