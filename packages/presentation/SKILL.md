---
name: presentation
description: "Render content — a design doc, a spec, an AI conversation/context, a dataset, or rough notes — into a human-readable visual presentation, choosing the form that best fits each piece of content. Use this whenever the user wants to present, visualize, write up, or 'make readable' a design document, technical decision, conversation, analysis, or data — even if they don't say the word 'presentation'. Not limited to slides: prose becomes typeset long-form, numbers become charts (Recharts/D3), processes become animations, spatial/simulation content becomes canvas (Pixi/three). Built on React + Tailwind + shadcn; presented live via the dev server by default, and exportable to a single self-contained HTML file on request."
---

# Presentation

Take content — a design doc, a spec, a transcript of an AI conversation, a dataset, loose notes — and render it in the form a human can actually absorb. The core skill is **matching representation to content**: prose wants clean typography, numbers want charts, a process over time wants animation, a coordinate system or simulation wants a canvas. You have the whole React ecosystem to reach for; the job is choosing well and using the lightest tool that does the content justice.

This drives the template in this package (`packages/presentation`): **Vite + React 19 + Tailwind v4 + shadcn/ui (`base-rhea`) + `vite-plugin-singlefile`**. You build React components and present them live with `pnpm dev`. When the user explicitly wants a portable file, `pnpm build` inlines everything into a single `dist/index.html` (no external assets, easy to share or hand off) — but that's an export step, not the default.

## The central idea: form follows content

Don't default to one format (slides, or a wall of text). Read the content, break it into pieces, and ask of each: *what does a reader need in order to get this fast?*

- A **claim or decision** → a clear sentence with hierarchy. Typography, not decoration.
- **Numbers, comparisons, trends, distributions** → a chart. A bar/line/area beats a table of figures for "what's the shape of this".
- **Something that changes over time or a process with steps** → motion. An animated reveal or transition makes sequence legible in a way static boxes don't.
- **A coordinate system, spatial layout, simulation, or many moving elements** → a canvas (Pixi/three), where DOM would choke.
- **Relationships, architecture, flow** → a diagram (nodes/edges).
- **Code** → syntax-highlighted (Shiki), and a diff when the point is *what changed*.

`references/representation-guide.md` is the decision guide: for each kind of content, the recommended representation, the library to reach for, and when to escalate to something heavier. **Read it before building** — it's the heart of this skill.

**The second failure mode (after transcription): under-visualizing.** The path of least resistance is a wall of `Prose` with maybe one static chart bolted on — because prose is the easiest block to fill. Resist it. **A mechanism, a process, a spatial idea, or a set of relationships almost always lands better as an interactive diagram or an animation than as a paragraph describing it.** So invert the default: for any concept that *moves, has parts, or has structure*, your first instinct should be "what visual *derives* this?", and plain prose is the choice you justify, not the one you fall into. Prose is for claims, framing, and the connective narrative between visuals — not for explaining how a thing works. A reader should be able to understand the core of each section from its visual alone; the prose is the voice-over.

## Audience: junior engineers — bar is "explain like I'm five"

Unless the user says otherwise, write for a **junior engineer** — someone capable but still building their mental models, who hasn't yet internalized the jargon, patterns, or context a senior takes for granted. The clarity bar is **ELI5**: someone should finish each section with an *intuition*, not just a definition. Lead with an analogy or a concrete picture, then layer in the precise version. If a smart newcomer wouldn't get it on first read, it's not done. This shapes every decision about depth and presentation:

- **Explain the "why", not just the "what".** A senior can infer why a decision was made; a junior needs it spelled out. When the content states a choice, surface the reasoning and the alternative that was rejected.
- **Define terms on first use.** Don't assume acronyms, library names, or patterns are known. A one-line gloss (inline, or a small "terms" aside) turns a wall of jargon into something learnable. Link concepts to things they likely *do* know.
- **Build understanding progressively.** Start from the problem and the intuition before the precise/formal version. Order sections so each builds on the last — a junior reading top to bottom should never hit a concept that depends on something not yet introduced.
- **Annotate the visuals.** A chart, diagram, or code block that's obvious to an expert isn't to a junior. Add a caption saying what to notice ("the gap here is the cost we're paying"), label diagram parts, comment the load-bearing lines of code. The visual plus its annotation should teach, not just display.
- **Prefer worked, concrete examples** over abstract description. A junior learns the general rule fastest from a specific instance with real values.
- **Tone:** clear and encouraging, never condescending. The goal is to bring the reader up to speed and leave them able to reason about the topic themselves — not to show off how much the author knows.

This raises the value of step-by-step animations (showing a process unfold is more teachable than a static end-state) and of code annotations — keep that in mind when choosing representations.

## Teach, don't transcribe — the one failure mode that ruins everything

