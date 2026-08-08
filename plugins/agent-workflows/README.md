# Agent Workflows

`agent-workflows` is an `agent-plugins` marketplace plugin for LLM Wiki operations. Its version and shared metadata live in `package.json`; its generated manifests target Codex, Kimi, and Claude.

## Included Skills

| Skill | Purpose |
| --- | --- |
| `wiki-ingest` | Distill material into the LLM Wiki. |
| `wiki-lint` | Check and repair LLM Wiki health after confirmation. |
| `wiki-query` | Search and synthesize answers from the LLM Wiki. |
| `wiki-html` | Create and archive an interactive HTML artifact in the LLM Wiki. |

## Local maintenance

```bash
pnpm sync
pnpm test
pnpm check
pnpm bump minor
```

Do not directly edit `.codex-plugin/plugin.json`, `.kimi-plugin/plugin.json`, `.claude-plugin/plugin.json`, or `skills/manifest.json`. Update `package.json`, `SKILL.md` frontmatter, and (for `when`, `next`, or `tags`) `skills/catalog-metadata.json`, then regenerate them instead.
