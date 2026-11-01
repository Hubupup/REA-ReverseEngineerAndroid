# Client configuration and troubleshooting

Use this guide when a client cannot launch the local REA:Reverse Engineer
Android server, when a registration points at the wrong runtime, or when
schema and timeout settings need adjustment. Start with
[installation and setup](installation.md).

## Launchers and PATH

The source launcher is `scripts/rea.mjs`. A client should use an absolute path
to the supported Node.js executable and an absolute path to that script:

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

`rea setup` writes the selected runtime and launcher into the client's
registration, preserves unrelated settings, and creates a backup before
changing an existing file. A client launched from a desktop application, IDE,
or service may inherit a different `PATH` from the terminal. Test the actual
registered command in that environment rather than assuming terminal success
is sufficient.

`rea doctor` checks configuration and selected provider readiness. It does not
launch a separate client or prove that a running client session uses the same
registration.

## Provider configuration

Provider paths and endpoints remain caller-selected:

| Provider | Selection                                                                                   |
| -------- | ------------------------------------------------------------------------------------------- |
| JADX     | `REA_JADX_MCP_JAR`; use `JAVA_HOME` when a full JDK 17 or newer is not selected by `PATH`   |
| ADB      | `REA_ADB_PATH` or `adb` on `PATH`                                                           |
| Apktool  | `REA_APKTOOL_COMMAND` or `apktool` on `PATH`                                                |
| Ghidra   | `GHIDRA_INSTALL_DIR` and a supported full JDK                                               |
| IDA      | `REA_IDA_MCP_CONFIG` for an existing IDA MCP registration or the supported headless profile |
| JEB      | `REA_JEB_MCP_URL` for a caller-started JEB endpoint                                         |
| Frida    | Caller-supplied Frida binding and a selected Android target                                 |

REA does not install or upgrade Java, JADX, ADB, Apktool, Ghidra, IDA, JEB, or
Frida. A provider being unavailable does not block unrelated Android static
inspection.

## Tool families and schema profiles

The default catalog contains the retained Android families. Narrow it for a
specific workflow with `REA_MCP_TOOL_FAMILIES`:

```sh
REA_MCP_TOOL_FAMILIES=android,artifact,adb
```

An invalid or removed family id stops startup with the current family list.
Tool-family selection changes advertising only; it does not weaken canonical
input validation or Evidence semantics.

The default input schema profile is `compact`. Set
`REA_MCP_INPUT_SCHEMA_PROFILE=full` when a client needs complete field guidance
and nested validation details. Output schemas are advertised by default; set
`REA_MCP_OUTPUT_SCHEMA_PROFILE=compact` or `off` only for a client with a
strict `tools/list` frame limit. Server-side result validation remains
canonical for every profile.

## Runtime settings and deadlines

`update_analysis_settings` changes selected defaults inside the running server.
It does not edit client registrations or extend the client's tool-call deadline.
Use `inspect_analysis_settings` to read the running defaults and use
[limits and recovery](design/limits-and-recovery.md) for ownership and reset
semantics.

Common Android-relevant launch controls include:

- `REA_JADX_OPERATION_TIMEOUT_MS`
- `REA_APKTOOL_COMMAND`
- `REA_JEB_MCP_TIMEOUT_MS`
- `REA_GHIDRA_STARTUP_TIMEOUT_MS`
- `REA_GHIDRA_DECOMPILE_TIMEOUT_SECONDS`
- `REA_IDA_MCP_CONFIG`
- `REA_MCP_MAX_RESPONSE_BYTES`
- `REA_MCP_MAX_INPUT_ELEMENTS`

When a workload needs a longer client deadline, update that client's own
timeout setting and reconnect. A server-side runtime setting does not raise a
client receive buffer or protocol deadline.

## Client troubleshooting

If a client disconnects immediately:

1. Run `node scripts/rea.mjs mcp doctor --json` with the intended runtime.
2. Inspect the client's actual registration and startup log.
3. Confirm that the registered Node.js and `scripts/rea.mjs` paths exist.
4. Restart the client fully rather than only closing its window.
5. Re-run setup after repairing the selected runtime path.

If a client rejects the catalog, try the compact input profile first, then the
compact or omitted output profile. If the client reports a missing tool,
inspect its permission or tool filter and the selected
`REA_MCP_TOOL_FAMILIES`; a connected server can intentionally advertise a
smaller family scope.

## Uninstall

Run:

```sh
node scripts/rea.mjs uninstall
```

Uninstall removes recognized REA-owned registrations and skill copies. It does
not remove APKs, devices, Frida scripts, provider installations, credentials,
or unrelated client settings.
