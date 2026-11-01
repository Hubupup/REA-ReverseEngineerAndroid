# Android fork maintenance

This repository is an Android-only hard fork of REA 6.8.0. It keeps the
`rea`, `rea-agents`, and `reverse-engineer-anything` identifiers for local
installation compatibility, but it is not updated from the upstream npm
package.

## Scope rules

Retain these MCP families:

`android`, `apktool`, `artifact`, `flutter`, `adb`, `frida`, `jeb`, `native`,
`direct`, `enhanced`, `application`, and `session`.

Do not restore a removed family, provider, CLI command, MCP tool, fixture, or
documentation claim without an explicit Android-specific scope decision and
the required verification.

## Selective upstream review

When reviewing an upstream change, inspect the actual diff before applying
anything. Prefer a small, path-scoped port. The [upstream sync manifest](../upstream-sync.json)
records the automated allowlist, Android support-analysis paths, and disabled
public-surface paths.

Paths under `android_support_analysis` may remain available to Android
workflows, tests, documentation, and fixtures, but they do not add a public MCP
family or CLI command by themselves. Paths under `disabled_public_surface`
must not be registered or advertised without a new scope decision.

The per-path restoration and deletion decisions are recorded in
[android-content-audit.json](maintenance/android-content-audit.json), checked by
`scripts/check-android-content-audit.mjs`.

For a ported change, update the Android contracts, provider composition,
tests, generated skill/catalog, and documentation together. Do not copy a
non-Android provider implementation into the tree merely to preserve an
internal helper.

## Required checks

At minimum, run the checks affected by the change and:

```sh
npm run docs:check
npm run check:fast
npm run verify:module-boundaries
npm run verify:test-discovery
```

Run the matching real-provider lane when a change affects JADX, ADB, Apktool,
APK signatures, Flutter, Frida, JEB, Ghidra, or IDA. Record unavailable
prerequisites rather than treating a source-only review as provider
verification.

The generated MCP catalog must remain at or below 120 tools and must not
reintroduce a removed family or tool name.

## Local build

This fork is distributed from a source checkout:

```sh
npm ci
npm run build:cached
```

`rea update` reports the source-managed status and never replaces this fork
with the upstream package.
