import { AnalysisSettings } from "../application/AnalysisSettings.js";
import type { AndroidAnalysisPort } from "../application/android/AndroidAnalysisPort.js";
import { AndroidAnalysisService } from "../application/android/AndroidAnalysisService.js";
import type { AdbDeviceAnalysisPort } from "../application/adb/AdbDeviceAnalysisPort.js";
import { AdbDeviceAnalysisService } from "../application/adb/AdbDeviceAnalysisService.js";
import type { ApkSignatureService } from "../application/apkSignature/ApkSignatureService.js";
import type { ApktoolResourceAnalysisPort } from "../application/apktool/ApktoolResourceAnalysisPort.js";
import { ApktoolResourceAnalysisService } from "../application/apktool/ApktoolResourceAnalysisService.js";
import type { BinaryLayoutService } from "../application/binaryDiagnostics/BinaryLayoutService.js";
import type { ByteEntropyService } from "../application/binaryDiagnostics/ByteEntropyService.js";
import type { ElfNotesService } from "../application/binaryDiagnostics/ElfNotesService.js";
import type { NativeExportsService } from "../application/binaryDiagnostics/NativeExportsService.js";
import type { BinarySessionPort } from "../application/binary/BinarySessionPort.js";
import type { FlutterBuildAnalysisPort } from "../application/flutter/FlutterBuildAnalysisPort.js";
import { FlutterBuildAnalysisService } from "../application/flutter/FlutterBuildAnalysisService.js";
import type { FridaInstrumentationPort } from "../application/frida/FridaInstrumentationPort.js";
import type { JebAnalysisPort } from "../application/jeb/JebAnalysisPort.js";
import { JebAnalysisService } from "../application/jeb/JebAnalysisService.js";
import { ArtifactResourceScope } from "../artifacts/ArtifactResourceScope.js";
import { catalogIdentityForToolFamilies } from "../catalogIdentity.js";
import { apkSignatureModule } from "../composition/apkSignature.js";
import { createAndroidAnalysisProvider } from "../composition/android.js";
import { createAdbDeviceAnalysisProvider } from "../composition/adb.js";
import { createApktoolResourceAnalysisProvider } from "../composition/apktool.js";
import {
  createBinaryLayoutService,
  createByteEntropyService,
  createElfNotesService,
  createNativeExportsService,
} from "../composition/binaryDiagnostics.js";
import { createFlutterBuildAnalysisProvider } from "../composition/flutter.js";
import { createJebAnalysisProvider } from "../composition/jeb.js";
import {
  compactPresentationForMcpInputSchemaProfile,
  parseMcpInputSchemaProfile,
} from "../config/mcpInputSchemaProfile.js";
import { parseMcpInputBudget } from "../config/mcpInputBudget.js";
import {
  parseMcpOutputSchemaProfile,
  type McpOutputSchemaProfile,
} from "../config/mcpOutputSchemaProfile.js";
import { parseMcpResponseBudget } from "../config/mcpResponseBudget.js";
import { parseMcpToolFamilies } from "../config/mcpToolFamilies.js";
import type { CompactInputSchemaPresentation } from "../contracts/compactInputSchema.js";
import { FridaInstrumentationManager } from "../frida/FridaInstrumentationManager.js";
import { PRODUCT_IDENTITY } from "../identity.js";
import { silentLogger } from "../logger.js";
import { snapshotEnvironment } from "../process/snapshotEnvironment.js";
import type { Logger } from "pino";
import {
  withAdmittedAnalysis,
  type ServerAnalysisSource,
  type WithAdmittedAnalysis,
} from "./analysisAdmission.js";
import { EvidenceMcpServer } from "./EvidenceMcpServer.js";
import { captureProviderEnvironment } from "./providerEnvironment.js";
import { registerAdbTools } from "./registerAdbTools.js";
import { registerAnalysisSettingsTools } from "./registerAnalysisSettingsTools.js";
import { registerAnalysisViewTool } from "./registerAnalysisViewTool.js";
import { registerAndroidTools } from "./registerAndroidTools.js";
import { registerApkSignatureTools } from "./registerApkSignatureTools.js";
import { registerApktoolTools } from "./registerApktoolTools.js";
import { registerApplicationTools } from "./registerApplicationTools.js";
import { registerArtifactTools } from "./registerArtifactTools.js";
import { registerBinaryDiagnosticsTools } from "./registerBinaryDiagnosticsTools.js";
import { registerElfNotesTool } from "./registerElfNotesTool.js";
import { registerEnhancedTools } from "./registerEnhancedTools.js";
import { registerFlutterTools } from "./registerFlutterTools.js";
import { registerFridaTools } from "./registerFridaTools.js";
import { registerJebTools } from "./registerJebTools.js";
import { registerNativeExportsTool } from "./registerNativeExportsTool.js";
import { registerOfficialTools } from "./registerOfficialTools.js";
import { registerGuidedPrompts } from "./registerPrompts.js";
import { registerSessionTools } from "./registerSessionTools.js";
import { createToolResultDelivery } from "./toolResult.js";
import type { ToolResultDelivery } from "./ToolResultDelivery.js";
import { serverInstructions } from "./serverInstructions.js";

