# Captured protocol fixtures

These are actual protocol outputs, not records assembled to match the parser.
`provenance.json` records the capture host, producer versions, source digests,
and immutable expectation digests.

## MCP JSON-RPC request

`mcp-initialize.json` captures the `initialize` request emitted by the pinned
`@modelcontextprotocol/client` SDK. The client connected to the actual
`scripts/rea.mjs mcp` subprocess and completed `listTools` for the current
android-only catalog.

The recorder intercepted `transport.send`, serialized the message, and
delegated the unchanged message to the real SDK transport. The committed JSON
is formatted for review; whitespace is not a wire identity claim. No provider
was launched.

The decoder expectation specifies every field path, JSON value, and
observed-versus-inferred status. It is a captured decoder regression, not proof
of a live protocol-capture product workflow.

## Maintenance

Keep golden updates scoped to retained Android and MCP behavior. Review a new
expectation against the producer and source-owned input before updating
`provenance.json`. Tests must never rewrite a golden automatically.

Do not add captures for removed browser, desktop, JavaScript, Apple,
HarmonyOS, firmware, PE, WASM, EVM, SQLite, GPU, or unrelated native formats.
