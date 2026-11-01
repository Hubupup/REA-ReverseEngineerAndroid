import { z } from "incur";
import type { Logger } from "pino";
import { createArtifactExtractionDestination } from "../application/artifacts/ArtifactExtractionDestination.js";
import { CLI_COMMANDS } from "../cliCommandNames.js";
import { logCliCommand } from "../cliLogging.js";
import type { DirectAnalysis } from "../composition/directAnalysis.js";
import { projectAnalysisError } from "../domain/analysisErrorProjection.js";
import { ARTIFACT_GRAPH_PROVIDER } from "../domain/investigationProviders.js";
import {
  analysisEvidenceDeliveryOptions,
  cliEvidenceDeliveryInputError,
  publishCliAnalysisEvidence,
} from "./analysisEvidenceDelivery.js";
import { registerArtifactComparisonCommand } from "./artifactComparisonCommand.js";
import { withCommandCancellation } from "./commandCancellation.js";
import { projectCliAnalysisResult } from "./projectCliAnalysisResult.js";
import type { CliInstance } from "./types.js";

export const registerArtifactCommands = (
  cli: CliInstance,
  logger: Logger,
  runProviderAnalysis: DirectAnalysis["runProviderAnalysis"],
): void => {
  cli.command(CLI_COMMANDS.extractArtifact, {
    description:
      "Extract regular contents of a supported Android/package artifact",
    args: z.object({
      path: z.string().describe("Application or package path"),
    }),
    options: z.object({
      integrityPolicy: z.enum(["fail", "record-and-continue"]).default("fail"),
    }),
    run: ({ args, options }) =>
      logCliCommand(logger, CLI_COMMANDS.extractArtifact, () =>
        runProviderAnalysis(
          args.path,
          "extract_artifact",
          {
            integrity_policy: options.integrityPolicy,
            output_root: createArtifactExtractionDestination(),
          },
          logger,
        ).then(projectCliAnalysisResult),
      ),
  });

  cli.command(CLI_COMMANDS.inspectArtifact, {
    description:
      "Inspect one artifact and return Android-relevant inventory observations",
    args: z.object({
      path: z.string().min(1).describe("Application or package path"),
    }),
    options: z.object({
      ...analysisEvidenceDeliveryOptions,
      integrityPolicy: z.enum(["fail", "record-and-continue"]).default("fail"),
    }),
    run: ({ args, options }) =>
      logCliCommand(logger, CLI_COMMANDS.inspectArtifact, () =>
        withCommandCancellation(async (signal) => {
          const delivery = {
            providerId: ARTIFACT_GRAPH_PROVIDER.id,
            operation: "inspect_artifact",
            signal,
            detail: options.detail,
            evidenceOutput: options.evidence_output,
          };
          const inputError = cliEvidenceDeliveryInputError(delivery);
          if (inputError !== undefined) return projectAnalysisError(inputError);
          const complete = await runProviderAnalysis(
            args.path,
            "inspect_artifact",
            { integrity_policy: options.integrityPolicy },
            logger,
            signal,
          );
          return publishCliAnalysisEvidence(complete, delivery);
        }),
      ),
  });

  registerArtifactComparisonCommand(cli, logger);
};
