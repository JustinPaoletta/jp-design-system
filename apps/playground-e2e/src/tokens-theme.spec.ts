import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';

const GENERATED_TOKENS = JSON.parse(
  readFileSync(
    path.resolve(__dirname, '../../../libs/tokens/src/generated/tokens.json'),
    'utf8',
  ),
) as Record<string, unknown>;

function getToken(pathValue: string): string {
  const resolved = pathValue
    .split('.')
    .reduce<unknown>(
      (current, segment) =>
        current && typeof current === 'object'
          ? (current as Record<string, unknown>)[segment]
          : undefined,
      GENERATED_TOKENS,
    );

  if (typeof resolved !== 'string') {
    throw new Error(`Token not found at ${pathValue}`);
  }

  return resolved.toLowerCase();
}

const DEFAULT_ACCENT_SOLID = getToken(
  'semantic.accent.neon.color.accent.solid',
);
const COBALT_ACCENT_SOLID = getToken(
  'semantic.accent.cobalt.color.accent.solid',
);

async function getCssVar(page: Page, variable: string) {
  return page.evaluate((name) => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim()
      .toLowerCase();
    return value.replace(/^(-?)\./, '$10.');
  }, variable);
}

test.describe('playground token theming', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('uses default neon accent and default density when no data attributes are present', async ({
    page,
  }) => {
    await expect(page.locator('h1')).toContainText('Phase 2 Layout Dashboard');

    await expect(page.locator('html')).not.toHaveAttribute(
      'data-jp-accent',
      /.+/,
    );
    await expect(page.locator('html')).not.toHaveAttribute(
      'data-jp-density',
      /.+/,
    );

    expect(await getCssVar(page, '--jp-color-accent-solid')).toBe(
      DEFAULT_ACCENT_SOLID,
    );
    expect(await getCssVar(page, '--jp-space-md')).toBe('1rem');
  });

  test('switches accent tokens when data-jp-accent changes', async ({
    page,
  }) => {
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-jp-accent', 'cobalt');
    });

    await expect(page.locator('html')).toHaveAttribute(
      'data-jp-accent',
      'cobalt',
    );
    expect(await getCssVar(page, '--jp-color-accent-solid')).toBe(
      COBALT_ACCENT_SOLID,
    );

    await page.evaluate(() => {
      document.documentElement.removeAttribute('data-jp-accent');
    });

    await expect(page.locator('html')).not.toHaveAttribute(
      'data-jp-accent',
      /.+/,
    );
    expect(await getCssVar(page, '--jp-color-accent-solid')).toBe(
      DEFAULT_ACCENT_SOLID,
    );
  });

  test('switches spacing and control size tokens when data-jp-density=compact', async ({
    page,
  }) => {
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-jp-density', 'compact');
    });

    await expect(page.locator('html')).toHaveAttribute(
      'data-jp-density',
      'compact',
    );
    expect(await getCssVar(page, '--jp-space-md')).toBe('0.75rem');
    expect(await getCssVar(page, '--jp-size-control-md')).toBe('1.25rem');

    await page.evaluate(() => {
      document.documentElement.removeAttribute('data-jp-density');
    });

    await expect(page.locator('html')).not.toHaveAttribute(
      'data-jp-density',
      /.+/,
    );
    expect(await getCssVar(page, '--jp-space-md')).toBe('1rem');
    expect(await getCssVar(page, '--jp-size-control-md')).toBe('1.5rem');
  });
});
