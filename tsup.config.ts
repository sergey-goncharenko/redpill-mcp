import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts", "src/http-server.ts", "src/relay/server.ts"],
  format: ["esm"],
  target: "node20",
  outDir: "dist",
  clean: true,
  sourcemap: true,
  splitting: false,
  shims: false,
  banner: { js: "#!/usr/bin/env node" },
});
