<div align="center">

[English](../../README.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [Français](README_fr.md) · **Deutsch** · [Português (Brasil)](README_pt-BR.md) · [Español](README_es.md) · [한국어](README_ko.md) · [日本語](README_ja.md)

# REA:Reverse Engineer Android

### Ein MCP für Reverse Engineering von Android-Apps.

**APKs untersuchen, Verhalten bis in nativen Code verfolgen und die Evidenz hinter jeder Aussage erhalten.**

[![MCP-Tool-Katalog](https://img.shields.io/badge/MCP-117_Android_tools-5c4ee5?style=flat-square)](#tool-catalog)
[![Node.js-Anforderungen](https://img.shields.io/badge/Node.js-24.22.1-339933?style=flat-square&logo=nodedotjs&logoColor=white)](#requirements)
[![MIT-Lizenz](https://img.shields.io/badge/license-MIT-f4c430?style=flat-square)](../../LICENSE)

[Schnellstart](#quick-start) · [Funktionsweise](#how-it-works) · [Unterstützte Ziele](#what-you-can-analyze) · [Provider](#deep-analysis-providers) · [Agent einrichten](#set-up-your-agent) · [FAQ](#faq) · [Dokumentation](#documentation)

<code>node scripts/rea.mjs setup</code>

</div>

> [!IMPORTANT]
> Dieses Repository ist ein Android-only-Hard-Fork von
> [morluto/rea](https://github.com/morluto/rea), basierend auf REA 6.8.0.
> Es ist für den lokalen Source-Checkout ausgelegt und aktualisiert sich nicht
> aus dem öffentlichen `rea-agents`-npm-Paket.

---

REA:Reverse Engineer Android verbindet einen Agenten mit lokalen Werkzeugen
für Android-APKs, Gerätezustand, Laufzeitverhalten, Ressourcen und native
Bibliotheken. Dieselben Workflows stehen über MCP und das Terminal bereit.

Der Fork behält die Kennungen `rea`, `rea-agents` und
`reverse-engineer-anything` für die Installationskompatibilität. Skill,
Serveranweisungen, CLI und MCP-Katalog sind Android-only.

Die Analyse läuft lokal. Ergebnisse behalten Evidence, Provider-Identität,
Abdeckung, Einschränkungen und offene Punkte.

<a id="quick-start"></a>

## Schnellstart

<a id="requirements"></a>

### Anforderungen

REA:Reverse Engineer Android verwendet die in [.nvmrc](../../.nvmrc)
festgelegte Node.js-Version. Abhängigkeiten installieren:

```sh
npm ci
```

Für statische APK-Analyse werden ein vollständiges JDK 17 oder neuer und das
vom Aufrufer bereitgestellte `jadx-headless-mcp-0.7.1-all.jar` benötigt.
Auswahl über `REA_JADX_MCP_JAR`; Java bei Bedarf über `JAVA_HOME`.

Geräte-Workflows benötigen ein vom Aufrufer bereitgestelltes `adb`.
Verwenden Sie `REA_ADB_PATH` oder nehmen Sie `adb` in `PATH` auf.

Ressourcendekodierung benötigt Apktool 2.7.0 oder neuer. Verwenden Sie
`REA_APKTOOL_COMMAND` oder `apktool` in `PATH`.

Native Bibliotheken werden mit einem vorhandenen Ghidra oder IDA analysiert.
JEB und Frida bleiben vom Aufrufer bereitgestellte Werkzeuge.

REA:Reverse Engineer Android installiert oder aktualisiert Java, JADX, ADB,
Apktool, Ghidra, IDA, JEB und Frida nicht.

### Lokale Laufzeit bauen

```sh
npm run build:cached
node scripts/rea.mjs --help
```

Windows-JADX- und Ghidra-Workflows verwenden die nativen x64-Steuerelemente
unter `native/windows/build/`. Details:
[native/windows/README.md](../../native/windows/README.md).

### Agent einrichten

```sh
node scripts/rea.mjs setup
```

Agenten auswählen, Änderungen prüfen und freigeben. Setup fügt den lokalen
REA:Reverse Engineer Android-Server hinzu, installiert den Android-only-Skill
und sichert bestehende Konfigurationen.

Der lokale Launcher ist `scripts/rea.mjs`. Für explizite Client-Befehle den
absoluten Pfad und denselben Node.js-Runtime verwenden.

### Agent fragen

```text
Untersuche diese APK, erkläre den Login-Flow und zeige die Evidenz.
Verfolge die Funktion bei Bedarf bis in native Bibliotheken.
```

### Terminal verwenden

```sh
node scripts/rea.mjs inspect-android-package /absolute/path/application.apk
node scripts/rea.mjs search-android-classes /absolute/path/application.apk MainActivity
node scripts/rea.mjs inspect-android-class /absolute/path/application.apk com.example.MainActivity
node scripts/rea.mjs inspect-android-method /absolute/path/application.apk com.example.MainActivity onCreate
node scripts/rea.mjs trace-android-references /absolute/path/application.apk com.example.MainActivity
```

Jeder Befehl ist isoliert, sofern keine MCP-Sitzung verwendet wird.

<a id="how-it-works"></a>

## Funktionsweise

Der Agent ruft REA:Reverse Engineer Android über MCP auf; dieselben Workflows
sind über die CLI verfügbar. Der Dienst untersucht APK oder Gerät, verfolgt
Klassen, Methoden, Ressourcen, Referenzen und nativen Code und liefert
Ergebnisse mit Evidence.

![REA:Reverse Engineer Android Untersuchungsfluss](../../website/public/assets/figures/rea-investigation-flow.svg)

Statische Analyse beweist kein Laufzeitverhalten. Runtime-Werkzeuge wirken nur
auf das explizit gewählte Gerät, Paket, Prozess, Skript und Beobachtungsfenster.

<a id="tool-catalog"></a>

## Tool-Katalog

Der Standard-MCP-Katalog enthält **117 Android-Werkzeuge**:

| Family        | Abdeckung                                                                     |
| ------------- | ----------------------------------------------------------------------------- |
| `android`     | APK-Paket, Manifest, Klassen, Methoden, Referenzen und JNI-Bindings           |
| `apktool`     | Apktool-Bereitschaft und Android-Ressourcen                                   |
| `artifact`    | APK-/Archivinventar, kontrollierte Extraktion und APK-Signaturen              |
| `flutter`     | Flutter-Build-Identifikation und Dart-AOT                                     |
| `adb`         | Geräte, Pakete, Dateien, Logs, Prozesse, Lifecycle und explizite Mutationen   |
| `frida`       | Geräte-/Prozesssuche, Instrumentierung, Sitzungen und Cleanup                 |
| `jeb`         | JEB-Client, Projekte, Units und Dekompilierung                                |
| `native`      | ELF Notes, native Exporte, ELF-Layout und Entropie                            |
| `direct`      | Headless-Ghidra- und IDA-Operationen                                          |
| `enhanced`    | Funktionsdossiers, Aufrufgraphen, Batch-Dekompilierung und Traces             |
| `application` | Android-Hinweise, Analyseansichten/-einstellungen und App-Graph               |
| `session`     | Lifecycle, Evidence-Bundles, Vergleiche, Unknowns und Android-/Native-Kontext |

`REA_MCP_TOOL_FAMILIES` kann den Katalog einschränken. Ein entfernter oder
ungültiger Family-Identifier verhindert den Serverstart.

MCP verwendet standardmäßig kompakte Eingabeschemata. Für vollständige
Feldhinweise `REA_MCP_INPUT_SCHEMA_PROFILE=full` setzen.

<a id="what-you-can-analyze"></a>

## Unterstützte Ziele

| Ziel                | Ergebnis                                                                        | Voraussetzungen und Guide                                                       |
| ------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Android APKs        | Paket, SDK, Berechtigungen, Manifest, Klassen, Methoden, Referenzen, JNI        | JADX MCP JAR 0.7.1 und vollständiges JDK 17+; [Android](../android-analysis.md) |
| APK-Signaturen      | v1/v2/v3/v3.1, Zertifikate, Key-Rotation, Source Stamp und Digest-Konsistenz    | Eingebaute statische Prüfung; [Signaturen](../apk-signature.md)                 |
| Android-Geräte      | Geräte, Pakete, Prozesse, Logs, Dateien, Screenshots, Bugreports und Mutationen | Aufrufer-`adb`; [ADB](../adb-device-analysis.md)                                |
| Android-Ressourcen  | Dekodiertes Manifest, Metadaten, Sprachstrings und Abdeckung                    | Apktool 2.7.0+; [Apktool](../apktool-resource-analysis.md)                      |
| Flutter-Apps        | Dart-Snapshot-Hashes, ABI-Library-Digests und Engine-Herkunft                   | Eingebaute APK-Analyse; [Flutter](../flutter-analysis.md)                       |
| JEB-Projekte        | Units, Digests und Pseudo-Code                                                  | Gestarteter JEB-Client über `REA_JEB_MCP_URL`; [JEB](../jeb-analysis.md)        |
| Android Runtime     | Frida-Geräte/Prozesse, Skripte, Nachrichten und Bereinigung                     | Frida und Android-Ziel; [Frida](../frida-instrumentation.md)                    |
| Native Bibliotheken | ELF, Exporte, Pseudo-Code, Assembly, Aufrufe, Referenzen und CFG                | Ghidra oder IDA; [Native Analyse](../native-investigation.md)                   |
| APK-Archiv          | Mitglieder, Digests, Integrität, Extraktion und App-Graph                       | Eingebaute Archivprüfung                                                        |

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

Der Android-only-Server registriert keine Browser-, Electron-, eigenständigen
JavaScript-, Apple-, HarmonyOS-, Desktop-, Firmware-, Managed-.NET-, RL- oder
sonstigen Nicht-Android-Familien. SQLite, gespeicherte Paketaufzeichnungen,
Prozess-/Crash-Evidence, Devicetree, Raw-Binary, Kernel-Module und ältere
Native-Architekturen bleiben Support-Dokumentation ohne neue MCP-Familie.

<a id="deep-analysis-providers"></a>

## Analyse-Provider

Android-APK-Code verwendet einen aufruferbereitgestellten Headless-JADX über
`src/android/`. Verfügbarkeit prüft das JAR, garantiert aber nicht die
Dekodierung jeder APK.

Native `.so`-Analyse verwendet Ghidra oder IDA:

```sh
node scripts/rea.mjs analyze /absolute/path/libexample.so --provider-id ghidra
node scripts/rea.mjs decompile /absolute/path/libexample.so \
  --procedure Java_com_example_Native_run --provider-id ghidra
```

Prüfen Sie Provider mit `doctor --provider ghidra`, `--provider ida` oder
`--provider jadx`. Hopper und Kuna werden nicht registriert.

### Statische APK-Prüfung

```sh
node scripts/rea.mjs inspect-android-package /absolute/path/application.apk
node scripts/rea.mjs inspect-android-jni-bindings /absolute/path/application.apk
node scripts/rea.mjs inspect-apk-signature /absolute/path/application.apk
node scripts/rea.mjs decode-android-resources /absolute/path/application.apk
node scripts/rea.mjs identify-flutter-build /absolute/path/application.apk
```

Für R8-/ProGuard-Builds einen absoluten `mapping_path` übergeben:

```sh
node scripts/rea.mjs inspect-android-class /absolute/path/application.apk \
  a.b --mapping-path /absolute/path/mapping.txt --detail summary \
  --evidence_output /absolute/path/class-evidence.json
```

Mapping-Annotationen bleiben von beobachteten DEX-Namen getrennt. Die Zugehörigkeit
des Mappings zum APK-Build wird nicht verifiziert.

### Geräte- und Runtime-Workflows

```sh
node scripts/rea.mjs list-adb-devices
node scripts/rea.mjs inspect-adb-device emulator-5554
node scripts/rea.mjs list-adb-packages emulator-5554
node scripts/rea.mjs pull-adb-package emulator-5554 com.example
node scripts/rea.mjs read-adb-logcat emulator-5554
node scripts/rea.mjs list-adb-processes emulator-5554
```

Explizite Mutationen:

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

Frida-Skripte können Speicher und Verhalten des Ziels lesen oder verändern.
Das Schließen einer Sitzung entfernt die Instrumentierung, ohne das Ziel zu töten.

## Evidence und Grenzen

Ergebnisse unterscheiden Beobachtungen, Ableitungen, Schlussfolgerungen und
Unknowns. Evidence behält Ziel, Provider, Quellen, Abdeckung, Grenzen und IDs.

Statische Analyse beweist keine Runtime-Ausführung. Klassennamen,
Manifestdeklarationen, native Exporte und JNI-Kandidaten sind Fakten über das
Artefakt, kein Nachweis eines Ladevorgangs. Dynamisches Laden, Reflection,
indirekte Aufrufe und unbeobachteter Gerätezustand bleiben unbekannt.

`record_unknown` speichert offene Fragen, `export_evidence_bundle` bewahrt
vollständige Evidence über die Sitzung hinaus.

<a id="set-up-your-agent"></a>

## Agent einrichten

```sh
node scripts/rea.mjs setup
node scripts/rea.mjs doctor --client codex --json
node scripts/rea.mjs mcp
```

Manuelle stdio-Registrierung:

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

Unbeteiligte Einstellungen und Backups erhalten.

## Aktualisierung

Der Fork aktualisiert sich nicht aus dem Upstream-npm-Paket. `rea update`
zeigt nur den source-managed Status.

```sh
npm ci
npm run build:cached
```

Danach den Client neu verbinden. Siehe
[Android fork maintenance](../fork-maintenance.md) und
[upstream-sync.json](../../upstream-sync.json).

<a id="faq"></a>

## FAQ

<details>
<summary><strong>Do Unity, Godot, React Native, Hermes, Go, or Rust mentions add MCP tools?</strong></summary>

No. They are Android support-analysis records. The public catalog remains limited to the documented Android families; adding a family or tool requires a new scope decision, contract, tests, and provider verification. See [MCP contracts](../mcp-contracts.md#tool-families).

</details>

<details>
<summary><strong>Kann ich aus dem lokalen Checkout ausführen?</strong></summary>

Ja. `npm run build:cached` ausführen und danach `node scripts/rea.mjs` verwenden.

</details>

<details>
<summary><strong>Aktualisiert sich das Projekt über npm?</strong></summary>

Nein. `rea update` ist source-managed und installiert nicht das Upstream-Paket.

</details>

<details>
<summary><strong>Welche nativen Engines werden unterstützt?</strong></summary>

Ghidra oder IDA. Hopper und Kuna werden nicht registriert.

</details>

<details>
<summary><strong>Wird meine APK hochgeladen?</strong></summary>

Die Analyse läuft lokal. Der Agent erhält die Ergebnisse; der Modellanbieter
unterliegt seiner eigenen Datenrichtlinie.

</details>

<a id="documentation"></a>

## Dokumentation

- [Android content audit](../maintenance/android-content-audit.json): per-path restoration and deletion decisions.

- [Android-Unterstützungsanalyse](../android-system-images.md), [sprachübergreifende Bibliotheken](../android-cross-language-libraries.md), [SQLite-Datenbanken](../sqlite-databases.md), [Paketaufzeichnungen](../packet-captures.md), [Prozessaufzeichnung](../process-capture.md) und [Absturzprotokolle](../recorded-crashes.md): Support-Dokumentation ohne neue öffentliche MCP-Familie.

- [Installation](../installation.md)
- [CLI und Evidence](../cli.md)
- [MCP-Verträge](../mcp-contracts.md) und [Prompts](../mcp-prompts.md)
- [Android-APK-Analyse](../android-analysis.md)
- [ADB-Analyse](../adb-device-analysis.md)
- [Android-Ressourcen](../apktool-resource-analysis.md)
- [APK-Signaturen](../apk-signature.md)
- [Flutter](../flutter-analysis.md)
- [JEB](../jeb-analysis.md)
- [Frida](../frida-instrumentation.md)
- [Native Analyse](../native-investigation.md)
- [Tests](../testing.md) und [Architektur](../architecture.mermaid)

Sicherheitsprobleme über [SECURITY.md](../../SECURITY.md) melden.

## Haftungsausschluss

Siehe [DISCLAIMER.md](../../DISCLAIMER.md). Das Projekt ist für rechtmäßige
Forschung, Bildung, Interoperabilität und Analyse von Software bestimmt, die
Ihnen gehört oder deren Prüfung erlaubt ist.

Für bereitgestellte Engines und kommerzielle Werkzeuge wie IDA und JEB müssen
Sie selbst eine gültige Lizenz erwerben. Das Projekt gewährt keine Lizenz,
keinen Schlüssel und kein Aktivierungsrecht.

## Mitwirken

Siehe [CONTRIBUTING.md](../../CONTRIBUTING.md), [Tests](../testing.md) und
[Architektur](../architecture.mermaid).

## Lizenz

[MIT](../../LICENSE)

Der Code dieses Forks steht unter MIT. Drittanbieterinhalte behalten ihre
Lizenzen. Siehe [THIRD_PARTY_NOTICES.md](../../THIRD_PARTY_NOTICES.md).
