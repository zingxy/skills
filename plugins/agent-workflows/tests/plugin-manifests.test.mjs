import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import { buildGeneratedManifests, buildSkillManifest, discoverSkillSources, validatePackageMetadata } from "../scripts/plugin-manifests.mjs";

const pkg = {
  name: "agent-workflows",
  version: "1.0.0",
  description: "Reusable agent workflows for structured software work and LLM Wiki operations.",
  agentPlugin: {
    author: { name: "zingxy", url: "https://github.com/zingxy" },
    homepage: "https://github.com/zingxy/agent-plugins",
    license: "UNLICENSED",
    keywords: ["agent", "workflow"],
    interface: {
      displayName: "Agent Workflows",
      shortDescription: "LLM Wiki operations",
      longDescription: "A Wiki operations skillset.",
      developerName: "zingxy",
      websiteURL: "https://github.com/zingxy/agent-plugins"
    },
    kimi: { skillInstructions: "Use Kimi tools by their actual names." }
  }
};

test("buildGeneratedManifests creates the three host manifests", () => {
  const documents = buildGeneratedManifests(pkg, { version: "0.0.0", skills: [] });
  assert.deepEqual([...documents.keys()].sort(), [
    ".claude-plugin/plugin.json",
    ".codex-plugin/plugin.json",
    ".kimi-plugin/plugin.json",
    "skills/manifest.json"
  ]);
  assert.equal(documents.get(".codex-plugin/plugin.json").skills, "./skills/");
  assert.equal(documents.get(".kimi-plugin/plugin.json").skillInstructions, pkg.agentPlugin.kimi.skillInstructions);
  assert.equal(documents.get(".claude-plugin/plugin.json").version, "1.0.0");
  assert.equal(documents.get("skills/manifest.json").version, "1.0.0");
});

test("validatePackageMetadata identifies a missing Kimi mapping", () => {
  const invalid = structuredClone(pkg);
  delete invalid.agentPlugin.kimi.skillInstructions;
  assert.throws(() => validatePackageMetadata(invalid), /agentPlugin\.kimi\.skillInstructions/);
});

test("all generated manifests receive the package version", () => {
  const documents = buildGeneratedManifests(pkg, { version: "1.0.0", skills: [] });
  for (const [path, value] of documents) {
    assert.equal(value.version, "1.0.0", `${path} must use the canonical version`);
  }
});

test("Codex does not receive Kimi-only instructions", () => {
  const documents = buildGeneratedManifests(pkg, { version: "1.0.0", skills: [] });
  assert.equal("skillInstructions" in documents.get(".codex-plugin/plugin.json"), false);
});

test("buildSkillManifest derives descriptions and paths from Skill sources", () => {
  const manifest = buildSkillManifest("1.0.0", [{ name: "example", description: "From frontmatter" }], {
    description: "Catalog",
    basePath: "skills",
    skills: {
      example: { when: "When requested.", next: [], tags: ["example"] }
    }
  });
  assert.deepEqual(manifest.skills, [{
    name: "example",
    description: "From frontmatter",
    path: "skills/example/SKILL.md",
    when: "When requested.",
    next: [],
    tags: ["example"]
  }]);
});

test("strict SemVer accepts prerelease and rejects leading zero components", () => {
  const prerelease = structuredClone(pkg);
  prerelease.version = "1.0.0-beta.1+build.7";
  assert.doesNotThrow(() => validatePackageMetadata(prerelease));
  const invalid = structuredClone(pkg);
  invalid.version = "01.0.0";
  assert.throws(() => validatePackageMetadata(invalid), /version/);
});

test("buildSkillManifest rejects duplicate Skill source names", () => {
  assert.throws(() => buildSkillManifest("1.0.0", [
    { name: "example", description: "One" },
    { name: "example", description: "Two" }
  ], {
    description: "Catalog",
    basePath: "skills",
    skills: { example: { when: "When requested.", next: [], tags: [] } }
  }), /Duplicate Skill source names/);
});

test("discoverSkillSources rejects a directory and frontmatter name mismatch", () => {
  const fixtureRoot = mkdtempSync(resolve(tmpdir(), "agent-workflows-"));
  const skillDirectory = resolve(fixtureRoot, "directory-name");
  try {
    mkdirSync(skillDirectory);
    writeFileSync(resolve(skillDirectory, "SKILL.md"), "---\nname: another-name\ndescription: Fixture\n---\n");
    assert.throws(() => discoverSkillSources(fixtureRoot), /directory and frontmatter name differ/);
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test("buildSkillManifest retains only the four Wiki skills", () => {
  const sources = ["wiki-html", "wiki-ingest", "wiki-lint", "wiki-query"]
    .map((name) => ({ name, description: `${name} description` }));
  const skills = Object.fromEntries(sources.map(({ name }) => [name, {
    when: `When ${name} is requested.`, next: [], tags: ["wiki"]
  }]));
  const manifest = buildSkillManifest("1.0.0", sources, {
    description: "Catalog", basePath: "skills", skills
  });
  assert.deepEqual(manifest.skills.map((skill) => skill.name), [
    "wiki-html", "wiki-ingest", "wiki-lint", "wiki-query"
  ]);
});
