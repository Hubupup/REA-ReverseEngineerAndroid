<div align="center">

[English](../../README.md) · **简体中文** · [繁體中文](README_zh-TW.md) · [Français](README_fr.md) · [Deutsch](README_de.md) · [Português (Brasil)](README_pt-BR.md) · [Español](README_es.md) · [한국어](README_ko.md) · [日本語](README_ja.md)

# REA:Reverse Engineer Android

### 一个面向 Android 应用逆向工程分析的 MCP。

**检查 APK，沿功能追踪到原生代码，并保留支撑每项结论的证据。**

[![MCP 工具目录](https://img.shields.io/badge/MCP-117_Android_tools-5c4ee5?style=flat-square)](#tool-catalog)
[![Node.js 要求](https://img.shields.io/badge/Node.js-24.22.1-339933?style=flat-square&logo=nodedotjs&logoColor=white)](#requirements)
[![MIT 许可证](https://img.shields.io/badge/license-MIT-f4c430?style=flat-square)](../../LICENSE)

[快速开始](#quick-start) · [工作原理](#how-it-works) · [可分析内容](#what-you-can-analyze) · [提供方配置](#deep-analysis-providers) · [智能体设置](#set-up-your-agent) · [常见问题](#faq) · [文档](#documentation)

<code>node scripts/rea.mjs setup</code>

</div>

> [!IMPORTANT]
> 本仓库是 [morluto/rea](https://github.com/morluto/rea) 的 Android 专用硬分叉，
> 基于 REA 6.8.0。它设计为从当前本地源码检出构建和运行，
> 不从公共 `rea-agents` npm 包更新。

---

REA:Reverse Engineer Android 将智能体连接到本地工具，用于检查 Android
APK、设备状态、运行时行为、资源和原生库。相同工作流可通过 MCP 服务和终端使用。

本项目保留 `rea`、`rea-agents` 和 `reverse-engineer-anything` 标识以兼容现有安装。
随附 skill、服务指令、CLI 命令和 MCP 目录均为 Android-only。

分析在本机运行，结果保留对应的 Evidence、提供方身份、覆盖范围、限制和未知项。

<a id="quick-start"></a>

## 快速开始

<a id="requirements"></a>

### 要求

REA:Reverse Engineer Android 使用 [.nvmrc](../../.nvmrc) 固定的 Node.js 版本。
安装项目依赖：

```sh
npm ci
```

静态 APK 分析还需要完整的 JDK 17 或更高版本，以及调用方提供的
`jadx-headless-mcp-0.7.1-all.jar`。用 `REA_JADX_MCP_JAR` 选择 JAR，
必要时用 `JAVA_HOME` 选择 Java。

设备工作流需要调用方提供的 `adb`。可用 `REA_ADB_PATH` 指定，
或将 `adb` 放入 `PATH`。

资源解码需要 Apktool 2.7.0 或更高版本。可用 `REA_APKTOOL_COMMAND` 指定，
或将 `apktool` 放入 `PATH`。

原生库分析使用已有的 Ghidra 或 IDA。JEB 和 Frida 由调用方提供，
分别用于更深层的引擎分析和运行时分析。

REA:Reverse Engineer Android 不会安装或升级 Java、JADX、ADB、Apktool、
Ghidra、IDA、JEB 或 Frida。

### 构建本地运行时

```sh
npm run build:cached
node scripts/rea.mjs --help
```

Windows 上的 JADX 和 Ghidra 工作流使用 `native/windows/build/` 下的
Windows x64 原生控件。源码检出可从同一 `rea-agents@6.8.0` tarball 恢复匹配文件，
参见 [Windows 原生说明](../../native/windows/README.md)。

### 设置智能体

```sh
node scripts/rea.mjs setup
```

选择要使用的智能体，检查计划变更并批准。设置流程会添加本地
REA:Reverse Engineer Android 服务、安装 Android-only skill，
并在写入前备份已有配置。完成后重启智能体。

本地启动器是 `scripts/rea.mjs`。客户端需要显式命令时，使用该脚本的绝对路径，
并使用构建此源码检出时的同一 Node.js 运行时。

### 向智能体提问

```text
检查这个 APK，解释登录流程如何工作，并展示证据。
需要时继续追踪到原生库。
```

把示例替换为你的目标 APK 和想了解的行为。

### 使用终端

```sh
node scripts/rea.mjs inspect-android-package /absolute/path/application.apk
node scripts/rea.mjs search-android-classes /absolute/path/application.apk MainActivity
node scripts/rea.mjs inspect-android-class /absolute/path/application.apk com.example.MainActivity
node scripts/rea.mjs inspect-android-method /absolute/path/application.apk com.example.MainActivity onCreate
node scripts/rea.mjs trace-android-references /absolute/path/application.apk com.example.MainActivity
```

除非使用 MCP 会话，每条命令都是隔离的。完整 Evidence 随结果返回。

<a id="how-it-works"></a>

## 工作原理

智能体通过 MCP 调用 REA:Reverse Engineer Android，你也可以通过 CLI 使用相同工作流。
它会检查选定的 APK 或设备，追踪相关类、方法、资源、引用和原生代码，
并返回带 Evidence 的发现。

![REA:Reverse Engineer Android 调查流程：智能体询问本地目标，服务检查并追踪目标，智能体使用返回的 Evidence 解释或实现功能。](../../website/public/assets/figures/rea-investigation-flow.svg)

静态分析不能证明运行时行为。运行时工具只作用于明确选择的设备、包、进程、
脚本和观察窗口。

<a id="tool-catalog"></a>

## 工具目录

默认 MCP 目录包含 **117 个 Android 工具**：

| Family        | 覆盖范围                                                              |
| ------------- | --------------------------------------------------------------------- |
| `android`     | APK 包、清单组件、类、方法、引用和 JNI 绑定                           |
| `apktool`     | Apktool 就绪检查和 Android 资源解码                                   |
| `artifact`    | APK/归档清单、受控提取和 APK 签名检查                                 |
| `flutter`     | Flutter 构建识别和 Dart AOT 检查                                      |
| `adb`         | 设备、包、文件、日志、进程、应用生命周期和显式设备修改                |
| `frida`       | 设备/进程发现、插桩脚本、会话和清理                                   |
| `jeb`         | JEB 客户端、项目、单元和反编译                                        |
| `native`      | ELF notes、原生导出、ELF 布局和字节熵                                 |
| `direct`      | Ghidra 和 IDA 无界面原生分析操作                                      |
| `enhanced`    | 函数 dossier、调用图、批量反编译和原生追踪工作流                      |
| `application` | Android 指引、分析视图/设置和 Android 应用图投影                      |
| `session`     | 二进制生命周期、Evidence bundle、比较、未知项和 Android/native 上下文 |

可用 `REA_MCP_TOOL_FAMILIES` 按工作流缩窄目录。无效或已移除的 family id
会阻止服务启动并返回当前 family 列表。

MCP 默认使用紧凑输入 schema。客户端需要完整字段说明和嵌套验证细节时，
设置 `REA_MCP_INPUT_SCHEMA_PROFILE=full`。两种 profile 都验证同一套服务端规范契约。

<a id="what-you-can-analyze"></a>

## 可以分析什么

| 目标           | 返回内容                                                                   | 要求和指南                                                                           |
| -------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Android APK    | 包身份、SDK/权限、清单组件、类、方法、引用、JNI 绑定和反编译输出           | JADX MCP JAR 0.7.1 和完整 JDK 17+；[Android 指南](../android-analysis.md)            |
| APK 签名       | v1/v2/v3/v3.1 签名者、证书指纹、密钥轮换、source stamp 和摘要自洽性        | 内置静态检查；[APK 签名指南](../apk-signature.md)                                    |
| Android 设备   | 设备、包、进程、日志、文件、截图、bugreport、生命周期和显式修改            | 调用方提供的 `adb`；[ADB 指南](../adb-device-analysis.md)                            |
| Android 资源   | 解码清单、资源元数据、语言字符串表、版本信息和覆盖范围                     | 调用方提供的 Apktool 2.7.0+；[Apktool 指南](../apktool-resource-analysis.md)         |
| Flutter 应用   | Dart 快照哈希、按 ABI 库摘要、引擎构建溯源和受支持 AOT 信息                | 内置 APK 解析；[Flutter 指南](../flutter-analysis.md)                                |
| JEB 项目       | 引擎项目单元、工件摘要和类型/方法伪代码                                    | 调用方启动的 JEB 客户端，通过 `REA_JEB_MCP_URL` 选择；[JEB 指南](../jeb-analysis.md) |
| Android 运行时 | Frida 设备/进程发现、脚本、消息、会话状态和清理                            | 调用方提供的 Frida 和 Android 目标；[Frida 指南](../frida-instrumentation.md)        |
| 原生库         | ELF 元数据、导出、伪代码、汇编、调用者、被调用者、引用、CFG 和函数 dossier | Ghidra 或 IDA；[原生分析](../native-investigation.md)                                |
| APK 归档清单   | APK 成员清单、摘要、完整性观察、提取和 Android 应用图投影                  | 内置归档检查                                                                         |

### Android support analysis

The default Android tool catalog remains the table above. The repository also documents Android support analysis that does not add a public MCP family:

- [Android system images](../android-system-images.md): boot/vendor_boot/init_boot/recovery, DTB/DTBO, sparse images, super/dynamic partitions, AVB/vbmeta, OTA, A/B slots, kernel, SELinux, and init.
- [SQLite databases](../sqlite-databases.md), [packet captures](../packet-captures.md), [process capture](../process-capture.md), and [recorded crashes](../recorded-crashes.md): Android app data, saved network traffic, runtime evidence, and crash triage.
- [Devicetree](../devicetree.md), [kernel modules](../kernel-modules.md), [raw binary](../raw-binary.md), [Ghidra MIPS](../ghidra-mips.md), and [Ghidra RISC-V](../ghidra-riscv.md): Android system, boot-chain, device, and native-architecture context.

### Cross-language Android artifacts

Android apps can contain native and script-produced artifacts beyond Java/Kotlin and Flutter. These are supporting analysis, not new MCP families:

- Unity Android: `libunity.so`, `libil2cpp.so`, `assets/bin/Data`, `global-metadata.dat`, resource packs, and native engine structures.
- Godot Android: Godot native `.so` libraries, PCK/resource archives, compression metadata, and unresolved resources.
- React Native: `libreactnativejni.so`, `libreactnative.so`, JavaScript bundles, and native bridge candidates.
- Hermes: `libhermes.so`, Hermes bytecode, bundle paths, and version facts.
- Go and Rust: Android native `.so` libraries with language runtime metadata, symbols, build strings, and panic or runtime tables.
- Python: Android analysis helpers, fixtures, and toolchain support only; generic packaged-Python targets are not re-advertised.

Ghidra or IDA still performs native `.so` analysis. Unity, Godot, React Native, and Hermes provide Android context, APK member provenance, and supporting relationships; language or engine identification does not prove runtime loading or execution. See [cross-language Android libraries](../android-cross-language-libraries.md) and [native investigation](../native-investigation.md).

Android-only 服务不会注册浏览器、Electron、独立 JavaScript、Apple、
HarmonyOS、桌面、固件、托管 .NET、RL 环境或其他非 Android family。
SQLite、已保存的数据包捕获、进程/崩溃证据、devicetree、raw binary、
kernel module 和旧版原生架构保留为 Android 支撑文档，不会新增公开 MCP family。

<a id="deep-analysis-providers"></a>

## 深度分析提供方

Android APK 代码通过 `src/android/` 使用调用方提供的无界面 JADX 引擎。
就绪检查会验证所选 JAR，但不能证明每个 APK 都能成功解码。

原生 `.so` 分析通过共享二进制会话使用 Ghidra 或 IDA：

```sh
node scripts/rea.mjs analyze /absolute/path/libexample.so \
  --provider-id ghidra

node scripts/rea.mjs decompile /absolute/path/libexample.so \
  --procedure Java_com_example_Native_run \
  --provider-id ghidra
```

运行 `node scripts/rea.mjs doctor --provider ghidra --json` 或 `--provider ida`
检查原生提供方，使用 `--provider jadx` 检查 Android APK 提供方配置。

Android-only 分支不会注册 Hopper 或 Kuna。

### 静态 APK 检查

```sh
node scripts/rea.mjs inspect-android-package /absolute/path/application.apk
node scripts/rea.mjs inspect-android-jni-bindings /absolute/path/application.apk
node scripts/rea.mjs inspect-apk-signature /absolute/path/application.apk
node scripts/rea.mjs decode-android-resources /absolute/path/application.apk
node scripts/rea.mjs identify-flutter-build /absolute/path/application.apk
```

release 构建有 R8 或 ProGuard `mapping.txt` 时，向类或方法检查传入绝对路径：

```sh
node scripts/rea.mjs inspect-android-class /absolute/path/application.apk \
  a.b \
  --mapping-path /absolute/path/mapping.txt \
  --detail summary \
  --evidence_output /absolute/path/class-evidence.json
```

映射注解与观察到的 DEX 名称分开保留。
REA:Reverse Engineer Android 不会验证 mapping 是否属于该 APK 构建。

### 设备和运行时工作流

```sh
node scripts/rea.mjs list-adb-devices
node scripts/rea.mjs inspect-adb-device emulator-5554
node scripts/rea.mjs list-adb-packages emulator-5554
node scripts/rea.mjs pull-adb-package emulator-5554 com.example
node scripts/rea.mjs read-adb-logcat emulator-5554
node scripts/rea.mjs list-adb-processes emulator-5554
```

设备修改和执行工具必须显式调用：

```sh
node scripts/rea.mjs install-adb-package emulator-5554 /absolute/path/application.apk
node scripts/rea.mjs start-adb-app emulator-5554 com.example
node scripts/rea.mjs stop-adb-app emulator-5554 com.example
node scripts/rea.mjs uninstall-adb-package emulator-5554 com.example
```

Frida 操作使用同一显式目标模型：

```sh
node scripts/rea.mjs list-frida-devices
node scripts/rea.mjs list-frida-processes --device-id emulator-5554
node scripts/rea.mjs instrument-with-frida \
  --device-id emulator-5554 \
  --pid 1234 \
  --script-file /absolute/path/hook.js
```

Frida 脚本可以读取或修改目标内存和行为，并访问目标进程能力。
关闭 Frida 会话只会解除插桩，不会终止目标。

## Evidence 和限制

工具结果区分观察、推导、推断和未知项。Evidence 保留选定目标、提供方身份、
来源位置、覆盖范围、限制和稳定 Evidence ID。

静态分析不能建立运行时执行事实。类名、清单声明、原生导出和 JNI 表候选项
是 shipped artifact 的证据，不能证明 Android 在运行时加载了某一路径。
不完整解码、剥离符号、动态加载、反射、间接调用和未观察设备状态仍为未知。

用 `record_unknown` 保留重要未解问题。需要完整 Evidence 超出当前会话时，
使用 `export_evidence_bundle`。

<a id="set-up-your-agent"></a>

## 设置智能体

设置流程支持现有客户端适配器。注册指向此源码检出，安装的 skill 为 Android-only。

```sh
node scripts/rea.mjs setup
node scripts/rea.mjs doctor --client codex --json
node scripts/rea.mjs mcp
```

手动 stdio 注册时，使用绝对 Node.js 可执行文件和本检出的绝对
`scripts/rea.mjs` 路径：

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

检查客户端配置格式，并保留无关设置和备份。

## 更新

此分支不从上游 npm 包更新。`rea update` 只报告 source-managed 状态，
不会替换 Android-only 运行时。

刷新检出：

```sh
npm ci
npm run build:cached
```

随后重新安装或重新连接客户端注册，使客户端使用新构建的运行时。

未来上游变更的选择规则见 [Android 分支维护](../fork-maintenance.md) 和
[upstream-sync.json](../../upstream-sync.json)。

<a id="faq"></a>

## 常见问题

<details>
<summary><strong>Do Unity, Godot, React Native, Hermes, Go, or Rust mentions add MCP tools?</strong></summary>

No. They are Android support-analysis records. The public catalog remains limited to the documented Android families; adding a family or tool requires a new scope decision, contract, tests, and provider verification. See [MCP contracts](../mcp-contracts.md#tool-families).

</details>

<details>
<summary><strong>可以从本地源码检出运行吗？</strong></summary>

可以。运行 `npm run build:cached`，然后使用 `node scripts/rea.mjs`。
设置和手动注册可直接指向此检出。

</details>

<details>
<summary><strong>它会从 npm 更新吗？</strong></summary>

不会。`rea update` 是 source-managed，不会安装上游 REA 包。

</details>

<details>
<summary><strong>支持哪些原生引擎？</strong></summary>

Android 原生库使用 Ghidra 或 IDA。此分支不注册 Hopper 或 Kuna。

</details>

<details>
<summary><strong>REA:Reverse Engineer Android 会上传我的 APK 吗？</strong></summary>

分析在本机运行。智能体接收工具结果，其模型提供方受自身数据政策约束。

</details>

<a id="documentation"></a>

## 文档

- [Android content audit](../maintenance/android-content-audit.json): per-path restoration and deletion decisions.

- [Android 支持分析](../android-system-images.md)、[跨语言库](../android-cross-language-libraries.md)、[SQLite 数据库](../sqlite-databases.md)、[数据包捕获](../packet-captures.md)、[进程捕获](../process-capture.md) 和 [崩溃记录](../recorded-crashes.md)：这些 Android 支撑内容不会新增公开 MCP family。

- [安装与设置](../installation.md)：客户端注册、就绪检查、更新和卸载。
- [CLI 与 Evidence](../cli.md)：命令、提供方选择、快照、导入/导出和退出状态。
- [MCP 契约](../mcp-contracts.md)和[智能体提示词](../mcp-prompts.md)。
- [Android APK 分析](../android-analysis.md)。
- [ADB 设备分析](../adb-device-analysis.md)。
- [Android 资源](../apktool-resource-analysis.md)。
- [APK 签名](../apk-signature.md)。
- [Flutter 分析](../flutter-analysis.md)。
- [JEB 分析](../jeb-analysis.md)。
- [Frida 插桩](../frida-instrumentation.md)。
- [原生分析](../native-investigation.md)。
- [测试](../testing.md)和[架构图](../architecture.mermaid)。

请按照 [SECURITY.md](../../SECURITY.md) 报告漏洞。

## 免责声明

负责任使用指引见 [DISCLAIMER.md](../../DISCLAIMER.md)。

REA:Reverse Engineer Android 用于合法的研究、教育、互操作性、软件保存，
以及分析你拥有或获准检查的软件。

调用方必须合法取得并遵守所使用引擎或工具（包括 IDA、JEB 等商业工具）的条款。
REA:Reverse Engineer Android 不提供工具许可、密钥或激活权利。

## 参与贡献

欢迎聚焦错误修复、文档改进、测试和 Android 专用工作流。

开发设置见 [CONTRIBUTING.md](../../CONTRIBUTING.md)，验证流程见
[测试指南](../testing.md)，依赖和所有权边界见[架构图](../architecture.mermaid)。

## 许可证

[MIT](../../LICENSE)

本分支编写的代码采用 MIT 许可。第三方内容保留各自许可和版权声明；
依赖清单和外部工具条款见[第三方声明](../../THIRD_PARTY_NOTICES.md)。
