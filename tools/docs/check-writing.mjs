import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const commands =
  /^(?:Run|Use|Set|Supply|Keep|Read|Compare|Do|Open|Close|Install|Import|Add|Remove|Delete|Select|Give|Write|Bind|Handle|Put|Make sure|Start|Stop|Examine|Repeat|Pass|Mark|Place|Project|Apply|Replace|Include|Load|Record|Translate|Format|Name|Move|Enable|Disable|Cancel|Insert|Copy|Drag|Release|Navigate|Listen|Show)\b/i;

function isInstruction(text) {
  if (commands.test(text)) return true;
  const conditional = text.match(
    /^(?:If|When|Before|After|While|During|For|On|With|Without)\b[^,]*,\s*(.+)/i,
  );
  return conditional ? commands.test(conditional[1]) : false;
}

function textOnly(text) {
  return (
    text
      // Exact API names and quoted interface labels are technical terms.
      .replace(/(`+)[^`]*?\1/g, 'API')
      .replace(/"[^"\n]+"|“[^”\n]+”/g, 'LABEL')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/https?:\/\/\S+/g, 'URL')
      .replace(/\b(?:\d+\.)+\d+\b/g, 'VERSION')
      .replace(/\b[a-zA-Z0-9_-]+\.(?:mjs|cjs|ts|json|css|md|yml)\b/g, 'FILE')
      .replace(/[*_]/g, '')
      .replace(/’/g, "'")
  );
}

export function countWords(text) {
  return (text.match(/[\p{L}\p{N}]+(?:[-'’][\p{L}\p{N}]+)*/gu) ?? []).length;
}

export function textUnits(markdown) {
  const units = [];
  let lines = [];
  let firstLine = 1;
  let fence = null;
  let kind = 'paragraph';
  const flush = () => {
    if (lines.length)
      units.push({ line: firstLine, kind, text: lines.join(' ') });
    lines = [];
    kind = 'paragraph';
  };
  // Keep line numbers while removing comment text.
  const prose = markdown.replace(/<!--[\s\S]*?-->/g, (comment) =>
    comment.replace(/[^\r\n]/g, ' '),
  );
  for (const [index, line] of prose.split(/\r?\n/).entries()) {
    const trimmed = line.trim();
    const marker = trimmed.match(/^(`{3,}|~{3,})/);
    if (marker) {
      flush();
      if (!fence) fence = marker[1];
      else if (
        marker[1][0] === fence[0] &&
        marker[1].length >= fence.length &&
        !trimmed.slice(marker[1].length).trim()
      )
        fence = null;
      continue;
    }
    if (fence) continue;
    if (!trimmed || /^#{1,6}\s|^---+$|^<!--/.test(trimmed)) {
      flush();
      continue;
    }
    if (trimmed.startsWith('|')) {
      flush();
      const protectedLine = trimmed.replace(/(`+)[^`]*?\1/g, 'API');
      for (const cell of protectedLine.split(/(?<!\\)\|/).slice(1, -1)) {
        if (!cell.trim() || /^\s*:?-+:?\s*$/.test(cell)) continue;
        units.push({ line: index + 1, kind: 'table', text: cell.trim() });
      }
      continue;
    }
    const item = trimmed.match(/^(?:[-*]\s+(?:\[[ x]\]\s+)?|\d+\.\s+)/);
    if (item) {
      flush();
      firstLine = index + 1;
      kind = /^\d/.test(item[0]) || /\[[ x]\]/.test(item[0]) ? 'step' : 'list';
      lines.push(trimmed.slice(item[0].length));
    } else {
      if (!lines.length) firstLine = index + 1;
      lines.push(trimmed);
    }
  }
  flush();
  return units;
}

export function inspectWriting(markdown) {
  const findings = [];
  for (const unit of textUnits(markdown)) {
    const text = textOnly(unit.text);
    const sentences = text
      .split(/[.!?]+(?:\s+|$)/)
      .filter((s) => countWords(s));
    if (unit.kind === 'paragraph' && sentences.length > 6) {
      findings.push({
        line: unit.line,
        message: `Paragraph has ${sentences.length} sentences; maximum is 6.`,
      });
    }
    for (const sentence of sentences) {
      const instruction =
        unit.kind === 'step' || isInstruction(sentence.trim());
      const maximum = instruction ? 20 : 25;
      const words = countWords(sentence);
      if (words > maximum)
        findings.push({
          line: unit.line,
          message: `Sentence has ${words} words; maximum is ${maximum}.`,
          text: sentence.trim(),
        });
    }
    if (/\b(?:in order to|utilize|commence|ensure)\b/i.test(text)) {
      findings.push({
        line: unit.line,
        message: 'Use a simpler phrase: to, use, start or make sure.',
      });
    }
    if (
      /\b(?:can't|won't|don't|doesn't|isn't|aren't|it's|that's|we're|you'll|you're|wasn't|weren't|couldn't|shouldn't|wouldn't|we've|they're|you've|let's)\b/i.test(
        text,
      )
    ) {
      findings.push({
        line: unit.line,
        message: 'Write contractions in full.',
      });
    }
  }
  return findings;
}

export function documentationFiles(base = root) {
  const files = [];
  const addTree = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) addTree(path);
      else if (entry.name.endsWith('.md')) files.push(path);
    }
  };
  for (const name of [
    'README.md',
    'RELEASE.md',
    'MANUAL_QA.md',
    'COMPONENT_EXPANSION_PLAN.md',
    'CHANGELOG.md',
  ])
    files.push(join(base, name));
  addTree(join(base, 'docs'));
  for (const group of ['apps', 'libs']) {
    for (const entry of readdirSync(join(base, group), {
      withFileTypes: true,
    })) {
      if (!entry.isDirectory()) continue;
      const directory = join(base, group, entry.name);
      for (const name of readdirSync(directory)) {
        if (/^README(?:\.package)?\.md$/.test(name))
          files.push(join(directory, name));
      }
    }
  }
  return files.sort();
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const files = documentationFiles();
  const findings = files.flatMap((path) =>
    inspectWriting(readFileSync(path, 'utf8')).map((finding) => ({
      path: relative(root, path),
      ...finding,
    })),
  );
  for (const finding of findings)
    console.error(
      `${finding.path}:${finding.line}: ${finding.message}${finding.text ? ` ${finding.text}` : ''}`,
    );
  console.log(
    `Checked ${files.length} documentation files; ${findings.length} writing findings.`,
  );
  console.log(
    'This check covers selected clarity rules. It does not establish full ASD-STE100 conformance.',
  );
  process.exitCode = findings.length ? 1 : 0;
}
