import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/hierarchy');
  await expect(
    page.getByRole('heading', {
      name: '2024 Dodgers roster',
      exact: true,
    }),
  ).toBeVisible();
});
for (const dir of ['ltr', 'rtl']) {
  test(
    'hierarchy: tree keyboard navigation and explicit selection ' + dir,
    async ({ page }) => {
      await page.evaluate((dir) => (document.documentElement.dir = dir), dir);
      const tree = page.getByRole('tree', { name: 'Club documents' });
      const brand = tree.getByRole('treeitem', {
        name: 'Club documents',
        exact: true,
      });
      await brand.focus();
      await brand.press('ArrowDown');
      const logos = tree.getByRole('treeitem', {
        name: 'Lineup sheets',
        exact: true,
      });
      await expect(logos).toBeFocused();
      await expect(logos).toHaveAttribute('aria-selected', 'false');
      await logos.press(dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
      const wordmark = tree.getByRole('treeitem', {
        name: 'Lineup.svg',
        exact: true,
      });
      await expect(wordmark).toBeFocused();
      await wordmark.press('Space');
      await expect(wordmark).toHaveAttribute('aria-selected', 'true');
      await wordmark.press('Enter');
      await expect(
        page.getByRole('status').filter({ hasText: 'Opened' }),
      ).toContainText('Opened Lineup.svg');
      await wordmark.press('End');
      const archived = tree.getByRole('treeitem', {
        name: 'Previous season',
        exact: true,
      });
      await expect(archived).toBeFocused();
      await archived.press('Enter');
      await expect(wordmark).toHaveAttribute('aria-selected', 'true');
      await archived.press('Home');
      await expect(brand).toBeFocused();
      await brand.press('g');
      await expect(
        tree.getByRole('treeitem', { name: 'Game documents', exact: true }),
      ).toBeFocused();
    },
  );
}
test('hierarchy: lazy branch loading, error and keyboard retry', async ({
  page,
}) => {
  const library = page.getByRole('treeitem', {
    name: 'Training guides',
    exact: true,
  });
  await library.focus();
  await library.press('ArrowRight');
  await expect(library).toHaveAttribute('aria-busy', 'true');
  await expect(
    page.getByRole('button', { name: 'Retry: Training guides' }),
  ).toBeVisible();
  await library.press('Enter');
  await expect(
    page.getByRole('treeitem', { name: 'Uniform-guide.pdf', exact: true }),
  ).toBeVisible();
  await library.press('ArrowRight');
  await expect(
    page.getByRole('treeitem', { name: 'Uniform-guide.pdf', exact: true }),
  ).toBeFocused();
});
test('hierarchy: consumer collapse restores a focused descendant to its ancestor', async ({
  page,
}) => {
  await page.getByRole('treeitem', { name: 'Lineup.svg', exact: true }).focus();
  await page
    .getByRole('button', { name: 'Collapse folders' })
    .evaluate((button: HTMLButtonElement) => button.click());
  await expect(
    page.getByRole('treeitem', { name: 'Club documents', exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole('treeitem', { name: 'Lineup.svg', exact: true }),
  ).toHaveCount(0);
});
test('hierarchy: collapsing a project returns hidden checkbox focus to the disclosure', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Expand Position players' }).click();
  await page.getByRole('checkbox', { name: 'Select Infield' }).focus();
  const parent = page.locator('#project-breakdown-row-website button');
  await parent.evaluate((button: HTMLButtonElement) => button.click());
  await expect(parent).toBeFocused();
  await expect(
    page.getByRole('checkbox', { name: 'Select Infield' }),
  ).toBeHidden();
});
test('hierarchy: native table disclosure buttons preserve independent hidden selection', async ({
  page,
}) => {
  const table = page.getByRole('table', { name: '2024 Dodgers roster' });
  await expect(page.getByRole('treegrid')).toHaveCount(0);
  const design = table.getByRole('button', { name: 'Expand Position players' });
  await design.focus();
  await design.press('Enter');
  const landing = table.getByRole('checkbox', {
    name: 'Select Infield',
  });
  await landing.check();
  await expect(
    table.getByRole('checkbox', { name: 'Select Position players', exact: true }),
  ).not.toBeChecked();
  const website = page.locator('#project-breakdown-row-website button');
  await website.focus();
  await website.press('Space');
  await expect(landing).toBeHidden();
  await expect(
    page.getByRole('status').filter({ hasText: 'Selected groups:' }),
  ).toHaveText('Selected groups: 1');
  await website.press('Enter');
  await expect(landing).toBeChecked();
  await expect(
    table.getByRole('checkbox', { name: 'Select Injured list' }),
  ).toBeDisabled();
});
for (const dir of ['ltr', 'rtl']) {
  test(
    'hierarchy: mobile layout and accessible expanded consumer flow ' + dir,
    async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.evaluate((dir) => (document.documentElement.dir = dir), dir);
      await page.getByRole('button', { name: 'Expand Position players' }).click();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(result.violations).toEqual([]);
    },
  );
}
