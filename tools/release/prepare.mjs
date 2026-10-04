#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);

const VERSION_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-rc\.([1-9]\d*))?$/;

const OUTPUTS = [
  'package.json',
  'package-lock.json',
  'libs/ui/package.json',
  'libs/tokens/package.distribution.json',
  'CHANGELOG.md',
];

class ReleaseInputError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ReleaseInputError';
  }
}

function parseArgs(argv) {
  let version;
  let dryRun = false;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }
    if (arg === '--version') {
      version = argv[index + 1];
      index += 1;
      if (!version || version.startsWith('--')) {
        throw new ReleaseInputError(
          'Missing value for --version. Expected X.Y.Z or X.Y.Z-rc.N.',
        );
      }
      continue;
    }
    if (arg.startsWith('--version=')) {
      version = arg.slice('--version='.length);
      continue;
    }
    throw new ReleaseInputError(`Unknown argument: ${arg}`);
  }
  if (!version) {
    throw new ReleaseInputError(
      'Missing required --version X.Y.Z (or X.Y.Z-rc.N).',
    );
  }
  if (!VERSION_PATTERN.test(version)) {
    throw new ReleaseInputError(
      `Invalid version "${version}". Use X.Y.Z or X.Y.Z-rc.N.`,
    );
  }
  return { version, dryRun };
}

function policyLine(version) {
  const match = VERSION_PATTERN.exec(version);
  const major = Number(match[1]);
  const rc = match[4];
  if (rc) {
    return `prerelease: ${version} uses SemVer -rc.${rc}; the tag is v${version}`;
  }
  if (major === 0) {
    return 'pre-1.0: breaking changes may ship as a minor bump; 1.0.0 requires stable criteria';
  }
  if (version === '1.0.0') {
    return 'stable: 1.0.0 requires the acceptance checklist for stable components, required CI, consumer smoke, and a complete changelog';
  }
  return 'semver: after 1.0.0, breaking changes require a major bump';
}

