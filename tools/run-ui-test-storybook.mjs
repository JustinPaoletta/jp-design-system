#!/usr/bin/env node

import { spawn } from 'node:child_process';

const STORYBOOK_URL = process.env.STORYBOOK_URL || 'http://localhost:4500';
const READY_TIMEOUT_MS = Number(
  process.env.STORYBOOK_READY_TIMEOUT_MS || 300000,
);

function spawnCommand(command, args, options = {}) {
  return spawn(command, args, {
    stdio: 'inherit',
    shell: false,
    // Own a process group on Unix so cleanup includes Nx and its server children.
    detached: process.platform !== 'win32',
    ...options,
  });
}

async function waitForStorybook(url, timeoutMs, child) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (child.exitCode !== null || child.signalCode !== null) {
      throw new Error(
        `Storybook exited before becoming ready (code ${child.exitCode}, signal ${child.signalCode}).`,
      );
    }
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

  try {
    if (process.platform !== 'win32' && child.pid) {
      process.kill(-child.pid, 'SIGTERM');
    } else {
      child.kill('SIGTERM');
    }
  } catch (error) {
    if (error.code !== 'ESRCH') throw error;
  }
}

async function main() {
  const storybook = spawnCommand('npx', [
    'nx',
    'run',
    'ui:static-storybook',
    '--watch=false',
    '--port=4500',
  ]);

  let testRunner;
  const handleSignal = (signal) => {
    stopProcess(testRunner);
    stopProcess(storybook);
    process.exit(signal === 'SIGINT' ? 130 : 143);
  };

  process.on('SIGINT', handleSignal);
  process.on('SIGTERM', handleSignal);

  try {
    await waitForStorybook(STORYBOOK_URL, READY_TIMEOUT_MS, storybook);

    testRunner = spawnCommand('npx', [
      'test-storybook',
      '-c',
      'libs/ui/.storybook',
      '--url',
      STORYBOOK_URL,
      '--maxWorkers=2',
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
