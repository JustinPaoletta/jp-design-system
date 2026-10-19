import { tokenizeCode } from './code-tokens';

describe('tokenizeCode', () => {
  it('keeps all source characters and tokenizes script strings before their contents', () => {
    const code =
      '\tconst player = "false // 42";\r\n/* inning 9 */\nlet runs = 0x2a;\n';
    const tokens = tokenizeCode(code, ' TypeScript ');
    expect(tokens.map((token) => token.text).join('')).toBe(code);
    expect(tokens.filter((token) => token.kind === 'string')).toEqual([
      { kind: 'string', text: '"false // 42"' },
    ]);
    expect(
      tokens
        .filter((token) => token.kind === 'keyword')
        .map((token) => token.text),
    ).toEqual(['const', 'let']);
    expect(
      tokens
        .filter((token) => token.kind === 'number')
        .map((token) => token.text),
    ).toEqual(['0x2a']);
    expect(
      tokens
        .filter((token) => token.kind === 'comment')
        .map((token) => token.text),
    ).toEqual(['/* inning 9 */']);
  });

  it('keeps escaped quotes and backticks inside string tokens', () => {
    const code =
      String.raw`const message = 'Alex\'s run'; const note = "Lineup: \"ready\""; const score = \`Falcons 5\`;`.replace(
        /\\`/g,
        '`',
      );
    const tokens = tokenizeCode(code, 'js');
    expect(tokens.map((token) => token.text).join('')).toBe(code);
    expect(
      tokens
        .filter((token) => token.kind === 'string')
        .map((token) => token.text),
    ).toEqual([
      String.raw`'Alex\'s run'`,
      String.raw`"Lineup: \"ready\""`,
      '`Falcons 5`',
    ]);
  });

  it('identifies JSON values without treating words in keys or strings as code', () => {
    const code =
      '{\n  "return": "true 5", "runs": -2.5e+2, "final": true, "next": null\n}';
    const tokens = tokenizeCode(code, 'JSON');
    expect(tokens.map((token) => token.text).join('')).toBe(code);
    expect(
      tokens
        .filter((token) => token.kind === 'keyword')
        .map((token) => token.text),
    ).toEqual(['true', 'null']);
    expect(
      tokens
        .filter((token) => token.kind === 'number')
        .map((token) => token.text),
    ).toEqual(['-2.5e+2']);
  });

  it('keeps unfinished comments and unsupported languages intact', () => {
    expect(tokenizeCode('/* const lineup = 9', 'ts')).toEqual([
      { kind: 'comment', text: '/* const lineup = 9' },
    ]);
    for (const language of ['', 'HTML', 'python']) {
      const code = '<script>const score = 5;</script>\n';
      expect(tokenizeCode(code, language)).toEqual([
        { kind: 'plain', text: code },
      ]);
    }
    expect(tokenizeCode('', 'javascript')).toEqual([]);
  });

  it('uses plain text above the source-length limit while allowing its boundary', () => {
    const boundary = 'const' + ' '.repeat(49995);
    expect(tokenizeCode(boundary, 'ts')[0]).toEqual({
      kind: 'keyword',
      text: 'const',
    });
    const oversized = boundary + ' ';
    expect(tokenizeCode(oversized, 'ts')).toEqual([
      { kind: 'plain', text: oversized },
    ]);
  });

  it('bounds token count, including a final whitespace token', () => {
    const atLimit = '1 '.repeat(2500);
    expect(tokenizeCode(atLimit, 'js')).toHaveLength(5000);
    for (const code of ['1 '.repeat(2501), ' ' + atLimit]) {
      expect(tokenizeCode(code, 'js')).toEqual([{ kind: 'plain', text: code }]);
    }
  });
});
