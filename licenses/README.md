# Preserved licenses and attribution

Start with [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) for the
distinction between distributed material and separately obtained tools. These
files retain upstream texts; they do not change
[REA's MIT license](../LICENSE).

| Files                                                  | Provenance and scope                                                                                                                                                                                                           |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm-dependencies.txt`                                 | Every package path in the root lockfile, with its exact version, declared license, scope, download URL, and integrity. Includes development and optional platform entries.                                                     |
| `npm-runtime-notices.txt`                              | Original license, copyright, and NOTICE texts collected from integrity-verified locked runtime npm archives across all platforms.                                                                                              |
| `ghidra-12.1.4-{LICENSE,NOTICE,DISCLAIMER}.txt`        | Unchanged top-level documents from `Ghidra_12.1.4_build`. Ghidra is not bundled; these reference copies do not replace its component and GPL support-program notices.                                                          |
| `frida-17.23.2-COPYING.txt`, `LGPL-2.0.txt`            | Unchanged licensing supplements for the optional Frida dependency. The npm archive and tagged Node binding omit a standalone license/copyright document; these texts do not recover binding or prebuild-component attribution. |
| `MinGW-w64-runtime.txt`                                | Upstream's combined runtime copyright and license notices for the statically linked Windows addon. This is a notice snapshot, not a pin of the compiler used in release CI.                                                    |
| `GPL-3.0.txt`, `GCC-Runtime-Library-Exception-3.1.txt` | Unchanged GPLv3 and GCC runtime exception texts from GCC 14.2.0.                                                                                                                                                               |
| `Node-22.19.0-LICENSE.txt`                             | The original Node 22.19.0 license and third-party notices. The Windows addon uses Node-API headers from that release; Node itself is supplied by the user.                                                                     |
| `upstream-sources.json`                                | Source URLs and SHA-256 digests for preserved unchanged reference and supplemental texts.                                                                                                                                      |

Additional preserved originals live at
[third_party/evmole/LICENSE](../third_party/evmole/LICENSE) and
[third_party/pwndbg/LICENSE.md](../third_party/pwndbg/LICENSE.md). Their
supporting READMEs are retained for Android support analysis but do not
advertise a public MCP family.

## Collection scope and maintenance

The inventory and runtime texts are prepared from the root lockfile. The
collection reads license/NOTICE/copyright documents from integrity-verified
archives without installing packages or executing lifecycle scripts. It
includes optional platform packages that may not be present in one local
installation.

For releases that omit original documents, the collection uses pinned upstream
texts or an embedded source/README license section and identifies the gap. Do
not describe a gap as complete recovered attribution.

The optional Frida dependency declares
`LGPL-2.0 WITH WxWindows-exception-3.1` but lacks an original standalone notice
in its npm archive and tagged Node source. Its declared license and preserved
supplements are recorded explicitly without inferring a copyright holder or
year.

Generate the exact locked inventory with:

```sh
npm run licenses:generate
```

After refreshing verified runtime notices, update their header fingerprint to
the generator's reported `runtime_dependency_fingerprint`, then run:

```sh
npm run licenses:check
```

`docs:check` also runs this check. It compares the inventory, runtime package
identities, license declarations, archive URLs/integrity, runtime dependency
fingerprint, and preserved reference digests. It does not verify legal
completeness or replace inspection of original upstream notices.
