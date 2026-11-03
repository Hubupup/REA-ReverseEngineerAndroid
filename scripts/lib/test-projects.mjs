import { matchesGlob } from "node:path";

/** Canonical file ownership shared by Vitest and development-test planning. */
export const SOURCE_TEST_PROJECTS = [
  {
    name: "domain",
    group: "source",
    isolate: false,
    include: ["src/{contracts,domain}/**/*.test.ts"],
  },
  {
    name: "services",
    group: "source",
    isolate: false,
    include: ["src/application/**/*.test.ts"],
  },
  {
    name: "adapters",
    group: "source",
    include: [
      "src/*.test.ts",
      "src/{android,apkSignature,apktool,jeb,adb,artifacts,browser,config,cutter,dotnet,electron,erlang,evm,firmware,flutter,pcap,ghidra,go,gpu,hopper,ida,inspector,javascript,main,native,process,providers,python,reference,rust,server,sqlite,wasm,windows}/**/*.test.ts",
    ],
  },
  {
    name: "composition",
    group: "source",
    isolate: false,
    include: ["tests/composition/**/*.test.ts"],
  },
  {
    name: "conformance",
    group: "source",
    isolate: false,
    include: ["tests/conformance/**/*.test.ts"],
    exclude: ["tests/conformance/providers/hopper/realHopperSearch.test.ts"],
  },
  {
    name: "evaluation",
    group: "source",
    isolate: false,
    include: ["tests/evaluation/**/*.test.ts"],
  },
];

export const BUILT_TEST_PROJECTS = [
  {
    name: "boundary",
    group: "built",
    include: [
      "tests/boundary/**/*.test.ts",
      "tests/conformance/providers/hopper/realHopperSearch.test.ts",
    ],
    exclude: [
      "tests/boundary/cli/**/*.test.ts",
      "tests/boundary/mcp/**/*.test.ts",
      "tests/boundary/process/**/*.test.ts",
    ],
  },
  {
    name: "cli-boundary",
    group: "built",
    isolate: false,
    include: ["tests/boundary/cli/**/*.test.ts"],
  },
  {
    name: "process-boundary",
    group: "built",
    include: ["tests/boundary/process/**/*.test.ts"],
  },
  {
    name: "mcp-boundary",
    group: "built",
    isolate: false,
    include: ["tests/boundary/mcp/**/*.test.ts"],
  },
  {
    name: "acceptance",
    group: "built",
    include: ["tests/acceptance/**/*.test.ts"],
  },
  {
    name: "process-global",
    group: "built",
    include: ["tests/process-global/**/*.test.ts"],
  },
];

/**
 * Android-only CI keeps the shared test runners but limits their inventory to
 * Android targets, Android-native tooling, and the process/Evidence contracts
 * those tools depend on.
 */
