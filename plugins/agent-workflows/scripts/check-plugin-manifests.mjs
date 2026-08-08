import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildGeneratedManifests, buildSkillManifest, discoverSkillSources } from "./plugin-manifests.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
function readJson(relativePath) {
  try {
    return JSON.parse(readFileSync(resolve(root, relativePath), "utf8"));
  } catch (error) {
    throw new Error(`Cannot read JSON at ${relativePath}: ${error.message}`);
  }
}
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;

try {
  let failed = false;
  const pkg = readJson("package.json");
  const skillManifest = buildSkillManifest(pkg.version, discoverSkillSources(resolve(root, "skills")), readJson("skills/catalog-metadata.json"));
  const documents = buildGeneratedManifests(pkg, skillManifest);
  for (const [relativePath, value] of documents) {
    const filePath = resolve(root, relativePath);
    if (!existsSync(filePath) || readFileSync(filePath, "utf8") !== serialize(value)) {
      console.error(`Stale generated file: ${relativePath}`);
      failed = true;
    }
  }

  if (failed) process.exitCode = 1;
  else console.log("Plugin manifests and skill catalog are current.");
} catch (error) {
  console.error(`Plugin check failed: ${error.message}`);
  process.exitCode = 1;
}
