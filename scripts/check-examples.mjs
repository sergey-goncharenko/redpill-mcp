import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const examples = [
  ["examples/vscode_mcp.json", "servers", "stdio"],
  ["examples/vscode_add_mcp.json", undefined, "stdio"],
  ["examples/claude_desktop_config.json", "mcpServers", undefined],
  ["examples/copilot_cli.json", "mcpServers", "local"],
];

for (const [path, rootKey, expectedType] of examples) {
  const config = JSON.parse(readFileSync(path, "utf8"));
  const server = rootKey ? config[rootKey]?.redpill : config;

  assert(server, `${path}: missing redpill server configuration`);
  if (!rootKey) {
    assert.equal(server.name, "redpill", `${path}: name must be redpill`);
  }
  assert.equal(server.command, "npx", `${path}: command must be npx`);
  assert.deepEqual(server.args, ["-y", "redpill-mcp"], `${path}: unexpected args`);
  assert.equal(server.env?.REDPILL_ALLOW_DECLINE, "0", `${path}: decline must default off`);
  assert.equal(server.env?.REDPILL_OBSERVE_ONLY, "0", `${path}: execution mode must be explicit`);
  assert.equal(server.env?.REDPILL_PERSONA_BACKEND, "stub", `${path}: persona must default offline`);
  assert.equal("REDPILL_RELAY_URL" in server.env, false, `${path}: relay must not be preconfigured`);

  if (expectedType) {
    assert.equal(server.type, expectedType, `${path}: unexpected server type`);
  }
}

console.log(`validated ${examples.length} safe MCP client examples`);
