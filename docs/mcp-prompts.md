# Agent prompts

The Android-only server advertises guided workflows only when every suggested
tool belongs to an advertised family.

## Workflows

### Inspect an Android app

Use `inspect_android_package`, `search_android_classes`,
`inspect_android_class`, `inspect_android_method`,
`decode_android_resources`, and `inspect_android_jni_bindings`.

Keep static declarations, decompiled code, dynamic loading, reflection, and
runtime registration distinct.

### Compare Android versions

Compare package identity, SDKs, permissions, components, resources, selected
classes, methods, APK signatures, and explicitly paired native functions.

Missing members, ambiguous mappings, and incomplete decompilation remain
unknown.

### Inspect an Android native library

Open the selected `.so` with Ghidra or IDA. Use `inspect_elf_notes` and
`inspect_native_exports` for build and export identity, then use
`binary_overview`, `search_procedures`, `analyze_function`,
`procedure_pseudo_code`, `procedure_assembly`, `xrefs`, and `get_call_graph`.

### Investigate Android runtime behavior

Use ADB to select the exact device, package, and logs. Use Frida only with an
explicit device/process selector and caller-authored script. Closing the
session detaches instrumentation but does not terminate the target.

### Audit Android unknowns

Use `list_unknowns`, `verify_unknown_resolution`, `update_unknown`, and
`record_unknown` to preserve unresolved runtime, parsing, mapping, device, and
native-analysis questions.

## Evidence discipline

Every prompt asks the agent to:

1. Cite Evidence for observations.
2. Label derivations and inferences.
3. Preserve incomplete coverage and contradictions.
4. Avoid treating missing evidence as absence.
5. Keep runtime actions within the caller-selected target and scope.

The prompt supplies guidance only. It does not grant target authorization,
install providers, or bypass client approval.