This is the single most important section in this skill, and the mistake it warns against is the one you are *most likely* to make. Read it twice.

The #1 failure mode is **mapping the source 1:1**: keeping the document's headings, order, and terminology, translating it, and bolting a visual onto each section. That produces a *map of the doc*, not a lesson — it reads stiff and explains nothing a newcomer couldn't have gotten from the original. It is seductive because it's the path of least resistance: the source hands you a structure, and copying it feels like progress. **It isn't. It's the thing to avoid.**

A source doc is written by someone who already understands it, for a peer; it states conclusions in the author's order and jumps straight to notation. Your job is the opposite: **re-derive the explanation for someone who doesn't know it yet.** That almost always means a *different* structure than the source — usually a different *order*, different *entry point*, and different *section boundaries*.

### What this looks like in practice (the bundled example)

The gradient-descent demo (`references/example-gradient-descent/`) is built by re-deriving, not transcribing. A typical source — an ML chapter on gradient descent — and the demo's structure diverge **completely**:

| The source's headings (transcription bait) | What the demo actually does (re-derived as a lesson) |
|---|---|
| 1. Introduction & motivation | **驱动问题:** "网络是怎么自己变聪明的?" — one concrete goal the whole piece chases |
| 2. The loss function $L(w)$ | **§1 学习就是让一个数字变小** — names the *ingredients* (权重、损失) with zero notation |
| 3. Gradients & partial derivatives | **§2 错误是一片地形,你要往下滚** — the **spine analogy** (小球滚下山谷), *felt* before any math |
| 4. The update rule $w \leftarrow w-\eta\nabla L$ | **§3 哪边是下坡?** — *only now* the formula appears, framed as "the code for the downhill idea you already feel" |
| 5. Learning rate & convergence | **§4 训练循环 / §5 那个能毁掉一切的旋钮** — answers the question §3 raised; the beginner's trap (步子太大就爆炸) gets its own section |
| 6. Variants: momentum, Adam, schedules | demoted to **one closing sentence** — a beginner doesn't need it yet |

Notice: the order is rebuilt, the math is delayed to §3, one analogy carries the whole thing, and the source's "Variants" chapter — important to a peer — is cut to a sentence. **That is the gap between a lesson and a transcript.**

### The moves that get you there

- **Organize around the learner's questions and one concrete motivating problem — not the source's headings.** Open with a relatable goal ("你在做一个能拖拽缩放的画布,像 Figma——怎么做到?") and let each section answer the question the previous one raised.
- **Pick one spine analogy and build everything on it.** Make the reader *feel* the intuition before any formalism. Carry the analogy through every later section.
- **Delay the math; earn it.** Never open a section with an equation. Introduce each formula only after the intuition is solid, framed as "the code for an idea you already get." A symbol the reader hasn't been set up for is a wall.
- **Anticipate the exact spot a beginner trips, and address it in their words** ("等等,为什么是*减去*梯度?"). The source often buries this; surface it.
- **Use a concrete worked example with real numbers, and let interactive visuals *derive* the idea**, not just illustrate it ("摄像机在 (360,320),你点了右上角——那在世界坐标里是哪儿?我们算一遍").
- **Cut or demote advanced asides the source includes but a beginner doesn't need.** Faithfulness is to the *understanding*, not to the source's table of contents.

### Litmus test — run it before you show the plan (step 3) and again before you ship

Lay your section titles next to the source's headings, in order:

- **If they line up one-for-one, you transcribed. Stop and restructure** — do not proceed to building.
- If your opening is the source's "introduction" rather than a concrete problem, you transcribed.
- If a formula appears before its intuition, you transcribed.
- If a smart newcomer couldn't follow your version *without the original open beside them*, it's not done.

Passing this test is a **hard gate**, not a nice-to-have: a transcription that's beautifully typeset is still a failure.

## Output language

Write the presentation's content in **Chinese by default** — titles, prose, captions, callouts, labels, glossary. Keep code, identifiers, math symbols, and established technical terms in their conventional form (English/symbols), glossing them in Chinese on first use where it aids a newcomer. Only switch the output language if the user's source material or request is clearly in another language or they ask for one.

## Workflow

1. **Mine the source for raw material — then drop its structure.** Read the source and extract the *ingredients*: the decisions reached, the rationale, the final design, key code, the real numbers, the load-bearing facts. For an AI conversation, strip the back-and-forth and keep the conclusions, not the transcript. **Then deliberately throw the source's headings and order away.** You now hold a pile of facts, *not* an outline to copy. This step is extraction, not segmentation — do **not** carry the source's section structure forward; that's how transcription starts (see "Teach, don't transcribe").

