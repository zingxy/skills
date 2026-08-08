import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildMarketplace, discoverPlugins } from "./marketplace.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const relativePath = ".agents/plugins/marketplace.json";
const outputPath = resolve(root, relativePath);

try {
  const expected = `${JSON.stringify(buildMarketplace(discoverPlugins(root)), null, 2)}\n`;
  if (!existsSync(outputPath) || readFileSync(outputPath, "utf8") !== expected) {
    console.error(`Stale generated file: ${relativePath}`);
    process.exitCode = 1;
  } else {
    console.log("Marketplace is current.");
  }
} catch (error) {
  console.error(`Marketplace check failed: ${error.message}`);
  process.exitCode = 1;
}
