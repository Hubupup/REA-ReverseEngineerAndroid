<div align="center">

[English](../../README.md) · [简体中文](README_zh.md) · **繁體中文** · [Français](README_fr.md) · [Deutsch](README_de.md) · [Português (Brasil)](README_pt-BR.md) · [Español](README_es.md) · [한국어](README_ko.md) · [日本語](README_ja.md)

# REA:Reverse Engineer Android

### 一個面向 Android 應用逆向工程分析的 MCP。

**檢查 APK，沿功能追蹤到原生程式碼，並保留支撐每項結論的證據。**

[![MCP 工具目錄](https://img.shields.io/badge/MCP-117_Android_tools-5c4ee5?style=flat-square)](#tool-catalog)
[![Node.js 要求](https://img.shields.io/badge/Node.js-24.22.1-339933?style=flat-square&logo=nodedotjs&logoColor=white)](#requirements)
[![MIT 授權](https://img.shields.io/badge/license-MIT-f4c430?style=flat-square)](../../LICENSE)

[快速開始](#quick-start) · [運作方式](#how-it-works) · [可分析內容](#what-you-can-analyze) · [提供方設定](#deep-analysis-providers) · [代理設定](#set-up-your-agent) · [常見問題](#faq) · [文件](#documentation)

<code>node scripts/rea.mjs setup</code>

</div>

> [!IMPORTANT]
> 本倉庫是 [morluto/rea](https://github.com/morluto/rea) 的 Android 專用硬分叉，
> 基於 REA 6.8.0。它設計為從目前本機原始碼檢出建置與執行，
> 不從公共 `rea-agents` npm 套件更新。

---

REA:Reverse Engineer Android 將代理連接到本機工具，用於檢查 Android
APK、裝置狀態、執行時行為、資源與原生函式庫。相同工作流程可透過 MCP
服務與終端機使用。

本專案保留 `rea`、`rea-agents` 和 `reverse-engineer-anything` 識別碼，
以相容既有安裝。隨附 skill、服務指示、CLI 命令與 MCP 目錄均為 Android-only。

分析在本機執行，結果保留對應的 Evidence、提供方身分、涵蓋範圍、限制與未知項。

<a id="quick-start"></a>

## 快速開始

<a id="requirements"></a>

### 要求

REA:Reverse Engineer Android 使用 [.nvmrc](../../.nvmrc) 固定的 Node.js
版本。安裝專案相依套件：

```sh
npm ci
```

靜態 APK 分析還需要完整的 JDK 17 或更新版本，以及呼叫方提供的
`jadx-headless-mcp-0.7.1-all.jar`。用 `REA_JADX_MCP_JAR` 選擇 JAR，
必要時用 `JAVA_HOME` 選擇 Java。

裝置工作流程需要呼叫方提供的 `adb`。可用 `REA_ADB_PATH` 指定，
或將 `adb` 放入 `PATH`。

資源解碼需要 Apktool 2.7.0 或更新版本。可用 `REA_APKTOOL_COMMAND` 指定，
或將 `apktool` 放入 `PATH`。

原生函式庫分析使用既有的 Ghidra 或 IDA。JEB 與 Frida 由呼叫方提供，
分別用於更深層的引擎分析與執行時分析。

REA:Reverse Engineer Android 不會安裝或升級 Java、JADX、ADB、Apktool、
Ghidra、IDA、JEB 或 Frida。

### 建置本機執行時

```sh
npm run build:cached
node scripts/rea.mjs --help
```

Windows 上的 JADX 與 Ghidra 工作流程使用 `native/windows/build/` 下的
Windows x64 原生控制項。原始碼檢出可從同一 `rea-agents@6.8.0` tarball
還原相符檔案，參見 [Windows 原生說明](../../native/windows/README.md)。

### 設定代理

```sh
node scripts/rea.mjs setup
```

選擇要使用的代理，檢查計畫變更並批准。設定流程會加入本機
REA:Reverse Engineer Android 服務、安裝 Android-only skill，
並在寫入前備份既有設定。完成後重新啟動代理。

本機啟動器是 `scripts/rea.mjs`。用戶端需要明確命令時，使用該腳本的絕對路徑，
並使用建置此原始碼檢出時的相同 Node.js 執行時。

### 向代理提問

```text
檢查這個 APK，解釋登入流程如何運作，並顯示證據。
需要時繼續追蹤到原生函式庫。
```

將範例替換為你的目標 APK 與想了解的行為。

### 使用終端機

```sh
node scripts/rea.mjs inspect-android-package /absolute/path/application.apk
node scripts/rea.mjs search-android-classes /absolute/path/application.apk MainActivity
node scripts/rea.mjs inspect-android-class /absolute/path/application.apk com.example.MainActivity
node scripts/rea.mjs inspect-android-method /absolute/path/application.apk com.example.MainActivity onCreate
node scripts/rea.mjs trace-android-references /absolute/path/application.apk com.example.MainActivity
```

除非使用 MCP 工作階段，每條命令都是隔離的。完整 Evidence 隨結果傳回。

<a id="how-it-works"></a>

## 運作方式

代理透過 MCP 呼叫 REA:Reverse Engineer Android，你也可以透過 CLI 使用相同
工作流程。它會檢查選定的 APK 或裝置，追蹤相關類別、方法、資源、引用與原生程式碼，
並傳回帶 Evidence 的發現。

![REA:Reverse Engineer Android 調查流程：代理詢問本機目標，服務檢查並追蹤目標，代理使用傳回的 Evidence 解釋或實作功能。](../../website/public/assets/figures/rea-investigation-flow.svg)

靜態分析不能證明執行時行為。執行時工具只作用於明確選擇的裝置、套件、程序、
腳本與觀察視窗。

<a id="tool-catalog"></a>

## 工具目錄

預設 MCP 目錄包含 **117 個 Android 工具**：

| Family        | 涵蓋範圍                                                            |
| ------------- | ------------------------------------------------------------------- |
| `android`     | APK 套件、資訊清單元件、類別、方法、引用與 JNI 綁定                 |
| `apktool`     | Apktool 就緒檢查與 Android 資源解碼                                 |
| `artifact`    | APK/封存清單、受控擷取與 APK 簽章檢查                               |
| `flutter`     | Flutter 建置識別與 Dart AOT 檢查                                    |
| `adb`         | 裝置、套件、檔案、日誌、程序、應用程式生命週期與顯式裝置修改        |
| `frida`       | 裝置/程序探索、插樁腳本、工作階段與清理                             |
| `jeb`         | JEB 用戶端、專案、單元與反編譯                                      |
| `native`      | ELF notes、原生匯出、ELF 配置與位元組熵                             |
| `direct`      | Ghidra 與 IDA 無介面原生分析操作                                    |
| `enhanced`    | 函式 dossier、呼叫圖、批次反編譯與原生追蹤工作流程                  |
| `application` | Android 指引、分析檢視/設定與 Android 應用程式圖投影                |
| `session`     | 二進位生命週期、Evidence bundle、比較、未知項與 Android/native 內容 |

可用 `REA_MCP_TOOL_FAMILIES` 將目錄縮窄到工作流程需要的 family。無效或已移除的
family id 會阻止服務啟動並傳回目前 family 清單。

MCP 預設使用精簡 input schema。用戶端需要完整欄位說明與巢狀驗證細節時，
設定 `REA_MCP_INPUT_SCHEMA_PROFILE=full`。兩種 profile 都驗證同一套伺服器契約。

<a id="what-you-can-analyze"></a>

## 可以分析什麼

| 目標             | 傳回內容                                                                     | 要求與指南                                                                           |
| ---------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Android APK      | 套件身分、SDK/權限、資訊清單元件、類別、方法、引用、JNI 綁定與反編譯輸出     | JADX MCP JAR 0.7.1 與完整 JDK 17+；[Android 指南](../android-analysis.md)            |
| APK 簽章         | v1/v2/v3/v3.1 簽署者、憑證指紋、金鑰輪換、source stamp 與摘要自洽性          | 內建靜態檢查；[APK 簽章指南](../apk-signature.md)                                    |
| Android 裝置     | 裝置、套件、程序、日誌、檔案、螢幕截圖、bugreport、生命週期與顯式修改        | 呼叫方提供的 `adb`；[ADB 指南](../adb-device-analysis.md)                            |
| Android 資源     | 解碼資訊清單、資源中繼資料、語言字串表、版本資訊與涵蓋範圍                   | 呼叫方提供的 Apktool 2.7.0+；[Apktool 指南](../apktool-resource-analysis.md)         |
| Flutter 應用程式 | Dart 快照雜湊、依 ABI 的函式庫摘要、引擎建置溯源與支援的 AOT 資訊            | 內建 APK 解析；[Flutter 指南](../flutter-analysis.md)                                |
| JEB 專案         | 引擎專案單元、工件摘要與型別/方法虛擬碼                                      | 呼叫方啟動的 JEB 用戶端，透過 `REA_JEB_MCP_URL` 選擇；[JEB 指南](../jeb-analysis.md) |
| Android 執行時   | Frida 裝置/程序探索、腳本、訊息、工作階段狀態與清理                          | 呼叫方提供的 Frida 與 Android 目標；[Frida 指南](../frida-instrumentation.md)        |
| 原生函式庫       | ELF 中繼資料、匯出、虛擬碼、組譯、呼叫者、被呼叫者、引用、CFG 與函式 dossier | Ghidra 或 IDA；[原生分析](../native-investigation.md)                                |
| APK 封存清單     | APK 成員清單、摘要、完整性觀察、擷取與 Android 應用程式圖投影                | 內建封存檢查                                                                         |

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

Android-only 服務不會註冊瀏覽器、Electron、獨立 JavaScript、Apple、
HarmonyOS、桌面、韌體、受控 .NET、RL 環境或其他非 Android family。
SQLite、已儲存的封包擷取、處理程序/崩潰證據、devicetree、raw binary、
kernel module 與舊版原生架構保留為 Android 支援文件，不會新增公開 MCP family。

<a id="deep-analysis-providers"></a>

## 深度分析提供方

Android APK 程式碼透過 `src/android/` 使用呼叫方提供的無介面 JADX 引擎。
就緒檢查會驗證所選 JAR，但不能證明每個 APK 都能成功解碼。

原生 `.so` 分析透過共享二進位工作階段使用 Ghidra 或 IDA：

```sh
node scripts/rea.mjs analyze /absolute/path/libexample.so \
  --provider-id ghidra

node scripts/rea.mjs decompile /absolute/path/libexample.so \
  --procedure Java_com_example_Native_run \
  --provider-id ghidra
```

執行 `node scripts/rea.mjs doctor --provider ghidra --json` 或 `--provider ida`
檢查原生提供方，使用 `--provider jadx` 檢查 Android APK 提供方設定。

Android-only 分支不會註冊 Hopper 或 Kuna。

### 靜態 APK 檢查

```sh
node scripts/rea.mjs inspect-android-package /absolute/path/application.apk
node scripts/rea.mjs inspect-android-jni-bindings /absolute/path/application.apk
node scripts/rea.mjs inspect-apk-signature /absolute/path/application.apk
node scripts/rea.mjs decode-android-resources /absolute/path/application.apk
node scripts/rea.mjs identify-flutter-build /absolute/path/application.apk
```

release 建置有 R8 或 ProGuard `mapping.txt` 時，向類別或方法檢查傳入絕對路徑：

```sh
node scripts/rea.mjs inspect-android-class /absolute/path/application.apk \
  a.b \
  --mapping-path /absolute/path/mapping.txt \
  --detail summary \
  --evidence_output /absolute/path/class-evidence.json
```

映射註解與觀察到的 DEX 名稱分開保留。
REA:Reverse Engineer Android 不會驗證 mapping 是否屬於該 APK 建置。

### 裝置與執行時工作流程

```sh
node scripts/rea.mjs list-adb-devices
node scripts/rea.mjs inspect-adb-device emulator-5554
node scripts/rea.mjs list-adb-packages emulator-5554
node scripts/rea.mjs pull-adb-package emulator-5554 com.example
node scripts/rea.mjs read-adb-logcat emulator-5554
node scripts/rea.mjs list-adb-processes emulator-5554
```

裝置修改與執行工具必須顯式呼叫：

```sh
node scripts/rea.mjs install-adb-package emulator-5554 /absolute/path/application.apk
node scripts/rea.mjs start-adb-app emulator-5554 com.example
node scripts/rea.mjs stop-adb-app emulator-5554 com.example
node scripts/rea.mjs uninstall-adb-package emulator-5554 com.example
```

Frida 操作使用同一顯式目標模型：

```sh
node scripts/rea.mjs list-frida-devices
node scripts/rea.mjs list-frida-processes --device-id emulator-5554
node scripts/rea.mjs instrument-with-frida \
  --device-id emulator-5554 \
  --pid 1234 \
  --script-file /absolute/path/hook.js
```

Frida 腳本可以讀取或修改目標記憶體與行為，並存取目標程序能力。
關閉 Frida 工作階段只會解除插樁，不會終止目標。

## Evidence 與限制

工具結果區分觀察、推導、推論與未知項。Evidence 保留選定目標、提供方身分、
來源位置、涵蓋範圍、限制與穩定 Evidence ID。

靜態分析不能建立執行時執行事實。類別名稱、資訊清單宣告、原生匯出與 JNI
表候選項是 shipped artifact 的證據，不能證明 Android 在執行時載入某一路徑。
不完整解碼、剝離符號、動態載入、反射、間接呼叫與未觀察裝置狀態仍為未知。

用 `record_unknown` 保留重要未解問題。需要完整 Evidence 超出目前工作階段時，
使用 `export_evidence_bundle`。

<a id="set-up-your-agent"></a>

## 設定代理

設定流程支援既有用戶端介接。註冊指向此原始碼檢出，安裝的 skill 為 Android-only。

```sh
node scripts/rea.mjs setup
node scripts/rea.mjs doctor --client codex --json
node scripts/rea.mjs mcp
```

手動 stdio 註冊時，使用絕對 Node.js 執行檔與本檢出的絕對
`scripts/rea.mjs` 路徑：

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

檢查用戶端設定格式，並保留無關設定與備份。

## 更新

此分支不從上游 npm 套件更新。`rea update` 只報告 source-managed 狀態，
不會替換 Android-only 執行時。

重新整理檢出：

```sh
npm ci
npm run build:cached
```

接著重新安裝或重新連線用戶端註冊，使用新建置的執行時。

未來上游變更的選擇規則見 [Android 分支維護](../fork-maintenance.md) 與
[upstream-sync.json](../../upstream-sync.json)。

<a id="faq"></a>

## 常見問題

<details>
<summary><strong>Do Unity, Godot, React Native, Hermes, Go, or Rust mentions add MCP tools?</strong></summary>

No. They are Android support-analysis records. The public catalog remains limited to the documented Android families; adding a family or tool requires a new scope decision, contract, tests, and provider verification. See [MCP contracts](../mcp-contracts.md#tool-families).

</details>

<details>
<summary><strong>可以從本機原始碼檢出執行嗎？</strong></summary>

可以。執行 `npm run build:cached`，然後使用 `node scripts/rea.mjs`。
設定與手動註冊可直接指向此檢出。

</details>

<details>
<summary><strong>它會從 npm 更新嗎？</strong></summary>

不會。`rea update` 是 source-managed，不會安裝上游 REA 套件。

</details>

<details>
<summary><strong>支援哪些原生引擎？</strong></summary>

Android 原生函式庫使用 Ghidra 或 IDA。此分支不註冊 Hopper 或 Kuna。

</details>

<details>
<summary><strong>REA:Reverse Engineer Android 會上傳我的 APK 嗎？</strong></summary>

分析在本機執行。代理接收工具結果，其模型提供方受自身資料政策約束。

</details>

<a id="documentation"></a>

## 文件

- [Android content audit](../maintenance/android-content-audit.json): per-path restoration and deletion decisions.

- [Android 支援分析](../android-system-images.md)、[跨語言函式庫](../android-cross-language-libraries.md)、[SQLite 資料庫](../sqlite-databases.md)、[封包擷取](../packet-captures.md)、[處理程序擷取](../process-capture.md) 與 [崩潰記錄](../recorded-crashes.md)：這些 Android 支援內容不會新增公開 MCP family。

- [安裝與設定](../installation.md)：用戶端註冊、就緒檢查、更新與解除安裝。
- [CLI 與 Evidence](../cli.md)：命令、提供方選擇、快照、匯入/匯出與結束狀態。
- [MCP 契約](../mcp-contracts.md)與[代理提示詞](../mcp-prompts.md)。
- [Android APK 分析](../android-analysis.md)。
- [ADB 裝置分析](../adb-device-analysis.md)。
- [Android 資源](../apktool-resource-analysis.md)。
- [APK 簽章](../apk-signature.md)。
- [Flutter 分析](../flutter-analysis.md)。
- [JEB 分析](../jeb-analysis.md)。
- [Frida 插樁](../frida-instrumentation.md)。
- [原生分析](../native-investigation.md)。
- [測試](../testing.md)與[架構圖](../architecture.mermaid)。

請依照 [SECURITY.md](../../SECURITY.md) 回報漏洞。

## 免責聲明

負責任使用指引見 [DISCLAIMER.md](../../DISCLAIMER.md)。

REA:Reverse Engineer Android 用於合法的研究、教育、互通性、軟體保存，
以及分析你擁有或獲准檢查的軟體。

呼叫方必須合法取得並遵守所使用引擎或工具（包括 IDA、JEB 等商業工具）的條款。
REA:Reverse Engineer Android 不提供工具授權、金鑰或啟用權利。

## 參與貢獻

歡迎聚焦錯誤修正、文件改進、測試與 Android 專用工作流程。

開發設定見 [CONTRIBUTING.md](../../CONTRIBUTING.md)，驗證流程見
[測試指南](../testing.md)，相依與所有權邊界見[架構圖](../architecture.mermaid)。

## 授權

[MIT](../../LICENSE)

本分支編寫的程式碼採用 MIT 授權。第三方內容保留自身授權與著作權聲明；
相依清單與外部工具條款見[第三方聲明](../../THIRD_PARTY_NOTICES.md)。
