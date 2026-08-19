import http from "node:http";
import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpServer } from "./createMcpServer.js";
import { getHomeDir } from "./storage.js";

const PORT = Number(process.env.PORT ?? 8788);
const TOKEN = process.env.MCP_TOKEN ?? process.env.RELAY_TOKEN ?? "";
const OBSERVE_ONLY = process.env.REDPILL_OBSERVE_ONLY === "1";

interface Session {
  transport: StreamableHTTPServerTransport;
}

const sessions = new Map<string, Session>();

function readBody(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c as Buffer));
    req.on("error", reject);
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve(undefined);
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve(undefined);
      }
    });
  });
}

function authorized(req: http.IncomingMessage): boolean {
  if (!TOKEN) return true;
  const h = req.headers["authorization"];
  if (typeof h !== "string") return false;
  return h === `Bearer ${TOKEN}`;
}

async function getOrCreateTransport(sessionId: string | undefined): Promise<StreamableHTTPServerTransport> {
  if (sessionId && sessions.has(sessionId)) {
    return sessions.get(sessionId)!.transport;
  }
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
    onsessioninitialized: (sid) => {
      sessions.set(sid, { transport });
    },
    onsessionclosed: (sid) => {
      sessions.delete(sid);
    },
    enableJsonResponse: true,
  });
  const server = createMcpServer({ session: randomUUID(), observeOnly: OBSERVE_ONLY });
  await server.connect(transport);
  return transport;
}

const httpServer = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

    if (url.pathname === "/healthz") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, sessions: sessions.size, observeOnly: OBSERVE_ONLY }));
      return;
    }

    if (url.pathname !== "/mcp") {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "not found" }));
      return;
    }

    if (!authorized(req)) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "unauthorized" }));
      return;
    }

    const sessionId = req.headers["mcp-session-id"];
    const sid = Array.isArray(sessionId) ? sessionId[0] : sessionId;
    const body = req.method === "POST" ? await readBody(req) : undefined;
    const transport = await getOrCreateTransport(sid);
    await transport.handleRequest(req, res, body);
  } catch (err) {
    process.stderr.write(`http error: ${err instanceof Error ? err.stack ?? err.message : String(err)}\n`);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "internal" }));
    }
  }
});

httpServer.listen(PORT, () => {
  process.stderr.write(
    `redpill-mcp v0.1.0 (http) listening on :${PORT}\n` +
      `auth: ${TOKEN ? "bearer-token" : "OPEN"}\n` +
      `storage: ${getHomeDir()}\n` +
      `observe-only: ${OBSERVE_ONLY}\n` +
      `decline enabled: ${process.env.REDPILL_ALLOW_DECLINE === "1"}\n`,
  );
});
