# Ghidra conformance corpus

These source-owned fixtures are compiled at verification time; generated
binaries and Ghidra projects are never committed.

## ELF inventory

`inventory.c` is compiled into temporary Android-compatible ELF variants by
the Ghidra verification lane. It fixes local functions, external linkage,
defined strings, and writable/executable ranges used to prove the read-only
Ghidra inventory contracts.

## Procedure and reference checks

The lane builds Android ELF targets for the host-supported architectures and
checks:

- target admission and digest identity;
- procedure and string discovery;
- pseudocode, assembly, and instruction windows;
- callees, callers, and reference relationships when Ghidra establishes them;
- function dossier facets and explicit truncation;
- cancellation and repeated requests on a healthy session; and
- owned bridge, temporary-program, and process cleanup.

Ghidra output is never treated as original source. A recovered procedure or
call edge establishes a provider observation, not runtime behavior or source
identity.

## Providers

Run the real provider lane with:

```sh
npm run verify:ghidra
```

It requires `GHIDRA_INSTALL_DIR`, a supported full JDK, and a selected Android
ELF target. When a prerequisite is absent, record Ghidra coverage as
unavailable. A source-built fixture is not a substitute for an installed
provider.
