# Project Instructions

This repository is the `agent-plugins` marketplace. Codex is the primary distribution target; every installable plugin is a self-contained package under `plugins/<plugin-name>/`.

## Marketplace layout

- `.agents/plugins/marketplace.json` is generated from metadata in each `plugins/*/package.json`.
- `plugins/<plugin-name>/package.json` is the only version and shared metadata source for that plugin.
- `plugins/<plugin-name>/.codex-plugin/plugin.json`, `.kimi-plugin/plugin.json`, `.claude-plugin/plugin.json`, and `skills/manifest.json` are generated files. Do not hand-edit them.
- `plugins/<plugin-name>/skills/catalog-metadata.json` is the editable source for catalog fields not present in `SKILL.md` frontmatter (`when`, `next`, and `tags`).
- Skill content belongs only in `plugins/<plugin-name>/skills/`.

## Maintenance

When adding a plugin, use its normalized kebab-case name for its directory, package name, Codex manifest name, and marketplace entry. Add `agentPlugin.marketplace.category` to its package metadata.

Run these commands before handing off changes:

```bash
pnpm sync
pnpm test
pnpm check
```

The repository owner must rename the remote GitHub repository separately when the public repository name changes.
