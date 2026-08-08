#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { SEMVER } from "./plugin-manifests.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packagePath = resolve(root, "package.json");
const pkg = JSON.parse(readFileSync(packagePath, "utf8"));
if (!SEMVER.test(pkg.version)) {
  console.error(`Unexpected current version "${pkg.version}" in package.json`);
  process.exit(1);
}

const arg = process.argv[2] ?? "patch";
const [, majorText, minorText, patchText] = pkg.version.match(/^(\d+)\.(\d+)\.(\d+)/);
const [major, minor, patch] = [majorText, minorText, patchText].map(Number);
let next;
if (SEMVER.test(arg)) next = arg;
else if (arg === "major") next = `${major + 1}.0.0`;
else if (arg === "minor") next = `${major}.${minor + 1}.0`;
else if (arg === "patch") next = `${major}.${minor}.${patch + 1}`;
else {
  console.error("Invalid argument. Use patch | minor | major | x.y.z");
  process.exit(1);
}

pkg.version = next;
writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
const sync = spawnSync(process.execPath, [resolve(root, "scripts/sync-plugin-manifests.mjs")], { stdio: "inherit" });
if (sync.status !== 0) process.exit(sync.status ?? 1);
console.log(`Bumped ${major}.${minor}.${patch} -> ${next}`);
