<div align="center">

[English](../../README.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [Français](README_fr.md) · [Deutsch](README_de.md) · [Português (Brasil)](README_pt-BR.md) · **Español** · [한국어](README_ko.md) · [日本語](README_ja.md)

# REA:Reverse Engineer Android

### Un MCP para ingeniería inversa de aplicaciones Android.

**Inspecciona un APK, sigue su comportamiento hasta el código nativo y conserva la evidencia de cada conclusión.**

[![Catálogo MCP](https://img.shields.io/badge/MCP-117_Android_tools-5c4ee5?style=flat-square)](#tool-catalog)
[![Requisitos de Node.js](https://img.shields.io/badge/Node.js-24.22.1-339933?style=flat-square&logo=nodedotjs&logoColor=white)](#requirements)
[![Licencia MIT](https://img.shields.io/badge/license-MIT-f4c430?style=flat-square)](../../LICENSE)

[Inicio rápido](#quick-start) · [Cómo funciona](#how-it-works) · [Qué puedes analizar](#what-you-can-analyze) · [Proveedores](#deep-analysis-providers) · [Configurar el agente](#set-up-your-agent) · [FAQ](#faq) · [Documentación](#documentation)

<code>node scripts/rea.mjs setup</code>

</div>

> [!IMPORTANT]
> Este repositorio es un hard fork Android-only de
> [morluto/rea](https://github.com/morluto/rea), basado en REA 6.8.0.
> Está diseñado para compilarse y ejecutarse desde este checkout local y no se
> actualiza desde el paquete npm público `rea-agents`.

---

REA:Reverse Engineer Android conecta un agente con herramientas locales para
inspeccionar APK Android, estado del dispositivo, comportamiento en runtime,
recursos y bibliotecas nativas. Los mismos workflows están disponibles por MCP
y por terminal.

El fork conserva los identificadores `rea`, `rea-agents` y
`reverse-engineer-anything` por compatibilidad. El skill, las instrucciones
del servidor, la CLI y el catálogo MCP son Android-only.

El análisis se ejecuta localmente. Los resultados conservan Evidence, proveedor,
cobertura, limitaciones e incógnitas.

<a id="quick-start"></a>

## Inicio rápido

<a id="requirements"></a>

### Requisitos

REA:Reverse Engineer Android usa la versión de Node.js fijada en
[.nvmrc](../../.nvmrc). Instala las dependencias:

```sh
npm ci
```

El análisis estático de APK requiere un JDK completo 17 o superior y el JAR
`jadx-headless-mcp-0.7.1-all.jar` proporcionado por el usuario. Selecciónalo
con `REA_JADX_MCP_JAR` y usa `JAVA_HOME` cuando sea necesario.

Los workflows de dispositivo requieren un `adb` proporcionado por el usuario.
Usa `REA_ADB_PATH` o coloca `adb` en `PATH`.

La decodificación de recursos requiere Apktool 2.7.0 o superior. Usa
`REA_APKTOOL_COMMAND` o coloca `apktool` en `PATH`.

Las bibliotecas nativas usan una instalación existente de Ghidra o IDA. JEB y
Frida los proporciona el usuario.

El proyecto no instala ni actualiza Java, JADX, ADB, Apktool, Ghidra, IDA, JEB
ni Frida.

### Compilar el runtime local

```sh
npm run build:cached
node scripts/rea.mjs --help
```

Los workflows JADX y Ghidra en Windows usan los controles nativos x64 de
`native/windows/build/`. Consulta
[native/windows/README.md](../../native/windows/README.md).

### Configurar el agente

```sh
node scripts/rea.mjs setup
```

Elige los agentes, revisa los cambios propuestos y apruébalos. El setup añade
el servidor local REA:Reverse Engineer Android, instala el skill Android-only
y hace copia de seguridad de la configuración existente.

El launcher local es `scripts/rea.mjs`. Para comandos explícitos en el cliente,
usa la ruta absoluta y el mismo runtime de Node.js.

### Preguntar al agente

```text
Inspecciona este APK, explica cómo funciona el flujo de inicio de sesión y
muestra la evidencia. Sigue la función hasta bibliotecas nativas si hace falta.
```

### Usar la terminal

```sh
node scripts/rea.mjs inspect-android-package /absolute/path/application.apk
node scripts/rea.mjs search-android-classes /absolute/path/application.apk MainActivity
node scripts/rea.mjs inspect-android-class /absolute/path/application.apk com.example.MainActivity
node scripts/rea.mjs inspect-android-method /absolute/path/application.apk com.example.MainActivity onCreate
node scripts/rea.mjs trace-android-references /absolute/path/application.apk com.example.MainActivity
```

Cada comando es aislado salvo cuando usa una sesión MCP.

<a id="how-it-works"></a>

## Cómo funciona

El agente llama a REA:Reverse Engineer Android por MCP; los mismos workflows
están disponibles en la CLI. El servicio inspecciona el APK o dispositivo,
sigue clases, métodos, recursos, referencias y código nativo y devuelve
resultados con Evidence.

![Flujo de investigación de REA:Reverse Engineer Android](../../website/public/assets/figures/rea-investigation-flow.svg)

El análisis estático no prueba comportamiento en runtime. Las herramientas de
runtime solo actúan sobre el dispositivo, paquete, proceso, script y ventana
seleccionados.

<a id="tool-catalog"></a>

## Catálogo de herramientas

El catálogo MCP por defecto contiene **117 herramientas Android**:

| Family        | Cobertura                                                                            |
| ------------- | ------------------------------------------------------------------------------------ |
| `android`     | Paquete APK, manifiesto, clases, métodos, referencias y bindings JNI                 |
| `apktool`     | Preparación de Apktool y decodificación de recursos Android                          |
| `artifact`    | Inventario APK/archivo, extracción controlada y firma APK                            |
| `flutter`     | Identificación Flutter e inspección Dart AOT                                         |
| `adb`         | Dispositivos, paquetes, archivos, logs, procesos, lifecycle y mutaciones explícitas  |
| `frida`       | Descubrimiento de dispositivo/proceso, scripts, sesiones y limpieza                  |
| `jeb`         | Cliente JEB, proyectos, units y descompilación                                       |
| `native`      | Notas ELF, exports nativos, layout ELF y entropía                                    |
| `direct`      | Operaciones nativas headless de Ghidra e IDA                                         |
| `enhanced`    | Dossiers de funciones, call graph, descompilación por lotes y trazas                 |
| `application` | Guía Android, vistas/configuración de análisis y grafo de aplicación                 |
| `session`     | Ciclo de vida, Evidence bundles, comparaciones, incógnitas y contexto Android/native |

`REA_MCP_TOOL_FAMILIES` reduce el catálogo. Un family id inválido impide
iniciar el servidor.

MCP usa schemas de entrada compactos por defecto. Define
`REA_MCP_INPUT_SCHEMA_PROFILE=full` para obtener la guía completa.

<a id="what-you-can-analyze"></a>

## Qué puedes analizar

| Objetivo            | Resultado                                                               | Requisitos y guía                                                                         |
| ------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| APK Android         | Paquete, SDK, permisos, manifiesto, clases, métodos, referencias y JNI  | JADX MCP JAR 0.7.1 y JDK 17+; [Android](../android-analysis.md)                           |
| Firmas APK          | v1/v2/v3/v3.1, certificados, rotación de clave, source stamp y digests  | Inspección estática integrada; [Firmas](../apk-signature.md)                              |
| Dispositivos        | Dispositivos, paquetes, procesos, logs, archivos, capturas y bugreports | `adb` del usuario; [ADB](../adb-device-analysis.md)                                       |
| Recursos Android    | Manifiesto decodificado, metadatos, strings, locales y cobertura        | Apktool 2.7.0+; [Apktool](../apktool-resource-analysis.md)                                |
| Apps Flutter        | Hashes Dart, digests por ABI y procedencia del engine                   | Parseo APK integrado; [Flutter](../flutter-analysis.md)                                   |
| Proyectos JEB       | Units, digests y pseudo-código                                          | Cliente JEB iniciado por el usuario mediante `REA_JEB_MCP_URL`; [JEB](../jeb-analysis.md) |
| Runtime Android     | Descubrimiento Frida, scripts, mensajes, sesiones y limpieza            | Frida y objetivo Android del usuario; [Frida](../frida-instrumentation.md)                |
| Bibliotecas nativas | ELF, exports, pseudo-código, ensamblador, llamadas, referencias y CFG   | Ghidra o IDA; [Análisis nativo](../native-investigation.md)                               |
| Inventario APK      | Miembros, digests, integridad, extracción y grafo de aplicación         | Inspección de archivo integrada                                                           |

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

El servidor Android-only no registra navegador, Electron, JavaScript
independiente, Apple, HarmonyOS, escritorio, firmware, .NET administrado, RL u
otros objetivos. SQLite, capturas de paquetes guardadas, evidencia de
procesos/fallos, devicetree, raw binary, módulos del kernel y arquitecturas
nativas antiguas permanecen como documentación de soporte sin nueva familia MCP.

<a id="deep-analysis-providers"></a>

## Proveedores de análisis profundo

El código APK usa un JADX headless proporcionado por el usuario en
`src/android/`. La comprobación de disponibilidad no garantiza decodificar
cualquier APK.

Las bibliotecas `.so` usan Ghidra o IDA:

```sh
node scripts/rea.mjs analyze /absolute/path/libexample.so --provider-id ghidra
node scripts/rea.mjs decompile /absolute/path/libexample.so \
  --procedure Java_com_example_Native_run --provider-id ghidra
```

Usa `doctor --provider ghidra`, `--provider ida` o `--provider jadx`.
Hopper y Kuna no se registran.

### Inspección estática de APK

```sh
node scripts/rea.mjs inspect-android-package /absolute/path/application.apk
node scripts/rea.mjs inspect-android-jni-bindings /absolute/path/application.apk
node scripts/rea.mjs inspect-apk-signature /absolute/path/application.apk
node scripts/rea.mjs decode-android-resources /absolute/path/application.apk
node scripts/rea.mjs identify-flutter-build /absolute/path/application.apk
```

Para R8/ProGuard, pasa un `mapping_path` absoluto:

```sh
node scripts/rea.mjs inspect-android-class /absolute/path/application.apk \
  a.b --mapping-path /absolute/path/mapping.txt --detail summary \
  --evidence_output /absolute/path/class-evidence.json
```

Las anotaciones de mapping quedan separadas de los nombres DEX observados y no
prueban que el archivo pertenezca al build.

### Dispositivo y runtime

```sh
node scripts/rea.mjs list-adb-devices
node scripts/rea.mjs inspect-adb-device emulator-5554
node scripts/rea.mjs list-adb-packages emulator-5554
node scripts/rea.mjs pull-adb-package emulator-5554 com.example
node scripts/rea.mjs read-adb-logcat emulator-5554
node scripts/rea.mjs list-adb-processes emulator-5554
```

Mutaciones explícitas:

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

Los scripts Frida pueden leer o modificar memoria y comportamiento del objetivo.
Cerrar la sesión quita la instrumentación, pero no mata el objetivo.

## Evidence y límites

Los resultados distinguen observaciones, derivaciones, inferencias e incógnitas.
Evidence conserva objetivo, proveedor, fuentes, cobertura, límites e IDs.

El análisis estático no establece ejecución runtime. Nombres, manifiesto,
exports nativos y candidatos JNI son hechos del artefacto, no prueba de carga.
La carga dinámica, reflexión, llamadas indirectas y estado no observado siguen
siendo desconocidos.

Usa `record_unknown` para preguntas abiertas y `export_evidence_bundle` para
conservar Evidence después de la sesión.

<a id="set-up-your-agent"></a>

## Configurar el agente

```sh
node scripts/rea.mjs setup
node scripts/rea.mjs doctor --client codex --json
node scripts/rea.mjs mcp
```

Registro stdio manual:

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

Conserva configuraciones no relacionadas y copias de seguridad.

## Actualizaciones

El fork no se actualiza desde el paquete npm upstream. `rea update` solo
informa del estado source-managed.

```sh
npm ci
npm run build:cached
```

Reconecta el cliente después. Consulta
[Android fork maintenance](../fork-maintenance.md) y
[upstream-sync.json](../../upstream-sync.json).

<a id="faq"></a>

## FAQ

<details>
<summary><strong>Do Unity, Godot, React Native, Hermes, Go, or Rust mentions add MCP tools?</strong></summary>

No. They are Android support-analysis records. The public catalog remains limited to the documented Android families; adding a family or tool requires a new scope decision, contract, tests, and provider verification. See [MCP contracts](../mcp-contracts.md#tool-families).

</details>

<details>
<summary><strong>¿Puedo ejecutarlo desde el checkout local?</strong></summary>

Sí. Ejecuta `npm run build:cached` y después `node scripts/rea.mjs`.

</details>

<details>
<summary><strong>¿Se actualiza desde npm?</strong></summary>

No. `rea update` es source-managed y no instala el paquete upstream.

</details>

<details>
<summary><strong>¿Qué motores nativos se admiten?</strong></summary>

Ghidra o IDA. Hopper y Kuna no se registran.

</details>

<details>
<summary><strong>¿Se sube mi APK?</strong></summary>

El análisis es local. El agente recibe los resultados y el proveedor del
modelo aplica su propia política de datos.

</details>

<a id="documentation"></a>

## Documentación

- [Android content audit](../maintenance/android-content-audit.json): per-path restoration and deletion decisions.

- [Análisis de soporte de Android](../android-system-images.md), [bibliotecas multilingües](../android-cross-language-libraries.md), [bases de datos SQLite](../sqlite-databases.md), [capturas de paquetes](../packet-captures.md), [captura de procesos](../process-capture.md) y [registros de fallos](../recorded-crashes.md): documentación de soporte que no añade una familia MCP pública.

- [Instalación](../installation.md)
- [CLI y Evidence](../cli.md)
- [Contratos MCP](../mcp-contracts.md) y [prompts](../mcp-prompts.md)
- [Análisis APK](../android-analysis.md)
- [ADB](../adb-device-analysis.md)
- [Recursos Android](../apktool-resource-analysis.md)
- [Firmas APK](../apk-signature.md)
- [Flutter](../flutter-analysis.md)
- [JEB](../jeb-analysis.md)
- [Frida](../frida-instrumentation.md)
- [Análisis nativo](../native-investigation.md)
- [Pruebas](../testing.md) y [arquitectura](../architecture.mermaid)

Reporta vulnerabilidades según [SECURITY.md](../../SECURITY.md).

## Aviso

Consulta [DISCLAIMER.md](../../DISCLAIMER.md). El proyecto es para
investigación, educación, interoperabilidad y análisis legítimos de software
que posees o tienes autorización para examinar.

Debes obtener legalmente los motores y herramientas proporcionados, incluidos
IDA y JEB. El proyecto no concede licencia, clave ni activación.

## Contribuir

Consulta [CONTRIBUTING.md](../../CONTRIBUTING.md), [pruebas](../testing.md) y
[arquitectura](../architecture.mermaid).

## Licencia

[MIT](../../LICENSE)

El código de este fork usa MIT. Los materiales de terceros conservan sus
licencias. Consulta [THIRD_PARTY_NOTICES.md](../../THIRD_PARTY_NOTICES.md).
