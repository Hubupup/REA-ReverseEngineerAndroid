<div align="center">

[English](../../README.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [Français](README_fr.md) · [Deutsch](README_de.md) · [Português (Brasil)](README_pt-BR.md) · [Español](README_es.md) · [한국어](README_ko.md) · **日本語**

# REA:Reverse Engineer Android

### Android アプリケーションのリバースエンジニアリングのための MCP

**APK を調査し、動作をネイティブコードまで追跡し、すべての結論の根拠を保持します。**

[![MCP ツールカタログ](https://img.shields.io/badge/MCP-117_Android_tools-5c4ee5?style=flat-square)](#tool-catalog)
[![Node.js 要件](https://img.shields.io/badge/Node.js-24.22.1-339933?style=flat-square&logo=nodedotjs&logoColor=white)](#requirements)
[![MIT ライセンス](https://img.shields.io/badge/license-MIT-f4c430?style=flat-square)](../../LICENSE)

[クイックスタート](#quick-start) · [仕組み](#how-it-works) · [分析対象](#what-you-can-analyze) · [プロバイダー](#deep-analysis-providers) · [エージェント設定](#set-up-your-agent) · [FAQ](#faq) · [ドキュメント](#documentation)

<code>node scripts/rea.mjs setup</code>

</div>

> [!IMPORTANT]
> このリポジトリは [morluto/rea](https://github.com/morluto/rea) の
> Android 専用ハードフォークで、REA 6.8.0 を基にしています。
> 現在のローカルソースチェックアウトからビルドして実行するためのもので、
> 公開 `rea-agents` npm パッケージからは更新しません。

---

REA:Reverse Engineer Android は、エージェントをローカルツールに接続し、
Android APK、デバイス状態、ランタイム動作、リソース、ネイティブライブラリを
調査します。同じワークフローを MCP サーバーとターミナルから利用できます。

このフォークはインストール互換性のため `rea`、`rea-agents`、
`reverse-engineer-anything` の識別子を維持します。バンドルされる skill、
サーバー指示、CLI、MCP カタログは Android 専用です。

分析はローカルで実行され、結果には Evidence、プロバイダー、カバレッジ、
制限、未解決事項が保持されます。

<a id="quick-start"></a>

## クイックスタート

<a id="requirements"></a>

### 要件

REA:Reverse Engineer Android は [.nvmrc](../../.nvmrc) に固定された
Node.js バージョンを使用します。依存関係をインストールします。

```sh
npm ci
```

静的 APK 分析には完全な JDK 17 以降と、利用者が用意する
`jadx-headless-mcp-0.7.1-all.jar` が必要です。JAR は
`REA_JADX_MCP_JAR`、Java は必要に応じて `JAVA_HOME` で選択します。

デバイスワークフローには利用者が用意する `adb` が必要です。
`REA_ADB_PATH` を指定するか、`adb` を `PATH` に追加します。

リソースのデコードには Apktool 2.7.0 以降が必要です。
`REA_APKTOOL_COMMAND` を指定するか、`apktool` を `PATH` に追加します。

ネイティブライブラリ分析には既存の Ghidra または IDA を使用します。
JEB と Frida は利用者が用意します。

REA:Reverse Engineer Android は Java、JADX、ADB、Apktool、Ghidra、IDA、
JEB、Frida をインストールまたは更新しません。

### ローカルランタイムをビルド

```sh
npm run build:cached
node scripts/rea.mjs --help
```

Windows の JADX と Ghidra ワークフローは
`native/windows/build/` の Windows x64 ネイティブコントロールを使用します。
詳細は [native/windows/README.md](../../native/windows/README.md) を参照してください。

### エージェントを設定

```sh
node scripts/rea.mjs setup
```

使用するエージェントを選択し、提案された変更を確認して承認します。Setup は
ローカル REA:Reverse Engineer Android サーバーを追加し、Android 専用 skill を
インストールし、既存設定をバックアップします。

ローカルランチャーは `scripts/rea.mjs` です。クライアントに明示的なコマンドが
必要な場合は、絶対パスと同じ Node.js ランタイムを使用します。

### エージェントに依頼

```text
この APK を調査し、ログインフローがどう動作するか説明して、証拠を提示して。
必要ならネイティブライブラリまで追跡して。
```

### ターミナルで使用

```sh
node scripts/rea.mjs inspect-android-package /absolute/path/application.apk
node scripts/rea.mjs search-android-classes /absolute/path/application.apk MainActivity
node scripts/rea.mjs inspect-android-class /absolute/path/application.apk com.example.MainActivity
node scripts/rea.mjs inspect-android-method /absolute/path/application.apk com.example.MainActivity onCreate
node scripts/rea.mjs trace-android-references /absolute/path/application.apk com.example.MainActivity
```

MCP セッションを使用しない限り、各コマンドは独立して実行されます。

<a id="how-it-works"></a>

## 仕組み

エージェントは MCP 経由で REA:Reverse Engineer Android を呼び出し、同じ
ワークフローを CLI からも利用できます。サービスは選択した APK または
デバイスを調査し、クラス、メソッド、リソース、参照、ネイティブコードを
追跡して、Evidence とともに結果を返します。

![REA:Reverse Engineer Android 調査フロー](../../website/public/assets/figures/rea-investigation-flow.svg)

静的解析はランタイム動作を証明しません。ランタイムツールは明示的に選択した
デバイス、パッケージ、プロセス、スクリプト、観察ウィンドウにのみ作用します。

<a id="tool-catalog"></a>

## ツールカタログ

既定の MCP カタログには **117 個の Android ツール** が含まれます。

| Family        | 範囲                                                                             |
| ------------- | -------------------------------------------------------------------------------- |
| `android`     | APK パッケージ、manifest、クラス、メソッド、参照、JNI バインディング             |
| `apktool`     | Apktool の準備状態と Android リソースのデコード                                  |
| `artifact`    | APK/アーカイブインベントリ、制御された抽出、APK 署名検査                         |
| `flutter`     | Flutter ビルド識別と Dart AOT 検査                                               |
| `adb`         | デバイス、パッケージ、ファイル、ログ、プロセス、アプリライフサイクル、明示的変更 |
| `frida`       | デバイス/プロセス探索、スクリプト、セッション、クリーンアップ                    |
| `jeb`         | JEB クライアント、プロジェクト、unit、デコンパイル                               |
| `native`      | ELF notes、ネイティブ export、ELF layout、byte entropy                           |
| `direct`      | Ghidra と IDA の headless ネイティブ分析                                         |
| `enhanced`    | 関数 dossier、call graph、バッチデコンパイル、ネイティブトレース                 |
| `application` | Android ガイダンス、analysis view/settings、アプリグラフ                         |
| `session`     | バイナリライフサイクル、Evidence bundle、比較、unknown、Android/native context   |

`REA_MCP_TOOL_FAMILIES` でカタログを絞り込めます。無効または削除済みの
family id はサーバー起動を停止させます。

MCP は既定で compact input schema を使用します。完全なフィールド説明が必要な場合は
`REA_MCP_INPUT_SCHEMA_PROFILE=full` を設定します。

<a id="what-you-can-analyze"></a>

## 分析対象

| 対象                 | 返す内容                                                                      | 要件とガイド                                                             |
| -------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Android APK          | パッケージ、SDK、権限、manifest、クラス、メソッド、参照、JNI、デコンパイル    | JADX MCP JAR 0.7.1 と完全な JDK 17+; [Android](../android-analysis.md)   |
| APK 署名             | v1/v2/v3/v3.1、証明書、キーローテーション、source stamp、digest 整合性        | 組み込み静的検査; [署名](../apk-signature.md)                            |
| Android デバイス     | デバイス、パッケージ、プロセス、ログ、ファイル、スクリーンショット、bugreport | 利用者の `adb`; [ADB](../adb-device-analysis.md)                         |
| Android リソース     | デコード済み manifest、メタデータ、文字列テーブル、locale、カバレッジ         | Apktool 2.7.0+; [Apktool](../apktool-resource-analysis.md)               |
| Flutter アプリ       | Dart snapshot hash、ABI 別 digest、engine provenance                          | 組み込み APK 解析; [Flutter](../flutter-analysis.md)                     |
| JEB プロジェクト     | unit、digest、型/メソッド pseudo-code                                         | `REA_JEB_MCP_URL` で接続する JEB クライアント; [JEB](../jeb-analysis.md) |
| Android ランタイム   | Frida デバイス/プロセス探索、script、message、session、cleanup                | 利用者提供の Frida と Android 対象; [Frida](../frida-instrumentation.md) |
| ネイティブライブラリ | ELF、export、pseudo-code、assembly、caller、reference、CFG、dossier           | Ghidra または IDA; [ネイティブ分析](../native-investigation.md)          |
| APK インベントリ     | メンバー、digest、整合性、抽出、アプリケーショングラフ                        | 組み込みアーカイブ検査                                                   |

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

Android 専用サーバーは browser、Electron、単独の JavaScript、Apple、HarmonyOS、
desktop、firmware、managed .NET、RL 環境、その他の非 Android family を
登録しません。SQLite、保存済み packet capture、process/crash evidence、
devicetree、raw binary、kernel module、旧来の native architecture は
サポート文書として残り、公開 MCP family を追加しません。

<a id="deep-analysis-providers"></a>

## 深い分析プロバイダー

Android APK コードは `src/android/` を通して利用者提供の headless JADX を
使用します。準備状態の検査は、任意の APK をデコードできることを保証しません。

ネイティブ `.so` 分析には Ghidra または IDA を使用します。

```sh
node scripts/rea.mjs analyze /absolute/path/libexample.so --provider-id ghidra
node scripts/rea.mjs decompile /absolute/path/libexample.so \
  --procedure Java_com_example_Native_run --provider-id ghidra
```

`doctor --provider ghidra`、`--provider ida`、`--provider jadx` で設定を
確認できます。Hopper と Kuna は登録されません。

### 静的 APK 検査

```sh
node scripts/rea.mjs inspect-android-package /absolute/path/application.apk
node scripts/rea.mjs inspect-android-jni-bindings /absolute/path/application.apk
node scripts/rea.mjs inspect-apk-signature /absolute/path/application.apk
node scripts/rea.mjs decode-android-resources /absolute/path/application.apk
node scripts/rea.mjs identify-flutter-build /absolute/path/application.apk
```

R8/ProGuard ビルドでは絶対 `mapping_path` を渡します。

```sh
node scripts/rea.mjs inspect-android-class /absolute/path/application.apk \
  a.b --mapping-path /absolute/path/mapping.txt --detail summary \
  --evidence_output /absolute/path/class-evidence.json
```

mapping annotation は観測された DEX 名と分離され、そのファイルが APK build に
属するかは検証されません。

### デバイスとランタイム

```sh
node scripts/rea.mjs list-adb-devices
node scripts/rea.mjs inspect-adb-device emulator-5554
node scripts/rea.mjs list-adb-packages emulator-5554
node scripts/rea.mjs pull-adb-package emulator-5554 com.example
node scripts/rea.mjs read-adb-logcat emulator-5554
node scripts/rea.mjs list-adb-processes emulator-5554
```

明示的な変更:

```sh
node scripts/rea.mjs install-adb-package emulator-5554 /absolute/path/application.apk
node scripts/rea.mjs start-adb-app emulator-5554 com.example
node scripts/rea.mjs stop-adb-app emulator-5554 com.example
node scripts/rea.mjs uninstall-adb-package emulator-5554 com.example
```

Frida:

```sh
node scripts/rea.mjs list-frida-devices
node scripts/rea.mjs list-frida-processes --device-id emulator-5554
node scripts/rea.mjs instrument-with-frida \
  --device-id emulator-5554 --pid 1234 --script-file /absolute/path/hook.js
```

Frida script は対象のメモリや動作を読み取り、変更できます。session を閉じると
instrumentation は解除されますが、対象は終了しません。

## Evidence と制限

結果は観察、導出、推論、unknown を区別します。Evidence は対象、provider、
source、coverage、limitation、ID を保持します。

静的解析は runtime 実行を証明しません。クラス名、manifest 宣言、native export、
JNI 候補は artifact に関する事実であり、runtime load の証拠ではありません。
動的読み込み、reflection、間接呼び出し、未観察状態は unknown のままです。

`record_unknown` で未解決の質問を保持し、session 終了後も完全な Evidence が
必要な場合は `export_evidence_bundle` を使用します。

<a id="set-up-your-agent"></a>

## エージェント設定

```sh
node scripts/rea.mjs setup
node scripts/rea.mjs doctor --client codex --json
node scripts/rea.mjs mcp
```

手動 stdio 登録:

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

無関係な設定とバックアップを保持します。

## 更新

このフォークは upstream npm パッケージから更新しません。`rea update` は
source-managed 状態のみを報告します。

```sh
npm ci
npm run build:cached
```

その後クライアントを再接続します。詳細は
[Android fork maintenance](../fork-maintenance.md) と
[upstream-sync.json](../../upstream-sync.json) を参照してください。

<a id="faq"></a>

## FAQ

<details>
<summary><strong>Do Unity, Godot, React Native, Hermes, Go, or Rust mentions add MCP tools?</strong></summary>

No. They are Android support-analysis records. The public catalog remains limited to the documented Android families; adding a family or tool requires a new scope decision, contract, tests, and provider verification. See [MCP contracts](../mcp-contracts.md#tool-families).

</details>

<details>
<summary><strong>ローカル checkout から実行できますか？</strong></summary>

はい。`npm run build:cached` を実行し、その後 `node scripts/rea.mjs` を使用します。

</details>

<details>
<summary><strong>npm から更新されますか？</strong></summary>

いいえ。`rea update` は source-managed で、upstream パッケージをインストールしません。

</details>

<details>
<summary><strong>どのネイティブエンジンをサポートしますか？</strong></summary>

Ghidra または IDA です。Hopper と Kuna は登録されません。

</details>

<details>
<summary><strong>APK はアップロードされますか？</strong></summary>

分析はローカルで実行されます。エージェントが結果を受け取り、モデルプロバイダーは
独自のデータポリシーに従います。

</details>

<a id="documentation"></a>

## ドキュメント

- [Android content audit](../maintenance/android-content-audit.json): per-path restoration and deletion decisions.

- [Android サポート分析](../android-system-images.md)、[多言語ライブラリ](../android-cross-language-libraries.md)、[SQLite データベース](../sqlite-databases.md)、[パケットキャプチャ](../packet-captures.md)、[プロセスキャプチャ](../process-capture.md)、[クラッシュ記録](../recorded-crashes.md)：公開 MCP family を追加しないサポート文書です。

- [インストール](../installation.md)
- [CLI と Evidence](../cli.md)
- [MCP 契約](../mcp-contracts.md) と [prompt](../mcp-prompts.md)
- [Android APK 分析](../android-analysis.md)
- [ADB](../adb-device-analysis.md)
- [Android リソース](../apktool-resource-analysis.md)
- [APK 署名](../apk-signature.md)
- [Flutter](../flutter-analysis.md)
- [JEB](../jeb-analysis.md)
- [Frida](../frida-instrumentation.md)
- [ネイティブ分析](../native-investigation.md)
- [テスト](../testing.md) と [architecture](../architecture.mermaid)

脆弱性は [SECURITY.md](../../SECURITY.md) に従って報告してください。

## 免責事項

[DISCLAIMER.md](../../DISCLAIMER.md) を参照してください。このプロジェクトは、
所有しているか調査を許可されたソフトウェアの合法的な研究、教育、相互運用性、
分析を目的とします。

IDA や JEB などの提供された engine と tool は、利用者が合法的に取得し、
それぞれの規約を遵守する必要があります。このプロジェクトはライセンス、キー、
アクティベーション権を提供しません。

## コントリビューション

[CONTRIBUTING.md](../../CONTRIBUTING.md)、[テスト](../testing.md)、
[architecture](../architecture.mermaid) を参照してください。

## ライセンス

[MIT](../../LICENSE)

このフォークのコードは MIT です。third-party material はそれぞれのライセンスを
維持します。[THIRD_PARTY_NOTICES.md](../../THIRD_PARTY_NOTICES.md) を参照してください。
