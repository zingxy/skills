import type { ReactNode } from 'react';

/** Two side-by-side columns (compare / before-after). Stacks on small screens. */
export function TwoCol({
  left,
  right,
  leftLabel,
  rightLabel,
}: {
  left: ReactNode;
  right: ReactNode;
  leftLabel?: string;
  rightLabel?: string;
}) {
  return (
    <div className="my-8 grid gap-8 md:grid-cols-2">
      <div>
        {leftLabel && (
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {leftLabel}
          </p>
        )}
        <div className="text-base leading-relaxed text-foreground/90">{left}</div>
      </div>
      <div>
        {rightLabel && (
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {rightLabel}
          </p>
        )}
        <div className="text-base leading-relaxed text-foreground/90">{right}</div>
      </div>
    </div>
  );
}
