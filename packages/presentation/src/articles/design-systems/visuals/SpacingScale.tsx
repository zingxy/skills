import { useState } from 'react';

// Teach §3: foundations are invisible RULES, not pixels. A spacing system is a
// base unit × a small set of multipliers; a type scale is a base size × a ratio.
// Change the rule and watch every spacer, every text size, and a mini UI all
// re-derive together. THIS is why you start a design system from the bottom.

const STEPS = [1, 2, 3, 4, 6, 8]; // spacing multipliers → space/1 … space/8

export function SpacingScale() {
  const [base, setBase] = useState(8); // base unit (px)
  const [typeBase, setTypeBase] = useState(16); // body size (px)
  const [ratio, setRatio] = useState(1.25); // type scale ratio

  const space = (m: number) => base * m;
  const typeScale = [
    { name: 'body', n: 0 },
    { name: 'title', n: 1 },
    { name: 'heading', n: 2 },
    { name: 'display', n: 3 },
  ].map((t) => ({ ...t, px: Math.round(typeBase * Math.pow(ratio, t.n)) }));

  return (
    <div>
      {/* controls */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">base 单位</span>
          {[4, 8].map((b) => (
            <button key={b} onClick={() => setBase(b)}
              className={'rounded-md px-3 py-1 font-mono ' + (base === b ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground')}>
              {b}px
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="w-20 text-muted-foreground">字号 base</span>
          <input type="range" min={14} max={18} step={1} value={typeBase}
            onChange={(e) => setTypeBase(Number(e.target.value))} className="flex-1 accent-[var(--primary)]" />
          <span className="w-10 text-right font-mono">{typeBase}px</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="w-20 text-muted-foreground">字阶 ratio</span>
          <input type="range" min={1.1} max={1.5} step={0.025} value={ratio}
            onChange={(e) => setRatio(Number(e.target.value))} className="flex-1 accent-[var(--primary)]" />
          <span className="w-10 text-right font-mono">{ratio.toFixed(3)}</span>
        </label>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr_minmax(0,0.9fr)]">
        {/* spacing ramp */}
        <div className="rounded-lg border border-border p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Spacing 刻度</p>
          <div className="space-y-2">
            {STEPS.map((m) => (
              <div key={m} className="flex items-center gap-3">
                <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">space/{m}</span>
                <div className="h-3 rounded-sm bg-[var(--chart-1)]" style={{ width: space(m) }} />
                <span className="font-mono text-xs">{space(m)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* type scale */}
        <div className="rounded-lg border border-border p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Type 刻度</p>
          <div className="space-y-2">
            {typeScale.map((t) => (
              <div key={t.name} className="flex items-baseline gap-3">
                <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">{t.name}</span>
                <span className="truncate font-heading leading-none" style={{ fontSize: t.px }}>Aa 文字</span>
                <span className="ml-auto font-mono text-xs">{t.px}px</span>
              </div>
            ))}
          </div>
        </div>

        {/* live mini UI that consumes the tokens */}
        <div className="rounded-lg border border-border p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">用这套 token 拼出来的卡片</p>
          <div className="rounded-lg bg-card" style={{ padding: space(3) }}>
            <div style={{ fontSize: typeScale[2].px, lineHeight: 1.1 }} className="font-heading">每日习惯</div>
            <div style={{ height: space(2) }} />
            <div style={{ fontSize: typeScale[0].px }} className="text-muted-foreground">坚持 21 天,养成一个新习惯。</div>
            <div style={{ height: space(3) }} />
            <button className="rounded-md bg-primary font-medium text-primary-foreground"
              style={{ fontSize: typeScale[0].px, padding: `${space(1)}px ${space(2)}px` }}>
              开始
            </button>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        拖动滑块:你没有逐个去改卡片里的数字,只动了<strong className="text-foreground">两条规则</strong>(base 单位、字阶 ratio),
        spacing、字号、整张卡片就一起重排了。这就是"先定看不见的规则、再谈按钮长什么样"的意义。
      </p>
    </div>
  );
}
