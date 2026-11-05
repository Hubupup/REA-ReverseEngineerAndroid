import { expect, it } from "vitest";

import { BINARY_SESSION_SUMMARY_OMITTED_FIELDS } from "../../../src/contracts/sessionStatusContract.js";

interface TargetFreeVerifier {
  readonly verifyMcpTargetFree: (
    client: { callTool: () => Promise<unknown> },
    options: unknown,
    androidOnly?: boolean,
  ) => Promise<void>;
}

const verifier = (): Promise<TargetFreeVerifier> =>
  import(
    new URL("../../../scripts/verify-package-mcp.mjs", import.meta.url).href
  ) as Promise<TargetFreeVerifier>;

const digest = "a".repeat(64);
const clientRequirements = {
  required: [],
  optional: [],
  missing_required: [],
  missing_optional: [],
};
const unavailableGroup = (name: string) => ({
  names: [name],
  available: false,
  reason: "target_required",
  remediation: null,
});
const closedSession = (groups: readonly unknown[]) => ({
  open: false,
  cleanup_pending: false,
  capabilities: [],
  analysis_run: null,
  analysis_activity: { status: "not_observed", providers: [] },
  provider_operation_health: null,
  analysis_provider_binding: null,
  client_features: {
    elicitation_form: false,
    elicitation_url: false,
    roots: false,
    sampling: false,
  },
  server_identity: {
    package: {
      name: "rea",
      version: "fixture",
      root_path: "/fixture",
      build_commit: null,
    },
    server: {
      name: "rea",
      version: "fixture",
      started_at: "2026-01-01T00:00:00Z",
      command_path: null,
    },
    sdk: { server: "fixture", client_test: "fixture", core: "fixture" },
    negotiated_protocol_version: null,
    client: null,
    skill: { name: "rea", expected_version: "fixture" },
    catalog: {
      counts: { cli_commands: 0, mcp_tools: 0, mcp_prompts: 0 },
      digests: {
        tools_sha256: digest,
        prompts_sha256: digest,
        combined_sha256: digest,
      },
    },
    protocol_features: {
      progress: false,
      cancellation: false,
      elicitation: false,
    },
    alignment: { state: "unknown", reasons: [], remediation: null },
  },
  detail: "summary",
  omitted_fields: [...BINARY_SESSION_SUMMARY_OMITTED_FIELDS],
  analysis_provider_candidates: [],
  tool_availability: { client_requirements: clientRequirements, groups },
});
const reply = (status: unknown) => ({
  content: [{ type: "text", text: JSON.stringify({ result: status }) }],
  structuredContent: { result: status },
});
const client = (status: unknown) => ({ callTool: async () => reply(status) });

it("accepts an Android-only target-free session without current_document", async () => {
  const { verifyMcpTargetFree } = await verifier();
  await expect(
    verifyMcpTargetFree(
      client(closedSession([unavailableGroup("binary_session")])),
      {},
      true,
    ),
  ).resolves.toBeUndefined();
});

it("rejects an Android-only session without a valid tool availability inventory", async () => {
  const { verifyMcpTargetFree } = await verifier();
  const status = {
    ...closedSession([unavailableGroup("binary_session")]),
    tool_availability: [],
  };
  await expect(verifyMcpTargetFree(client(status), {}, true)).rejects.toThrow();
});

it("requires target-bound availability metadata outside Android-only mode", async () => {
  const { verifyMcpTargetFree } = await verifier();
  await expect(
    verifyMcpTargetFree(
      client(closedSession([unavailableGroup("binary_session")])),
      {},
      false,
    ),
  ).rejects.toThrow(
    "packaged target-free MCP omitted target-bound availability metadata",
  );
});
