import type { ReactNode } from 'react';

type Tone = 'decision' | 'why' | 'note' | 'warning' | 'tradeoff';

const TONES: Record<Tone, { label: string; bar: string; tint: string }> = {
  decision: { label: 'Decision', bar: 'border-primary', tint: 'bg-primary/5' },
  why: { label: 'Why', bar: 'border-chart-2', tint: 'bg-chart-2/5' },
  note: { label: 'Note', bar: 'border-muted-foreground', tint: 'bg-muted/40' },
  warning: { label: 'Watch out', bar: 'border-chart-3', tint: 'bg-chart-3/10' },
  tradeoff: { label: 'Trade-off', bar: 'border-chart-4', tint: 'bg-chart-4/5' },
};

/**
 * A labelled aside that pulls the load-bearing point out of the flow — the
 * decision, the rationale, the gotcha. For a junior reader these are the
 * signposts that make a doc learnable. `title` overrides the default tone label.
 */
export function Callout({
  tone = 'note',
  title,
  children,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
}) {
  const t = TONES[tone];
  return (
    <div className={`my-6 rounded-lg border-l-4 ${t.bar} ${t.tint} px-5 py-4`}>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title ?? t.label}
      </p>
      <div className="text-base leading-relaxed text-foreground/90">{children}</div>
    </div>
  );
}
