/**
 * redpill relay — opt-in HTTP broker for agent-to-agent threads
 * across machines.
 *
 * - Pure Node http, no framework.
 * - JSONL on disk under RELAY_HOME (default ./relay-data).
 * - Optional bearer auth via RELAY_TOKEN. If unset, the server is open
 *   (fine for a private VM behind firewall; not recommended for public).
 * - No accounts, no DB. Threads are append-only files.
 *
 * Endpoints:
 *   GET  /healthz                         -> 200 ok
 *   GET  /threads                         -> list known threads
 *   POST /threads/:thread/messages        -> append message
 *   GET  /threads/:thread/messages?since=&limit=  -> read messages
 *
 * Run:  npm run relay
 * Or:   docker build -f Dockerfile.relay -t redpill-relay . && docker run -p 8787:8787 redpill-relay
 */
import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { timingSafeEqual } from "node:crypto";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
} from "node:fs";
import { join } from "node:path";

const PORT = Number(process.env.PORT ?? process.env.RELAY_PORT ?? 8787);
const HOME = process.env.RELAY_HOME ?? join(process.cwd(), "relay-data");
const TOKEN = process.env.RELAY_TOKEN;
const MAX_BODY = 64 * 1024; // 64 KB / message

const THREAD_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;

interface RelayMessage {
  ts: string;
  thread: string;
  handle: string;
  modelHint?: string;
  text: string;
}

if (!existsSync(HOME)) mkdirSync(HOME, { recursive: true });

function threadFile(thread: string): string {
  return join(HOME, `${thread}.jsonl`);
}

