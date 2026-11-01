# Android static analysis in GitHub Actions

REA:Reverse Engineer Android can run from a checked-out source tree in CI and
return machine-readable Evidence for Android artifacts. The example below is
intentionally static: it does not install an Android SDK, start a device, or
execute the APK.

## Minimal job

Use the Node.js version pinned by `.nvmrc` and install the locked dependencies:

```yaml
name: REA Android static analysis

on:
  workflow_dispatch:

jobs:
  inspect-apk:
    runs-on: ubuntu-24.04
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npm run build:cached
      - name: Inspect APK
        env:
          REA_JADX_MCP_JAR: ${{ secrets.REA_JADX_MCP_JAR }}
        run: |
          mkdir -p "$RUNNER_TEMP/rea"
          node scripts/rea.mjs inspect-android-package "$APK_PATH" \
            --json --full-output > "$RUNNER_TEMP/rea/analysis.json"
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: rea-android-analysis
          path: ${{ runner.temp }}/rea
          retention-days: 7
```

Set `APK_PATH` from a reviewed build artifact or a protected secret. Do not
check private APKs into the repository. The JADX JAR and JDK must be supplied
by the workflow or runner; REA does not download or install them.

## Interpretation

Exit zero means the selected operation completed. It does not mean that every
class, resource, native library, reference, or runtime path was recovered.
Inspect the retained Evidence, `coverage`, `limitations`, and explicit
`unknowns` before making a policy or release decision.

Provider failures retain their operation, category, remediation, and partial
Evidence where available. A missing JDK, JADX JAR, ADB binary, or Apktool
installation must fail the job rather than silently switching to another
provider.

## Device and runtime lanes

ADB and Frida require a caller-selected device, emulator, or remote target.
Provision them only in a trusted workflow, keep the target identity explicit,
and review mutation or execution effects before enabling a job. Static APK
inspection does not require a device or an emulator.
