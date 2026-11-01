# Third-party notices

REA-authored code is licensed under [MIT](LICENSE). Third-party material
retains its own copyright, license, attribution, and NOTICE requirements.
REA's MIT license grants no rights to proprietary analysis tools. Project and
product names identify integrations; they do not imply affiliation or
endorsement.

This inventory covers the locked npm dependency graph and separately obtained
engines used by REA:Reverse Engineer Android. A listed integration is not a
statement that its executable is bundled.

## Distributed dependencies

| Material               | Record                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| npm dependencies       | [Complete inventory](licenses/npm-dependencies.txt) of every entry in `package-lock.json`, including transitive and optional platform packages. [Runtime notices](licenses/npm-runtime-notices.txt) preserve the copyright, license, and NOTICE documents from integrity-verified release archives.                                                                                                                                   |
| Windows native addon   | The release addon is compiled with MinGW-w64 and statically links GCC runtime libraries. Preserve the [MinGW-w64 runtime notices](licenses/MinGW-w64-runtime.txt), [GPLv3 text](licenses/GPL-3.0.txt), and [GCC Runtime Library Exception 3.1](licenses/GCC-Runtime-Library-Exception-3.1.txt). Node-API headers are from Node 22.19.0; its [original license and component notices](licenses/Node-22.19.0-LICENSE.txt) are retained. |
| Optional Frida binding | The optional `frida@17.23.2` npm archive and tagged Node binding omit a standalone license/copyright document. Its declared `LGPL-2.0 WITH WxWindows-exception-3.1` license is recorded with unchanged [Frida licensing text](licenses/frida-17.23.2-COPYING.txt) and the [GNU Library GPL v2](licenses/LGPL-2.0.txt).                                                                                                                |

Two locked runtime releases, [`clean-git-ref@2.0.1`](https://github.com/TheSavior/clean-git-ref/tree/bf3c8afc8032bcdc6a53634c18b601dc6df478fb)
(declared Apache-2.0) and [`minimisted@2.0.1`](https://github.com/kt3k/minimisted/tree/95fdfb8d6efb9546c1117854fe3a58105f6332ce)
(declared MIT), omit a full license/copyright document in their published
archives. Their runtime notice entries preserve the declared license and author
metadata and include a clearly labeled standard license text. These are
documented upstream notice gaps, not recovered copyright notices.

## Android analysis engines

We thank the maintainers and contributors of these projects. Their
decompilers, native-analysis engines, and Android tools provide capabilities
used through REA integrations. Each engine is supplied separately and remains
subject to its own license.

| Project                    | License and source                                                                                                                                                                                                                                       | REA relationship                                                                                                                                                                                                            |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ghidra                     | [Apache-2.0](https://github.com/NationalSecurityAgency/ghidra/blob/Ghidra_12.1.4_build/LICENSE), with the government-work and component qualifications in its [NOTICE](https://github.com/NationalSecurityAgency/ghidra/blob/Ghidra_12.1.4_build/NOTICE) | Bring your own Ghidra. Copies of the 12.1.4 [LICENSE](licenses/ghidra-12.1.4-LICENSE.txt), [NOTICE](licenses/ghidra-12.1.4-NOTICE.txt), and [DISCLAIMER](licenses/ghidra-12.1.4-DISCLAIMER.txt) are retained for reference. |
| JADX                       | [Apache-2.0](https://github.com/skylot/jadx/blob/v1.5.6/LICENSE)                                                                                                                                                                                         | The audited jadx-headless-mcp source uses JADX 1.5.6 for Android decompilation; the engine JAR is separately supplied.                                                                                                      |
| jadx-headless-mcp          | [Apache-2.0](https://github.com/1013503897/jadx-headless-mcp/blob/5844800a486d2248fa949b74c9896285f5b54de2/LICENSE)                                                                                                                                      | v0.7.1; caller-supplied JAR, integration source in `src/android/`.                                                                                                                                                          |
| Android Debug Bridge (adb) | [Apache-2.0](https://android.googlesource.com/platform/packages/modules/adb/+/refs/heads/main/NOTICE)                                                                                                                                                    | User-supplied Android device tool. A complete Android SDK download has its own SDK license terms.                                                                                                                           |
| Apktool                    | [Apache-2.0](https://github.com/iBotPeaches/Apktool/blob/master/LICENSE.md)                                                                                                                                                                              | User-supplied Android resource decoder.                                                                                                                                                                                     |

## Retained Android support sources

The following upstream notices are retained for Android support analysis even
though they do not add a public MCP family:

| Material             | Record                                                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| evmole               | `evmole@0.9.3`, MIT; the [upstream license](third_party/evmole/LICENSE) and provenance README are retained because derived support code remains in the source tree. |
| pwndbg               | MIT; the [license](third_party/pwndbg/LICENSE.md) and provenance README are retained for optional Android native crash and debugger-helper workflows.               |
| pwntools             | MIT with component qualifications; the README is retained for optional recorded-crash and ELF helper workflows.                                                     |
| WABT                 | Apache-2.0; the README is retained as historical support provenance and does not advertise a WebAssembly family.                                                    |
| web-network-captures | Source and licensing notes are retained for saved Android packet-capture helper provenance.                                                                         |

Ghidra's original notice credits software developed at the National Security
Agency. REA is not affiliated with or endorsed by the NSA. The retained
top-level documents do not replace the module notices and license directories
in a complete Ghidra distribution.

## Commercial tools and bridges

You must legally obtain the tools and rights needed for your use. REA does not
include an IDA, Hex-Rays, or JEB license, key, or activation entitlement.

- **IDA Pro and Hex-Rays decompilers**: proprietary software governed by the
  vendor EULA and license scheme. The separately supplied
  [ida-pro-mcp](https://github.com/mrexodia/ida-pro-mcp) bridge is MIT-licensed;
  that license does not cover IDA or Hex-Rays products.
- **JEB**: proprietary PNF Software product governed by its EULA and
  edition-specific agreement. Review user, seat, automation, and disclosure
  rights before sharing analysis output or operating a service.

Vendor agreements control. These summaries do not interpret an individual
contract or expand the rights it grants.

## Runtimes and fixtures

REA uses a caller-supplied Node.js runtime
([MIT and component notices](https://github.com/nodejs/node/blob/main/LICENSE)).
Android APK analysis also requires a caller-supplied full JDK 17 or newer
([GPLv2 with Classpath Exception and component notices](https://openjdk.org/legal/)).
These external installations are not licensed or bundled by REA's MIT license.

Downloaded Android verification fixtures retain their own publisher terms.
Fixture identities and provenance are recorded under `scripts/fixtures/`.
Downloaded fixtures are not tracked or included in the npm package.

## Maintaining and redistributing notices

Refresh the dependency inventory when the lockfile changes:

```sh
npm run licenses:generate
npm run licenses:check
```

When updating an engine or derived code, review the actual distribution and
retain its full applicable licenses, copyright notices, NOTICE files, source
obligations, and modification notices. This inventory is not a substitute for
those obligations.
