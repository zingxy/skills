# Codex-first Agent Marketplace Implementation Plan

**Goal:** Convert the repository into the `agent-plugins` Codex marketplace and release the existing skills as the self-contained `agent-workflows@1.0.0` plugin.

**Architecture:** The root is a pnpm workspace and marketplace catalog. `plugins/agent-workflows` owns its Skill content, package metadata, host manifests, generator, and tests. Root scripts discover workspace plugins to generate and verify the Codex marketplace; no root-level default Skill plugin remains.

**Tech Stack:** Node.js 18+ ESM, pnpm workspaces, Node built-in test runner, JSON, Markdown.

## Global Constraints

- Repository and Codex marketplace are named `agent-plugins`.
- First plugin is named `agent-workflows` and releases at exactly `1.0.0`.
- Directory name, plugin package name, Codex manifest name, and marketplace entry name are identical for every plugin.
- All existing Skill content moves unchanged to `plugins/agent-workflows/skills/`; no copies or symlinks remain.
- Plugin-local `package.json` is the only plugin metadata and version source.
- Codex is the primary distribution route; Claude and Kimi retain plugin-local manifests.
- The owner, not repository scripts, renames the remote GitHub repository.

---

## File structure

| File | Responsibility |
| --- | --- |
| `package.json` | Root private workspace metadata and aggregate commands. |
| `pnpm-workspace.yaml` | Includes `plugins/*` workspace packages. |
| `.agents/plugins/marketplace.json` | Generated Codex catalog named `agent-plugins`. |
| `scripts/marketplace.mjs` | Pure discovery, validation, and catalog construction. |
| `scripts/sync-marketplace.mjs` | Writes the root Codex marketplace catalog. |
| `scripts/check-marketplace.mjs` | Detects stale catalog or invalid plugin identity. |
| `tests/marketplace.test.mjs` | Tests root marketplace construction and rejection paths. |
| `plugins/agent-workflows/package.json` | `agent-workflows@1.0.0` metadata, host overrides, and plugin commands. |
| `plugins/agent-workflows/skills/` | Sole copy of the existing Skill directories and catalog. |
| `plugins/agent-workflows/scripts/` | Plugin-local manifest generator, sync/check, and version-bump scripts. |
| `plugins/agent-workflows/tests/` | Plugin-local generator tests. |
| `plugins/agent-workflows/.{codex,kimi,claude}-plugin/plugin.json` | Generated host manifests. |
| `.claude-plugin/marketplace.json` | Root Claude catalog that points to `./plugins/agent-workflows`. |

### Task 1: Establish the plugin package and move the single content source

**Files:**

- Create: `plugins/agent-workflows/package.json`
- Create: `plugins/agent-workflows/README.md`
- Move: `skills/` → `plugins/agent-workflows/skills/`
- Move: `scripts/plugin-manifests.mjs` → `plugins/agent-workflows/scripts/plugin-manifests.mjs`
- Move: `scripts/sync-plugin-manifests.mjs` → `plugins/agent-workflows/scripts/sync-plugin-manifests.mjs`
- Move: `scripts/check-plugin-manifests.mjs` → `plugins/agent-workflows/scripts/check-plugin-manifests.mjs`
- Move: `scripts/bump-version.mjs` → `plugins/agent-workflows/scripts/bump-version.mjs`
- Move: `tests/plugin-manifests.test.mjs` → `plugins/agent-workflows/tests/plugin-manifests.test.mjs`
- Move: `.codex-plugin/plugin.json` → `plugins/agent-workflows/.codex-plugin/plugin.json`
- Move: `.kimi-plugin/plugin.json` → `plugins/agent-workflows/.kimi-plugin/plugin.json`
- Move: `.claude-plugin/plugin.json` → `plugins/agent-workflows/.claude-plugin/plugin.json`
- Delete: root `skills/`, `scripts/bump-version.mjs`, root host `plugin.json` files after their moves

**Interfaces:**

- Consumes: the current seven `SKILL.md` directories without content modification.
- Produces: `agent-workflows` package metadata and generated paths relative to `plugins/agent-workflows`.

- [ ] **Step 1: Write a failing identity test in the plugin package**

Create `plugins/agent-workflows/tests/plugin-identity.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));

test("agent-workflows has a matching package and Codex plugin identity", () => {
  const pkg = readJson("package.json");
  const manifest = readJson(".codex-plugin/plugin.json");
  assert.equal(pkg.name, "agent-workflows");
  assert.equal(pkg.version, "1.0.0");
  assert.equal(manifest.name, pkg.name);
  assert.equal(manifest.version, pkg.version);
  assert.equal(manifest.skills, "./skills/");
});
```

