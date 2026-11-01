import { z } from "incur";
import type { Logger } from "pino";
import { CLI_COMMANDS } from "../cliCommandNames.js";
import { logCliCommand } from "../cliLogging.js";
import {
  createBinaryLayoutService,
  createByteEntropyService,
  createElfNotesService,
  createNativeExportsService,
} from "../composition/binaryDiagnostics.js";
import { projectAnalysisError } from "../domain/analysisErrorProjection.js";
import { withEvidenceCallerInputPath } from "../domain/evidence.js";
import { inspectBinaryLayoutInputSchema } from "../domain/native/binaryLayout.js";
import { inspectByteEntropyInputSchema } from "../domain/native/byteEntropy.js";
import { inspectElfNotesInputSchema } from "../domain/native/elfNotes.js";
import { inspectNativeExportsInputSchema } from "../domain/native/nativeExports.js";
import { localPathStringSchema } from "../domain/localPath.js";
import { absoluteCallerPath } from "../filesystem/callerPath.js";
import {
  analysisEvidenceDeliveryOptions,
  deliverCliAnalysisEvidence,
} from "./analysisEvidenceDelivery.js";
import { finishCliEvidenceCommand } from "./cliEvidenceCallerPath.js";
import { withCommandCancellation } from "./commandCancellation.js";
import { projectCliAnalysisResult } from "./projectCliAnalysisResult.js";
import type { CliInstance } from "./types.js";

/** Inspect Android-relevant ELF files through the shared CLI/MCP owners. */
export const registerBinaryDiagnosticsCommands = (
  cli: CliInstance,
  logger: Logger,
  environment: Readonly<NodeJS.ProcessEnv>,
): void => {
  cli.command(CLI_COMMANDS.inspectElfNotes, {
    description:
      "Inspect ELF PT_NOTE and SHT_NOTE identities without executing the image",
    args: z.object({
      path: localPathStringSchema.describe("Local ELF32/ELF64 image"),
    }),
    options: z.object({
      maxFileBytes: inspectElfNotesInputSchema.shape.max_file_bytes,
      maxEntries: inspectElfNotesInputSchema.shape.max_entries,
    }),
    run: ({ args, options }) =>
      withCommandCancellation(async (signal) => {
        const service = createElfNotesService();
        return logCliCommand(logger, CLI_COMMANDS.inspectElfNotes, () =>
          finishCliEvidenceCommand(
            args.path,
            () =>
              service.inspect(
                {
                  path: absoluteCallerPath(args.path),
                  max_file_bytes: options.maxFileBytes,
                  max_entries: options.maxEntries,
                },
                { signal },
              ),
            service,
            "rea-elf-notes",
            "inspect_elf_notes",
            signal,
          ).then(projectCliAnalysisResult),
        );
      }),
  });

  cli.command(CLI_COMMANDS.inspectNativeExports, {
    description:
      "Inspect an ELF image's export table without executing the library",
    args: z.object({
      path: localPathStringSchema.describe("Local ELF image"),
    }),
    options: z.object({
      maxFileBytes: inspectNativeExportsInputSchema.shape.max_file_bytes,
      ...analysisEvidenceDeliveryOptions,
    }),
    run: ({ args, options }) =>
      withCommandCancellation(async (signal) => {
        const service = createNativeExportsService();
        return logCliCommand(logger, CLI_COMMANDS.inspectNativeExports, () =>
          deliverCliAnalysisEvidence({
            callerInputPath: args.path,
            run: () =>
              service.inspect(
                {
                  path: absoluteCallerPath(args.path),
                  max_file_bytes: options.maxFileBytes,
                },
                { signal },
              ),
            service,
            providerId: "rea-native-exports",
            operation: "inspect_native_exports",
            signal,
            detail: options.detail,
            evidenceOutput: options.evidence_output,
          }),
        );
      }),
  });

  cli.command(CLI_COMMANDS.inspectByteEntropy, {
    description:
      "Inspect file-wide and block byte entropy without executing the file",
    args: z.object({ path: localPathStringSchema.describe("Local file") }),
    options: z.object({
      blockSize: inspectByteEntropyInputSchema.shape.block_size,
      offset: inspectByteEntropyInputSchema.shape.offset,
      length: inspectByteEntropyInputSchema.shape.length,
    }),
    run: ({ args, options }) =>
      withCommandCancellation(async (signal) => {
        const service = createByteEntropyService();
        return logCliCommand(logger, CLI_COMMANDS.inspectByteEntropy, () =>
          finishCliEvidenceCommand(
            args.path,
            () =>
              service.inspect(
                {
                  path: absoluteCallerPath(args.path),
                  block_size: options.blockSize,
                  offset: options.offset,
                  length: options.length,
                },
                { signal },
              ),
            service,
            "rea-byte-entropy",
            "inspect_byte_entropy",
            signal,
          ).then(projectCliAnalysisResult),
        );
      }),
  });

  const service = createBinaryLayoutService(environment);
  cli.command(CLI_COMMANDS.inspectBinaryLayout, {
    description:
      "Inspect ELF file/linked layout without executing the selected object",
    args: z.object({
      path: localPathStringSchema.describe(
        "Local ELF binary or relocatable object",
      ),
    }),
    options: z.object({
      pwntoolsTimeoutMs:
        inspectBinaryLayoutInputSchema.shape.pwntools_timeout_ms,
    }),
    run: ({ args, options }) =>
      withCommandCancellation((signal) =>
        logCliCommand(logger, CLI_COMMANDS.inspectBinaryLayout, async () => {
          const result = await service.inspectAndClose(
            {
              path: absoluteCallerPath(args.path),
              ...(options.pwntoolsTimeoutMs === undefined
                ? {}
                : { pwntools_timeout_ms: options.pwntoolsTimeoutMs }),
            },
            { signal },
          );
          return result.ok
            ? withEvidenceCallerInputPath(result.value, args.path)
            : projectAnalysisError(result.error);
        }),
      ),
  });
};
