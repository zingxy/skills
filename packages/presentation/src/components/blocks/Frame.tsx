import type { ReactNode } from 'react';

/**
 * A stable frame for a visual (chart, diagram, canvas). The frame — title,
 * surface, spacing, and the caption that tells the reader what to notice — is
 * fixed and on-brand; only the `children` (the actual visual) vary. The caption
 * is where you do the teaching: "notice the gap here is the cost we pay".
 */
export function ChartFrame({
  title,
  caption,
  children,
}: {
  title?: string;
  caption?: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className="my-8">
      {title && <figcaption className="mb-3 text-sm font-medium text-foreground">{title}</figcaption>}
      <div className="rounded-xl border border-border bg-card p-5">{children}</div>
      {caption && <figcaption className="mt-3 text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

/** Same framing for diagrams / schematics. Alias kept distinct for intent. */
export const DiagramFrame = ChartFrame;