/** Server services accepted for tests and embedders. Unknown old fields remain tolerated. */
export interface CreateServerOptions {
  readonly analysisSettings?: AnalysisSettings;
  readonly startedAt?: string;
  readonly mcpServer?: EvidenceMcpServer;
  readonly environment?: Readonly<NodeJS.ProcessEnv>;
  readonly providerEnvironment?: Readonly<NodeJS.ProcessEnv>;
  readonly delivery?: ToolResultDelivery;
  readonly logger?: Logger;
  readonly androidAnalysis?: AndroidAnalysisPort;
  readonly apkSignature?: ApkSignatureService;
  readonly apktoolAnalysis?: ApktoolResourceAnalysisPort;
  readonly flutterAnalysis?: FlutterBuildAnalysisPort;
  readonly jebAnalysis?: JebAnalysisPort;
  readonly adbDeviceAnalysis?: AdbDeviceAnalysisPort;
  readonly fridaInstrumentation?: FridaInstrumentationPort;
  readonly binaryLayout?: BinaryLayoutService;
  readonly elfNotes?: ElfNotesService;
  readonly nativeExports?: NativeExportsService;
  readonly byteEntropy?: ByteEntropyService;
  readonly [removedProviderOption: string]: unknown;
}

/**
 * Construct one Android-only MCP server without acquiring subprocess resources.
 * A session source adds lifecycle and Evidence tools; a fixed source is retained
 * for focused tests and embedders.
 */
