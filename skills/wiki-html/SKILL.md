---
name: wiki-html
description: 生成人类阅读的自包含 HTML 交互页(拖拽图示、动画演示、可调参数的可视化),走 artifact-design 设计工作流,并按约定沉淀进位于 ~/writing/llm-wiki 的 LLM Wiki 的 html/ 目录——建配套概念页、互链、记 log。当用户说"做个交互页存进 wiki / 把这个主题做成 html 沉淀到知识库 / wiki html / 给 wiki 做个可视化页面 / 把刚才的演示页收进 wiki"时使用;凡是产出 HTML 且归宿是 llm-wiki 的场景都应触发。
---

# wiki-html

设计并构建一个交互 HTML 页面,沉淀进 `~/writing/llm-wiki/html/`。

## 唯一契约:CLAUDE.md

**先读 `~/writing/llm-wiki/CLAUDE.md`,严格按其中的「HTML 交互页」「写入边界」执行。**落盘位置、配套页、查重、log 的规则只维护在那里(单一事实源),本文件不复述。

红线提醒:一切产物只写进 `llm-wiki/`,个人知识库(`llm-wiki/` 之外)只读。

## 构建环节

页面本身的设计与实现,调用 `html` skill 完成(它内部会加载 `artifact-design` 设计规范,并负责完整文档骨架、charset、自包含、双主题等本地 HTML 要求)——但**落盘位置以本 skill 的契约为准**:写进 `llm-wiki/html/`,不是当前目录。若 `html` skill 在当前环境不可用,直接调用 `artifact-design` 并自行补全完整 HTML 文档骨架(`<!doctype html>`、`<meta charset="utf-8">`、`<title>`)。

已有现成 HTML 时(比如本会话刚做过一个演示页)不必重做:核对其符合契约要求(自包含、骨架齐全)后直接落盘归档。

## 完成后

简报:html 文件路径、配套页是新建还是复用了哪个已有页、加了哪些互链;提醒用户可在 Obsidian 里或双击文件查看。
