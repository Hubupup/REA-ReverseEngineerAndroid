# Windows native controls

REA:Reverse Engineer Android ships one Windows x64 Node-API 8 addon. It
provides the path, snapshot, process, and cleanup boundaries used by JADX,
Ghidra, and other owned Windows helper processes. Ghidra and a full JDK remain
bring-your-own prerequisites.

## Artifact contract

The loader checks:

- package version;
- Node-API and architecture compatibility;
- the expected addon path; and
- the artifact SHA-256.

There is no environment override for loading an arbitrary native module.

## Build

The artifact lane requires Linux, MinGW-w64 `x86_64-w64-mingw32-g++`,
`x86_64-w64-mingw32-dlltool`, and `tar`. It does not install those tools.

```sh
npm run build:windows-native
npm run verify:windows-native:artifact
npm pack
```

The source tree does not generate `native/windows/build/` during `npm ci` or
`npm run build:cached`.

## Restore the artifact in a source checkout

If the matching packaged artifact is available, extract only these files from
the exact `rea-agents` tarball whose version matches `package.json`:

```text
native/windows/build/manifest.json
native/windows/build/rea-windows-x64.node
```

Do not use `latest` or copy files from another version. The loader validates
the manifest and digest before granting authority.

## Ownership and cleanup

- Path admission opens components with a reparse-aware boundary and retains
  the actual file identity separately from the requested spelling.
- Source snapshots stream through bounded buffers and commit to the bytes
  actually read.
- Suspended children are assigned to an owned Job Object before resume.
- Cleanup waits for owned descendants and retained handles.
- Failed cleanup keeps the runtime owner and remains retryable.

A PID, executable path, or successful launch alone does not establish that a
process or file still belongs to REA after exit or path reuse.

## Real verification

On Windows, after building the runtime:

```powershell
npm run verify:windows-native
npm run verify:ghidra:windows
```

The first lane checks the packaged native controls. The second requires an
installed Ghidra and JDK and a reviewed Android ELF target. If either
prerequisite is absent, record the provider coverage as unavailable.
