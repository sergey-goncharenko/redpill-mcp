# Releasing

Releases are built on a GitHub-hosted runner and published by
`.github/workflows/publish.yml`. Do not publish from a maintainer workstation:
provenance requires a supported cloud CI environment.

## First npm publication

Version `0.1.0` was created with a one-time bootstrap credential because trusted
publishing is configured from an existing npm package's settings. The bootstrap
procedure was:

1. In npm, create a granular automation token that can create the public
   `redpill-mcp` package and bypass publishing 2FA.
2. Add it to this GitHub repository as the Actions secret `NPM_TOKEN`. Enter it
   directly in GitHub settings; never paste it into an issue, log, or chat.
3. Open **Actions > publish npm > Run workflow** and enter `0.1.0`.
4. Verify `npm view redpill-mcp@0.1.0` and the npm provenance attestation.

The workflow checks that the entered version matches `package.json`, runs the
same release gate as CI, and publishes with `--provenance --access public`.

## Switch to trusted publishing

Immediately after the first package exists:

1. Open the `redpill-mcp` package settings on npm.
2. Add a GitHub Actions trusted publisher with:
   - user: `sergey-goncharenko`
   - repository: `redpill-mcp`
   - workflow filename: `publish.yml`
   - allowed action: `npm publish`
3. Delete the GitHub `NPM_TOKEN` secret and revoke the npm bootstrap token.
4. Run the workflow for future versions without a package token. npm uses the
   workflow's OIDC identity and creates provenance automatically.

## Publish to the MCP Registry

The official Registry hosts metadata and therefore comes after npm. Open
**Actions > publish MCP Registry > Run workflow** and enter the exact published
version. The workflow:

- verifies package, Registry, and npm versions agree
- downloads MCP publisher v1.8.1 and verifies its SHA-256 checksum
- validates `server.json` against the live service
- authenticates with GitHub OIDC, with no reusable secret
- publishes to the official Registry

For an interactive maintainer fallback:

```powershell
npm view redpill-mcp version
npm run check:registry
mcp-publisher validate
mcp-publisher login github
mcp-publisher publish
```

Verify the result:

```text
https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.sergey-goncharenko/redpill
```

Registry publication is tracked in
[#20](https://github.com/sergey-goncharenko/redpill-mcp/issues/20).

## GitHub release

After npm and Registry verification, create the matching `v<version>` tag and
GitHub release. Link the npm package, Registry entry, security-relevant changes,
and the commit used by the provenance attestation.