export const createServer = (
  source: ServerAnalysisSource,
  options: CreateServerOptions = {},
): EvidenceMcpServer => {
  const session = source.kind === "session" ? source.session : undefined;
  const environment = snapshotEnvironment(options.environment ?? process.env);
  const analysisSettings =
    options.analysisSettings ?? new AnalysisSettings(environment);
  const providerEnvironment = captureProviderEnvironment(
    options.providerEnvironment,
    environment,
  );
  const delivery = selectToolResultDelivery(environment, options.delivery);
  const compactInputPresentation =
    selectCompactInputSchemaPresentation(environment);
  const selectedOutputSchemaProfile = outputSchemaProfile(environment);
  const advertisedToolFamilies = selectAdvertisedToolFamilies(environment);
  const artifactResources = new ArtifactResourceScope();
  const android =
    options.androidAnalysis ??
    createAndroidAnalysisProvider(
      environment,
      undefined,
      analysisSettings.read,
    );
  const adb =
    options.adbDeviceAnalysis ?? createAdbDeviceAnalysisProvider(environment);
  const apktool =
    options.apktoolAnalysis ??
    createApktoolResourceAnalysisProvider(environment);
  const flutter =
    options.flutterAnalysis ?? createFlutterBuildAnalysisProvider();
  const frida =
    options.fridaInstrumentation ?? new FridaInstrumentationManager();
  const jeb = options.jebAnalysis ?? createJebAnalysisProvider(environment);
  const apkSignature = apkSignatureModule.create(
    environment,
    options.apkSignature,
  );
  const binaryLayout =
    options.binaryLayout ?? createBinaryLayoutService(environment);
  const byteEntropy =
    options.byteEntropy ?? createByteEntropyService(artifactResources);
  const elfNotes = options.elfNotes ?? createElfNotesService();
  const nativeExports = options.nativeExports ?? createNativeExportsService();
  const logger = options.logger ?? silentLogger;
  const server =
    options.mcpServer ??
    createMcpServer(
      session,
      delivery,
      compactInputPresentation,
      selectedOutputSchemaProfile,
      advertisedToolFamilies,
      environment.REA_MCP_MAX_INPUT_ELEMENTS,
    );
  server.analysisSettings = analysisSettings;
  if (options.mcpServer !== undefined)
    server.attachRuntime(
      session === undefined
        ? undefined
        : (evidence) => session.recordEvidence(evidence),
      delivery,
      catalogIdentityForToolFamilies(
        compactInputPresentation,
        selectedOutputSchemaProfile,
        advertisedToolFamilies,
      ),
    );

  const {
    evidenceById,
    activeTarget,
    recordEvidence,
    recordEvidenceWithUnknown,
  } = createSessionRecorders(server, session);
  const admitted = withAdmittedAnalysis(source);
  registerAnalysisSettingsTools(server, analysisSettings);
  registerBinaryAnalysisTools(server, {
    activeTarget,
    admitted,
    evidenceById,
    logger,
    recordEvidence,
    recordEvidenceWithUnknown,
    session,
  });
  registerAndroidTools(
    server,
    new AndroidAnalysisService(android, recordEvidence),
    logger,
    recordEvidence,
    admitted,
    evidenceById,
  );
  registerAdbTools(
    server,
    new AdbDeviceAnalysisService(adb),
    logger,
    recordEvidence,
    admitted,
  );
  registerApktoolTools(
    server,
    new ApktoolResourceAnalysisService(apktool),
    logger,
    recordEvidence,
    admitted,
  );
  registerFlutterTools(
    server,
    new FlutterBuildAnalysisService(flutter),
    logger,
    recordEvidence,
    admitted,
    evidenceById,
  );
  registerFridaTools(
    server,
    frida,
    logger,
    delivery,
    session === undefined
      ? undefined
      : (evidence) => session.recordEvidence(evidence),
    evidenceById,
  );
  registerJebTools(
    server,
    new JebAnalysisService(jeb),
    logger,
    recordEvidence,
    admitted,
  );
  registerApkSignatureTools(
    server,
    apkSignature,
    logger,
    recordEvidence,
    admitted,
    evidenceById,
  );
  registerBinaryDiagnosticsTools(
    server,
    binaryLayout,
    byteEntropy,
    logger,
    recordEvidence,
    evidenceById,
    admitted,
  );
  registerElfNotesTool(server, elfNotes, logger, recordEvidence, admitted);
  registerNativeExportsTool(
    server,
    nativeExports,
    logger,
    recordEvidence,
    evidenceById,
    admitted,
  );
  registerAnalysisViewTool(
    server,
    logger,
    evidenceById,
    recordEvidence,
    admitted,
    artifactResources,
  );
  registerApplicationTools(server, {
    artifactResources,
    evidenceById,
    logger,
    recordEvidence,
    recordEvidenceWithUnknown,
    withAdmittedAnalysis: admitted,
  });
  const analysis = source.kind === "session" ? source.session : source.analysis;
  registerGuidedPrompts(server, analysis, session);
  if (session !== undefined)
    registerSessionTools(server, session, logger, {
      ...options,
      artifactResources,
      environment,
      androidAnalysisAvailability: (signal) =>
        android.inspectAvailability(signal),
      adbAnalysisAvailability: (signal) => adb.inspectAvailability(signal),
      apktoolAnalysisAvailability: (signal) =>
        apktool.inspectAvailability(signal),
      jebAnalysisAvailability: (signal) => jeb.inspectAvailability(signal),
    });

  let closed = false;
  const closeOriginal = server.close.bind(server);
  server.close = async () => {
    if (closed) return;
    closed = true;
    const results = await Promise.allSettled([
      closeOriginal(),
      android.close(),
      adb.close(),
      apktool.close(),
      flutter.close(),
      frida.closeAll(),
      jeb.close(),
      apkSignature.close(),
      binaryLayout.close(),
      byteEntropy.close(),
      elfNotes.close(),
      nativeExports.close(),
      artifactResources.close(),
    ]);
    const failures = results.flatMap((result) =>
      result.status === "rejected" ? [result.reason as unknown] : [],
    );
    if (failures.length === 1) throw failures[0];
    if (failures.length > 1)
      throw new AggregateError(failures, "REA Android server cleanup failed");
  };
  const previousOnclose = server.server.onclose;
  server.server.onclose = () => {
    previousOnclose?.();
    void server.close().catch((cause: unknown) => {
      logger.error(
        { error: cause instanceof Error ? cause.message : String(cause) },
        "Android provider cleanup failed during server shutdown",
      );
    });
  };
  return server;
};

const createMcpServer = (
  session: BinarySessionPort | undefined,
  delivery: ToolResultDelivery,
  compactPresentation: CompactInputSchemaPresentation | undefined,
  outputSchemaProfile: McpOutputSchemaProfile,
  advertisedToolFamilies: ReadonlySet<string> | undefined,
  inputElementBudget: string | undefined,
): EvidenceMcpServer => {
  const configured = parseMcpInputBudget(inputElementBudget);
  if (!configured.ok) throw configured.error;
  return new EvidenceMcpServer(
    {
      name: PRODUCT_IDENTITY.mcpServerKey,
      version: PRODUCT_IDENTITY.packageVersion,
    },
    {
      capabilities: {},
      maxToolInputElements: configured.value,
      instructions: serverInstructions(
        session !== undefined,
        advertisedToolFamilies,
      ),
    },
    session === undefined
      ? undefined
      : (evidence) => session.recordEvidence(evidence),
    delivery,
    compactPresentation,
    outputSchemaProfile,
    catalogIdentityForToolFamilies(
      compactPresentation,
      outputSchemaProfile,
      advertisedToolFamilies,
    ),
    advertisedToolFamilies,
  );
};

