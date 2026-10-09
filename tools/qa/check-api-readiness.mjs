import {
  readFileSync,
  existsSync,
  readdirSync,
  mkdirSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);

export function publicClasses(entry) {
  const program = ts.createProgram([entry], {
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2022,
    experimentalDecorators: true,
    skipLibCheck: true,
  });
  const checker = program.getTypeChecker();
  const source = program.getSourceFile(entry);
  const module = source && checker.getSymbolAtLocation(source);
  if (!module) throw new Error(`Cannot resolve public entry: ${entry}`);
  return checker
    .getExportsOfModule(module)
    .flatMap((exported) => {
      const symbol =
        exported.flags & ts.SymbolFlags.Alias
          ? checker.getAliasedSymbol(exported)
          : exported;
      const declaration = symbol.declarations?.find(ts.isClassDeclaration);
      if (!declaration) return [];
      const decorators = ts.getDecorators(declaration) || [];
      const component = decorators.find((decorator) => {
        if (!ts.isCallExpression(decorator.expression)) return false;
        const called = checker.getSymbolAtLocation(
          decorator.expression.expression,
        );
        const resolved =
          called && called.flags & ts.SymbolFlags.Alias
            ? checker.getAliasedSymbol(called)
            : called;
        return resolved?.name === 'Component';
      });
      const options = component?.expression.arguments[0];
      const onPush =
        !component ||
        (options &&
          ts.isObjectLiteralExpression(options) &&
          options.properties.some(
            (property) =>
              ts.isPropertyAssignment(property) &&
              property.name.getText() === 'changeDetection' &&
              property.initializer.getText().endsWith('.OnPush'),
          ));
      return [
        {
          name: exported.name,
          source: declaration.getSourceFile().fileName,
          onPush: Boolean(onPush),
        },
      ];
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function maturityRows(markdown, names) {
  const rows = new Map();
  let level = null;
  let group = '';
  for (const line of markdown.split('\n')) {
    if (line.startsWith('## ')) {
      group = line.slice(3).trim();
      level =
        group === 'Stable classes'
          ? 'stable'
          : group === 'Preview classes' || group.endsWith('preview inventory')
            ? 'preview'
            : group === 'Deprecated'
              ? 'deprecated'
              : null;
    }
    if (!level) continue;
    if (/^\| `\w+`\s*\|/.test(line)) {
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim());
      const name = cells[0].replaceAll('`', '');
      if (!names.has(name))
        throw new Error(
          `Maturity documents a class that is not public: ${name}`,
        );
      if (rows.has(name)) throw new Error(`Duplicate maturity row: ${name}`);
      rows.set(name, {
        level,
        group,
        spec: cells[1],
        story: cells[2],
        reason: cells[3],
      });
    } else if (group.endsWith('preview inventory')) {
      for (const match of line.matchAll(/`(\w+)`/g)) {
        if (names.has(match[1]) && !rows.has(match[1]))
          rows.set(match[1], {
            level,
            group,
            reason:
              'Consumer inspection, manual accessibility and individual maturity approval remain open.',
          });
      }
    }
  }
  return rows;
}

export function inspectEvidence(classes, rows, findFile) {
  const findings = [];
  const inventory = classes.map((item) => {
    const row = rows.get(item.name);
    if (!row) {
      findings.push(`${item.name}: missing maturity entry`);
      return { ...item, level: 'unrecorded' };
    }
    const spec = findFile(item, row, 'spec');
    const story =
      row.level === 'deprecated' ? null : findFile(item, row, 'stories');
    if (!spec) findings.push(`${item.name}: missing unit evidence`);
    if (row.level !== 'deprecated' && !story)
      findings.push(`${item.name}: missing story evidence`);
    if (row.level !== 'deprecated' && !item.onPush)
      findings.push(`${item.name}: component does not use OnPush`);
    if (row.level === 'preview' && !row.reason?.trim())
      findings.push(`${item.name}: preview gap is not recorded`);
    return { ...item, ...row, spec, story, promotionApproved: false };
  });
  const counts = Object.fromEntries(
    ['stable', 'preview', 'deprecated', 'unrecorded'].map((level) => [
      level,
      inventory.filter((row) => row.level === level).length,
    ]),
  );
  return { counts, findings, inventory };
}

export function auditRepository(base = root) {
  const classes = publicClasses(path.join(base, 'libs/ui/src/index.ts'));
  const markdown = readFileSync(
    path.join(base, 'docs/governance/MATURITY.md'),
    'utf8',
  );
  const rows = maturityRows(
    markdown,
    new Set(classes.map((item) => item.name)),
  );
  const files = [];
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else files.push(file);
    }
  };
  walk(path.join(base, 'libs/ui/src/lib'));
  const findFile = (item, row, kind) => {
    const documented = (kind === 'spec' ? row.spec : row.story)?.match(
      /[\w-]+\.(?:spec|stories)\.ts/,
    )?.[0];
    const filename =
      documented || `${path.basename(item.source, '.ts')}.${kind}.ts`;
    const adjacent = path.join(path.dirname(item.source), filename);
    if (existsSync(adjacent)) return path.relative(base, adjacent);
    // The maturity contract names the dialog host story for this directive.
    let hostStory;
    if (
      kind === 'stories' &&
      item.name === 'JpFocusTrap' &&
      row.story?.includes('dialog stories')
    )
      hostStory = 'libs/ui/src/lib/primitives/dialog/dialog.stories.ts';
    if (kind === 'stories' && item.name === 'JpVisuallyHidden')
      hostStory = 'libs/ui/src/lib/primitives/spinner/spinner.stories.ts';
    if (hostStory)
      return existsSync(path.join(base, hostStory)) ? hostStory : null;
    const matches = files.filter((file) => path.basename(file) === filename);
    return matches.length === 1 ? path.relative(base, matches[0]) : null;
  };
  const result = inspectEvidence(classes, rows, findFile);
  for (const [level, count] of Object.entries(result.counts)) {
    if (
      level !== 'unrecorded' &&
      !new RegExp(`\\| ${level}\\s*\\|\\s*${count}\\s*\\|`).test(markdown)
    )
      result.findings.push(`${level}: summary count does not match ${count}`);
  }
  result.inventory = result.inventory.map((row) => ({
    ...row,
    source: path.relative(base, row.source),
  }));
  return result;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const result = auditRepository();
  mkdirSync(path.join(root, 'dist/qa'), { recursive: true });
  writeFileSync(
    path.join(root, 'dist/qa/api-readiness.json'),
    `${JSON.stringify(result, null, 2)}\n`,
  );
  console.log(
    `API evidence: ${result.inventory.length} classes; ${JSON.stringify(result.counts)}`,
  );
  for (const finding of result.findings) console.error(finding);
  console.log(
    'Per-class evidence: dist/qa/api-readiness.json. Evidence presence does not approve promotion.',
  );
  if (result.findings.length) process.exitCode = 1;
}
