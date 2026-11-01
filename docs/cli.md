# CLI and Evidence

The local CLI is:

```sh
node scripts/rea.mjs COMMAND
```

Install it as `rea` only when the checkout is intentionally linked into a
global or private package workflow. This fork is source-managed and does not
self-update from upstream npm.

## Android APK

```sh
node scripts/rea.mjs inspect-android-package /absolute/path/application.apk
node scripts/rea.mjs search-android-classes /absolute/path/application.apk MainActivity
node scripts/rea.mjs inspect-android-class /absolute/path/application.apk com.example.MainActivity
node scripts/rea.mjs inspect-android-method /absolute/path/application.apk com.example.MainActivity onCreate
node scripts/rea.mjs trace-android-references /absolute/path/application.apk com.example.MainActivity
node scripts/rea.mjs inspect-android-jni-bindings /absolute/path/application.apk
node scripts/rea.mjs inspect-apk-signature /absolute/path/application.apk
```

Use `--mapping-path /absolute/path/mapping.txt` with class or method inspection
for R8/ProGuard builds. The mapping annotation is separate from observed DEX
identity.

Every Android APK command takes its own `path`. It does not require a prior
`open_binary` command.

## Android resources and Flutter

```sh
node scripts/rea.mjs inspect-apktool-client
node scripts/rea.mjs decode-android-resources /absolute/path/application.apk
node scripts/rea.mjs identify-flutter-build /absolute/path/application.apk
node scripts/rea.mjs inspect-dart-aot /absolute/path/application.apk
```

## ADB

```sh
node scripts/rea.mjs inspect-adb-client
node scripts/rea.mjs list-adb-devices
node scripts/rea.mjs inspect-adb-device emulator-5554
node scripts/rea.mjs list-adb-packages emulator-5554
node scripts/rea.mjs pull-adb-package emulator-5554 com.example
node scripts/rea.mjs read-adb-logcat emulator-5554
node scripts/rea.mjs list-adb-processes emulator-5554
node scripts/rea.mjs list-adb-directory emulator-5554 /sdcard
node scripts/rea.mjs list-adb-features emulator-5554
node scripts/rea.mjs list-adb-services emulator-5554
node scripts/rea.mjs inspect-adb-display emulator-5554
node scripts/rea.mjs inspect-adb-window emulator-5554
node scripts/rea.mjs read-adb-setting emulator-5554 system
node scripts/rea.mjs collect-adb-bugreport emulator-5554 /absolute/output
node scripts/rea.mjs resolve-adb-packages emulator-5554 example
```

Explicit device mutations:

```sh
node scripts/rea.mjs install-adb-package emulator-5554 /absolute/path/application.apk
node scripts/rea.mjs uninstall-adb-package emulator-5554 com.example
node scripts/rea.mjs push-adb-file emulator-5554 /absolute/local /sdcard/remote
node scripts/rea.mjs start-adb-app emulator-5554 com.example
node scripts/rea.mjs start-adb-activity emulator-5554 com.example/.MainActivity
node scripts/rea.mjs stop-adb-app emulator-5554 com.example
```

## Frida

```sh
node scripts/rea.mjs list-frida-devices
node scripts/rea.mjs list-frida-processes --device-id emulator-5554
node scripts/rea.mjs instrument-with-frida \
  --device-id emulator-5554 \
  --pid 1234 \
  --script-file /absolute/path/hook.js
```

The CLI command creates a disposable session, runs the script for the bounded
observation window, detaches, and returns Evidence. It never kills the target.

## JEB

```sh
node scripts/rea.mjs inspect-jeb-client
node scripts/rea.mjs open-jeb-project /absolute/path/application.apk
node scripts/rea.mjs list-jeb-units
node scripts/rea.mjs decompile-jeb-item --item-address Lcom/example/Main;->onCreate()V --item-kind method
```

## Native `.so`

```sh
node scripts/rea.mjs analyze /absolute/path/libexample.so --provider-id ghidra
node scripts/rea.mjs function /absolute/path/libexample.so \
  --procedure Java_com_example_Native_run --provider-id ghidra
node scripts/rea.mjs decompile /absolute/path/libexample.so \
  --procedure Java_com_example_Native_run --provider-id ghidra
node scripts/rea.mjs instructions /absolute/path/libexample.so \
  --procedure Java_com_example_Native_run --provider-id ghidra
node scripts/rea.mjs xrefs /absolute/path/libexample.so \
  --address 0x1234 --provider-id ghidra
node scripts/rea.mjs trace /absolute/path/libexample.so \
  --query NativeRegister --provider-id ghidra
```

Provider selection is explicit. Use `--provider-id ghidra` or
`--provider-id ida`. There is no automatic fallback between engines.

Offline ELF inspection:

```sh
node scripts/rea.mjs inspect-elf-notes /absolute/path/libexample.so
node scripts/rea.mjs inspect-native-exports /absolute/path/libexample.so
node scripts/rea.mjs inspect-binary-layout /absolute/path/libexample.so
node scripts/rea.mjs inspect-byte-entropy /absolute/path/libexample.so
```

## Artifact inventory

```sh
node scripts/rea.mjs inspect-artifact /absolute/path/application.apk --detail summary
node scripts/rea.mjs extract-artifact /absolute/path/application.apk
node scripts/rea.mjs compare-artifacts LEFT.json RIGHT.json
```

The artifact family is retained for APK/archive inventory and controlled
extraction. It does not restore the removed non-Android artifact providers.

## Evidence output

CLI JSON returns the Evidence record directly. Important fields include:

- `evidence_id`
- `subject`
- `provider`
- `operation`
- `parameters`
- `normalized_result`
- `confidence`
- `authority`
- `limitations`
- `relationship_coverage`
- `evidence_links`

Save complete Evidence before requesting a retained view:

```sh
node scripts/rea.mjs inspect-android-package /absolute/path/application.apk \
  --json > /absolute/path/android-package-evidence.json
```

Inspect a retained view:

```sh
node scripts/rea.mjs inspect-evidence-bundle /absolute/path/android-package-evidence.json
node scripts/rea.mjs inspect-analysis-view /absolute/path/view.json
```

Evidence bundle operations:

```sh
node scripts/rea.mjs evidence-import /absolute/path/evidence.json
node scripts/rea.mjs evidence-export /absolute/path/source.json /absolute/path/export.json
node scripts/rea.mjs compare /absolute/path/left.json /absolute/path/right.json
```

## Output and exit status

The CLI supports global output controls such as `--json`, `--format`,
`--full-output`, `--token-count`, `--token-limit`, and `--token-offset`.
Complete Evidence can be large; save it to a file instead of placing it
directly in the agent context.

Exit zero means the selected operation completed. It does not make truncated,
partial, unsupported, or unknown coverage complete.

Provider failures retain their category, operation, remediation, and partial
Evidence where available.

## Agent setup

```sh
node scripts/rea.mjs setup
node scripts/rea.mjs doctor --client codex --json
node scripts/rea.mjs mcp
```

## Unsupported commands

The Android-only CLI does not register browser, Electron, standalone
JavaScript, Apple, HarmonyOS, desktop, firmware, managed .NET, RL environment,
WASM, EVM, model, GPU, Hopper, Kuna, Cutter, GDB, Rizin, or objdump commands.
SQLite, saved packet captures, process/crash evidence, devicetree, raw binary
regions, kernel modules, and legacy native architectures remain Android
support documentation unless a future explicit scope decision promotes them.
