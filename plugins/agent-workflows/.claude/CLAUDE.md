# Project Context: AI Agent Skills

This plugin contains reusable agent skills in its local `skills/` directory. Kimi, Claude, and Codex use that shared directory through this plugin's native manifests. Each skill is defined by a `SKILL.md` file with YAML frontmatter (`name`, `description`).

## How to use these skills

1. At the beginning of a task, read `skills/manifest.json` to see the available skills and their triggers.
2. Determine which skill matches the current task phase.
3. Read the matching `skills/<skill-name>/SKILL.md`.
4. Announce that you are following that skill, then execute its instructions exactly.
5. Respect any hard-gates or user-approval checkpoints in the skill.

## Skill catalog

| Skill | Trigger | What to do |
| --- | --- | --- |
| `wiki-ingest` | User wants to ingest material into the LLM Wiki. | Read `skills/wiki-ingest/SKILL.md`. Distill source material into atomic pages, maintain wikilinks, and leave provenance. |
| `wiki-lint` | User wants to check or clean up the LLM Wiki. | Read `skills/wiki-lint/SKILL.md`. Audit health, report issues, and fix after confirmation. |
| `wiki-query` | User wants to query the LLM Wiki. | Read `skills/wiki-query/SKILL.md`. Search pages, synthesize answers, and backfill new knowledge into the wiki. |
| `wiki-html` | User wants an interactive HTML page produced for and archived into the LLM Wiki. | Read `skills/wiki-html/SKILL.md`. Follow its artifact-design and LLM Wiki archival workflow. |

## Maintenance

`package.json` is the single source of truth for shared plugin metadata and the release version. Do not hand-edit generated manifests in `.claude-plugin/`, `.kimi-plugin/`, or `.codex-plugin/`.

When adding, removing, or renaming skills, update `skills/catalog-metadata.json`, `README.md`, and `AGENTS.md`, then run `pnpm sync && pnpm check`. `skills/manifest.json` is generated from Skill frontmatter and catalog metadata.
