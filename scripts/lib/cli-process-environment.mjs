/** Prepare the selected process environment before importing CLI or MCP dependencies. */
export const prepareCliProcessEnvironment = (
  environment,
  platform,
  packageVersion,
) => {
  environment.REA_PACKAGE_VERSION = packageVersion;
  // Windows home lookup throws for an empty USERPROFILE. Dependencies resolve
  // home during import, before REA's own resolver can apply its account fallback.
  if (platform === "win32" && environment.USERPROFILE === "") {
    delete environment.USERPROFILE;
  }
};
