# MCP tool design

## Product boundary

REA:Reverse Engineer Android exposes Android application, device, resource, and
native-library analysis through one CLI and MCP server. The default contract
surface is the family allowlist in the canonical contracts; a tool must not be
registered outside that surface merely because an upstream implementation
contains it.

Keep public names and Evidence semantics stable. A provider may expose a
smaller verified capability set, but that limitation belongs in availability,
coverage, or limitations rather than a silently different result shape.

## Start from the analyst question

Inspect the nearest existing contract before adding a tool. Extend a tool when
the intent, target identity, and result are already the same. Add a separate
tool when the outcome or authority is materially different.

| Shape                 | Use it for                                            | Result                                                   |
| --------------------- | ----------------------------------------------------- | -------------------------------------------------------- |
| `inspect`             | Facts about one APK, device, object, or native symbol | Relevant fields, locations, and facet availability       |
| `search` / `list`     | Candidate discovery                                   | Stable ordering, paging, and source coverage             |
| `trace`               | Relationships across retained facts                   | Typed edges, supporting Evidence, and unresolved paths   |
| `compare`             | Explicitly paired artifacts or observations           | Identity, comparable coverage, and supported deltas      |
| `workflow`            | A repeated Android or native outcome                  | Inline answer, contributing Evidence, and partial facets |
| `observe` / `capture` | Frida or device runtime behavior                      | Explicit authority, lifecycle, effects, and cleanup      |

These are task shapes, not naming rules. Avoid combining unrelated discovery,
execution, and mutation modes in one tool.

## Keep contracts explicit

- Require exact target identity and preserve caller-selected paths, device
  serials, package names, process IDs, script paths, and provider selection.
- Return the smallest useful result with provider identity, source locations,
  Evidence references, coverage, limitations, and confidence.
- Distinguish observations, derivations, inferences, and unknowns. Missing
  coverage is unknown, not absence.
- Declare filesystem, process, network, UI, mutation, and injection effects.
- Keep cancellation, partial results, and cleanup ownership visible.
- Use limits only for a real format, protocol, authority, memory, or measured
  resource constraint. Name the ceiling and its recovery.

## Android examples

An APK inspection should keep the signed artifact identity separate from a
decoded class name. A JADX, Apktool, or Flutter result must not imply runtime
loading. An ADB or Frida operation must retain the chosen device, package, or
process and report whether it changed target state. A native function dossier
must keep Ghidra or IDA observed edges distinct from inferred JNI relationships.

When a provider cannot establish a fact, return a typed unavailable or unknown
result instead of synthesizing a negative observation.

## Lifecycle and Evidence

Provider acquisition, target admission, active work, observed exit, and
resource release are separate facts. Release only resources the operation owns.
If cleanup cannot be confirmed, retain the owner and report
`cleanup_incomplete`.

Use the shared Evidence writer and canonical result projector. Do not expose a
provider-specific error shape as a new public contract. When a summary is
returned, complete Evidence must remain reachable through the retained session
or export path.

## Verification

Update the canonical contract, output schema, CLI projection, tests, and
documentation together. Exercise success, malformed input, unavailable
provider, cancellation, partial coverage, and cleanup failure through the
affected CLI and MCP consumers.

Use the matching real-provider lane for JADX, ADB, Apktool, Flutter, Frida,
JEB, Ghidra, or IDA claims. A fake provider is useful for boundary correctness
but does not establish real-engine behavior.
