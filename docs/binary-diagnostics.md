# Android ELF diagnostics

The diagnostic family provides offline observations for Android ELF shared
objects. It does not require an active Ghidra or IDA session and does not
execute the target.

## `inspect_binary_layout`

`inspect_binary_layout` answers what the file contains:

- ELF class, byte order, ABI, machine, and flags;
- sections and segments with file and virtual coordinates;
- original symbols, relocations, and linkage names;
- mitigation indicators available from headers; and
- structural omissions or malformed ranges.

CLI:

```sh
node scripts/rea.mjs inspect-binary-layout /absolute/path/libexample.so --json
```

The result remains useful when symbols or relocations are stripped. Missing
entries are unknown unless the selected ELF structure was completely examined.

## `inspect-elf-notes`

ELF notes report producer, build, ABI, and Android-specific note records that
the parser can identify. Preserve the original note name/type and raw payload
provenance; an unknown note is not absence of a build fact.

```sh
node scripts/rea.mjs inspect-elf-notes /absolute/path/libexample.so
```

## `inspect-native-exports`

Native exports report ELF-defined symbols and dynamic export metadata. They are
static linkage facts and do not prove that Android loaded or called the
library at runtime.

```sh
node scripts/rea.mjs inspect-native-exports /absolute/path/libexample.so
```

Use JNI and Android application inspection to relate exports to DEX
declarations. A name match is a candidate unless the provider can establish a
stronger relationship.

## `inspect-byte-entropy`

Byte entropy reports bounded observations over a requested range or block
layout:

```sh
node scripts/rea.mjs inspect-byte-entropy /absolute/path/libexample.so \
  --block-size 4096 --json
```

Entropy is not a classification or proof of compression, encryption, or
obfuscation. Preserve offsets, lengths, block size, and examined coverage so
the caller can distinguish a local pattern from the whole file.

## Limits and Evidence

Diagnostics report the selected path, file digest, parser coverage, source
locations, and limitations. They do not decode removed PE, Mach-O, DOS,
firmware, or raw-binary formats.

When a result is partial, retry with a narrower range or use Ghidra/IDA for
provider-backed analysis. Do not reinterpret an omitted field as an observed
negative fact.
