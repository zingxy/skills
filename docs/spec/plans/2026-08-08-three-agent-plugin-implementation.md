# Three-agent Plugin Organization Implementation Plan

**Goal:** Deliver one shared Skill catalog as native Kimi, Claude, and Codex plugins, generated from `package.json` and released as version `2.2.0`.

**Architecture:** Keep `package.json` as the only author-edited source for package version and common plugin metadata. A small Node module derives client-specific JSON documents; a sync entry point writes them and a check entry point compares them and validates the catalog. The committed host manifests stay as installable artifacts while `skills/` remains the single Skill-content source.

**Tech Stack:** Node.js 18+ ESM, pnpm 10, Node built-in test runner, JSON, Markdown.

## Global Constraints

- Support Claude, Kimi, and Codex from one repository and one shared `skills/` directory.
- Use `package.json#version` as the only canonical version.
- Do not duplicate or relocate any `skills/<skill-name>/SKILL.md` content.
- Codex must use `.codex-plugin/plugin.json` and only fields it supports.
- Generated manifests are committed but not hand-edited.
- The completed release version is exactly `2.2.0`.

---

## File structure

| File | Responsibility |
| --- | --- |
| `package.json` | Canonical version, shared plugin metadata, and maintenance scripts. |
| `scripts/plugin-manifests.mjs` | Pure metadata validation and host-manifest construction. |
| `scripts/sync-plugin-manifests.mjs` | Writes the derived host manifests and catalog version. |
| `scripts/check-plugin-manifests.mjs` | Validates source metadata, generated-file freshness, and skill catalog parity. |
| `scripts/bump-version.mjs` | Changes only the canonical package version, then invokes synchronization. |
| `tests/plugin-manifests.test.mjs` | Tests the pure generator and its rejection paths. |
| `.codex-plugin/plugin.json` | Generated native Codex manifest referring to `./skills/`. |
| `.claude-plugin/plugin.json` | Generated Claude manifest. |
| `.kimi-plugin/plugin.json` | Generated Kimi manifest, including its tool mapping. |
| `skills/manifest.json` | Existing catalog with its version generated from `package.json`. |
| `README.md` | Three-host install and maintenance documentation. |
| `AGENTS.md`, `.claude/CLAUDE.md` | Accurate catalog and source/derived-file instructions. |

### Task 1: Create a tested manifest generator

**Files:**

- Create: `scripts/plugin-manifests.mjs`
- Create: `tests/plugin-manifests.test.mjs`
- Modify: `package.json`

**Interfaces:**

- Consumes: a package object with `name`, `version`, `description`, and `agentPlugin` metadata.
- Produces: `buildGeneratedManifests(pkg, skillManifest)` returning a `Map<string, object>` keyed by repository-relative output path.
- Produces: `validatePackageMetadata(pkg)` which throws an `Error` naming the invalid field.

- [ ] **Step 1: Add the failing Node test for three host documents**

Create `tests/plugin-manifests.test.mjs` with assertions against the public generator interface:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { buildGeneratedManifests, validatePackageMetadata } from "../scripts/plugin-manifests.mjs";

