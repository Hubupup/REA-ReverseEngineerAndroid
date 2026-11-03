import { mkdir, mkdtemp, rm, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { TOOL_CONTRACTS } from "../dist/contracts/toolContracts.js";
import { PRODUCT_IDENTITY } from "../dist/identity.js";
import { resolveMcpStartupBudgets } from "../dist/config/mcpStartupBudgets.js";
import * as prompts from "./verify-package-prompts.mjs";
import {
  verifyPackageArtifact,
  verifyPackageArtifactAndElectron,
} from "./verify-package-artifact.mjs";
import { verifyPackageCapabilitiesAndSearch } from "./verify-package-capabilities.mjs";
import { verifyPackageDiscovery } from "./verify-package-discovery.mjs";
import { verifyPackageEnvironment } from "./verify-package-environment.mjs";
import { verifyPackageEvidence } from "./verify-package-evidence.mjs";
import { verifyPackageInstall } from "./verify-package-install.mjs";
import { verifyPackageUpdate } from "./verify-package-update.mjs";
import { verifyPackageMcp } from "./verify-package-mcp.mjs";
import { verifyPackagePack } from "./verify-package-pack.mjs";
import { verifyPackagePlatform } from "./verify-package-platform.mjs";
import { verifyPackageSetup } from "./verify-package-setup.mjs";
import { verifyRepositorySkill } from "./verify-repository-skill.mjs";
import { verifyManaged } from "./verify-package-managed.mjs";
import { verifyUnknownProvider } from "./verify-package-unknown-provider.mjs";
import { createPackageVerifierCommands } from "./lib/verify-package-commands.mjs";
import { withVerifierCleanup } from "./lib/verifier-cleanup.mjs";
import { completeVerifierRun, createVerifierRun } from "./lib/verifier-run.mjs";
import {
  createVerifiedPackageMetadata,
  retainVerifiedPackage,
  writeVerifiedPackageManifest,
} from "./ci/verified-package.mjs";
import {
  measureMcpStartup,
  profileMcpModuleLoading,
} from "./lib/mcp-startup-probe.mjs";

const ANDROID_ONLY = process.env.REA_ANDROID_ONLY === "1";
const root = process.cwd();
const retentionDirectory = process.env.REA_VERIFIED_PACKAGE_DIRECTORY;
const verifierRun = createVerifierRun();
const workspace = await mkdtemp(join(tmpdir(), "rea-package-"));
const evidenceRoot = join(workspace, "evidence");
const referenceRoot = join(workspace, "reference-source");
let tarball;
let mcpStartup;
let mcpModuleLoading;
let update;
let repositorySkill;
let report;
let retainedPackage;
let retentionMetadata;
let commands;
const releaseWorkspace = () =>
  runStage("workspace cleanup", () =>
    rm(workspace, { recursive: true, force: true }),
  );

const runStage = async (name, action) => {
  const started = performance.now();
  process.stderr.write(`[verify:package] ${name}: start\n`);
  const result = await action();
  process.stderr.write(
    `[verify:package] ${name}: complete (${Math.round(performance.now() - started)} ms)\n`,
  );
  return result;
};

const verifyAndroidPackageDiscovery = async ({
  commands,
  cli,
  environment,
}) => {
  const help = await commands.run(cli, ["--help"], environment);
  const missingCommands = [
    "doctor",
    "extract-artifact",
    "inspect-artifact",
    "setup",
    "uninstall",
  ].filter((command) => !help.includes(command));
  if (missingCommands.length > 0)
    throw new Error(
      `packaged Android CLI omitted commands: ${missingCommands.join(", ")}`,
    );
  const doctorExecution = await commands.runWithStatus(
    cli,
    ["doctor", "--json"],
    environment,
  );
  if (![0, 1].includes(doctorExecution.status))
    throw new Error(
      `packaged Android doctor failed with exit ${doctorExecution.status}`,
    );
  const doctor = JSON.parse(doctorExecution.stdout);
  if (!Array.isArray(doctor.checks))
    throw new Error("packaged Android doctor omitted its check inventory");
  await commands.run(cli, ["setup", "--help"], environment);
  await commands.run(cli, ["uninstall", "--help"], environment);
  return { supportedSetupHost: false, hopperSetupSupported: false };
};

await withVerifierCleanup(async () => {
  commands = await createPackageVerifierCommands({
    workspace: { path: workspace, close: releaseWorkspace },
  });
  if (retentionDirectory !== undefined && retentionDirectory !== "") {
    const sourceSha = (
      await commands.exec("git", ["rev-parse", "HEAD"], { cwd: root })
    ).stdout.trim();
    retentionMetadata = createVerifiedPackageMetadata({
      sourceSha,
      runId: process.env.GITHUB_RUN_ID,
      runAttempt: process.env.GITHUB_RUN_ATTEMPT,
      platform: process.platform,
      architecture: process.arch,
      packageVersion: PRODUCT_IDENTITY.packageVersion,
      nodeVersion: process.version,
    });
    await mkdir(retentionDirectory, { recursive: true });
    await unlink(join(retentionDirectory, "manifest.json")).catch((cause) => {
      if (
        !(cause instanceof Error && "code" in cause && cause.code === "ENOENT")
      )
        throw cause;
    });
  }
  repositorySkill = await runStage("repository skill", () =>
    verifyRepositorySkill({ commands, root, workspace }),
  );
  ({ tarball } = await runStage("package archive", () =>
    verifyPackagePack({ commands, root, workspace }),
  ));
  const environmentData = await runStage("package environment", () =>
    verifyPackageEnvironment({
      root,
      workspace,
      evidenceRoot,
      referenceRoot,
    }),
  );
  const { cli, packageRunnerCli } = await runStage("package install", () =>
    verifyPackageInstall({
      commands,
      tarball,
      prefix: environmentData.prefix,
      workspace,
      environment: environmentData.environment,
    }),
  );
  update = await runStage("package update", () =>
    verifyPackageUpdate({
      commands,
      prefix: environmentData.prefix,
      packageRoot: join(
        environmentData.prefix,
        "lib",
        "node_modules",
        PRODUCT_IDENTITY.packageName,
      ),
      tarball,
      workspace,
      environment: environmentData.environment,
    }),
  );
  mcpStartup = await runStage("MCP startup", () =>
    measureMcpStartup({
      command: cli,
      args: ["mcp"],
      environment: {
        ...environmentData.environment,
      },
      policy: resolveMcpStartupBudgets(environmentData.environment),
    }),
  );
  mcpModuleLoading = await runStage("MCP module loading", () =>
    profileMcpModuleLoading({
      command: cli,
      args: ["mcp"],
      environment: {
        ...environmentData.environment,
      },
      policy: resolveMcpStartupBudgets(environmentData.environment),
      packageName: PRODUCT_IDENTITY.packageName,
    }),
  );
  const setupSupport = ANDROID_ONLY
    ? await runStage("Android package discovery", () =>
        verifyAndroidPackageDiscovery({
          commands,
          cli,
          environment: environmentData.environment,
        }),
      )
    : await runStage("package discovery", () =>
        verifyPackageDiscovery({
          commands,
          cli,
          environment: environmentData.environment,
        }),
      );
  const { artifactArchive } = await runStage(
    ANDROID_ONLY ? "artifact CLI" : "artifact and Electron CLI",
    () =>
      (ANDROID_ONLY ? verifyPackageArtifact : verifyPackageArtifactAndElectron)(
        {
          commands,
          cli,
          workspace,
          environment: environmentData.environment,
        },
      ),
  );
  if (!ANDROID_ONLY)
    await runStage("managed analysis CLI", () =>
      verifyManaged({
        commands,
        cli,
        workspace,
        environment: environmentData.environment,
      }),
    );
  await runStage("unknown provider CLI", () =>
    verifyUnknownProvider({
      commands,
      cli,
      environment: environmentData.environment,
    }),
  );
  if (!ANDROID_ONLY) {
    await runStage("platform CLI", () =>
      verifyPackagePlatform({
        commands,
        cli,
        environment: environmentData.environment,
      }),
    );
    await runStage("capabilities and search CLI", () =>
      verifyPackageCapabilitiesAndSearch({
        commands,
        cli,
        environment: environmentData.environment,
      }),
    );
  }
  await runStage("evidence CLI", () =>
    verifyPackageEvidence({
      commands,
      cli,
      evidenceRoot,
      referenceRoot,
      environment: environmentData.environment,
    }),
  );
  if (!ANDROID_ONLY)
    await runStage("setup and uninstall CLI", () =>
      verifyPackageSetup({
        commands,
        cli,
        packageRunnerCli,
        environment: environmentData.environment,
        home: environmentData.home,
        npxLog: environmentData.npxLog,
        claudeConfig: environmentData.claudeConfig,
        codexConfig: environmentData.codexConfig,
        cursorConfig: environmentData.cursorConfig,
        codexTarget: environmentData.codexTarget,
        cursorTarget: environmentData.cursorTarget,
        supportedSetupHost: setupSupport.supportedSetupHost,
        hopperSetupSupported: setupSupport.hopperSetupSupported,
        root,
      }),
    );
  const extractedDirectory = join(workspace, "extracted-plugin");
  await mkdir(extractedDirectory);
  await commands.exec("tar", ["-xzf", tarball, "-C", extractedDirectory]);
  // Codex extracts npm plugins without installing dependencies. Run the real
  // catalog/Evidence workflow from that isolated tree so npm cannot repair it.
  await runStage("extracted plugin MCP tools and evidence", () =>
    verifyPackageMcp({
      commands,
      cli: join(extractedDirectory, "package", "scripts", "rea.mjs"),
      environment: environmentData.environment,
      evidenceRoot,
      artifactArchive,
    }),
  );
  report = {
    cli: true,
    analysisCli: !ANDROID_ONLY,
    artifactCli: true,
    managedCli: !ANDROID_ONLY,
    managedReconstructionCli: !ANDROID_ONLY,
    managedNativeVerificationCli: !ANDROID_ONLY,
    managedApplicationGraphCli: !ANDROID_ONLY,
    evidenceCli: true,
    incurMcpCommand: PRODUCT_IDENTITY.mcpCommand,
    lifecycleScriptsRequired: false,
    doctor: ANDROID_ONLY ? "android-surface-checked" : "platform-appropriate",
    setup: ANDROID_ONLY
      ? "android-surface-checked"
      : setupSupport.supportedSetupHost
        ? "planned-then-idempotent"
        : "unsupported-host-rejected",
    setupPlanReadOnly: setupSupport.supportedSetupHost,
    existingHopperPreserved: setupSupport.supportedSetupHost,
    clients: setupSupport.supportedSetupHost ? 4 : 0,
    backupReadback: setupSupport.supportedSetupHost,
    failureRecovery: setupSupport.supportedSetupHost,
    configSymlinkLifecycle: setupSupport.supportedSetupHost,
    skill: setupSupport.supportedSetupHost,
    skillReferences: setupSupport.supportedSetupHost,
    repositorySkill,
    mcpTools: TOOL_CONTRACTS.length,
    mcpPrompts: prompts.names.length,
    promptCompletion: true,
    promptCompletionLifecycle: true,
    evidenceMcp: true,
    extractedPluginMcp: true,
    targetFree: true,
    targetLifecycle: !ANDROID_ONLY,
    boundedRegexBridge: true,
    update,
    mcpStartup,
    mcpModuleLoading,
  };
  if (retentionMetadata !== undefined) {
    retainedPackage = await retainVerifiedPackage({
      sourceTarball: tarball,
      directory: retentionDirectory,
      metadata: retentionMetadata,
    });
  }
}, [() => (commands === undefined ? releaseWorkspace() : commands.close())]);
const verifierLineage = await runStage("verifier lineage", () =>
  completeVerifierRun(verifierRun),
);
if (retainedPackage !== undefined)
  await writeVerifiedPackageManifest(
    retainedPackage.directory,
    retainedPackage.metadata,
  );
process.stdout.write(
  `${JSON.stringify({ verifier_run: verifierLineage, ...report })}\n`,
);
