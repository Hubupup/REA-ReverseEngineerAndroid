---
name: reverse-engineer-anything
description: Reverse engineer Android APKs, devices, and native libraries with REA Android.
metadata:
  version: "56"
---

# REA Android

Use REA Android only for shipped Android artifacts and requested Android runtime evidence. Do not use it for ordinary source-repository analysis.

## Connect

Use the connected server's actual `tools/list`; the default catalog contains the complete Android-only surface. If tools are absent, read [Android applications](references/android-applications.md). Do not run setup before every investigation.

If the client registration or shipped runtime is missing, repair it with `npx rea-agents@latest setup`.

REA never installs Java, JADX, ADB, Apktool, Ghidra, IDA, JEB, or Frida. Use the caller's existing installations and report missing prerequisites as unavailable capabilities.

## Route The Target

- Local APK, manifest, DEX class, method, or JNI binding: `inspect_android_package`, then the focused Android tools.
- Android resources or localized strings: `decode_android_resources`.
- APK signing identity: `inspect_apk_signature`.
- Flutter APK structure: `identify_flutter_build`, then `inspect_dart_aot`.
- Installed package or device behavior: start with `list_adb_devices`, `inspect_adb_device`, and `inspect_adb_package`.
- Runtime instrumentation: `list_frida_processes`, then an explicit Frida session and caller-authored script.
- JEB project: `inspect_jeb_client`, `open_jeb_project`, `list_jeb_units`, `decompile_jeb_item`.
- Native `.so`: `open_binary`, then `binary_overview`, `search_procedures`, `analyze_function`, `procedure_pseudo_code`, `procedure_assembly`, `xrefs`, and `get_call_graph` with Ghidra or IDA.

## Work Summary First

Start with the smallest useful inventory. Use `detail: "summary"` and retained views when a result may be large. Reuse an existing session and Evidence instead of repeating an identical analysis.

For Android classes, choose an exact overload before method inspection. For JNI, preserve export/table ambiguity. For native functions, keep provider pseudocode and address identity attached to the result.

## Runtime Authority

ADB install, uninstall, push, app start/stop, screen capture, log collection, and Frida script execution are explicit effects. Keep the selected serial, package, process, script, and observation window exact. Closing Frida detaches instrumentation; it does not kill the target.

## Evidence Discipline

Every conclusion must distinguish observations from cited Evidence, derivations from validated producer facts, inferences with confidence and alternatives, and unknowns caused by missing execution, reflection, dynamic loading, obfuscation, incomplete resource decoding, indirect calls, or limited provider coverage.

Never turn absence from incomplete evidence into proof of absence. Static inspection does not establish runtime behavior.

Use `record_unknown` for material unresolved questions. Use Evidence bundle export when complete records must survive session close.

## Finish

Explain findings in plain language with Evidence IDs and limitations. Close an open binary session with `close_binary`; close Frida sessions with `close_frida_session`.

- [Android applications](references/android-applications.md)
