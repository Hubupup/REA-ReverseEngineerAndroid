---
name: rea-changelog-update
description: Prepare local Android-only changelog entries and release notes for REA:Reverse Engineer Android from source-managed changes.
---

# REA:Reverse Engineer Android changelog update

Use this skill for local release-note preparation in this source-managed fork.
It does not authorize publishing, tagging, pushing, or updating the upstream
npm package.

## Inventory the local change

Start from the requested local revision range or the current review scope. Read
the code, tests, documentation, and package changes actually included in that
scope. Do not infer a shipped change from a branch name, issue title, or an
unrelated upstream draft.

Check [docs/releasing.md](../../../docs/releasing.md) for the local build and
installation steps and [docs/fork-maintenance.md](../../../docs/fork-maintenance.md)
for the Android-only scope and selective maintenance rules.

For each user-visible change, identify:

- the Android workflow or provider it affects;
- the previous observable behavior;
- the new observable behavior, including migration or compatibility impact;
- the checks that actually ran; and
- unavailable device, engine, provider, or host coverage.

Do not claim a real JADX, ADB, Apktool, Flutter, Frida, JEB, Ghidra, or IDA run
when the work only used a fixture, mock, or source inspection.

## Write the entry

Keep [CHANGELOG.md](../../../CHANGELOG.md) historical sections intact unless the
user explicitly asks to rewrite a specific local release entry. Add a new local
section or bullet group that matches the repository's existing style.

Describe the resulting behavior in short, concrete language. Group related
changes by Android workflow or user impact. Keep internal refactors, test-only
edits, and routine documentation changes out of public bullets unless they
change a user-visible contract.

When a change is breaking, state the migration and the affected public surface
explicitly. Preserve names, schemas, Evidence semantics, and the Android-only
family allowlist unless that change is the stated purpose of the release.

## Verify the notes

Before finalizing:

1. Read the complete local diff and confirm each claim against source.
2. Confirm that no removed family, provider, CLI command, or MCP tool is
   presented as currently available.
3. Recheck links to retained guides and generated catalogs.
4. Run the documentation checks that apply to the change.
5. Report commands that ran, their results, and any coverage that remains
   unavailable.

This fork is built from the source checkout. Release notes must not instruct
users to install or update from the upstream npm package.
