import { names } from "./catalog-core.mjs";

export const toolFamilyCatalog = (sources) => {
  const families = sources.toolFamilies.TOOL_FAMILY_DEFINITIONS.map(
    ({ id, surface, contracts }) => ({
      id,
      surface,
      count: contracts.length,
      tools: names(contracts),
    }),
  );
  const familyTotal = families.reduce(
    (total, family) => total + family.count,
    0,
  );
  if (
    familyTotal !== sources.toolContracts.TOOL_CONTRACTS.length ||
    familyTotal !==
      sources.catalogIdentity.FULL_CATALOG_IDENTITY.counts.mcp_tools
  )
    throw new Error("Tool family inventory does not match TOOL_CONTRACTS");
  return { total: familyTotal, families };
};

const selectNames = (contracts, selected) => {
  const wanted = new Set(selected);
  return contracts.filter(({ name }) => wanted.has(name));
};

export const providerCatalog = (sources) => {
  const contracts = sources.toolContracts.TOOL_CONTRACTS.filter(
    ({ name }) =>
      name !== "project_android_application_graph" &&
      name !== "inspect_analysis_view",
  );
  const ghidraOperations = new Set(sources.ghidraProvider.GHIDRA_OPERATIONS);
  const idaOperations = new Set(sources.idaProvider.IDA_OPERATIONS);
  return [
    {
      identity: sources.fridaProvider.FRIDA_PROVIDER_IDENTITY,
      contracts: contracts.filter(({ name }) =>
        [
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
      ),
    },
    {
      identity: sources.ghidraProvider.GHIDRA_PROVIDER_IDENTITY,
      contracts: contracts.filter(({ name }) => ghidraOperations.has(name)),
    },
    {
      identity: sources.idaProvider.IDA_PROVIDER_IDENTITY,
      contracts: contracts.filter(({ name }) => idaOperations.has(name)),
    },
    {
      identity: sources.androidProvider.JADX_PROVIDER_IDENTITY,
      contracts: selectNames(contracts, [
        "inspect_android_package",
        "search_android_classes",
        "inspect_android_class",
        "inspect_android_method",
        "trace_android_references",
        "inspect_android_jni_bindings",
      ]),
    },
    {
      identity: sources.apktoolProvider.APKTOOL_PROVIDER_IDENTITY,
      contracts: selectNames(contracts, [
        "inspect_apktool_client",
        "decode_android_resources",
      ]),
    },
    {
      identity: sources.jebProvider.JEB_PROVIDER_IDENTITY,
      contracts: selectNames(contracts, [
        "inspect_jeb_client",
        "open_jeb_project",
        "list_jeb_units",
        "decompile_jeb_item",
      ]),
    },
    {
      identity: sources.adbProvider.ADB_PROVIDER_IDENTITY,
      contracts: contracts.filter(({ kind }) => kind === "adb-provider"),
    },
    {
      identity: sources.flutterProvider.FLUTTER_PROVIDER_IDENTITY,
      contracts: selectNames(contracts, [
        "identify_flutter_build",
        "inspect_dart_aot",
      ]),
    },
    {
      identity: sources.apkSignatureProvider.APK_SIGNATURE_PROVIDER_IDENTITY,
      contracts: selectNames(contracts, ["inspect_apk_signature"]),
    },
    {
      identity: sources.artifactProviders.ARTIFACT_GRAPH_PROVIDER,
      contracts: selectNames(contracts, [
        "inspect_artifact",
        "extract_artifact",
      ]),
    },
    {
      identity: sources.artifactProviders.ELF_NOTES_PROVIDER,
      contracts: selectNames(contracts, ["inspect_elf_notes"]),
    },
    {
      identity: sources.artifactProviders.BYTE_ENTROPY_PROVIDER,
      contracts: selectNames(contracts, ["inspect_byte_entropy"]),
    },
    {
      identity: sources.artifactProviders.NATIVE_EXPORTS_PROVIDER,
      contracts: selectNames(contracts, ["inspect_native_exports"]),
    },
    {
      identity: sources.artifactProviders.ANDROID_APPLICATION_PROVIDER,
      contracts: selectNames(contracts, ["project_android_application_graph"]),
    },
    {
      identity: sources.artifactProviders.ANALYSIS_VIEW_PROVIDER,
      contracts: selectNames(contracts, ["inspect_analysis_view"]),
    },
  ]
    .map(({ identity, contracts: providerContracts }) => ({
      id: identity.id,
      name: identity.name,
      version: identity.version,
      capabilities: names(providerContracts),
    }))
    .filter(({ capabilities }) => capabilities.length > 0)
    .sort((left, right) => left.id.localeCompare(right.id));
};
