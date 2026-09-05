# design-system + graphics-teach 技能设计

日期:2026-09-05
状态:已实现

## 背景

用户在学习图形学(Canvas 原理、Three.js、Bevy 等),希望有一个技能能把复杂概念做成沉浸式交互教学页——风格对标 3Blue1Brown / GeoGebra / Desmos:图形和动画是第一公民,文字辅助。同时希望抽出独立的共享设计系统(design tokens),供后续更多 HTML 技能复用。

现有 `wiki-html` 技能已覆盖"交互页 + 归档进 llm-wiki",但归宿被钉死在 wiki,且没有教学法指导。决策:新建独立技能,产物默认落当前目录;需要沉淀时再转交 `wiki-html`。

## 架构

两个新技能,放入 `plugins/agent-workflows/skills/`:

```
graphics-teach  ──加载──▶  design-system (tokens/骨架/控件模式)
wiki-html      ──加载──▶  design-system (替换原先不存在的 artifact-design 引用)
(将来的 html 技能) ──加载──▶  design-system
```

- **design-system**:纯参考型技能,不直接响应用户请求。**样式一律用 Tailwind CSS**:技能自带 `vendor/tailwind.browser.js`(v4 浏览器构建,约 280KB),构建页面时全文内联进 `<script>`,样式写在 `<style type="text/tailwindcss">` 块——任意工具类运行时可用,同时保住自包含、零外链、离线双击可开。内容:@theme 双主题 tokens(语义色 + manim 系教学色,深色用媒体查询覆盖变量)、标准文档骨架、控件模式(舞台/滑块/播放暂停/拖拽手柄/标注/步进,均以工具类组合给出)、动效规则(rAF、prefers-reduced-motion)。视觉规范的单一事实源。
- **graphics-teach**:面向用户的教学页技能。核心是"把概念讲清楚":构建前先做概念分析(解决什么问题、核心困惑、一个洞察、出现在哪里),讲解手法八条(动机先行、视觉先行、具体→抽象、误解显式化、连续动画、参数可拨、渐进揭示、预测再验证),页面结构七段(动机 → 直觉 → 拆解 → 形式化 → 实验室证伪 → 真实世界的回响 → 小结挑战)。技术路线:默认 Canvas 2D;真 3D 手写 WebGL;仅演示 Three.js 本身时才内联 three.min.js;Bevy ECS 类概念用 2D 模拟。

## 边界

- `graphics-teach` 只管把页面做出来,默认写当前工作目录(kebab-case);用户说"存进 wiki"时归档交给 `wiki-html`。
- `wiki-html` 的落盘契约仍在 `~/writing/llm-wiki/CLAUDE.md`,不动;本次只把其失效的 `artifact-design`/`html` 技能引用替换为 `design-system`。
- 插件元数据(displayName 等)本次不动;若后续非 wiki 技能增多,可考虑拆出独立插件。

## 验证

- `pnpm sync && pnpm test && pnpm check` 全绿。
- `pnpm --dir plugins/agent-workflows bump minor`(1.0.0 → 1.1.0)。
- 同步到已安装插件目录 `~/.kimi-code/plugins/managed/qing/skills/` 使当前环境立即可用。
