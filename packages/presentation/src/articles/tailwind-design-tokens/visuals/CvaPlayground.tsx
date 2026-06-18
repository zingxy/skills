import { useState } from 'react';

// Teach §5: the component tier, in frontend, is a COMPOSITION of semantic
// utilities — and CVA is the little tool that manages "which utilities for which
// variant". Pick a variant + size, watch the className string assemble and the
// real button update. No new tokens are minted; the component just plugs into the
// system-layer outlets (bg-primary, text-primary-foreground…) shadcn defined.

const variants = {
  default: 'bg-primary text-primary-foreground',
  destructive: 'bg-destructive text-white',
  outline: 'border border-border bg-background text-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
} as const;
const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-4 text-sm',
  lg: 'h-11 px-6 text-base',
} as const;
type V = keyof typeof variants;
type S = keyof typeof sizes;

export function CvaPlayground() {
  const [v, setV] = useState<V>('default');
  const [s, setS] = useState<S>('md');
  const base = 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors';
  const cls = `${base} ${variants[v]} ${sizes[s]}`;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-x-6 gap-y-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">variant</span>
          {(Object.keys(variants) as V[]).map((k) => (
            <button
              key={k}
              onClick={() => setV(k)}
              className={'rounded-md px-2.5 py-1 font-mono text-xs ' + (v === k ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground')}
            >
              {k}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">size</span>
          {(Object.keys(sizes) as S[]).map((k) => (
            <button
              key={k}
              onClick={() => setS(k)}
              className={'rounded-md px-2.5 py-1 font-mono text-xs ' + (s === k ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground')}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="grid place-items-center rounded-xl border border-border bg-muted/30 py-10">
        <button className={cls}>保存习惯</button>
      </div>

      <div className="mt-3 rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs leading-relaxed">
        <span className="text-muted-foreground">{'// CVA 把你选的 variant + size 拼成一串语义 utility（component 层 = 组合本身）'}</span>
        <div className="mt-1 break-words">className="{cls}"</div>
      </div>
    </div>
  );
}
