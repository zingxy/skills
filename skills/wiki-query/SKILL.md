---
name: wiki-query
description: 在位于 ~/writing/llm-wiki 的 LLM Wiki 里检索并综合答案,引用来源页面,有价值的新结论回填成新页/更新页;需要时也可读个人知识库(vault 里 llm-wiki 之外的笔记)作补充参考,但只读不改。当用户说"查 wiki / 在知识库里找 / 问问 wiki / 从 llm-wiki 里查 / query wiki"时使用。这是查询 LLM Wiki(llm-wiki/)知识库,回填只写进 llm-wiki,不改个人笔记。
---

# wiki-query

在位于 `~/writing/llm-wiki/` 的 LLM Wiki 里查询。

## 第一步:先读 schema

读 `~/writing/llm-wiki/CLAUDE.md`,遵守其中的 **Query 工作流**。

## 执行步骤

1. 在 `~/writing/llm-wiki/pages/` 检索相关页(可参考 `index.md` 的 Dataview 结果当目录),综合出答案。**以 llm-wiki 为主**。
2. 需要时**也搜个人知识库**:vault 里 llm-wiki 之外的相关主题目录(问 Rust 就看 `~/writing/Rust/`,问前端看 `BigFrontEnd/` 等)可作补充参考——**按需搜相关目录,别每次全库扫**(vault 上千文件,全扫又慢又吵)。
3. 引用来源:wiki 页用 `[[页名]]`;引用个人笔记时**标出其路径**(如 `Rust/所有权与借用.md`)以区分于 wiki 页,让来源可追溯。
4. 如果检索/推理过程中**产生了 wiki 里还没有的有价值结论**,询问是否回填;得到同意(或明显该存)就新建/更新页面,并在 `log.md` 顶部追加一行。**回填只写进 `llm-wiki/`,绝不改个人笔记**。若结论来自个人笔记,同 [[wiki-ingest]] 规则:**先核验正确性**(个人笔记不一定准,存疑的标 `> [!todo]`),且**页面要 `[[链接]]` 回原始笔记**保证可溯源。回填规则详见 [[wiki-ingest]] / CLAUDE.md。

## 写入边界(红线)

个人知识库(`llm-wiki/` 之外的一切)对本 skill **只读**——可以读来参考,但不写。查询产生的新结论一律回填进 `llm-wiki/`。万一确有必要改某篇个人笔记,先说清改哪个、怎么改,得到用户显式确认再动手。详见 CLAUDE.md 的"写入边界"。

## 没有足够信息时

如果 wiki 里没有足够内容回答,直说,并建议先用 wiki-ingest 补素材。不要凭空编造 wiki 里没有的内容。
