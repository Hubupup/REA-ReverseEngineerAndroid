import { ANALYSIS_SETTINGS_TOOL_CONTRACTS } from "./analysisSettingsContracts.js";
import { APK_SIGNATURE_TOOL_CONTRACTS } from "./apkSignature/apkSignatureToolContracts.js";
import { ANALYSIS_VIEW_TOOL_CONTRACTS } from "./analysisViewToolContracts.js";
import { BINARY_DIAGNOSTICS_TOOL_CONTRACTS } from "./native/binaryDiagnosticsToolContracts.js";
import { ARTIFACT_TOOL_CONTRACTS } from "./artifactToolContracts.js";
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

export const ANDROID_OFFICIAL_TOOL_CONTRACTS = selectToolContracts(
  OFFICIAL_TOOL_CONTRACTS,
  ANDROID_TOOL_ALLOWLIST.official,
);
export const ANDROID_ENHANCED_TOOL_CONTRACTS = selectToolContracts(
  ENHANCED_TOOL_CONTRACTS,
  ANDROID_TOOL_ALLOWLIST.enhanced,
);
export const ANDROID_NATIVE_TOOL_CONTRACTS = selectToolContracts(
  BINARY_DIAGNOSTICS_TOOL_CONTRACTS,
  ANDROID_TOOL_ALLOWLIST.native,
);
export const ANDROID_ARCHIVE_TOOL_CONTRACTS = selectToolContracts(
  ARTIFACT_TOOL_CONTRACTS,
  ["inspect_artifact", "extract_artifact"] as const,
);
export const ANDROID_APK_SIGNATURE_TOOL_CONTRACTS =
  APK_SIGNATURE_TOOL_CONTRACTS;
export const ANDROID_ARTIFACT_TOOL_CONTRACTS = [
  ...ANDROID_ARCHIVE_TOOL_CONTRACTS,
  ...ANDROID_APK_SIGNATURE_TOOL_CONTRACTS,
] as const;
export const ANDROID_APPLICATION_TOOL_CONTRACTS = [
  ...selectToolContracts(APPLICATION_TOOL_CONTRACTS, [
    "search_guidance",
    "guided_workflows",
    "read_guidance_section",
    "project_android_application_graph",
  ] as const),
  ...ANALYSIS_SETTINGS_TOOL_CONTRACTS,
  ...ANALYSIS_VIEW_TOOL_CONTRACTS,
] as const;
export const ANDROID_SESSION_TOOL_CONTRACTS = selectToolContracts(
  SESSION_TOOL_CONTRACTS,
  ANDROID_TOOL_ALLOWLIST.session,
);

/** Android-only public inventory used by registration and verification. */
export const TOOL_CONTRACTS = [
  ...ANDROID_OFFICIAL_TOOL_CONTRACTS,
  ...ANDROID_ENHANCED_TOOL_CONTRACTS,
  ...ANDROID_NATIVE_TOOL_CONTRACTS,
  ...ANDROID_ARTIFACT_TOOL_CONTRACTS,
  ...ANDROID_TOOL_CONTRACTS,
  ...APKTOOL_TOOL_CONTRACTS,
  ...FLUTTER_TOOL_CONTRACTS,
  ...JEB_TOOL_CONTRACTS,
  ...ADB_TOOL_CONTRACTS,
  ...FRIDA_TOOL_CONTRACTS,
  ...ANDROID_APPLICATION_TOOL_CONTRACTS,
  ...ANDROID_SESSION_TOOL_CONTRACTS,
] as const;

/** Resolve a public contract by name while retaining its exact schema types. */
export const toolContract = <
  Name extends (typeof TOOL_CONTRACTS)[number]["name"],
>(
  name: Name,
): Extract<(typeof TOOL_CONTRACTS)[number], { readonly name: Name }> => {
  const contract = TOOL_CONTRACTS.find(
    (
      candidate,
    ): candidate is Extract<
      (typeof TOOL_CONTRACTS)[number],
      { readonly name: Name }
    > => candidate.name === name,
  );
  if (contract === undefined) throw new Error(`Missing tool contract: ${name}`);
  return contract;
};
