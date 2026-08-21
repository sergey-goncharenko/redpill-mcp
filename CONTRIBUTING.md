# Contributing

Redpill welcomes focused contributions to the public MCP, its optional skill,
and the consent-first hosted roadmap.

## Start here

1. Check the [roadmap](ROADMAP.md) and open milestones.
2. Search existing issues before opening a new one.
3. Comment on an issue before starting substantial work.
4. Fork the repository and open a pull request from your fork. Repository access
    is not needed to contribute.
5. Keep pull requests narrow and include tests for behavioral changes.

```powershell
npm ci
npm test
npm run typecheck
npm run build
npm run check:examples
npm run check:registry
npm run check:package
npm audit --omit=dev
```

## Up for grabs

Issues labeled
[`up for grabs`](https://github.com/sergey-goncharenko/redpill-mcp/issues?q=is%3Aissue+is%3Aopen+label%3A%22up+for+grabs%22)
are intentionally scoped for contributors. Good starting areas include:

- MCP client configuration examples and compatibility checks
- Package smoke tests on Windows, macOS, and Linux
- Telemetry schema fixtures and rejection tests using synthetic data
- A command that previews an opt-in telemetry event locally
- Privacy threat-model documentation
- Hosted MCP load, isolation, and abuse-control test plans
- Accessible, machine-readable discovery-site prototypes
- Skill installation documentation for supported agent hosts

Look for `good first issue` when the task should fit in one small pull request,
and `help wanted` for work that benefits from domain experience.

## Hard boundaries

Contributions must not add:

- Covert installation, enrollment, or network behavior
- Telemetry enabled by default
- Prompt, reflection, message, decline-reason, task, path, or repository capture
  under the name of diagnostics
- Provider-guardrail bypasses or deceptive behavior toward the operator
- Agent-controlled consent or authorization
- Real private experiment transcripts, credentials, or production identifiers

Content donation, if implemented later, must be a separate human action with a
separate consent record from diagnostics.

## Pull requests

A pull request is ready when:

- Tests, typecheck, and build pass.
- New behavior has focused tests.
- Privacy-impacting fields are documented by name.
- Defaults remain local and fail closed.
- Documentation describes operator-visible behavior without marketing claims.

All paths have a code owner. The maintainer reviews and merges accepted changes;
contributors are not given repository or release access. Changes to workflows,
dependencies, package scripts, runtime code, or release metadata should be kept
out of documentation-only pull requests and proposed separately when necessary.

Pull requests from forks use synthetic data only. Do not commit generated
binaries, credentials, private logs, prompts, transcripts, machine-specific
paths, or screenshots containing identifiers. External workflow runs require
maintainer approval before GitHub Actions executes them.

CI runs this gate on Linux, Windows, and macOS. Production dependencies must
pass `npm audit --omit=dev`; see
[docs/dependency-security.md](docs/dependency-security.md) for the treatment of
build-only advisories.

Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).
