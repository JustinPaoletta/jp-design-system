import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium, firefox, webkit } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export async function checkConsumerRuntime(directory, diagnostics) {
  const engines = { chromium, firefox, webkit };
  const selected = (process.env.CONSUMER_BROWSERS || 'chromium').split(',');
  if (selected.some((name) => !engines[name]))
    throw new Error('Unknown CONSUMER_BROWSERS engine');
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(
        new URL(request.url, 'http://localhost').pathname,
      );
      const file = path.resolve(
        directory,
        `.${pathname === '/' ? '/index.html' : pathname}`,
      );
      if (!file.startsWith(`${path.resolve(directory)}${path.sep}`)) {
        response.writeHead(403).end();
        return;
      }
      const types = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.svg': 'image/svg+xml',
        '.woff2': 'font/woff2',
      };
      response.setHeader(
        'Content-Type',
        types[path.extname(file)] || 'application/octet-stream',
      );
      response.end(await readFile(file));
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const baseURL = `http://127.0.0.1:${server.address().port}`;
  const results = [];
  try {
    for (const name of selected) {
      const browser = await engines[name].launch();
      try {
        for (const accent of ['gold', 'neon', 'cobalt'])
          for (const density of ['default', 'compact']) {
            const context = await browser.newContext({
              viewport: { width: 1280, height: 900 },
              reducedMotion: 'reduce',
            });
            const page = await context.newPage();
            const errors = [];
            page.on('pageerror', (error) => errors.push(error.message));
            try {
              await page.goto(baseURL);
              const fontLoaded = await page.evaluate(async () => {
                const faces = await document.fonts.load('400 16px Inter');
                return faces.some(
                  (face) => face.family === 'Inter' && face.status === 'loaded',
                );
              });
              expect(fontLoaded).toBe(true);
              await expect(
                page.getByRole('heading', {
                  name: 'Project settings',
                  exact: true,
                }),
              ).toBeVisible();
              await page.evaluate(
                ({ accent, density }) => {
                  document.documentElement.setAttribute(
                    'data-jp-accent',
                    accent,
                  );
                  document.documentElement.setAttribute(
                    'data-jp-density',
                    density,
                  );
                },
                { accent, density },
              );
              const role = page.getByRole('combobox', { name: 'Club role' });
              await expect(role).toHaveText('Scorekeeper');
              await role.click();
              await expect(page.getByRole('listbox')).toBeVisible();
              await expect(
                page.getByRole('option', { name: 'Medical staff' }),
              ).toBeDisabled();
              await role.press('Home');
              await role.press('Escape');
              await expect(role).toHaveText('Scorekeeper');
              await role.press('Enter');
              await role.press('Home');
              await role.press('Enter');
              await expect(role).toHaveText('Manager');
              expect(
                await page
                  .locator('form')
                  .evaluate((form) => new FormData(form).get('role')),
              ).toBe('admin');
              await page.getByRole('button', { name: 'Reset role' }).click();
              await expect(role).toHaveText('Scorekeeper');
              // Exercise the distributed popup code, not only text entry.
              const launchDate = page.getByLabel('Launch date', {
                exact: true,
              });
              await launchDate.press('ArrowDown');
              const calendar = page.getByRole('dialog', {
                name: 'Launch date calendar',
              });
              await expect(
                calendar.locator('[data-date="2026-10-10"]'),
              ).toBeFocused();
              await page.keyboard.press('ArrowRight');
              await page.keyboard.press('Enter');
              await expect(launchDate).toHaveValue('2026-10-11');
              await expect(launchDate).toBeFocused();
              await launchDate.press('ArrowDown');
              await page.keyboard.press('Escape');
              await expect(launchDate).toHaveValue('2026-10-11');
              await expect(launchDate).toBeFocused();
              for (const [label, date] of [
                ['Start date', '2026-10-10'],
                ['End date', '2026-10-12'],
              ]) {
                const field = page.getByLabel(label, { exact: true });
                await field.press('ArrowDown');
                await expect(
                  page
                    .getByRole('dialog', { name: `${label} calendar` })
                    .locator(`[data-date="${date}"]`),
                ).toBeFocused();
                await page.keyboard.press('Escape');
                await expect(field).toBeFocused();
              }
              const launchTime = page.getByRole('textbox', {
                name: 'Launch time',
                exact: true,
              });
              await launchTime.press('Alt+ArrowDown');
              const timePanel = page.getByRole('dialog', {
                name: 'Launch time',
                exact: true,
              });
              await expect(
                timePanel.getByRole('spinbutton', {
                  name: 'Hour',
                  exact: true,
                }),
              ).toBeFocused();
              await timePanel
                .getByRole('spinbutton', { name: 'Minute', exact: true })
                .press('ArrowUp');
              await timePanel
                .getByRole('button', { name: 'Apply', exact: true })
                .click();
              await expect(launchTime).toHaveValue('09:15');
              await expect(launchTime).toBeFocused();
              const project = page.getByLabel('Project name', { exact: true });
              await expect(project).toHaveAttribute(
                'aria-describedby',
                /consumer-project-hint/,
              );
              await project.fill('');
              await page
                .getByRole('button', { name: 'Save settings', exact: true })
                .click();
              const summary = page.getByRole('region', {
                name: 'There is a problem',
              });
              await expect(summary).toBeFocused();
              await summary
                .getByRole('link', { name: 'Enter a project name.' })
                .click();
              await expect(project).toBeFocused();
              await expect(project).toHaveAttribute('aria-invalid', 'true');
              await project.fill('Runtime project');
              await page
                .getByLabel('Start date', { exact: true })
                .fill('2026-10-15');
              await page
                .getByRole('button', { name: 'Save settings', exact: true })
                .click();
              await expect(
                summary.getByRole('link', {
                  name: 'Choose an ordered date range.',
                }),
              ).toBeVisible();
              await page
                .getByLabel('End date', { exact: true })
                .fill('2026-10-20');
              await page
                .getByLabel('Launch date', { exact: true })
                .fill('2026-10-15');
              await page
                .getByLabel('Launch time', { exact: true })
                .fill('10:15');
              await page
                .getByRole('checkbox', { name: 'Notify members', exact: true })
                .uncheck();
              await page
                .getByRole('button', { name: 'Save settings', exact: true })
                .click();
              await expect(project).toBeDisabled();
              await expect(role).toBeDisabled();
              await expect(page.getByRole('alert')).toContainText(
                'Your entries are preserved.',
              );
              await expect(project).toHaveValue('Runtime project');
              await expect(
                page.getByLabel('Launch date', { exact: true }),
              ).toHaveValue('2026-10-15');
              await expect(
                page.getByRole('checkbox', {
                  name: 'Notify members',
                  exact: true,
                }),
              ).not.toBeChecked();
              await page
                .getByRole('button', { name: 'Retry save', exact: true })
                .click();
              await expect(
                page.getByRole('status').filter({ hasText: 'Settings saved:' }),
              ).toHaveText('Settings saved: Runtime project');
              await expect(project).toBeEnabled();
              await page.getByRole('button', { name: /Member/ }).click();
              await page.getByRole('button', { name: /Member/ }).click();
              await expect(
                page.locator('jp-table tbody tr').first(),
              ).toContainText('Sam');
              await page.getByRole('checkbox', { name: /Select Alex/ }).check();
              const opener = page.getByRole('button', {
                name: 'Remove selected',
                exact: true,
              });
              await expect(opener).toBeEnabled();
              await opener.focus();
              await opener.press('Enter');
              const dialog = page.getByRole('dialog', {
                name: 'Remove selected members?',
              });
              await expect(dialog).toBeVisible();
              await page.keyboard.press('Shift+Tab');
              expect(
                await dialog.evaluate((element) =>
                  element.contains(document.activeElement),
                ),
              ).toBe(true);
              expect(
                (
                  await new AxeBuilder({ page })
                    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                    .analyze()
                ).violations,
              ).toEqual([]);
              await page.keyboard.press('Escape');
              await expect(opener).toBeFocused();
              await opener.press('Enter');
              await dialog
                .getByRole('button', { name: 'Confirm removal', exact: true })
                .click();
              await expect(page.locator('jp-table tbody tr')).toHaveCount(1);
              await expect(
                page.getByRole('status').filter({ hasText: 'Removed' }),
              ).toHaveText('Removed 1 members.');
              expect(
                (
                  await new AxeBuilder({ page })
                    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                    .analyze()
                ).violations,
              ).toEqual([]);
              expect(errors).toEqual([]);
              results.push({ browser: name, accent, density, passed: true });
              console.log(
                `Package runtime passed: ${name} ${accent} ${density}`,
              );
            } catch (error) {
              await mkdir(diagnostics, { recursive: true });
              await page
                .screenshot({
                  path: path.join(
                    diagnostics,
                    `${name}-${accent}-${density}.png`,
                  ),
                  fullPage: true,
                })
                .catch(() => undefined);
              if (errors.length)
                error.message += `\nRuntime errors: ${errors.join('\n')}`;
              throw error;
            } finally {
              await context.close();
            }
          }
      } finally {
        await browser.close();
      }
    }
    return results;
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}
