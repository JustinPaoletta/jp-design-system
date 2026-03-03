import path from 'node:path';

const TOKEN_ROOT = process.env.JP_TOKEN_SOURCE_ROOT ?? 'libs/tokens/src/tokens';
const variant = process.env.JP_TOKEN_VARIANT ?? 'base';
const outputRoot =
  process.env.JP_TOKEN_OUT_DIR ?? 'libs/tokens/src/generated/.tmp';
const outputPath = path.resolve(process.cwd(), outputRoot);
const buildPath = `${outputPath}${path.sep}`;

const normalizePath = (value) => value.split(path.sep).join('/');
const fromFile = (needle) => (token) =>
  normalizePath(token.filePath ?? '').endsWith(needle);

const variants = {
  base: {
    source: [
      `${TOKEN_ROOT}/primitives/**/*.json`,
      `${TOKEN_ROOT}/semantic/base.json`,
    ],
    transformGroup: 'css',
    destination: 'base.css',
    format: 'css/variables',
    options: {
      selector: ':root',
    },
  },
  accentNeon: {
    source: [
      `${TOKEN_ROOT}/primitives/**/*.json`,
      `${TOKEN_ROOT}/semantic/accent.neon.json`,
    ],
    transformGroup: 'css',
    destination: 'accent-neon.css',
    format: 'css/variables',
    options: {
      selector: ':root, [data-jp-accent="neon"]',
    },
    filter: fromFile('/semantic/accent.neon.json'),
  },
  accentCobalt: {
    source: [
      `${TOKEN_ROOT}/primitives/**/*.json`,
      `${TOKEN_ROOT}/semantic/accent.cobalt.json`,
    ],
    transformGroup: 'css',
    destination: 'accent-cobalt.css',
    format: 'css/variables',
    options: {
      selector: '[data-jp-accent="cobalt"]',
    },
    filter: fromFile('/semantic/accent.cobalt.json'),
  },
  compact: {
    source: [
      `${TOKEN_ROOT}/primitives/**/*.json`,
      `${TOKEN_ROOT}/semantic/base.json`,
      `${TOKEN_ROOT}/modes/density.compact.json`,
    ],
    transformGroup: 'css',
    destination: 'compact.css',
    format: 'css/variables',
    options: {
      selector: '[data-jp-density="compact"]',
    },
    filter: fromFile('/modes/density.compact.json'),
  },
};

const selected = variants[variant];

if (!selected) {
  throw new Error(
    `Unknown JP_TOKEN_VARIANT "${variant}". Expected one of: ${Object.keys(variants).join(', ')}`,
  );
}

export default {
  source: selected.source,
  platforms: {
    jp: {
      transformGroup: selected.transformGroup,
      prefix: 'jp',
      buildPath,
      files: [
        {
          destination: selected.destination,
          format: selected.format,
          options: selected.options,
          filter: selected.filter,
        },
      ],
    },
  },
};
