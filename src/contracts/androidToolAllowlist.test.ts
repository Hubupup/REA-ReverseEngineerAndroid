import { describe, expect, it } from "vitest";

import { ANDROID_TOOL_ALLOWLIST } from "./androidToolAllowlist.js";
import { TOOL_FAMILY_DEFINITIONS, toolFamilyId } from "./toolFamilies.js";
import { TOOL_CONTRACTS } from "./toolContracts.js";

describe("Android tool allowlist", () => {
  it("keeps the default MCP catalog below the Android-only ceiling", () => {
    expect(TOOL_CONTRACTS.length).toBe(117);
    expect(TOOL_CONTRACTS.length).toBeLessThanOrEqual(120);
  });

  it("contains every explicitly selected Android contract exactly once", () => {
    const expected = new Set([
      ...ANDROID_TOOL_ALLOWLIST.official,
      ...ANDROID_TOOL_ALLOWLIST.enhanced,
      ...ANDROID_TOOL_ALLOWLIST.native,
      ...ANDROID_TOOL_ALLOWLIST.artifact,
      ...ANDROID_TOOL_ALLOWLIST.application,
      ...ANDROID_TOOL_ALLOWLIST.session,
      ...TOOL_CONTRACTS.filter(({ name }) =>
        [
          "inspect_android_jni_bindings",
          "inspect_android_package",
          "search_android_classes",
          "inspect_android_class",
          "inspect_android_method",
          "trace_android_references",
          "inspect_apktool_client",
          "decode_android_resources",
          "identify_flutter_build",
          "inspect_dart_aot",
          "inspect_jeb_client",
          "open_jeb_project",
          "list_jeb_units",
          "decompile_jeb_item",
          "list_frida_devices",
          "list_frida_processes",
          "start_frida_session",
          "load_frida_script",
          "resume_frida_session",
          "unload_frida_script",
          "frida_session_status",
          "close_frida_session",
          "instrument_with_frida",
        ].includes(name),
      ).map(({ name }) => name),
      ...TOOL_CONTRACTS.filter(({ kind }) => kind === "adb-provider").map(
        ({ name }) => name,
      ),
    ]);
    const actual = TOOL_CONTRACTS.map(({ name }) => name);
    expect(new Set(actual)).toEqual(expected);
    expect(actual.length).toBe(expected.size);
  });

  it("does not retain removed cross-platform tools or families", () => {
    const names = new Set(TOOL_CONTRACTS.map(({ name }) => name));
    for (const removed of [
      "analyze_javascript_application",
      "capture_browser_scenario",
      "inspect_macho",
      "inspect_managed_artifact",
      "inspect_packet_capture",
      "inspect_sqlite_database",
      "inspect_wasm_artifact",
      "execute_rizin_command",
      "start_gdb_session",
      "list_cutter_sessions",
    ])
      expect(names.has(removed)).toBe(false);
    for (const family of [
      "browser",
      "electron",
      "firmware",
      "managed",
      "pcap",
      "javascript-runtime",
    ])
      expect(toolFamilyId(family)).toBeUndefined();
  });

  it("assigns every advertised contract to one retained family", () => {
    const families = new Map<string, string>();
    for (const definition of TOOL_FAMILY_DEFINITIONS)
      for (const contract of definition.contracts)
        families.set(contract.name, definition.id);
    for (const contract of TOOL_CONTRACTS)
      expect(families.get(contract.name)).toBeDefined();
  });
});