function utcDate(date) {
  return date.toISOString().slice(0, 10);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function trimBlankLines(lines) {
  let start = 0;
  let end = lines.length;
  while (start < end && lines[start].trim() === '') start += 1;
  while (end > start && lines[end - 1].trim() === '') end -= 1;
  return lines.slice(start, end);
}

function moveUnreleased(markdown, version, date) {
  const newline = markdown.includes('\r\n') ? '\r\n' : '\n';
  const endedWithNewline = markdown.endsWith(newline);
  const lines = markdown.split(newline);
  if (endedWithNewline && lines.at(-1) === '') lines.pop();

  const start = lines.findIndex((line) => line.trim() === '## [Unreleased]');
  if (start === -1) {
    throw new ReleaseInputError(
      'CHANGELOG.md is missing an ## [Unreleased] heading.',
    );
  }

  let end = lines.length;
  for (let index = start + 1; index < lines.length; index += 1) {
    if (lines[index].startsWith('## [')) {
      end = index;
      break;
    }
  }

  const heading = `## [${version}] - ${date}`;
  const existing = new RegExp(`^## \\[${escapeRegExp(version)}\\](?:\\s|$)`);
  if (lines.some((line) => existing.test(line.trim()))) {
    throw new ReleaseInputError(
      `CHANGELOG.md already contains a section for ${version}.`,
    );
  }

  const body = trimBlankLines(lines.slice(start + 1, end));
  const hasNotes = body.some((line) => line.trim().length > 0);
  const nextLines = [
    ...lines.slice(0, start),
    '## [Unreleased]',
    '',
    heading,
    ...(body.length > 0 ? ['', ...body] : []),
  ];
  const after = lines.slice(end);
  if (after.length > 0) nextLines.push('', ...after);

  let text = nextLines.join(newline);
  if (endedWithNewline) text += newline;
  return { text, hasNotes, heading };
}

function replaceVersionFields(text, current, next, count, label) {
  const needle = `"version": "${current}"`;
  const replacement = `"version": "${next}"`;
  let updated = text;
  let cursor = 0;
  for (let index = 0; index < count; index += 1) {
    const found = updated.indexOf(needle, cursor);
    if (found === -1) {
      throw new Error(
        `${label} is missing "version": "${current}" (occurrence ${index + 1} of ${count}).`,
      );
    }
    updated =
      updated.slice(0, found) +
      replacement +
      updated.slice(found + needle.length);
    cursor = found + replacement.length;
  }
  return updated;
}

function bumpPackageVersion(text, next, label) {
  const parsed = JSON.parse(text);
  if (typeof parsed.version !== 'string' || typeof parsed.name !== 'string') {
    throw new Error(`${label} is missing a name or version.`);
  }
  const updated = replaceVersionFields(text, parsed.version, next, 1, label);
  const check = JSON.parse(updated);
  if (check.version !== next || check.name !== parsed.name) {
    throw new Error(`${label} version update did not apply cleanly.`);
  }
  return { updated, previous: parsed.version, name: parsed.name };
}

function bumpLockfile(text, next) {
  const parsed = JSON.parse(text);
  const current = parsed.version;
  const rootPackage = parsed.packages?.[''];
  if (typeof current !== 'string' || rootPackage?.version !== current) {
    throw new Error(
      'package-lock.json root version and packages[""].version disagree.',
    );
  }
  const needle = `"version": "${current}"`;
  const first = text.indexOf(needle);
  const second = text.indexOf(needle, first + needle.length);
  const dependencies = text.indexOf('"node_modules/');
  if (first < 0 || second < 0) {
    throw new Error('package-lock.json is missing the root version fields.');
  }
  if (dependencies !== -1 && second > dependencies) {
    throw new Error(
      'Refusing to update package-lock.json because a root version field appears after dependencies.',
    );
  }
  const updated = replaceVersionFields(
    text,
    current,
    next,
    2,
    'package-lock.json',
  );
  const check = JSON.parse(updated);
  if (check.version !== next || check.packages?.['']?.version !== next) {
    throw new Error('package-lock.json version update did not apply cleanly.');
  }
  if (check.name !== parsed.name) {
    throw new Error('package-lock.json name changed.');
  }
  for (const [name, pkg] of Object.entries(parsed.packages)) {
    if (name === '') continue;
    const before = pkg?.version ?? null;
    const after = check.packages[name]?.version ?? null;
    if (before !== after) {
      throw new Error(
        `package-lock.json unexpectedly changed the version of ${name}.`,
      );
    }
  }
  return { updated, previous: current };
}

async function readState(directory) {
  const read = (relativePath) =>
    readFile(path.join(directory, relativePath), 'utf8');
  const [repositoryText, lockText, uiText, tokensText, changelog] =
    await Promise.all([
      read('package.json'),
      read('package-lock.json'),
      read('libs/ui/package.json'),
      read('libs/tokens/package.distribution.json'),
      read('CHANGELOG.md'),
    ]);
  return { repositoryText, lockText, uiText, tokensText, changelog };
}

function buildReleasePlan(state, version, date = new Date()) {
  const repository = bumpPackageVersion(
    state.repositoryText,
    version,
    'package.json',
  );
  const lock = bumpLockfile(state.lockText, version);
  const ui = bumpPackageVersion(state.uiText, version, 'libs/ui/package.json');
  const tokens = bumpPackageVersion(
    state.tokensText,
    version,
    'libs/tokens/package.distribution.json',
  );
  if (ui.name !== '@jp-design-system/ui') {
    throw new Error(`Unexpected UI package name: ${ui.name}`);
  }
  if (tokens.name !== '@jp-design-system/tokens') {
    throw new Error(`Unexpected tokens package name: ${tokens.name}`);
  }
  if (repository.name !== '@jp-design-system/source') {
    throw new Error(`Unexpected repository package name: ${repository.name}`);
  }

  const dated = utcDate(date);
  const changelog = moveUnreleased(state.changelog, version, dated);
  const outputs = {
    'package.json': repository.updated,
    'package-lock.json': lock.updated,
    'libs/ui/package.json': ui.updated,
    'libs/tokens/package.distribution.json': tokens.updated,
    'CHANGELOG.md': changelog.text,
  };

  return {
    version,
    date: dated,
    tag: `v${version}`,
    policy: policyLine(version),
    versions: [
      {
        label: 'repository package.json',
        from: repository.previous,
        to: version,
      },
      {
        label: 'package-lock.json',
        from: lock.previous,
        to: version,
      },
      {
        label: '@jp-design-system/ui libs/ui/package.json',
        from: ui.previous,
        to: version,
      },
      {
        label: '@jp-design-system/tokens libs/tokens/package.distribution.json',
        from: tokens.previous,
        to: version,
      },
    ],
    packagesInLockstep: ui.previous === tokens.previous,
    changelog,
    files: OUTPUTS,
    outputs,
  };
}

function printPlan(plan, dryRun) {
  const lines = [
    `JP release prepare (${dryRun ? 'dry-run' : 'write'})`,
    'Version plan',
    `  requested: ${plan.version}`,
    ...plan.versions.map(
      (change) => `  ${change.label}: ${change.from} -> ${change.to}`,
    ),
    `  lockstep: repository, @jp-design-system/ui, and @jp-design-system/tokens become ${plan.version} together`,
    plan.packagesInLockstep
      ? '  packages: UI and tokens distribution versions already match each other'
      : '  packages: UI and tokens distribution versions differ; both are set to the requested version',
    '  unchanged: libs/tokens/package.json (private workspace metadata, not distributed)',
    `  ${plan.policy}`,
    'Changelog',
    `  move: ## [Unreleased] -> ${plan.changelog.heading}`,
    '  leave: ## [Unreleased]',
    `  notes: ${plan.changelog.hasNotes ? 'present' : 'empty'}`,
    'Files',
    ...plan.files.map((file) => `  ${file}`),
    'Tag',
    `  ${plan.tag}`,
    '  created: no',
    'Mode',
    dryRun
      ? '  dry-run: no files written'
      : '  write: files updated; no commit, tag, or publish',
  ];
  console.log(lines.join('\n'));
}

async function writeReleaseOutputs(directory, outputs) {
  const originals = new Map();
  const written = [];
  try {
    for (const relativePath of OUTPUTS) {
      const absolutePath = path.join(directory, relativePath);
      originals.set(relativePath, await readFile(absolutePath, 'utf8'));
      await mkdir(path.dirname(absolutePath), { recursive: true });
      await writeFile(absolutePath, outputs[relativePath]);
      written.push(relativePath);
    }
  } catch (error) {
    for (const relativePath of written) {
      await writeFile(
        path.join(directory, relativePath),
        originals.get(relativePath),
      );
    }
    throw error;
  }
}

async function main() {
  const { version, dryRun } = parseArgs(process.argv.slice(2));
  const plan = buildReleasePlan(await readState(root), version);
  printPlan(plan, dryRun);
  if (dryRun) return;
  if (!plan.changelog.hasNotes) {
    throw new ReleaseInputError(
      'Refusing to write: CHANGELOG.md ## [Unreleased] has no notes.',
    );
  }
  await writeReleaseOutputs(root, plan.outputs);
}

const invokedDirectly =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  main().catch((error) => {
    if (error instanceof ReleaseInputError) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    process.exitCode = 1;
  });
}

export { OUTPUTS, buildReleasePlan, parseArgs, readState, writeReleaseOutputs };
