# Testing REA:Reverse Engineer Android

Use this guide for local Android-only development. Start with focused source
tests, then run the public CLI/MCP boundary and the matching real-provider lane
when a claim depends on an installed engine, device, or client.

## Toolchain and local checks

Use the Node.js version in
[.nvmrc](https://github.com/morluto/rea/blob/main/.nvmrc) and the package
manager pinned in `package.json#packageManager`.

```sh
npm ci
npm run check:fast
npm run build:cached
```

Useful gates for contract, provider, or documentation changes:

```sh
npm run docs:check
npm run verify:module-boundaries
npm run verify:test-discovery
npm run knip:production
```

Run a focused source test while iterating:

```sh
npm run test:local -- PATH...
```

Use `npm run test:focused -- PATH...` when the test needs generated or compiled
artifacts. `npm run check:pr` is the broad local gate; run it only when the
change crosses enough boundaries to justify the cost.

## Test design

Test through the narrowest boundary that can produce the failure, then verify
the affected CLI/MCP consumer. Prefer a real public workflow over a mock when
the claim is about provider or protocol behavior.

Preserve coverage for:

- malformed APK, ELF, manifest, resource, and provider replies;
- missing or invalid target identity;
- unavailable JADX, ADB, Apktool, Flutter, Frida, JEB, Ghidra, or IDA;
- cancellation before, during, and after provider work;
- partial Evidence and explicit unknowns;
- resource ownership and cleanup retry;
- ADB and Frida mutation effects;
- catalog family scoping and the 120-tool ceiling.

Do not replace a real-provider lane with a simulated provider and call it
verified. Do not delete a distinct assertion merely to make a suite green.

## MCP and CLI boundaries

The default `tools/list` must advertise the Android contract allowlist and
must not expose removed families or tools. Verify both compact and full input
profiles, output schema profiles, invalid family selection, and unknown
commands.

For CLI/MCP parity, check the canonical result fields, typed failures, partial
Evidence, provider identity, and cleanup state. The transport encoding may
differ, but the semantic result must not.

## Real-provider lanes

Run the lane that matches the changed provider. These lanes require
bring-your-own tools and may skip or fail when a prerequisite is unavailable.
Record the actual prerequisite and do not claim a real-provider pass when it
was absent.

| Lane                           | Prerequisites                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------- |
| `npm run verify:android`       | Selected APK and `REA_JADX_MCP_JAR`, plus a full JDK 17 or newer                |
| `npm run verify:adb`           | `adb`, plus a selected emulator or physical device when the lane requires one   |
| `npm run verify:apktool`       | Apktool 2.7.0 or newer and a selected APK                                       |
| `npm run verify:apk-signature` | A selected APK; static signature inspection is built in                         |
| `npm run verify:flutter`       | A selected Flutter APK                                                          |
| `npm run verify:frida`         | Optional Frida binding, plus a device or remote target for attach checks        |
| `npm run verify:jeb`           | A caller-started JEB MCP endpoint selected with `REA_JEB_MCP_URL`               |
| `npm run verify:ghidra`        | `GHIDRA_INSTALL_DIR`, a full supported JDK, and a selected ELF target           |
| `npm run verify:ida`           | Existing IDA MCP configuration or headless provider, plus a selected ELF target |

JADX, ADB, Apktool, Ghidra, and IDA remain separately installed. REA does not
install or upgrade Java, JADX, ADB, Apktool, Ghidra, IDA, JEB, or Frida.

## Lifecycle regressions

For a provider or resource lifecycle change, cover:

- startup success, startup failure, and cancellation during startup;
- a late provider handshake after cancellation;
- mixed child outcomes where one child closes and another remains owned;
- cleanup denial followed by retry;
- caller cancellation without claiming that native work stopped;
- Evidence preservation when cleanup remains incomplete.

Use the shared `src/process/` supervision primitives. A PID and executable path
alone do not establish ownership after exit or reuse.

## Test discovery and fixtures

Keep fixtures under the existing Android, APK, ELF, ADB, Frida, and provider
directories. Do not add fixtures for removed families. Source-owned generated
binaries and provider dumps stay ignored unless the repository explicitly
tracks a reviewed golden.

Run `npm run verify:test-discovery` after adding or moving tests. Confirm that
each new test is discovered exactly once by the intended project.

## Reporting results

Report the command, revision, host, tool version, selected target, and observed
result. Distinguish:

- executed real-provider verification;
- production-boundary integration with a simulated provider;
- producer goldens;
- source-only reasoning.

A successful source check does not establish a live device, installed engine,
or model-client session.