- [ ] **Step 2: Run the test and verify it fails before migration**

Run: `node --test plugins/agent-workflows/tests/plugin-identity.test.mjs`

Expected: FAIL with `ENOENT` for `plugins/agent-workflows/package.json`.

- [ ] **Step 3: Move the package-owned files without changing Skill content**

Create the target directory structure, then move the listed files/directories using Git-aware renames. Do not change `SKILL.md` content. Update all plugin-local scripts so their computed root is the parent of `plugins/agent-workflows/scripts/` and their input/output paths use local `skills/` and `.codex-plugin/` directories.

- [ ] **Step 4: Create the plugin package metadata**

Create `plugins/agent-workflows/package.json` with the following source fields. Preserve the existing Kimi tool mapping text in `agentPlugin.kimi.skillInstructions`.

```json
{
  "name": "agent-workflows",
  "version": "1.0.0",
  "description": "Reusable agent workflows for structured software work and LLM Wiki operations.",
  "private": true,
  "engines": { "node": ">=18", "pnpm": ">=9" },
  "scripts": {
    "sync": "node scripts/sync-plugin-manifests.mjs",
    "check": "node scripts/check-plugin-manifests.mjs",
    "test": "node --test tests/*.test.mjs",
    "bump": "node scripts/bump-version.mjs"
  },
  "agentPlugin": {
    "author": { "name": "zingxy", "url": "https://github.com/zingxy" },
    "homepage": "https://github.com/zingxy/agent-plugins",
    "license": "UNLICENSED",
    "keywords": ["agent", "workflow", "planning", "execution", "wiki"],
    "interface": {
      "displayName": "Agent Workflows",
      "shortDescription": "Structured workflows and LLM Wiki operations",
      "longDescription": "Reusable workflows for brainstorming, planning, execution, and LLM Wiki operations.",
      "developerName": "zingxy",
      "websiteURL": "https://github.com/zingxy/agent-plugins"
    },
    "marketplace": { "category": "Productivity" },
    "kimi": {
      "skillInstructions": "Kimi Code tool mapping for skills:\n\n- When a skill says to create todos, mark tasks in_progress, or mark tasks completed, use Kimi Code's `TodoList` tool.\n- When a skill says to dispatch a subagent or asks for a review subagent, use Kimi Code's `Agent` tool with `subagent_type: \"coder\"` for implementation/review tasks, or `subagent_type: \"explore\"` for read-only codebase exploration.\n- When a skill says to invoke another skill (e.g. writing-plans, executing-plans), use Kimi Code's native `Skill` tool.\n- When a skill says to ask clarifying questions, ask one question at a time, or present multiple-choice options, use Kimi Code's `AskUserQuestion` tool.\n- For file operations, use Kimi Code's `Read`, `Write`, `Edit`, `Glob`, and `Grep` tools by their actual names.\n- For shell commands, use the `Bash` tool.\n- For web search or fetching URLs, use `WebSearch` or `FetchURL` respectively."
    }
  }
}
```

- [ ] **Step 5: Regenerate nested host manifests and catalog**

Run: `pnpm --dir plugins/agent-workflows sync`

Expected: the nested Codex, Kimi, Claude manifests and `skills/manifest.json` all report `agent-workflows` and `1.0.0`.

- [ ] **Step 6: Run plugin tests and checks**

Run: `pnpm --dir plugins/agent-workflows test && pnpm --dir plugins/agent-workflows check`

Expected: all generator and identity tests pass; checker reports current generated files and catalog.

- [ ] **Step 7: Commit after user confirmation**

```bash
git add plugins/agent-workflows skills scripts tests .codex-plugin .kimi-plugin .claude-plugin package.json
git commit -m "feat: package agent workflows plugin"
```

### Task 2: Build and test the Codex marketplace catalog

**Files:**

- Create: `scripts/marketplace.mjs`
- Create: `scripts/sync-marketplace.mjs`
- Create: `scripts/check-marketplace.mjs`
- Create: `tests/marketplace.test.mjs`
- Create: `.agents/plugins/marketplace.json`

**Interfaces:**

- Consumes: `discoverPlugins(repositoryRoot)` returning each `plugins/*/package.json` object and absolute directory.
- Produces: `buildMarketplace(plugins)` returning the generated marketplace JSON object.
- Produces: one entry with `name`, `source`, `policy`, and `category` for each discovered plugin.

- [ ] **Step 1: Write failing marketplace-construction tests**

Create `tests/marketplace.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { buildMarketplace, validatePluginIdentity } from "../scripts/marketplace.mjs";

const plugin = {
  directoryName: "agent-workflows",
  packageJson: {
    name: "agent-workflows",
    agentPlugin: { marketplace: { category: "Productivity" } }
  },
  codexManifest: { name: "agent-workflows" }
};

test("buildMarketplace creates an installable local plugin entry", () => {
  assert.deepEqual(buildMarketplace([plugin]), {
    name: "agent-plugins",
    interface: { displayName: "Agent Plugins" },
    plugins: [{
      name: "agent-workflows",
      source: { source: "local", path: "./plugins/agent-workflows" },
      policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
      category: "Productivity"
    }]
  });
});

test("validatePluginIdentity rejects a mismatched directory", () => {
  assert.throws(() => validatePluginIdentity({ ...plugin, directoryName: "other" }), /directory name/);
});
```

- [ ] **Step 2: Run the marketplace test and verify it fails**

Run: `node --test tests/marketplace.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `scripts/marketplace.mjs`.

- [ ] **Step 3: Implement discovery and pure marketplace construction**

Create `scripts/marketplace.mjs`. `discoverPlugins(root)` must inspect direct subdirectories of `plugins/`, require a `package.json` and `.codex-plugin/plugin.json`, and return objects with directory name plus parsed documents. `validatePluginIdentity(plugin)` must reject any mismatch among directory name, `packageJson.name`, `codexManifest.name`, strict-semver package version, and Codex manifest version. `buildMarketplace(plugins)` must sort entries by name and emit exactly this entry shape:

```js
{
  name: plugin.packageJson.name,
  source: { source: "local", path: `./plugins/${plugin.directoryName}` },
  policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
  category: plugin.packageJson.agentPlugin.marketplace.category
}
```

- [ ] **Step 4: Implement sync and check commands**

`scripts/sync-marketplace.mjs` calls discovery/construction and writes two-space JSON plus one trailing newline to `.agents/plugins/marketplace.json`.

`scripts/check-marketplace.mjs` uses the same functions, compares exact serialized content, reports `Stale generated file: .agents/plugins/marketplace.json` on drift, and wraps all read/JSON errors with their repository-relative path.

- [ ] **Step 5: Generate and inspect the catalog**

Run: `node scripts/sync-marketplace.mjs && sed -n '1,160p' .agents/plugins/marketplace.json`

Expected: one `agent-workflows` entry at `./plugins/agent-workflows` in marketplace `agent-plugins`.

- [ ] **Step 6: Run root marketplace tests and checks**

Run: `node --test tests/marketplace.test.mjs && node scripts/check-marketplace.mjs`

Expected: two tests pass and checker prints `Marketplace is current.`.

- [ ] **Step 7: Commit after user confirmation**

```bash
git add .agents/plugins/marketplace.json scripts/marketplace.mjs scripts/sync-marketplace.mjs scripts/check-marketplace.mjs tests/marketplace.test.mjs
git commit -m "feat: add Codex marketplace catalog"
```

### Task 3: Convert the root to an aggregate workspace and preserve Claude discovery

**Files:**

- Modify: `package.json`
- Modify: `pnpm-workspace.yaml`
- Modify: `.claude-plugin/marketplace.json`
- Delete: root `.claude-plugin/plugin.json`
- Delete: root `.kimi-plugin/plugin.json`
- Delete: root `.codex-plugin/plugin.json`

**Interfaces:**

- Consumes: package scripts `sync`, `check`, and `test` from every `plugins/*` workspace member.
- Produces: aggregate commands which run all plugin checks before the root marketplace operation.

- [ ] **Step 1: Add an aggregate command acceptance test**

Run: `pnpm sync`

Expected before implementation: command uses the obsolete root plugin script or fails to synchronize the nested `agent-workflows` package and root marketplace.

- [ ] **Step 2: Rewrite root package metadata and workspace globs**

Set root `package.json` to private package name `agent-plugins` with these scripts:

```json
{
  "scripts": {
    "sync": "pnpm -r --if-present run sync && node scripts/sync-marketplace.mjs",
    "check": "pnpm -r --if-present run check && node scripts/check-marketplace.mjs",
    "test": "pnpm -r --if-present run test && node --test tests/*.test.mjs"
  }
}
```

Set `pnpm-workspace.yaml` to:

```yaml
packages:
  - "plugins/*"
```

Ensure root recursive scripts do not invoke themselves: pnpm recursive execution runs workspace members only because root is not a workspace member.

- [ ] **Step 3: Create the root Claude marketplace entry**

Keep `.claude-plugin/marketplace.json` as a Claude catalog only. Its `plugins` array must contain an `agent-workflows` entry whose source is `./plugins/agent-workflows`; remove the root Claude plugin manifest so the root is no longer represented as installable plugin `skills`.

- [ ] **Step 4: Remove obsolete root host artifacts only after nested checks pass**

Remove the former root Kimi and Codex plugin directories, and the root Claude `plugin.json`. Preserve only the Claude marketplace catalog at root. Confirm no `plugin.json` outside `plugins/agent-workflows/` remains except intentionally documented fixture files.

- [ ] **Step 5: Run aggregate sync, tests, and checks**

Run: `pnpm sync && pnpm test && pnpm check`

Expected: plugin manifests and catalog synchronize first, then the marketplace synchronizes; all checks print success and no root `skills` plugin is discovered.

- [ ] **Step 6: Commit after user confirmation**

```bash
git add package.json pnpm-workspace.yaml .claude-plugin .kimi-plugin .codex-plugin scripts tests .agents
git commit -m "chore: make agent plugins a workspace marketplace"
```

### Task 4: Document installation and perform final migration verification

**Files:**

- Modify: `README.md`
- Create: `plugins/agent-workflows/README.md`
- Modify: `AGENTS.md`
- Move: `.claude/CLAUDE.md` → `plugins/agent-workflows/.claude/CLAUDE.md`

**Interfaces:**

- Consumes: final root marketplace and plugin-local package paths.
- Produces: accurate Codex-first installation instructions and plugin-maintenance guidance.

- [ ] **Step 1: Add a documentation acceptance check**

Run: `rg -n "agent-plugins|agent-workflows@agent-plugins|plugins/agent-workflows|pnpm sync" README.md AGENTS.md`

Expected before editing: root documentation refers to the obsolete `skills` single-plugin layout.

- [ ] **Step 2: Rewrite the root README**

Describe `agent-plugins` as a multi-plugin marketplace, list the `agent-workflows` plugin, and lead with:

```bash
codex plugin marketplace add zingxy/agent-plugins
codex plugin add agent-workflows@agent-plugins
```

Document Claude source `./plugins/agent-workflows`, Kimi local subdirectory installation, the marketplace/plugin naming model, and root aggregate commands. Do not describe a root `skills` plugin.

- [ ] **Step 3: Write the plugin README and migrate agent guidance**

`plugins/agent-workflows/README.md` lists all seven Skills and documents plugin-local `sync`, `check`, `test`, and `bump` commands. Move `.claude/CLAUDE.md` under the plugin directory and update its references from root `skills/` to local `skills/`. Update root `AGENTS.md` to describe marketplace-wide maintenance and direct maintainers to plugin-local guidance.

- [ ] **Step 4: Run documentation acceptance check**

Run: `rg -n "agent-plugins|agent-workflows@agent-plugins|plugins/agent-workflows|pnpm sync" README.md AGENTS.md plugins/agent-workflows/README.md`

Expected: all four identifiers appear in the relevant documentation; no installation example names `skills@`.

- [ ] **Step 5: Perform final repository verification**

Run: `pnpm sync && pnpm test && pnpm check && git diff --check && rg -n '"version": "1\.0\.0"' plugins/agent-workflows/package.json plugins/agent-workflows/.codex-plugin/plugin.json plugins/agent-workflows/.kimi-plugin/plugin.json plugins/agent-workflows/.claude-plugin/plugin.json plugins/agent-workflows/skills/manifest.json`

Expected: all checks pass; every listed plugin artifact reports `1.0.0`; root marketplace points only to `./plugins/agent-workflows`.

- [ ] **Step 6: Commit after user confirmation**

```bash
git add README.md AGENTS.md plugins/agent-workflows/.claude plugins/agent-workflows/README.md
git commit -m "docs: describe agent plugins marketplace"
```

## Plan self-review

- **Spec coverage:** Task 1 creates the self-contained plugin and sole Skill location; Task 2 supplies a generated/validated Codex marketplace; Task 3 creates a scalable workspace and removes the obsolete root plugin; Task 4 documents all three host paths and verifies `agent-workflows@1.0.0`.
- **Placeholder scan:** Every task names exact files, executable commands, expected behavior, interfaces, and commit boundaries. The Kimi mapping is deliberately preserved verbatim from the existing canonical source rather than rewritten.
- **Type consistency:** Both marketplace scripts use `discoverPlugins`, `validatePluginIdentity`, and `buildMarketplace`; generated source paths always derive from `plugin.directoryName` and are validated against package and Codex names.
