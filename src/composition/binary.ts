import type { AnalysisSettingsReader } from "../domain/analysisSettings.js";
import { runtimeAnalysisConfig } from "../config/runtimeAnalysisSettings.js";
import { snapshotEnvironment } from "../process/snapshotEnvironment.js";
import type { AppConfig } from "../config/types.js";
import type { BinarySession } from "../application/binary/BinarySession.js";
import { GhidraProvider } from "../ghidra/GhidraProvider.js";
import { IdaProvider } from "../ida/IdaProvider.js";
import type { Logger } from "pino";
import { AnalysisProviderRegistry } from "../application/binary/AnalysisProviderRegistry.js";
import { composeBinarySession } from "../application/binary/BinarySessionComposition.js";
import { LazyAnalysisProvider } from "../application/binary/LazyAnalysisProvider.js";
import type { AnalysisProvider } from "../application/AnalysisProvider.js";
import { ManagedStaticProvider } from "../dotnet/ManagedStaticProvider.js";
import { artifactCapabilities } from "../artifacts/ArtifactProviderMetadata.js";
import { ARTIFACT_GRAPH_PROVIDER } from "../domain/investigationProviders.js";

/** Artifact operations published by the Android-only MCP surface. */
const ANDROID_ARTIFACT_OPERATIONS: ReadonlySet<string> = new Set([
  "inspect_artifact",
  "extract_artifact",
]);

/**
 * Compose the target-switching runtime shared directly by CLI and MCP adapters.
 * This is the sole production wiring point, so both adapters share identical
 * provider selection, profile, lifecycle, and Evidence semantics.
 */
export const createBinarySession = (
  config: AppConfig,
  logger: Logger,
  selectedEnvironment: Readonly<NodeJS.ProcessEnv>,
  settings?: AnalysisSettingsReader,
): BinarySession =>
  composeDeepBinarySession(
    runtimeAnalysisConfig(config, settings),
    logger,
    selectedEnvironment,
    undefined,
    settings,
  );

/** Prefer byte-backed dispatch inspection while retaining deep symbol fallback. */
export const createNativeDispatchBinarySession = (
  config: AppConfig,
  logger: Logger,
  selectedEnvironment: Readonly<NodeJS.ProcessEnv>,
): BinarySession =>
  composeDeepBinarySession(
    config,
    logger,
    selectedEnvironment,
    "inspect_native_dispatch_metadata",
  );

const composeDeepBinarySession = (
  config: AppConfig,
  logger: Logger,
  selectedEnvironment: Readonly<NodeJS.ProcessEnv>,
  inspection?: "inspect_native_dispatch_metadata",
  settings?: AnalysisSettingsReader,
): BinarySession => {
  const environment = snapshotEnvironment(selectedEnvironment);
  const ghidra = new GhidraProvider(config, logger, environment);
  const ida = new IdaProvider(config, environment);
  return composeBinarySession(
    new AnalysisProviderRegistry(
      [ghidra, ida],
      config.analysisProvider,
      undefined,
    ),
    [artifactAuxiliaryProvider(environment, settings)],
    undefined,
  );
};

/**
 * Serve the allowlisted archive operations without adding deep-engine
 * candidates. The provider loads only when an artifact operation first runs.
 */
const artifactAuxiliaryProvider = (
  environment: Readonly<NodeJS.ProcessEnv>,
  settings?: AnalysisSettingsReader,
): AnalysisProvider =>
  new LazyAnalysisProvider({
    identity: ARTIFACT_GRAPH_PROVIDER,
    capabilities: artifactCapabilities(process.platform).filter(
      ({ operation }) => ANDROID_ARTIFACT_OPERATIONS.has(operation),
    ),
    load: async () => {
      const { ArtifactProvider } =
        await import("../artifacts/ArtifactProvider.js");
      return new ArtifactProvider(environment, process.platform, settings);
    },
  });

/** Compose an execution-free managed session without native provider selection. */
export const createManagedBinarySession = (): BinarySession =>
  composeBinarySession(new AnalysisProviderRegistry([]), [
    new ManagedStaticProvider(),
  ]);

/** Compose the artifact operations without candidates for deep analysis engines. */
export const createArtifactBinarySession = (
  selectedEnvironment: Readonly<NodeJS.ProcessEnv>,
  platform: NodeJS.Platform = process.platform,
): Promise<BinarySession> =>
  import("../artifacts/ArtifactProvider.js").then(({ ArtifactProvider }) =>
    composeBinarySession(
      new AnalysisProviderRegistry([]),
      [
        new ArtifactProvider(
          snapshotEnvironment(selectedEnvironment, platform),
          platform,
        ),
      ],
      undefined,
    ),
  );

/** Compose native inspection utilities without candidates for deep analysis. */
export const createNativeBinarySession = (
  selectedEnvironment: Readonly<NodeJS.ProcessEnv>,
  platform: NodeJS.Platform = process.platform,
): Promise<BinarySession> =>
  import("../native/NativeMacOSProvider.js").then(({ NativeMacOSProvider }) =>
    composeBinarySession(
      new AnalysisProviderRegistry([]),
      [
        new NativeMacOSProvider(
          snapshotEnvironment(selectedEnvironment, platform),
          undefined,
          platform,
        ),
      ],
      undefined,
    ),
  );
