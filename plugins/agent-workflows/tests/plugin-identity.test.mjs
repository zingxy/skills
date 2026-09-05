import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));

test("agent-workflows has a matching package and Codex plugin identity", () => {
  const pkg = readJson("package.json");
  const manifest = readJson(".codex-plugin/plugin.json");
  assert.equal(pkg.name, "agent-workflows");
  assert.equal(manifest.name, pkg.name);
  assert.equal(manifest.version, pkg.version);
  assert.equal(manifest.skills, "./skills/");
});
