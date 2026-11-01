# Cross-language Android libraries and resources

Android applications can contain native code and data produced by languages
and engines beyond Java/Kotlin and Flutter. This guide records the Android
support areas that should not be lost when upstream provider pages are
disabled.

## Native libraries

An APK can contain ELF `.so` libraries built with:

- C or C++;
- Go;
- Rust;
- Unity or another game engine;
- React Native or Hermes; and
- custom language runtimes embedded by the application.

The provider remains Ghidra or IDA for native analysis. A language-specific
metadata inventory may be used as supporting evidence, but it does not replace
ELF identity, architecture, symbols, relocations, or JNI relationships.

Keep these facts separate:

- the APK member path and digest;
- the ELF architecture and ABI;
- observed symbols and dynamic dependencies;
- language-runtime metadata;
- inferred source-language or framework identity; and
- runtime loading or execution.

## Go and Rust libraries

Go and Rust can leave symbols, build metadata, panic messages, module
identifiers, and runtime tables in an Android `.so`. Their presence is a
derivation from the selected bytes, not a claim that the library is the
application's entry point.

Use the native workflow to:

1. identify the APK member and extract the selected `.so`;
2. inspect ELF layout, exports, notes, and dependencies;
3. recover functions or metadata with Ghidra or IDA;
4. compare recovered metadata with known runtime structures; and
5. retain unknown or stripped facts instead of inferring a missing language.

## Unity and Godot

Unity and Godot Android builds can contain engine-native libraries, managed or
script resources, asset bundles, and archive formats. The current fork does not
advertise a separate game-engine MCP family. Treat engine asset parsing as
Android support analysis:

- inventory the APK members and hashes;
- identify the engine library or archive by its actual bytes;
- preserve asset paths and compression metadata;
- distinguish archive structure from decoded game logic; and
- record unsupported or encrypted resources as unknown.

## React Native and Hermes

React Native applications can contain JavaScript bundles, Hermes bytecode,
native bridge libraries, and resources. The default catalog does not register
standalone JavaScript or browser target families. Retain only Android-relevant
support:

- APK member identity and bundle paths;
- Hermes bytecode format and version when established by the parser;
- JNI or native bridge candidates;
- resource and asset relationships; and
- runtime observations from an explicitly selected Android target.

## Python and analysis helpers

Python can be part of a toolchain, fixture generator, or reverse-engineering
helper. It is not an Android target family by itself. A Python helper may be
documented when it supports Android APK, native, device, or Evidence workflows;
generic packaged-Python analysis remains outside the default public catalog.

## Public surface rule

Cross-language support does not add a public family or tool. Provider
registration, CLI enumeration, the MCP catalog, and plugin manifests remain
controlled by the Android allowlist. Any future public integration requires a
separate scope decision, package inventory update, schema, tests, and provider
verification.
