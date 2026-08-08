---
name: wiki-query
description: 在位于 ~/writing/llm-wiki 的 LLM Wiki 里检索并综合答案,引用来源页面,有价值的新结论回填成新页/更新页;需要时也可读个人知识库(vault 里 llm-wiki 之外的笔记)作补充参考,但只读不改。当用户说"查 wiki / 在知识库里找 / 问问 wiki / 从 llm-wiki 里查 / query wiki"时使用。这是查询 LLM Wiki(llm-wiki/)知识库,回填只写进 llm-wiki,不改个人笔记。
---

# wiki-query

在位于 `~/writing/llm-wiki/` 的 LLM Wiki 里检索并综合答案。

## 唯一契约:CLAUDE.md

**先读 `~/writing/llm-wiki/CLAUDE.md`,按其中的「Query 工作流」执行**——含检索方法、引用来源格式、回填规则(先查重、来自个人笔记的结论要核验并链回)、wiki 内容不够时直说不编造。规则只维护在那里(单一事实源),本文件不复述。

红线提醒:个人知识库(`llm-wiki/` 之外)只读可参考,一切回填只写进 `llm-wiki/`。细则见 CLAUDE.md「写入边界」。
