# Dependency security

Last reviewed: 2026-08-20

## Runtime dependencies

`npm audit --omit=dev` reports zero known vulnerabilities. CI runs this command
on every pull request and push to `main`.

## Development dependencies

`npm audit` reports zero known vulnerabilities across runtime and development
dependencies.

The former low-severity `GHSA-g7r4-m6w7-qqqr` alert came from `tsup` pinning the
vulnerable esbuild 0.27 line. The build now invokes patched esbuild directly,
removing that dependency rather than forcing an unsupported transitive override.
