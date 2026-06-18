import { useState } from 'react';

// Teach §2 (the showpiece): a utility class is just a token's OUTLET. You register
// ONE `--color-*` token in @theme; Tailwind's engine manufactures a whole family
// of utilities (bg- / text- / border- / ring- ...) all pointing at it. Change the
// registered value and every generated utility — and everything using them —
// updates at once. This is "feed the engine a token, it stamps out the sockets".

const swatches = ['#cc785c', '#5db8a6', '#6d28d9', '#e8a55a', '#2563eb'];

const utils: { cls: string; demo: (c: string) => React.CSSProperties }[] = [
  { cls: 'bg-brand', demo: (c) => ({ background: c, color: '#fff' }) },
  { cls: 'text-brand', demo: (c) => ({ color: c, fontWeight: 600 }) },
  { cls: 'border-brand', demo: (c) => ({ border: `2px solid ${c}` }) },
  { cls: 'ring-brand', demo: (c) => ({ boxShadow: `0 0 0 3px ${c}` }) },
];

export function UtilityGenerator() {
  const [color, setColor] = useState('#cc785c');

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="text-muted-foreground">你登记的值</span>
        {swatches.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={'h-7 w-7 rounded-full border border-border ' + (color === c ? 'ring-2 ring-foreground ring-offset-2' : '')}
            style={{ background: c }}
          />
        ))}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-7 w-10 cursor-pointer rounded border border-border bg-transparent"
        />
        <span className="font-mono text-xs">{color}</span>
      </div>

      {/* step 1: you write exactly this one line */}
      <div className="rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs leading-relaxed">
        <span className="text-muted-foreground">@theme {'{'}</span>
        <div className="pl-4">
          --color-brand: <span style={{ color }}>{color}</span>;
        </div>
        <span className="text-muted-foreground">{'}'}</span>
      </div>

      <div className="my-3 text-center text-sm text-muted-foreground">↓ Tailwind 引擎自动生成这一整套 utility ↓</div>

      {/* step 2: the engine manufactures the whole family */}
      <div className="grid gap-2 sm:grid-cols-2">
        {utils.map((u) => (
          <div key={u.cls} className="flex items-center gap-3 rounded-lg border border-border p-3">
            <span className="font-mono text-xs">{u.cls}</span>
            <span className="ml-auto grid h-9 w-9 place-items-center rounded-md bg-background text-xs" style={u.demo(color)}>
              Aa
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        ……还有 <span className="font-mono">fill-brand</span>、<span className="font-mono">stroke-brand</span>、
        <span className="font-mono">divide-brand</span>……一个 token,一整面墙的插座。Tailwind 不自带 <span className="font-mono">brand</span> 这个名字——
        是你登记后,它替你造出来的。
      </p>
    </div>
  );
}
