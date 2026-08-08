# Remove Workflow Skills Implementation Plan

**Goal:** Remove the unpublished workflow skills from `agent-workflows`, leaving four LLM Wiki operation skills at version `1.0.0`.

**Architecture:** `skills/catalog-metadata.json` remains the editable catalog source while `skills/manifest.json` is regenerated from it and Skill frontmatter. Documentation and plugin metadata describe Wiki operations only.

**Tech Stack:** Node.js 18+ ESM, pnpm workspaces, Node built-in test runner, JSON, Markdown.

## Global Constraints

- Delete `brainstorming`, `writing-plans`, and `executing-plans` completely.
- Retain only `wiki-html`, `wiki-ingest`, `wiki-lint`, and `wiki-query`.
- Keep `agent-workflows` at exactly version `1.0.0` because it is unpublished.
- Do not modify retained Skill content or marketplace identity.

---

### Task 1: Remove workflow Skill sources and regenerate the catalog

**Files:**

- Delete: `plugins/agent-workflows/skills/brainstorming/`
- Delete: `plugins/agent-workflows/skills/writing-plans/`
- Delete: `plugins/agent-workflows/skills/executing-plans/`
- Modify: `plugins/agent-workflows/skills/catalog-metadata.json`
- Modify: `plugins/agent-workflows/skills/manifest.json`
- Test: `plugins/agent-workflows/tests/plugin-manifests.test.mjs`

**Interfaces:**

- Consumes: the four retained Skill directories and their current frontmatter.
- Produces: a generated manifest containing exactly `wiki-html`, `wiki-ingest`, `wiki-lint`, and `wiki-query`.

- [ ] **Step 1: Add the failing retained-catalog assertion**

Append to `plugins/agent-workflows/tests/plugin-manifests.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the catalog acceptance check and verify it fails**

Run: `node -e 'const names=require("./plugins/agent-workflows/skills/manifest.json").skills.map((skill)=>skill.name); if (JSON.stringify(names) !== JSON.stringify(["wiki-html","wiki-ingest","wiki-lint","wiki-query"])) process.exit(1)'`

Expected: exit code `1` because the generated catalog still includes the three workflow skills.

- [ ] **Step 3: Delete the three Skill directories and metadata entries**

Remove the three exact directories. Delete their `catalog-metadata.json` entries, leaving only the four named Wiki Skills. Do not edit the four retained `SKILL.md` files.

- [ ] **Step 4: Regenerate and test**

Run: `pnpm --dir plugins/agent-workflows sync && pnpm --dir plugins/agent-workflows test && pnpm --dir plugins/agent-workflows check`

Expected: the generated manifest contains four skills, all plugin tests pass, and the checker reports current files.

### Task 2: Align plugin documentation and metadata

**Files:**

- Modify: `plugins/agent-workflows/package.json`
- Modify: `plugins/agent-workflows/README.md`
- Modify: `plugins/agent-workflows/.claude/CLAUDE.md`

**Interfaces:**

- Consumes: the final four-skill catalog from Task 1.
- Produces: Wiki-only descriptions with no workflow Skill references.

- [ ] **Step 1: Update descriptions and skill tables**

Set the package description to `Reusable LLM Wiki operations for agent workflows.` and the interface text to `LLM Wiki Operations` / `LLM Wiki ingest, query, lint, and interactive HTML operations`. Remove the three workflow rows from the plugin README and remove their catalog rows plus default workflow section from Claude guidance.

- [ ] **Step 2: Verify references are gone**

Run: `rg -n "brainstorming|writing-plans|executing-plans" plugins/agent-workflows --glob '!skills/manifest.json' --glob '!skills/catalog-metadata.json'`

Expected: no output.

- [ ] **Step 3: Run final workspace verification**

Run: `pnpm sync && pnpm test && pnpm check && git diff --check && node -e 'const names=require("./plugins/agent-workflows/skills/manifest.json").skills.map((skill)=>skill.name); if (JSON.stringify(names) !== JSON.stringify(["wiki-html","wiki-ingest","wiki-lint","wiki-query"])) process.exit(1)'`

Expected: all commands succeed and the plugin remains at `1.0.0`.

## Plan self-review

- **Spec coverage:** Task 1 removes every requested Skill and regenerates the catalog; Task 2 removes user-facing references while preserving identity and version.
- **Placeholder scan:** Tasks specify exact files, deletion targets, checks, expected output, and final catalog names.
- **Type consistency:** `buildSkillManifest` remains the catalog generator and preserves the existing manifest schema.
