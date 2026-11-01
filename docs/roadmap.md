# REA:Reverse Engineer Android roadmap

The Android-only fork keeps the product focus on shipped Android applications,
devices, resources, and native code loaded or distributed with an Android
application. The current public surface is documented in
[MCP contracts](mcp-contracts.md), [installation](installation.md), and the
[generated catalog](mcp-contracts.md#generated-catalog).

## Priorities

- Improve APK, manifest, DEX, JNI, resource, and Flutter analysis while keeping
  provider limitations and partial coverage visible.
- Improve ADB and Frida workflows with explicit target selection, authority,
  mutation, cancellation, and cleanup semantics.
- Expand Android native `.so` analysis across JEB, Ghidra, and IDA without
  changing caller-selected target identity or Evidence provenance.
- Improve function matching, dossier summaries, call graphs, and unknown
  ledgers for reconstructed Android behavior.
- Reduce agent context and repeated provider work while keeping complete
  Evidence reachable.

## Admission criteria

New capabilities must fit the Android-only scope and work through the shared
CLI and MCP contracts. They must preserve observations, derivations,
inferences, unknowns, provider identity, coverage, and cleanup status.

Provider and platform claims require the corresponding real verification lane
for JADX, ADB, Apktool, Flutter, Frida, JEB, Ghidra, or IDA. Source-only
support, mocks, and synthetic fixtures do not establish real engine behavior.

The catalog remains at or below 120 advertised tools. Removed families and
providers stay unavailable unless a separate Android-specific scope decision,
public contract, tests, documentation, and package inventory are added.
