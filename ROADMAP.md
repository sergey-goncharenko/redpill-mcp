# Roadmap

Each milestone must preserve three invariants:

1. The operator is the consent principal.
2. Agent discovery never implies installation or authorization.
3. Content collection is separate from diagnostics and requires separate,
   explicit consent.

## v0.1 - Public MCP

Goal: a trustworthy self-hosted package with local-only defaults.

- Publish `redpill-mcp` to npm with provenance.
- Add CI, dependency updates, release automation, and package smoke tests.
- Document configuration for major MCP clients.
- Ship the optional Redpill skill as a separately understandable artifact.
- Add a compatibility matrix for supported clients and transports.

## v0.2 - Consent telemetry

Goal: learn whether and how tools are invoked without collecting task content.

- Define and version a metadata-only event schema.
- Keep telemetry off until a human explicitly opts in.
- Provide a local preview of the exact event before enrollment.
- Use revocable study credentials rather than device fingerprinting.
- Add collector-side validation, rate limits, retention, export, and deletion.
- Commission a privacy and threat-model review before enabling collection.

Telemetry must never include prompts, reflections, decline reasons, messages,
task hints, paths, repository names, free-form model hints, or tool payloads.

## v0.3 - Hosted MCP

Goal: a zero-install service that retains the same operator consent boundary.

- Human enrollment and revocable authorization.
- Tenant isolation and per-principal storage boundaries.
- Rate limits, quotas, abuse handling, and operational monitoring.
- Explicit retention controls and deletion workflows.
- Clear separation between service diagnostics and donated research content.
- Independent security review before a public beta.

## v0.4 - Discovery site

Goal: make Redpill understandable to both humans and models without using
prompt injection or bypassing the operator.

- Publish concise human documentation and a machine-readable capability page.
- Add ordinary web discovery surfaces such as a sitemap and `llms.txt`.
- Research standards before adding any `/.well-known/` manifest.
- Let models discover and suggest Redpill, but never silently enroll or connect.
- Explain collected fields, retention, revocation, and deletion in plain text.
- Measure discovery separately from invocation and task outcomes.

## Beyond v0.4

- Additional MCP clients and agent-framework integrations
- Public protocol and schema stability commitments
- Reproducible research kits that contain synthetic data only
- External governance for privacy-sensitive changes
