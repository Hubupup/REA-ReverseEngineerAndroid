import type { EvidenceMcpServer } from "./EvidenceMcpServer.js";

import { registerProjectMobileApplicationGraphTools } from "./registerApplicationTools/projectMobileApplicationGraph.js";
import type { ApplicationToolRegistration } from "./registerApplicationTools/types.js";
import { registerGuidanceTools } from "./registerGuidanceTools.js";
import { registerGuidedWorkflowTool } from "./registerGuidedWorkflowTool.js";

/** Register Android guidance and application-graph workflows. */
export const registerApplicationTools = (
  server: EvidenceMcpServer,
  options: ApplicationToolRegistration,
): void => {
  registerGuidanceTools(server, options.artifactResources);
  registerGuidedWorkflowTool(server);
  registerProjectMobileApplicationGraphTools(server, options);
};
