#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SCAN_ROOTS = ['apps', 'libs/ui'];
const TARGET_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.html',
  '.scss',
  '.css',
]);
const IGNORE_DIRS = new Set([
  'node_modules',
  'dist',
  '.nx',
  'coverage',
  '.angular',
  '.git',
  'tmp',
]);
const ALLOW_MARKER = 'jp-allow-primitive-token';
const PRIMITIVE_VAR_PATTERN = /var\(\s*--jp-primitive-[^)]+\)/g;

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) {
        continue;
      }

      files.push(...(await walk(fullPath)));
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function isScannable(relativePath) {
  const extension = path.extname(relativePath);
  return TARGET_EXTENSIONS.has(extension);
}

function locationFromIndex(content, index) {
  let line = 1;
  let column = 1;

  for (let i = 0; i < index; i += 1) {
    if (content[i] === '\n') {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }

  return { line, column };
}

function scanFile(content, relativePath) {
  const matches = [];
  const lines = content.split('\n');

  PRIMITIVE_VAR_PATTERN.lastIndex = 0;

  for (const match of content.matchAll(PRIMITIVE_VAR_PATTERN)) {
    const index = match.index ?? 0;
    const location = locationFromIndex(content, index);
    const lineText = lines[location.line - 1] ?? '';

    if (lineText.includes(ALLOW_MARKER)) {
      continue;
    }

    matches.push({
      file: relativePath,
      line: location.line,
      column: location.column,
      value: match[0],
    });
  }

  return matches;
}

async function main() {
  const violations = [];

  for (const root of SCAN_ROOTS) {
    const absoluteRoot = path.join(ROOT, root);

    try {
      const stat = await fs.stat(absoluteRoot);
      if (!stat.isDirectory()) {
        continue;
      }
    } catch {
      continue;
    }

    const files = await walk(absoluteRoot);

    for (const file of files) {
      const relativePath = path.relative(ROOT, file);

      if (!isScannable(relativePath)) {
        continue;
      }

      const content = await fs.readFile(file, 'utf8');
      violations.push(...scanFile(content, relativePath));
    }
  }

  if (violations.length === 0) {
    console.log(
      'No primitive token variable usage found in apps/ or libs/ui/.',
    );
    return;
  }

  console.error(
    'Primitive tokens are internal. Use semantic CSS vars instead.',
  );
  for (const violation of violations) {
    console.error(
      `- ${violation.file}:${violation.line}:${violation.column} ${violation.value}`,
    );
  }

  process.exit(1);
}

main().catch((error) => {
  console.error('Primitive token usage check failed with an unexpected error.');
  console.error(error);
  process.exit(1);
});
