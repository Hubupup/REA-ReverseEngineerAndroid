# Client verification

Client verification checks that the source-built MCP server, setup transaction,
registered launcher, and packaged Android-only skill work together. It is
separate from provider verification: a client can connect successfully while
JADX, ADB, Apktool, Flutter, Frida, JEB, Ghidra, or IDA remains unavailable.

## Local adapter verification

Start with the production stdio server:

```sh
npm run build:cached
node scripts/rea.mjs doctor --json
node scripts/rea.mjs doctor --client codex --json
node scripts/rea.mjs mcp
```

`doctor` checks launch configuration and selected provider readiness. It does
not prove that a running client session uses the same command or environment.
When a client fails to connect, compare its actual launch command, runtime
path, and inherited `PATH` with the registration written by `rea setup`.

## Setup and skill checks

For a reviewed setup transaction:

```sh
node scripts/rea.mjs setup --dry-run
node scripts/rea.mjs setup
node scripts/rea.mjs doctor --client <client-id> --json
```

Confirm that:

- unrelated client settings are preserved;
- changed files are backed up;
- the registered command uses the source checkout;
- the installed skill is Android-only;
- an invalid or removed `REA_MCP_TOOL_FAMILIES` selection is rejected; and
- uninstall removes only REA-owned registrations and skill copies.

## MCP surface checks

Exercise the compiled server through a real stdio client:

1. Call `initialize` and `tools/list`.
2. Confirm the default catalog contains the retained Android families and no
   removed family or tool.
3. Repeat with compact and full input profiles.
4. Repeat with each retained family selected through
   `REA_MCP_TOOL_FAMILIES`.
5. Call a static Android operation and verify target identity, provider
   identity, Evidence, coverage, limitations, and unknowns.
6. Call an invalid family and an unknown tool; both must fail closed.

The catalog must remain at or below 120 advertised tools. A client-side prefix,
tool search, or approval rule is not part of the canonical server contract.

## Android provider checks

Use the matching lane from [testing](testing.md#real-provider-lanes). A client
test can use a deterministic provider fixture for protocol coverage, but it
must not report that fixture as real JADX, ADB, Apktool, Flutter, Frida, JEB,
Ghidra, or IDA verification.

ADB and Frida checks need a caller-selected device or process. Confirm the
exact serial, package, PID, script, and effect before running. Closing a Frida
session detaches instrumentation; it does not kill the target.

## Reporting

Record the client name and version, Node.js runtime, source revision, selected
profile, catalog count, provider prerequisites, and commands that ran. State
unavailable devices, engines, credentials, and model services explicitly.
Do not turn a launch success, schema validation, or synthetic response into a
claim about real Android analysis.
