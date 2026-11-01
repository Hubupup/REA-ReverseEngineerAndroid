<div align="center">

[English](../../README.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [Français](README_fr.md) · [Deutsch](README_de.md) · [Português (Brasil)](README_pt-BR.md) · [Español](README_es.md) · **한국어** · [日本語](README_ja.md)

# REA:Reverse Engineer Android

### Android 애플리케이션 리버스 엔지니어링을 위한 MCP

**APK를 검사하고, 동작을 네이티브 코드까지 추적하며, 모든 결론의 근거를 보존합니다.**

[![MCP 도구 카탈로그](https://img.shields.io/badge/MCP-117_Android_tools-5c4ee5?style=flat-square)](#tool-catalog)
[![Node.js 요구 사항](https://img.shields.io/badge/Node.js-24.22.1-339933?style=flat-square&logo=nodedotjs&logoColor=white)](#requirements)
[![MIT 라이선스](https://img.shields.io/badge/license-MIT-f4c430?style=flat-square)](../../LICENSE)

[빠른 시작](#quick-start) · [작동 방식](#how-it-works) · [분석 대상](#what-you-can-analyze) · [제공자 설정](#deep-analysis-providers) · [에이전트 설정](#set-up-your-agent) · [FAQ](#faq) · [문서](#documentation)

<code>node scripts/rea.mjs setup</code>

</div>

> [!IMPORTANT]
> 이 저장소는 [morluto/rea](https://github.com/morluto/rea)의 Android 전용
> 하드 포크이며 REA 6.8.0을 기반으로 합니다. 현재 로컬 소스 체크아웃에서
> 빌드하고 실행하도록 설계되었으며 공개 `rea-agents` npm 패키지에서
> 업데이트하지 않습니다.

---

REA:Reverse Engineer Android는 에이전트를 로컬 도구에 연결하여 Android APK,
기기 상태, 런타임 동작, 리소스 및 네이티브 라이브러리를 검사합니다. 동일한
워크플로는 MCP 서버와 터미널에서 모두 사용할 수 있습니다.

이 포크는 설치 호환성을 위해 `rea`, `rea-agents`,
`reverse-engineer-anything` 식별자를 유지합니다. 번들 skill, 서버 지침,
CLI 명령 및 MCP 카탈로그는 Android 전용입니다.

분석은 로컬에서 실행되며 결과에는 Evidence, 제공자, 커버리지, 제한 및
알 수 없는 항목이 유지됩니다.

<a id="quick-start"></a>

## 빠른 시작

<a id="requirements"></a>

### 요구 사항

REA:Reverse Engineer Android는 [.nvmrc](../../.nvmrc)에 고정된 Node.js
버전을 사용합니다. 의존성을 설치합니다.

```sh
npm ci
```

정적 APK 분석에는 전체 JDK 17 이상과 호출자가 제공하는
`jadx-headless-mcp-0.7.1-all.jar`가 필요합니다. JAR은 `REA_JADX_MCP_JAR`로,
Java는 필요할 때 `JAVA_HOME`으로 선택합니다.

기기 워크플로에는 호출자가 제공하는 `adb`가 필요합니다.
`REA_ADB_PATH`를 사용하거나 `adb`를 `PATH`에 추가합니다.

리소스 디코딩에는 Apktool 2.7.0 이상이 필요합니다.
`REA_APKTOOL_COMMAND`를 사용하거나 `apktool`을 `PATH`에 추가합니다.

네이티브 라이브러리 분석에는 기존 Ghidra 또는 IDA를 사용합니다. JEB와
Frida는 호출자가 제공합니다.

REA:Reverse Engineer Android는 Java, JADX, ADB, Apktool, Ghidra, IDA,
JEB 또는 Frida를 설치하거나 업그레이드하지 않습니다.

### 로컬 런타임 빌드

```sh
npm run build:cached
node scripts/rea.mjs --help
```

Windows JADX 및 Ghidra 워크플로는 `native/windows/build/` 아래의 Windows
x64 네이티브 컨트롤을 사용합니다. 자세한 내용은
[native/windows/README.md](../../native/windows/README.md)를 참조하세요.

### 에이전트 설정

```sh
node scripts/rea.mjs setup
```

사용할 에이전트를 선택하고 변경 사항을 검토한 뒤 승인합니다. Setup은 로컬
REA:Reverse Engineer Android 서버를 추가하고 Android 전용 skill을 설치하며
기존 구성을 백업합니다.

로컬 실행기는 `scripts/rea.mjs`입니다. 클라이언트에 명시적 명령이 필요하면
절대 경로와 동일한 Node.js 런타임을 사용합니다.

### 에이전트에게 요청

```text
이 APK를 검사하고 로그인 흐름이 어떻게 동작하는지 설명하며 증거를 보여줘.
필요하면 네이티브 라이브러리까지 추적해줘.
```

### 터미널 사용

```sh
node scripts/rea.mjs inspect-android-package /absolute/path/application.apk
node scripts/rea.mjs search-android-classes /absolute/path/application.apk MainActivity
node scripts/rea.mjs inspect-android-class /absolute/path/application.apk com.example.MainActivity
node scripts/rea.mjs inspect-android-method /absolute/path/application.apk com.example.MainActivity onCreate
node scripts/rea.mjs trace-android-references /absolute/path/application.apk com.example.MainActivity
```

MCP 세션을 사용하지 않는 한 각 명령은 독립적으로 실행됩니다.

<a id="how-it-works"></a>

## 작동 방식

에이전트는 MCP를 통해 REA:Reverse Engineer Android를 호출하고, 동일한
워크플로는 CLI에서도 사용할 수 있습니다. 서비스는 선택한 APK 또는 기기를
검사하고 클래스, 메서드, 리소스, 참조 및 네이티브 코드를 추적한 뒤
Evidence와 함께 결과를 반환합니다.

![REA:Reverse Engineer Android 조사 흐름](../../website/public/assets/figures/rea-investigation-flow.svg)

정적 분석은 런타임 동작을 증명하지 않습니다. 런타임 도구는 명시적으로
선택한 기기, 패키지, 프로세스, 스크립트 및 관찰 범위에만 작용합니다.

<a id="tool-catalog"></a>

## 도구 카탈로그

기본 MCP 카탈로그에는 **117개의 Android 도구**가 포함됩니다.

| Family        | 범위                                                                         |
| ------------- | ---------------------------------------------------------------------------- |
| `android`     | APK 패키지, manifest, 클래스, 메서드, 참조 및 JNI 바인딩                     |
| `apktool`     | Apktool 준비 상태 및 Android 리소스 디코딩                                   |
| `artifact`    | APK/아카이브 인벤토리, 제어된 추출 및 APK 서명 검사                          |
| `flutter`     | Flutter 빌드 식별 및 Dart AOT 검사                                           |
| `adb`         | 기기, 패키지, 파일, 로그, 프로세스, 앱 수명 주기 및 명시적 변경              |
| `frida`       | 기기/프로세스 검색, 스크립트, 세션 및 정리                                   |
| `jeb`         | JEB 클라이언트, 프로젝트, unit 및 디컴파일                                   |
| `native`      | ELF notes, 네이티브 export, ELF layout 및 byte entropy                       |
| `direct`      | Ghidra 및 IDA headless 네이티브 분석                                         |
| `enhanced`    | 함수 dossier, 호출 그래프, 일괄 디컴파일 및 네이티브 추적                    |
| `application` | Android 지침, 분석 view/settings 및 앱 그래프                                |
| `session`     | 바이너리 수명 주기, Evidence bundle, 비교, unknown 및 Android/native context |

`REA_MCP_TOOL_FAMILIES`로 카탈로그를 줄일 수 있습니다. 유효하지 않거나 제거된
family id는 서버 시작을 중단합니다.

MCP는 기본적으로 compact input schema를 사용합니다. 전체 필드 설명이 필요하면
`REA_MCP_INPUT_SCHEMA_PROFILE=full`을 설정합니다.

<a id="what-you-can-analyze"></a>

## 분석 대상

| 대상                | 반환 내용                                                              | 요구 사항 및 가이드                                                           |
| ------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Android APK         | 패키지, SDK, 권한, manifest, 클래스, 메서드, 참조, JNI 및 디컴파일     | JADX MCP JAR 0.7.1 및 전체 JDK 17+; [Android](../android-analysis.md)         |
| APK 서명            | v1/v2/v3/v3.1, 인증서, 키 로테이션, source stamp 및 digest 일관성      | 내장 정적 검사; [서명](../apk-signature.md)                                   |
| Android 기기        | 기기, 패키지, 프로세스, 로그, 파일, 스크린샷, bugreport 및 명시적 변경 | 호출자 `adb`; [ADB](../adb-device-analysis.md)                                |
| Android 리소스      | 디코딩된 manifest, 메타데이터, 문자열 테이블, locale 및 커버리지       | Apktool 2.7.0+; [Apktool](../apktool-resource-analysis.md)                    |
| Flutter 앱          | Dart snapshot hash, ABI별 digest 및 engine provenance                  | 내장 APK parsing; [Flutter](../flutter-analysis.md)                           |
| JEB 프로젝트        | unit, digest 및 타입/메서드 pseudo-code                                | 호출자가 `REA_JEB_MCP_URL`로 시작한 JEB 클라이언트; [JEB](../jeb-analysis.md) |
| Android 런타임      | Frida 기기/프로세스 검색, script, message, session 및 정리             | 호출자 제공 Frida 및 Android 대상; [Frida](../frida-instrumentation.md)       |
| 네이티브 라이브러리 | ELF, export, pseudo-code, assembly, caller, reference, CFG 및 dossier  | Ghidra 또는 IDA; [네이티브 분석](../native-investigation.md)                  |
| APK 인벤토리        | 멤버, digest, 무결성, 추출 및 애플리케이션 그래프                      | 내장 아카이브 검사                                                            |

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

Android 전용 서버는 browser, Electron, 독립 JavaScript, Apple, HarmonyOS,
desktop, firmware, managed .NET, RL 환경 또는 기타 비 Android family를
등록하지 않습니다. SQLite, 저장된 packet capture, process/crash evidence,
devicetree, raw binary, kernel module과 구형 native architecture는 지원
문서로 유지되며 공개 MCP family를 추가하지 않습니다.

<a id="deep-analysis-providers"></a>

## 심층 분석 제공자

Android APK 코드는 `src/android/`를 통해 호출자가 제공하는 headless JADX를
사용합니다. 준비 상태 검사는 모든 APK의 디코딩 성공을 보장하지 않습니다.

네이티브 `.so` 분석은 Ghidra 또는 IDA를 사용합니다.

```sh
node scripts/rea.mjs analyze /absolute/path/libexample.so --provider-id ghidra
node scripts/rea.mjs decompile /absolute/path/libexample.so \
  --procedure Java_com_example_Native_run --provider-id ghidra
```

`doctor --provider ghidra`, `--provider ida` 또는 `--provider jadx`로
제공자를 확인합니다. Hopper와 Kuna는 등록되지 않습니다.

### 정적 APK 검사

```sh
node scripts/rea.mjs inspect-android-package /absolute/path/application.apk
node scripts/rea.mjs inspect-android-jni-bindings /absolute/path/application.apk
node scripts/rea.mjs inspect-apk-signature /absolute/path/application.apk
node scripts/rea.mjs decode-android-resources /absolute/path/application.apk
node scripts/rea.mjs identify-flutter-build /absolute/path/application.apk
```

R8/ProGuard 빌드에는 절대 `mapping_path`를 전달합니다.

```sh
node scripts/rea.mjs inspect-android-class /absolute/path/application.apk \
  a.b --mapping-path /absolute/path/mapping.txt --detail summary \
  --evidence_output /absolute/path/class-evidence.json
```

mapping annotation은 관찰된 DEX 이름과 분리되며, 해당 파일이 APK 빌드에
속하는지는 검증하지 않습니다.

### 기기 및 런타임 워크플로

```sh
node scripts/rea.mjs list-adb-devices
node scripts/rea.mjs inspect-adb-device emulator-5554
node scripts/rea.mjs list-adb-packages emulator-5554
node scripts/rea.mjs pull-adb-package emulator-5554 com.example
node scripts/rea.mjs read-adb-logcat emulator-5554
node scripts/rea.mjs list-adb-processes emulator-5554
```

명시적 변경:

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

Frida script는 대상 메모리와 동작을 읽거나 변경할 수 있습니다. 세션을 닫으면
instrumentation을 해제하지만 대상을 종료하지는 않습니다.

## Evidence 및 제한

결과는 관찰, 도출, 추론 및 unknown을 구분합니다. Evidence는 대상, 제공자,
source, coverage, limitation 및 ID를 보존합니다.

정적 분석은 런타임 실행을 입증하지 않습니다. 클래스 이름, manifest 선언,
native export 및 JNI 후보는 artifact에 대한 사실이며 런타임 로드의 증거가
아닙니다. 동적 로딩, reflection, indirect call 및 관찰되지 않은 상태는
unknown으로 남습니다.

`record_unknown`으로 미해결 질문을 기록하고, 세션 이후에도 완전한 Evidence가
필요하면 `export_evidence_bundle`을 사용합니다.

<a id="set-up-your-agent"></a>

## 에이전트 설정

```sh
node scripts/rea.mjs setup
node scripts/rea.mjs doctor --client codex --json
node scripts/rea.mjs mcp
```

수동 stdio 등록:

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

관련 없는 설정과 백업을 보존합니다.

## 업데이트

이 포크는 upstream npm 패키지에서 업데이트하지 않습니다. `rea update`는
source-managed 상태만 보고합니다.

```sh
npm ci
npm run build:cached
```

그 후 클라이언트를 다시 연결합니다. 자세한 내용은
[Android fork maintenance](../fork-maintenance.md)와
[upstream-sync.json](../../upstream-sync.json)을 참조하세요.

<a id="faq"></a>

## FAQ

<details>
<summary><strong>Do Unity, Godot, React Native, Hermes, Go, or Rust mentions add MCP tools?</strong></summary>

No. They are Android support-analysis records. The public catalog remains limited to the documented Android families; adding a family or tool requires a new scope decision, contract, tests, and provider verification. See [MCP contracts](../mcp-contracts.md#tool-families).

</details>

<details>
<summary><strong>로컬 checkout에서 실행할 수 있나요?</strong></summary>

예. `npm run build:cached`를 실행한 뒤 `node scripts/rea.mjs`를 사용합니다.

</details>

<details>
<summary><strong>npm에서 업데이트되나요?</strong></summary>

아니요. `rea update`는 source-managed이며 upstream 패키지를 설치하지 않습니다.

</details>

<details>
<summary><strong>어떤 네이티브 엔진을 지원하나요?</strong></summary>

Ghidra 또는 IDA입니다. Hopper와 Kuna는 등록되지 않습니다.

</details>

<details>
<summary><strong>내 APK가 업로드되나요?</strong></summary>

분석은 로컬에서 실행됩니다. 에이전트가 결과를 받고 모델 제공자는 자체 데이터
정책을 따릅니다.

</details>

<a id="documentation"></a>

## 문서

- [Android content audit](../maintenance/android-content-audit.json): per-path restoration and deletion decisions.

- [Android 지원 분석](../android-system-images.md), [다국어 라이브러리](../android-cross-language-libraries.md), [SQLite 데이터베이스](../sqlite-databases.md), [패킷 캡처](../packet-captures.md), [프로세스 캡처](../process-capture.md), [충돌 기록](../recorded-crashes.md): 공개 MCP family를 추가하지 않는 지원 문서입니다.

- [설치](../installation.md)
- [CLI 및 Evidence](../cli.md)
- [MCP 계약](../mcp-contracts.md) 및 [prompt](../mcp-prompts.md)
- [Android APK 분석](../android-analysis.md)
- [ADB](../adb-device-analysis.md)
- [Android 리소스](../apktool-resource-analysis.md)
- [APK 서명](../apk-signature.md)
- [Flutter](../flutter-analysis.md)
- [JEB](../jeb-analysis.md)
- [Frida](../frida-instrumentation.md)
- [네이티브 분석](../native-investigation.md)
- [테스트](../testing.md) 및 [architecture](../architecture.mermaid)

취약점은 [SECURITY.md](../../SECURITY.md)에 따라 보고하세요.

## 고지

[DISCLAIMER.md](../../DISCLAIMER.md)를 참조하세요. 이 프로젝트는 소유하거나
검사 권한이 있는 소프트웨어의 합법적인 연구, 교육, 상호 운용성 및 분석을
위한 것입니다.

IDA와 JEB 같은 상용 도구를 포함해 제공되는 엔진과 도구를 합법적으로 취득하고
해당 약관을 준수해야 합니다. 이 프로젝트는 라이선스, 키 또는 활성화 권한을
제공하지 않습니다.

## 기여

[CONTRIBUTING.md](../../CONTRIBUTING.md), [테스트](../testing.md) 및
[architecture](../architecture.mermaid)를 참조하세요.

## 라이선스

[MIT](../../LICENSE)

이 포크의 코드는 MIT입니다. 타사 자료는 자체 라이선스를 유지합니다.
[THIRD_PARTY_NOTICES.md](../../THIRD_PARTY_NOTICES.md)를 참조하세요.
