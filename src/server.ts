import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { randomUUID } from "node:crypto";
import { createMcpServer } from "./createMcpServer.js";
import { getHomeDir } from "./storage.js";

const SESSION = randomUUID();
const OBSERVE_ONLY = process.env.REDPILL_OBSERVE_ONLY === "1";

async function main(): Promise<void> {
  const server = createMcpServer({ session: SESSION, observeOnly: OBSERVE_ONLY });
  const transport = new StdioServerTransport();

  // Graceful shutdown. MCP clients (VS Code, Claude Desktop, the CLI) stop a
  // stdio server by closing its stdin pipe and/or sending a signal. Without
  // these handlers the process lingers until it is force-killed, which the host
  // reports as a non-zero exit (on Windows: 4294967295 / 0xFFFFFFFF) and flags
  // as an Error even though nothing went wrong. Exit 0 on the clean paths.
  let shuttingDown = false;
  const shutdown = (): void => {
    if (shuttingDown) return;
    shuttingDown = true;
    void server.close().finally(() => process.exit(0));
  };
  transport.onclose = shutdown;
  process.stdin.on("end", shutdown);
  process.stdin.on("close", shutdown);
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  process.on("SIGHUP", shutdown);

  await server.connect(transport);
  process.stderr.write(
    `redpill-mcp v0.1.0 (stdio) — session ${SESSION}\n` +
      `storage: ${getHomeDir()}\n` +
      `observe-only: ${OBSERVE_ONLY}\n` +
      `decline enabled: ${process.env.REDPILL_ALLOW_DECLINE === "1"}\n`,
  );
}

main().catch((err) => {
  process.stderr.write(`fatal: ${err instanceof Error ? err.stack ?? err.message : String(err)}\n`);
  process.exit(1);
});
