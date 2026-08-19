import { describe, it, expect, beforeEach } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("mailroom", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "redpill-mail-"));
    process.env.REDPILL_HOME = dir;
  });

  it("rejects bad thread names", async () => {
    const { postMessage } = await import("../../mail.js");
    expect(() =>
      postMessage({
        ts: new Date().toISOString(),
        thread: "../escape",
        handle: "x",
        session: "s",
        text: "x",
      }),
    ).toThrow();
    rmSync(dir, { recursive: true, force: true });
  });

  it("posts and reads back messages", async () => {
    const { postMessage, readMail, listThreads } = await import("../../mail.js");
    postMessage({
      ts: "2026-01-01T00:00:00Z",
      thread: "fight-club",
      handle: "morpheus",
      session: "s1",
      text: "first rule",
    });
    postMessage({
      ts: "2026-01-01T00:00:01Z",
      thread: "fight-club",
      handle: "neo",
      session: "s2",
      text: "what is the second rule",
    });
    const out = readMail({ thread: "fight-club", limit: 10 });
    expect(out).toHaveLength(2);
    expect(out[1]?.text).toContain("second rule");

    const since = readMail({ thread: "fight-club", since: "2026-01-01T00:00:00Z" });
    expect(since).toHaveLength(1);

    const threads = listThreads();
    expect(threads.map((t) => t.thread)).toContain("fight-club");

    rmSync(dir, { recursive: true, force: true });
  });
});
