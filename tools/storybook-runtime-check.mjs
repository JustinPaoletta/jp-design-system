/** Detect the HMR reload loop caused by serving another compiler's disk assets. */
export async function assertStorybookRuntime(url) {
  const signal = AbortSignal.timeout(10000);
  const events = await fetch(new URL('/__webpack_hmr', url), { signal });
  if (!events.ok || !events.body) {
    throw new Error(`Storybook HMR stream is unavailable at ${url}.`);
  }

  const reader = events.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let compilerHash;
  try {
    while (!compilerHash) {
      const { value, done } = await reader.read();
      if (done) throw new Error(`Storybook HMR stream closed at ${url}.`);
      buffer += decoder.decode(value, { stream: true });
      let newline;
      while ((newline = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (payload === '💓') continue;
        const event = JSON.parse(payload);
        if (['sync', 'built'].includes(event.action) && event.hash) {
          compilerHash = event.hash;
          break;
        }
      }
    }
  } finally {
    await reader.cancel();
  }

  const response = await fetch(new URL('/runtime~main.iframe.bundle.js', url), {
    signal,
    cache: 'no-store',
  });
  if (!response.ok)
    throw new Error(`Storybook runtime is unavailable at ${url}.`);
  const source = await response.text();
  const runtimeHash = source.match(
    /__webpack_require__\.h\s*=\s*\(\)\s*=>\s*\(?["']([^"']+)/,
  )?.[1];
  if (!runtimeHash || runtimeHash !== compilerHash) {
    throw new Error(
      `Storybook at ${url} is serving a different compiler's runtime ` +
        `(${runtimeHash ?? 'missing'} instead of ${compilerHash}). ` +
        'The preview would repeatedly reload; check development output isolation.',
    );
  }
  return compilerHash;
}
