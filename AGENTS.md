# Project Instructions

This repository is a collection of reusable agent skills for AI assistants such as Kimi and Claude.

## Skill layout

- Each skill lives in `skills/<skill-name>/`.
- The canonical definition is `skills/<skill-name>/SKILL.md`.
- Skill metadata is in YAML frontmatter (`name`, `description`).
- A machine-readable catalog is available at `skills/manifest.json`.

## Available skills

| Skill | When to invoke | Next skill |
| --- | --- | --- |
| `brainstorming` | Before any creative, implementation, or behavior-changing work. Use it to explore intent, constraints, and design, then get user approval before writing code. | `writing-plans` |
| `writing-plans` | After a spec/design is approved and before any code is touched. Use it to produce a detailed, step-by-step implementation plan. | `executing-plans` |
| `executing-plans` | When a written implementation plan exists and you need to execute it in a focused session. | — |

## How to use these skills

1. At the start of a task, pick the skill that matches the current phase.
2. Announce that you are using the skill, then follow the instructions in its `SKILL.md` exactly.
3. Do not skip hard-gates or user-approval steps defined in the skill.
4. When a skill says to invoke another skill, do so explicitly.

## Skill chaining

The default workflow for any new feature or significant change is:

```text
brainstorming → writing-plans → executing-plans
```

Do not combine phases unless the skill explicitly allows it.

## Maintenance rules

- Keep each skill self-contained and actionable.
- Do not add implementation code to a skill file; only add instructions and examples.
- When adding or renaming a skill, update `skills/manifest.json`, `README.md`, and `.claude/CLAUDE.md`.
