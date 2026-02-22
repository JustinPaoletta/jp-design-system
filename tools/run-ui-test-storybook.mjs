#!/usr/bin/env node

import { spawn } from 'node:child_process';

const STORYBOOK_URL = process.env.STORYBOOK_URL || 'http://localhost:4500';
const READY_TIMEOUT_MS = Number(
  process.env.STORYBOOK_READY_TIMEOUT_MS || 120000,
);

function spawnCommand(command, args, options = {}) {
  return spawn(command, args, {
    stdio: 'inherit',
    shell: false,
    ...options,
  });
}

async function waitForStorybook(url, timeoutMs) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: 'manual' });
      if (response.status >= 200 && response.status < 500) {
        return;
      }
    } catch {
      // Ignore connection errors while server is booting.
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(
    `Timed out waiting for Storybook at ${url} after ${timeoutMs}ms.`,
  );
}

function stopProcess(child) {
  if (!child || child.killed || child.exitCode !== null) {
    return;
  }

  child.kill('SIGTERM');
}

async function main() {
  const storybook = spawnCommand('npx', [
    'nx',
    'run',
    'ui:static-storybook',
    '--watch=false',
    '--port=4500',
  ]);

  const handleSignal = (signal) => {
    stopProcess(storybook);
    process.exit(signal === 'SIGINT' ? 130 : 143);
  };

  process.on('SIGINT', handleSignal);
  process.on('SIGTERM', handleSignal);

  try {
    await waitForStorybook(STORYBOOK_URL, READY_TIMEOUT_MS);

    const testRunner = spawnCommand('npx', [
      'test-storybook',
      '-c',
      'libs/ui/.storybook',
      '--url',
      STORYBOOK_URL,
    ]);

    const testExitCode = await new Promise((resolve) => {
      testRunner.on('exit', (code) => resolve(code ?? 1));
    });

    stopProcess(storybook);

    process.exit(testExitCode);
  } catch (error) {
    stopProcess(storybook);
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
