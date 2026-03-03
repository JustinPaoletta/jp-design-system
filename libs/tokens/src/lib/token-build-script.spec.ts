import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

const REPO_ROOT = path.resolve(__dirname, '../../../../');
const TOKENS_SOURCE = path.join(REPO_ROOT, 'libs/tokens/src/tokens');
const BUILD_SCRIPT = path.join(
  REPO_ROOT,
  'libs/tokens/scripts/build-tokens.mjs',
);

jest.setTimeout(30000);

type CommandResult = {
  code: number;
  stdout: string;
  stderr: string;
};

function runBuildScript(
  args: string[],
  env: Record<string, string>,
): Promise<CommandResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [BUILD_SCRIPT, ...args], {
      cwd: REPO_ROOT,
      env: {
        ...process.env,
        ...env,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += String(chunk);
    });

    child.stderr.on('data', (chunk) => {
      stderr += String(chunk);
    });

    child.on('error', reject);
    child.on('close', (code) => {
      resolve({
        code: code ?? 1,
        stdout,
        stderr,
      });
    });
  });
}

async function createIsolatedTokensRoot(): Promise<string> {
  const tempDir = await fs.mkdtemp(
    path.join(os.tmpdir(), 'jp-token-script-test-'),
  );
  const tokensRoot = path.join(tempDir, 'tokens');
  await fs.cp(TOKENS_SOURCE, tokensRoot, { recursive: true });
  return tokensRoot;
}

describe('build-tokens script', () => {
  it('builds successfully from an isolated token fixture', async () => {
    const tokensRoot = await createIsolatedTokensRoot();
    const outputDir = await fs.mkdtemp(
      path.join(os.tmpdir(), 'jp-token-output-'),
    );

    try {
      const result = await runBuildScript(['--output-dir', outputDir], {
        JP_TOKEN_SOURCE_ROOT: tokensRoot,
      });

      expect(result.code).toBe(0);
      await expect(
        fs.readFile(path.join(outputDir, 'tokens.css'), 'utf8'),
      ).resolves.toContain(':root');
      await expect(
        fs.readFile(path.join(outputDir, 'tokens.compact.css'), 'utf8'),
      ).resolves.toContain('[data-jp-density="compact"]');
      await expect(
        fs.readFile(path.join(outputDir, 'tokens.json'), 'utf8'),
      ).resolves.toContain('"defaultAccent": "neon"');
    } finally {
      await fs.rm(path.dirname(tokensRoot), { recursive: true, force: true });
      await fs.rm(outputDir, { recursive: true, force: true });
    }
  });

  it('fails when semantic tokens reference a missing primitive', async () => {
    const tokensRoot = await createIsolatedTokensRoot();
    const outputDir = await fs.mkdtemp(
      path.join(os.tmpdir(), 'jp-token-output-'),
    );

    try {
      const semanticBasePath = path.join(tokensRoot, 'semantic/base.json');
      const semanticBase = await fs.readFile(semanticBasePath, 'utf8');
      const broken = semanticBase.replace(
        '{primitive.color.neutral.1100}',
        '{primitive.color.neutral.missing}',
      );
      await fs.writeFile(semanticBasePath, broken);

      const result = await runBuildScript(['--output-dir', outputDir], {
        JP_TOKEN_SOURCE_ROOT: tokensRoot,
      });

      expect(result.code).not.toBe(0);
      expect(`${result.stdout}\n${result.stderr}`).toMatch(
        /resolve|reference|missing/i,
      );
    } finally {
      await fs.rm(path.dirname(tokensRoot), { recursive: true, force: true });
      await fs.rm(outputDir, { recursive: true, force: true });
    }
  });

  it('fails when semantic tokens create a circular reference', async () => {
    const tokensRoot = await createIsolatedTokensRoot();
    const outputDir = await fs.mkdtemp(
      path.join(os.tmpdir(), 'jp-token-output-'),
    );

    try {
      const semanticBasePath = path.join(tokensRoot, 'semantic/base.json');
      const semanticBase = JSON.parse(
        await fs.readFile(semanticBasePath, 'utf8'),
      ) as Record<string, unknown>;

      const color = semanticBase['color'] as Record<string, unknown>;
      const surface = color['surface'] as Record<string, unknown>;
      (surface['canvas'] as { value: string }).value = '{color.surface.sunken}';
      (surface['sunken'] as { value: string }).value = '{color.surface.canvas}';

      await fs.writeFile(
        semanticBasePath,
        `${JSON.stringify(semanticBase, null, 2)}\n`,
      );

      const result = await runBuildScript(['--output-dir', outputDir], {
        JP_TOKEN_SOURCE_ROOT: tokensRoot,
      });

      expect(result.code).not.toBe(0);
      expect(`${result.stdout}\n${result.stderr}`).toMatch(
        /circular|cycle|reference errors|could not be found/i,
      );
    } finally {
      await fs.rm(path.dirname(tokensRoot), { recursive: true, force: true });
      await fs.rm(outputDir, { recursive: true, force: true });
    }
  });
});
