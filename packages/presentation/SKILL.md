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

## Audience: junior engineers — bar is "explain like I'm five"

Unless the user says otherwise, write for a **junior engineer** — someone capable but still building their mental models, who hasn't yet internalized the jargon, patterns, or context a senior takes for granted. The clarity bar is **ELI5**: someone should finish each section with an *intuition*, not just a definition. Lead with an analogy or a concrete picture, then layer in the precise version. If a smart newcomer wouldn't get it on first read, it's not done. This shapes every decision about depth and presentation:

- **Explain the "why", not just the "what".** A senior can infer why a decision was made; a junior needs it spelled out. When the content states a choice, surface the reasoning and the alternative that was rejected.
- **Define terms on first use.** Don't assume acronyms, library names, or patterns are known. A one-line gloss (inline, or a small "terms" aside) turns a wall of jargon into something learnable. Link concepts to things they likely *do* know.
- **Build understanding progressively.** Start from the problem and the intuition before the precise/formal version. Order sections so each builds on the last — a junior reading top to bottom should never hit a concept that depends on something not yet introduced.
- **Annotate the visuals.** A chart, diagram, or code block that's obvious to an expert isn't to a junior. Add a caption saying what to notice ("the gap here is the cost we're paying"), label diagram parts, comment the load-bearing lines of code. The visual plus its annotation should teach, not just display.
- **Prefer worked, concrete examples** over abstract description. A junior learns the general rule fastest from a specific instance with real values.
- **Tone:** clear and encouraging, never condescending. The goal is to bring the reader up to speed and leave them able to reason about the topic themselves — not to show off how much the author knows.

This raises the value of step-by-step animations (showing a process unfold is more teachable than a static end-state) and of code annotations — keep that in mind when choosing representations.

## Teach, don't transcribe

The #1 failure mode is **mapping the source 1:1**: keeping the document's headings, order, and terminology, translating it, and bolting a visual onto each section. That produces a *map of the doc*, not a lesson — it reads stiff and explains nothing a newcomer couldn't have gotten from the original.

A source doc is written by someone who already understands it, for a peer; it states conclusions in the author's order and jumps straight to notation. Your job is the opposite: **re-derive the explanation for someone who doesn't know it yet.** That almost always means a *different* structure than the source.

Concretely:

- **Organize around the learner's questions and one concrete motivating problem — not the source's headings.** Open with a relatable goal ("you're building a pannable, zoomable canvas like Figma — how?") and let each section answer the question the previous one raised.
- **Pick one spine analogy and build everything on it.** Make the reader *feel* the intuition before any formalism. Carry the analogy through every later section.
- **Delay the math; earn it.** Never open a section with an equation. Introduce each formula only after the intuition is solid, framed as "the code for an idea you already get." A symbol the reader hasn't been set up for is a wall.
- **Anticipate the exact spot a beginner trips, and address it in their words** ("wait, why the *inverse*?"). The source often buries this; surface it.
- **Use a concrete worked example with real numbers, and let interactive visuals *derive* the idea**, not just illustrate it ("the camera's at (360,320); you click the top-right — where is that in the world? let's compute it").
- **Cut or demote advanced asides the source includes but a beginner doesn't need.** Faithfulness is to the *understanding*, not to the source's table of contents.

**Litmus test:** if your section titles are basically the source's titles translated, you've mapped, not taught — restructure. If a smart newcomer couldn't follow your version *without* the original open beside them, it's not done.

## Output language

Write the presentation's content in **Chinese by default** — titles, prose, captions, callouts, labels, glossary. Keep code, identifiers, math symbols, and established technical terms in their conventional form (English/symbols), glossing them in Chinese on first use where it aids a newcomer. Only switch the output language if the user's source material or request is clearly in another language or they ask for one.

## Workflow

1. **Read and segment the content.** Whether it's a design doc, a conversation, or a dataset, first understand it and break it into the distinct things it's trying to communicate. For an AI conversation specifically: strip the back-and-forth and keep what matters — the decisions reached, the rationale, the final design, key code, the data discussed. The reader wants the conclusions, not the transcript.

2. **Map each piece to a representation.** Using `references/representation-guide.md`, decide how each piece should appear. Note which need a library (chart, diagram, animation, canvas) so you can install them once, together.

3. **Plan the document, show the user.** Fill in the fixed skeleton (see "Stable structure" below): the frontmatter, the ordered list of topic sections, and — for each section — its chosen representation ("§1 the problem → prose + latency bar chart; §2 the idea → analogy prose + 'why' callout; §3 cost → two-col + code"). Show this plan and get a nod. Re-ordering an outline is cheap; rebuilding rendered sections isn't.

4. **Fill the `Document`, don't rebuild it.** Write `src/App.tsx` as a `PresentationDoc` object passed to `<Document doc={...} />` (use `references/example-gradient-descent/App.tsx` as a scaffold). Compose section content from the bundled **blocks** (`Prose`, `Callout`, `ChartFrame`, `CodeBlock`, `Stat`/`StatGrid`, `TwoCol`). For visuals, write the chart/diagram/canvas as a small component and drop it *inside* `ChartFrame`/`DiagramFrame` — install whatever viz library explains it best (`references/representation-guide.md`). **Do not hand-roll the page layout, TOC, section headers, or spacing — the shell owns all of that.** See `references/blocks.md` for every block's API.

