# Representation Guide

The job of this skill is to render each piece of content in the form that makes it fastest to understand. This guide maps **content type → representation → library**, with the single-file-build weight in mind. Read the relevant sections when planning a presentation.

## Contents

- [Choosing principle](#choosing-principle)
- [Library cheat-sheet](#library-cheat-sheet)
- [Prose, decisions, narrative](#prose-decisions-narrative)
- [Code and diffs](#code-and-diffs)
- [Quantitative data → charts](#quantitative-data--charts)
- [Relationships, architecture, flow → diagrams](#relationships-architecture-flow--diagrams)
- [Time, process, sequence → animation](#time-process-sequence--animation)
- [Spatial, coordinate systems, simulation → canvas](#spatial-coordinate-systems-simulation--canvas)
- [Math and formulas](#math-and-formulas)
- [Tabular data](#tabular-data)
- [Maps and geospatial](#maps-and-geospatial)
- [Theming visuals to match the deck](#theming-visuals-to-match-the-deck)

## Choosing principle

The single goal is **make the idea click for someone seeing it for the first time** — explain-like-I'm-five clarity. Three rules:

1. **Pick the representation that explains it best — full stop.** If an animation, an interactive canvas, or a 3D scene makes the concept land faster than a static image, use it. **Artifact size, bundle weight, and dependency count are NOT considerations** — never choose a weaker representation to save kilobytes. The only question is "what makes this clearest to a novice?"
2. **Earn richness with understanding, not spectacle.** A richer form is right when it genuinely teaches better: an animation that reveals a process beats a static diagram that hides it. But a static chart that lands instantly beats a fancy animation that distracts. Judge every choice by *understanding gained*, not by how impressive it looks.
3. **Match the theme.** Every visual should use the deck's color tokens (see [Theming](#theming-visuals-to-match-the-deck)) so charts, diagrams, and canvases feel like part of one document, not embedded screenshots.

When in doubt, reach for the form that best builds intuition — analogy, worked example, annotated visual, step-by-step reveal — even if it's more work to build.

## Library cheat-sheet

| Need | Reach for | Install | Weight | Notes |
|------|-----------|---------|--------|-------|
| Charts (standard) | **Recharts** (+ shadcn chart wrapper) | `pnpm add recharts` | medium | SVG, declarative, themes cleanly. The default. |
| Charts (bespoke/novel) | **D3** | `pnpm add d3 @types/d3` | medium | Full control; use when Recharts can't express it. |
| Charts (rich presets) | **visx** or **nivo** | `pnpm add @visx/visx` | medium–heavy | visx = d3+React primitives; nivo = batteries-included. |
| Diagrams from text | **Mermaid** | `pnpm add mermaid` | heavy | Flowcharts/sequence/ER from a string. Quick, but bulky. |
| Interactive node graphs | **React Flow** | `pnpm add @xyflow/react` | medium | Pannable/zoomable nodes & edges. |
| Animation / transitions | **Motion** (Framer Motion) | `pnpm add motion` | light–medium | Reveals, transitions, scroll-linked. The default for motion. |
| Scroll-triggered reveal | **react-intersection-observer** | `pnpm add react-intersection-observer` | light | Fire animations as sections enter view. |
| 2D canvas / many sprites | **Pixi + pixi-react** | `pnpm add pixi.js @pixi/react` | heavy | WebGL 2D; thousands of elements, particle/sim. |
| 3D | **react-three-fiber** + drei | `pnpm add three @react-three/fiber @react-three/drei` | heavy | Declarative three.js. |
| Code highlighting | **Shiki** | `pnpm add shiki` | medium–heavy | Editor-grade (VS Code grammars + themes). Import only the langs/themes you use to keep the single file lean. |
| Math | **KaTeX** (bundled `M`/`Equation`) | `pnpm add katex` | medium | Fast LaTeX. Use the bundled components, not `react-katex` (it strips braces). |
| Tables (rich) | **TanStack Table** | `pnpm add @tanstack/react-table` | medium | Sorting/grouping; pair with shadcn table styles. |
| Maps | **MapLibre** / **deck.gl** | `pnpm add maplibre-gl` | heavy | Only when geography is the point; needs tile data. |
| Lottie animation | **lottie-react** | `pnpm add lottie-react` | medium | Pre-made vector animations from JSON. |

The "Weight" column is **informational only** — it is *not* a selection criterion. Output size doesn't matter here; choose by which tool best explains the idea (see [Choosing principle](#choosing-principle)).

## Prose, decisions, narrative

Most of a design doc or conversation summary is prose: claims, rationale, decisions, trade-offs. This needs no library — it needs **typography and hierarchy**.

- Use a constrained reading column (`max-w-2xl` to `max-w-3xl`), generous line height, clear heading scale (`font-heading` for headings).
- **Pull the signal out of the noise.** From a conversation, surface the decision and the why; drop the deliberation. Use callout boxes for the things that matter most.
- **Callouts / asides:** a bordered or tinted box (`border-l-4 border-primary pl-4`, or a shadcn `Card`) for "Decision", "Trade-off", "Open question", "Why". These let a skimmer find the load-bearing points.
- **Lead with the takeaway.** Each section's first line should state the conclusion; details follow for those who want them.

A clean, well-typeset long-form doc is often the *right* answer — don't reach for visualization where plain prose communicates best.

## Code and diffs

- **Snippets:** use the bundled **`CodeBlock`** component — it wraps **Shiki** (full bundle, so any language just works) with dual light/dark themes wired to the deck's mode. Pass `code`, `lang`, optional `filename`, and a `caption` that explains the load-bearing lines. Editor-accurate highlighting, zero setup.
- **What changed:** when the point is a change, show a **diff** (added/removed lines tinted green/red), not two full blocks. Even a hand-rolled diff view (lines with `bg-green-500/10` / `bg-red-500/10`) beats making the reader spot the difference.
- Keep snippets short — show the load-bearing lines, elide the rest with `// ...`.

## Quantitative data → charts

The moment content includes numbers that compare, trend, distribute, or break down, a chart usually beats prose or a table.

**Default to Recharts**, ideally via the shadcn chart wrapper (`ChartContainer`/`ChartTooltip`) since this template is shadcn — it wires the chart palette to the theme's `chart-1..5` tokens automatically.

Pick the chart by the question being answered:

| The data answers… | Use |
|-------------------|-----|
| "how do these categories compare?" | bar chart |
| "how did this change over time?" | line / area chart |
| "what's the trend + magnitude?" | area chart |
| "what's the composition of a whole?" | stacked bar (prefer over pie for >3 parts) |
| "how are two variables related?" | scatter |
| "where does a value sit in a range?" | a single big number + a small context bar |

Minimal Recharts pattern:

```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Before', value: 48 },
  { name: 'After', value: 12 },
];

export function DeployTimeChart() {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="name" className="text-muted-foreground" />
          <YAxis className="text-muted-foreground" />
          <Tooltip />
          <Bar dataKey="value" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

**Escalate to D3** only for chart types Recharts doesn't cover well: chord/sankey diagrams, force-directed layouts, custom radial/hierarchical layouts, hexbins. With D3, typically use it for *layout/scales* and let React render the SVG elements (`d3-scale`, `d3-shape` for the math; JSX for the DOM) rather than letting D3 mutate the DOM — it composes better with React.

Always: one clear message per chart, a title that states the takeaway, axis labels, and theme colors.

## Relationships, architecture, flow → diagrams

For architecture, data flow, state machines, dependency graphs, sequences:

- **Mermaid** when you can express it as text and want it fast (flowchart, sequence, ER, state). One string → a diagram. It's heavy, so prefer it when there are several diagrams (amortizes the weight) or when authoring speed matters. Theme it via Mermaid's `themeVariables` to the deck colors.
- **React Flow (`@xyflow/react`)** when the diagram should be **interactive** (pan/zoom/expandable nodes) or when you want full control over node rendering (custom React components as nodes). Heavier authoring, lighter runtime than Mermaid.
- For a *simple* box-and-arrow (3–6 nodes), plain divs + an SVG line layer, or even a CSS grid with arrows, can beat pulling in a library. Don't import a graph engine to draw three boxes.

## Time, process, sequence → animation

When the content *is* a sequence — a request lifecycle, an algorithm's steps, a before→after transformation, a timeline — motion can make the order legible in a way static layout can't.

- **Motion (Framer Motion)** is the default. Use it for: staged reveals (`whileInView` + `staggerChildren`), transitions between states, animated number counters, and morphing layouts (`layout` prop).
- **Scroll-driven storytelling ("scrollytelling"):** tie steps to scroll position so the reader advances a process by scrolling. `react-intersection-observer` (fire a step when a marker enters view) or Motion's `useScroll`. Great for "walk me through how X works".
- **Animated charts:** Recharts animates on mount; for step-through (reveal series one at a time) drive the data with state + Motion.
- **Lottie** (`lottie-react`) for polished pre-made vector animations (loading, success, illustrative loops) when you have or can get the JSON.
- **Video** is the right call only for real captured footage (a screen recording, a demo). Don't render synthetic motion as a video file when components can do it live and crisply.

Restraint matters most here: animate to *explain sequence*, and keep it skippable/non-looping-distracting. Respect `prefers-reduced-motion`.

## Spatial, coordinate systems, simulation → canvas

When you have a genuine coordinate space, lots of elements, or a simulation, the DOM/SVG stops being the right substrate:

- **Pixi + pixi-react** (`pixi.js` + `@pixi/react`) for **2D at scale**: thousands of points/sprites, particle systems, real-time interaction, custom coordinate systems (e.g. plotting 50k points, a live force simulation, a spatial map of embeddings). WebGL keeps it smooth where SVG would stutter past a few hundred nodes.
- **react-three-fiber** (+ `@react-three/drei`) for genuine **3D**: surfaces, 3D scatter, spatial structures, anything with depth. Declarative three.js that fits React.
- **Raw `<canvas>`** for a one-off custom 2D drawing that's simple but not a charting case (a custom gauge, a generative background) — no library needed.

These are heavy and interaction-rich; reserve them for content that truly lives in space or has too many elements for SVG. A scatter of 40 points is Recharts, not Pixi. A scatter of 40,000 is Pixi.

## Math and formulas

Use **KaTeX** for any real mathematical notation. Use the **bundled `M` (inline) and `Equation` (block) components** from `@/components/visuals/Math` — they call `katex.renderToString` directly. Pass the LaTeX with `String.raw` so backslashes survive: `<Equation>{String.raw\`w_{\text{new}} = w - \eta\,\frac{\partial L}{\partial w}\`}</Equation>`. **Don't use `react-katex`** — it strips `{}` and breaks fractions/subscripts. Don't fake formulas with Unicode/HTML when there's actual math.

## Tabular data

Sometimes a table *is* the right form (exact values, lookup, many columns):

- For a static, modest table, plain HTML with the shadcn table styles is enough and weightless.
- For sorting/filtering/grouping or many rows, **TanStack Table** (`@tanstack/react-table`) handles the logic; style with shadcn.
- But ask first whether the reader wants *the shape* (→ chart) or *the values* (→ table). Don't show a 20-row table when a bar chart answers the actual question.

## Maps and geospatial

Only when geography is the point (locations, regions, routes):

- **MapLibre GL** for slippy maps; **deck.gl** for large geospatial data layers over a map.
- Both need tile/data sources and are heavy — confirm it's worth it. For a simple "where" with a handful of points, a static SVG map or a labeled image may suffice and stays in the single file.

## Theming visuals to match the deck

Every visual should read as part of the document. The template exposes its palette as CSS variables (`src/index.css`):

- **Categorical series:** `var(--chart-1)` … `var(--chart-5)` — a coordinated ramp meant exactly for this.
- **Single accent:** `var(--primary)`; **grid/axes/borders:** `var(--border)`; **secondary text/labels:** `var(--muted-foreground)`; **surface:** `var(--background)` / `var(--card)`.
- In Recharts use them directly: `fill="var(--chart-1)"`, `stroke="var(--border)"`. In Mermaid pass them through `themeVariables`. In Pixi/three, read them once (`getComputedStyle(document.documentElement).getPropertyValue('--chart-1')`) and convert to the numeric color the engine wants.
- This also means visuals follow light/dark automatically, since the tokens do.

Pulling color from the theme — instead of hardcoding `#3b82f6` — is the single biggest thing that makes generated visuals look like they belong.
