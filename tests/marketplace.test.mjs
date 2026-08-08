import assert from "node:assert/strict";
import test from "node:test";
import { buildMarketplace, validatePluginIdentity } from "../scripts/marketplace.mjs";

const plugin = {
  directoryName: "agent-workflows",
  packageJson: {
    name: "agent-workflows",
    version: "1.0.0",
    agentPlugin: { marketplace: { category: "Productivity" } }
  },
  codexManifest: { name: "agent-workflows", version: "1.0.0" }
};

test("buildMarketplace creates an installable local plugin entry", () => {
  assert.deepEqual(buildMarketplace([plugin]), {
    name: "agent-plugins",
    interface: { displayName: "Agent Plugins" },
    plugins: [{
      name: "agent-workflows",
      source: { source: "local", path: "./plugins/agent-workflows" },
      policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
      category: "Productivity"
    }]
  });
});

test("validatePluginIdentity rejects a mismatched directory", () => {
  assert.throws(() => validatePluginIdentity({ ...plugin, directoryName: "other" }), /directory name/);
});

test("validatePluginIdentity enforces strict SemVer", () => {
  const prerelease = structuredClone(plugin);
  prerelease.packageJson.version = "1.0.0-beta.1+build.7";
  prerelease.codexManifest.version = "1.0.0-beta.1+build.7";
  assert.doesNotThrow(() => validatePluginIdentity(prerelease));
  const invalid = structuredClone(plugin);
  invalid.packageJson.version = "01.0.0";
  invalid.codexManifest.version = "01.0.0";
  assert.throws(() => validatePluginIdentity(invalid), /version/);
});