5. **Present via the dev server (default).** Run `pnpm dev` and actually look at it (use the `run`/`verify` skill or drive a browser) — charts and animations especially need to be *seen*, not assumed. Iterate until each section truly lands at ELI5 level, then hand the user the local URL as the deliverable. **Only build a single-file HTML when the user explicitly asks** ("export", "give me an html", "a file I can send") — then run `pnpm build` and point them to `dist/index.html`. Don't build by default; the running dev server is the presentation.

## Stable structure: the `Document` shell + blocks

Every presentation uses one fixed skeleton so the output is predictable and consistently good — you supply content, the shell supplies the structure. The shell (`src/components/blocks/Document.tsx`) takes a `PresentationDoc` and always renders, in order:

**Frontmatter cover** (title, subtitle, authors, date, tags, one-line TL;DR) → **sticky-sidebar TOC** (auto-derived from the section titles, with scroll-spy) → **Overview** → **numbered topic sections** → **Summary** → optional **Glossary** / **References**.

You define the document as data in `App.tsx`:

```tsx
const doc: PresentationDoc = {
  frontmatter: { title, subtitle, authors, date, tags, tldr },
  overview: <Prose markdown={`...`} />,
  sections: [{ id, title, intent, content: <>...</> }, ...],  // content is flexible
  summary: <>...</>,
  glossary: [{ term, def }],   // optional
};
// App: return <Document doc={doc} />
```

**What's fixed vs. what varies:** the cover, TOC, section numbering/headers, spacing rhythm, typography, and color are all owned by the shell and blocks — identical across every presentation. Only each section's `content` varies. This is the whole point: stable, on-brand structure; flexible content.

**Hard rule:** never reach around the shell. Don't rebuild the cover/TOC/headers, and don't override block styling via `className` (use it only for layout positioning *inside* a section). If a block seems to be missing for a real need, add it to `src/components/blocks/` as a reusable component rather than one-off styling in a section — that keeps every future presentation consistent.

The blocks lock layout/typography/color; the reader scrolls the long-form document top to bottom, with `ChartFrame`/`DiagramFrame` visuals breaking out as needed. Full block APIs: `references/blocks.md`.

## Design notes

The template's theme **is** the Claude warm-editorial design system from `references/DESIGN.md` — a tinted cream canvas, coral primary, dark navy surfaces, slab-serif display + humanist sans. It's already wired into the theme tokens in `src/index.css`, so using the tokens (below) automatically lands on-brand. Read `references/DESIGN.md` when you need specifics: exact surface roles, component treatments, spacing rhythm, do's & don'ts. Lean on it:

- **Typography first.** Headings in `font-heading` (Cormorant Garamond — a literary slab-serif; pair with `tracking-tight`), body in the default sans (Inter), code in `font-mono` (JetBrains Mono). Cap prose width (`max-w-2xl`/`prose`-like) so lines stay readable; let visuals break wider.
- **Theme tokens, not raw colors.** `bg-background`/`text-foreground`, `text-muted-foreground` for secondary, `text-primary` for accent, and the `chart-1..5` vars as a ready-made categorical palette for charts (so charts match the deck). Avoid hardcoded hex / `text-gray-500`.
- **Let the visuals carry weight.** A well-chosen chart or diagram earns full width and breathing room. Don't bury it in a cramped column.
- **Restraint.** Reach for animation/canvas when the content genuinely needs it, not for spectacle. A static chart that's instantly readable beats an animated one that distracts.

## Notes on the stack

- **Dev server is the default deliverable; single-file is an export.** Present with `pnpm dev`. Build the single file (`pnpm build`, via `vite-plugin-singlefile`) only when the user asks for a portable file. Either way **size is not a concern** — do not trade away a better visualization to save bytes. For the export, inline SVGs/data-URIs survive offline; remote URLs don't, so inline assets you care about.
- **Imports:** `@/` aliases `src/`. shadcn components in `@/components/ui` (add more via the `shadcn` skill/CLI; only Button is scaffolded). Icons: `@tabler/icons-react` (configured) or `lucide-react`.
- **Don't fight the config.** Theme tokens live in `src/index.css`; prefer Tailwind utilities inline over new CSS.

## Reference

- `references/example-gradient-descent/` — a complete worked demo (the "神经网络是怎么学习的" presentation). The best reference for how `Document` + blocks + custom visuals compose into a finished, ELI5-level piece. Skim it before building your first presentation; it's also the package's default `src/App.tsx`, so `pnpm dev` runs it.
- `references/blocks.md` — the bundled block components and the `Document` skeleton: every prop and when to use each. Read it in step 4 before writing `App.tsx`.
- `references/representation-guide.md` — content-type → representation → library decision guide (what to put *inside* `ChartFrame`/`DiagramFrame`). Read it in step 2 (and skim before planning). This is where the real value is.
- `references/DESIGN.md` — the Claude warm-editorial design system (palette, typography, components, spacing, do's & don'ts) that the template theme implements. Consult it for visual specifics.