2. **Design the lesson — the load-bearing step.** Before any layout, write down (you'll show these to the user in step 3):
   - **One motivating problem** the whole piece chases — a concrete, relatable goal, not "an introduction to X."
   - **One spine analogy** you'll carry through every section.
   - **The learner's question chain:** an ordered list where each entry is a question, each section answers one, and each question is raised by the answer before it. The *order of these questions is your section order* — and it should look nothing like the source's table of contents.
   
   Then map each question to a representation (`references/representation-guide.md`) — prose, chart, diagram, animation, canvas, code — **defaulting to the most vivid form that *derives* the idea, not the easiest to type.** For each question ask "what visual makes this click?" first; reach for prose only when the answer is genuinely a claim or a piece of narrative. A mechanism or process → an animation or step-through; structure or relationships → a diagram (build it, don't describe it); a coordinate system / simulation / many elements → a canvas. Note which need a library so you can install them once, together — don't avoid a library to save effort. **Do not** settle for "a paragraph plus one static chart per section"; that is the under-visualization failure.

   **Make demos detailed, not decorative.** An interactive demo should let the reader *do* the thing and watch the idea emerge: real controls (sliders, play/step, toggles), live state, labels and readouts that update, and annotations that point at what just happened ("步子超过 1.0,看小球冲出山谷"). A static screenshot of a dynamic idea, or a slider that changes nothing meaningful, is worse than good prose. If a concept has a "knob," the reader should be able to turn it.

3. **Plan the document, run the litmus test, show the user.** Fill in the fixed skeleton (see "Stable structure" below): frontmatter, and the ordered sections as *question it answers → chosen representation* ("§1 学习在调什么? → 直觉散文 + 网络示意图;§2 怎么知道往哪调? → 山谷类比 + 可拖动 demo;§3 哪边是下坡? → 'why' callout + 延后引入的公式"). **Before showing the user, run two checks.** (1) *Transcription* — lay your section titles next to the source's headings; if they parallel, restructure now, don't show it yet. (2) *Under-visualization* — scan your representation column: if it's mostly "prose" with a chart or two, you've under-visualized; upgrade the mechanism/process/structure sections to diagrams or interactive demos before showing it. The plan you show the user must include the **motivating problem, the spine analogy, the question chain, and a real representation per section** — not just a list of titles — so both failures are caught here, at the cheap stage. Get a nod. Re-ordering an outline is cheap; rebuilding rendered sections isn't.

4. **Author it as a new, self-contained article — never edit `App.tsx`.** Each presentation is its own folder `src/articles/<your-id>/` (copy `src/articles/konva-transformer/` as a scaffold). In that folder:
   - `index.tsx` **exports** `const doc: PresentationDoc = { ... }` (compose section `content` from the bundled **blocks**: `Prose`, `Callout`, `ChartFrame`, `CodeBlock`, `Stat`/`StatGrid`, `TwoCol`).
   - keep this article's custom visuals **inside the folder**, e.g. `src/articles/<your-id>/visuals/`, and drop each *inside* `ChartFrame`/`DiagramFrame` — install whatever viz library explains it best (`references/representation-guide.md`). (Genuinely generic helpers like `@/components/visuals/Math` stay shared.)
   
   Then **register it** in `src/articles/index.ts` (`{ id: '<your-id>', doc }`) — that one line makes it appear on the home page automatically. `App.tsx` is the home/index + router and is **off-limits**: do not author a deck there, and do not hand-roll the page layout, TOC, section headers, or spacing — the `Document` shell owns all of that. See `references/blocks.md` for every block's API.

5. **Present via the dev server (default).** Run `pnpm dev` and actually look at it (use the `run`/`verify` skill or drive a browser) — charts and animations especially need to be *seen*, not assumed. Iterate until each section truly lands at ELI5 level, then hand the user the local URL as the deliverable. **Only build a single-file HTML when the user explicitly asks** ("export", "give me an html", "a file I can send") — then run `pnpm build` and point them to `dist/index.html`. Don't build by default; the running dev server is the presentation.

## Stable structure: the `Document` shell + blocks

Every presentation uses one fixed skeleton so the output is predictable and consistently good — you supply content, the shell supplies the structure. The shell (`src/components/blocks/Document.tsx`) takes a `PresentationDoc` and always renders, in order:

**Frontmatter cover** (title, subtitle, authors, date, tags, one-line TL;DR) → **sticky-sidebar TOC** (auto-derived from the section titles, with scroll-spy) → **Overview** → **numbered topic sections** → **Summary** → optional **Glossary** / **References**.

**Articles, not App.tsx.** `App.tsx` is a home/index page that lists the articles and renders the selected one; you never touch it. You write each presentation as a self-contained article that *exports* a `doc`, in `src/articles/<id>/index.tsx`:

```tsx
// src/articles/<id>/index.tsx
export const doc: PresentationDoc = {
  frontmatter: { title, subtitle, authors, date, tags, tldr },
  overview: <Prose markdown={`...`} />,
  sections: [{ id, title, intent, content: <>...</> }, ...],  // content is flexible
  summary: <>...</>,
  glossary: [{ term, def }],   // optional
};
// then register in src/articles/index.ts:  { id: '<id>', doc }
// App.tsx renders <Document doc={doc} /> for you — don't write that yourself.
```

The home page's card for the article is driven by its `frontmatter`, so a good title/subtitle/tags/date matter. **What's fixed vs. what varies:** the home index, the cover, TOC, section numbering/headers, spacing rhythm, typography, and color are all owned by the shell — identical across every presentation. Only each section's `content` varies. This is the whole point: stable, on-brand structure; flexible content.

**Hard rule:** never reach around the shell. Don't rebuild the cover/TOC/headers, and don't override block styling via `className` (use it only for layout positioning *inside* a section). If a block seems to be missing for a real need, add it to `src/components/blocks/` as a reusable component rather than one-off styling in a section — that keeps every future presentation consistent.

The blocks lock layout/typography/color; the reader scrolls the long-form document top to bottom, with `ChartFrame`/`DiagramFrame` visuals breaking out as needed. Full block APIs: `references/blocks.md`.

## Design notes

The template's theme **is** the Claude warm-editorial design system from `references/DESIGN.md` — a tinted cream canvas, coral primary, dark navy surfaces, slab-serif display + humanist sans. It's already wired into the theme tokens in `src/index.css`, so using the tokens (below) automatically lands on-brand. Read `references/DESIGN.md` when you need specifics: exact surface roles, component treatments, spacing rhythm, do's & don'ts. Lean on it:

- **Typography first.** Headings in `font-heading` (Cormorant Garamond — a literary slab-serif; pair with `tracking-tight`), body in the default sans (Inter), code in `font-mono` (JetBrains Mono). Cap prose width (`max-w-2xl`/`prose`-like) so lines stay readable; let visuals break wider.
- **Theme tokens, not raw colors.** `bg-background`/`text-foreground`, `text-muted-foreground` for secondary, `text-primary` for accent, and the `chart-1..5` vars as a ready-made categorical palette for charts (so charts match the deck). Avoid hardcoded hex / `text-gray-500`.
- **Let the visuals carry weight.** A well-chosen chart or diagram earns full width and breathing room. Don't bury it in a cramped column.
- **Richness over restraint — but in service of understanding.** Spend effort on visuals: a complex or dynamic concept deserves an animation or interactive diagram, and building it well is the job, not an indulgence. The only restraint that matters: motion must *teach sequence*, not decorate — a static chart that lands instantly beats an animation that merely wiggles. So the bar is "does this visual make the idea click faster?", and for mechanisms/processes/structure the honest answer is usually *yes, build it*. Under-visualizing to save effort is the more common failure here than over-doing it.

## Notes on the stack

- **Dev server is the default deliverable; single-file is an export.** Present with `pnpm dev`. Build the single file (`pnpm build`, via `vite-plugin-singlefile`) only when the user asks for a portable file. Either way **size is not a concern** — do not trade away a better visualization to save bytes. For the export, inline SVGs/data-URIs survive offline; remote URLs don't, so inline assets you care about.
- **Imports:** `@/` aliases `src/`. shadcn components in `@/components/ui` (add more via the `shadcn` skill/CLI; only Button is scaffolded). Icons: `@tabler/icons-react` (configured) or `lucide-react`.
- **Don't fight the config.** Theme tokens live in `src/index.css`; prefer Tailwind utilities inline over new CSS.

## Reference

- `src/articles/konva-transformer/` — a complete, in-repo article in the exact structure you'll copy: `index.tsx` exporting a `doc`, with its own `visuals/` folder, registered in `src/articles/index.ts`. **Copy this folder as the scaffold for a new article.**
- `references/example-gradient-descent/` — a complete worked demo (the "神经网络是怎么学习的" presentation), the best reference for how `Document` + blocks + custom visuals compose into a finished, ELI5-level piece. **Skim it before building your first presentation** for the *content* craft; its `App.tsx` is an older single-deck layout, so for *structure* copy the article folder above instead (move its `doc` into `src/articles/<id>/index.tsx`).
- `references/blocks.md` — the bundled block components and the `Document` skeleton: every prop and when to use each. Read it in step 4 before writing your article.
- `references/representation-guide.md` — content-type → representation → library decision guide (what to put *inside* `ChartFrame`/`DiagramFrame`). Read it in step 2 (and skim before planning). This is where the real value is.
- `references/DESIGN.md` — the Claude warm-editorial design system (palette, typography, components, spacing, do's & don'ts) that the template theme implements. Consult it for visual specifics.
