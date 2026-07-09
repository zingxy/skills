---
name: wiki-ingest
description: 把素材(默认当前对话,也可文件/URL/文本,或个人知识库里的某篇笔记)蒸馏沉淀进位于 ~/writing/llm-wiki 的 LLM Wiki——拆成原子概念页、维护 [[wikilink]] 交叉引用、留 source 凭证、记 log;用个人笔记当素材时只读不改,产物只写进 llm-wiki。当用户说"沉淀到 wiki / 整理进 wiki / 进知识库 / 把这段对话存进 wiki / 把某篇笔记整理进 wiki / ingest 到 llm-wiki / 记一下 / 整理成笔记 / 存档"时使用。
---

# wiki-ingest

把素材摄入位于 `~/writing/llm-wiki/` 的 LLM Wiki。

## 第一步:永远先读 schema

读 `~/writing/llm-wiki/CLAUDE.md`,严格按其中的 **Ingest 工作流**和**页面约定**执行。它是这个 wiki 的契约,以它为准(本文件如与之冲突,以 CLAUDE.md 为准)。

## 判断来源

来源 = 用户调用本 skill 时给的参数/上下文:
- **为空** → 来源是**当前这段对话**。蒸馏其中有沉淀价值的概念/结论,不要原样倒整个 transcript。
- **文件路径** → 读该文件。
- **URL** → 用 WebFetch 抓取。
- **一段文本** → 直接用。
- **个人知识库里的某篇笔记**(给 vault 内路径,如 `Rust/所有权与借用.md`) → 读它当素材,蒸馏进 llm-wiki。三条约束:
  - **只读、绝不修改原笔记**;在 `sources/` 里留一份凭证(记来源路径、日期、要点摘录),即便原笔记日后变动 llm-wiki 也有自己的 provenance。
  - **核验正确性**:个人笔记不一定准确(可能笔误/过时/理解偏差),蒸馏前先核对(推理/官方文档/必要时 WebFetch·WebSearch);存疑或与权威冲突的用 `> [!todo]`/`> [!warning]` 标出,不照单全收——别把错误当事实沉淀进 wiki。
  - **链回原始笔记**:蒸馏出的页面在 frontmatter `sources` 里带上原笔记的 `[[wikilink]]`/路径,正文合适处也 `[[链接]]` 回去,保证可溯源(链接不改原笔记)。

## 执行步骤

1. 把原始素材落到 `~/writing/llm-wiki/sources/<YYYY-MM-DD-简短标题>.md`(不可变凭证,带 frontmatter,今天日期从环境取)。
2. 识别 3~8 个概念/实体,逐个**新建或更新** `~/writing/llm-wiki/pages/` 下的页面(原子化、frontmatter 齐全:title/aliases/tags/created/updated/sources)。已有页则更新内容、`updated`、`sources`。
3. 在相关页之间补全 `[[交叉引用]]`(一次 ingest 常碰 10+ 页的链接)。
4. 在 `~/writing/llm-wiki/log.md` 顶部追加一行 ingest 记录。
5. **不要碰 `index.md`**(Dataview 自动刷新);**不要手动 git commit**(obsidian-git 自动备份);**不要编辑已有 sources 文件**(只追加新的)。

## 写入边界(红线)

所有 ingest 产物**只写进 `llm-wiki/`**(`pages/`、`sources/`、`log.md`)。个人知识库(`llm-wiki/` 之外的一切)当素材时**只读**——绝不把蒸馏结果写回个人笔记,也不修改被引用的原笔记。万一确有必要改某篇个人笔记,先说清改哪个、怎么改,得到用户显式确认再动手。详见 CLAUDE.md 的"写入边界"。

## 完成后

简报:新建了哪些页、更新了哪些页、加了哪些交叉引用。
