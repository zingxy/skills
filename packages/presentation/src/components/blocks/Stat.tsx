import type { ReactNode } from 'react';

/** A single headline figure with a caption that gives it meaning. */
export function Stat({ value, caption }: { value: ReactNode; caption: ReactNode }) {
  return (
    <div>
      <div className="font-heading text-5xl leading-none tracking-tight text-primary md:text-6xl">
        {value}
      </div>
      <p className="mt-3 text-base text-muted-foreground">{caption}</p>
    </div>
  );
}

/** 2–4 stats in a row; collapses on small screens. */
export function StatGrid({ children }: { children: ReactNode }) {
  return <div className="my-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}
