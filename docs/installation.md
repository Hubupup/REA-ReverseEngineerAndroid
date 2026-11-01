# Installation and setup

REA:Reverse Engineer Android is distributed from this local source checkout.
It does not publish through the upstream REA release process and does not
update from the public `rea-agents` npm package.

## Requirements

- Node.js 24.22.1 from
  [.nvmrc](https://github.com/morluto/rea/blob/main/.nvmrc), or another version accepted by
  `package.json`.
- npm from `package.json#packageManager`.
- Android APK analysis: full JDK 17 or newer and
  `jadx-headless-mcp-0.7.1-all.jar`.
- Android devices: `adb`.
- Android resources: Apktool 2.7.0 or newer.
- Native `.so` analysis: Ghidra or IDA.
- Optional runtime work: JEB and Frida.

REA:Reverse Engineer Android never installs or upgrades Java, JADX, ADB,
Apktool, Ghidra, IDA, JEB, or Frida.

## Build the local runtime

```sh
npm ci
npm run build:cached
node scripts/rea.mjs --help
```

The local launcher is `scripts/rea.mjs`. Use the same Node.js runtime that
built the checkout.

## Configure providers

### JADX

Set the absolute JAR path:

```sh
export REA_JADX_MCP_JAR=/absolute/path/jadx-headless-mcp-0.7.1-all.jar
```

Set `JAVA_HOME` when Java 17 or newer is not selected by `PATH`.

Run:

```sh
node scripts/rea.mjs doctor --provider jadx --json
```

Readiness verifies the selected JAR and Java runtime. It does not prove that a
particular APK can be decoded.

### ADB

Use `adb` on `PATH` or set:

```sh
export REA_ADB_PATH=/absolute/path/adb
```

The client probe checks the binary version and does not contact a device.

### Apktool

Use `apktool` on `PATH` or set:

```sh
export REA_APKTOOL_COMMAND=/absolute/path/apktool
```

### Ghidra

Select an existing Ghidra installation:

```sh
export GHIDRA_INSTALL_DIR=/absolute/path/ghidra
export JAVA_HOME=/absolute/path/jdk
```

Run:

```sh
node scripts/rea.mjs doctor --provider ghidra --json
```

Ghidra imports the selected target into a private ephemeral analysis database.
It does not modify the original executable bytes.

### IDA

Configure the selected upstream IDA MCP registration and set
`REA_IDA_MCP_CONFIG` to its absolute JSON path. REA does not install, launch,
activate, or license IDA.

Run:

```sh
node scripts/rea.mjs doctor --provider ida --json
```

Attached IDA analysis is read-only. REA never saves or closes the attached GUI
database.

### JEB

Start a caller-owned JEB client that serves MCP, then set:

```sh
export REA_JEB_MCP_URL=http://127.0.0.1:8425/mcp
```

### Frida

Frida remains an optional package dependency in normal npm installs. The Frida
manager loads the binding only when a Frida operation runs. Install or provide
Frida according to the host and target requirements.

## Set up an agent

Supported setup clients are Claude Code, Claude Desktop, Codex, Cursor,
Gemini CLI, Windsurf, Devin, OpenCode, Antigravity, GitHub Copilot CLI,
Command Code, Qwen Code, Kimi Code, VS Code, Trae, WorkBuddy, Grok Build, OMP,
Pi, Hermes, Qoder, Factory Droid, ZCode, DeepSeek Harness, FreeBuff, and Grok Bot.
The generated client list is recorded in
[docs/public/product-catalog.json](public/product-catalog.json).

```sh
node scripts/rea.mjs setup
```

Review the proposed client changes before approving. Setup creates backups and
installs the Android-only `reverse-engineer-anything` skill.

For manual stdio registration, point the client at the absolute Node.js
executable and this checkout's `scripts/rea.mjs`:

```json
{
  "mcpServers": {
    "rea": {
      "command": "/absolute/path/to/node",
      "args": ["/absolute/path/to/rea/scripts/rea.mjs", "mcp"]
    }
  }
}
```

Restart or reconnect the client after setup.

## Check readiness

```sh
node scripts/rea.mjs doctor --json
node scripts/rea.mjs doctor --client codex --json
node scripts/rea.mjs doctor --provider jadx --json
node scripts/rea.mjs doctor --provider ghidra --json
node scripts/rea.mjs doctor --provider ida --json
```

Doctor checks registration and provider configuration. It does not prove that
the current agent session is connected or that a provider can analyze every
target.

## MCP profiles

The default input schema profile is compact. Set
`REA_MCP_INPUT_SCHEMA_PROFILE=full` when the client needs complete field
guidance and nested validation details.

Complete output schemas are advertised by default. A client with a strict
`tools/list` frame limit can set `REA_MCP_OUTPUT_SCHEMA_PROFILE=compact` or
`off`. Server-side result validation remains canonical.

## Windows source checkouts

Windows JADX, Ghidra, and owned-process workflows require the packaged native
controls under `native/windows/build/`. The source tree does not generate them
during `npm ci` or `npm run build:cached`.

Restore the matching files from the exact `rea-agents@6.8.0` tarball or follow
[native/windows/README.md](https://github.com/morluto/rea/blob/main/native/windows/README.md).

## Update the local fork

`rea update` is source-managed:

```sh
npm ci
npm run build:cached
```

Reconnect the client afterward. See
[fork maintenance](fork-maintenance.md) for selective upstream review.

## Uninstall client registration

```sh
node scripts/rea.mjs uninstall
```

The command removes only recognized REA-owned client registration and skill
files. It does not remove caller-supplied providers or APKs.

## Android-only boundary

This fork does not register browser, Electron, standalone JavaScript, Apple,
HarmonyOS, desktop, firmware, managed .NET, RL environment, WASM, EVM, model,
GPU, Hopper, Kuna, Cutter, GDB, Rizin, or objdump workflows. SQLite, saved
packet captures, process/crash evidence, devicetree, raw binary regions,
kernel modules, and legacy native architectures are documented as Android
support analysis without becoming default MCP families.
