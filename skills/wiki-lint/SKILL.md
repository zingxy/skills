---
name: wiki-lint
description: 体检位于 ~/writing/llm-wiki 的 LLM Wiki 健康度——找矛盾、过时声明、孤儿页、缺失的 [[wikilink]]、重复可合并的页,出简报并经确认后修复。当用户说"巡检/体检 wiki / lint wiki / 检查知识库一致性 / 清理 llm-wiki"时使用。
---

# wiki-lint

巡检位于 `~/writing/llm-wiki/` 的 LLM Wiki 健康度。

## 第一步:先读 schema

读 `~/writing/llm-wiki/CLAUDE.md`,遵守其中的 **Lint 工作流**。

## 范围

用户调用时若指定主题/某些页则限定范围,否则全库(`~/writing/llm-wiki/pages/`)。

## 逐项检查

- **矛盾**:不同页对同一事实说法冲突。
- **过时**:`updated` 很久或已被更新的 ingest 推翻的声明。
- **孤儿页**:无入链也无出链(可借 Obsidian backlinks / index.md 的孤儿页 Dataview 判断)。
- **缺失链接**:正文提到某概念但没 `[[链接]]`,而该概念已有页。
- **重复**:两页其实讲同一概念 → 建议合并。

## 处理方式

**先出一份简报报告问题,改动前等用户确认**(除非是显然无歧义的补链接)。处理完在 `log.md` 顶部追加一行 lint 记录。不要碰 `index.md`,不要手动 git commit。

**写入边界(红线):** 本 skill 只体检并修复 `llm-wiki/` 内的内容,一切写入都在 `llm-wiki/` 内。**绝不修改个人知识库**(`llm-wiki/` 之外的笔记),即使发现个人笔记与 wiki 页有出入,也只在简报里指出、由用户决定,不擅自改个人笔记。详见 CLAUDE.md 的"写入边界"。
