# Contributing to REA:Reverse Engineer Android

REA:Reverse Engineer Android welcomes focused bug fixes, documentation
improvements, tests, and Android reverse-engineering workflows. Large contract
or architecture changes should explain the concrete problem, intended scope,
authority, and verification before implementation.

This repository is an Android-only hard fork of REA. Contributions must preserve
that product boundary. Do not restore a removed target family, provider, CLI
command, MCP tool, or documentation claim unless the change explicitly includes
a new scope decision and the required verification.

## Choosing a contribution

Explain the concrete problem, keep related corrections together, and report
verified and unavailable coverage. Contributions should justify their review
and maintenance cost. Keep cosmetic polish with useful fixes; confusing or
incorrect user instructions warrant standalone corrections.

Use the [architecture map](docs/architecture.mermaid) for selected ownership
and dependency paths. For current provider wiring, start with:

- [`src/composition/android.ts`](src/composition/android.ts) for JADX.
- [`src/composition/adb.ts`](src/composition/adb.ts) for ADB.
- [`src/composition/apktool.ts`](src/composition/apktool.ts) for resources.
- [`src/composition/flutter.ts`](src/composition/flutter.ts) for Flutter.
- [`src/composition/jeb.ts`](src/composition/jeb.ts) for JEB.
- [`src/composition/binary.ts`](src/composition/binary.ts) for Ghidra and IDA.
- [`src/server/createServer.ts`](src/server/createServer.ts) for MCP
  composition.

Production factories construct fresh providers without starting engines or
acquiring targets. Optional provider failures must preserve successful peers.

Run `npm run verify:test-discovery` after adding or moving tests. Module import
boundaries are checked by `npm run verify:module-boundaries`.

Before retiring a facade or compatibility path, trace runtime registration,
dynamic imports, verifier scripts, packaged entrypoints, and public contracts as
well as TypeScript references. Tests may be the last consumers of an internal
path; migrate their distinct assertions before removing it. Preserve validation,
lazy loading, caller policy, resource acquisition, and cleanup supplied by the
old boundary.

Follow [AGENTS.md](AGENTS.md) for repository invariants, provider ownership,
Evidence semantics, and resource lifecycle rules. Use
[docs/tool-design.md](docs/tool-design.md) when changing a public CLI or MCP
contract.

