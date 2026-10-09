import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  publicClasses,
  maturityRows,
  inspectEvidence,
} from './check-api-readiness.mjs';

test('discovers named aliases and transitive exports without private classes or interfaces', () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'jp-api-audit-'));
  try {
    writeFileSync(
      path.join(directory, 'component.ts'),
      'export class Public {}\nexport class Private {}\nexport interface Value {}',
    );
    writeFileSync(
      path.join(directory, 'barrel.ts'),
      "export { Public as Renamed, type Value } from './component';",
    );
    writeFileSync(
      path.join(directory, 'index.ts'),
      "export * from './barrel';",
    );
    assert.deepEqual(
      publicClasses(path.join(directory, 'index.ts')).map((row) => row.name),
      ['Renamed'],
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('a missing class entry fails rather than silently treating it as preview', () => {
  assert.deepEqual(
    inspectEvidence([{ name: 'Missing' }], new Map(), () => null).findings,
    ['Missing: missing maturity entry'],
  );
});

test('checks actual component metadata even when its decorator import is aliased', () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'jp-api-metadata-'));
  try {
    writeFileSync(
      path.join(directory, 'angular.ts'),
      'export function Component(options: unknown) {}\nexport enum ChangeDetectionStrategy { OnPush, Eager }',
    );
    writeFileSync(
      path.join(directory, 'index.ts'),
      `import { Component as View, ChangeDetectionStrategy as Strategy } from './angular';
@View({ changeDetection: Strategy.OnPush }) export class Good {}
@View({ changeDetection: Strategy.Eager }) export class Eager {}
@View({}) export class Missing {}
export class Plain {}`,
    );
    assert.deepEqual(
      publicClasses(path.join(directory, 'index.ts')).map(
        ({ name, onPush }) => ({ name, onPush }),
      ),
      [
        { name: 'Eager', onPush: false },
        { name: 'Good', onPush: true },
        { name: 'Missing', onPush: false },
        { name: 'Plain', onPush: true },
      ],
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('duplicate and removed public class rows fail', () => {
  const row = '| `Public` | `public.spec.ts` | `public.stories.ts` | Gap |';
  assert.throws(
    () =>
      maturityRows(`## Preview classes\n${row}\n${row}`, new Set(['Public'])),
    /Duplicate/,
  );
  assert.throws(
    () => maturityRows(`## Preview classes\n${row}`, new Set()),
    /not public/,
  );
});

test('preview group references do not downgrade an established stable class', () => {
  const rows = maturityRows(
    '## Stable classes\n| `Public` | `public.spec.ts` | `public.stories.ts` | Limit |\n## Component expansion preview inventory\n`Public` and `New` have extensions.',
    new Set(['Public', 'New']),
  );
  assert.equal(rows.get('Public').level, 'stable');
  assert.equal(rows.get('New').level, 'preview');
});

test('missing evidence, OnPush and recorded preview gaps are independent failures', () => {
  const result = inspectEvidence(
    [{ name: 'Public', onPush: false }],
    new Map([['Public', { level: 'preview', reason: '' }]]),
    () => null,
  );
  assert.equal(result.findings.length, 4);
  assert.equal(result.counts.preview, 1);
  assert.equal(result.inventory[0].promotionApproved, false);
});

test('deprecated compatibility classes do not require stories or OnPush', () => {
  const result = inspectEvidence(
    [{ name: 'Ui', onPush: false }],
    new Map([['Ui', { level: 'deprecated' }]]),
    () => 'ui.spec.ts',
  );
  assert.deepEqual(result.findings, []);
  assert.equal(result.inventory[0].story, null);
});
