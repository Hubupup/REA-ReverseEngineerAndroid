# Upstream analysis engines

REA:Reverse Engineer Android integrates existing tools through provider
adapters. Upstream source remains unmodified and retains its own license; it
is not copied into REA's domain or application code.

## jadx-headless-mcp

- Source: <https://github.com/1013503897/jadx-headless-mcp>
- Release: `v0.7.1`
- Commit: `5844800a486d2248fa949b74c9896285f5b54de2`
- License: Apache-2.0
- Release identity: `src/android/JadxRelease.ts`
- REA integration: `src/android/`

Normal builds and installed packages do not bundle the headless MCP JAR.
Supply a separately obtained
`jadx-headless-mcp-0.7.1-all.jar` through `REA_JADX_MCP_JAR`. REA never
downloads or installs engines during an analysis operation.

The audited release JAR is identified by SHA-256. A caller-supplied build that
reports the supported protocol version retains its actual digest and remains
distinct from the audited release identity.

When updating the adapter, review the upstream protocol and license changes,
update the release identity, run the producer regressions, and exercise the
real Android APK CLI/MCP lane.

## Public APK fixture

`npm run fixtures:android` downloads the audited headless MCP JAR and Appium
ApiDemos into ignored `_reference/apk-integration/`. Both downloads are checked
against fixed SHA-256 values. Fixture provenance is recorded in
`scripts/fixtures/android-apidemos.json`; the fixture is Apache-2.0.

The fixture is static and does not require an emulator, device, SDK
installation, or app execution. APKs and JARs are neither tracked nor included
in packages.

## Other engines

Ghidra, IDA, ADB, Apktool, JEB, and Frida are caller-supplied tools. Their
licenses and installation terms remain their own; REA does not redistribute
them in the npm package. See [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md)
and [licenses/README.md](../licenses/README.md).

## Retained Android support sources

The repository also retains source and licensing notes for optional Android
support analysis that is not part of the default MCP family catalog:

- `evmole/` for derived analysis used by retained support code;
- `pwndbg/` and `pwntools/` for recorded crash and ELF helper workflows;
- `wabt/` for external WebAssembly tooling retained as historical support;
  and
- `web-network-captures/` for saved-capture helper provenance.

These paths do not register a provider or advertise a tool by themselves.
Their upstream licenses and attribution records remain authoritative.
