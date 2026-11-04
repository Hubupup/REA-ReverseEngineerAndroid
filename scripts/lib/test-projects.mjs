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
  domain: ["src/{contracts,domain}/**/*.test.ts"],
  services: ["src/application/**/*.test.ts"],
  adapters: [
    "src/*.test.ts",
    "src/{android,apkSignature,apktool,jeb,adb,artifacts,browser,config,cutter,dotnet,electron,erlang,evm,firmware,flutter,pcap,ghidra,go,gpu,hopper,ida,inspector,javascript,main,native,process,providers,python,reference,rust,server,sqlite,wasm,windows}/**/*.test.ts",
  ],
  composition: ["tests/composition/**/*.test.ts"],
  conformance: ["tests/conformance/**/*.test.ts"],
  evaluation: ["tests/evaluation/**/*.test.ts"],
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
  acceptance: [
    // SQLite remains covered by source service/parser tests, but its built CLI
    // lane exercises a tool family that is not part of the Android catalog.
    "tests/acceptance/sqliteDatabaseCli.test.ts",
  ],
  adapters: [
    "src/cliBundleResource.test.ts",
    "src/doctorRuntime.test.ts",
    "src/nativeDeadlineFlags.test.ts",
    "src/server/BundleResourcesMcp.test.ts",
    "src/server/JavaScriptRouteAdvertisedSchema.test.ts",
    "src/server/registerGuidedWorkflowTool.test.ts",
    "src/artifacts/Asar*.test.ts",
    "src/artifacts/EspImageArtifactReader*.test.ts",
    "src/artifacts/FitArtifactReader.test.ts",
    "src/artifacts/MachO*.test.ts",
    "src/artifacts/NativeDmg*.test.ts",
    "src/artifacts/NodeSeaArtifactReader.test.ts",
    "src/artifacts/UImageArtifactReader*.test.ts",
    "src/artifacts/ZipArtifactReader.test.ts",
    "src/artifacts/apple/**/*.test.ts",
    "src/artifacts/fit/**/*.test.ts",
    "src/artifacts/nodeSea/**/*.test.ts",
    "src/browser/**/*.test.ts",
    "src/config/captureDecoderHeap.test.ts",
    "src/cutter/**/*.test.ts",
    "src/electron/**/*.test.ts",
    "src/erlang/**/*.test.ts",
    "src/evm/**/*.test.ts",
    "src/firmware/**/*.test.ts",
    "src/ghidra/GhidraDolLoadImage.test.ts",
    "src/ghidra/GhidraDolProfile.test.ts",
    "src/ghidra/GhidraDosComLoadImage.test.ts",
    "src/ghidra/GhidraDosSnapshot.test.ts",
    "src/ghidra/GhidraMipsProfile.test.ts",
    "src/ghidra/GhidraPeProfile.test.ts",
    "src/ghidra/GhidraPowerPcProfile.test.ts",
    "src/gpu/**/*.test.ts",
    "src/hopper/**/*.test.ts",
    "src/inspector/**/*.test.ts",
    "src/javascript/recovery/**/*.test.ts",
    "src/javascript/sourceMaps/**/*.test.ts",
    "src/native/Apple*.test.ts",
    "src/native/Macho*.test.ts",
    "src/native/NativeMacho*.test.ts",
    "src/native/NativeMacOSProviderInput.test.ts",
    "src/native/NativePlistResourceRoot.test.ts",
    "src/native/NativeUi*.test.ts",
    "src/native/apple/**/*.test.ts",
    "src/native/metadata/PeImage.test.ts",
    "src/native/parsers/lipo.test.ts",
    "src/native/parsers/plist.test.ts",
    "src/native/pe/**/*.test.ts",
    "src/process/DarwinProcessRunTokenReader*.test.ts",
    "src/process/JavaScriptWorkerMemoryLimit.test.ts",
    "src/wasm/**/*.test.ts",
    "src/windows/**/*.test.ts",
  ],
  composition: [
    "tests/composition/analysis-sessions/binarySessionAsarSelectedPath.test.ts",
    "tests/composition/analysis-sessions/managedApplicationGraph.test.ts",
    "tests/composition/analysis-sessions/powerpc-identity.test.ts",
  ],
  conformance: [
    "tests/conformance/formats/mzPeAdmission.test.ts",
    "tests/conformance/contracts/targetContentProvenance.test.ts",
    "tests/conformance/providers/hopper/**/*.test.ts",
    "tests/conformance/providers/managed/**/*.test.ts",
    "tests/conformance/releaseConfiguration.test.ts",
  ],
  domain: [
    "src/contracts/analysisDetail.test.ts",
    "src/contracts/erlangBeamDeliveryContracts.test.ts",
    "src/contracts/javascriptRouteDeliveryContracts.test.ts",
    "src/contracts/pythonPycDeliveryContracts.test.ts",
    "src/contracts/toolEffects.test.ts",
    "src/contracts/toolInputReferences.test.ts",
    "src/contracts/workflowInputContracts.test.ts",
    "src/domain/apple/**/*.test.ts",
    "src/domain/analysisView/WebNetwork*.test.ts",
    "src/domain/analysisView/gpuCodeObjectsView.test.ts",
    "src/domain/analysisView/interfaceBuilderView.test.ts",
    "src/domain/analysisView/machoView.test.ts",
    "src/domain/analysisView/scenarioCaptureRecords.test.ts",
    "src/domain/analysisView/webBundleView.test.ts",
    "src/domain/analysisView/webNetwork*.test.ts",
    "src/domain/binaryTarget.powerpc.test.ts",
    "src/domain/electron/**/*.test.ts",
    "src/domain/erlang/**/*.test.ts",
    "src/domain/evm/**/*.test.ts",
    "src/domain/firmware/**/*.test.ts",
    "src/domain/gpu/**/*.test.ts",
    "src/domain/javascript/*Electron*.test.ts",
    "src/domain/javascript/electron*.test.ts",
    "src/domain/native/Apple*.test.ts",
    "src/domain/native/machoSymbolName.test.ts",
    "src/domain/native/nativeAot*.test.ts",
    "src/domain/native/objcSwiftMetadata.test.ts",
    "src/domain/native/pe*.test.ts",
    "src/domain/pe*.test.ts",
    "src/domain/propertyList*.test.ts",
    "src/domain/web*.test.ts",
    "src/domain/windowsNativeArtifact.test.ts",
    "src/domain/symbolAnalysis.objcClasses.test.ts",
  ],
  evaluation: [
    "tests/evaluation/model-evals/**/*.test.ts",
    "tests/evaluation/package/nativeAot*.test.ts",
    "tests/evaluation/positionalToolContractRule.test.ts",
  ],
  services: [
    "src/application/Browser*.test.ts",
    "src/application/HopperReleaseFeed.test.ts",
    "src/application/LinuxHopper*.test.ts",
    "src/application/MacHopper*.test.ts",
    "src/application/Web*.test.ts",
    "src/application/analysisView/BrowserScenarioViews.test.ts",
    "src/application/binaryDiagnostics/AppleIpsService.test.ts",
    "src/application/binaryDiagnostics/Pe*.test.ts",
    "src/application/electron/**/*.test.ts",
    "src/application/erlang/**/*.test.ts",
    "src/application/evm/**/*.test.ts",
    "src/application/firmware/**/*.test.ts",
    "src/application/javascript/Electron*.test.ts",
    "src/application/javascript/JavaScriptSemanticGraphElectronProjection.test.ts",
    "src/application/javascript/JavaScriptRecoveryService.test.ts",
    "src/application/javascript/JavaScriptRuntimeObservationService.test.ts",
    "src/application/managed/**/*.test.ts",
    "src/application/CapabilityInventory.test.ts",
    "src/application/sqlite/SqliteDatabaseCapability.test.ts",
    "src/application/wasm/**/*.test.ts",
  ],
  "mcp-boundary": [
    "tests/boundary/mcp/artifactMcp*.test.ts",
    "tests/boundary/mcp/serverLifecycleMcp.test.ts",
    "tests/boundary/mcp/sessionMcp.test.ts",
  ],
  "process-boundary": [
    // These built tests execute removed public process-capability commands or
    // compiled modules that are intentionally absent from the Android package.
    "tests/boundary/process/ownedDebuggerSession.test.ts",
    "tests/boundary/process/processCapture*.test.ts",
    "tests/boundary/process/processCleanupRecoveryCli.test.ts",
    "tests/boundary/process/processCli.test.ts",
    "tests/boundary/process/processDescendant*.test.ts",
    "tests/boundary/process/processFilesystemCoverageAdapters.test.ts",
    "tests/boundary/process/processSessionMcp.test.ts",
    "tests/boundary/process/processSnapshotCleanupCli.test.ts",
    "tests/boundary/process/processTruncationAdapters.test.ts",
  ],
  "process-global": ["tests/process-global/updateMaintenance.test.ts"],
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
