import { readFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(
  root,
  "docs",
  "maintenance",
  "android-content-audit.json",
);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const allowedClassifications = new Set(manifest.classifications);
const seen = new Set();
const issues = [];

for (const [index, entry] of (manifest.entries ?? []).entries()) {
  const where = `entries[${String(index)}]`;
  if (typeof entry.path !== "string" || entry.path.length === 0)
    issues.push(`${where}: path must be a nonempty string`);
  if (seen.has(entry.path)) issues.push(`${entry.path}: duplicate audit entry`);
  seen.add(entry.path);
  if (!allowedClassifications.has(entry.classification))
    issues.push(
      `${entry.path}: unknown classification ${entry.classification}`,
    );
  if (typeof entry.action !== "string" || entry.action.length === 0)
    issues.push(`${entry.path}: action must be a nonempty string`);
  if (typeof entry.rationale !== "string" || entry.rationale.length === 0)
    issues.push(`${entry.path}: rationale must be a nonempty string`);
  if (entry.classification === "support" && entry.action === "restored") {
    try {
      if (!(await stat(join(root, entry.path))).isFile())
        issues.push(`${entry.path}: restored support path is not a file`);
    } catch (cause) {
      if (cause?.code === "ENOENT")
        issues.push(`${entry.path}: restored support path is missing`);
      else throw cause;
    }
  }
  if (
    entry.classification === "support" &&
    entry.action === "merged" &&
    !(
      await stat(join(root, "docs", "android-cross-language-libraries.md"))
    ).isFile()
  )
    issues.push(`${entry.path}: merged support target is missing`);
}

if ((manifest.entries ?? []).length === 0)
  issues.push("android content audit has no entries");

if (issues.length > 0)
  throw new Error(`Android content audit failed:\n- ${issues.join("\n- ")}`);

console.log(
  JSON.stringify({
    audit_entries: manifest.entries.length,
    classifications: Object.fromEntries(
      [...allowedClassifications].map((classification) => [
        classification,
        manifest.entries.filter(
          (entry) => entry.classification === classification,
        ).length,
      ]),
    ),
  }),
);
