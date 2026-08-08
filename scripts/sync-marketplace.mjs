import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildMarketplace, discoverPlugins } from "./marketplace.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(root, ".agents/plugins/marketplace.json");
const marketplace = buildMarketplace(discoverPlugins(root));

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(marketplace, null, 2)}\n`);
console.log("Synced .agents/plugins/marketplace.json");
