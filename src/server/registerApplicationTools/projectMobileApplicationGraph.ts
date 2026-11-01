import type { EvidenceMcpServer } from "../EvidenceMcpServer.js";
import type { ServerContext } from "@modelcontextprotocol/server";
import { runAdmittedToolOperation } from "../admittedToolOperation.js";

import { projectAndroidApplicationEvidence } from "../../application/android/AndroidApplicationService.js";
import { APPLICATION_TOOL_CONTRACTS } from "../../contracts/applicationToolContracts.js";
import { toolContract } from "../../contracts/toolContracts.js";
import type { AnalysisError } from "../../domain/analysisErrorBase.js";
import type { Result } from "../../domain/result.js";
import type { InventoryProjectionEvidenceResult } from "../../application/InventoryProjectionEvidence.js";
import { recordEvidenceSources } from "../../application/investigation/recordEvidenceSources.js";
import { logToolExecution } from "../toolLogging.js";
import { toolRegistrationOptions } from "../toolRegistrationOptions.js";
import { recordResult } from "./helpers.js";
import type { ApplicationToolRegistration } from "./types.js";

/** Register execution-free mobile application inventory projection tools. */
export const registerProjectMobileApplicationGraphTools = (
  server: EvidenceMcpServer,
  options: ApplicationToolRegistration,
): void => {
  registerProjection({
    server,
    options,
    contract: toolContract("project_android_application_graph"),
    project: projectAndroidApplicationEvidence,
  });
};

const registerProjection = (context: {
  readonly server: EvidenceMcpServer;
  readonly options: ApplicationToolRegistration;
  readonly contract: (typeof APPLICATION_TOOL_CONTRACTS)[number];
  readonly project: (
    input: unknown,
  ) => Result<InventoryProjectionEvidenceResult, AnalysisError>;
}): void => {
  const { server, options, contract, project } = context;
  server.registerTool(
    contract.name,
    toolRegistrationOptions(contract),
    async (input: unknown, request: ServerContext) =>
      runAdmittedToolOperation(
        server,
        options.withAdmittedAnalysis,
        contract.name,
        request.mcpReq.signal,
        async () => {
          const result = await logToolExecution(
            options.logger,
            contract.name,
            () => Promise.resolve(project(input)),
          );
          if (!result.ok)
            return server.delivery.toCallToolResult(result, contract);
          const recordedSources = recordEvidenceSources(
            options.recordEvidence,
            result.value.sources,
          );
          if (!recordedSources.ok)
            return server.delivery.toCallToolResult(recordedSources, contract);
          return recordResult(
            { ...options, delivery: server.delivery },
            contract,
            result.value.evidence,
          );
        },
      ),
  );
};
