import type { ArtifactResourceScope } from "../artifacts/ArtifactResourceScope.js";
import type { BinarySessionPort } from "../application/binary/BinarySessionPort.js";
import { binaryTargetSummary } from "../application/binary/BinaryTargetSummary.js";
import {
  getNavigationContext,
  inspectAddressContext,
} from "../application/AnalysisContextQueries.js";
import type { ProviderAvailability } from "../application/AnalysisProvider.js";
import type { AvailabilityPolicy } from "../application/CapabilityInventory.js";
import { toolContract } from "../contracts/toolContracts.js";
import type { AnalysisError } from "../domain/analysisErrorBase.js";
import { ok, type Result } from "../domain/result.js";
import type { Logger } from "pino";
import type { EvidenceMcpServer } from "./EvidenceMcpServer.js";
import { logToolExecution } from "./toolLogging.js";
import { toolRegistrationOptions } from "./toolRegistrationOptions.js";
import { registerArtifactComparisonTool } from "./registerArtifactComparisonTool.js";
import { registerBundleComparisonTool } from "./registerBundleComparisonTool.js";
import { registerCloseLifecycleTool } from "./registerCloseLifecycleTool.js";
import { registerFunctionComparisonTool } from "./registerFunctionComparisonTool.js";
import { registerInvestigationTools } from "./registerInvestigationTools.js";
import { registerNativeFunctionMatchingTool } from "./registerNativeFunctionMatchingTool.js";
import {
  registerEvidenceTools,
  registerUnknownTools,
} from "./registerSessionRecordTools.js";
import {
  registerSessionStatusTool,
  type SessionAvailabilityProbes,
} from "./registerSessionStatusTool.js";
import { sessionAvailabilityPolicy } from "./sessionAvailabilityPolicy.js";

export interface LifecycleToolRegistration extends SessionAvailabilityProbes {
  readonly server: EvidenceMcpServer;
  readonly session: BinarySessionPort;
  readonly logger: Logger;
  readonly openContract: ReturnType<typeof toolContract<"open_binary">>;
  readonly closeContract: ReturnType<typeof toolContract<"close_binary">>;
  readonly statusContract: ReturnType<typeof toolContract<"binary_session">>;
  readonly startedAt: string;
  readonly availabilityPolicy: () => AvailabilityPolicy;
  readonly closeProcessResources: () => Promise<Result<null, AnalysisError>>;
}

export interface SessionToolOptions extends Partial<SessionAvailabilityProbes> {
  readonly artifactResources: ArtifactResourceScope;
  readonly environment: Readonly<NodeJS.ProcessEnv>;
  readonly startedAt?: string;
  readonly availabilityPolicy?: () => AvailabilityPolicy;
}

