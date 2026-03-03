#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../..');
const TOKEN_SOURCE_ROOT =
  process.env.JP_TOKEN_SOURCE_ROOT ?? 'libs/tokens/src/tokens';
const TOKENS_ROOT = path.resolve(REPO_ROOT, TOKEN_SOURCE_ROOT);
const DEFAULT_OUTPUT = path.join(REPO_ROOT, 'libs/tokens/src/generated');
const CSS_PARTIALS = {
  base: 'base.css',
  accentNeon: 'accent-neon.css',
  accentCobalt: 'accent-cobalt.css',
  compact: 'compact.css',
};

function parseOutputDir(args) {
  const prefixed = args.find((arg) => arg.startsWith('--output-dir='));
  if (prefixed) {
    return prefixed.slice('--output-dir='.length);
  }

  const index = args.indexOf('--output-dir');
  if (index >= 0 && args[index + 1]) {
    return args[index + 1];
  }

  return undefined;
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: REPO_ROOT,
      stdio: 'pipe',
      ...options,
    });

    let stderr = '';
    child.stderr?.on('data', (chunk) => {
      stderr += String(chunk);
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `Command failed (${command} ${args.join(' ')}):\n${stderr.trim()}`,
        ),
      );
    });
  });
}

function stripStyleDictionaryBanner(css) {
  return css.replace(/^\/\*[\s\S]*?\*\/\s*/, '').trim();
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge(target, source) {
  const output = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (isPlainObject(value) && isPlainObject(output[key])) {
      output[key] = deepMerge(output[key], value);
      continue;
    }

    output[key] = value;
  }

  return output;
}

function getByPath(object, pathValue) {
  return pathValue
    .split('.')
    .reduce(
      (current, segment) =>
        current && typeof current === 'object' ? current[segment] : undefined,
      object,
    );
}

function resolveString(rawValue, context, trail) {
  if (typeof rawValue !== 'string' || !rawValue.includes('{')) {
    return rawValue;
  }

  const referencePattern = /\{([^}]+)\}/g;
  return rawValue.replace(referencePattern, (_, referencePath) => {
    const nextTrail = [...trail, referencePath];
    const cycleStart = nextTrail.indexOf(referencePath);
    if (cycleStart !== nextTrail.length - 1) {
      throw new Error(
        `Circular token reference detected: ${nextTrail.slice(cycleStart).join(' -> ')}`,
      );
    }

    const referenceNode = getByPath(context, referencePath);
    if (
      !referenceNode ||
      !isPlainObject(referenceNode) ||
      !('value' in referenceNode)
    ) {
      throw new Error(`Unresolved token reference: ${referencePath}`);
    }

    const resolved = resolveString(referenceNode.value, context, nextTrail);
    return String(resolved);
  });
}

function unwrapTokenTree(node, context, trail = []) {
  if (!isPlainObject(node)) {
    return node;
  }

  if ('value' in node && Object.keys(node).length >= 1) {
    return resolveString(node.value, context, trail);
  }

  const result = {};
  for (const [key, value] of Object.entries(node)) {
    result[key] = unwrapTokenTree(value, context, trail);
  }

  return result;
}

async function readJson(relativePath) {
  const filePath = path.join(TOKENS_ROOT, relativePath);
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content);
}

async function loadTokenSources() {
  const primitiveFiles = [
    'primitives/color.neutral.json',
    'primitives/color.accent.json',
    'primitives/typography.json',
    'primitives/spacing.json',
    'primitives/radius.json',
    'primitives/elevation.json',
    'primitives/motion.json',
  ];

  let primitives = {};
  for (const file of primitiveFiles) {
    const content = await readJson(file);
    primitives = deepMerge(primitives, content);
  }

  const semanticBase = await readJson('semantic/base.json');
  const accentNeon = await readJson('semantic/accent.neon.json');
  const accentCobalt = await readJson('semantic/accent.cobalt.json');
  const densityDefault = await readJson('modes/density.default.json');
  const densityCompact = await readJson('modes/density.compact.json');

  return {
    primitives,
    semanticBase,
    accentNeon,
    accentCobalt,
    densityDefault,
    densityCompact,
  };
}

