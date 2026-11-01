import type { EvidenceMcpServer } from "./EvidenceMcpServer.js";

import { createArtifactExtractionDestination } from "../application/artifacts/ArtifactExtractionDestination.js";
import { ANDROID_ARCHIVE_TOOL_CONTRACTS } from "../contracts/toolContracts.js";
import type { ToolContract } from "../contracts/toolContractTypes.js";
import type { AnalysisOperation } from "../application/AnalysisProvider.js";
import { registerEvidenceTools } from "./registerEvidenceTools.js";
import type { EvidenceToolFamilyOptions } from "./retainedSummaryDelivery.js";

/** Register deterministic artifact inventory and safe extraction operations. */
export const registerArtifactTools = (
  server: EvidenceMcpServer,
  options: EvidenceToolFamilyOptions,
): void => {
  registerEvidenceTools(
    server,
    ANDROID_ARCHIVE_TOOL_CONTRACTS as readonly ToolContract<
      Exclude<AnalysisOperation, "health">
    >[],
    {
      ...options,
      parametersForExecution: (operation, parameters) =>
        operation === "extract_artifact"
          ? {
              ...parameters,
              output_root: createArtifactExtractionDestination(),
            }
          : parameters,
    },
  );
};
