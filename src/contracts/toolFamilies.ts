import { ANALYSIS_SETTINGS_TOOL_CONTRACTS } from "./analysisSettingsContracts.js";
import { ANALYSIS_VIEW_TOOL_CONTRACTS } from "./analysisViewToolContracts.js";
import { ANDROID_TOOL_CONTRACTS } from "./android/androidToolContracts.js";
import { APKTOOL_TOOL_CONTRACTS } from "./apktool/apktoolToolContracts.js";
import { FLUTTER_TOOL_CONTRACTS } from "./flutter/flutterToolContracts.js";
import { JEB_TOOL_CONTRACTS } from "./jeb/jebToolContracts.js";
import { ADB_TOOL_CONTRACTS } from "./adb/adbToolContracts.js";
import { APPLICATION_TOOL_CONTRACTS } from "./applicationToolContracts.js";
import { OFFICIAL_TOOL_CONTRACTS } from "./officialToolContracts.js";
import { ENHANCED_TOOL_CONTRACTS } from "./enhancedToolContracts.js";
import { SESSION_TOOL_CONTRACTS } from "./sessionToolContracts.js";
import { FRIDA_TOOL_CONTRACTS } from "./fridaToolContracts.js";
import {
  ANDROID_TOOL_ALLOWLIST,
  selectToolContracts,
} from "./androidToolAllowlist.js";
import { TOOL_CONTRACTS, toolContract } from "./toolContracts.js";
import { TOOL_FAMILY_IDS, type ToolFamilyId } from "./toolFamilyIds.js";

/** One selectable family: a stable selection id and its complete contract set. */
export interface ToolFamilyDefinition {
  readonly id: ToolFamilyId;
  readonly surface: string;
  readonly contracts: readonly (typeof TOOL_CONTRACTS)[number][];
}

/**
 * Complete ordered tool-family inventory. Every contract in `TOOL_CONTRACTS`
 * belongs to exactly one family; runtime advertising scopes and the product
 * catalog both derive from this single grouping.
 */
export const TOOL_FAMILY_DEFINITIONS = [
  {
    id: "direct",
    surface: "official-proxy",
    contracts: selectToolContracts(
      OFFICIAL_TOOL_CONTRACTS,
      ANDROID_TOOL_ALLOWLIST.official,
    ),
  },
  {
    id: "enhanced",
    surface: "enhanced",
    contracts: selectToolContracts(
      ENHANCED_TOOL_CONTRACTS,
      ANDROID_TOOL_ALLOWLIST.enhanced,
    ),
  },
  {
    id: "native",
    surface: "native-provider",
    contracts: ANDROID_TOOL_ALLOWLIST.native.map((name) => toolContract(name)),
  },
  {
    id: "artifact",
    surface: "artifact-provider",
    contracts: ANDROID_TOOL_ALLOWLIST.artifact.map((name) =>
      toolContract(name),
    ),
  },
  {
    id: "android",
    surface: "android-provider",
    contracts: ANDROID_TOOL_CONTRACTS,
  },
  {
    id: "flutter",
    surface: "flutter-provider",
    contracts: FLUTTER_TOOL_CONTRACTS,
  },
  {
    id: "frida",
    surface: "instrumentation-provider",
    contracts: FRIDA_TOOL_CONTRACTS,
  },
  {
    id: "apktool",
    surface: "apktool-provider",
    contracts: APKTOOL_TOOL_CONTRACTS,
  },
  { id: "jeb", surface: "jeb-provider", contracts: JEB_TOOL_CONTRACTS },
  { id: "adb", surface: "adb-provider", contracts: ADB_TOOL_CONTRACTS },
  {
    id: "application",
    surface: "application-workflow",
    contracts: ANDROID_TOOL_ALLOWLIST.application.map((name) =>
      toolContract(name),
    ),
  },
  {
    id: "session",
    surface: "session",
    contracts: selectToolContracts(
      SESSION_TOOL_CONTRACTS,
      ANDROID_TOOL_ALLOWLIST.session,
    ),
  },
] as const satisfies readonly ToolFamilyDefinition[];

const familyByTool = new Map<string, ToolFamilyId>();
for (const { id, contracts } of TOOL_FAMILY_DEFINITIONS)
  for (const contract of contracts) familyByTool.set(contract.name, id);

/** The family that owns a public tool name; undefined when none does. */
export const toolFamilyId = (name: string): ToolFamilyId | undefined =>
  familyByTool.get(name);

/**
 * Contracts in the selected families, in canonical catalog order.
 * An absent selection means the complete catalog, matching unscoped servers.
 */
export const contractsForToolFamilies = (
  selection: ReadonlySet<string> | undefined,
): readonly (typeof TOOL_CONTRACTS)[number][] =>
  selection === undefined
    ? TOOL_CONTRACTS
    : TOOL_CONTRACTS.filter(({ name }) => {
        const family = toolFamilyId(name);
        return family !== undefined && selection.has(family);
      });
