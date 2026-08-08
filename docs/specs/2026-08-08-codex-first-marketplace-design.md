# Codex-first agent marketplace design

## Goal

Transform this repository into a Codex-first multi-plugin marketplace named `agent-plugins`. The first self-contained plugin, `agent-workflows`, packages the existing workflow and LLM Wiki skills while continuing to support Claude and Kimi.

## Identity model

| Layer | Name | Purpose |
| --- | --- | --- |
| Repository | `agent-plugins` | Home for every future personal plugin. |
| Codex marketplace | `agent-plugins` | Catalog used in selectors such as `agent-workflows@agent-plugins`. |
| First plugin | `agent-workflows` | The installable workflow and LLM Wiki skill package. |

Future plugins are siblings of `plugins/agent-workflows/`; they do not share its version or manifest.

## Directory architecture

```text
agent-plugins/
├── .agents/plugins/marketplace.json
├── plugins/
│   └── agent-workflows/
│       ├── package.json
│       ├── .codex-plugin/plugin.json
│       ├── .kimi-plugin/plugin.json
│       ├── .claude-plugin/plugin.json
│       ├── skills/
│       ├── scripts/
│       └── tests/
├── package.json
├── pnpm-workspace.yaml
├── scripts/
└── README.md
```

The existing root `skills/` content moves unchanged to `plugins/agent-workflows/skills/`. Each plugin directory is self-contained: its package metadata, three host manifests, skill catalog, scripts, and tests live together.

The repository root owns workspace-wide commands, marketplace generation/checking, and marketplace documentation. It does not expose a second default plugin. The legacy root `skills/`, root host-manifest directories, and their single-plugin scripts are removed after the migration.

## Host compatibility

- Codex reads `.agents/plugins/marketplace.json`, discovers `plugins/agent-workflows`, and installs `agent-workflows@agent-plugins`.
- Claude uses the plugin-local `.claude-plugin/plugin.json`. The repository provides a Claude marketplace entry pointing to `./plugins/agent-workflows` where Claude marketplace installation is desired.
- Kimi uses the plugin-local `.kimi-plugin/plugin.json` and the nested `skills/` path. Documentation supports direct local-subdirectory installation when the remote installer cannot select a repository subdirectory.

All Skill content has one home: `plugins/agent-workflows/skills/`. Nothing is copied or symlinked at the repository root.

## Metadata, generation, and versioning

Each plugin's `package.json` is its sole metadata and version source. `plugins/agent-workflows/package.json` has package name `agent-workflows`, initial release version `1.0.0`, common plugin metadata, host overrides, and marketplace metadata.

The plugin-local generator derives:

- `.codex-plugin/plugin.json`
- `.kimi-plugin/plugin.json`
- `.claude-plugin/plugin.json`
- `skills/manifest.json`

The root marketplace generator discovers every `plugins/*/package.json`, validates that its directory name, package name, Codex manifest name, and marketplace entry name match, then generates `.agents/plugins/marketplace.json` from those metadata objects.

Plugin commands are scoped with pnpm filters:

```bash
pnpm --filter agent-workflows sync
pnpm --filter agent-workflows check
pnpm --filter agent-workflows bump minor
```

Root `pnpm sync`, `pnpm check`, and `pnpm test` invoke the equivalent operation across all workspace plugins and validate marketplace freshness.

## Installation and documentation

The root README positions the repository as `agent-plugins`, documents the catalog layout, and leads with Codex:

```bash
codex plugin marketplace add zingxy/agent-plugins
codex plugin add agent-workflows@agent-plugins
```

It then documents Claude and Kimi subdirectory routes and their host-specific restrictions. The plugin README documents its skills, metadata contract, and maintenance commands. Host and repository instructions distinguish generated manifests from editable package metadata.

## Verification and release

Checks must reject malformed JSON with file-specific messages, stale generated manifests, invalid strict-semver versions, mismatched skill catalog/frontmatter, and inconsistent marketplace identity/path data. Unit tests cover the pure plugin-manifest generator, root marketplace generator, and valid/error paths.

The migration releases `agent-workflows@1.0.0`. The previous `skills@2.2.0` identifier is intentionally retired rather than treated as a compatible continuation because both installation selector and directory structure change.

## Non-goals

- Maintaining a root-level `skills` plugin alongside `agent-workflows`.
- Duplicating Skill content to accommodate different hosts.
- Creating separate repositories for individual future plugins.
- Renaming the remote GitHub repository automatically; that must be performed by the repository owner.
