---
name: wiki-ingest
description: 把素材(默认当前对话,也可文件/URL/文本,或个人知识库里的某篇笔记)蒸馏沉淀进位于 ~/writing/llm-wiki 的 LLM Wiki——拆成原子概念页、维护 [[wikilink]] 交叉引用、留 source 凭证、记 log;用个人笔记当素材时只读不改,产物只写进 llm-wiki。当用户说"沉淀到 wiki / 整理进 wiki / 进知识库 / 把这段对话存进 wiki / 把某篇笔记整理进 wiki / ingest 到 llm-wiki / 记一下 / 整理成笔记 / 存档"时使用。
---

# wiki-ingest

把素材蒸馏摄入位于 `~/writing/llm-wiki/` 的 LLM Wiki。

## 唯一契约:CLAUDE.md

**先读 `~/writing/llm-wiki/CLAUDE.md`,严格按其中的「Ingest 工作流」「页面约定」「写入边界」执行。**规则只维护在那里(单一事实源),本文件不复述——只补充调用时才知道的信息(下面两节)。

红线提醒:一切产物只写进 `llm-wiki/`,个人知识库(`llm-wiki/` 之外)只读。细则见 CLAUDE.md「写入边界」。

## 判断来源

来源 = 用户调用本 skill 时给的参数/上下文:

- **为空** → 来源是**当前这段对话**。蒸馏其中有沉淀价值的概念/结论,不要原样倒整个 transcript。
- **文件路径** → 读该文件。
- **URL** → 用 WebFetch 抓取。
- **一段文本** → 直接用。
- **个人知识库里的某篇笔记**(vault 内路径,如 `Rust/所有权与借用.md`) → 读它当素材;此来源有专门约束(只读不改原笔记、核验正确性、链回原笔记),按 CLAUDE.md「Ingest 工作流」开头的说明执行。

## 完成后

简报:新建了哪些页、更新了哪些页、加了哪些交叉引用;若查重后改为更新已有页而没新建,说明一下。