type SessionRecorders = ReturnType<typeof createSessionRecorders>;

interface BinaryAnalysisRegistration {
  readonly activeTarget: SessionRecorders["activeTarget"];
  readonly admitted: WithAdmittedAnalysis;
  readonly evidenceById: SessionRecorders["evidenceById"];
  readonly logger: Logger;
  readonly recordEvidence: SessionRecorders["recordEvidence"];
  readonly recordEvidenceWithUnknown: SessionRecorders["recordEvidenceWithUnknown"];
  readonly session: BinarySessionPort | undefined;
}

const registerBinaryAnalysisTools = (
  server: EvidenceMcpServer,
  registration: BinaryAnalysisRegistration,
): void => {
  const recordUnknown =
    registration.session === undefined
      ? undefined
      : (input: Parameters<BinarySessionPort["recordUnknown"]>[0]) =>
          registration.session!.recordUnknown(input);
  const analysisOptions = {
    logger: registration.logger,
    activeTarget: registration.activeTarget,
    recordEvidence: registration.recordEvidence,
    recordUnknown,
    evidenceById: registration.evidenceById,
    withAdmittedAnalysis: registration.admitted,
  };
  registerOfficialTools(server, analysisOptions);
  registerEnhancedTools(server, {
    ...analysisOptions,
    analysisProfile:
      registration.session === undefined
        ? undefined
        : (operation) =>
            registration.session!.analysisProfile() ??
            registration.session!.analysisProfile(operation),
    allowsSnapshotReplay:
      registration.session === undefined
        ? undefined
        : (operation) => registration.session!.allowsSnapshotReplay(operation),
    recordWorkflowSnapshot:
      registration.session === undefined
        ? undefined
        : (input) => registration.session!.recordWorkflowSnapshot(input),
  });
  registerArtifactTools(server, {
    logger: registration.logger,
    activeTarget: registration.activeTarget,
    recordEvidence: registration.recordEvidence,
    withAdmittedAnalysis: registration.admitted,
    evidenceById: registration.evidenceById,
  });
};

const createSessionRecorders = (
  server: EvidenceMcpServer,
  session: BinarySessionPort | undefined,
) => ({
  evidenceById:
    session === undefined
      ? undefined
      : session.evidenceForAnalysis.bind(session),
  activeTarget:
    session === undefined ? undefined : () => session.activeTarget(),
  recordEvidence:
    session === undefined
      ? undefined
      : (evidence: Parameters<typeof session.recordEvidence>[0]) =>
          session.recordEvidence(evidence),
  recordEvidenceWithUnknown:
    session === undefined
      ? undefined
      : (
          evidence: Parameters<typeof session.recordEvidenceWithUnknown>[0],
          input: Parameters<typeof session.recordEvidenceWithUnknown>[1],
        ) => session.recordEvidenceWithUnknown(evidence, input),
  server,
});

const selectToolResultDelivery = (
  environment: Readonly<NodeJS.ProcessEnv>,
  selected: ToolResultDelivery | undefined,
): ToolResultDelivery => {
  if (selected !== undefined) return selected;
  const configured = parseMcpResponseBudget(
    environment.REA_MCP_MAX_RESPONSE_BYTES,
  );
  if (!configured.ok) throw configured.error;
  return createToolResultDelivery(configured.value);
};

const outputSchemaProfile = (
  environment: Readonly<NodeJS.ProcessEnv>,
): McpOutputSchemaProfile => {
  const configured = parseMcpOutputSchemaProfile(
    environment.REA_MCP_OUTPUT_SCHEMA_PROFILE,
  );
  if (!configured.ok) throw configured.error;
  return configured.value ?? "full";
};

const selectCompactInputSchemaPresentation = (
  environment: Readonly<NodeJS.ProcessEnv>,
): CompactInputSchemaPresentation | undefined => {
  const configured = parseMcpInputSchemaProfile(
    environment.REA_MCP_INPUT_SCHEMA_PROFILE,
  );
  if (!configured.ok) throw configured.error;
  return compactPresentationForMcpInputSchemaProfile(configured.value);
};

const selectAdvertisedToolFamilies = (
  environment: Readonly<NodeJS.ProcessEnv>,
): ReadonlySet<string> | undefined => {
  const configured = parseMcpToolFamilies(environment.REA_MCP_TOOL_FAMILIES);
  if (!configured.ok) throw configured.error;
  return configured.value === undefined ? undefined : new Set(configured.value);
};
