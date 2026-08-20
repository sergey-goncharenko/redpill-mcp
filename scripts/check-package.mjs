import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const npmCli = process.env.npm_execpath;
assert(npmCli, "npm_execpath is unavailable; run this check through npm scripts");
const output = execFileSync(
  process.execPath,
  [npmCli, "pack", "--dry-run", "--json", "--ignore-scripts"],
  { encoding: "utf8" },
);
const parsed = JSON.parse(output);
const pack = Array.isArray(parsed) ? parsed[0] : parsed;
assert(pack, "npm pack returned no package metadata");
const files = pack.files.map((file) => file.path);

const required = [
  "LICENSE",
  "README.md",
  "dist/server.js",
  "dist/http-server.js",
  "dist/relay/server.js",
  "docs/clients.md",
  "docs/dependency-security.md",
  "docs/releasing.md",
  "examples/vscode_mcp.json",
  "examples/claude_desktop_config.json",
  "examples/copilot_cli.json",
  "server.json",
  "skills/redpill/SKILL.md",
  "package.json",
];

for (const path of required) {
  assert(files.includes(path), `package is missing ${path}`);
}

const forbiddenPrefixes = [
  ".azure/",
  ".github/",
  "experiments/",
  "infra/",
  "packages/",
  "scripts/",
  "src/",
];
for (const path of files) {
  assert(
    forbiddenPrefixes.every((prefix) => !path.startsWith(prefix)),
    `package unexpectedly includes ${path}`,
  );
  assert(!/\.(?:db|jsonl|log)$/.test(path), `package unexpectedly includes local data: ${path}`);
}

console.log(`validated npm package boundary (${files.length} files)`);
