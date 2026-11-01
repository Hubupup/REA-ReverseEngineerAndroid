<div align="center">

**English** · [简体中文](docs/readme/README_zh.md) · [繁體中文](docs/readme/README_zh-TW.md) · [Français](docs/readme/README_fr.md) · [Deutsch](docs/readme/README_de.md) · [Português (Brasil)](docs/readme/README_pt-BR.md) · [Español](docs/readme/README_es.md) · [한국어](docs/readme/README_ko.md) · [日本語](docs/readme/README_ja.md)

# REA:Reverse Engineer Android

### One MCP for Android application reverse engineering.

**Inspect an APK, follow its behavior into native code, and keep the evidence behind every conclusion.**

[![MCP tool catalog](https://img.shields.io/badge/MCP-117_Android_tools-5c4ee5?style=flat-square)](#tool-catalog)
[![Node.js requirements](https://img.shields.io/badge/Node.js-24.22.1-339933?style=flat-square&logo=nodedotjs&logoColor=white)](#requirements)
[![MIT license](https://img.shields.io/badge/license-MIT-f4c430?style=flat-square)](LICENSE)

[Quick start](#quick-start) · [How it works](#how-it-works) · [What you can analyze](#what-you-can-analyze) · [Provider setup](#deep-analysis-providers) · [Agent setup](#set-up-your-agent) · [FAQ](#faq) · [Documentation](#documentation)

<code>node scripts/rea.mjs setup</code>

</div>

> [!IMPORTANT]
> This repository is an Android-only hard fork of
> [morluto/rea](https://github.com/morluto/rea), based on REA 6.8.0.
> It is designed to be built and run from this local source checkout.
> It is not updated from the public `rea-agents` npm package.

---

REA:Reverse Engineer Android connects an agent to local tools for inspecting
Android APKs, device state, runtime behavior, resources, and native libraries.
The same workflows are available from an MCP server and from the terminal.

The fork keeps the `rea`, `rea-agents`, and `reverse-engineer-anything`
identifiers for installation compatibility. The bundled skill, server
instructions, CLI commands, and MCP catalog are Android-only.

Analysis runs locally, and findings retain the Evidence, provider identity,
coverage, limitations, and unknowns behind them.

## Quick start

### Requirements

REA:Reverse Engineer Android uses the Node.js version pinned in
[.nvmrc](.nvmrc). Install the project dependencies with:

```sh
npm ci
```

Static APK analysis also requires a full JDK 17 or newer and a caller-supplied
`jadx-headless-mcp-0.7.1-all.jar`. Select the JAR with `REA_JADX_MCP_JAR` and,
when needed, select Java with `JAVA_HOME`.

Device workflows require a caller-supplied `adb` binary. Select an explicit
binary with `REA_ADB_PATH` or place `adb` on `PATH`.

Resource decoding requires Apktool 2.7.0 or newer. Select the launcher with
`REA_APKTOOL_COMMAND` or place `apktool` on `PATH`.

Native library analysis uses an existing Ghidra or IDA installation. JEB and
Frida remain bring-your-own tools for deeper engine-based or runtime analysis.

REA:Reverse Engineer Android does not install or upgrade Java, JADX, ADB,
Apktool, Ghidra, IDA, JEB, or Frida.

### Build the local runtime

```sh
npm run build:cached
node scripts/rea.mjs --help
```

Windows JADX and Ghidra workflows use the packaged Windows x64 native controls
under `native/windows/build/`. A source checkout can restore the matching
artifact from the same `rea-agents@6.8.0` tarball using
[native/windows/README.md](native/windows/README.md).

### Set up your agent

```sh
node scripts/rea.mjs setup
```

Choose the agents you use, review the proposed changes, and approve them. Setup
adds the local REA:Reverse Engineer Android server, installs the Android-only
skill, and backs up existing configuration before writing. Restart the agent
after setup.

The local launcher is `scripts/rea.mjs`. If the client needs an explicit
command, use the absolute path to that script with the same Node.js runtime
used to build this checkout.

### Ask your agent

```text
Inspect this APK, explain how its login flow works, and show me the evidence.
Follow the feature into any native library when needed.
```

Replace the example with your target APK and the behavior you want to
understand.

### Use the terminal

```sh
node scripts/rea.mjs inspect-android-package /absolute/path/application.apk
node scripts/rea.mjs search-android-classes /absolute/path/application.apk MainActivity
node scripts/rea.mjs inspect-android-class /absolute/path/application.apk com.example.MainActivity
node scripts/rea.mjs inspect-android-method /absolute/path/application.apk com.example.MainActivity onCreate
node scripts/rea.mjs trace-android-references /absolute/path/application.apk com.example.MainActivity
```

Every command is isolated unless it uses an MCP session. Complete Evidence is
returned with the result.

## How it works

The agent calls REA:Reverse Engineer Android through MCP, or you invoke the
same workflows through the CLI. REA:Reverse Engineer Android inspects the
selected APK or device, follows the relevant classes, methods, resources,
references, and native code, and returns findings with their Evidence.

![REA:Reverse Engineer Android investigation flow: the agent asks about a local target, REA:Reverse Engineer Android inspects and traces it, and the agent uses the returned Evidence to explain or implement the feature.](website/public/assets/figures/rea-investigation-flow.svg)

Static analysis does not prove runtime behavior. Runtime tools act only on the
explicitly selected device, package, process, script, and observation window.

<a id="tool-catalog"></a>

## Tool catalog

The default MCP catalog contains **117 Android-focused tools**:

| Family        | Coverage                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------- |
| `android`     | APK package inspection, manifest components, classes, methods, references, and JNI bindings |
| `apktool`     | Apktool readiness and Android resource decoding                                             |
| `artifact`    | APK/archive inventory, controlled extraction, and APK signature inspection                  |
| `flutter`     | Flutter build identification and Dart AOT inspection                                        |
| `adb`         | Devices, packages, files, logs, processes, app lifecycle, and explicit device mutations     |
| `frida`       | Device/process discovery, instrumentation scripts, sessions, and cleanup                    |
| `jeb`         | JEB client readiness, projects, units, and decompilation                                    |
| `native`      | ELF notes, native exports, ELF layout, and byte entropy                                     |
| `direct`      | Ghidra and IDA headless native analysis operations                                          |
| `enhanced`    | Function dossiers, call graphs, batch decompilation, and native tracing workflows           |
| `application` | Android guidance, analysis views/settings, and Android application graph projection         |
| `session`     | Binary lifecycle, Evidence bundles, comparisons, unknowns, and Android/native context       |

`REA_MCP_TOOL_FAMILIES` can narrow the catalog to the families a workflow
needs. An invalid or removed family id stops server startup with the current
family list.

MCP uses compact input schemas by default. Set
`REA_MCP_INPUT_SCHEMA_PROFILE=full` when the client needs complete field
guidance and nested validation details. The compact and full profiles validate
the same canonical server contracts.

<a id="current-status"></a>

## What you can analyze

| Target                | What REA:Reverse Engineer Android returns                                                                                                 | Requirements and guide                                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Android APKs          | Package identity, SDK and permission declarations, manifest components, classes, methods, references, JNI bindings, and decompiled output | Headless JADX MCP JAR 0.7.1 and a full JDK 17 or newer; [Android guide](docs/android-analysis.md) |
| APK signatures        | v1/v2/v3/v3.1 signers, certificate fingerprints, key rotation, source stamp, and content-digest self-consistency                          | Built-in static inspection; [APK signature guide](docs/apk-signature.md)                          |
| Android devices       | Devices, packages, processes, logs, files, screenshots, bugreports, app lifecycle, and explicit package/file mutations                    | Caller-supplied `adb`; [ADB guide](docs/adb-device-analysis.md)                                   |
| Android resources     | Decoded manifest, resource metadata, locale string tables, package version facts, and bounded decode coverage                             | Caller-supplied Apktool 2.7.0 or newer; [Apktool guide](docs/apktool-resource-analysis.md)        |
| Flutter apps          | Dart snapshot hashes, per-ABI library digests, engine build provenance, and supported AOT snapshot details                                | Built-in APK parsing; [Flutter guide](docs/flutter-analysis.md)                                   |
| JEB projects          | Engine-backed project units, artifact digests, and type or method pseudo-code                                                             | A caller-started JEB client selected with `REA_JEB_MCP_URL`; [JEB guide](docs/jeb-analysis.md)    |
| Android runtime       | Frida device/process discovery, caller-authored scripts, messages, session state, and cleanup                                             | Caller-supplied Frida and an Android target; [Frida guide](docs/frida-instrumentation.md)         |
| Native libraries      | ELF metadata, exports, pseudocode, assembly, callers, callees, references, CFG context, and function dossiers                             | Ghidra or IDA; [native investigation](docs/native-investigation.md)                               |
| APK archive inventory | APK member inventory, digests, integrity observations, extraction, and Android application graph projection                               | Built-in archive inspection                                                                       |

### Android support analysis

The default Android tool catalog remains the table above. The repository also documents Android support analysis that does not add a public MCP family:

- [Android system images](docs/android-system-images.md): boot/vendor_boot/init_boot/recovery, DTB/DTBO, sparse images, super/dynamic partitions, AVB/vbmeta, OTA, A/B slots, kernel, SELinux, and init.
- [SQLite databases](docs/sqlite-databases.md), [packet captures](docs/packet-captures.md), [process capture](docs/process-capture.md), and [recorded crashes](docs/recorded-crashes.md): Android app data, saved network traffic, runtime evidence, and crash triage.
- [Devicetree](docs/devicetree.md), [kernel modules](docs/kernel-modules.md), [raw binary](docs/raw-binary.md), [Ghidra MIPS](docs/ghidra-mips.md), and [Ghidra RISC-V](docs/ghidra-riscv.md): Android system, boot-chain, device, and native-architecture context.

### Cross-language Android artifacts

Android apps can contain native and script-produced artifacts beyond Java/Kotlin and Flutter. These are supporting analysis, not new MCP families:

- Unity Android: `libunity.so`, `libil2cpp.so`, `assets/bin/Data`, `global-metadata.dat`, resource packs, and native engine structures.
- Godot Android: Godot native `.so` libraries, PCK/resource archives, compression metadata, and unresolved resources.
- React Native: `libreactnativejni.so`, `libreactnative.so`, JavaScript bundles, and native bridge candidates.
- Hermes: `libhermes.so`, Hermes bytecode, bundle paths, and version facts.
- Go and Rust: Android native `.so` libraries with language runtime metadata, symbols, build strings, and panic or runtime tables.
- Python: Android analysis helpers, fixtures, and toolchain support only; generic packaged-Python targets are not re-advertised.

Ghidra or IDA still performs native `.so` analysis. Unity, Godot, React Native, and Hermes provide Android context, APK member provenance, and supporting relationships; language or engine identification does not prove runtime loading or execution. See [cross-language Android libraries](docs/android-cross-language-libraries.md) and [native investigation](docs/native-investigation.md).

The Android-only server does not register browser, Electron, standalone
JavaScript, Apple, HarmonyOS, desktop, firmware, managed .NET, RL environment,
or other non-Android families. SQLite, saved packet captures, process/crash
evidence, devicetree, raw binary regions, kernel modules, and legacy native
architectures remain support documentation without adding a public MCP family.

<a id="deep-analysis-providers"></a>

## Deep analysis providers

Android APK code uses a caller-supplied headless JADX engine through
`src/android/`. The selected JAR is verified at readiness time, but the check
does not prove that every APK can be decoded.

Native `.so` analysis uses Ghidra or IDA through the shared binary session.
Provider selection remains explicit:

```sh
node scripts/rea.mjs analyze /absolute/path/libexample.so \
  --provider-id ghidra

node scripts/rea.mjs decompile /absolute/path/libexample.so \
  --procedure Java_com_example_Native_run \
  --provider-id ghidra
```

Run `node scripts/rea.mjs doctor --provider ghidra --json` or
`--provider ida` to inspect the selected native provider. Use
`--provider jadx` to inspect the Android APK provider configuration.

The Android-only fork does not register Hopper or Kuna.

### Static APK inspection

```sh
node scripts/rea.mjs inspect-android-package /absolute/path/application.apk
node scripts/rea.mjs inspect-android-jni-bindings /absolute/path/application.apk
node scripts/rea.mjs inspect-apk-signature /absolute/path/application.apk
node scripts/rea.mjs decode-android-resources /absolute/path/application.apk
node scripts/rea.mjs identify-flutter-build /absolute/path/application.apk
```

Pass an absolute `mapping_path` to class or method inspection when an R8 or
ProGuard `mapping.txt` belongs to a release build:

```sh
node scripts/rea.mjs inspect-android-class /absolute/path/application.apk \
  a.b \
  --mapping-path /absolute/path/mapping.txt \
  --detail summary \
  --evidence_output /absolute/path/class-evidence.json
```

The mapping annotations remain separate from the observed DEX names.
REA:Reverse Engineer Android does not verify that the selected mapping belongs
to the APK build.

### Device and runtime workflows

```sh
node scripts/rea.mjs list-adb-devices
node scripts/rea.mjs inspect-adb-device emulator-5554
node scripts/rea.mjs list-adb-packages emulator-5554
node scripts/rea.mjs pull-adb-package emulator-5554 com.example
node scripts/rea.mjs read-adb-logcat emulator-5554
node scripts/rea.mjs list-adb-processes emulator-5554
```

Device mutation and execution tools are explicit:

```sh
node scripts/rea.mjs install-adb-package emulator-5554 /absolute/path/application.apk
node scripts/rea.mjs start-adb-app emulator-5554 com.example
node scripts/rea.mjs stop-adb-app emulator-5554 com.example
node scripts/rea.mjs uninstall-adb-package emulator-5554 com.example
```

Frida operations use the same explicit target model:

```sh
node scripts/rea.mjs list-frida-devices
node scripts/rea.mjs list-frida-processes --device-id emulator-5554
node scripts/rea.mjs instrument-with-frida \
  --device-id emulator-5554 \
  --pid 1234 \
  --script-file /absolute/path/hook.js
```

Frida scripts can read or change target memory and behavior and can access the
target process's capabilities. Closing a Frida session detaches
instrumentation; it does not kill the target.

## Evidence and limitations

Tool results distinguish observations, derivations, inferences, and unknowns.
Evidence retains the selected target, provider identity, source locations,
coverage, limitations, and stable Evidence IDs.

Static analysis does not establish runtime execution. Class names, manifest
declarations, native exports, and JNI table candidates are evidence about the
shipped artifact, not proof that Android loaded a particular path at runtime.
Incomplete decodes, stripped symbols, dynamic loading, reflection, indirect
calls, and unobserved device state remain unknown.

Use `record_unknown` to retain material unanswered questions. Use
`export_evidence_bundle` when complete Evidence must survive the active
session.

## Set up your agent

Setup supports the existing client adapters. The registration points to this
source checkout, and the installed skill is Android-only.

```sh
node scripts/rea.mjs setup
node scripts/rea.mjs doctor --client codex --json
node scripts/rea.mjs mcp
```

For a manual stdio registration, use the absolute Node.js executable and the
absolute `scripts/rea.mjs` path from this checkout:

```json
{
  "mcpServers": {
    "rea": {
      "command": "/absolute/path/to/node",
      "args": ["/absolute/path/to/rea-main/scripts/rea.mjs", "mcp"]
    }
  }
}
```

Review the client's configuration format and preserve unrelated settings and
backups.

## Updates

This fork does not update from the upstream npm package. `rea update` reports
the source-managed status and does not replace the Android-only runtime.

Refresh the checkout with:

```sh
npm ci
npm run build:cached
```

Then reinstall or reconnect the client registration so the client uses the
newly built runtime.

Selection of future upstream changes is documented in
[Android fork maintenance](docs/fork-maintenance.md) and
[upstream-sync.json](upstream-sync.json).

## FAQ

<details>
<summary><strong>Do Unity, Godot, React Native, Hermes, Go, or Rust mentions add MCP tools?</strong></summary>

No. They are Android support-analysis records. The public catalog remains limited to the documented Android families; adding a family or tool requires a new scope decision, contract, tests, and provider verification. See [MCP contracts](docs/mcp-contracts.md#tool-families).

</details>

<details>
<summary><strong>Can this run from the local source checkout?</strong></summary>

Yes. Build with `npm run build:cached`, then use `node scripts/rea.mjs`.
Setup and manual client registrations can point directly at this checkout.

</details>

<details>
<summary><strong>Does this update from npm?</strong></summary>

No. `rea update` is intentionally source-managed and never installs the
upstream REA package.

</details>

<details>
<summary><strong>Which native engines are supported?</strong></summary>

Android native libraries use Ghidra or IDA. Hopper and Kuna are not registered
by this fork.

</details>

<details>
<summary><strong>Do I need an emulator or physical device?</strong></summary>

Only for device and runtime workflows. Static APK inspection does not launch
the APK and does not require a device.

</details>

<details>
<summary><strong>Does REA:Reverse Engineer Android upload my APK?</strong></summary>

Analysis runs locally. The agent receives the tool results, and its model
provider is governed by its own data policy.

</details>

<details>
<summary><strong>What if a provider is unavailable?</strong></summary>

Read the returned availability reason and remediation. REA:Reverse Engineer
Android never installs or upgrades Java, JADX, ADB, Apktool, Ghidra, IDA, JEB,
or Frida.

</details>

## Documentation

- [Android content audit](docs/maintenance/android-content-audit.json): per-path restoration and deletion decisions.

- [Installation and setup](docs/installation.md): client registration,
  readiness checks, updates, and uninstall.
- [CLI and Evidence](docs/cli.md): commands, provider selection, snapshots,
  import/export, and exit statuses.
- [MCP contracts](docs/mcp-contracts.md) and
  [agent prompts](docs/mcp-prompts.md): tool results, sessions, and guided
  investigations.
- [Android APK analysis](docs/android-analysis.md): JADX setup, manifest
  components, classes, methods, R8 mappings, and JNI bindings.
- [ADB device analysis](docs/adb-device-analysis.md): device inventory,
  package acquisition, logs, transfers, lifecycle, and explicit mutations.
- [Android resources](docs/apktool-resource-analysis.md): Apktool readiness,
  locale selection, string tables, and decode limits.
- [APK signatures](docs/apk-signature.md): signing schemes, signer identity,
  rotation lineage, and digest self-consistency.
- [Flutter analysis](docs/flutter-analysis.md): build identification and
  supported AOT snapshot inspection.
- [JEB analysis](docs/jeb-analysis.md): project and decompilation workflows.
- [Frida instrumentation](docs/frida-instrumentation.md): runtime sessions,
  scripts, safety boundaries, and cleanup.
- [Native investigation](docs/native-investigation.md): provider setup,
  function analysis, call graph, and Evidence.
- [Android system images](docs/android-system-images.md),
  [cross-language libraries](docs/android-cross-language-libraries.md),
  [SQLite databases](docs/sqlite-databases.md),
  [packet captures](docs/packet-captures.md),
  [process capture](docs/process-capture.md), and
  [recorded crashes](docs/recorded-crashes.md): Android support analysis that
  is documented without adding a public MCP family.
- [Testing](docs/testing.md): source checks and real-provider verification
  lanes.
- [Architecture](docs/architecture.mermaid): selected dependency and ownership
  paths.

Report vulnerabilities according to [SECURITY.md](SECURITY.md).

## Disclaimer

See [DISCLAIMER.md](DISCLAIMER.md) for responsible-use guidance.

REA:Reverse Engineer Android is for lawful research, education,
interoperability, software preservation, and analysis of software you own or
are authorized to examine.

You must legally obtain and comply with the terms of any caller-supplied
engine or tool, including commercial tools such as IDA and JEB.
REA:Reverse Engineer Android grants no tool license, key, or activation
entitlement.

## Contributing

Focused bug fixes, documentation improvements, tests, and Android-specific
workflows are welcome.

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and checks,
[testing](docs/testing.md) for verification lanes, and the
[architecture map](docs/architecture.mermaid) for dependency and ownership
boundaries.

## License

[MIT](LICENSE)

Code authored for this fork is licensed under MIT. Third-party material
retains its own licenses and copyright notices; see
[Third-party notices](THIRD_PARTY_NOTICES.md) for the dependency inventory and
external tool terms.
