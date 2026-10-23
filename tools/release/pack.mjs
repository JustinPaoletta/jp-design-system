import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './prepare.mjs';

export function validatePair(packages) {
  for (const key of ['ui', 'tokens']) {
    if (packages[key]?.name !== `@jp-design-system/${key}`)
      throw new Error(`Unexpected ${key} package identity`);
  }
  const version = packages.ui.version;
  try {
    parseArgs(['--version', version]);
  } catch {
    throw new Error('Unsupported package version');
  }
  if (version !== packages.tokens.version)
    throw new Error('UI and token package versions must match');
  return version;
}

export async function packPackages(directory) {
  const packages = Object.fromEntries(
    await Promise.all(
      ['ui', 'tokens'].map(async (key) => [
        key,
        JSON.parse(
          await readFile(path.join(directory, key, 'package.json'), 'utf8'),
        ),
      ]),
    ),
  );
  const version = validatePair(packages);
  const destination = path.join(directory, 'archives', version);
  await mkdir(destination, { recursive: true });
  const archives = [];
  for (const key of ['tokens', 'ui']) {
    const [packed] = JSON.parse(
      execFileSync(
        'npm',
        [
          'pack',
          '--ignore-scripts',
          '--json',
          '--pack-destination',
          destination,
        ],
        {
          cwd: path.join(directory, key),
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'pipe'],
        },
      ),
    );
    const filename = `jp-design-system-${key}-${version}.tgz`;
    if (
      packed.filename !== filename ||
      packed.name !== packages[key].name ||
      packed.version !== version
    )
      throw new Error(`Unexpected ${key} archive metadata`);
    const contents = await readFile(path.join(destination, filename));
    const sha512 = createHash('sha512').update(contents).digest('base64');
    if (packed.integrity !== `sha512-${sha512}`)
      throw new Error(`Integrity mismatch: ${filename}`);
    archives.push({
      name: packed.name,
      version,
      filename,
      bytes: contents.length,
      integrity: packed.integrity,
      sha256: createHash('sha256').update(contents).digest('hex'),
    });
  }
  const manifest = { version, published: false, archives };
  await writeFile(
    path.join(destination, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  return { destination, manifest };
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const root = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../..',
  );
  const { destination, manifest } = await packPackages(
    path.join(root, 'dist/packages'),
  );
  console.log(`Packed ${manifest.archives.length} packages at ${destination}`);
  console.log(
    'Local archives only. No tag, GitHub Release or registry publication was created.',
  );
}