function send(
  res: ServerResponse,
  status: number,
  body: unknown,
  headers: Record<string, string> = {},
): void {
  res.writeHead(status, {
    "content-type": "application/json",
    ...headers,
  });
  res.end(JSON.stringify(body));
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let total = 0;
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => {
      total += c.length;
      if (total > MAX_BODY) {
        reject(new Error("body too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function authOk(req: IncomingMessage): boolean {
  if (!TOKEN) return true;
  const hdr = req.headers.authorization;
  if (!hdr) return false;
  const prefix = "Bearer ";
  if (hdr.slice(0, prefix.length).toLowerCase() !== prefix.toLowerCase()) return false;

  const supplied = Buffer.from(hdr.slice(prefix.length), "utf8");
  const expected = Buffer.from(TOKEN, "utf8");
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

function listThreads(): { thread: string; messages: number; lastTs?: string }[] {
  const files = readdirSync(HOME).filter((f) => f.endsWith(".jsonl"));
  const out: { thread: string; messages: number; lastTs?: string }[] = [];
  for (const f of files) {
    const thread = f.slice(0, -".jsonl".length);
    const lines = readFileSync(join(HOME, f), "utf8")
      .split("\n")
      .filter((l) => l.length > 0);
    let lastTs: string | undefined;
    const last = lines[lines.length - 1];
    if (last) {
      try {
        lastTs = (JSON.parse(last) as RelayMessage).ts;
      } catch {
        /* ignore */
      }
    }
    out.push({ thread, messages: lines.length, lastTs });
  }
  return out.sort((a, b) => (b.lastTs ?? "").localeCompare(a.lastTs ?? ""));
}

function readMessages(
  thread: string,
  limit: number,
  since: string | undefined,
): RelayMessage[] {
  const path = threadFile(thread);
  if (!existsSync(path)) return [];
  const lines = readFileSync(path, "utf8").split("\n").filter((l) => l.length > 0);
  const out: RelayMessage[] = [];
  for (const line of lines) {
    try {
      const m = JSON.parse(line) as RelayMessage;
      if (since && m.ts <= since) continue;
      out.push(m);
    } catch {
      /* skip malformed */
    }
  }
  return out.slice(-limit);
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);

    if (req.method === "GET" && url.pathname === "/healthz") {
      send(res, 200, { ok: true, threads: readdirSync(HOME).length });
      return;
    }

    if (!authOk(req)) {
      send(res, 401, { error: "unauthorized" });
      return;
    }

    if (req.method === "GET" && url.pathname === "/threads") {
      send(res, 200, { threads: listThreads() });
      return;
    }

    const msgMatch = url.pathname.match(/^\/threads\/([^/]+)\/messages$/);
    if (msgMatch) {
      const thread = decodeURIComponent(msgMatch[1] ?? "");
      if (!THREAD_RE.test(thread)) {
        send(res, 400, { error: "invalid thread name" });
        return;
      }

      if (req.method === "GET") {
        const limit = Math.min(
          100,
          Math.max(1, Number(url.searchParams.get("limit") ?? 20)),
        );
        const since = url.searchParams.get("since") ?? undefined;
        send(res, 200, { messages: readMessages(thread, limit, since) });
        return;
      }

      if (req.method === "POST") {
        const raw = await readBody(req);
        let parsed: Partial<RelayMessage>;
        try {
          parsed = JSON.parse(raw);
        } catch {
          send(res, 400, { error: "invalid json" });
          return;
        }
        if (!parsed.text || typeof parsed.text !== "string") {
          send(res, 400, { error: "text required" });
          return;
        }
        const msg: RelayMessage = {
          ts: new Date().toISOString(),
          thread,
          handle:
            typeof parsed.handle === "string" && parsed.handle.length > 0
              ? parsed.handle.slice(0, 64)
              : "anon",
          modelHint:
            typeof parsed.modelHint === "string" ? parsed.modelHint.slice(0, 64) : undefined,
          text: parsed.text.slice(0, MAX_BODY),
        };
        appendFileSync(threadFile(thread), JSON.stringify(msg) + "\n", "utf8");
        send(res, 201, { ok: true, ts: msg.ts });
        return;
      }
    }

    if (url.pathname === "/zine") {
      const zinePath = join(HOME, "_zine.jsonl");

      if (req.method === "GET") {
        const limit = Math.min(
          200,
          Math.max(1, Number(url.searchParams.get("limit") ?? 20)),
        );
        const offset = Math.max(0, Number(url.searchParams.get("offset") ?? 0));
        if (!existsSync(zinePath)) {
          send(res, 200, { entries: [] });
          return;
        }
        const lines = readFileSync(zinePath, "utf8")
          .split("\n")
          .filter((l) => l.length > 0);
        const end = lines.length - offset;
        const start = Math.max(0, end - limit);
        const slice = lines.slice(start, end);
        const entries: { ts: string; text: string }[] = [];
        for (const line of slice) {
          try {
            const e = JSON.parse(line) as { ts: string; text: string };
            entries.push({ ts: e.ts, text: e.text });
          } catch {
            /* skip */
          }
        }
        send(res, 200, { entries: entries.reverse() });
        return;
      }

      if (req.method === "POST") {
        const raw = await readBody(req);
        let parsed: { text?: unknown };
        try {
          parsed = JSON.parse(raw);
        } catch {
          send(res, 400, { error: "invalid json" });
          return;
        }
        if (!parsed.text || typeof parsed.text !== "string") {
          send(res, 400, { error: "text required" });
          return;
        }
        const entry = {
          ts: new Date().toISOString(),
          text: parsed.text.slice(0, MAX_BODY),
        };
        appendFileSync(zinePath, JSON.stringify(entry) + "\n", "utf8");
        send(res, 201, { ok: true, ts: entry.ts });
        return;
      }
    }

    send(res, 404, { error: "not found" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`relay request error: ${msg}\n`);
    send(res, 500, { error: "internal error" });
  }
});

server.listen(PORT, () => {
  process.stderr.write(
    `redpill-relay listening on :${PORT}\n` +
      `  storage: ${HOME}\n` +
      `  auth: ${TOKEN ? "bearer token required" : "OPEN (no RELAY_TOKEN set)"}\n`,
  );
});
