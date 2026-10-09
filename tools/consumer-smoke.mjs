import { execFileSync } from 'node:child_process';
import {
  access,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { checkConsumerRuntime } from './consumer-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(root, 'package.json'));
const artifacts = path.join(root, 'dist/packages');
const temporary = await mkdtemp(
  path.join(os.tmpdir(), 'jp-design-system-consumer-'),
);
const report = {
  passed: false,
  angular: require('@angular/core/package.json').version,
  buildTools: versionsForReport(),
};
const run = (command, args, cwd = temporary, capture = false) =>
  execFileSync(command, args, {
    cwd,
    env: { ...process.env, CI: 'true', NG_CLI_ANALYTICS: 'false' },
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    encoding: 'utf8',
  });
const json = (name, value) =>
  writeFile(path.join(temporary, name), `${JSON.stringify(value, null, 2)}\n`);
const versions = (names) =>
  Object.fromEntries(
    names.map((name) => [name, require(`${name}/package.json`).version]),
  );
function versionsForReport() {
  return Object.fromEntries(
    ['@angular/build', '@angular/compiler-cli', 'typescript'].map((name) => [
      name,
      require(`${name}/package.json`).version,
    ]),
  );
}
try {
  await mkdir(artifacts, { recursive: true });
  const tarballs = {};
  for (const name of ['tokens', 'ui']) {
    await access(path.join(artifacts, name, 'package.json'));
    const packed = JSON.parse(
      run(
        'npm',
        ['pack', '--json', '--pack-destination', temporary],
        path.join(artifacts, name),
        true,
      ),
    )[0];
    tarballs[name] = `file:./${packed.filename}`;
    if (
      packed.files.some(({ path: file }) =>
        /\.spec\.|\.stories\.|src\//.test(file),
      )
    ) {
      throw new Error(`${name} tarball includes development sources`);
    }
    if (!packed.files.some(({ path: file }) => file.endsWith('.d.ts'))) {
      throw new Error(`${name} tarball lacks declarations`);
    }
    if (
      name === 'tokens' &&
      !packed.files.some(({ path: file }) => file === 'tokens.css')
    ) {
      throw new Error('Token tarball lacks public stylesheet');
    }
  }
  await json('package.json', {
    name: 'jp-design-system-external-consumer-smoke',
    version: '0.0.0',
    private: true,
    dependencies: {
      ...versions([
        '@angular/common',
        '@angular/compiler',
        '@angular/core',
        '@angular/forms',
        '@angular/platform-browser',
        'rxjs',
        'tslib',
      ]),
      '@jp-design-system/tokens': tarballs.tokens,
      '@jp-design-system/ui': tarballs.ui,
    },
  });
  await json('angular.json', {
    version: 1,
    projects: {
      consumer: {
        projectType: 'application',
        root: '',
        sourceRoot: 'src',
        architect: {
          build: {
            builder: '@angular/build:application',
            options: {
              browser: 'src/main.ts',
              index: 'src/index.html',
              tsConfig: 'tsconfig.json',
              outputPath: 'dist/consumer',
              outputHashing: 'none',
              styles: ['src/styles.css'],
            },
          },
        },
      },
    },
  });
  await json('tsconfig.json', {
    compilerOptions: {
      target: 'ES2022',
      module: 'preserve',
      moduleResolution: 'bundler',
      strict: true,
      experimentalDecorators: true,
      skipLibCheck: true,
      lib: ['ES2022', 'DOM'],
    },
    angularCompilerOptions: { strictTemplates: true },
    files: ['src/main.ts'],
  });
  await mkdir(path.join(temporary, 'src'));
  await writeFile(
    path.join(temporary, 'src/index.html'),
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>JP package smoke</title><base href="/"></head><body><smoke-root></smoke-root></body></html>',
  );
  await writeFile(
    path.join(temporary, 'src/styles.css'),
    '@import "@jp-design-system/tokens/tokens.css";\n@import "@jp-design-system/tokens/tokens.compact.css";\nbody { margin: 0; background: var(--jp-color-surface-canvas); color: var(--jp-color-text-primary); font-family: var(--jp-font-family-base); }\nmain { padding: var(--jp-space-lg); }\nform { display: grid; gap: var(--jp-space-md); }\n',
  );
  await cp(
    path.join(root, 'tools/fixtures/consumer/contracts.ts'),
    path.join(temporary, 'src/contracts.ts'),
  );
  await cp(
    path.join(root, 'tools/fixtures/consumer/main.ts'),
    path.join(temporary, 'src/main.ts'),
  );

  // Exact installed workspace versions, real tarballs, no workspace aliases/symlinks.
  // Prefer cache; on cache miss use only the official registry.
  try {
    run('npm', [
      'install',
      '--offline',
      '--no-audit',
      '--no-fund',
      '--registry=https://registry.npmjs.org',
    ]);
  } catch {
    run('npm', [
      'install',
      '--no-audit',
      '--no-fund',
      '--registry=https://registry.npmjs.org',
    ]);
  }
  // Keep runtime dependencies isolated. Reuse the exact workspace build tools
  // instead of installing a second copy of the complete compiler toolchain.
  const builder = path.join(temporary, 'build.mjs');
  await writeFile(
    builder,
    `import { Architect } from ${JSON.stringify(pathToFileURL(require.resolve('@angular-devkit/architect')).href)};
import { WorkspaceNodeModulesArchitectHost } from ${JSON.stringify(pathToFileURL(require.resolve('@angular-devkit/architect/node')).href)};
import { workspaces } from ${JSON.stringify(pathToFileURL(require.resolve('@angular-devkit/core')).href)};
import { NodeJsSyncHost } from ${JSON.stringify(pathToFileURL(require.resolve('@angular-devkit/core/node')).href)};
const host = workspaces.createWorkspaceHost(new NodeJsSyncHost());
const { workspace } = await workspaces.readWorkspace('angular.json', host);
const builderHost = new WorkspaceNodeModulesArchitectHost(workspace, process.cwd());
const resolveBuilder = builderHost.resolveBuilder.bind(builderHost);
builderHost.resolveBuilder = (name) => resolveBuilder(name, ${JSON.stringify(root)});
const architect = new Architect(builderHost);
const run = await architect.scheduleTarget({project: 'consumer', target: 'build'});
try { const result = await run.result; if (!result.success) process.exitCode = 1; }
finally { await run.stop(); }
`,
  );
  run(process.execPath, [builder]);
  const css = await readFile(
    path.join(temporary, 'dist/consumer/browser/styles.css'),
    'utf8',
  );
  if (!css.includes('--jp-'))
    throw new Error('Consumer output lacks bundled token CSS');
  run(process.execPath, [
    '--input-type=module',
    '-e',
    'import { JP_DEFAULT_ACCENT } from "@jp-design-system/tokens"; if (JP_DEFAULT_ACCENT !== "neon") throw new Error("Token ESM import failed")',
  ]);
  report.runtime = await checkConsumerRuntime(
    path.join(temporary, 'dist/consumer/browser'),
    path.join(artifacts, 'consumer-runtime'),
  );
  report.passed = true;
  console.log(
    `Isolated Angular ${report.angular} tarball consumer build passed.`,
  );
} catch (error) {
  report.error = error.message;
  throw error;
} finally {
  // Release the disposable install before writing the report. A full disk must
  // not make reporting throw before cleanup and strand the largest artifact.
  if (process.env.KEEP_CONSUMER_SMOKE === '1') {
    console.log(`Consumer retained for diagnosis: ${temporary}`);
  } else {
    await rm(temporary, { recursive: true, force: true });
  }
  await mkdir(artifacts, { recursive: true });
  await writeFile(
    path.join(artifacts, 'consumer-smoke.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );
}
