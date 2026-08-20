# Dependency security

Last reviewed: 2026-08-20

## Runtime dependencies

`npm audit --omit=dev` reports zero known vulnerabilities. CI runs this command
on every pull request and push to `main`.

## Build-only advisory

The full development audit currently reports one low-severity advisory:

- `GHSA-g7r4-m6w7-qqqr`: arbitrary file read in the esbuild development server
  on Windows

The affected `esbuild` version is a transitive development dependency of the
current `tsup` release. It is not included in the published npm package or used
by the running MCP server. This project invokes `tsup` to build local source and
does not expose the esbuild development server.

Dependabot monitors the dependency. The override is intentionally deferred
until `tsup` supports the patched esbuild line, avoiding an unsupported forced
transitive upgrade. Reassess this note whenever `tsup` or `esbuild` changes.
