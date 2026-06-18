import { useState } from 'react';

// Teach §6: one layout, many screens. Drag the simulated window width and watch
// M3's breakpoints flip the navigation form (bottom bar → rail → drawer) and the
// content columns — the same screen, adapted by rules.

const items = [
  { icon: '🏠', label: '首页' },
  { icon: '📊', label: '统计' },
  { icon: '👤', label: '我的' },
];

function bp(w: number) {
  if (w < 600) return { name: 'compact', nav: 'bar', cols: 1 };
  if (w < 840) return { name: 'medium', nav: 'rail', cols: 1 };
  if (w < 1200) return { name: 'expanded', nav: 'rail', cols: 2 };
  if (w < 1600) return { name: 'large', nav: 'drawer', cols: 2 };
  return { name: 'extra-large', nav: 'drawer', cols: 3 };
}

export function AdaptiveLayout() {
  const [w, setW] = useState(420);
  const b = bp(w);

  const Content = (
    <div className="flex-1 p-3">
      <div className="mb-2 h-5 w-24 rounded bg-[var(--chart-1)]/70" />
      <div className={'grid gap-2 ' + (b.cols === 1 ? 'grid-cols-1' : b.cols === 2 ? 'grid-cols-2' : 'grid-cols-3')}>
        {Array.from({ length: b.cols * 2 }).map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-secondary" />
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <label className="mb-1 flex items-center gap-3 text-sm">
        <span className="w-24 text-muted-foreground">窗口宽度</span>
        <input type="range" min={360} max={1680} step={10} value={w} onChange={(e) => setW(Number(e.target.value))} className="flex-1 accent-[var(--primary)]" />
        <span className="w-16 text-right font-mono">{w}px</span>
      </label>
      <div className="mb-4 flex items-center gap-2 text-sm">
        <span className="rounded-full bg-primary px-3 py-0.5 font-mono text-xs text-primary-foreground">{b.name}</span>
        <span className="text-muted-foreground">导航形态:<strong className="text-foreground">{b.nav === 'bar' ? '底部导航栏' : b.nav === 'rail' ? '侧边 rail' : '侧边 drawer'}</strong> · {b.cols} 列内容</span>
      </div>

      {/* preview (container-width; internal layout reflows by breakpoint) */}
      <div className="overflow-hidden rounded-xl border border-border bg-card" style={{ height: 220 }}>
        {b.nav === 'bar' && (
          <div className="flex h-full flex-col">
            <div className="flex items-center border-b border-border px-3 py-2 text-sm font-medium">Habitz</div>
            {Content}
            <div className="flex items-center justify-around border-t border-border py-2">
              {items.map((it) => <div key={it.label} className="text-center text-xs text-muted-foreground"><div className="text-lg">{it.icon}</div>{it.label}</div>)}
            </div>
          </div>
        )}
        {b.nav === 'rail' && (
          <div className="flex h-full">
            <div className="flex w-16 flex-col items-center gap-4 border-r border-border py-4">
              {items.map((it) => <div key={it.label} className="text-center text-[10px] text-muted-foreground"><div className="text-lg">{it.icon}</div>{it.label}</div>)}
            </div>
            <div className="flex flex-1 flex-col"><div className="border-b border-border px-3 py-2 text-sm font-medium">Habitz</div>{Content}</div>
          </div>
        )}
        {b.nav === 'drawer' && (
          <div className="flex h-full">
            <div className="flex w-40 flex-col gap-1 border-r border-border p-3">
              <div className="mb-2 text-sm font-medium">Habitz</div>
              {items.map((it) => <div key={it.label} className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-muted-foreground hover:bg-secondary"><span>{it.icon}</span>{it.label}</div>)}
            </div>
            <div className="flex flex-1 flex-col"><div className="border-b border-border px-3 py-2 text-sm font-medium">今日</div>{Content}</div>
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        同一个屏幕,你只是改了<strong className="text-foreground">窗口宽度</strong>:M3 的 <strong className="text-foreground">breakpoints</strong>(compact / medium / expanded / large / xl)在固定阈值处切换布局——
        手机用底部导航栏,平板用侧边 rail,桌面用展开的 drawer,内容列数也跟着变。规则化的自适应,而不是为每种设备各画一版。
      </p>
    </div>
  );
}
