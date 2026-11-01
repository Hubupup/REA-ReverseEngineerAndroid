# Windows Ghidra P0

This guide describes the supported Windows path for Ghidra-backed Android
native `.so` analysis in this source-managed fork. The packaged native controls
provide process ownership, path admission, snapshots, and cleanup; Ghidra and
a full JDK remain bring-your-own prerequisites.

## Requirements

- Windows 10 or newer.
- Node.js from the repository's pinned toolchain.
- `GHIDRA_INSTALL_DIR` and `JAVA_HOME`.
- The packaged Windows x64 native controls under `native/windows/build/`.

The source checkout does not build those controls during `npm ci` or
`npm run build:cached`. Follow
[native/windows/README.md](https://github.com/morluto/rea/blob/main/native/windows/README.md)
to restore or build the matching artifact.

## Read-only boundary

Windows P0 supports read-only Ghidra analysis for Android ELF targets:

- program import, analysis, and overview;
- procedure and string inventory/search;
- pseudocode and assembly;
- callees, callers, and references where Ghidra establishes them;
- function dossiers and bounded graph/context reads; and
- cleanup of the owned bridge, temporary program, and process family.

Windows P0 does not support annotation mutation, GUI control, persistent
database edits, or removed non-Android formats. An unsupported operation must
fail explicitly rather than silently degrading to a different capability.

## Path and process ownership

The native addon admits local NTFS paths by handle and preserves the requested
and resolved coordinates separately. Reparse points, changing drive aliases,
and unsupported filesystems are rejected or reported as unknown rather than
treated as ordinary files.

The Windows launcher assigns its child to an owned Job Object and retains
process ownership until the owned tree is closed. A successful launch, PID, or
bridge reply does not prove that cleanup completed.

## Run

```powershell
node scripts/rea.mjs doctor --provider ghidra --json
node scripts/rea.mjs analyze C:\absolute\path\libexample.so --provider-id ghidra
```

Use an absolute path. Dot components, repeated separators, and unsupported
namespace aliases may be rejected by admission.

## Verification

```powershell
npm run verify:windows-native
npm run verify:ghidra:windows
```

Verify the packaged native artifact first, then run the Ghidra lane against a
reviewed Android ELF target. If Ghidra, Java, or the native artifact is absent,
record that coverage as unavailable instead of substituting a fixture.
