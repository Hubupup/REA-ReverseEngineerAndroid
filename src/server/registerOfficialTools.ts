import type { EvidenceMcpServer } from "./EvidenceMcpServer.js";
import { ANDROID_OFFICIAL_TOOL_CONTRACTS } from "../contracts/toolContracts.js";
import { registerEvidenceTools } from "./registerEvidenceTools.js";
import type { EvidenceToolFamilyOptions } from "./retainedSummaryDelivery.js";

/** Direct tools share Evidence recording/projection with the other provider-backed tools. */
export const registerOfficialTools = (
  server: EvidenceMcpServer,
  options: EvidenceToolFamilyOptions,
): void => {
  registerEvidenceTools(server, ANDROID_OFFICIAL_TOOL_CONTRACTS, options);
};