export const ANDROID_TEST_INCLUDES = {
  domain: [
    "src/contracts/androidToolAllowlist.test.ts",
    "src/contracts/fridaToolContracts.test.ts",
    "src/contracts/jeb/jebToolContracts.test.ts",
    "src/contracts/sessionPathInputs.test.ts",
    "src/contracts/toolFamilies.test.ts",
    "src/domain/adb/**/*.test.ts",
    "src/domain/android/**/*.test.ts",
    "src/domain/apkSignature/**/*.test.ts",
    "src/domain/apktool/**/*.test.ts",
    "src/domain/binaryTarget*.test.ts",
    "src/domain/elf*.test.ts",
    "src/domain/evidence*.test.ts",
    "src/domain/functionReferenceCompatibility.test.ts",
    "src/domain/analysisView/il2cppMetadataView.test.ts",
    "src/domain/native/binaryLayout.test.ts",
    "src/domain/native/bytePattern.test.ts",
    "src/domain/native/elf*.test.ts",
    "src/domain/native/functionBody.test.ts",
    "src/domain/native/nativeInvestigationGraph.test.ts",
    "src/domain/native/nativeProviderOutput.test.ts",
    "src/domain/native/recordedCrash.test.ts",
    "src/domain/process/**/*.test.ts",
    "src/domain/reconstruction*.test.ts",
  ],
  services: [
    "src/application/AnalysisSettings.test.ts",
    "src/application/FunctionAnalysisEvidence.test.ts",
    "src/application/WorkflowEvidence.test.ts",
    "src/application/adb/**/*.test.ts",
    "src/application/android/**/*.test.ts",
    "src/application/apkSignature/**/*.test.ts",
    "src/application/apktool/**/*.test.ts",
    "src/application/binary/**/*.test.ts",
    "src/application/binaryDiagnostics/BinaryDiagnosticsCancellation.test.ts",
    "src/application/binaryDiagnostics/BinaryLayoutService.test.ts",
    "src/application/binaryDiagnostics/ByteEntropyService.test.ts",
    "src/application/binaryDiagnostics/DevicetreeService.test.ts",
    "src/application/binaryDiagnostics/ElfNotesService.test.ts",
    "src/application/binaryDiagnostics/KernelModuleService.test.ts",
    "src/application/binaryDiagnostics/RecordedCrashService.test.ts",
    "src/application/flutter/**/*.test.ts",
    "src/application/frida/**/*.test.ts",
    "src/application/il2cpp/Il2cppMetadataService.test.ts",
    "src/application/investigation/**/*.test.ts",
    "src/application/jeb/**/*.test.ts",
    "src/application/native/**/*.test.ts",
    "src/application/sqlite/**/*.test.ts",
  ],
  adapters: [
    "src/adb/**/*.test.ts",
    "src/android/**/*.test.ts",
    "src/apkSignature/**/*.test.ts",
    "src/apktool/**/*.test.ts",
    "src/artifacts/AnalysisCleanupLease.test.ts",
    "src/artifacts/ArtifactEmbeddedFormatProbes.test.ts",
    "src/artifacts/ArtifactHash.test.ts",
    "src/artifacts/ArtifactOperationFailure.test.ts",
    "src/artifacts/ArtifactPaths.test.ts",
    "src/artifacts/ArtifactReader.test.ts",
    "src/artifacts/ArtifactResourceScope.test.ts",
    "src/artifacts/ArtifactSourceResolution.test.ts",
    "src/artifacts/BundleResourceArtifactClient.test.ts",
    "src/artifacts/OwnedFileHandle.test.ts",
    "src/artifacts/RegularFileAdmission.test.ts",
    "src/artifacts/SafeOutputTreeAdmission.test.ts",
    "src/artifacts/UnityFsArtifactReader.boundaries.test.ts",
    "src/artifacts/UnityFsArtifactReader.test.ts",
    "src/artifacts/ZipArtifactReader.test.ts",
    "src/artifacts/extraction/**/*.test.ts",
    "src/artifacts/inventory/**/*.test.ts",
    "src/flutter/**/*.test.ts",
    "src/frida/**/*.test.ts",
    "src/ghidra/**/*.test.ts",
    "src/ida/**/*.test.ts",
    "src/jeb/**/*.test.ts",
    "src/native/NativeCallObservation.test.ts",
    "src/native/NativeCommandDeadline.test.ts",
    "src/native/SignatureTargetBinding.test.ts",
    "src/native/elf/**/*.test.ts",
    "src/native/exports/**/*.test.ts",
    "src/native/metadata/Il2cppContainer.test.ts",
    "src/native/metadata/NativeSectionDirectory.test.ts",
    "src/native/parsers/demangle.test.ts",
    "src/native/pwndbg/**/*.test.ts",
    "src/native/pwntools/**/*.test.ts",
    "src/process/**/*.test.ts",
  ],
  composition: [
    "tests/composition/analysis-sessions/**/*.test.ts",
    "tests/composition/callPath*.test.ts",
    "tests/composition/directAnalysis*.test.ts",
    "tests/composition/idaProvider.test.ts",
    "tests/composition/reverseEngineering*.test.ts",
    "tests/composition/resolveWindowsProviderExecutable.test.ts",
  ],
  conformance: [
    "tests/conformance/contracts/mcpInputSchemaProfile.test.ts",
    "tests/conformance/contracts/mcpOutputSchemaProfile.test.ts",
    "tests/conformance/contracts/mcpResponseBudget.test.ts",
    "tests/conformance/contracts/mcpToolFamilies.test.ts",
    "tests/conformance/ghidra/mips-checks.test.ts",
    "tests/conformance/ghidra/mips-relocatable-checks.test.ts",
    "tests/conformance/ida/**/*.test.ts",
    "tests/conformance/providers/ghidra/**/*.test.ts",
  ],
  boundary: [
    "tests/boundary/android/**/*.test.ts",
    "tests/boundary/filesystem/binaryTarget.test.ts",
    "tests/boundary/filesystem/directAnalysisSnapshotReplay.test.ts",
    "tests/boundary/filesystem/installScript.test.ts",
    "tests/boundary/filesystem/setupUnavailableProvider.test.ts",
    "tests/boundary/il2cpp/**/*.test.ts",
    "tests/boundary/mcp/apkSignature*.test.ts",
    "tests/boundary/mcp/artifact*.test.ts",
    "tests/boundary/mcp/rawBinaryMcp.test.ts",
    "tests/boundary/mcp/serverLifecycleMcp.test.ts",
    "tests/boundary/mcp/sessionMcp.test.ts",
    "tests/boundary/process/windowsExecutableSelection.test.ts",
    "tests/boundary/providers/ghidra/**/*.test.ts",
    "tests/boundary/providers/ida/**/*.test.ts",
  ],
  "cli-boundary": [
    "tests/boundary/cli/apkSignature*.test.ts",
    "tests/boundary/cli/android*.test.ts",
    "tests/boundary/cli/adb*.test.ts",
    "tests/boundary/cli/elfNotesCli.test.ts",
  ],
  "process-boundary": [
    "tests/boundary/process/adb*.test.ts",
    "tests/boundary/process/android*.test.ts",
    "tests/boundary/process/binarySession*.test.ts",
    "tests/boundary/process/directAnalysis*.test.ts",
    "tests/boundary/process/ghidra*.test.ts",
    "tests/boundary/process/jadx*.test.ts",
    "tests/boundary/process/nativeVerifier*.test.ts",
    "tests/boundary/process/owned*.test.ts",
    "tests/boundary/process/packageNpmInvocation.test.ts",
    "tests/boundary/process/packagePackIsolation.test.ts",
    "tests/boundary/process/packageSetupTerminalOwnership.test.ts",
    "tests/boundary/process/packageTarListing.test.ts",
    "tests/boundary/process/packageUpdateRegistryFailure.test.ts",
    "tests/boundary/process/packageVerifierCommandOwnership.test.ts",
    "tests/boundary/process/packageVerifierCommandSemantics.test.ts",
    "tests/boundary/process/packedBridge*.test.ts",
    "tests/boundary/process/pluginMcpLauncher.test.ts",
    "tests/boundary/process/process*.test.ts",
    "tests/boundary/process/Process*.test.ts",
    "tests/boundary/process/providerProcess*.test.ts",
    "tests/boundary/process/recordedCrash*.test.ts",
    "tests/boundary/process/regexMatcher.test.ts",
    "tests/boundary/process/selectedExecutable*.test.ts",
    "tests/boundary/process/spawnArgumentLimit.test.ts",
    "tests/boundary/process/verifier*.test.ts",
    "tests/boundary/process/windows*.test.ts",
  ],
  "mcp-boundary": [
    "tests/boundary/mcp/apkSignature*.test.ts",
    "tests/boundary/mcp/artifact*.test.ts",
    "tests/boundary/mcp/rawBinaryMcp.test.ts",
    "tests/boundary/mcp/serverLifecycleMcp.test.ts",
    "tests/boundary/mcp/sessionMcp.test.ts",
  ],
  acceptance: [
    "tests/acceptance/apkSignature*.test.ts",
    "tests/acceptance/elfNotesCli.test.ts",
    "tests/acceptance/flutterAnalysis.test.ts",
    "tests/acceptance/sqliteDatabaseCli.test.ts",
    "tests/acceptance/applications/adb*.test.ts",
    "tests/acceptance/applications/android*.test.ts",
  ],
  "process-global": [
    "tests/process-global/runnerCancellation.test.ts",
    "tests/process-global/updateMaintenance.test.ts",
    "tests/process-global/windowsOwnedCommand.test.ts",
  ],
};

