# Android analysis settings, limits, and recovery

This guide describes how REA:Reverse Engineer Android owns runtime analysis
limits. It is intended for maintainers and provider authors; caller-visible
contracts are in [MCP contracts](../mcp-contracts.md).

## Design boundary

REA exposes a curated set of defaults through `inspect_analysis_settings` and
`update_analysis_settings`. A setting exists only when a provider or shared
resource owner can enforce it and report the effective value.

The runtime setter changes in-memory defaults for the running server. It does
not edit environment variables, client registrations, provider installations,
or files. It does not extend an outer client deadline or release retained
resources.

## Ownership and precedence

The normal path is:

1. composition creates the runtime settings store;
2. an accepted MCP operation captures an immutable settings snapshot;
3. the provider or resource owner resolves the effective budget; and
4. the owner enforces it at the resource boundary.

When a per-call argument exists, precedence is:

1. the caller's explicit argument;
2. the accepted operation's runtime override;
3. a valid launch environment value; and
4. the built-in default.

An invalid launch value is a configuration failure, not a silent fallback.
An invalid runtime update fails the whole batch and changes nothing.

## Retained Android-relevant settings

| Setting                                | Owner               | Application point                     |
| -------------------------------------- | ------------------- | ------------------------------------- |
| `jadx.operation_timeout_ms`            | JADX                | Next Android APK operation            |
| `ghidra.startup_timeout_ms`            | Ghidra              | Next Ghidra startup                   |
| `ghidra.decompile_timeout_seconds`     | Ghidra              | Next decompile or dossier operation   |
| `regex.matching_deadline_ms`           | shared regex worker | Next search operation                 |
| `regex.worker_heap_request_mib`        | shared regex worker | Next regex worker                     |
| `native.matching_representation_bytes` | function comparison | Next `match_native_functions` request |

Other limits may remain fixed or provider-owned. The inspection result must
state whether a limit is editable, where it applies, and what it does not
raise.

## Updating a setting

Send an atomic changes array:

```json
{
  "changes": [
    {
      "setting": "jadx.operation_timeout_ms",
      "action": "set",
      "value": 600000
    }
  ]
}
```

Use `action: "reset"` to restore the launch value. `expected_revision` is an
optional compare-and-set guard. A conflict, invalid value, or duplicate key
changes nothing.

A runtime update does not retry failed work, relaunch an engine, invalidate
successful Evidence, or clear retained cleanup. Retry only after the owning
work has settled and the provider can accept another operation.

## Failure and recovery

When a provider reaches an editable limit, the error should retain the setting
ID, effective value, unit, bounds, application point, source when known, and
the next action. Include whether a restart is required and what the setting
does not raise.

For Android workflows:

- Increase `jadx.operation_timeout_ms` for a slow APK operation, then retry the
  named operation. Confirm that the JADX bridge is still alive.
- Increase `ghidra.startup_timeout_ms` only for the next startup attempt; a
  running provider keeps its accepted startup budget.
- Increase `ghidra.decompile_timeout_seconds` for a decompile that would
  otherwise reach the configured limit. It does not make an unbounded batch a
  bounded operation.
- Raise `regex.matching_deadline_ms` for a large Android native search, then
  retry on the same provider session when the session remains healthy.
- Raise `native.matching_representation_bytes` only when a function comparison
  reports that exact representation limit.

A client deadline is external to REA. If the client gives up while the server
is still working, update the client's own tool timeout and reconnect; a
runtime setting cannot extend it.

## Lifecycle rules

Keep target admission, provider readiness, active work, observed exit, and
resource release separate. A settings update does not change any of those
facts.

When cleanup is incomplete, retain the resource owner and report
`cleanup_incomplete`. Do not start replacement work against that owner. A
provider failure or cancellation should preserve completed Evidence and the
effective limits that were used.

## Adding a setting

Before adding a runtime setting, identify the actual resource owner and the
format, protocol, authority, or memory constraint it enforces. Add:

- the canonical setting ID and typed bounds;
- launch parsing when an environment seed exists;
- registration forwarding only when setup should preserve it;
- enforcement at the owning boundary;
- structured limit metadata in failures; and
- tests for default, override, reset, invalid values, cancellation, and
  cleanup.

Do not advertise authority REA cannot exercise.
