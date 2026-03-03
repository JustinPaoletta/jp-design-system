import { readFileSync } from 'node:fs';
import * as path from 'node:path';

import {
  JP_ACCENT_FAMILIES,
  JP_DENSITY_MODES,
  JP_GENERATED_TOKEN_FILES,
  getAccentSelector,
  getDensitySelector,
  isAccentFamily,
  isDensityMode,
} from './tokens';

const TOKENS_ROOT = path.resolve(__dirname, '../tokens');
const GENERATED_ROOT = path.resolve(__dirname, '../generated');

function readJson(relativePath: string): unknown {
  return JSON.parse(readFileSync(path.join(TOKENS_ROOT, relativePath), 'utf8'));
}

function getByPath(
  object: Record<string, unknown>,
  pathValue: string,
): unknown {
  return pathValue
    .split('.')
    .reduce<unknown>(
      (current, segment) =>
        current && typeof current === 'object'
          ? (current as Record<string, unknown>)[segment]
          : undefined,
      object,
    );
}

function flattenTokenValues(
  node: unknown,
  pathParts: string[] = [],
): Array<{ path: string; value: string }> {
  if (!node || typeof node !== 'object') {
    return [];
  }

  const valueNode = node as { value?: unknown };
  if (typeof valueNode.value === 'string') {
    return [{ path: pathParts.join('.'), value: valueNode.value }];
  }

  return Object.entries(node as Record<string, unknown>).flatMap(
    ([key, child]) => flattenTokenValues(child, [...pathParts, key]),
  );
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  const output: Record<string, unknown> = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (isObject(value) && isObject(output[key])) {
      output[key] = deepMerge(output[key] as Record<string, unknown>, value);
      continue;
    }

    output[key] = value;
  }

  return output;
}

describe('token source contracts', () => {
  it('contains required primitive categories', () => {
    const primitives = readJson('primitives/color.neutral.json') as Record<
      string,
      unknown
    >;

    expect(getByPath(primitives, 'primitive.color.neutral')).toBeTruthy();

    const primitiveFiles = [
      'primitives/color.accent.json',
      'primitives/typography.json',
      'primitives/spacing.json',
      'primitives/radius.json',
      'primitives/elevation.json',
      'primitives/motion.json',
    ];

    for (const file of primitiveFiles) {
      expect(() => readJson(file)).not.toThrow();
    }
  });

  it('semantic aliases resolve to defined token references', () => {
    const primitives = [
      'primitives/color.neutral.json',
      'primitives/color.accent.json',
      'primitives/typography.json',
      'primitives/spacing.json',
      'primitives/radius.json',
      'primitives/elevation.json',
      'primitives/motion.json',
    ].reduce<Record<string, unknown>>((merged, file) => {
      const current = readJson(file) as Record<string, unknown>;
      return deepMerge(merged, current);
    }, {});

    const semanticBase = readJson('semantic/base.json') as Record<
      string,
      unknown
    >;
    const context = deepMerge(primitives, semanticBase);

    for (const token of flattenTokenValues(semanticBase)) {
      const references = token.value.match(/\{([^}]+)\}/g) ?? [];

      for (const reference of references) {
        const referencePath = reference.slice(1, -1);
        expect(getByPath(context, referencePath)).toBeTruthy();
      }
    }
  });

  it('accent families expose the same semantic keys', () => {
    const neon = readJson('semantic/accent.neon.json');
    const cobalt = readJson('semantic/accent.cobalt.json');

    const neonKeys = flattenTokenValues(neon)
      .map((entry) => entry.path)
      .sort();
    const cobaltKeys = flattenTokenValues(cobalt)
      .map((entry) => entry.path)
      .sort();

    expect(cobaltKeys).toEqual(neonKeys);
  });

  it('compact density overrides only spacing and control sizes', () => {
    const compact = readJson('modes/density.compact.json') as Record<
      string,
      unknown
    >;

    const topLevelKeys = Object.keys(compact).sort();
    expect(topLevelKeys).toEqual(['size', 'space']);

    const size = compact['size'] as Record<string, unknown>;
    expect(Object.keys(size).sort()).toEqual(['control']);
  });
});

describe('generated artifacts', () => {
  it('includes all required generated output files', () => {
    for (const file of JP_GENERATED_TOKEN_FILES) {
      const filePath = path.join(GENERATED_ROOT, file);
      expect(() => readFileSync(filePath, 'utf8')).not.toThrow();
    }
  });

  it('tokens.css contains root and accent selectors with expected vars', () => {
    const css = readFileSync(path.join(GENERATED_ROOT, 'tokens.css'), 'utf8');

    expect(css).toContain(':root');
    expect(css).toContain('[data-jp-accent="neon"]');
    expect(css).toContain('[data-jp-accent="cobalt"]');
    expect(css).toContain('--jp-color-surface-canvas');
    expect(css).toContain('--jp-color-text-primary');
  });

  it('tokens.compact.css contains compact density overrides', () => {
    const css = readFileSync(
      path.join(GENERATED_ROOT, 'tokens.compact.css'),
      'utf8',
    );

    expect(css).toContain('[data-jp-density="compact"]');
    expect(css).toContain('--jp-space-md');
    expect(css).toContain('--jp-size-control-md');
  });

  it('tokens.json exposes resolved accent and density sections', () => {
    const json = JSON.parse(
      readFileSync(path.join(GENERATED_ROOT, 'tokens.json'), 'utf8'),
    ) as Record<string, unknown>;

    expect(
      getByPath(json, 'semantic.accent.neon.color.accent.solid'),
    ).toBeTruthy();
    expect(
      getByPath(json, 'semantic.accent.cobalt.color.accent.solid'),
    ).toBeTruthy();
    expect(getByPath(json, 'semantic.density.compact.space.md')).toBeTruthy();
  });
});

describe('token metadata API', () => {
  it('returns expected selectors for accent and density', () => {
    expect(getAccentSelector('neon')).toContain(':root');
    expect(getAccentSelector('cobalt')).toBe('[data-jp-accent="cobalt"]');
    expect(getDensitySelector('default')).toBe(':root');
    expect(getDensitySelector('compact')).toBe('[data-jp-density="compact"]');
  });

  it('guards supported accent and density values', () => {
    for (const accent of JP_ACCENT_FAMILIES) {
      expect(isAccentFamily(accent)).toBe(true);
    }

    for (const density of JP_DENSITY_MODES) {
      expect(isDensityMode(density)).toBe(true);
    }

    expect(isAccentFamily('mint')).toBe(false);
    expect(isDensityMode('cozy')).toBe(false);
  });
});
