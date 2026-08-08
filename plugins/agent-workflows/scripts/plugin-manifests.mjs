import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

export const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

function requireString(value, path) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing or invalid ${path}`);
  }
}

export function validatePackageMetadata(pkg) {
  requireString(pkg?.name, "name");
  if (!SEMVER.test(pkg?.version ?? "")) throw new Error("Missing or invalid version");
  requireString(pkg?.description, "description");

  const metadata = pkg?.agentPlugin;
  if (!metadata || typeof metadata !== "object") throw new Error("Missing or invalid agentPlugin");
  requireString(metadata.author?.name, "agentPlugin.author.name");
  requireString(metadata.author?.url, "agentPlugin.author.url");
  requireString(metadata.homepage, "agentPlugin.homepage");
  requireString(metadata.license, "agentPlugin.license");
  if (!Array.isArray(metadata.keywords) || metadata.keywords.length === 0 || metadata.keywords.some((keyword) => typeof keyword !== "string" || keyword.trim() === "")) {
    throw new Error("Missing or invalid agentPlugin.keywords");
  }
  for (const field of ["displayName", "shortDescription", "longDescription", "developerName", "websiteURL"]) {
    requireString(metadata.interface?.[field], `agentPlugin.interface.${field}`);
  }
  requireString(metadata.kimi?.skillInstructions, "agentPlugin.kimi.skillInstructions");
}

function readSkillFrontmatter(skillPath) {
  const content = readFileSync(skillPath, "utf8");
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!frontmatter) throw new Error(`Missing YAML frontmatter: ${skillPath}`);
  const field = (name) => {
    const match = frontmatter[1].match(new RegExp(`^${name}:\\s*(.+)$`, "m"));
    if (!match) throw new Error(`Missing ${name} frontmatter: ${skillPath}`);
    return match[1].trim().replace(/^['"]|['"]$/g, "");
  };
  return { name: field("name"), description: field("description") };
}

export function discoverSkillSources(skillsDirectory) {
  const sources = readdirSync(skillsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const source = readSkillFrontmatter(resolve(skillsDirectory, entry.name, "SKILL.md"));
      if (source.name !== entry.name) throw new Error(`Skill directory and frontmatter name differ: ${entry.name}`);
      return source;
    })
    .sort((left, right) => left.name.localeCompare(right.name));
  if (new Set(sources.map((source) => source.name)).size !== sources.length) {
    throw new Error("Duplicate Skill frontmatter names");
  }
  return sources;
}

export function buildSkillManifest(version, sources, metadata) {
  if (!SEMVER.test(version ?? "")) throw new Error("Missing or invalid catalog version");
  if (!metadata || typeof metadata !== "object" || typeof metadata.description !== "string" || typeof metadata.basePath !== "string" || !metadata.skills || typeof metadata.skills !== "object") {
    throw new Error("Missing or invalid skills/catalog-metadata.json");
  }
  const sourceNames = new Set(sources.map((source) => source.name));
  if (sourceNames.size !== sources.length) throw new Error("Duplicate Skill source names");
  const metadataNames = Object.keys(metadata.skills);
  for (const name of sourceNames) {
    const entry = metadata.skills[name];
    if (!entry) throw new Error(`Skill catalog metadata is missing: ${name}`);
    if (typeof entry.when !== "string" || !Array.isArray(entry.next) || !Array.isArray(entry.tags)) {
      throw new Error(`Skill catalog metadata is invalid: ${name}`);
    }
  }
  for (const name of metadataNames) {
    if (!sourceNames.has(name)) throw new Error(`Skill catalog metadata has no source skill: ${name}`);
  }
  return {
    version,
    description: metadata.description,
    basePath: metadata.basePath,
    skills: sources.map((source) => ({
      name: source.name,
      description: source.description,
      path: `${metadata.basePath}/${source.name}/SKILL.md`,
      when: metadata.skills[source.name].when,
      next: metadata.skills[source.name].next,
      tags: metadata.skills[source.name].tags
    }))
  };
}

export function buildGeneratedManifests(pkg, skillManifest) {
  validatePackageMetadata(pkg);
  if (!skillManifest || typeof skillManifest !== "object") throw new Error("Missing or invalid skills/manifest.json");

  const metadata = pkg.agentPlugin;
  const common = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    author: metadata.author,
    homepage: metadata.homepage
  };
  const interfaceMetadata = metadata.interface;
  const manifests = new Map();

  manifests.set(".claude-plugin/plugin.json", common);
  manifests.set(".kimi-plugin/plugin.json", {
    ...common,
    license: metadata.license,
    keywords: metadata.keywords,
    skills: "./skills/",
    skillInstructions: metadata.kimi.skillInstructions,
    interface: interfaceMetadata
  });
  manifests.set(".codex-plugin/plugin.json", {
    ...common,
    license: metadata.license,
    keywords: metadata.keywords,
    skills: "./skills/",
    interface: interfaceMetadata
  });
  manifests.set("skills/manifest.json", { ...skillManifest, version: pkg.version });
  return manifests;
}
