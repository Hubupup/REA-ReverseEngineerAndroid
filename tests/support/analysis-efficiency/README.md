# Android analysis efficiency test support

These files support Android and shared-runtime comparison, independent-oracle,
receipt, and cleanup regressions. The TypeScript consumers live under
`tests/boundary/`, `tests/evaluation/`, and `tests/conformance/`; the Python
checks are discovered by `npm run test:python`.

Build the runtime before running checks that use compiled entrypoints:

```sh
npm run build:cached
```

The harnesses inject command outcomes and own temporary workspaces. They do
not invoke a real Android device or establish real JADX, ADB, Apktool, Flutter,
Frida, JEB, Ghidra, or IDA behavior.

## Measurement rules

Measure a completed Android or shared workflow with equivalent inputs and
Evidence coverage before and after the change. Record:

- target digest and provider identity;
- command and source revision;
- cold versus warm cache state;
- elapsed time, CPU time, and peak process-family memory;
- catalog discovery, extra calls, retries, and cleanup; and
- unmeasured costs.

Fewer output bytes alone do not establish fewer model tokens or a better
investigation. A synthetic fixture does not establish real-provider
performance.

The historical allocation-report producer and receipt files were removed with
the non-Android performance documentation. Do not recreate that report under
the Android-only tree; add a focused Android benchmark when a current change
has a concrete performance concern.