/** Register Android/native lifecycle, Evidence, comparison, and context tools. */
export const registerSessionTools = (
  server: EvidenceMcpServer,
  session: BinarySessionPort,
  logger: Logger,
  options: SessionToolOptions,
): void => {
  const openContract = toolContract("open_binary");
  const closeContract = toolContract("close_binary");
  const statusContract = toolContract("binary_session");
  const exportContract = toolContract("export_evidence_bundle");
  const importContract = toolContract("import_evidence_bundle");
  const compareArtifactsContract = toolContract("compare_artifacts");
  const compareFunctionsContract = toolContract("compare_functions");
  const compareBundlesContract = toolContract("compare_bundles");
  const snapshotContract = toolContract("get_evidence_bundle");

  server.registerTool(
    openContract.name,
    toolRegistrationOptions(openContract),
    async (input, context) => {
      const snapshotPath = input.snapshot_path;
      const opened = await logToolExecution(logger, openContract.name, () =>
        session.open(input.path, {
          signal: context.mcpReq.signal,
          ...(input.format === undefined ? {} : { formatHint: input.format }),
          ...(input.architecture === undefined
            ? {}
            : { architecture: input.architecture }),
          ...(input.entry_point === undefined
            ? {}
            : { entryPoint: input.entry_point }),
          ...(input.provider_id === undefined
            ? {}
            : { providerId: input.provider_id }),
          ...(snapshotPath === undefined
            ? {}
            : {
                loadSnapshot: () =>
                  session.readAnalysisSnapshot(
                    snapshotPath,
                    context.mcpReq.signal,
                  ),
              }),
        }),
      );
      return opened.ok
        ? server.delivery.toCallToolResult(
            { ok: true, value: binaryTargetSummary(opened.value) },
            openContract,
          )
        : server.delivery.toCallToolResult(opened, openContract);
    },
  );

  registerCloseLifecycleTool({
    ...options,
    server,
    session,
    logger,
    openContract,
    closeContract,
    statusContract,
    startedAt: options.startedAt ?? new Date().toISOString(),
    availabilityPolicy: sessionAvailabilityPolicy(
      options.availabilityPolicy,
      {},
    ),
    androidAnalysisAvailability:
      options.androidAnalysisAvailability ?? missingAndroidAvailability,
    closeProcessResources: async () => ok(null),
  });
  registerSessionStatusTool({
    ...options,
    server,
    session,
    contract: statusContract,
    startedAt: options.startedAt ?? new Date().toISOString(),
    availabilityPolicy: sessionAvailabilityPolicy(
      options.availabilityPolicy,
      {},
    ),
    androidAnalysisAvailability:
      options.androidAnalysisAvailability ?? missingAndroidAvailability,
  });

  registerEvidenceTools({
    server,
    session,
    resources: options.artifactResources,
    exportContract,
    importContract,
    snapshotContract,
  });
  registerArtifactComparisonTool(
    server,
    session,
    compareArtifactsContract,
    options.artifactResources,
  );
  registerFunctionComparisonTool(server, session, compareFunctionsContract);
  registerNativeFunctionMatchingTool(
    server,
    session,
    logger,
    options.environment,
  );
  registerBundleComparisonTool(
    server,
    session,
    compareBundlesContract,
    options.artifactResources,
  );
  registerInvestigationTools(server, session);
  registerUnknownTools({ server, session });
  registerContextTools(server, session);
};

const registerContextTools = (
  server: EvidenceMcpServer,
  session: BinarySessionPort,
): void => {
  const navigationContract = toolContract("get_navigation_context");
  const addressContract = toolContract("inspect_address_context");
  server.registerTool(
    navigationContract.name,
    toolRegistrationOptions(navigationContract),
    async (input, context) => {
      const admitted = await session.withAdmittedAnalysis(
        navigationContract.name,
        context.mcpReq.signal,
        async (analysis) =>
          server.delivery.toCallToolResult(
            await getNavigationContext(analysis, input, context.mcpReq.signal),
            navigationContract,
          ),
      );
      return admitted.ok
        ? admitted.value
        : server.delivery.toCallToolResult(admitted, navigationContract);
    },
  );
  server.registerTool(
    addressContract.name,
    toolRegistrationOptions(addressContract),
    async (input, context) => {
      const admitted = await session.withAdmittedAnalysis(
        addressContract.name,
        context.mcpReq.signal,
        async (analysis) =>
          server.delivery.toCallToolResult(
            await inspectAddressContext(analysis, input, context.mcpReq.signal),
            addressContract,
          ),
      );
      return admitted.ok
        ? admitted.value
        : server.delivery.toCallToolResult(admitted, addressContract);
    },
  );
};

const missingAndroidAvailability = async (): Promise<ProviderAvailability> => ({
  status: "unavailable",
  code: "not_configured",
  reason:
    "Set REA_JADX_MCP_JAR to a caller-supplied jadx-headless-mcp 0.7.1 JAR and provide a full JDK on Linux, macOS, or Windows x64 with its matching bundled native controls.",
  diagnostics: { configured: false },
});