function buildResolvedJson(sources) {
  const {
    primitives,
    semanticBase,
    accentNeon,
    accentCobalt,
    densityDefault,
    densityCompact,
  } = sources;

  return {
    meta: {
      accentAttribute: 'data-jp-accent',
      densityAttribute: 'data-jp-density',
      defaultAccent: 'neon',
      defaultDensity: 'default',
    },
    primitive: unwrapTokenTree(primitives.primitive, primitives),
    semantic: {
      base: unwrapTokenTree(semanticBase, deepMerge(primitives, semanticBase)),
      accent: {
        neon: unwrapTokenTree(accentNeon, deepMerge(primitives, accentNeon)),
        cobalt: unwrapTokenTree(
          accentCobalt,
          deepMerge(primitives, accentCobalt),
        ),
      },
      density: {
        default: unwrapTokenTree(
          densityDefault,
          deepMerge(primitives, densityDefault),
        ),
        compact: unwrapTokenTree(
          densityCompact,
          deepMerge(primitives, densityCompact),
        ),
      },
    },
  };
}

async function runStyleDictionaryVariant(variant, tempOutputDir) {
  await run(
    'npx',
    [
      'style-dictionary',
      'build',
      '--config',
      'libs/tokens/style-dictionary.config.mjs',
    ],
    {
      env: {
        ...process.env,
        JP_TOKEN_VARIANT: variant,
        JP_TOKEN_OUT_DIR: tempOutputDir,
        JP_TOKEN_SOURCE_ROOT: TOKEN_SOURCE_ROOT,
      },
    },
  );
}

async function readPartial(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  return stripStyleDictionaryBanner(content);
}

export async function buildTokens({
  outputDir = DEFAULT_OUTPUT,
  quiet = false,
} = {}) {
  const resolvedOutputDir = path.resolve(REPO_ROOT, outputDir);
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'jp-tokens-build-'));

  try {
    const variants = ['base', 'accentNeon', 'accentCobalt', 'compact'];
    for (const variant of variants) {
      await runStyleDictionaryVariant(variant, tempDir);
    }

    const baseCss = await readPartial(path.join(tempDir, CSS_PARTIALS.base));
    const accentNeonCss = await readPartial(
      path.join(tempDir, CSS_PARTIALS.accentNeon),
    );
    const accentCobaltCss = await readPartial(
      path.join(tempDir, CSS_PARTIALS.accentCobalt),
    );
    const compactCss = await readPartial(
      path.join(tempDir, CSS_PARTIALS.compact),
    );

    const header = [
      '/*',
      ' * AUTO-GENERATED FILE. DO NOT EDIT.',
      ' * Run `npm run tokens:build` to regenerate.',
      ' */',
    ].join('\n');

    const combinedCss = `${header}\n\n${baseCss}\n\n${accentNeonCss}\n\n${accentCobaltCss}\n`;
    const compactOutput = `${header}\n\n${compactCss}\n`;

    const sources = await loadTokenSources();
    const resolvedJson = buildResolvedJson(sources);

    await fs.mkdir(resolvedOutputDir, { recursive: true });
    await fs.writeFile(path.join(resolvedOutputDir, 'tokens.css'), combinedCss);
    await fs.writeFile(
      path.join(resolvedOutputDir, 'tokens.compact.css'),
      compactOutput,
    );
    await fs.writeFile(
      path.join(resolvedOutputDir, 'tokens.json'),
      `${JSON.stringify(resolvedJson, null, 2)}\n`,
    );

    if (!quiet) {
      console.log(
        `Generated token artifacts in ${path.relative(REPO_ROOT, resolvedOutputDir)}.`,
      );
    }
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

async function main() {
  const outputArg = parseOutputDir(process.argv.slice(2));
  const outputDir = outputArg
    ? path.resolve(REPO_ROOT, outputArg)
    : DEFAULT_OUTPUT;
  await buildTokens({ outputDir });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
