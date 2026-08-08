# Agent Plugins

`agent-plugins` 是一个以 Codex 为优先的个人 Agent Plugin marketplace。每个插件都位于 `plugins/<plugin-name>/`，拥有独立版本、Skill 内容、三端清单与测试。

## 插件目录

| 插件 | 说明 | Codex 安装引用 |
| --- | --- | --- |
| `agent-workflows` | LLM Wiki 操作 | `agent-workflows@agent-plugins` |

## 安装

### Codex

在远程仓库重命名为 `zingxy/agent-plugins` 后，添加 marketplace 并安装插件：

```bash
codex plugin marketplace add zingxy/agent-plugins
codex plugin add agent-workflows@agent-plugins
```

Codex marketplace 清单位于 [`.agents/plugins/marketplace.json`](.agents/plugins/marketplace.json)，并指向 `plugins/agent-workflows`。

### Claude Code

将本仓库作为 Claude marketplace，然后安装其中的插件：

```text
/plugin marketplace add zingxy/agent-plugins
/plugin install agent-workflows@agent-plugins
```

本地开发时可直接加载插件目录：

```bash
claude --plugin-dir /path/to/agent-plugins/plugins/agent-workflows
```

### Kimi Code CLI

Kimi 的远程安装器无法选择 Git 仓库中的子目录时，先 clone 仓库，再从插件目录安装：

```bash
git clone https://github.com/zingxy/agent-plugins.git
kimi plugin install /path/to/agent-plugins/plugins/agent-workflows
```

## 目录结构

```text
agent-plugins/
├── .agents/plugins/marketplace.json  # Codex 生成目录
├── .claude-plugin/marketplace.json   # Claude 目录
├── plugins/
│   └── agent-workflows/               # 独立插件包
│       ├── .codex-plugin/plugin.json
│       ├── .kimi-plugin/plugin.json
│       ├── .claude-plugin/plugin.json
│       ├── skills/
│       ├── scripts/
│       └── package.json
├── scripts/                           # marketplace 生成与检查
└── package.json                       # workspace 聚合命令
```

`plugins/agent-workflows/skills/` 是现有 Skill 的唯一内容来源；不要在仓库根复制或创建第二个 `skills/` 目录。

## 维护

根目录命令管理全部插件与 marketplace：

```bash
pnpm sync
pnpm test
pnpm check
```

维护单个插件时，从其目录运行：

```bash
pnpm --dir plugins/agent-workflows sync
pnpm --dir plugins/agent-workflows test
pnpm --dir plugins/agent-workflows check
pnpm --dir plugins/agent-workflows bump minor
```

新增插件时，在 `plugins/` 创建一个与插件名相同的目录，并让目录名、子包 `package.json#name`、`.codex-plugin/plugin.json#name` 保持一致。根 marketplace 会在 `pnpm sync` 时自动发现并登记它。

## 许可证

私有仓库，仅供内部使用。
