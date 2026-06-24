# Project Context: AI Agent Skills

This repository contains reusable agent skills in the `skills/` directory. Each skill is defined by a `SKILL.md` file with YAML frontmatter (`name`, `description`).

## How to use these skills

1. At the beginning of a task, read `skills/manifest.json` to see the available skills and their triggers.
2. Determine which skill matches the current task phase.
3. Read the matching `skills/<skill-name>/SKILL.md`.
4. Announce that you are following that skill, then execute its instructions exactly.
5. Respect any hard-gates or user-approval checkpoints in the skill.

## Skill catalog

| Skill | Trigger | What to do |
| --- | --- | --- |
| `brainstorming` | User wants to create a feature, build a component, add functionality, or modify behavior. | Read `skills/brainstorming/SKILL.md`. Explore requirements, propose approaches, write a design spec, and get explicit user approval before any implementation. |
| `writing-plans` | A design/spec exists and the user is ready to plan implementation. | Read `skills/writing-plans/SKILL.md`. Produce a detailed, bite-sized implementation plan with exact files, commands, and expected outputs. |
| `executing-plans` | A written implementation plan exists and the user wants it executed. | Read `skills/executing-plans/SKILL.md`. Execute tasks in order, verify each step, stop and ask when blocked. |

## Default workflow

For any new feature or substantial change, follow this sequence unless the user explicitly says otherwise:

```text
brainstorming → writing-plans → executing-plans
```

Do not write implementation code during `brainstorming`. Do not begin coding during `writing-plans`. Do not skip verifications during `executing-plans`.

## Maintenance

When adding, removing, or renaming skills, also update `skills/manifest.json`, `README.md`, and `AGENTS.md`.
