import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import test from 'node:test';
import {
  countWords,
  documentationFiles,
  inspectWriting,
  textUnits,
} from './check-writing.mjs';

const words = (length) => Array.from({ length }, () => 'word').join(' ');

test('counts Unicode, hyphenated words and possessives without counting punctuation', () => {
  assert.equal(countWords("API, user's state-of-the-art café 48px."), 5);
  assert.equal(countWords('API, user’s state-of-the-art café 48px.'), 5);
});

test('uses 20 words for instructions and 25 for descriptions', () => {
  assert.deepEqual(inspectWriting(`Use ${words(19)}.`), []);
  assert.match(
    inspectWriting(`Use ${words(20)}.`)[0].message,
    /21 words; maximum is 20/,
  );
  assert.deepEqual(inspectWriting(`The ${words(24)}.`), []);
  assert.match(
    inspectWriting(`The ${words(25)}.`)[0].message,
    /26 words; maximum is 25/,
  );
});

test('recognizes instructions after a condition', () => {
  assert.deepEqual(
    inspectWriting(`If data changes, replace ${words(16)}.`),
    [],
  );
  assert.match(
    inspectWriting(`If data changes, replace ${words(17)}.`)[0].message,
    /21 words; maximum is 20/,
  );
});

test('applies instruction limits to numbered steps and checkboxes', () => {
  const findings = inspectWriting(
    `1. ${words(21)}.\n\n- [ ] ${words(21)}.\n\n- ${words(21)}.`,
  );
  assert.deepEqual(
    findings.map((finding) => finding.line),
    [1, 3],
  );
  assert.ok(findings.every((finding) => /maximum is 20/.test(finding.message)));
});

test('limits paragraphs to six sentences and allows a new paragraph', () => {
  const sentence = 'The state is ready.';
  assert.deepEqual(inspectWriting(Array(6).fill(sentence).join(' ')), []);
  assert.match(
    inspectWriting(Array(7).fill(sentence).join(' '))[0].message,
    /7 sentences/,
  );
  assert.deepEqual(
    inspectWriting(
      `${Array(4).fill(sentence).join(' ')}\n\n${Array(4).fill(sentence).join(' ')}`,
    ),
    [],
  );
});

test('keeps fenced code outside the prose check and respects fence lengths', () => {
  const markdown = [
    '````ts',
    words(40),
    '```',
    '````not-a-close',
    "don't ensure anything",
    '````',
    '',
    '~~~sh',
    words(40),
    '~~~',
    '',
    `Use ${words(20)}.`,
  ].join('\n');
  const findings = inspectWriting(markdown);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].line, 12);
});

test('keeps exact code and quoted labels while checking their surrounding prose', () => {
  assert.deepEqual(
    inspectWriting(
      'Use `someFunction("ensure this does not change")` or "Don\'t close".',
    ),
    [],
  );
  assert.deepEqual(inspectWriting("The label is “Don't close”."), []);
  assert.deepEqual(inspectWriting('Use ``someFunction("value")``.'), []);
  assert.match(
    inspectWriting(`Use \`someFunction()\` ${words(19)}.`)[0].message,
    /21 words/,
  );
});

test('checks link labels but ignores destinations, versions and file extensions', () => {
  assert.deepEqual(
    inspectWriting(
      'Use [the guide](https://example.com/a/very/long/path). Version 22.2.1 uses check-writing.mjs.',
    ),
    [],
  );
  assert.match(
    inspectWriting(`[The ${words(25)}](https://example.com).`)[0].message,
    /26 words/,
  );
});

test('keeps source lines for wrapped list items and multiline comments', () => {
  const markdown = `<!--\n${words(30)}\n-->\n\n- Use ${words(9)}\n  ${words(11)}.\n`;
  const findings = inspectWriting(markdown);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].line, 5);
  assert.match(findings[0].message, /21 words/);
});

test('handles table cells with inline type unions and escaped separators', () => {
  const markdown =
    '| API | Meaning |\n| --- | --- |\n| `string | null` | Use one value \\| another value. |';
  const units = textUnits(markdown);
  assert.equal(units.length, 4);
  assert.equal(units[2].text, 'API');
  assert.equal(units[3].line, 3);
  assert.deepEqual(inspectWriting(markdown), []);
});

test('finds contractions and indirect wording but permits possessives', () => {
  const findings = inspectWriting(
    "You don't need to utilize it in order to ensure the user's state.",
  );
  assert.equal(findings.length, 2);
  assert.match(findings[0].message, /simpler phrase/);
  assert.match(findings[1].message, /contractions/);
  assert.deepEqual(inspectWriting("The user's state is ready."), []);
  assert.match(
    inspectWriting('You don’t close the panel.')[0].message,
    /contractions/,
  );
});

test('finds maintained documentation without vendor, source or managed tool files', () => {
  const base = mkdtempSync(join(tmpdir(), 'jp-writing-'));
  const included = [
    'README.md',
    'RELEASE.md',
    'MANUAL_QA.md',
    'COMPONENT_EXPANSION_PLAN.md',
    'CHANGELOG.md',
    'docs/README.md',
    'docs/content/WRITING.md',
    'apps/showcase/README.md',
    'libs/ui/README.md',
    'libs/ui/README.package.md',
  ];
  const excluded = [
    'AGENTS.md',
    '.agents/skills/example/SKILL.md',
    'node_modules/example/README.md',
    'tools/ai-migrations/example.md',
    'libs/ui/src/source.md',
    'apps/showcase/notes.md',
  ];
  try {
    for (const name of [...included, ...excluded]) {
      const path = join(base, name);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, '# Fixture\n');
    }
    assert.deepEqual(
      documentationFiles(base)
        .map((path) => relative(base, path))
        .sort(),
      included.sort(),
    );
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});