export const ANDROID_TEST_EXCLUDES = {
  adapters: [
    "src/artifacts/ZipArtifactReader.test.ts",
    "src/ghidra/GhidraDolLoadImage.test.ts",
    "src/ghidra/GhidraDolProfile.test.ts",
    "src/ghidra/GhidraDosComLoadImage.test.ts",
    "src/ghidra/GhidraDosSnapshot.test.ts",
    "src/ghidra/GhidraMipsProfile.test.ts",
    "src/ghidra/GhidraPeProfile.test.ts",
    "src/ghidra/GhidraPowerPcProfile.test.ts",
    "src/process/DarwinProcessRunTokenReader*.test.ts",
    "src/process/JavaScriptWorkerMemoryLimit.test.ts",
  ],
  composition: [
    "tests/composition/analysis-sessions/binarySessionAsarSelectedPath.test.ts",
    "tests/composition/analysis-sessions/managedApplicationGraph.test.ts",
    "tests/composition/analysis-sessions/powerpc-identity.test.ts",
  ],
  domain: ["src/domain/binaryTarget.powerpc.test.ts"],
  services: ["src/application/sqlite/SqliteDatabaseCapability.test.ts"],
};

const ALL_TEST_PROJECTS = [...SOURCE_TEST_PROJECTS, ...BUILT_TEST_PROJECTS];

/** Return the unique Vitest owner for an exact repository-relative test path. */
export const projectForTest = (testPath) => {
  if (
    typeof testPath !== "string" ||
    testPath.startsWith("/") ||
    testPath.includes("\\") ||
    testPath.split("/").some((part) => part === ".." || part === ".") ||
    !testPath.endsWith(".test.ts")
  )
    throw new Error(`Expected a normalized repository test path: ${testPath}`);

  const owners = ALL_TEST_PROJECTS.filter(
    ({ include, exclude = [] }) =>
      include.some((pattern) => matchesGlob(testPath, pattern)) &&
      !exclude.some((pattern) => matchesGlob(testPath, pattern)),
  );
  if (owners.length !== 1)
    throw new Error(
      owners.length === 0
        ? `No test project owns ${testPath}`
        : `Multiple test projects own ${testPath}: ${owners.map(({ name }) => name).join(", ")}`,
    );
  return owners[0];
};
