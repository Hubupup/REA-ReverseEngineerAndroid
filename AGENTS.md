# Repository Guidelines

## Product and authority

REA:Reverse Engineer Android is an Android-only, local-first reverse-engineering
tool with shared CLI and MCP workflows. Distinguish observations, derivations,
inferences, and unknowns. Preserve Evidence provenance, caller-selected values,
session identity, coverage, limitations, and provider identity through both
adapters.

Supported targets are Android APKs, Android devices, Android resources, Flutter
APKs, JEB projects, Frida-instrumented Android processes, and native `.so`
libraries analyzed with Ghidra or IDA. Browser, Electron, standalone
JavaScript, Apple, HarmonyOS, desktop, managed .NET, RL environment, WASM,
EVM, model, GPU, Hopper, Kuna, Cutter, GDB, Rizin, and objdump workflows are
outside this fork's public scope.

Android-only means Android is the target platform, not that only Android-
exclusive file formats are relevant. Retained support analysis may cover
SQLite application data, saved packet captures, process and crash evidence,
devicetree and system images, kernel modules, raw binary regions, MIPS/RISC-V
legacy or emerging Android native code, the boot chain, AVB/vbmeta, dynamic
partitions, and cross-language Android libraries. Cross-language support
includes Unity (`libunity.so`, `libil2cpp.so`, metadata and resource packs),
Godot native libraries and PCK archives, React Native and Hermes native
bundles, Go/Rust Android `.so` metadata, and Python analysis helpers or
fixtures.

Support analysis does not add a public MCP family or tool unless a separate
scope decision updates the allowlist, contracts, tests, CLI, package, and
documentation. Provider registration remains controlled by the Android
allowlist; a missing Unity, Godot, JavaScript, Hermes, or Python family is not
changed by restoring supporting documentation or fixtures.

Follow [CONTRIBUTING.md](CONTRIBUTING.md) and the fail-closed integration rule.
Do not re-enable a removed capability without an explicit scope decision,
public contract, provider prerequisites, side-effect review, tests, package
inventory, and documentation.

Configuration changes must be additive and idempotent, with backups. Installers
must not install or upgrade unrelated software. JADX, JDK, ADB, Apktool,
Ghidra, IDA, JEB, and Frida remain caller-supplied. `rea update` is
source-managed and must not install the upstream package.

## Architecture and ownership

Dependencies flow inward:

1. Domain semantics and contracts.
2. Provider adapters.
3. Shared application workflows.
4. CLI and MCP adapters.

Keep provider-specific code out of domain and application layers. See
[docs/architecture.mermaid](docs/architecture.mermaid) when changing
composition.

Give every interpretation and resource one owner. Consumers use that owner's
parsed facts instead of reinterpreting raw source. Preserve source identity,
omission, uncertainty, and Evidence across boundaries. Reuse the shared
[`src/process/`](src/process/) supervision and identity primitives; a PID or
executable path alone does not establish ownership after exit or reuse.

Keep proof of ownership separate from validity, editability, and readiness.
Malformed owned data may still be safely removable. Unresolved identity or
applicability stays unknown rather than becoming absent, foreign, or aligned.

