# Storybook continuous reload regression

Resolved October 4, 2026.

The local preview on port 4400 repeatedly flashed because its iframe reloaded
several times per second. The console reported missing HMR updates and full
reloads. This affected unrelated stories because the entire preview restarted.

The live test server on port 4500 shared Storybook's generated bundle directory
with the running preview. Storybook writes development bundles to disk, and the
security-patched Webpack middleware serves those disk files. Building the test
server thus replaced the preview's runtime with another compiler's output.
The preview's HMR stream reported hash `b7b59d842c2c08ff4c34`, while its served
runtime reported `dc4e357038b14c3ad2be`. Disabling browser caching did not change
that mismatch.

`libs/ui/.storybook/main.ts` now places development output in a port-specific
subdirectory. `tools/storybook-runtime-check.mjs` compares an HMR stream's
compiler hash with the runtime served by that same server. A mismatch fails the check. The live test
runner checks its own server and, when present, the default preview before and
after the suite. Production output is unaffected.

Incident-time verification: all 66 Storybook suites / 198 interaction and accessibility checks
passed against port 4500 with the restored preview on 4400 running throughout.
Both servers passed the compiler/runtime checks before and after testing.
The static production Storybook suite also passed all 198 checks, and the UI
lint target passed. The restored browser preview rendered normally with no new
HMR reload warnings during either run.

The current suite totals and confirmed revisions are recorded in
[Verification](VERIFICATION.md). Keep the per-port output and runtime guards
when changing Storybook tooling.

Illustration examples use the local `apps/showcase/public/example-illustrations/` directory.
The static Storybook cache includes these files as inputs.
The Jest runner ignores package output in `dist/` to avoid duplicate package names.
These settings must preserve the per-port runtime isolation above.
