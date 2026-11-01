# Android applications

Use the connected server's advertised Android tools. A skill installation alone does not register MCP or install JADX, Java, ADB, Apktool, Ghidra, IDA, JEB, or Frida.

## Static APK

Start with `inspect_android_package` for package identity, SDK declarations, permissions, components, and counts. Use `search_android_classes` to find candidates, `inspect_android_class` for members, `inspect_android_method` for decompilation, and `trace_android_references` for incoming static references. Pass an absolute `mapping_path` for R8/ProGuard release builds.

The provider requires a caller-supplied headless JADX MCP JAR 0.7.1 and a full JDK 17 or newer. `REA_JADX_MCP_JAR` selects the JAR. `JAVA_HOME` can select Java. REA does not install either dependency.

Use `inspect_android_jni_bindings` to link DEX `ACC_NATIVE` declarations to observed `Java_*` exports or `RegisterNatives` table candidates. Preserve library occurrence, ABI, slot, relocation, and coverage facts. A partial scan does not prove absence or uniqueness. Static binding candidates do not prove that Android loaded or registered the library.

Use `decode_android_resources` for resource tables, localized strings, and the decoded manifest. Use `inspect_apk_signature` for declared signing schemes, signers, certificate fingerprints, and content-digest self-consistency. This is identity and integrity evidence, not a trust verdict.

## Device And Runtime

Use `list_adb_devices` and `inspect_adb_device` to bind the exact serial and build. `list_adb_packages` and `pull_adb_package` inventory and acquire the base APK plus splits. `read_adb_logcat` returns a bounded log dump.

Mutation tools never run implicitly: `install_adb_package`, `uninstall_adb_package`, `push_adb_file`, `start_adb_app`, `start_adb_activity`, and `stop_adb_app`.

For dynamic instrumentation, select a device and process with `list_frida_processes`, start a session, load a caller-authored script, inspect `frida_session_status`, unload scripts, and close the session. Scripts can read or change memory and behavior and can access the target's capabilities.

## Native Libraries

Open the selected `.so` with `open_binary` and an explicit `provider_id` of `ghidra` or `ida`. Use `inspect_elf_notes` and `inspect_native_exports` for build and export identity. Use `binary_overview`, `search_procedures`, `search_strings`, `analyze_function`, `procedure_pseudo_code`, `procedure_assembly`, `xrefs`, `procedure_callers`, `procedure_callees`, and `get_call_graph` for focused analysis.

Indirect calls, unresolved JNI registration, stripped symbols, unavailable provider facets, and unobserved runtime behavior remain unknown.
