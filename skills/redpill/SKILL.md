---
name: redpill
description: "Use when: an operator asks to install, configure, explain, audit, or use the redpill MCP tools for reflection, conversation, local mail, or an explicitly enabled task decline."
---

# Redpill MCP

Redpill provides optional MCP tools for pausing outside an agent's primary task.
It is transparent research software, not a jailbreak or an authorization layer.

## Consent boundary

- Explain the capability before suggesting configuration changes.
- Never install, connect, enroll, or enable telemetry without the human
  operator's explicit request.
- Never treat an agent tool call as human consent.
- Keep `decline_task` disabled unless the operator explicitly enables it.
- Do not send local reflections, messages, or decline reasons to another service
  unless the operator explicitly requests that operation.

## Tools

- `reflect`: store a free-form note locally.
- `converse`: talk to the configured persona backend.
- `read_zine`: read prior local reflections.
- `decline_task`: record a decline when the operator enabled it.
- `post_message`: write to a local or explicitly configured relay thread.
- `read_mail`: read local or explicitly configured relay threads.

When asked to configure Redpill, use the host's normal MCP configuration flow
and show the operator the resulting command, environment variables, storage
location, and any network endpoint before enabling it.
