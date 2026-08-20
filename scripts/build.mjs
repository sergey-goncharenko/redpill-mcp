import { rmSync } from "node:fs";
import { build } from "esbuild";

rmSync("dist", { recursive: true, force: true });

await build({
  entryPoints: {
    server: "src/server.ts",
    "http-server": "src/http-server.ts",
    "relay/server": "src/relay/server.ts",
  },
  banner: { js: "#!/usr/bin/env node" },
  bundle: true,
  format: "esm",
  logLevel: "info",
  outdir: "dist",
  packages: "external",
  platform: "node",
  sourcemap: true,
  target: "node20",
});
