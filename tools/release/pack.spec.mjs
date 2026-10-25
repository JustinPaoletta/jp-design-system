import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { packPackages, validatePair } from './pack.mjs';

test('refuses mismatched identities and versions before packing', () => {
  const pair = {
    ui: { name: '@jp-design-system/ui', version: '0.1.0-rc.1' },
    tokens: { name: '@jp-design-system/tokens', version: '0.1.0-rc.1' },
  };
  assert.equal(validatePair(pair), '0.1.0-rc.1');
  assert.throws(
    () =>
      validatePair({ ...pair, tokens: { ...pair.tokens, version: '0.1.0' } }),
    /must match/,
  );
  assert.throws(
    () => validatePair({ ...pair, ui: { ...pair.ui, name: 'wrong' } }),
    /identity/,
  );
  for (const version of ['../outside', '0.1.0-beta.1', '0.1.0-rc.0', undefined])
    assert.throws(
      () =>
        validatePair({
          ui: { ...pair.ui, version },
          tokens: { ...pair.tokens, version },
        }),
      /Unsupported/,
    );
});

test('packs both actual archives, verifies integrity and records reproducible hashes without running package scripts', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'jp-release-pack-'));
  try {
    for (const key of ['tokens', 'ui']) {
      const folder = path.join(directory, key);
      await mkdir(folder);
      await writeFile(
        path.join(folder, 'package.json'),
        JSON.stringify({
          name: `@jp-design-system/${key}`,
          version: '0.1.0-rc.1',
          scripts: { prepack: 'exit 1' },
        }),
      );
      await writeFile(
        path.join(folder, 'index.js'),
        `export const packageName = '${key}';`,
      );
    }
    const first = await packPackages(directory);
    assert.equal(first.manifest.published, false);
    assert.equal(first.manifest.archives.length, 2);
    for (const archive of first.manifest.archives) {
      const bytes = await readFile(
        path.join(first.destination, archive.filename),
      );
      assert.equal(
        archive.integrity,
        `sha512-${createHash('sha512').update(bytes).digest('base64')}`,
      );
      assert.equal(
        archive.sha256,
        createHash('sha256').update(bytes).digest('hex'),
      );
      assert.equal(archive.bytes, bytes.length);
    }
    const second = await packPackages(directory);
    assert.deepEqual(second.manifest, first.manifest);
    assert.deepEqual(
      JSON.parse(
        await readFile(path.join(first.destination, 'manifest.json'), 'utf8'),
      ),
      first.manifest,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
