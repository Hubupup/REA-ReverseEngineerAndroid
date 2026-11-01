# IDA provider

REA:Reverse Engineer Android adapts an existing IDA MCP server into its native
analysis tools. It does not install, upgrade, activate, license, or bundle IDA
or another IDA server.

## Configure

Choose one lifecycle mode in an upstream IDA MCP JSON registration and set:

```sh
export REA_IDA_MCP_CONFIG=/absolute/path/ida-mcp.json
```

Select IDA explicitly through `--provider ida`, `REA_ANALYSIS_PROVIDER=ida`, or
the MCP `provider_id` argument. REA does not silently fall back to another
engine.

Run:

```sh
node scripts/rea.mjs doctor --provider ida --json
node scripts/rea.mjs analyze /absolute/path/libexample.so --provider-id ida
```

## Attached GUI

Open the original Android ELF target in IDA, not an `.idb` or `.i64` database.
The file digest and image base must remain aligned with the registration. If
the target changes or the identity cannot be established, analysis fails with
recovery guidance.

Attached analysis is read-only:

- REA does not save the database;
- REA does not close the GUI database;
- navigation or pseudocode operations may change the active GUI view; and
- `binary_session` reports UI effects separately from file or process effects.

The original input must remain readable by REA for the duration of the
operation. A database revision marked in IDA does not replace the input file
identity established at admission.

## Headless

Use a supported headless supervisor when it is configured in the selected
upstream registration. Headless operations do not require a GUI window and
must report their own supervisor lifecycle and cleanup. A headless engine or
registration that is not supported is unavailable, not an empty analysis.

## Capabilities

Retained IDA-backed native operations include:

- procedure and string inventory/search;
- procedure lookup;
- pseudocode and assembly;
- raw function instructions;
- resolved callees where the selected profile supports them;
- incoming address references;
- instruction windows; and
- function dossiers.

Direct callers may be unavailable in profiles where code/data references do
not prove call edges. Missing facets remain unknown. IDA does not establish
runtime call paths, source types, or execution behavior.

## Evidence and limits

IDA results retain target digest, image base, provider and IDA version,
procedure identity, source coordinates, relationship coverage, truncation, and
cleanup status. A stale or mismatched attached database must fail closed.

Workflow or batch operations should preserve the active session and explain
whether the selected view changed. Cancellation of a caller does not prove
that GUI or headless work stopped; retain the provider owner until cleanup is
confirmed.

## Verification

Run:

```sh
npm run verify:ida -- --target /absolute/path/libexample.so
```

The lane requires an existing IDA MCP configuration and a selected Android ELF
target. Record absent IDA, license, or host prerequisites as unavailable.
