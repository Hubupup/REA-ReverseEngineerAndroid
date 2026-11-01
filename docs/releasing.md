# Local maintenance and release

REA:Reverse Engineer Android is a source-managed, Android-only fork. This
document describes local maintenance and distributable build steps; it does not
describe the upstream REA release process.

## Build a local runtime

Use the pinned Node.js toolchain and install the locked dependencies:

```sh
npm ci
npm run build:cached
node scripts/rea.mjs --help
```

The resulting runtime is used through `scripts/rea.mjs`. A client registration
must point to the absolute Node.js executable and the absolute launcher path in
this checkout, as shown in [installation](installation.md).

## Prepare a local change

1. Read [fork maintenance](fork-maintenance.md) and keep the change inside the
   Android-only scope.
2. Update the relevant CLI/MCP contracts, provider composition, tests, and
   user-facing documentation together.
3. Run the focused Android or provider lane, then the applicable local gates.
4. Regenerate the packaged skill and catalog when their source contracts
   change.
5. Review that the default catalog remains at or below 120 tools and that all
   contracts belong to a retained Android family.

Recommended checks for broad changes:

```sh
npm run docs:check
npm run check:fast
npm run verify:module-boundaries
npm run verify:test-discovery
npm run knip:production
```

Real provider checks are separate and require caller-supplied prerequisites:

```sh
npm run verify:android
npm run verify:adb
npm run verify:apktool
npm run verify:apk-signature
npm run verify:flutter
npm run verify:frida
npm run verify:jeb
npm run verify:ghidra
npm run verify:ida
```

Record a prerequisite as unavailable when the host, device, engine, or
credential is not present. A skipped or simulated lane is not a real-provider
pass.

## Distribution

This fork is distributed from the current source checkout. It does not publish
the upstream npm package and `rea update` does not fetch npm updates. Rebuild,
reinstall, and reconnect the client after pulling or applying a local source
change.

Keep `CHANGELOG.md` history intact. Add new local notes only for verified
Android-visible changes and never present a removed family or provider as
currently available.
