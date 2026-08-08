---
name: wiki-lint
description: 体检位于 ~/writing/llm-wiki 的 LLM Wiki 健康度——找矛盾、过时声明、孤儿页、缺失的 [[wikilink]]、重复可合并的页,出简报并经确认后修复。当用户说"巡检/体检 wiki / lint wiki / 检查知识库一致性 / 清理 llm-wiki"时使用。
---

# wiki-lint

巡检位于 `~/writing/llm-wiki/` 的 LLM Wiki 健康度。

## 唯一契约:CLAUDE.md

**先读 `~/writing/llm-wiki/CLAUDE.md`,按其中的「Lint 工作流」执行**——含检查项(矛盾/过时/孤儿页/缺失链接/重复)、先报告后修复的确认规则、log 记录。规则只维护在那里(单一事实源),本文件不复述。

红线提醒:只体检并修复 `llm-wiki/` 内的内容;发现个人笔记与 wiki 页有出入,只在简报里指出、由用户决定,不改个人笔记。细则见 CLAUDE.md「写入边界」。

## 范围

用户调用时若指定主题/某些页则限定范围,否则全库(`pages/`)。
