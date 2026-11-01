# Ghidra provider semantics

REA:Reverse Engineer Android uses a caller-supplied Ghidra installation to
analyze Android ELF native libraries. The provider imports the selected target
into a private ephemeral program and never modifies the original executable
bytes.

## Requirements

- `GHIDRA_INSTALL_DIR` pointing at a supported Ghidra installation.
- A supported full JDK selected with `JAVA_HOME`.
- The packaged Windows native controls for Windows process and path handling.

Run:

```sh
node scripts/rea.mjs doctor --provider ghidra --json
node scripts/rea.mjs analyze /absolute/path/libexample.so --provider-id ghidra
```

REA does not install, upgrade, launch, or license Ghidra.

## Supported operations

The `direct` family supports read-only Ghidra-backed operations for Android
ELF targets:

- target admission and analysis overview;
- procedure and string inventory/search;
- procedure lookup and assembly;
- decompiler pseudocode;
- callees, callers, and address references where Ghidra establishes them;
- function dossiers and bounded call graph context;
- byte reads and selected instruction windows; and
- shared function comparison and reconstruction workflows.

The `enhanced` family composes dossiers, call graphs, batch decompilation, and
native value tracing over the same retained provider session.

## Authority and lifecycle

Ghidra analysis is read-only with respect to executable bytes. Function-name
and entry-comment edits may be available on supported hosts, but they apply to
the transient program unless a later contract explicitly states otherwise.
Windows P0 is read-only.

Each provider session owns its ephemeral program, bridge process, temporary
files, and cleanup. Closing a session must wait for owned resources. A
connection, PID, or successful startup alone does not prove that resources were
released.

## Evidence

Ghidra results retain:

- target file digest and import options;
- provider and Ghidra version;
- procedure and address coordinates;
- source file/address spans where available;
- relationship coverage and truncation;
- decompiler limitations; and
- cleanup status.

Assembly and pseudocode are provider output, not original source. A recovered
function does not prove the original source, type layout, or runtime call path.

## Failure and recovery

Provider failures retain their operation, category, effective timeout, and
remediation. Startup, decompilation, transport, and cleanup failures are
separate facts.

Use `ghidra.startup_timeout_ms` for the next startup attempt and
`ghidra.decompile_timeout_seconds` for bounded decompilation. See
[limits and recovery](design/limits-and-recovery.md).

When the bridge or JVM exits, close or retry only through the owning Ghidra
session. Do not assume that a later process with the same executable or PID is
the same owner.

## Verification

Run:

```sh
npm run verify:ghidra
```

The lane requires a selected Android ELF target, Ghidra, and Java. If any
prerequisite is absent, record that coverage as unavailable rather than
claiming real-provider verification.
