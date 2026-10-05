import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { promisify } from 'node:util';
import {
  OUTPUTS,
  buildReleasePlan,
  parseArgs,
  readState,
  writeReleaseOutputs,
} from './prepare.mjs';

const exec = promisify(execFile);
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);
const serialize = (value) => JSON.stringify(value, null, 2) + '\n';
const date = new Date('2026-10-04T23:00:00Z');

function fixture() {
  return {
    repositoryText: serialize({
      name: '@jp-design-system/source',
      version: '0.0.0',
    }),
    lockText: serialize({
      name: '@jp-design-system/source',
      version: '0.0.0',
      packages: {
        '': { version: '0.0.0' },
        'node_modules/example': { version: '0.0.0' },
      },
    }),
    uiText: serialize({ name: '@jp-design-system/ui', version: '0.1.0' }),
    tokensText: serialize({
      name: '@jp-design-system/tokens',
      version: '0.1.0',
    }),
    changelog:
      '# Changelog\n\n## [Unreleased]\n\n### Added\n\n- New controls.\n\n## [0.1.0] - 2026-09-01\n\n- Previous notes.\n',
  };
}

const originals = (state) => ({
  'package.json': state.repositoryText,
  'package-lock.json': state.lockText,
  'libs/ui/package.json': state.uiText,
  'libs/tokens/package.distribution.json': state.tokensText,
  'CHANGELOG.md': state.changelog,
});

async function withFixture(callback, omitted) {
  const directory = await mkdtemp(path.join(tmpdir(), 'jp-release-check-'));
  const state = fixture();
  try {
    for (const [relative, content] of Object.entries(originals(state))) {
      if (relative === omitted) continue;
      const target = path.join(directory, relative);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, content);
    }
    await callback(directory, state);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test('release arguments accept the documented versions and reject unsafe or incomplete input', () => {
  assert.deepEqual(parseArgs(['--version', '0.2.0', '--dry-run']), {
    version: '0.2.0',
    dryRun: true,
  });
  assert.deepEqual(parseArgs(['--version=0.2.0-rc.1']), {
    version: '0.2.0-rc.1',
    dryRun: false,
  });
  for (const version of [
    'v0.2.0',
    '00.2.0',
    '0.2',
    '0.2.0-rc.0',
    '0.2.0-rc.01',
    '0.2.0-beta.1',
    '0.2.0;touch file',
  ]) {
    assert.throws(() => parseArgs(['--version', version]), /Invalid version/);
  }
  for (const args of [
    [],
    ['--version'],
    ['--version', '--dry-run'],
    ['--publish'],
  ]) {
    assert.throws(() => parseArgs(args));
  }
});

test('release plan pairs distributed versions while preserving dependency versions and metadata', () => {
  const state = fixture();
  const plan = buildReleasePlan(state, '0.2.0-rc.1', date);
  assert.equal(plan.tag, 'v0.2.0-rc.1');
  assert.equal(plan.packagesInLockstep, true);
  for (const relative of [
    'package.json',
    'libs/ui/package.json',
    'libs/tokens/package.distribution.json',
  ]) {
    assert.equal(JSON.parse(plan.outputs[relative]).version, '0.2.0-rc.1');
  }
  const lock = JSON.parse(plan.outputs['package-lock.json']);
  assert.equal(lock.version, '0.2.0-rc.1');
  assert.equal(lock.packages[''].version, '0.2.0-rc.1');
  assert.deepEqual(
    lock.packages['node_modules/example'],
    JSON.parse(state.lockText).packages['node_modules/example'],
  );
  assert.equal(
    JSON.parse(plan.outputs['libs/ui/package.json']).name,
    '@jp-design-system/ui',
  );
  assert.deepEqual(Object.keys(plan.outputs), OUTPUTS);
  assert.ok(!OUTPUTS.includes('libs/tokens/package.json'));
});

test('changelog movement preserves notes, previous releases and CRLF; duplicate versions are refused', () => {
  const state = fixture();
  const plan = buildReleasePlan(state, '0.2.0', date);
  assert.equal(plan.changelog.hasNotes, true);
  assert.match(
    plan.changelog.text,
    /## \[Unreleased\]\n\n## \[0\.2\.0\] - 2026-10-04\n\n### Added\n\n- New controls\./,
  );
  assert.match(
    plan.changelog.text,
    /## \[0\.1\.0\] - 2026-09-01\n\n- Previous notes\.\n$/,
  );
  const crlf = buildReleasePlan(
    { ...state, changelog: state.changelog.replaceAll('\n', '\r\n') },
    '0.2.0',
    date,
  );
  assert.equal(
    crlf.changelog.text.replaceAll('\r\n', '\n'),
    plan.changelog.text,
  );
  assert.throws(
    () => buildReleasePlan(state, '0.1.0', date),
    /already contains/,
  );
  assert.throws(
    () =>
      buildReleasePlan({ ...state, changelog: '# Changelog\n' }, '0.2.0', date),
    /missing an ## \[Unreleased\]/,
  );
  assert.equal(
    buildReleasePlan(
      { ...state, changelog: '## [Unreleased]\n\n' },
      '0.2.0',
      date,
    ).changelog.hasNotes,
    false,
  );
});

test('release planning refuses mismatched lock roots and unexpected package identities', () => {
  const state = fixture();
  const lock = JSON.parse(state.lockText);
  lock.packages[''].version = '0.1.0';
  assert.throws(
    () =>
      buildReleasePlan({ ...state, lockText: serialize(lock) }, '0.2.0', date),
    /disagree/,
  );
  assert.throws(
    () =>
      buildReleasePlan(
        {
          ...state,
          uiText: serialize({ name: 'wrong-package', version: '0.1.0' }),
        },
        '0.2.0',
        date,
      ),
    /Unexpected UI package name/,
  );
});

test('write mode applies the reviewed plan only to the release files', async () => {
  await withFixture(async (directory, state) => {
    const plan = buildReleasePlan(state, '0.2.0', date);
    await writeReleaseOutputs(directory, plan.outputs);
    for (const relative of OUTPUTS) {
      assert.equal(
        await readFile(path.join(directory, relative), 'utf8'),
        plan.outputs[relative],
      );
    }
    assert.equal(
      (await readState(directory)).uiText,
      plan.outputs['libs/ui/package.json'],
    );
  });
});

test('a failed release write restores files already written', async () => {
  const omitted = 'libs/tokens/package.distribution.json';
  await withFixture(async (directory, state) => {
    await assert.rejects(
      writeReleaseOutputs(
        directory,
        buildReleasePlan(state, '0.2.0', date).outputs,
      ),
      { code: 'ENOENT' },
    );
    for (const [relative, content] of Object.entries(originals(state))) {
      if (relative !== omitted)
        assert.equal(
          await readFile(path.join(directory, relative), 'utf8'),
          content,
        );
    }
  }, omitted);
});

test('the real dry-run CLI leaves repository release files unchanged', async () => {
  const before = await readState(root);
  // Synthetic validation version; this is not a selected release version.
  const { stdout } = await exec(
    process.execPath,
    ['tools/release/prepare.mjs', '--version', '999.0.0-rc.1', '--dry-run'],
    { cwd: root },
  );
  assert.match(stdout, /dry-run: no files written/);
  assert.deepEqual(await readState(root), before);
});
