# Demo: 神经网络是怎么学习的 (Gradient Descent)

A complete, worked presentation built with this skill — the reference example for what a finished piece looks like and how the pieces fit together. It explains gradient descent at ELI5 level for a junior-engineer audience, in Chinese.

## What it demonstrates

- **The `Document` skeleton** — frontmatter cover, auto sticky TOC, Overview, numbered sections, Summary, Glossary — driven by a single `PresentationDoc` object (`App.tsx` here, since this folder predates the `src/articles/` layout; a new article exports the same `doc` from `src/articles/<id>/index.tsx`).
- **Every content block** — `Prose` (markdown), `Callout` (note/why/warning/tradeoff), `ChartFrame`/`DiagramFrame`, `Stat`/`StatGrid`, `CodeBlock` (Shiki).
- **Custom visuals dropped into frames** (`visuals/`), one per "best representation" choice:
  - `GradientDescent1D.tsx` — an **interactive, animated** ball rolling down a loss curve with a learning-rate slider (the showpiece; motion + SVG).
  - `NetworkDiagram.tsx` — an SVG network with **animated** forward-flow pulses (motion).
  - `LossCurve.tsx` — a **Recharts** line chart, themed to the deck.
  - `Math.tsx` — **KaTeX** via `katex.renderToString` (inline `M` + block `Equation`).
- **Form follows content** — analogy-first prose, a chart for the latency gap, animation for the *process* of descent, math for the rule, code for the loop. Each section aims to leave the reader with an intuition, not just a definition.

## Running it

This is a reference example, not a live article. To preview it, drop it into the `src/articles/` layout: make `src/articles/gradient-descent/index.tsx` that `export const doc = { ... }` (the object in this `App.tsx`), copy `visuals/` alongside it, register `{ id: 'gradient-descent', doc }` in `src/articles/index.ts`, then from `packages/presentation`:

```
pnpm dev
```

Open the local URL, click the article from the home page. Drag the §02 learning-rate slider past 1.0 to see the ball overshoot and diverge.

## Using it as a starting point

When you author a new presentation, create a **self-contained article** at `src/articles/<id>/index.tsx` that **exports** `const doc: PresentationDoc`, keep its visuals inside that folder, and register it in `src/articles/index.ts`. **Don't edit `App.tsx`** (it's the home/index). For the exact folder structure, copy `src/articles/konva-transformer/`; the blocks and the `Document` shell stay as they are.
