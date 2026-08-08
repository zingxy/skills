import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

function readJson(root, relativePath) {
  try {
    return JSON.parse(readFileSync(resolve(root, relativePath), "utf8"));
  } catch (error) {
    throw new Error(`Cannot read JSON at ${relativePath}: ${error.message}`);
  }
}

export function validatePluginIdentity(plugin) {
  const { directoryName, packageJson, codexManifest } = plugin;
  if (directoryName !== packageJson?.name) throw new Error(`Plugin directory name does not match package name: ${directoryName}`);
  if (directoryName !== codexManifest?.name) throw new Error(`Plugin directory name does not match Codex manifest name: ${directoryName}`);
  if (!SEMVER.test(packageJson?.version ?? "")) throw new Error(`Plugin package version is invalid: ${directoryName}`);
  if (packageJson.version !== codexManifest?.version) throw new Error(`Plugin package and Codex manifest versions differ: ${directoryName}`);
  if (typeof packageJson?.agentPlugin?.marketplace?.category !== "string" || packageJson.agentPlugin.marketplace.category.trim() === "") {
    throw new Error(`Plugin marketplace category is missing: ${directoryName}`);
  }
}

export function discoverPlugins(root) {
  const pluginsDirectory = resolve(root, "plugins");
  return readdirSync(pluginsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const directoryName = entry.name;
      const basePath = `plugins/${directoryName}`;
      const plugin = {
        directoryName,
        packageJson: readJson(root, `${basePath}/package.json`),
        codexManifest: readJson(root, `${basePath}/.codex-plugin/plugin.json`)
      };
      validatePluginIdentity(plugin);
      return plugin;
    });
}

export function buildMarketplace(plugins) {
  const entries = plugins
    .map((plugin) => {
      validatePluginIdentity(plugin);
      return {
        name: plugin.packageJson.name,
        source: { source: "local", path: `./plugins/${plugin.directoryName}` },
        policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
        category: plugin.packageJson.agentPlugin.marketplace.category
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name));

  return {
    name: "agent-plugins",
    interface: { displayName: "Agent Plugins" },
    plugins: entries
  };
}
