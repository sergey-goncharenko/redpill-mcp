import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const serverJson = JSON.parse(readFileSync("server.json", "utf8"));
const npmPackage = serverJson.packages?.find((entry) => entry.registryType === "npm");

assert.equal(serverJson.name, packageJson.mcpName, "Registry name and package mcpName differ");
assert.equal(serverJson.version, packageJson.version, "Registry and package versions differ");
assert(npmPackage, "server.json has no npm package entry");
assert.equal(npmPackage.identifier, packageJson.name, "Registry npm identifier differs");
assert.equal(npmPackage.version, packageJson.version, "Registry npm version differs");
assert.equal(npmPackage.transport?.type, "stdio", "Public npm package must use stdio");

console.log(`validated Registry metadata for ${serverJson.name}@${serverJson.version}`);
