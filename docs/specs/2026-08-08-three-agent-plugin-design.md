# Three-agent plugin organization design

## Goal

Make this personal skill repository installable as native plugins for Kimi, Claude, and Codex while keeping one shared `skills/` catalog. Eliminate hand-maintained metadata drift and release the reorganization as version `2.2.0`.

## Scope

- Add a Codex plugin manifest at `.codex-plugin/plugin.json`.
- Treat `package.json` as the single source of truth for the package version and shared plugin metadata.
- Generate all client manifests and the catalog version from that source.
- Improve contributor documentation and add repeatable validation.
- Do not duplicate or relocate individual `skills/<name>/SKILL.md` files.

## Architecture

```text
package.json (version + agentPlugin metadata)
        |
scripts/sync-plugin-manifests.mjs
        +-- .claude-plugin/plugin.json
        +-- .kimi-plugin/plugin.json
        +-- .codex-plugin/plugin.json
        +-- skills/manifest.json (version)

skills/ (shared content source)
```

`package.json` gains a namespaced `agentPlugin` object. It holds shared identity metadata (name, description, author, homepage, license, keywords, and display details) plus clearly scoped host overrides. The script uses those overrides only for fields required by a specific host, such as Kimi's tool-mapping instructions.

The three generated manifests remain committed so every host can install directly from the repository without a build step. They are derived artifacts and must not be edited directly.

## Versioning and commands

`package.json#version` is the only canonical version. The existing `bump` command is changed to update that field and invoke synchronization.

- `pnpm sync` regenerates every derived manifest.
- `pnpm check` verifies JSON validity, metadata/version consistency, manifest generation is current, and the skills catalog matches the discovered `SKILL.md` files.
- `pnpm bump [patch|minor|major|x.y.z]` updates the canonical version and regenerates all derived files.

After this reorganization, run `pnpm bump minor`, resulting in `2.1.0 -> 2.2.0`. The initial implementation must first align the package version to the current released version so the minor bump has the intended semantic result.

## Client manifests

- Claude uses `.claude-plugin/plugin.json` and retains the repository marketplace definition.
- Kimi uses `.kimi-plugin/plugin.json`; its client-specific `skills` path and `skillInstructions` are generated from the Kimi override.
- Codex uses `.codex-plugin/plugin.json`, containing only metadata supported by Codex's native plugin format. It relies on the repository's shared `skills/` layout rather than copying content.

## Documentation and maintenance

README will document all three supported hosts, their installation paths, the shared layout, and the `sync`, `check`, and `bump` maintenance commands. `AGENTS.md` and `.claude/CLAUDE.md` will be updated to reflect the actual skill catalog and the shared source/derived-manifest rule.

## Error handling and verification

The scripts fail with actionable file-specific errors when canonical metadata is missing, a version is invalid, JSON cannot be parsed, a generated file is stale, or a skills catalog entry disagrees with the filesystem/frontmatter.

The implementation verification sequence is:

1. Run synchronization and inspect all three manifests.
2. Run the repository check command.
3. Bump the minor version to `2.2.0`.
4. Re-run the check command and confirm every derived file reports `2.2.0`.

## Non-goals

- Splitting this repository into three separate packages.
- Changing the behavior or wording of existing individual skills, except where host-agnostic maintenance instructions need to describe the new shared organization.
- Adding an unrelated Codex marketplace entry; the scope is a repository-native Codex plugin definition.
