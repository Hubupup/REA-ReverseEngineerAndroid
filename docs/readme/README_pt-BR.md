<div align="center">

[English](../../README.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [Français](README_fr.md) · [Deutsch](README_de.md) · **Português (Brasil)** · [Español](README_es.md) · [한국어](README_ko.md) · [日本語](README_ja.md)

# REA:Reverse Engineer Android

### Um MCP para engenharia reversa de aplicativos Android.

**Inspecione um APK, acompanhe o comportamento até o código nativo e preserve a evidência de cada conclusão.**

[![Catálogo MCP](https://img.shields.io/badge/MCP-117_Android_tools-5c4ee5?style=flat-square)](#tool-catalog)
[![Requisito Node.js](https://img.shields.io/badge/Node.js-24.22.1-339933?style=flat-square&logo=nodedotjs&logoColor=white)](#requirements)
[![Licença MIT](https://img.shields.io/badge/license-MIT-f4c430?style=flat-square)](../../LICENSE)

[Início rápido](#quick-start) · [Como funciona](#how-it-works) · [O que analisar](#what-you-can-analyze) · [Provedores](#deep-analysis-providers) · [Configurar agente](#set-up-your-agent) · [FAQ](#faq) · [Documentação](#documentation)

<code>node scripts/rea.mjs setup</code>

</div>

> [!IMPORTANT]
> Este repositório é um hard fork Android-only de
> [morluto/rea](https://github.com/morluto/rea), baseado no REA 6.8.0.
> Ele foi projetado para ser compilado e executado a partir deste checkout
> local e não se atualiza pelo pacote npm público `rea-agents`.

---

REA:Reverse Engineer Android conecta um agente a ferramentas locais para
inspecionar APKs, estado de dispositivos, comportamento em execução, recursos
e bibliotecas nativas. Os mesmos fluxos estão disponíveis por MCP e terminal.

O fork mantém os identificadores `rea`, `rea-agents` e
`reverse-engineer-anything` para compatibilidade de instalação. O skill,
instruções do servidor, CLI e catálogo MCP são Android-only.

Análises executam localmente e os resultados preservam Evidence, provedor,
cobertura, limitações e incógnitas.

<a id="quick-start"></a>

## Início rápido

<a id="requirements"></a>

### Requisitos

REA:Reverse Engineer Android usa a versão Node.js fixada em
[.nvmrc](../../.nvmrc). Instale as dependências:

```sh
npm ci
```

Análise estática de APK requer um JDK completo 17 ou superior e o JAR
`jadx-headless-mcp-0.7.1-all.jar` fornecido pelo chamador. Selecione com
`REA_JADX_MCP_JAR` e, se necessário, use `JAVA_HOME`.

Fluxos de dispositivo requerem um `adb` fornecido pelo chamador. Use
`REA_ADB_PATH` ou coloque `adb` no `PATH`.

Decodificação de recursos requer Apktool 2.7.0 ou superior. Use
`REA_APKTOOL_COMMAND` ou coloque `apktool` no `PATH`.

Bibliotecas nativas usam um Ghidra ou IDA existente. JEB e Frida são
fornecidos pelo chamador.

O projeto não instala nem atualiza Java, JADX, ADB, Apktool, Ghidra, IDA, JEB
ou Frida.

### Compilar o runtime local

```sh
npm run build:cached
node scripts/rea.mjs --help
```

Fluxos JADX e Ghidra no Windows usam os controles nativos x64 em
`native/windows/build/`. Consulte
[native/windows/README.md](../../native/windows/README.md).

### Configurar o agente

```sh
node scripts/rea.mjs setup
```

Escolha os agentes, revise e aprove as alterações. O setup adiciona o servidor
local REA:Reverse Engineer Android, instala o skill Android-only e faz backup
das configurações existentes.

O launcher local é `scripts/rea.mjs`. Para comandos explícitos no cliente,
use o caminho absoluto e o mesmo runtime Node.js usado na compilação.

### Perguntar ao agente

```text
Inspecione este APK, explique o fluxo de login e mostre a evidência.
Siga a funcionalidade até bibliotecas nativas quando necessário.
```

### Usar o terminal

```sh
node scripts/rea.mjs inspect-android-package /absolute/path/application.apk
node scripts/rea.mjs search-android-classes /absolute/path/application.apk MainActivity
node scripts/rea.mjs inspect-android-class /absolute/path/application.apk com.example.MainActivity
node scripts/rea.mjs inspect-android-method /absolute/path/application.apk com.example.MainActivity onCreate
node scripts/rea.mjs trace-android-references /absolute/path/application.apk com.example.MainActivity
```

Cada comando é isolado, exceto quando usa uma sessão MCP.

<a id="how-it-works"></a>

## Como funciona

O agente chama REA:Reverse Engineer Android via MCP; os mesmos fluxos estão
disponíveis na CLI. O serviço inspeciona o APK ou dispositivo, segue classes,
métodos, recursos, referências e código nativo e retorna resultados com Evidence.

![Fluxo de investigação REA:Reverse Engineer Android](../../website/public/assets/figures/rea-investigation-flow.svg)

Análise estática não prova comportamento em execução. Ferramentas de runtime
atuam somente no dispositivo, pacote, processo, script e janela selecionados.

<a id="tool-catalog"></a>

## Catálogo de ferramentas

O catálogo MCP padrão contém **117 ferramentas Android**:

| Family        | Cobertura                                                                             |
| ------------- | ------------------------------------------------------------------------------------- |
| `android`     | Pacote APK, manifesto, classes, métodos, referências e bindings JNI                   |
| `apktool`     | Prontidão do Apktool e decodificação de recursos Android                              |
| `artifact`    | Inventário APK/arquivo, extração controlada e assinatura APK                          |
| `flutter`     | Identificação Flutter e inspeção Dart AOT                                             |
| `adb`         | Dispositivos, pacotes, arquivos, logs, processos, ciclo de vida e mutações explícitas |
| `frida`       | Descoberta de dispositivos/processos, scripts, sessões e limpeza                      |
| `jeb`         | Cliente JEB, projetos, units e descompilação                                          |
| `native`      | Notas ELF, exports nativos, layout ELF e entropia                                     |
| `direct`      | Operações nativas headless Ghidra e IDA                                               |
| `enhanced`    | Dossiês de funções, grafos de chamadas, descompilação em lote e traces                |
| `application` | Orientação Android, views/configurações e grafo da aplicação                          |
| `session`     | Ciclo de vida, Evidence bundles, comparações, incógnitas e contexto Android/native    |

`REA_MCP_TOOL_FAMILIES` reduz o catálogo. Um family id inválido impede a
inicialização do servidor.

MCP usa schemas de entrada compactos por padrão. Defina
`REA_MCP_INPUT_SCHEMA_PROFILE=full` para orientação completa dos campos.

<a id="what-you-can-analyze"></a>

## O que você pode analisar

| Alvo                | Resultado                                                                  | Requisitos e guia                                                                   |
| ------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| APKs Android        | Pacote, SDK, permissões, manifesto, classes, métodos, referências e JNI    | JADX MCP JAR 0.7.1 e JDK 17+; [Android](../android-analysis.md)                     |
| Assinaturas APK     | v1/v2/v3/v3.1, certificados, rotação de chave, source stamp e digests      | Inspeção estática integrada; [Assinaturas](../apk-signature.md)                     |
| Dispositivos        | Dispositivos, pacotes, processos, logs, arquivos, screenshots e bugreports | `adb` do chamador; [ADB](../adb-device-analysis.md)                                 |
| Recursos Android    | Manifesto decodificado, metadados, strings, locales e cobertura            | Apktool 2.7.0+; [Apktool](../apktool-resource-analysis.md)                          |
| Apps Flutter        | Hashes Dart, digests por ABI e proveniência do engine                      | Parsing APK integrado; [Flutter](../flutter-analysis.md)                            |
| Projetos JEB        | Units, digests e pseudo-código                                             | Cliente JEB iniciado pelo chamador via `REA_JEB_MCP_URL`; [JEB](../jeb-analysis.md) |
| Runtime Android     | Descoberta Frida, scripts, mensagens, sessões e limpeza                    | Frida e alvo Android fornecidos pelo chamador; [Frida](../frida-instrumentation.md) |
| Bibliotecas nativas | ELF, exports, pseudo-código, assembly, chamadas, referências e CFG         | Ghidra ou IDA; [Análise nativa](../native-investigation.md)                         |
| Inventário APK      | Membros, digests, integridade, extração e grafo da aplicação               | Inspeção de arquivo integrada                                                       |

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

O servidor Android-only não registra browser, Electron, JavaScript
independente, Apple, HarmonyOS, desktop, firmware, .NET gerenciado, RL ou
outros alvos. SQLite, capturas de pacotes salvas, evidências de
processo/crash, devicetree, raw binary, módulos de kernel e arquiteturas
nativas antigas permanecem como documentação de suporte sem nova família MCP.

<a id="deep-analysis-providers"></a>

## Provedores de análise profunda

Código APK usa um JADX headless fornecido pelo chamador em `src/android/`.
A verificação de prontidão não garante a decodificação de todo APK.

Bibliotecas `.so` usam Ghidra ou IDA:

```sh
node scripts/rea.mjs analyze /absolute/path/libexample.so --provider-id ghidra
node scripts/rea.mjs decompile /absolute/path/libexample.so \
  --procedure Java_com_example_Native_run --provider-id ghidra
```

Use `doctor --provider ghidra`, `--provider ida` ou `--provider jadx`.
Hopper e Kuna não são registrados.

### Inspeção APK estática

```sh
node scripts/rea.mjs inspect-android-package /absolute/path/application.apk
node scripts/rea.mjs inspect-android-jni-bindings /absolute/path/application.apk
node scripts/rea.mjs inspect-apk-signature /absolute/path/application.apk
node scripts/rea.mjs decode-android-resources /absolute/path/application.apk
node scripts/rea.mjs identify-flutter-build /absolute/path/application.apk
```

Para R8/ProGuard, passe um `mapping_path` absoluto:

```sh
node scripts/rea.mjs inspect-android-class /absolute/path/application.apk \
  a.b --mapping-path /absolute/path/mapping.txt --detail summary \
  --evidence_output /absolute/path/class-evidence.json
```

As anotações de mapping ficam separadas dos nomes DEX observados e não provam
que o arquivo pertence ao build.

### Dispositivo e runtime

```sh
node scripts/rea.mjs list-adb-devices
node scripts/rea.mjs inspect-adb-device emulator-5554
node scripts/rea.mjs list-adb-packages emulator-5554
node scripts/rea.mjs pull-adb-package emulator-5554 com.example
node scripts/rea.mjs read-adb-logcat emulator-5554
node scripts/rea.mjs list-adb-processes emulator-5554
```

Mutações explícitas:

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

Scripts Frida podem ler ou alterar memória e comportamento do alvo. Fechar a
sessão remove a instrumentação, mas não encerra o alvo.

## Evidence e limites

Resultados distinguem observações, derivações, inferências e incógnitas.
Evidence preserva alvo, provedor, fontes, cobertura, limites e IDs.

Análise estática não estabelece execução. Nomes, manifestos, exports nativos e
candidatos JNI são fatos do artefato, não prova de carregamento em runtime.
Carregamento dinâmico, reflexão, chamadas indiretas e estado não observado
permanecem desconhecidos.

Use `record_unknown` para perguntas abertas e `export_evidence_bundle` para
preservar Evidence após a sessão.

<a id="set-up-your-agent"></a>

## Configurar agente

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

Preserve configurações não relacionadas e backups.

## Atualizações

O fork não atualiza pelo npm upstream. `rea update` apenas reporta o estado
source-managed.

```sh
npm ci
npm run build:cached
```

Reconecte o cliente depois. Consulte
[Android fork maintenance](../fork-maintenance.md) e
[upstream-sync.json](../../upstream-sync.json).

<a id="faq"></a>

## FAQ

<details>
<summary><strong>Do Unity, Godot, React Native, Hermes, Go, or Rust mentions add MCP tools?</strong></summary>

No. They are Android support-analysis records. The public catalog remains limited to the documented Android families; adding a family or tool requires a new scope decision, contract, tests, and provider verification. See [MCP contracts](../mcp-contracts.md#tool-families).

</details>

<details>
<summary><strong>Posso executar pelo checkout local?</strong></summary>

Sim. Execute `npm run build:cached` e depois `node scripts/rea.mjs`.

</details>

<details>
<summary><strong>O projeto atualiza pelo npm?</strong></summary>

Não. `rea update` é source-managed e não instala o pacote upstream.

</details>

<details>
<summary><strong>Quais engines nativas são suportadas?</strong></summary>

Ghidra ou IDA. Hopper e Kuna não são registrados.

</details>

<details>
<summary><strong>Meu APK é enviado para algum serviço?</strong></summary>

A análise é local. O agente recebe os resultados e o provedor do modelo segue
sua própria política de dados.

</details>

<a id="documentation"></a>

## Documentação

- [Android content audit](../maintenance/android-content-audit.json): per-path restoration and deletion decisions.

- [Análise de suporte Android](../android-system-images.md), [bibliotecas multilíngues](../android-cross-language-libraries.md), [bancos SQLite](../sqlite-databases.md), [capturas de pacotes](../packet-captures.md), [captura de processos](../process-capture.md) e [registros de falhas](../recorded-crashes.md): documentação de suporte que não adiciona uma família MCP pública.

- [Instalação](../installation.md)
- [CLI e Evidence](../cli.md)
- [Contratos MCP](../mcp-contracts.md) e [prompts](../mcp-prompts.md)
- [Análise APK](../android-analysis.md)
- [ADB](../adb-device-analysis.md)
- [Recursos Android](../apktool-resource-analysis.md)
- [Assinaturas APK](../apk-signature.md)
- [Flutter](../flutter-analysis.md)
- [JEB](../jeb-analysis.md)
- [Frida](../frida-instrumentation.md)
- [Análise nativa](../native-investigation.md)
- [Testes](../testing.md) e [arquitetura](../architecture.mermaid)

Reporte vulnerabilidades conforme [SECURITY.md](../../SECURITY.md).

## Aviso

Veja [DISCLAIMER.md](../../DISCLAIMER.md). O projeto é destinado a pesquisa,
educação, interoperabilidade e análise legítima de software que você possui ou
tem autorização para examinar.

Você deve obter legalmente as engines e ferramentas fornecidas, incluindo IDA
e JEB. O projeto não fornece licença, chave ou ativação.

## Contribuição

Veja [CONTRIBUTING.md](../../CONTRIBUTING.md), [testes](../testing.md) e
[arquitetura](../architecture.mermaid).

## Licença

[MIT](../../LICENSE)

O código deste fork usa MIT. Materiais de terceiros mantêm suas licenças.
Veja [THIRD_PARTY_NOTICES.md](../../THIRD_PARTY_NOTICES.md).