For lifecycle changes, follow
[ownership and completion invariants](docs/tool-design.md#own-the-lifecycle).
Select applicable lifecycle regressions from
[docs/testing.md](docs/testing.md#lifecycle-regressions). Include late
handshakes, cancellation during final cleanup, mixed child outcomes, and
cleanup retry where those stages exist.

Before adding complexity for a speculative race or security edge case, explain
the concrete failure mode, likelihood, and maintenance cost. Do not silently
expand scope for theoretical robustness.

When fixing a bug, inspect the producing boundary and affected consumers for
duplicated interpretation or unclear ownership. Complete directly related
refactors in the same change. Remove superseded representations, aliases,
wrappers, and redundant tests after verifying consumers.

Parse unknown boundary values with the tagged error algebra and `Result`.
Preserve partial facts and meaningful failure reasons. Keep identity and lookup
values separate from display formatting. Absolute paths, file URLs, and HTTP
paths have different semantics.

Validate advertised JSON Schemas after SDK conversion against their declared
dialect and actual clients. Bind handlers to named contracts with exact types;
catalog ordering must never select an operation or schema.

## Android-only public surface

The canonical MCP inventory is
[`src/contracts/androidToolAllowlist.ts`](src/contracts/androidToolAllowlist.ts)
and
[`src/contracts/toolFamilies.ts`](src/contracts/toolFamilies.ts). Keep the
default catalog at or below 120 tools.

Published families are:

- `android`
- `apktool`
- `artifact`
- `flutter`
- `adb`
- `frida`
- `jeb`
- `native`
- `direct`
- `enhanced`
- `application`
- `session`

Do not add a removed family or silently restore a removed public tool. When a
public contract changes, update its canonical schema, handler binding, CLI
translation, effects, target-content classification, examples, generated
catalog, and conformance tests together.

## Providers

Android APK analysis uses caller-supplied `jadx-headless-mcp-0.7.1-all.jar` and
a full JDK 17 or newer.

Android resources use caller-supplied Apktool 2.7.0 or newer.

Android devices use caller-supplied `adb`.

Frida uses caller-supplied Frida and explicit device, process, script, session,
and cleanup selections.

JEB uses a caller-started client selected through `REA_JEB_MCP_URL`.

Native `.so` analysis uses Ghidra or IDA. Provider selection remains explicit;
there is no automatic fallback between engines.

Keep provider readiness separate from target admission, active work, observed
exit, and resource release. A launcher, PID, or successful process start proves
only its own fact.

## Device and runtime authority

ADB install, uninstall, push, app start/stop, screen capture, log collection,
and bugreport operations have explicit target effects. Frida scripts can read
or change target memory and behavior and can access the target's capabilities.

Keep the selected serial, package, process, script, and observation window
exact. Do not broaden runtime actions beyond the caller's request.

Closing Frida detaches instrumentation; it does not kill the target. A failed
or interrupted cleanup retains the owning resource and must be retried.

## Performance

Optimize in this order:

1. Agent tokens and context.
2. Analysis time.
3. CPU and memory.

Return the smallest sufficient answer with provenance, coverage, limitations,
and access to complete Evidence. Reuse validated results when their keys,
freshness, lifetime, and invalidation are explicit. Bound concurrency, retained
state, subprocess families, and serialization growth.

Measure representative Android tasks when a change targets performance. Report
token estimates separately from actual model usage, include discovery and
retries, and separate cold from warm runs.

## Development

Use [.nvmrc](.nvmrc) and `package.json#packageManager`.

```sh
npm ci
npm run build:cached
npm run check:fast
```

Use `npm run test:local -- PATH...` for source tests without building and
`npm run test:focused -- PATH...` when required artifacts or provider
processes are needed.

Relevant checks include:

- `npm run verify:module-boundaries`
- `npm run verify:test-discovery`
- `npm run docs:check`
- `node scripts/check-android-content-audit.mjs`
- `npm run verify:package`
- `npm run knip:production`

Provider changes require the matching real lane:

- `verify:android`
- `verify:adb`
- `verify:apktool`
- `verify:apk-signature`
- `verify:flutter`
- `verify:frida`
- `verify:jeb`
- `verify:ghidra`
- `verify:ida`

Report unavailable prerequisites. Simulated providers do not establish real
engine behavior.

## Generated files

`docs/public/product-catalog.json`, generated verification records, and
`/skills/` are generated or ignored outputs. Edit source contracts and
`.agents/skills/reverse-engineer-anything/`, then regenerate.

Keep `docs/maintenance/android-content-audit.json` current. Every removed,
migrated, rewritten, or restored documentation path needs a classification,
an Android relevance statement, and a rationale. `safe-delete` requires
evidence that no Android consumer, shared contract, fixture, test, or local
reference depends on the path.

Keep `.cache/mcp-tool-catalog.json` as test metadata only. Runtime builds and
normal source checks must not depend on it.

Never commit binaries, provider project documents, credentials, `dist/`,
`node_modules/`, local APK dumps, or local planning artifacts.

## Tests

Prefer real public CLI and MCP workflows, then production-boundary integration,
then producer goldens. Preserve malformed-input, cancellation, cleanup,
permission, capacity, and target-identity coverage when pruning.

Use `createTestTempDirectory` for exact-path test cleanup. Never glob-clean
shared `/tmp/rea-*` content.

For Android/native parser, inventory, snapshot, and projection changes, select
the applicable boundary regressions in
[docs/testing.md](docs/testing.md#boundary-regressions).

Never remove documentation or support fixtures merely because a provider or
filename is not Android-exclusive. Check the Android use case, inbound links,
fixtures, verification records, and shared consumers first, then record the
decision in the audit manifest.

## Documentation

Keep [README.md](README.md) as the English source and keep the maintained
translations synchronized:

- `docs/readme/README_zh.md`
- `docs/readme/README_zh-TW.md`
- `docs/readme/README_fr.md`
- `docs/readme/README_de.md`
- `docs/readme/README_pt-BR.md`
- `docs/readme/README_es.md`
- `docs/readme/README_ko.md`
- `docs/readme/README_ja.md`

Do not restore a removed language or non-Android capability without updating
the language navigation, links, commands, provider requirements, and support
claims.

The website is Android-only documentation. Historical upstream pages may
remain for provenance, but they must be labeled historical and must not
present removed targets or providers as current capabilities. Keep website
navigation, figures, translations, and generated HTML aligned with the
maintained README languages and the Android public surface.

## Change readiness

AI-assisted changes are welcome. A human owner remains responsible for the
complete diff, validation evidence, limitations, and final readiness. Agents
must not complete human review declarations on the owner's behalf.

Use Conventional Commit subjects and PR titles. Mark breaking changes with `!`
or a `BREAKING CHANGE:` footer. Describe behavior changes, executed checks,
real-provider verification, and unavailable coverage.
