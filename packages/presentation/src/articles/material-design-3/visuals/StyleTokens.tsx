import { useState } from 'react';

// Teach §5: color isn't the only thing tokenized. Shape, type, elevation and
// motion are all token scales too. Four small tabs to feel each one.

const tabs = ['Shape', 'Type', 'Elevation', 'Motion'] as const;
type Tab = (typeof tabs)[number];

const shapes = [
  ['none', 0], ['xs', 4], ['sm', 8], ['md', 12], ['lg', 16], ['xl', 28], ['full', 9999],
] as const;

const typeScale = [
  ['display-large', 57, 400], ['headline-medium', 28, 400],
  ['title-large', 22, 500], ['body-large', 16, 400], ['label-large', 14, 500],
] as const;

const durations = [['short', 200], ['medium', 400], ['long', 600]] as const;

export function StyleTokens() {
  const [tab, setTab] = useState<Tab>('Shape');
  const [at, setAt] = useState(false);
  const [dur, setDur] = useState(400);

  return (
    <div>
      <div className="mb-5 flex gap-2">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={'rounded-md px-3 py-1.5 text-sm ' + (tab === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground')}>
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        {tab === 'Shape' && (
          <>
            <div className="flex flex-wrap items-end gap-4">
              {shapes.map(([name, r]) => (
                <div key={name} className="text-center">
                  <div className="h-16 w-16 bg-[var(--chart-1)]" style={{ borderRadius: r }} />
                  <div className="mt-2 font-mono text-[11px] text-muted-foreground">{name}<br />{r === 9999 ? '∞' : r}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">shape scale:从 none 到 full 的一组圆角 token。组件按角色取(如 FAB 用 lg、chip 用 sm),而不是各写各的圆角。</p>
          </>
        )}

        {tab === 'Type' && (
          <>
            <div className="space-y-2">
              {typeScale.map(([name, px, w]) => (
                <div key={name} className="flex items-baseline gap-3">
                  <span className="w-36 shrink-0 font-mono text-xs text-muted-foreground">{name}</span>
                  <span style={{ fontSize: px, fontWeight: w, lineHeight: 1.1 }} className="truncate">每日习惯 Aa</span>
                  <span className="ml-auto font-mono text-xs text-muted-foreground">{px}px</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">type scale:按角色(display / headline / title / body / label,各分 large/medium/small)命名,而非按 px。换字体只改 token,层级关系不变。</p>
          </>
        )}

        {tab === 'Elevation' && (
          <>
            <div className="flex flex-wrap items-center gap-5 rounded-lg bg-[var(--muted)] p-5">
              {[0, 1, 2, 3, 4, 5].map((lvl) => (
                <div key={lvl} className="grid h-16 w-16 place-items-center rounded-xl text-xs font-medium"
                  style={{
                    background: `color-mix(in oklab, var(--chart-1) ${lvl * 6}%, var(--card))`,
                    boxShadow: lvl === 0 ? 'none' : `0 ${lvl}px ${lvl * 2 + 1}px rgba(0,0,0,0.18)`,
                  }}>
                  {lvl}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">M3 的高度不只靠阴影:层级越高,surface 上叠的 <strong className="text-foreground">tint(主色染色)</strong> 越重——所以深色模式下没有阴影也能区分高低。这叫 tone-based surfaces。</p>
          </>
        )}

        {tab === 'Motion' && (
          <>
            <div className="mb-4 flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">duration token:</span>
              {durations.map(([n, ms]) => (
                <button key={n} onClick={() => setDur(ms)}
                  className={'rounded-md px-2.5 py-1 font-mono text-xs ' + (dur === ms ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground')}>
                  {n} {ms}ms
                </button>
              ))}
              <button onClick={() => setAt((a) => !a)} className="ml-auto rounded-md bg-secondary px-3 py-1 text-secondary-foreground">播放 ▶</button>
            </div>
            <div className="relative h-14 rounded-lg bg-[var(--muted)]">
              <div className="absolute top-2 h-10 w-10 rounded-xl bg-[var(--chart-1)]"
                style={{
                  left: at ? 'calc(100% - 2.75rem)' : '0.5rem',
                  transition: `left ${dur}ms cubic-bezier(0.2, 0, 0, 1)`,
                }} />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">motion 也是 token:一组 <strong className="text-foreground">duration</strong>(short/medium/long)× <strong className="text-foreground">easing</strong>(这里是 M3 的 emphasized 曲线)。统一取 token,整个产品的动效手感才一致。</p>
          </>
        )}
      </div>
    </div>
  );
}
