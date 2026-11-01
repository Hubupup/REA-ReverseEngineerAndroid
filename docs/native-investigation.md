# Android native investigation

Use this guide for ELF `.so` libraries shipped in an Android APK or pulled
from a selected device. Android native analysis combines static artifact
inspection, JNI metadata, and an explicit Ghidra or IDA provider.

## Supported inputs

The retained native surface accepts Android ELF shared objects. It does not
advertise removed Apple, Windows, DOS, firmware, raw-binary, or other
non-Android formats.

Typical entry points are:

- a `.so` extracted from an APK or reported by ADB;
- a JNI symbol such as `Java_com_example_Native_run`;
- an ELF export, address, string, or procedure discovered by a provider; and
- a function or artifact comparison between two Android builds.

Static inspection does not prove runtime loading or execution. A JNI candidate
is a relationship inferred from shipped metadata until a runtime observation
establishes it.

## Offline ELF inspection

These operations do not require a native decompiler:

```sh
node scripts/rea.mjs inspect-elf-notes /absolute/path/libexample.so
node scripts/rea.mjs inspect-native-exports /absolute/path/libexample.so
node scripts/rea.mjs inspect-binary-layout /absolute/path/libexample.so
node scripts/rea.mjs inspect-byte-entropy /absolute/path/libexample.so
```

They report parsed notes, exports, sections and segments, and bounded entropy
observations. An empty result is absence only within the examined ELF
structure.

## Ghidra or IDA

Provider selection is explicit and never falls back automatically:

```sh
node scripts/rea.mjs analyze /absolute/path/libexample.so \
  --provider-id ghidra

node scripts/rea.mjs decompile /absolute/path/libexample.so \
  --procedure Java_com_example_Native_run \
  --provider-id ghidra
```

Use `--provider-id ida` for an existing IDA MCP registration or supported
headless profile. See [Ghidra](ghidra-provider.md) and
[IDA](ida-provider.md).

Ghidra imports the target into a private ephemeral database and does not change
the original bytes. IDA attached-mode analysis is read-only; REA never saves or
closes the caller's GUI database.

## MCP workflow

A direct native workflow usually looks like:

1. `open_binary` with an explicit provider.
2. `list_procedures`, `list_strings`, or a search operation.
3. `analyze_function` for a focused dossier.
4. `procedure_pseudo_code`, `procedure_assembly`, or reference operations as
   needed.
5. `trace_native_values` or comparison operations when a relationship spans
   several functions.
6. `close_binary` and verify cleanup.

The default `analyze_function` reply may return a summary while retaining the
complete dossier. Request complete detail when the full graph is needed.

## JNI and Android context

Use the `android` family to inspect DEX declarations, `System.loadLibrary`,
JNI bindings, and application graph projections. Use the `native` and
`enhanced` families to inspect the corresponding ELF symbols and call
relationships.

Keep these facts separate:

- an observed ELF export;
- a DEX-declared native method;
- a path-based or name-based JNI candidate;
- a provider-observed direct call edge; and
- a runtime-observed call or loaded library.

Missing symbols, reflection, dynamic loading, stripped names, indirect calls,
and unobserved device state remain unknown.

## Evidence and limits

Native results should retain:

- selected target digest and provider identity;
- procedure or address coordinates;
- source bytes or file spans where available;
- relationship coverage and truncation;
- decompiler and analysis limitations; and
- cleanup status.

Use `record_unknown` for material unresolved questions and export the Evidence
bundle when it must survive the active session.

## Verification

Run `npm run verify:ghidra` or `npm run verify:ida` when the change affects a
real provider. See [testing](testing.md#real-provider-lanes) for prerequisites.
A fixture-backed test establishes the adapter boundary, not the caller's
installed engine.
