<div align="center">

[English](../../README.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · **Français** · [Deutsch](README_de.md) · [Português (Brasil)](README_pt-BR.md) · [Español](README_es.md) · [한국어](README_ko.md) · [日本語](README_ja.md)

# REA:Reverse Engineer Android

### Un MCP pour l’ingénierie inverse des applications Android.

**Inspectez un APK, suivez son comportement jusque dans le code natif et conservez les preuves de chaque conclusion.**

[![Catalogue MCP](https://img.shields.io/badge/MCP-117_Android_tools-5c4ee5?style=flat-square)](#tool-catalog)
[![Prérequis Node.js](https://img.shields.io/badge/Node.js-24.22.1-339933?style=flat-square&logo=nodedotjs&logoColor=white)](#requirements)
[![Licence MIT](https://img.shields.io/badge/license-MIT-f4c430?style=flat-square)](../../LICENSE)

[Démarrage rapide](#quick-start) · [Fonctionnement](#how-it-works) · [Cibles prises en charge](#what-you-can-analyze) · [Fournisseurs](#deep-analysis-providers) · [Configuration de l’agent](#set-up-your-agent) · [FAQ](#faq) · [Documentation](#documentation)

<code>node scripts/rea.mjs setup</code>

</div>

> [!IMPORTANT]
> Ce dépôt est un fork Android-only de
> [morluto/rea](https://github.com/morluto/rea), basé sur REA 6.8.0.
> Il est conçu pour être compilé et exécuté depuis ce checkout local.
> Il ne se met pas à jour depuis le paquet npm public `rea-agents`.

---

REA:Reverse Engineer Android connecte un agent à des outils locaux pour
inspecter les APK Android, l’état d’un appareil, le comportement d’exécution,
les ressources et les bibliothèques natives. Les mêmes workflows sont
disponibles via MCP et en ligne de commande.

Le fork conserve les identifiants `rea`, `rea-agents` et
`reverse-engineer-anything` pour la compatibilité d’installation. Le skill,
les instructions serveur, les commandes CLI et le catalogue MCP sont
Android-only.

L’analyse s’exécute localement. Les résultats conservent les Evidence, le
fournisseur, la couverture, les limites et les inconnues associées.

<a id="quick-start"></a>

## Démarrage rapide

<a id="requirements"></a>

### Prérequis

REA:Reverse Engineer Android utilise la version Node.js épinglée dans
[.nvmrc](../../.nvmrc). Installez les dépendances :

```sh
npm ci
```

L’analyse APK statique nécessite un JDK complet 17 ou plus récent et le JAR
`jadx-headless-mcp-0.7.1-all.jar` fourni par l’appelant. Sélectionnez-le avec
`REA_JADX_MCP_JAR` et, si nécessaire, Java avec `JAVA_HOME`.

Les workflows appareil nécessitent un binaire `adb` fourni par l’appelant.
Utilisez `REA_ADB_PATH` ou placez `adb` dans `PATH`.

Le décodage des ressources nécessite Apktool 2.7.0 ou plus récent. Utilisez
`REA_APKTOOL_COMMAND` ou placez `apktool` dans `PATH`.

L’analyse des bibliothèques natives utilise une installation Ghidra ou IDA
existante. JEB et Frida restent fournis par l’appelant.

REA:Reverse Engineer Android n’installe ni ne met à jour Java, JADX, ADB,
Apktool, Ghidra, IDA, JEB ou Frida.

### Compiler le runtime local

```sh
npm run build:cached
node scripts/rea.mjs --help
```

Les workflows JADX et Ghidra sous Windows utilisent les contrôles natifs x64
de `native/windows/build/`. Un checkout source peut restaurer les fichiers
correspondants depuis le tarball `rea-agents@6.8.0` en suivant
[native/windows/README.md](../../native/windows/README.md).

### Configurer l’agent

```sh
node scripts/rea.mjs setup
```

Choisissez les agents, vérifiez les changements proposés et approuvez-les.
La configuration ajoute le serveur local REA:Reverse Engineer Android,
installe le skill Android-only et sauvegarde la configuration existante.

Le lanceur local est `scripts/rea.mjs`. Si le client exige une commande
explicite, utilisez son chemin absolu et le même runtime Node.js.

### Interroger l’agent

```text
Inspecte cet APK, explique le fonctionnement du flux de connexion et montre
les preuves. Suis ensuite la fonctionnalité dans les bibliothèques natives.
```

### Utiliser le terminal

```sh
node scripts/rea.mjs inspect-android-package /absolute/path/application.apk
node scripts/rea.mjs search-android-classes /absolute/path/application.apk MainActivity
node scripts/rea.mjs inspect-android-class /absolute/path/application.apk com.example.MainActivity
node scripts/rea.mjs inspect-android-method /absolute/path/application.apk com.example.MainActivity onCreate
node scripts/rea.mjs trace-android-references /absolute/path/application.apk com.example.MainActivity
```

Chaque commande est isolée sauf lorsqu’elle utilise une session MCP. Les
Evidence complètes accompagnent le résultat.

<a id="how-it-works"></a>

## Fonctionnement

L’agent appelle REA:Reverse Engineer Android via MCP, et vous pouvez utiliser
les mêmes workflows via la CLI. Le service inspecte l’APK ou l’appareil
sélectionné, suit les classes, méthodes, ressources, références et code natif,
puis retourne les résultats avec leurs Evidence.

![Flux REA:Reverse Engineer Android : l’agent interroge une cible locale, le service l’inspecte et la trace, puis l’agent utilise les Evidence.](../../website/public/assets/figures/rea-investigation-flow.svg)

L’analyse statique ne prouve pas le comportement d’exécution. Les outils
runtime agissent uniquement sur l’appareil, le paquet, le processus, le script
et la fenêtre d’observation explicitement sélectionnés.

<a id="tool-catalog"></a>

## Catalogue d’outils

Le catalogue MCP par défaut contient **117 outils Android** :

| Family        | Couverture                                                                          |
| ------------- | ----------------------------------------------------------------------------------- |
| `android`     | Paquet APK, manifeste, classes, méthodes, références et liaisons JNI                |
| `apktool`     | Vérification Apktool et décodage des ressources Android                             |
| `artifact`    | Inventaire APK/archive, extraction contrôlée et signature APK                       |
| `flutter`     | Identification Flutter et inspection Dart AOT                                       |
| `adb`         | Appareils, paquets, fichiers, logs, processus, cycle de vie et mutations explicites |
| `frida`       | Découverte appareil/processus, scripts, sessions et nettoyage                       |
| `jeb`         | Client JEB, projets, unités et décompilation                                        |
| `native`      | Notes ELF, exports natifs, disposition ELF et entropie                              |
| `direct`      | Opérations natives headless Ghidra et IDA                                           |
| `enhanced`    | Dossiers de fonctions, graphes d’appels, décompilation par lots et traces           |
| `application` | Guidage Android, vues/réglages d’analyse et projection du graphe applicatif         |
| `session`     | Cycle de vie, bundles Evidence, comparaisons, inconnues et contexte Android/native  |

`REA_MCP_TOOL_FAMILIES` permet de réduire le catalogue aux familles
nécessaires. Un identifiant inconnu ou supprimé empêche le démarrage du serveur.

MCP utilise des schémas d’entrée compacts par défaut. Définissez
`REA_MCP_INPUT_SCHEMA_PROFILE=full` pour obtenir les descriptions complètes.
Les deux profils valident les mêmes contrats serveur.

<a id="what-you-can-analyze"></a>

## Cibles prises en charge

| Cible                 | Résultat                                                                                             | Prérequis et guide                                                                         |
| --------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| APK Android           | Identité du paquet, SDK, permissions, manifeste, classes, méthodes, références, JNI et décompilation | JADX MCP JAR 0.7.1 et JDK complet 17+ ; [guide Android](../android-analysis.md)            |
| Signatures APK        | Signataires v1/v2/v3/v3.1, empreintes, rotation de clés, source stamp et cohérence des digests       | Inspection statique intégrée ; [guide signatures](../apk-signature.md)                     |
| Appareils Android     | Appareils, paquets, processus, logs, fichiers, captures, bugreports et mutations                     | `adb` fourni par l’appelant ; [guide ADB](../adb-device-analysis.md)                       |
| Ressources Android    | Manifeste décodé, métadonnées, tables de chaînes, langues et couverture                              | Apktool 2.7.0+ fourni par l’appelant ; [guide Apktool](../apktool-resource-analysis.md)    |
| Applications Flutter  | Hash des snapshots Dart, digests par ABI, provenance du moteur et AOT                                | Analyse APK intégrée ; [guide Flutter](../flutter-analysis.md)                             |
| Projets JEB           | Unités, digests et pseudo-code de types ou méthodes                                                  | Client JEB démarré par l’appelant via `REA_JEB_MCP_URL` ; [guide JEB](../jeb-analysis.md)  |
| Runtime Android       | Découverte Frida, scripts, messages, sessions et nettoyage                                           | Frida et cible Android fournis par l’appelant ; [guide Frida](../frida-instrumentation.md) |
| Bibliothèques natives | ELF, exports, pseudo-code, assembleur, appels, références, CFG et dossiers                           | Ghidra ou IDA ; [analyse native](../native-investigation.md)                               |
| Inventaire APK        | Membres, digests, intégrité, extraction et projection du graphe applicatif                           | Inspection d’archive intégrée                                                              |

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

Le serveur Android-only n’enregistre pas les familles navigateur, Electron,
JavaScript autonome, Apple, HarmonyOS, bureau, firmware, .NET managé, RL ou
autres cibles non Android. SQLite, les captures réseau enregistrées, les preuves
de processus/crash, devicetree, raw binary, kernel modules et les architectures
natives anciennes restent une documentation de support sans nouvelle famille MCP.

<a id="deep-analysis-providers"></a>

## Fournisseurs d’analyse profonde

Le code APK utilise un moteur JADX headless fourni par l’appelant via
`src/android/`. La vérification de disponibilité ne prouve pas que chaque APK
sera décodé.

L’analyse des `.so` natifs utilise Ghidra ou IDA :

```sh
node scripts/rea.mjs analyze /absolute/path/libexample.so --provider-id ghidra
node scripts/rea.mjs decompile /absolute/path/libexample.so \
  --procedure Java_com_example_Native_run \
  --provider-id ghidra
```

Utilisez `doctor --provider ghidra`, `doctor --provider ida` ou
`doctor --provider jadx` pour vérifier la configuration.

Le fork Android-only n’enregistre ni Hopper ni Kuna.

### Inspection APK statique

```sh
node scripts/rea.mjs inspect-android-package /absolute/path/application.apk
node scripts/rea.mjs inspect-android-jni-bindings /absolute/path/application.apk
node scripts/rea.mjs inspect-apk-signature /absolute/path/application.apk
node scripts/rea.mjs decode-android-resources /absolute/path/application.apk
node scripts/rea.mjs identify-flutter-build /absolute/path/application.apk
```

Pour un build R8/ProGuard, passez un `mapping_path` absolu :

```sh
node scripts/rea.mjs inspect-android-class /absolute/path/application.apk \
  a.b --mapping-path /absolute/path/mapping.txt --detail summary \
  --evidence_output /absolute/path/class-evidence.json
```

Les annotations de mapping restent séparées des noms DEX observés.
REA:Reverse Engineer Android ne vérifie pas que le mapping appartient au build.

### Appareil et runtime

```sh
node scripts/rea.mjs list-adb-devices
node scripts/rea.mjs inspect-adb-device emulator-5554
node scripts/rea.mjs list-adb-packages emulator-5554
node scripts/rea.mjs pull-adb-package emulator-5554 com.example
node scripts/rea.mjs read-adb-logcat emulator-5554
node scripts/rea.mjs list-adb-processes emulator-5554
```

Les mutations sont explicites :

```sh
node scripts/rea.mjs install-adb-package emulator-5554 /absolute/path/application.apk
node scripts/rea.mjs start-adb-app emulator-5554 com.example
node scripts/rea.mjs stop-adb-app emulator-5554 com.example
node scripts/rea.mjs uninstall-adb-package emulator-5554 com.example
```

Frida suit le même modèle :

```sh
node scripts/rea.mjs list-frida-devices
node scripts/rea.mjs list-frida-processes --device-id emulator-5554
node scripts/rea.mjs instrument-with-frida \
  --device-id emulator-5554 --pid 1234 --script-file /absolute/path/hook.js
```

Les scripts Frida peuvent lire ou modifier la mémoire et le comportement de la
cible. Fermer une session détache l’instrumentation sans tuer la cible.

## Evidence et limites

Les résultats distinguent observations, dérivations, inférences et inconnues.
Les Evidence conservent l’identité de la cible, du fournisseur, les sources,
la couverture, les limites et un identifiant stable.

L’analyse statique n’établit pas l’exécution runtime. Les noms de classes, les
déclarations du manifeste, les exports natifs et les candidats JNI restent des
faits sur l’artefact livré. Le chargement dynamique, la réflexion, les appels
indirects et l’état non observé restent inconnus.

Utilisez `record_unknown` pour les questions ouvertes et
`export_evidence_bundle` pour conserver les Evidence complètes après la session.

<a id="set-up-your-agent"></a>

## Configuration de l’agent

```sh
node scripts/rea.mjs setup
node scripts/rea.mjs doctor --client codex --json
node scripts/rea.mjs mcp
```

Pour un enregistrement stdio manuel :

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

Préservez les réglages non liés et les sauvegardes.

## Mises à jour

Ce fork ne se met pas à jour depuis le paquet npm amont. `rea update` signale
uniquement l’état source-managed et ne remplace pas le runtime Android-only.

```sh
npm ci
npm run build:cached
```

Reconnectez ensuite le client. La politique de synchronisation amont est
décrite dans [Android fork maintenance](../fork-maintenance.md) et
[upstream-sync.json](../../upstream-sync.json).

<a id="faq"></a>

## FAQ

<details>
<summary><strong>Do Unity, Godot, React Native, Hermes, Go, or Rust mentions add MCP tools?</strong></summary>

No. They are Android support-analysis records. The public catalog remains limited to the documented Android families; adding a family or tool requires a new scope decision, contract, tests, and provider verification. See [MCP contracts](../mcp-contracts.md#tool-families).

</details>

<details>
<summary><strong>Puis-je exécuter depuis le checkout local ?</strong></summary>

Oui. Exécutez `npm run build:cached`, puis `node scripts/rea.mjs`.

</details>

<details>
<summary><strong>Le projet se met-il à jour depuis npm ?</strong></summary>

Non. `rea update` est source-managed et n’installe pas le paquet REA amont.

</details>

<details>
<summary><strong>Quels moteurs natifs sont pris en charge ?</strong></summary>

Ghidra ou IDA. Hopper et Kuna ne sont pas enregistrés.

</details>

<details>
<summary><strong>Le service envoie-t-il mon APK ?</strong></summary>

L’analyse est locale. L’agent reçoit les résultats et le fournisseur du modèle
applique sa propre politique de données.

</details>

<a id="documentation"></a>

## Documentation

- [Android content audit](../maintenance/android-content-audit.json): per-path restoration and deletion decisions.

- [Analyse de prise en charge Android](../android-system-images.md), [bibliothèques multilingues](../android-cross-language-libraries.md), [bases SQLite](../sqlite-databases.md), [captures réseau](../packet-captures.md), [capture de processus](../process-capture.md) et [rapports de crash](../recorded-crashes.md) : documentation de support qui n’ajoute pas de famille MCP publique.

- [Installation et configuration](../installation.md)
- [CLI et Evidence](../cli.md)
- [Contrats MCP](../mcp-contracts.md) et [prompts agent](../mcp-prompts.md)
- [Analyse APK Android](../android-analysis.md)
- [Analyse ADB](../adb-device-analysis.md)
- [Ressources Android](../apktool-resource-analysis.md)
- [Signatures APK](../apk-signature.md)
- [Analyse Flutter](../flutter-analysis.md)
- [Analyse JEB](../jeb-analysis.md)
- [Instrumentation Frida](../frida-instrumentation.md)
- [Analyse native](../native-investigation.md)
- [Tests](../testing.md) et [architecture](../architecture.mermaid)

Signalez les vulnérabilités via [SECURITY.md](../../SECURITY.md).

## Avertissement

Voir [DISCLAIMER.md](../../DISCLAIMER.md). Le projet est destiné à la
recherche, l’éducation, l’interopérabilité et l’analyse légitimes de logiciels
que vous possédez ou êtes autorisé à examiner.

Vous devez obtenir légalement les moteurs et outils fournis, notamment IDA et
JEB. Le projet ne fournit ni licence, ni clé, ni droit d’activation.

## Contribution

Voir [CONTRIBUTING.md](../../CONTRIBUTING.md), [testing](../testing.md) et
[architecture](../architecture.mermaid).

## Licence

[MIT](../../LICENSE)

Le code de ce fork est sous MIT. Les éléments tiers conservent leurs licences.
La liste des dépendances figure dans
[THIRD_PARTY_NOTICES.md](../../THIRD_PARTY_NOTICES.md).
