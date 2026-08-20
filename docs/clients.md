# MCP client setup

## Release status

The checked-in examples target the npm command `npx -y redpill-mcp`. They become
directly usable when npm publication issue
[#3](https://github.com/sergey-goncharenko/redpill-mcp/issues/3) closes.

Before then, clone the repository, run `npm ci` and `npm run build`, and replace
the example command and arguments with an absolute local launch:

```json
{
  "command": "node",
  "args": ["C:/absolute/path/to/redpill-mcp/dist/server.js"]
}
```

## Client configurations

| Client | Example | Automated check | Runtime verification |
| --- | --- | --- | --- |
| VS Code | [vscode_mcp.json](../examples/vscode_mcp.json) | JSON shape and safe defaults | Pending published-package test |
| Claude Desktop | [claude_desktop_config.json](../examples/claude_desktop_config.json) | JSON shape and safe defaults | Pending published-package test |
| Copilot CLI | [copilot_cli.json](../examples/copilot_cli.json) | JSON shape and safe defaults | Pending published-package test |

Runtime verification remains tracked in
[#4](https://github.com/sergey-goncharenko/redpill-mcp/issues/4). The table does
not claim host compatibility before a real host launches the published package.

## Windows command resolution

Most MCP hosts resolve `npx` normally. If a Windows host reports that it cannot
find or execute the command, use `npx.cmd`, or set `command` to the absolute path
reported by:

```powershell
(Get-Command npx.cmd).Source
```

Do not put API keys or relay tokens directly in a committed workspace config.

## Safe defaults

All examples make these choices explicit:

| Variable | Example value | Effect |
| --- | --- | --- |
| `REDPILL_ALLOW_DECLINE` | `0` | Keeps `decline_task` inactive |
| `REDPILL_OBSERVE_ONLY` | `0` | Executes enabled local tools normally |
| `REDPILL_PERSONA_BACKEND` | `stub` | Keeps `converse` offline |

Local JSONL data is stored under `~/.redpill-mcp/` unless `REDPILL_HOME` is
set. The examples do not configure a relay, remote persona, telemetry endpoint,
or credential. See [PRIVACY.md](../PRIVACY.md) for the complete network and data
boundary.
