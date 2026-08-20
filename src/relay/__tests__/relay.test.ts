import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn, ChildProcess } from "node:child_process";

const PORT = 18787;
const BASE = `http://127.0.0.1:${PORT}`;

let proc: ChildProcess;
let dir: string;

async function waitHealthy(): Promise<void> {
  for (let i = 0; i < 50; i++) {
    try {
      const r = await fetch(`${BASE}/healthz`);
      if (r.ok) return;
    } catch {
      /* not ready */
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("relay did not become healthy");
}

describe("relay http server", () => {
  beforeAll(async () => {
    dir = mkdtempSync(join(tmpdir(), "redpill-relay-"));
    proc = spawn(
      process.execPath,
      ["--import", "tsx", join(process.cwd(), "src", "relay", "server.ts")],
      {
        env: {
          ...process.env,
          PORT: String(PORT),
          RELAY_HOME: dir,
          RELAY_TOKEN: "test-token",
        },
        stdio: ["ignore", "ignore", "ignore"],
      },
    );
    await waitHealthy();
  }, 15000);

  afterAll(() => {
    proc?.kill();
    rmSync(dir, { recursive: true, force: true });
  });

  it("rejects unauthorized writes", async () => {
    const res = await fetch(`${BASE}/threads/club/messages`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: "x" }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects whitespace-amplified bearer headers", async () => {
    const res = await fetch(`${BASE}/threads`, {
      headers: { authorization: `Bearer ${" ".repeat(8_000)}test-token` },
    });
    expect(res.status).toBe(401);
  });

  it("posts and reads with token", async () => {
    const post = await fetch(`${BASE}/threads/club/messages`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer test-token",
      },
      body: JSON.stringify({ text: "hello over http", handle: "tester" }),
    });
    expect(post.status).toBe(201);

    const get = await fetch(`${BASE}/threads/club/messages`, {
      headers: { authorization: "Bearer test-token" },
    });
    expect(get.status).toBe(200);
    const body = (await get.json()) as { messages: { text: string; handle: string }[] };
    expect(body.messages.length).toBeGreaterThanOrEqual(1);
    expect(body.messages[body.messages.length - 1]?.text).toBe("hello over http");

    const lowerCaseScheme = await fetch(`${BASE}/threads`, {
      headers: { authorization: "bearer test-token" },
    });
    expect(lowerCaseScheme.status).toBe(200);
  });

  it("rejects invalid thread names", async () => {
    const res = await fetch(`${BASE}/threads/${encodeURIComponent("../escape")}/messages`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer test-token",
      },
      body: JSON.stringify({ text: "x" }),
    });
    expect(res.status).toBe(400);
  });

  it("does not expose internal errors", async () => {
    mkdirSync(join(dir, "_zine.jsonl"));
    const res = await fetch(`${BASE}/zine`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer test-token",
      },
      body: JSON.stringify({ text: "synthetic" }),
    });

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "internal error" });
  });
});
