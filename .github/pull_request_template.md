<!--
PR title: type(scope): imperative outcome
Keep the title suitable for a Conventional Commit subject.
-->

## Summary

<!-- What Android, provider, Evidence, package, or documentation problem does
this solve? Link an issue when applicable. -->

## Problem and expected behavior

<!-- For fixes, give the smallest Android trigger and the violated invariant.
For features, describe the Android use case and observable outcome. -->

## Change and scope

<!-- Explain the approach, why it fits this Android-only fork, and what is
intentionally excluded. -->

- Android-only scope fit:
- Removed or replaced code paths:
- Compatibility or migration impact:
- Explicit non-goals:

Do not restore a removed browser, Electron, JavaScript, Apple, HarmonyOS,
firmware, managed .NET, packet capture, RL, WASM, EVM, SQLite, model, GPU,
Hopper, Kuna, Cutter, GDB, Rizin, or objdump capability without a new scope
decision.

## Contract and boundary impact

- Semantic owner and earliest changed stage:
- CLI and MCP contract:
- Tool-family or catalog change:
- JADX, ADB, Apktool, Flutter, Frida, JEB, Ghidra, or IDA impact:
- Evidence, provenance, coverage, and cleanup impact:
- Package, setup, or generated-document impact:

Generated catalog facts are checked against `docs/public/product-catalog.json`.

### Effects

- [ ] Reads files or captured data.
- [ ] Launches a provider.
- [ ] Attaches to a process.
- [ ] Loads or runs a Frida script.
- [ ] Changes process memory, device state, files, packages, or configuration.
- [ ] Contacts network services.
- [ ] Documentation or test-only change, with no target interaction.
- [ ] Not sure; investigation needed.

## Evidence and regression coverage

- Tests added or updated:
- Original failure or baseline observation:
- User-visible CLI or MCP output:
- Remaining proof gaps:

For Evidence-bearing changes:

- [ ] Observations, derivations, inferences, and unknowns remain distinct.
- [ ] Target and provider identity remain attached.
- [ ] Partial, unavailable, cancelled, and cleanup-incomplete outcomes remain visible.
- [ ] Complete Evidence remains reachable when summary delivery is selected.

For boundary or lifecycle changes, name the applicable
[boundary regressions](../docs/testing.md#boundary-regressions) and
[lifecycle regressions](../docs/testing.md#lifecycle-regressions).

## Validation performed

List only commands that ran, with observed results. State unavailable providers
or hosts explicitly.

```text
command - result
```

Relevant real-provider lanes:

- `verify:android`
- `verify:adb`
- `verify:apktool`
- `verify:apk-signature`
- `verify:flutter`
- `verify:frida`
- `verify:jeb`
- `verify:ghidra`
- `verify:ida`

## Security, privacy, and release

- Breaking changes or migration:
- APK, device, Frida script, or provider authority:
- Credentials or sensitive data retained:
- Package or local distribution impact:
- Security or cleanup limitations:

## Author readiness

The human owner completes this section. AI agents must not claim human review
or complete these declarations on the owner's behalf.

Human owner:

- [ ] I reviewed the final diff and relevant Android-only contracts.
- [ ] I checked that the validation evidence supports the current change.
- [ ] I recorded meaningful unavailable coverage and remaining unknowns.
- [ ] I declare this change ready for the intended local review.

## Before merge

- [ ] The change has one focused outcome.
- [ ] Android-only scope and authority questions are resolved.
- [ ] Tests cover changed behavior and meaningful failure paths.
- [ ] Owning documentation and generated outputs are updated where needed.
- [ ] The diff contains no credentials, private APK data, or unsupported claims.
