# Demo: 神经网络是怎么学习的 (Gradient Descent)

A complete, worked presentation built with this skill — the reference example for what a finished piece looks like and how the pieces fit together. It explains gradient descent at ELI5 level for a junior-engineer audience, in Chinese.

## What it demonstrates

- **The `Document` skeleton** — frontmatter cover, auto sticky TOC, Overview, numbered sections, Summary, Glossary — driven by a single `PresentationDoc` object (`App.tsx`).
- **Every content block** — `Prose` (markdown), `Callout` (note/why/warning/tradeoff), `ChartFrame`/`DiagramFrame`, `Stat`/`StatGrid`, `CodeBlock` (Shiki).
- **Custom visuals dropped into frames** (`visuals/`), one per "best representation" choice:
  - `GradientDescent1D.tsx` — an **interactive, animated** ball rolling down a loss curve with a learning-rate slider (the showpiece; motion + SVG).
  - `NetworkDiagram.tsx` — an SVG network with **animated** forward-flow pulses (motion).
  - `LossCurve.tsx` — a **Recharts** line chart, themed to the deck.
  - `Math.tsx` — **KaTeX** via `katex.renderToString` (inline `M` + block `Equation`).
- **Form follows content** — analogy-first prose, a chart for the latency gap, animation for the *process* of descent, math for the rule, code for the loop. Each section aims to leave the reader with an intuition, not just a definition.

## Running it

This is a reference example, not the live entry point — `src/App.tsx` ships as a minimal placeholder. To preview *this* example, copy its `App.tsx` (and `visuals/`) over `src/App.tsx`, then from `packages/presentation`:

```
pnpm dev
```

Then open the local URL. Drag the §02 learning-rate slider past 1.0 to see the ball overshoot and diverge.

## Using it as a starting point

When you author a new presentation you'll replace `src/App.tsx`. Copy this `App.tsx` as a scaffold, swap in your own `frontmatter` / `sections`, and build your own visuals in `src/components/visuals/` (drop them inside `ChartFrame`/`DiagramFrame`). The blocks and the `Document` shell stay as they are.
