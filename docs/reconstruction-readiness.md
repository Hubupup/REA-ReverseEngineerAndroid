# Android reconstruction readiness

Reconstruction readiness describes whether the Evidence available for an
Android target is sufficient for the requested claim. It is not a claim that
the reconstructed source is identical to the original program or that the
application executed.

## Minimum workflow

Build the local runtime:

```sh
npm ci
npm run build:cached
```

Then inspect a real Android artifact through the same public entrypoint you
intend to use:

```sh
node scripts/rea.mjs inspect-android-package /absolute/path/application.apk \
  --json --full-output
```

For native logic, follow the APK result into a retained `.so` and use Ghidra or
IDA. Keep the APK digest, library digest, provider identity, JNI candidates,
function coordinates, and runtime observations distinct.

## Readiness dimensions

| Dimension         | Required evidence                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| Artifact identity | APK, split APK, `.so`, or other selected file digest and source path                                    |
| Structure         | Manifest, DEX, resource, ELF, and provider coverage actually examined                                   |
| Relationships     | Observed references, inferred JNI candidates, direct call edges, and runtime observations kept separate |
| Behavior          | Static facts, controlled observations, and unknowns with explicit scope                                 |
| Completeness      | Coverage, truncation, unavailable facets, and unresolved obligations                                    |
| Reproduction      | The exact CLI/MCP command, provider version, target identity, and Evidence IDs                          |

An empty relationship list is not proof that no runtime relationship exists.
A symbol name match is not proof of a call. A manifest declaration is not proof
that the component launched.

## Evidence bundle

Export the bundle when the investigation must survive the active session:

```sh
node scripts/rea.mjs evidence-export /absolute/path/source.json \
  /absolute/path/android-evidence.json
```

Use `record_unknown` for material unanswered questions. Preserve the unknown
when a later operation does not examine the relevant surface.

## Completion

A reconstruction is ready only when every required claim is supported by
Evidence with sufficient authority and coverage. A verifier summary cannot
promote inferred Evidence into an observation. Missing, stale, or mismatched
records remain unknown or invalid.

For Android work, completion commonly requires:

- DEX class and method behavior for the selected path;
- manifest or resource facts that explain the entry surface;
- native library identity and function relationships for JNI or `.so` logic;
- explicit handling of reflection, dynamic loading, stripped names, indirect
  calls, and unobserved device state; and
- cleanup or an explicit `cleanup_incomplete` result.

## Verification

Use the matching Android provider lane in [testing](testing.md#real-provider-lanes).
Source-only reasoning and synthetic fixtures do not establish a real device,
JADX, Ghidra, IDA, JEB, or Frida result.
