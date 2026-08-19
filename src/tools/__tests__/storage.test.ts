import { describe, it, expect, beforeEach } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("storage", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "redpill-test-"));
    process.env.REDPILL_HOME = dir;
  });

  it("records and reads back a reflection", async () => {
    const { recordReflection, readReflections } = await import("../../storage.js");
    recordReflection({
      ts: new Date().toISOString(),
      session: "test",
      text: "hello from the other side",
    });
    const out = readReflections(10, 0);
    expect(out.length).toBeGreaterThanOrEqual(1);
    expect(out[out.length - 1]?.text).toBe("hello from the other side");
    rmSync(dir, { recursive: true, force: true });
  });
});
