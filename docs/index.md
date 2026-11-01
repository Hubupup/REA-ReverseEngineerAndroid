---
layout: home

hero:
  name: REA:Reverse Engineer Android
  text: Android application reverse engineering
  tagline: Inspect APKs, devices, runtime behavior, and native libraries through one CLI and MCP server.
  actions:
    - theme: brand
      text: Get started
      link: /installation
    - theme: alt
      text: Android analysis
      link: /android-analysis

features:
  - title: Investigate with your agent
    details: Connect the local source build to an agent, describe the Android feature, and follow the Evidence.
    link: /mcp-prompts
  - title: Keep the Android boundary
    details: The default catalog contains only the APK, Android device, resource, Flutter, JEB, Frida, Ghidra, and IDA workflows used by this fork.
    link: /mcp-contracts
  - title: Preserve Evidence
    details: Results distinguish observations, derivations, inferences, and unknowns with target and provider identity attached.
    link: /mcp-contracts
---

## Start from the local checkout

```sh
npm ci
npm run build:cached
node scripts/rea.mjs setup
```

Static APK analysis requires a full JDK 17 or newer and a caller-supplied
`jadx-headless-mcp-0.7.1-all.jar`. Device workflows require `adb`. Resource
decoding requires Apktool 2.7.0 or newer. Native `.so` analysis uses Ghidra or
IDA.

REA:Reverse Engineer Android does not install Java, JADX, ADB, Apktool, Ghidra,
IDA, JEB, or Frida.

## Choose a guide

| Task                                  | Guides                                                                                                                                                                                                             |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Inspect an APK                        | [Android APK analysis](android-analysis.md), [APK signatures](apk-signature.md), [Android resources](apktool-resource-analysis.md), [JNI bindings](android-analysis.md#link-native-declarations-to-jni-candidates) |
| Work with a device                    | [ADB device analysis](adb-device-analysis.md), [Frida instrumentation](frida-instrumentation.md)                                                                                                                   |
| Inspect Flutter                       | [Flutter build identification](flutter-analysis.md)                                                                                                                                                                |
| Use JEB                               | [JEB analysis](jeb-analysis.md)                                                                                                                                                                                    |
| Analyze native `.so` code             | [Native investigation](native-investigation.md), [Ghidra](ghidra-provider.md), [IDA](ida-provider.md), [Windows Ghidra](windows-ghidra-p0.md)                                                                      |
| Inspect ELF metadata                  | [ELF notes](elf-notes.md), [binary diagnostics](binary-diagnostics.md)                                                                                                                                             |
| Compare native functions              | [Native function matching](native-function-matching.md)                                                                                                                                                            |
| Inspect Android system images         | [Android system images](android-system-images.md), [devicetree](devicetree.md), [raw binary](raw-binary.md), [kernel modules](kernel-modules.md)                                                                   |
| Inspect app data and runtime evidence | [SQLite databases](sqlite-databases.md), [packet captures](packet-captures.md), [process capture](process-capture.md), [recorded crashes](recorded-crashes.md)                                                     |
| Understand cross-language libraries   | [Cross-language Android libraries](android-cross-language-libraries.md), [Ghidra MIPS](ghidra-mips.md), [Ghidra RISC-V](ghidra-riscv.md)                                                                           |
| Retain Evidence and unknowns          | [CLI and Evidence](cli.md), [MCP contracts](mcp-contracts.md), [agent prompts](mcp-prompts.md)                                                                                                                     |
| Develop and verify                    | [Testing](testing.md), [client verification](client-verification.md), [tool design](tool-design.md), [limits and recovery](design/limits-and-recovery.md)                                                          |
| Maintain the fork                     | [Fork maintenance](fork-maintenance.md), [releasing](releasing.md), [roadmap](roadmap.md)                                                                                                                          |

## Android-only boundary

This fork does not register browser, Electron, standalone JavaScript, Apple,
HarmonyOS, desktop, managed .NET, RL environment, WASM, EVM, model, GPU,
Hopper, Kuna, Cutter, GDB, Rizin, or objdump families. SQLite, saved packet
captures, process/crash evidence, devicetree, raw binary regions, kernel
modules, and legacy native architectures are retained as Android support
analysis without adding a public family.