const pkg = {
  name: "skills",
  version: "2.1.0",
  description: "Reusable skills.",
  agentPlugin: {
    author: { name: "zingxy", url: "https://github.com/zingxy" },
    homepage: "https://github.com/zingxy/skills",
    license: "UNLICENSED",
    keywords: ["skills"],
    interface: {
      displayName: "Workflow & Wiki Skills",
      shortDescription: "Structured workflow skills and LLM Wiki operations",
      longDescription: "A workflow and LLM Wiki skillset.",
      developerName: "zingxy",
      websiteURL: "https://github.com/zingxy/skills"
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
  assert.equal(documents.get(".claude-plugin/plugin.json").version, "2.1.0");
  assert.equal(documents.get("skills/manifest.json").version, "2.1.0");
});

test("validatePackageMetadata identifies a missing Kimi mapping", () => {
  const invalid = structuredClone(pkg);
  delete invalid.agentPlugin.kimi.skillInstructions;
  assert.throws(() => validatePackageMetadata(invalid), /agentPlugin\.kimi\.skillInstructions/);
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test tests/plugin-manifests.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `scripts/plugin-manifests.mjs`.

- [ ] **Step 3: Add canonical metadata and test script declarations**

Modify `package.json` so its `version` is initially `2.1.0`, and add the following top-level `agentPlugin` object plus script entries:

```json
{
  "agentPlugin": {
    "author": { "name": "zingxy", "url": "https://github.com/zingxy" },
    "homepage": "https://github.com/zingxy/skills",
    "license": "UNLICENSED",
    "keywords": ["skills", "workflow", "brainstorming", "planning", "execution", "wiki", "knowledge", "ingest", "query", "lint"],
    "interface": {
      "displayName": "Workflow & Wiki Skills",
      "shortDescription": "Structured workflow skills and LLM Wiki operations",
      "longDescription": "A workflow and LLM Wiki skillset: brainstorm and spec before coding, write bite-sized implementation plans, execute plans with verification checkpoints, and ingest, query, and lint the LLM Wiki.",
      "developerName": "zingxy",
      "websiteURL": "https://github.com/zingxy/skills"
    },
    "kimi": { "skillInstructions": "Kimi Code tool mapping for skills:\n\n- Map task tracking to TodoList.\n- Map delegated implementation/review to Agent with coder or explore subagent types.\n- Map skill invocation to Skill and questions to AskUserQuestion.\n- Use Read, Write, Edit, Glob, Grep, Bash, WebSearch, and FetchURL by their actual names." }
  },
  "scripts": {
    "sync": "node scripts/sync-plugin-manifests.mjs",
    "check": "node scripts/check-plugin-manifests.mjs",
    "test": "node --test tests/*.test.mjs",
    "bump": "node scripts/bump-version.mjs"
  }
}
```

Preserve existing engine and package-manager declarations.

- [ ] **Step 4: Implement the minimal pure generator**

Create `scripts/plugin-manifests.mjs`. Export `validatePackageMetadata` and `buildGeneratedManifests`. Validation must require strict semver, the author name/url, homepage, license, non-empty keywords, all five interface strings, and Kimi tool mapping. Build manifests with common identity fields; add `skills: "./skills/"` and interface data only for Kimi and Codex; add `skillInstructions` only for Kimi. Clone the supplied skill catalog and overwrite only its `version`.

Use this generated Codex shape:

```js
const codexManifest = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  author: metadata.author,
  homepage: metadata.homepage,
  license: metadata.license,
  keywords: metadata.keywords,
  skills: "./skills/",
  interface: metadata.interface
};
```

- [ ] **Step 5: Run the generator tests and verify they pass**

Run: `node --test tests/plugin-manifests.test.mjs`

Expected: PASS with two passing subtests.

- [ ] **Step 6: Commit after user confirmation**

```bash
git add package.json scripts/plugin-manifests.mjs tests/plugin-manifests.test.mjs
git commit -m "feat: add shared plugin manifest generator"
```

### Task 2: Add synchronization, freshness checks, and canonical bumping

**Files:**

- Create: `scripts/sync-plugin-manifests.mjs`
- Create: `scripts/check-plugin-manifests.mjs`
- Modify: `scripts/bump-version.mjs`
- Modify: `tests/plugin-manifests.test.mjs`
- Create: `.codex-plugin/plugin.json`
- Modify: `.claude-plugin/plugin.json`
- Modify: `.kimi-plugin/plugin.json`
- Modify: `skills/manifest.json`

**Interfaces:**

- Consumes: `buildGeneratedManifests()` from `scripts/plugin-manifests.mjs`.
- Produces: byte-stable two-space-indented JSON output ending with one newline.
- Produces: exit code `0` when all files are current; `1` with a list of stale paths otherwise.

- [ ] **Step 1: Add failing tests for deterministic JSON and version propagation**

Append these tests to `tests/plugin-manifests.test.mjs`:

```js
test("all generated manifests receive the package version", () => {
  const documents = buildGeneratedManifests(pkg, { version: "1.0.0", skills: [] });
  for (const [path, value] of documents) {
    assert.equal(value.version, "2.1.0", `${path} must use the canonical version`);
  }
});

test("Codex does not receive Kimi-only instructions", () => {
  const documents = buildGeneratedManifests(pkg, { version: "1.0.0", skills: [] });
  assert.equal("skillInstructions" in documents.get(".codex-plugin/plugin.json"), false);
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test tests/plugin-manifests.test.mjs`

Expected: FAIL because the first implementation does not yet include every generated document's version or isolates no Kimi-only field.

- [ ] **Step 3: Implement write and check entry points**

Create `scripts/sync-plugin-manifests.mjs` to read `package.json` and `skills/manifest.json`, invoke the pure generator, serialize each object as `JSON.stringify(value, null, 2) + "\n"`, create missing parent directories, and write each output path.

Create `scripts/check-plugin-manifests.mjs` to invoke the same generator without writing. For every generated path, compare its exact serialized text with the committed file and print `Stale generated file: <path>` when different. Also scan `skills/*/SKILL.md`, parse the YAML frontmatter `name` and `description`, and require the sorted filesystem names and manifest names to match; require each catalog description to equal the frontmatter description. Set `process.exitCode = 1` if any check fails; otherwise print `Plugin manifests and skill catalog are current.`.

- [ ] **Step 4: Replace the bump implementation**

Rewrite `scripts/bump-version.mjs` so it reads and validates only `package.json#version`, accepts `patch`, `minor`, `major`, or an explicit strict-semver value, writes the updated `package.json`, and invokes the sync script with `node`. It must print `Bumped <old> -> <new>` and propagate synchronization failure as a nonzero exit code. It must not hand-edit any generated manifest.

- [ ] **Step 5: Generate the first three host artifacts**

Run: `pnpm sync`

Expected: creates `.codex-plugin/plugin.json` and refreshes the Claude, Kimi, and skills catalog JSON documents to version `2.1.0`.

- [ ] **Step 6: Run all automated checks**

Run: `pnpm test && pnpm check`

Expected: Node tests pass and the checker prints `Plugin manifests and skill catalog are current.`.

- [ ] **Step 7: Commit after user confirmation**

```bash
git add .claude-plugin/plugin.json .codex-plugin/plugin.json .kimi-plugin/plugin.json skills/manifest.json scripts/sync-plugin-manifests.mjs scripts/check-plugin-manifests.mjs scripts/bump-version.mjs tests/plugin-manifests.test.mjs
git commit -m "feat: generate manifests for three agents"
```

### Task 3: Document the supported agents and maintenance contract

**Files:**

- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `.claude/CLAUDE.md`

**Interfaces:**

- Consumes: the commands and source/derived contract established by Tasks 1 and 2.
- Produces: installation and maintenance instructions that refer only to committed public repository files and commands.

- [ ] **Step 1: Add a documentation acceptance check**

Run: `rg -n "Codex|pnpm sync|pnpm check|package.json" README.md AGENTS.md .claude/CLAUDE.md`

Expected before editing: the command/source-of-truth terms are missing or the three files do not consistently explain them.

- [ ] **Step 2: Update README**

Revise `README.md` to describe Kimi, Claude, and Codex as supported native clients. Keep the existing Kimi and Claude installation routes, add a Codex local-plugin route pointing at the repository root, and show this maintenance block:

```bash
pnpm sync             # regenerate client manifests from package.json
pnpm check            # verify generated files and skill catalog parity
pnpm bump minor       # update the canonical version and regenerate artifacts
```

Add a directory diagram listing `.claude-plugin/`, `.kimi-plugin/`, `.codex-plugin/`, `skills/`, and `scripts/`. State explicitly that `package.json` is authoritative and generated files must be refreshed through `pnpm sync`.

- [ ] **Step 3: Align agent instructions**

Update `AGENTS.md` and `.claude/CLAUDE.md` to include `wiki-html` in their catalog tables. Add a concise maintenance rule: when skills are added, renamed, or removed, update the catalog/documentation and run `pnpm sync && pnpm check`; do not manually edit generated plugin manifests.

- [ ] **Step 4: Run the documentation acceptance check**

Run: `rg -n "Codex|pnpm sync|pnpm check|package.json" README.md AGENTS.md .claude/CLAUDE.md`

Expected: every document names Codex and explains the source-of-truth or maintenance commands appropriate to its audience.

- [ ] **Step 5: Commit after user confirmation**

```bash
git add README.md AGENTS.md .claude/CLAUDE.md
git commit -m "docs: document three-agent plugin workflow"
```

### Task 4: Release the reorganization as 2.2.0

**Files:**

- Modify: `package.json`
- Modify: `.claude-plugin/plugin.json`
- Modify: `.codex-plugin/plugin.json`
- Modify: `.kimi-plugin/plugin.json`
- Modify: `skills/manifest.json`

**Interfaces:**

- Consumes: the canonical version bump command from Task 2.
- Produces: canonical and generated version strings equal to `2.2.0`.

- [ ] **Step 1: Check the pre-release baseline**

Run: `pnpm test && pnpm check && node -e 'console.log(require("./package.json").version)'`

Expected: checks pass and the printed canonical version is `2.1.0`.

- [ ] **Step 2: Perform the minor bump**

Run: `pnpm bump minor`

Expected: output includes `Bumped 2.1.0 -> 2.2.0` and synchronization completes successfully.

- [ ] **Step 3: Verify every versioned document**

Run: `rg -n '"version": "2\.2\.0"' package.json .claude-plugin/plugin.json .codex-plugin/plugin.json .kimi-plugin/plugin.json skills/manifest.json`

Expected: exactly one matching version line in each of the five files.

- [ ] **Step 4: Run final validation**

Run: `pnpm test && pnpm check && git diff --check`

Expected: all tests and checks pass with no whitespace errors.

- [ ] **Step 5: Commit after user confirmation**

```bash
git add package.json .claude-plugin/plugin.json .codex-plugin/plugin.json .kimi-plugin/plugin.json skills/manifest.json
git commit -m "chore: release plugin version 2.2.0"
```

## Plan self-review

- **Spec coverage:** Task 1 establishes `package.json` as the single source; Task 2 creates all three host manifests, synchronization, checking, and bump behavior; Task 3 covers documentation and agent-maintenance instructions; Task 4 performs and verifies the required `2.2.0` minor release.
- **Placeholder scan:** No task contains deferred implementation wording; every code-changing task names paths, interfaces, commands, expected outcomes, and commit boundaries.
- **Type consistency:** `buildGeneratedManifests(pkg, skillManifest)` is the sole generator interface used by tests, sync, and check paths. All version propagation derives from `pkg.version`.