For analysis workflows and agent interfaces, follow the
[performance priorities](AGENTS.md#performance). Explain the selected output
scope, reuse decisions, and relevant before/after measurements when those costs
change. Use the
[analysis optimization skill](.agents/skills/rea-analysis-optimization/SKILL.md)
for measured Android or shared-workflow optimizations.

## Reporting issues

Use the issue form that fits the report and keep it concise. For Android issues,
include:

- The actual result and the shortest reproduction you ran.
- The REA:Reverse Engineer Android revision or source state.
- Host operating system and Node.js version.
- APK path or device serial only when it is safe to share.
- JADX, JDK, ADB, Apktool, Ghidra, IDA, JEB, Frida, or device version when
  relevant.
- The smallest useful CLI or MCP output, Evidence, diagnostics, or screenshot.

State observed impact and frequency. Keep untested scope and suspected causes
explicit. If a narrative answer or supporting Evidence is unavailable, write
`NOT_ENOUGH_INFO` and explain the gap. Clearly label source-only findings and
proposed checks; do not claim runtime reproduction or measurements you did not
perform.

Feature and design proposals can start with a problem and desired outcome.
Examples, prior art, and measurements help when available. Incomplete reports
and early design ideas are welcome when their limitations are explicit.

Redact transport tokens, credentials, private keys, device secrets, personal
data, and explicitly marked sensitive values. Do not publish private APKs,
provider project files, or captured user data.

## Change ownership and readiness

AI-assisted contributions are welcome. Every change that is reviewed, merged,
or distributed must have a human owner responsible for the complete code,
tests, documentation, and claims.

Before handing off a change, the human owner should:

- Review the final diff and the relevant Android-only contracts.
- Be able to explain the problem, approach, authority, side effects, and
  meaningful edge cases.
- Provide the checks that actually ran and the observed results.
- State unavailable host, device, provider, or engine coverage.
- Keep the change description current when behavior or validation changes.

If the project uses pull requests, draft status remains optional. AI agents must
not complete human review attestations or claim human approval on the owner's
behalf.

## Android-only contribution scope

REA:Reverse Engineer Android focuses on shipped Android applications, Android
devices, Android resources, and native code loaded or distributed with an
Android application.

Supported contributions include:

- APK package, manifest, DEX, class, method, reference, and JNI inspection.
- APK v1/v2/v3/v3.1 signature inspection.
- Android resource decoding through Apktool.
- Flutter APK parsing and supported Dart AOT inspection.
- ADB device, package, file, log, process, and app lifecycle workflows.
- Frida instrumentation with explicit target and mutation boundaries.
- JEB project and decompilation workflows.
- ELF notes, exports, layout, entropy, function, reference, and CFG analysis
  for Android native libraries.
- Ghidra and IDA provider integration.
- Android support analysis for SQLite app data, saved packet captures,
  process/crash evidence, devicetree and system images, kernel modules, raw
  binary regions, and legacy or emerging Android native architectures.
- Android-focused Go, Rust, Unity, Godot, React Native, and Hermes context
  when it is grounded in APK members, `.so` libraries, resource archives, or
  explicit runtime observations.
- Evidence reporting, retained views, provider diagnostics, cleanup, and
  resource budget fixes.

The fork does not currently include or distribute:

- Browser, Electron, standalone JavaScript, or web-capture workflows.
- Apple, iOS, macOS, HarmonyOS, or desktop application workflows.
- Non-Android firmware, RL environment, managed .NET, model, GPU, EVM, WASM,
  or unrelated artifact workflows.
- Hopper, Kuna, Cutter, GDB, Rizin, or objdump provider workflows.

Support analysis is not a public family. It may remain in the source tree,
tests, fixtures, documentation, and website as Android context, but it must not
appear in the default MCP catalog or CLI command list without a separate scope
decision.

Do not re-enable a removed family or register a removed public tool merely
because upstream REA adds it. A future Android-specific integration needs a
separate scope decision, public contract, tests, documentation, and package
inventory update.

### Runtime and device authority

Runtime investigation needs explicit boundaries. Launching or attaching to a
process, injecting instrumentation, running scripts, and changing memory,
registers, packages, files, or device state require review of target selection,
execution and mutation authority, provenance, limits, cancellation, and
cleanup.

General Frida support is not inherently read-only. ADB install, uninstall, push,
app start/stop, screen capture, log collection, and bugreport operations have
distinct effects. Keep the selected serial, package, process, script, and
observation window exact.

### Excluded workflows

REA:Reverse Engineer Android does not integrate or officially distribute:

- Purpose-built workflows to defeat commercial packing or code-virtualization
  protections and automatically recover protected code.
- Anti-debugging or anti-instrumentation evasion.
- DRM, license, anti-cheat, or access-control bypass workflows.
- Exploit or attack-payload automation, credential theft, covert persistence,
  unauthorized access, or bulk attack workflows.

Ordinary extraction and general static deobfuscation are not excluded merely
because the input is packed or obfuscated. Review the added bypass or execution
behavior separately.

### Fail-closed integration

If scope fit, target authority, side effects, or required verification remain
materially unresolved, do not merge, enable, or include the capability in the
local distribution. Keep the proposal pending, narrow it, or decline it.

Record unknowns explicitly. Do not turn them into `none` or assumed safety.
Passing CI, completed implementation, upstream popularity, or silence from a
reviewer is not scope approval.

For a new provider or a capability involving target execution, injection,
mutation, or protection recovery, resolve the scope and permission questions
before substantial implementation intended for the Android-only distribution.
Small exploratory prototypes and draft proposals are welcome when their limits
are explicit.

## Development setup

Use the Node.js version in [.nvmrc](.nvmrc) and the package manager pinned in
`package.json#packageManager`.

```sh
npm ci
npm run check:fast
```

`npm ci` installs the locked dependencies. Run `npm run build:cached` when you
need the local CLI or MCP runtime:

```sh
npm run build:cached
node scripts/rea.mjs --help
```

This fork is source-managed. `rea update` does not install the upstream npm
package. See [docs/fork-maintenance.md](docs/fork-maintenance.md) and
[upstream-sync.json](upstream-sync.json) for selective upstream maintenance.

### Windows source checkouts

Windows JADX, Ghidra, and owned-process workflows require the packaged native
controls under `native/windows/build/`. The source tree does not generate those
files during `npm ci` or `npm run build:cached`.

Restore the matching files from the exact `rea-agents@6.8.0` tarball or follow
[native/windows/README.md](native/windows/README.md). Keep generated build
artifacts out of the source change.

Some Android subprocess fixtures use POSIX shell or POSIX rename behavior. On
Windows, compare failures against the base revision or run the relevant lane on
Linux or WSL before attributing them to the change.

## Documentation

Keep documentation aligned with the Android-only public surface:

- [README.md](README.md) is the English entry point.
- The maintained translated READMEs are `README_zh.md`, `README_zh-TW.md`,
  `README_fr.md`, `README_de.md`, `README_pt-BR.md`, `README_es.md`,
  `README_ko.md`, and `README_ja.md` under `docs/readme/`.
- Use the current README as the source for commands, requirements, support
  claims, and Android-only family lists.
- Update all maintained README editions when commands, setup, provider support,
  package names, or public behavior changes.

Do not re-add a removed translation unless the Android-only README is
translated and its links are updated.

Docs changes should preserve:

- Exact command names and environment variables.
- Relative links that work from the edited document.
- Real provider prerequisites and unavailable coverage.
- The distinction between static observations, runtime observations,
  derivations, inferences, and unknowns.

Run `npm run docs:check` for contract, generated metadata, README, or
translation changes. Run `npm run docs:generate` only when the generated
documentation artifacts are intentionally being refreshed.

## Verification

Select checks based on the affected behavior. For a routine source change:

```sh
npm run test:focused -- PATH...
npm run check:fast
```

For Android/native contract changes, also run:

```sh
npm run verify:module-boundaries
npm run verify:test-discovery
npm run docs:check
```

For package, setup, skill, or distribution changes, run:

```sh
npm run verify:package
npm pack --dry-run --ignore-scripts --cache .npm-cache
```

On Windows, the packaged native self-test may require a host context that can
open the selected user paths. Report that requirement explicitly if it cannot
run.

### Provider verification lanes

Use the real lane for the affected provider:

| Change area                             | Lane                           |
| --------------------------------------- | ------------------------------ |
| JADX, APK, manifest, class, method, JNI | `npm run verify:android`       |
| APK signatures                          | `npm run verify:apk-signature` |
| Apktool resources                       | `npm run verify:apktool`       |
| ADB device workflows                    | `npm run verify:adb`           |
| Flutter parsing and AOT                 | `npm run verify:flutter`       |
| Frida sessions and scripts              | `npm run verify:frida`         |
| JEB project workflows                   | `npm run verify:jeb`           |
| Ghidra native analysis                  | `npm run verify:ghidra`        |
| IDA native analysis                     | `npm run verify:ida`           |

These lanes may require a real APK, device, JDK, JADX JAR, Apktool launcher,
Ghidra installation, IDA MCP configuration, JEB client, or Frida runtime. State
which prerequisites were unavailable. Simulated provider tests do not establish
real-provider behavior.

### Catalog and context checks

The default Android MCP catalog must stay at or below 120 tools. After a
contract or family change, run:

```sh
node scripts/generate-mcp-tool-catalog.mjs
node scripts/generate-mcp-tool-catalog.mjs --check
node scripts/generate-product-catalog.mjs
node scripts/generate-product-catalog.mjs --check
```

Confirm that removed tool names and removed family ids do not reappear. Measure
catalog size with the same input/output schema profiles used by the client, and
do not claim a token reduction from raw JSON size alone.

### Generated files

`skills/`, `docs/public/product-catalog.json`, and generated verification
outputs are ignored generated artifacts. Edit the authored Android skill in
`.agents/skills/reverse-engineer-anything/`, then regenerate the shipped skill.

Keep source contracts, examples, CLI/MCP translations, generated documentation,
and schema conformance checks together in the same change where required.

## Lifecycle and cleanup

Preserve the existing ownership model:

- A process exit does not prove that output is closed.
- A launcher or PID alone does not prove target ownership.
- Failed cleanup retains the owning resource and must be retried.
- Partial observations survive later validation, cancellation, or cleanup
  failure.
- Shared producers keep work alive for remaining callers.
- Active cancellation does not replace finalization or cleanup checks.

Use `createTestTempDirectory` from
`tests/fixtures/temporaryDirectory.ts` for exact-path test cleanup. Never
glob-clean shared `/tmp/rea-*` content.

Run `npm run verify:test-temp-hygiene` for changes that alter temporary
directory ownership or cleanup.

Use the applicable lifecycle regressions in
[docs/testing.md](docs/testing.md#lifecycle-regressions) for cancellation,
late completion, child cleanup, retry, and retained-capacity changes.

## Diagnostics and privacy

`REA_LOG_LEVEL` accepts `trace`, `debug`, `info`, `warn`, `error`, `fatal`, or
`silent`. Logs go to stderr. One-shot CLI logging is opt-in so stdout contains
only command results.

Do not retain request credentials, bridge tokens, transport authentication, or
explicitly marked sensitive values in diagnostics or Evidence. Do not infer
secrecy from a variable name alone.

## Release and distribution

This fork is distributed from the local source checkout. It does not publish
through the upstream REA release process and does not update from the public
`rea-agents` package.

A local release should:

1. Run the deterministic checks relevant to the change.
2. Build with `npm run build:cached`.
3. Run the relevant real-provider lanes where prerequisites are available.
4. Run package verification for the target host.
5. Report unavailable coverage and known limitations.
6. Keep the package file inventory Android-only.

Do not publish a package that restores a removed provider or non-Android
family without a new scope decision.
