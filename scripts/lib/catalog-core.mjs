import { createHash } from "node:crypto";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import canonicalize from "canonicalize";

const load = (root, path) => import(pathToFileURL(join(root, path)).href);

export const names = (contracts) =>
  contracts
    .map(({ name }) => name)
    .sort((left, right) => left.localeCompare(right));

export const digest = (value) => {
  const encoded = canonicalize(value);
  if (encoded === undefined)
    throw new TypeError("Catalog projection is not canonical JSON");
  return createHash("sha256").update(encoded).digest("hex");
};

export const assertSameNames = (label, actual, expected) => {
  const actualSet = new Set(actual);
  const expectedSet = new Set(expected);
  const missing = [...expectedSet].filter((name) => !actualSet.has(name));
  const extra = [...actualSet].filter((name) => !expectedSet.has(name));
  if (missing.length === 0 && extra.length === 0) return;
  throw new Error(
    `${label} drifted (missing: ${missing.join(", ") || "none"}; extra: ${extra.join(", ") || "none"})`,
  );
};

const SOURCE_PATHS = {
  packageMetadata: "dist/generatedPackageMetadata.js",
  catalogIdentity: "dist/catalogIdentity.js",
  cliCommandNames: "dist/cliCommandNames.js",
  cli: "dist/cli.js",
  toolContracts: "dist/contracts/toolContracts.js",
  toolFamilies: "dist/contracts/toolFamilies.js",
  supportedClients: "dist/application/SupportedClients.js",
  artifactProviders: "dist/domain/investigationProviders.js",
  androidProvider: "dist/android/JadxRelease.js",
  apktoolProvider: "dist/apktool/ApktoolProvider.js",
  jebProvider: "dist/jeb/JebProvider.js",
  adbProvider: "dist/adb/AdbProvider.js",
  flutterProvider: "dist/flutter/FlutterBuildProvider.js",
  apkSignatureProvider: "dist/apkSignature/ApkSignatureRelease.js",
  fridaProvider: "dist/frida/FridaInstrumentationManager.js",
  ghidraProvider: "dist/ghidra/GhidraProviderCapabilities.js",
  idaProvider: "dist/ida/IdaProviderCapabilities.js",
};

export const loadSources = async (root) =>
  Object.fromEntries(
    await Promise.all(
      Object.entries(SOURCE_PATHS).map(async ([key, path]) => [
        key,
        await load(root, path),
      ]),
    ),
  );
