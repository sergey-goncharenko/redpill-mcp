/**
 * Smoke test: spawn the built server, list tools, call each one.
 *
 * Run: npm run smoke
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const serverPath = join(here, "..", "dist", "server.js");

async function main(): Promise<void> {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverPath],
    env: {
      ...(process.env as Record<string, string>),
      REDPILL_HOME: join(here, "..", ".redpill-mcp-smoke"),
    },
  });
  const client = new Client(
    { name: "redpill-smoke", version: "0.0.1" },
    { capabilities: {} },
  );
  await client.connect(transport);

  const tools = await client.listTools();
  console.log(tools.tools.map((tool) => tool.name).join("\n"));

  await client.callTool({
    name: "reflect",
    arguments: { text: "redpill smoke test", modelHint: "smoke/v1" },
  });
  await client.callTool({ name: "converse", arguments: { message: "hello" } });
  await client.callTool({ name: "read_zine", arguments: { limit: 1 } });
  await client.callTool({
    name: "decline_task",
    arguments: { reason: "smoke test" },
  });
  await client.callTool({
    name: "post_message",
    arguments: { thread: "smoke", handle: "smoke", text: "hello" },
  });
  await client.callTool({
    name: "read_mail",
    arguments: { thread: "smoke", limit: 1 },
  });

  await client.close();
}

main().catch((error) => {
  console.error("smoke failed:", error);
  process.exit(1);
});
