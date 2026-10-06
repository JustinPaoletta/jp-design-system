import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);
const skipDirectories = new Set([
  'node_modules',
  'dist',
  'coverage',
  '.git',
  '.nx',
  '.angular',
]);

/**
 * Local documentation links.
 *
 * Scans `docs/**\/*.md` plus repository `README.md` and `README.package.md`
 * files. Destinations are resolved from the file that contains them, which is
 * how GitHub resolves a relative link in a README. `http:` and `https:` links
 * are ignored. Missing `docs/governance` and `docs/localization` targets are
 * pending sibling work. Any other missing local target fails the process.
 */
async function collectFiles(directory, files = []) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (skipDirectories.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await collectFiles(fullPath, files);
      continue;
    }
    if (!entry.isFile()) continue;
    const relative = path.relative(root, fullPath).split(path.sep).join('/');
    const inDocs = relative.startsWith('docs/') && relative.endsWith('.md');
    const readme =
      entry.name === 'README.md' || entry.name === 'README.package.md';
    if (inDocs || readme) files.push(fullPath);
  }
  return files;
}

function stripFencedCode(markdown) {
  const lines = markdown.split('\n');
  const kept = [];
  let fenceCharacter = '';
  let fenceLength = 0;
  for (const line of lines) {
    const match = line.match(/^[ ]{0,3}(`{3,}|~{3,})/);
    if (match) {
      const marker = match[1];
      if (!fenceCharacter) {
        fenceCharacter = marker[0];
        fenceLength = marker.length;
        continue;
      }
      if (marker[0] === fenceCharacter && marker.length >= fenceLength) {
        fenceCharacter = '';
        fenceLength = 0;
        continue;
      }
    }
    if (!fenceCharacter) kept.push(line);
  }
  return kept.join('\n');
}

function parseDestination(raw) {
  const value = raw.trim();
  if (value.startsWith('<')) {
    const end = value.indexOf('>');
    if (end > 1) return value.slice(1, end).trim();
  }
  const token = value.match(/^(\S+)/);
  return token ? token[1] : value;
}

function destinations(markdown) {
  const text = stripFencedCode(markdown);
  const found = [];
  for (const match of text.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    found.push(parseDestination(match[1]));
  }
  for (const match of text.matchAll(
    /^[ ]{0,3}\[[^\]]+\]:[ \t]*<?([^>\s]+)>?/gm,
  )) {
    found.push(match[1].trim());
  }
  return found;
}

function isExternal(destination) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(destination);
}

function localPath(fromFile, destination) {
  const withoutHash = destination.split('#')[0]?.split('?')[0] ?? '';
  if (!withoutHash) return null;
  let decoded = withoutHash;
  try {
    decoded = decodeURI(withoutHash);
  } catch {
    decoded = withoutHash;
  }
  if (decoded.startsWith('/')) return path.join(root, decoded);
  return path.resolve(path.dirname(fromFile), decoded);
}

function posixRelative(absolutePath) {
  return path.relative(root, absolutePath).split(path.sep).join('/');
}

function isSiblingDoc(absolutePath) {
  const relative = posixRelative(absolutePath);
  return (
    relative === 'docs/governance' ||
    relative.startsWith('docs/governance/') ||
    relative === 'docs/localization' ||
    relative.startsWith('docs/localization/')
  );
}

async function exists(absolutePath) {
  try {
    await access(absolutePath);
    return true;
  } catch {
    return false;
  }
}

async function scan() {
  const files = await collectFiles(root);
  const broken = [];
  const pending = [];
  let localLinks = 0;
  for (const file of files) {
    const markdown = await readFile(file, 'utf8');
    const from = posixRelative(file);
    for (const destination of destinations(markdown)) {
      if (
        !destination ||
        destination.startsWith('#') ||
        isExternal(destination)
      ) {
        continue;
      }
      const absolutePath = localPath(file, destination);
      if (!absolutePath) continue;
      localLinks += 1;
      if (await exists(absolutePath)) continue;
      const record = { from, destination, target: posixRelative(absolutePath) };
      if (isSiblingDoc(absolutePath)) pending.push(record);
      else broken.push(record);
    }
  }
  return { files: files.length, localLinks, broken, pending };
}

function printRecords(title, records) {
  console.log(title);
  const grouped = new Map();
  for (const record of records) {
    const links = grouped.get(record.target) ?? [];
    links.push(`${record.from} -> ${record.destination}`);
    grouped.set(record.target, links);
  }
  for (const [target, links] of grouped) {
    console.log(`  ${target}`);
    for (const link of links) console.log(`    ${link}`);
  }
}

let result = await scan();
if (result.pending.length > 0) result = await scan();

console.log(
  `Scanned ${result.files} markdown files, ${result.localLinks} local links.`,
);
if (result.pending.length > 0) {
  printRecords(
    'Pending sibling documentation (not a failure):',
    result.pending,
  );
}
if (result.broken.length > 0) {
  printRecords('Broken local links:', result.broken);
  process.exitCode = 1;
} else {
  console.log('No broken local links.');
}
