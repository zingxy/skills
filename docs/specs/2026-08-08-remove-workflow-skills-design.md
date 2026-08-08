# Remove workflow skills design

## Goal

Remove the unpublished workflow-only skills from `agent-workflows`, leaving a focused LLM Wiki operations plugin at version `1.0.0`.

## Scope

Delete these Skill directories in full:

- `plugins/agent-workflows/skills/brainstorming/`
- `plugins/agent-workflows/skills/writing-plans/`
- `plugins/agent-workflows/skills/executing-plans/`

Also remove their catalog metadata and all documentation references. The remaining skills are `wiki-html`, `wiki-ingest`, `wiki-lint`, and `wiki-query`.

## Design

This is a complete removal, not a hidden or deprecated state. `skills/catalog-metadata.json` remains the editable source for the four remaining skills; `pnpm sync` regenerates `skills/manifest.json` from their frontmatter and metadata.

The plugin keeps version `1.0.0` because it has not been released. Its package description, interface copy, README, and Claude guidance will describe LLM Wiki operations only and will not mention brainstorming, planning, or plan execution.

## Verification

Run plugin and root `sync`, `test`, and `check` commands. Confirm no remaining non-design-document text references the three removed Skill names and verify the generated catalog contains exactly the four remaining names.

## Non-goals

- Creating compatibility aliases or archived copies.
- Changing marketplace identity, plugin identity, or version.
- Modifying the content of the four retained Wiki skills.
