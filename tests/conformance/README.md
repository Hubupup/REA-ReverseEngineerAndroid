# Source-built conformance fixtures

These sources are small semantic oracles for the retained Android providers.
Only source files are versioned. Generated binaries, generated source, debug
information, and manifests belong under ignored `build/` directories.

## Android fixtures

- `android/` contains APK, JNI-binding, manifest, resource, and R8 mapping
  fixtures.
- `ghidra/` contains source-owned ELF fixtures for the read-only Ghidra
  provider contract.
- `c/` contains portable C sources used to build reviewed ELF oracles.

Android fixture READMEs document the exact producer, target digest, and
expected observation. They are static fixtures; none of them execute a target
application or require an emulator.

## Build and verification

Use the repository's pinned toolchain:

```sh
npm ci
npm run verify:fixtures
```

The fixture command may require a host C compiler and platform-specific
tooling. It never installs Java, JADX, ADB, Apktool, Ghidra, IDA, JEB, or
Frida.

Real provider behavior is established only by the matching lane in
[testing](../../docs/testing.md#real-provider-lanes). A source-built fixture
can prove parser and adapter boundaries even when the real engine is absent,
but it must not be reported as real-provider verification.

## Retained scope

Do not add conformance fixtures for removed browser, desktop, JavaScript,
Apple, HarmonyOS, firmware, PE, WASM, EVM, SQLite, GPU, or unrelated native
formats. Add a new fixture only when it supports a retained Android tool or
shared Evidence/session contract.
