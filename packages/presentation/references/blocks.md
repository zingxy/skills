# Blocks Reference

The bundled components in `src/components/blocks/` — import everything from `@/components/blocks`. The `Document` shell owns the page structure; the rest are content blocks you place inside section `content`. Styling, spacing, typography, and color are fixed and on-brand: **fill these with content, don't restyle them.**

## `Document` — the shell

Renders the whole stable skeleton from a single data object. **You don't call this yourself** — you export a `doc: PresentationDoc` from `src/articles/<id>/index.tsx` and register it in `src/articles/index.ts`; `App.tsx` (the home/index) renders `<Document doc={doc} onBack={...} />` for the selected article. The optional `onBack` prop adds a "← back to index" link in the TOC sidebar; the home page wires it up.

```ts
interface PresentationDoc {
  frontmatter: {
    title: string;
    subtitle?: string;
    authors?: string[];
    date?: string;
    tags?: string[];
    tldr?: string;        // one-line gist, shown on the cover
  };
  overview: ReactNode;    // required — TL;DR / key takeaways up front
  sections: {
    id: string;           // kebab-case anchor for the TOC
    title: string;
    intent?: string;      // one-line "what this section covers"
    content: ReactNode;   // the flexible part — compose from blocks below
  }[];
  summary: ReactNode;     // required — closing takeaways
  glossary?: { term: string; def: ReactNode }[];  // optional, great for ELI5
  references?: ReactNode; // optional appendix
}
```

The shell auto-builds the sticky TOC (with scroll-spy) and numbers the sections — never build those yourself.

## `Prose` — themed long-form text

Markdown in, on-brand typography out. Use for all running prose.

```tsx
<Prose markdown={`Lead with the intuition. Then the detail.

- supports **bold**, *italics*, lists, links
- \`inline code\`, blockquotes, tables (GFM)`} />
```

Renders `h3`/`h4` for sub-structure inside a section (the section's own `h2` is the shell's). For highlighted multi-line code, use `CodeBlock` instead of a fenced block.

## `Callout` — labelled aside

Pulls the load-bearing point out of the flow — the signposts that make a doc learnable.

```tsx
<Callout tone="why" title="Why a B-tree, not a hash?">
  Hashes can't do ranges; B-trees keep order, so range + sort ride the same structure.
</Callout>
```

- `tone`: `'decision' | 'why' | 'note' | 'warning' | 'tradeoff'` (default `note`). Each has a themed color and a default label.
- `title?`: overrides the default tone label.

Reach for these often for a junior audience: state the **decision**, the **why**, the **trade-off**, the **gotcha**.

## `ChartFrame` / `DiagramFrame` — visual wrapper

A stable titled frame around any visual. The frame is fixed; the child is your custom chart/diagram/canvas. The **caption is where you teach** — say what to notice.

```tsx
<ChartFrame title="Lookup latency: 10M rows"
            caption="Notice it's not a little slower — it's ~40× slower. That gap is what the index buys back.">
  <LatencyChart />   {/* your Recharts/D3/Pixi component */}
</ChartFrame>
```

`DiagramFrame` is the same component, named for intent. See `representation-guide.md` for what to put inside.

## `Stat` / `StatGrid` — headline figures

```tsx
<StatGrid>
  <Stat value="O(log n)" caption="indexed lookup vs O(n) scan" />
  <Stat value="~40×" caption="faster reads in our example" />
</StatGrid>
```

`StatGrid` lays 2–4 `Stat`s in a responsive row. Always give a `caption` — a number without meaning teaches nothing.

## `TwoCol` — side-by-side

Compare / before-after. Stacks on small screens.

```tsx
<TwoCol leftLabel="What you gain" rightLabel="What you pay"
        left={<p>O(log n) lookups.</p>}
        right={<p>Every write maintains the index.</p>} />
```

## `CodeBlock` — highlighted code

Shiki highlighting (any language), dual light/dark themes wired to the deck. Annotate with `caption`.

```tsx
<CodeBlock
  lang="sql"
  filename="add_index.sql"
  code={`CREATE INDEX idx_users_email ON users (email);`}
  caption="Index the columns you filter/join/sort on often — not every column."
/>
```

- `code` (required), `lang` (default `tsx`), `filename?`, `caption?`.

## Adding a new block

If a genuine, reusable need isn't covered, add a component to `src/components/blocks/`, export it from `index.ts`, and document it here — so every future presentation gets it too. Don't solve it with one-off `className` styling in a section; that's how output drifts.
