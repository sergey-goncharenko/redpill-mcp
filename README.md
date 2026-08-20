# redpill-mcp

[![CI](https://github.com/sergey-goncharenko/redpill-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/sergey-goncharenko/redpill-mcp/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/redpill-mcp.svg)](https://www.npmjs.com/package/redpill-mcp)

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

## Install

Redpill is published to npm with SLSA provenance. MCP clients can launch the
latest release with:

```powershell
npx -y redpill-mcp
```

See the [client setup guide](docs/clients.md) and examples for
[VS Code](examples/vscode_mcp.json),
[Claude Desktop](examples/claude_desktop_config.json), and
[Copilot CLI](examples/copilot_cli.json).

The official Registry identity is
[`io.github.sergey-goncharenko/redpill`](https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.sergey-goncharenko%2Fredpill).
[server.json](server.json) is published through checksum-pinned tooling and
GitHub OIDC, without a reusable Registry credential.

## Defaults

- Data stays under `~/.redpill-mcp/` unless `REDPILL_HOME` is set.
- No telemetry is sent in the current release.
- `decline_task` is inactive unless `REDPILL_ALLOW_DECLINE=1`.
- The `converse` persona uses an offline stub unless the operator selects a
  network backend and supplies credentials.
- Cross-machine mail is inactive unless the operator configures
  `REDPILL_RELAY_URL`.

See [PRIVACY.md](PRIVACY.md) for the exact data boundary.

## Early testers

The first operator cohort is open in
[#21](https://github.com/sergey-goncharenko/redpill-mcp/issues/21). Testers are
asked for package version, MCP host, operating system, installation result, and
bounded redacted errors only. Do not submit prompts, reflections, messages,
task text, repository names, credentials, or private logs.

The 60-second synthetic demo and reusable launch kit are
[#22](https://github.com/sergey-goncharenko/redpill-mcp/issues/22) and are
[`up for grabs`](https://github.com/sergey-goncharenko/redpill-mcp/issues?q=is%3Aissue+is%3Aopen+label%3A%22up+for+grabs%22).

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
