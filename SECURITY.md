# Security Policy

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability or exposed credential.
Use GitHub Security Advisories and select **Report a vulnerability** for this
repository. Include affected versions, reproduction steps, impact, and any
suggested mitigation.

Please allow time to confirm and remediate the report before public disclosure.

## Supported versions

Redpill is pre-1.0. Security fixes target the latest published release and the
default branch. Older prereleases may not receive patches.

## Security boundaries

- The stdio server is local-only by default.
- `decline_task` is disabled unless the operator enables it.
- Remote persona and relay features require explicit operator configuration.
- Public HTTP deployments must require authentication and must not rely on the
  development server's open-when-unset fallback.
- Future telemetry and hosted services must fail closed and keep research
  content separate from service diagnostics.

## Dependency policy

CI rejects production dependency advisories and Dependabot monitors npm and
GitHub Actions dependencies. Build-only findings are evaluated for reachability
and documented in [docs/dependency-security.md](docs/dependency-security.md)
rather than silently ignored.
