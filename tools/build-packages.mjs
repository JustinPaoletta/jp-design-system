import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { ngPackagr } from 'ng-packagr';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist/packages');
const tokensOutput = path.join(output, 'tokens');
// This directory contains only artifacts produced by this script.
await rm(tokensOutput, { recursive: true, force: true });
await mkdir(tokensOutput, { recursive: true });
const source = path.join(root, 'libs/tokens/src');
const program = ts.createProgram([path.join(source, 'index.ts')], {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ES2022,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  rootDir: source,
  outDir: tokensOutput,
  declaration: true,
  strict: true,
  skipLibCheck: true,
  types: [],
});
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length) {
  throw new Error(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (name) => name,
      getCurrentDirectory: () => root,
      getNewLine: () => '\n',
    }),
  );
}
const emitted = program.emit();
if (emitted.emitSkipped) throw new Error('Token package compilation failed');
// Explicit .js extensions allow native Node ESM as well as bundler resolution.
for (const file of ['index.js', 'index.d.ts']) {
  const target = path.join(tokensOutput, file);
  const content = await readFile(target, 'utf8');
  await writeFile(
    target,
    content.replace("'./lib/tokens'", "'./lib/tokens.js'"),
  );
}
for (const name of ['tokens.css', 'tokens.compact.css', 'tokens.json']) {
  await cp(path.join(source, 'generated', name), path.join(tokensOutput, name));
}
await cp(
  path.join(root, 'libs/tokens/package.distribution.json'),
  path.join(tokensOutput, 'package.json'),
);
await cp(
  path.join(root, 'libs/tokens/README.md'),
  path.join(tokensOutput, 'README.md'),
);
await ngPackagr()
  .forProject(path.join(root, 'libs/ui/ng-package.json'))
  .withTsConfig(path.join(root, 'libs/ui/tsconfig.packaging.json'))
  .build();
console.log('Built local packages: dist/packages/tokens and dist/packages/ui');
