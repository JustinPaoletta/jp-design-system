export type CodeToken = {
  kind: 'plain' | 'comment' | 'string' | 'keyword' | 'number';
  text: string;
};

// This lexer supplies visual hints, not a complete language grammar. Source is
// always rendered through Angular text interpolation, never as trusted HTML.
export function tokenizeCode(code: string, language: string): CodeToken[] {
  const name = language.trim().toLowerCase();
  const json = name === 'json';
  const script = ['js', 'javascript', 'ts', 'typescript'].includes(name);
  if ((!json && !script) || code.length > 50000) {
    return [{ kind: 'plain', text: code }];
  }
  const pattern = json
    ? /("(?:\\[\s\S]|[^"\\])*"|\b(?:true|false|null)\b|-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)/g
    : /\/\*[\s\S]*?(?:\*\/|$)|\/\/[^\r\n]*|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|`(?:\\[\s\S]|[^`\\])*`|\b(?:async|await|break|case|catch|class|const|continue|default|delete|do|else|enum|export|extends|false|finally|for|from|function|if|implements|import|in|instanceof|interface|let|new|null|of|private|protected|public|readonly|return|static|super|switch|this|throw|true|try|type|typeof|undefined|var|void|while|yield)\b|\b(?:0[xX][\da-fA-F]+|0[bB][01]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)(?:n)?\b/g;
  const tokens: CodeToken[] = [];
  let offset = 0;
  for (const match of code.matchAll(pattern)) {
    if (match.index > offset) {
      tokens.push({ kind: 'plain', text: code.slice(offset, match.index) });
    }
    const text = match[0];
    const first = text[0];
    const kind: CodeToken['kind'] = text.startsWith('/')
      ? 'comment'
      : ['"', "'", '`'].includes(first)
        ? 'string'
        : /[\d-]/.test(first)
          ? 'number'
          : 'keyword';
    tokens.push({ kind, text });
    offset = match.index + text.length;
    if (tokens.length > 5000) return [{ kind: 'plain', text: code }];
  }
  if (offset < code.length) {
    tokens.push({ kind: 'plain', text: code.slice(offset) });
  }
  return tokens.length > 5000 ? [{ kind: 'plain', text: code }] : tokens;
}
