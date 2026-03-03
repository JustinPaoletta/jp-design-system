#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildTokens } from './build-tokens.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../..');
const GENERATED_DIR = path.join(REPO_ROOT, 'libs/tokens/src/generated');
const OUTPUT_FILES = ['tokens.css', 'tokens.compact.css', 'tokens.json'];

async function readOrNull(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }
}

async function main() {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'jp-token-check-'));

  try {
    await buildTokens({ outputDir: tempDir, quiet: true });

    const staleFiles = [];

    for (const file of OUTPUT_FILES) {
      const expectedPath = path.join(tempDir, file);
      const currentPath = path.join(GENERATED_DIR, file);
      const [expected, current] = await Promise.all([
        readOrNull(expectedPath),
        readOrNull(currentPath),
      ]);

      if (expected !== current) {
        staleFiles.push(file);
      }
    }

    if (staleFiles.length > 0) {
      console.error('Generated token artifacts are stale.');
      for (const file of staleFiles) {
        console.error(`- libs/tokens/src/generated/${file}`);
      }
      console.error('Run `npm run tokens:build` and commit updated artifacts.');
      process.exit(1);
    }

    console.log('Generated token artifacts are up to date.');
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(
    error instanceof Error
      ? `Token artifact check failed: ${error.message}`
      : error,
  );
  process.exit(1);
});
