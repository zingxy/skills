# AI Agent Skills

这个仓库维护一组可复用的 Agent Skill，供 **Kimi**、**Claude** 等 AI 助手直接读取和使用。

## 一键安装

### Kimi Code CLI（原生 Plugin）

```bash
kimi plugin install https://github.com/zingxy/skills.git
```

或在 Kimi Code CLI TUI 中：

```text
/plugins install https://github.com/zingxy/skills
```

安装后执行 `/reload` 或 `/new` 使 Skill 生效。

### Kimi / Claude / 其他代理（vercel-labs/skills 生态）

```bash
npx skills add zingxy/skills -y
```

全局安装：

```bash
npx skills add zingxy/skills -g -y
```

只安装指定 Skill：

```bash
npx skills add zingxy/skills --skill brainstorming -y
```

### Claude Code（Plugin / Marketplace）

方式一：通过 Marketplace 安装

```text
/plugin marketplace add zingxy/skills
/plugin install workflow-skills@zingxy-skills
```

方式二：本地目录直接安装

```bash
claude plugin install /path/to/this/repo
```

安装完成后，Claude 会自动识别 `skills/` 下的 `SKILL.md`。

## 目录结构

```text
skills/
├── brainstorming/          # 创意/设计前的头脑风暴与需求澄清
├── executing-plans/        # 按已有实施计划执行开发
├── writing-plans/          # 根据设计文档撰写可执行的实施计划
├── manifest.json           # 机器可读的 Skill 清单
└── ...
```

每个 Skill 是一个独立目录，核心文件是 `SKILL.md`，采用 YAML frontmatter 描述元信息：

```markdown
---
name: brainstorming
description: You MUST use this before any creative work...
---
```

## 现有 Skill 一览

| Skill | 用途 | 触发时机 |
| --- | --- | --- |
| `brainstorming` | 把模糊想法变成明确设计/规格，并在动手前获得用户确认 | 任何创造性、实现性、修改性行为之前 |
| `writing-plans` | 将已确认的设计文档拆成可逐步执行的任务清单 | 设计已批准、准备开始写代码之前 |
| `executing-plans` | 按已有计划逐步执行、验证、交付 | 已有实施计划，需要进入执行阶段 |

## 各客户端如何使用

### Kimi

Kimi 会自动把 `skills/` 目录下的 `SKILL.md` 识别为**项目级 Skill**。在相关任务开始时，直接调用对应 Skill 即可。

调用链示例：

```text
brainstorming → writing-plans → executing-plans
```

### Claude

Claude 通过项目根目录的 `.claude/CLAUDE.md` 了解本仓库的 Skill 体系。打开项目后，Claude 会根据任务类型读取 `skills/<name>/SKILL.md` 并按其流程执行。

### 其他工具 / 手动使用

如果你使用的 AI 工具支持自定义提示词，可直接复制对应 `SKILL.md` 的内容作为系统提示。机器可读清单见：

- [`skills/manifest.json`](skills/manifest.json)

## 添加新 Skill

1. 在 `skills/` 下新建目录，目录名即 Skill 名（kebab-case）。
2. 创建 `SKILL.md`，顶部必须包含 `name` 和 `description` frontmatter。
3. 在 `skills/manifest.json` 中补充该 Skill 的元数据。
4. 更新本 README 与 `.claude/CLAUDE.md` / `AGENTS.md` 中的 Skill 列表。

## 许可证

私有仓库，仅供内部使用。
