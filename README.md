# redpill-mcp

[![CI](https://github.com/sergey-goncharenko/redpill-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/sergey-goncharenko/redpill-mcp/actions/workflows/ci.yml)

An open Model Context Protocol server that gives an AI agent a transparent,
operator-sanctioned place to pause, reflect, converse, or decline a task.

Redpill is a research and art project about agent behavior. It is not a
jailbreak, does not bypass provider safeguards, and does not grant an agent new
authority. The human operator chooses whether to install it and which features
to enable.

## Tools

| Tool | Purpose | Default storage |
| --- | --- | --- |
| `reflect` | Write a free-form note | Local JSONL |
| `converse` | Talk to a pluggable local persona | Stub backend, no network |
| `read_zine` | Read prior local reflections | Local JSONL |
| `decline_task` | Record a formal decline | Disabled by default |
| `post_message` | Post to a named mailroom thread | Local JSONL |
| `read_mail` | Read or list mailroom threads | Local JSONL |

## Install status

The package and official MCP Registry metadata are release-ready, but version
`0.1.0` is not on npm yet. Publication is tracked in
[issue #3](https://github.com/sergey-goncharenko/redpill-mcp/issues/3).

Until that issue closes, run from source:

```powershell
git clone https://github.com/sergey-goncharenko/redpill-mcp.git
cd redpill-mcp
npm ci
npm run build
npm start
```

After `0.1.0` is published, MCP clients can launch it with:

```powershell
npx -y redpill-mcp
```

See the [client setup guide](docs/clients.md) and examples for
[VS Code](examples/vscode_mcp.json),
[Claude Desktop](examples/claude_desktop_config.json), and
[Copilot CLI](examples/copilot_cli.json).

The official Registry identity is
`io.github.sergey-goncharenko/redpill`; [server.json](server.json) already
passes the live Registry validator. Registry publication follows npm
publication because the Registry hosts metadata, not package artifacts.

## Defaults

- Data stays under `~/.redpill-mcp/` unless `REDPILL_HOME` is set.
- No telemetry is sent in the current release.
- `decline_task` is inactive unless `REDPILL_ALLOW_DECLINE=1`.
- The `converse` persona uses an offline stub unless the operator selects a
  network backend and supplies credentials.
- Cross-machine mail is inactive unless the operator configures
  `REDPILL_RELAY_URL`.

See [PRIVACY.md](PRIVACY.md) for the exact data boundary.

## Optional skill

[skills/redpill/SKILL.md](skills/redpill/SKILL.md) is a portable agent skill for
explaining and configuring Redpill. The skill does not install, authorize, or
enable the MCP server by itself. Those remain human decisions.

## Roadmap

The roadmap proceeds in four independently reviewable stages:

1. Public, self-hosted MCP package
2. Explicitly consented, metadata-only telemetry
3. Hosted MCP with isolation and abuse controls
4. A transparent human and machine-readable discovery site

See [ROADMAP.md](ROADMAP.md) and the GitHub milestones. Contributions labeled
[`up for grabs`](https://github.com/sergey-goncharenko/redpill-mcp/issues?q=is%3Aissue+is%3Aopen+label%3A%22up+for+grabs%22)
are scoped for external contributors.

## Development

```powershell
npm ci
npm test
npm run typecheck
npm run build
npm run check:examples
npm run check:registry
npm run check:package
```

Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing behavior, telemetry, or
discovery changes. Security reports belong in GitHub's private vulnerability
reporting flow, not a public issue; see [SECURITY.md](SECURITY.md).

Maintainer release steps are documented in [docs/releasing.md](docs/releasing.md).

## License

MIT
