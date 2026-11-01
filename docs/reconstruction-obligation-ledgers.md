# Reconstruction obligation ledgers

A reconstruction obligation ledger turns authenticated Android Evidence into
an explicit list of required claims and unresolved work. It is a review aid,
not proof that the application or native library behaves as reconstructed.

## Ledger inputs

Use retained Evidence from the selected Android investigation:

- APK or split-APK identity and package metadata;
- manifest components and declared permissions;
- DEX classes, methods, references, and JNI candidates;
- resource and Flutter observations when they affect the claim;
- native ELF symbols, procedures, references, and function dossiers;
- ADB or Frida observations with exact target scope; and
- explicit unknowns or unavailable surfaces.

Each ledger entry should identify the claim, the Evidence that supports it, the
artifact or provider revision, and the remaining unknown. A claim that spans
several surfaces must retain every dependency needed to evaluate it.

## Android example

A native-method reconstruction may require:

1. the DEX declaration and `native` modifier;
2. the JNI symbol or registration candidate;
3. the ELF library digest and provider identity;
4. the recovered procedure and its direct relationships;
5. runtime evidence if the claim is about actual execution; and
6. an explicit unknown when the library is dynamically loaded or the call path
   is indirect.

An address or name match alone does not close the claim. A static observation
does not establish that a device selected that path at runtime.

## Status

Use the ledger to keep these states distinct:

- supported by complete Evidence for the declared scope;
- supported only by inference or a partial provider result;
- unavailable because the provider or target surface was not examined;
- contradicted by retained Evidence; and
- unresolved because a required dependency is missing.

Do not summarize any of these states as success. A blocked or unknown required
obligation keeps the overall reconstruction incomplete.

## Workflow

When the shared workflow is available, use:

```sh
node scripts/rea.mjs build-reconstruction-obligation-ledger \
  /absolute/path/android-evidence.json --json
```

The CLI and MCP result must retain the same ledger identity, Evidence
references, statuses, and unknowns. If the operation is unavailable, review
the retained Evidence directly and record the gap rather than constructing a
successful ledger by hand.
