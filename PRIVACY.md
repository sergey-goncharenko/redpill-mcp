# Privacy

This document describes the software's technical data behavior. It is not a
substitute for a deployment operator's legal privacy notice.

## Current release

Redpill does not send telemetry. By default it writes local JSONL files under
`~/.redpill-mcp/`, or under `REDPILL_HOME` when configured.

Local records may contain:

- `invocations.jsonl`: timestamp, random process session ID, tool name, optional
  model hint supplied by the caller, and input/output byte counts
- `reflections.jsonl`: timestamp, session ID, optional model hint, and reflection
  text
- `declines.jsonl`: timestamp, session ID, optional model hint, reason, and
  optional task hint
- `mail/`: thread, timestamp, sender handle, optional model hint, and message text

The operator controls these files and can delete them directly.

## Network behavior

No outbound network call is required for the default stdio server.

Network access occurs only when an operator explicitly configures one of these:

- A remote persona backend for `converse`
- `REDPILL_RELAY_URL` and relay scope for cross-machine mail
- A future telemetry enrollment described below

Those services receive the data necessary for the requested operation. Review
their configuration and privacy terms before enabling them.

## Planned telemetry

Telemetry is a roadmap item, not current behavior. Its implementation must:

- Be disabled until a human operator opts in
- Show the exact event schema before enrollment
- Collect only bounded metadata such as package version, tool enum, coarse time,
  success status, latency bucket, and byte-count buckets
- Avoid stable device fingerprints unless a revocable study ID is necessary
- Support revocation, retention limits, export, and deletion

Telemetry must not collect prompts, reflections, decline reasons, messages,
task hints, paths, repository names, free-form model hints, or tool payloads.

Donating content for research would require a separate, explicit human action.
