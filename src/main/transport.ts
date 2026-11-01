import type { AnalysisSettings } from "../application/AnalysisSettings.js";
import { createAndroidAnalysisProvider } from "../composition/android.js";
import type { AndroidAnalysisPort } from "../application/android/AndroidAnalysisPort.js";

import type { BinarySession } from "../application/binary/BinarySession.js";
import type { Logger } from "pino";
import { createServer } from "../server/createServer.js";
import { StreamableHttpListenError } from "../server/http/streamableHttpListenError.js";
import type { ToolResultDelivery } from "../server/ToolResultDelivery.js";
import type { McpServerHandle, RuntimeDependencies } from "./types.js";
import { OwnedMcpServers } from "./OwnedMcpServers.js";
import {
  MCP_CONNECTION_START_FAILED,
  MCP_HTTP_LISTEN_FAILED,
} from "./messages.js";
import { reportMcpTransportError } from "./reportMcpTransportError.js";

interface ServerContext {
  readonly analysisSettings?: AnalysisSettings;
  readonly environment: Readonly<NodeJS.ProcessEnv>;
  readonly delivery: ToolResultDelivery;
  readonly logger: Logger;
  readonly serverLogger: Logger;
  readonly signal?: AbortSignal;
}

type ClosableOptionalProvider = {
  readonly close?: () => Promise<void>;
};

/** Start the injected transport (stdio or streamable HTTP) around one shared session. */
export const startMcpTransport = async (
  dependencies: RuntimeDependencies,
  session: BinarySession,
  serverContext: ServerContext,
): Promise<
  | {
      readonly ok: true;
      readonly handle: McpServerHandle;
      readonly closeAndroid: () => Promise<void>;
      readonly closeOptionalProviders: () => Promise<void>;
    }
  | {
      readonly ok: false;
      readonly cancelled: boolean;
      readonly handle: McpServerHandle;
      readonly closeAndroid: () => Promise<void>;
      readonly closeOptionalProviders: () => Promise<void>;
    }
> => {
  const { serverLogger } = serverContext;
  const androidProviders = new Set<AndroidAnalysisPort>();
  const servers = new OwnedMcpServers<ReturnType<typeof createServer>>();
  const closeServers = async (): Promise<void> => {
    const results = await servers.closeAll();
    const failures = results.flatMap((result) =>
      result.status === "rejected" ? [result.reason] : [],
    );
    if (failures.length > 0)
      throw new AggregateError(failures, "REA server cleanup failed");
  };
  const closeAndroid = async (): Promise<void> => {
    const results = await Promise.allSettled(
      [...androidProviders].map(async (provider) => {
        await provider.close();
        androidProviders.delete(provider);
      }),
    );
    const failures = results.flatMap((result) =>
      result.status === "rejected" ? [result.reason] : [],
    );
    if (failures.length === 1) throw failures[0];
    if (failures.length > 1)
      throw new AggregateError(failures, "Android provider cleanup failed");
  };
  const closeOptionalProviders = async (): Promise<void> => {};
  let handle: McpServerHandle;
  try {
    if (serverContext.signal?.aborted) throw serverContext.signal.reason;
    handle = await dependencies.serve(
      () =>
        servers.create(() => {
          // The SDK can discard a discovery probe and construct a replacement server.
          const android = createAndroidAnalysisProvider(
            serverContext.environment,
            undefined,
            serverContext.analysisSettings?.read,
          );
          androidProviders.add(android);
          const server = (dependencies.createServer ?? createServer)(
            { kind: "session", session },
            {
              ...(serverContext.analysisSettings === undefined
                ? {}
                : { analysisSettings: serverContext.analysisSettings }),
              logger: serverContext.logger,
              environment: serverContext.environment,
              delivery: serverContext.delivery,
              androidAnalysis: android,
            },
          );
          return server;
        }),
      {
        onerror: (error) =>
          reportMcpTransportError(
            error,
            serverLogger,
            dependencies.writeStderr,
          ),
        logger: serverLogger,
        ...(serverContext.signal === undefined
          ? {}
          : { signal: serverContext.signal }),
      },
    );
  } catch (cause: unknown) {
    const cancelled =
      serverContext.signal?.aborted === true &&
      cause === serverContext.signal.reason;
    const [androidCleanup, serverCleanup, optionalProviderCleanup] =
      await Promise.allSettled([
        closeAndroid(),
        closeServers(),
        closeOptionalProviders(),
      ]);
    if (!cancelled) {
      const startFailure =
        cause instanceof StreamableHttpListenError
          ? cause.classification.ok &&
            cause.classification.value.kind === "host_allowlist"
            ? cause.remediationAction
            : MCP_HTTP_LISTEN_FAILED
          : MCP_CONNECTION_START_FAILED;
      serverLogger.error(
        {
          error: cause instanceof Error ? cause.message : String(cause),
        },
        startFailure,
      );
      dependencies.writeStderr(`${startFailure}\n`);
    }
    for (const cleanup of [
      androidCleanup,
      serverCleanup,
      optionalProviderCleanup,
    ]) {
      if (cleanup.status === "rejected") {
        const reason =
          cleanup.reason instanceof Error
            ? cleanup.reason.message
            : String(cleanup.reason);
        serverLogger.error(
          { cleanup_error: reason },
          "Provider cleanup rejected after MCP startup",
        );
        dependencies.writeStderr(`Provider cleanup failed: ${reason}\n`);
      }
    }
    // Return the same partial owners for retry; the caller owns the binary
    // session independently of transport admission.
    return {
      ok: false,
      cancelled,
      handle: { close: closeServers },
      closeAndroid,
      closeOptionalProviders,
    };
  }
  return {
    ok: true,
    handle: {
      ...(handle.prepareShutdown === undefined
        ? {}
        : { prepareShutdown: handle.prepareShutdown }),
      close: async () => {
        await handle.prepareShutdown?.();
        const results = await Promise.allSettled([
          handle.close(),
          closeServers(),
        ]);
        const failures = results.flatMap((result) =>
          result.status === "rejected" ? [result.reason] : [],
        );
        if (failures.length === 1) throw failures[0];
        if (failures.length > 1)
          throw new AggregateError(failures, "REA transport cleanup failed");
      },
    },
    closeAndroid,
    closeOptionalProviders,
  };
};
