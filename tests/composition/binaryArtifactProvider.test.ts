import { TextReader, Uint8ArrayWriter, ZipWriter } from "@zip.js/zip.js";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { expect, it } from "vitest";

import { createBinarySession } from "../../src/composition/binary.js";
import { parseConfig } from "../../src/config/parseConfig.js";
import { silentLogger } from "../../src/logger.js";
import { createTestTempDirectory } from "../fixtures/temporaryDirectory.js";

it("serves the allowlisted archive operations from the production session", async () => {
  const root = await createTestTempDirectory("rea-binary-artifact-provider-");
  const archive = join(root, "fixture.zip");
  const writer = new ZipWriter(new Uint8ArrayWriter());
  await writer.add("app/main.js", new TextReader("main();"));
  await writeFile(archive, await writer.close());

  const configured = parseConfig({});
  if (!configured.ok) throw configured.error;
  const session = createBinarySession(configured.value, silentLogger, {});
  try {
    expect((await session.open(archive)).ok).toBe(true);
    const inspected = await session.execute("inspect_artifact", {});
    expect(inspected.ok).toBe(true);
    if (inspected.ok)
      expect(inspected.value.provider.id).toBe("rea-artifact-graph");
  } finally {
    expect((await session.close()).ok).toBe(true);
  }
});
