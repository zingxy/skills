import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildGeneratedManifests, buildSkillManifest, discoverSkillSources } from "./plugin-manifests.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (relativePath) => JSON.parse(readFileSync(resolve(root, relativePath), "utf8"));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;

const pkg = readJson("package.json");
const skillManifest = buildSkillManifest(pkg.version, discoverSkillSources(resolve(root, "skills")), readJson("skills/catalog-metadata.json"));
const documents = buildGeneratedManifests(pkg, skillManifest);
for (const [relativePath, value] of documents) {
  const outputPath = resolve(root, relativePath);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, serialize(value));
  console.log(`Synced ${relativePath}`);
}
