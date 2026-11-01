import type { ToolContract } from "./toolContractTypes.js";

/**
 * Android-only public tool surface.
 *
 * Keep this list and the family grouping in `toolFamilies.ts` as the single
 * authority for what the Android fork registers and advertises.
 */
export const ANDROID_TOOL_ALLOWLIST = {
  official: [
    "annotate_native_function",
    "inspect_native_load_image",
    "inspect_native_data_type",
    "inspect_native_instruction",
    "resolve_native_call_targets",
    "address_name",
    "list_documents",
    "list_names",
    "list_procedures",
    "list_segments",
    "list_strings",
    "procedure_address",
    "procedure_assembly",
    "procedure_callees",
    "procedure_callers",
    "procedure_info",
    "read_function_instructions",
    "procedure_references",
    "procedure_pseudo_code",
    "resolve_containing_procedure",
    "search_procedures",
    "search_strings",
    "xrefs",
    "read_bytes",
    "search_bytes",
    "address_to_file_offset",
  ],
  enhanced: [
    "batch_decompile",
    "decompile_all",
    "get_call_graph",
    "find_xrefs_to_name",
    "binary_overview",
    "analyze_function",
    "inspect_native_api",
    "trace_feature",
    "trace_call_path",
    "trace_native_values",
  ],
  native: [
    "inspect_elf_notes",
    "inspect_native_exports",
    "inspect_binary_layout",
    "inspect_byte_entropy",
  ],
  artifact: ["inspect_artifact", "extract_artifact", "inspect_apk_signature"],
  application: [
    "search_guidance",
    "guided_workflows",
    "read_guidance_section",
    "project_android_application_graph",
    "inspect_analysis_settings",
    "update_analysis_settings",
    "inspect_analysis_view",
  ],
  session: [
    "open_binary",
    "close_binary",
    "binary_session",
    "export_evidence_bundle",
    "import_evidence_bundle",
    "compare_artifacts",
    "match_native_functions",
    "compare_functions",
    "compare_bundles",
    "find_changed_behavior",
    "build_call_path",
    "correlate_static_and_runtime",
    "verify_reconstruction",
    "list_unknowns",
    "record_unknown",
    "update_unknown",
    "verify_unknown_resolution",
    "get_evidence_bundle",
    "get_navigation_context",
    "inspect_address_context",
  ],
} as const;

/** Select named contracts while preserving each contract's exact public type. */
export const selectToolContracts = <
  const Contracts extends readonly ToolContract[],
  const Names extends readonly Contracts[number]["name"][],
>(
  contracts: Contracts,
  names: Names,
): readonly Extract<Contracts[number], { readonly name: Names[number] }>[] =>
  names.map((name) => {
    const contract = contracts.find((candidate) => candidate.name === name);
    if (contract === undefined)
      throw new Error(`Android allowlist names missing contract: ${name}`);
    return contract as Extract<
      Contracts[number],
      { readonly name: Names[number] }
    >;
  });
