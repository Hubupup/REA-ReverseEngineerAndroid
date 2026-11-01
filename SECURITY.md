# Security Policy

## Supported versions

Security fixes are provided for the latest source state of
REA:Reverse Engineer Android. Build and test the current checkout before
reporting a problem that may already be resolved.

This fork follows upstream REA security fixes selectively when they affect the
Android, shared process, Evidence, or Ghidra/IDA code retained here. It does not
inherit upstream npm updates automatically.

## Reporting a vulnerability

Do not disclose vulnerabilities, proof-of-concept exploits, credentials,
private APKs, JEB projects, Ghidra projects, Frida scripts, device data, or
captured personal information in a public issue.

Use **Report a vulnerability** in the repository's **Security** tab. If private
reporting is unavailable, contact the repository owner through the configured
private channel. Do not open a public issue to request a private contact
channel.

Include:

- The affected source revision.
- Operating system and Node.js version.
- Impact and affected trust boundary.
- Selected provider: JADX, ADB, Apktool, Ghidra, IDA, JEB, or Frida.
- Provider and target versions when known.
- Reproduction conditions and the smallest useful diagnostic.
- Suggested mitigation, if known.

Redact transport tokens, bridge capability tokens, credentials, private keys,
device secrets, personal data, unrelated local paths, and private APK contents.
Do not attach a user's proprietary target without explicit authorization.

The maintainer will acknowledge the report, assess scope, coordinate safe
reproduction, and agree on remediation and disclosure timing.

## Security boundary

REA:Reverse Engineer Android is a local analysis tool, not a sandbox.
Opening an untrusted APK or native library delegates parsing and analysis to
the selected local provider with the current user's permissions.

The Ghidra bridge uses a per-session capability token and the repository's
owned-process boundary. POSIX uses current-user sockets. Windows uses
authenticated loopback communication with a private NTFS runtime. Tokens are
not placed in process arguments, command lines, or unrelated environment
variables.

JADX, Apktool, and ADB remain caller-supplied executables. REA validates
selection and configuration at its boundary but does not make those tools safe
for untrusted inputs or establish that a wrapper executes the expected binary.

JEB is reached through a caller-started local MCP client selected with
`REA_JEB_MCP_URL`. Its authentication, project state, and network exposure are
owned by JEB and the caller.

Frida scripts execute inside the selected target process. They can read or
modify memory and behavior and can access the target's capabilities. REA
preserves session identity and cleanup state but does not sandbox scripts.

ADB operations act on the selected Android device. Install, uninstall, push,
app start/stop, bugreport, and capture operations can change device or package
state. Keep the serial and package selection exact.

## Resource and data handling

REA retains bounded provider diagnostics and Evidence according to the selected
operation. Complete Evidence can be exported to a caller-selected local path.
The caller is responsible for the lifetime and sharing of those artifacts.

Do not retain transport authentication, JEB or Frida credentials, ADB secrets,
or explicitly marked sensitive values. Do not infer secrecy from a variable
name or text pattern.

## Provider prerequisites

REA does not install or upgrade Java, JADX, ADB, Apktool, Ghidra, IDA, JEB, or
Frida. Bring-your-own engines and tools retain their own security policies,
licenses, update mechanisms, and trust boundaries.

For Ghidra, `GHIDRA_INSTALL_DIR` and optional `JAVA_HOME` identify
user-managed installations. Setup may add those values to a client
configuration only after showing the proposed change and receiving approval.

## Windows native controls

Windows Android, Ghidra, and owned-process workflows require the packaged
native controls under `native/windows/build/`. They are verified against the
package version and artifact digest before loading. There is no environment
override for loading an arbitrary native module.

The Windows boundary uses Job Objects and private runtime directories to
contain owned process families and temporary files. It is a resource-ownership
boundary, not a security sandbox for untrusted native code.
