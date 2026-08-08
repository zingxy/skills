#!/usr/bin/env node
// Bump the plugin version across all files that carry it.
// Usage:
//   node scripts/bump-version.mjs            # patch bump (default)
//   node scripts/bump-version.mjs minor      # 1.2.0 -> 1.3.0
//   node scripts/bump-version.mjs major      # 1.2.0 -> 2.0.0
//   node scripts/bump-version.mjs 2.5.1      # set explicit version

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const VERSION_FILES = [
  ".claude-plugin/plugin.json",
  ".kimi-plugin/plugin.json",
  "skills/manifest.json",
];

function readJson(relPath) {
  return JSON.parse(readFileSync(resolve(root, relPath), "utf8"));
}

function writeJson(relPath, data) {
  writeFileSync(resolve(root, relPath), JSON.stringify(data, null, 2) + "\n");
}

const current = readJson(VERSION_FILES[0]).version;
if (!/^\d+\.\d+\.\d+$/.test(current)) {
  console.error(`Unexpected current version "${current}" in ${VERSION_FILES[0]}`);
  process.exit(1);
}

const arg = process.argv[2] ?? "patch";
let next;
if (/^\d+\.\d+\.\d+$/.test(arg)) {
  next = arg;
} else {
  const [major, minor, patch] = current.split(".").map(Number);
  if (arg === "major") next = `${major + 1}.0.0`;
  else if (arg === "minor") next = `${major}.${minor + 1}.0`;
  else if (arg === "patch") next = `${major}.${minor}.${patch + 1}`;
  else {
    console.error(`Invalid argument "${arg}". Use patch | minor | major | x.y.z`);
    process.exit(1);
  }
}

for (const file of VERSION_FILES) {
  const data = readJson(file);
  if (data.version !== current) {
    console.warn(`Warning: ${file} was at ${data.version}, not ${current}`);
  }
  data.version = next;
  writeJson(file, data);
  console.log(`${file}: ${next}`);
}

console.log(`\nBumped ${current} -> ${next}`);
