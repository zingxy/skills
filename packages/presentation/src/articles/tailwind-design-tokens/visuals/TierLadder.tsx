import { useState } from 'react';

// Teach §4: the SAME prefix (--color-*) can hold tokens of different TIERS — the
// NAME decides, not the prefix. An appearance name (blue-500) is a reference
// token; a role name (primary) is a system token. The component tier isn't a
// token at all — it collapses into the className composition. Lying-name demo:
// flip to a night theme and watch the appearance-named button fail to adapt while
// the role-named one follows along.

const rows = [
  { tier: 'reference', name: '--color-blue-500', by: '按外观命名', note: 'Tailwind 自带,一个固定原始值' },
  { tier: 'system', name: '--color-primary', by: '按角色命名', note: 'shadcn 加的,主题住这层' },
  { tier: 'component', name: 'bg-primary h-9 …', by: '不是 token', note: '塌缩进组件文件 / CVA 组合' },
];

export function TierLadder() {
  const [dark, setDark] = useState(false);
  const surface = dark ? '#181715' : '#faf9f5';
  const fg = dark ? '#faf9f5' : '#141413';
  const primary = dark ? '#5db8a6' : '#cc785c'; // role name: adapts to mode
  const blue500 = '#3b82f6'; // appearance name: locked, can't adapt

  return (
    <div>
      {/* the ladder: same prefix, three tiers, name decides */}
      <div className="mb-5 space-y-1.5">
        {rows.map((r, i) => (
          <div
            key={r.tier}
            className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-2.5"
            style={{ marginLeft: i * 28 }}
          >
            <span className="w-24 shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">{r.tier}</span>
            <span className="font-mono text-sm">{r.name}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {r.by} · {r.note}
            </span>
          </div>
        ))}
      </div>

      {/* lying-name demo */}
      <div className="rounded-xl border border-border p-5 transition-colors" style={{ background: surface }}>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setDark((d) => !d)}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
          >
            {dark ? '☀ 浅色' : '🌙 切到夜间主题'}
          </button>
          <span className="text-sm" style={{ color: fg }}>同一个夜间切换,看哪个按钮跟上了</span>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <button className="rounded-md px-4 py-2 text-sm font-medium text-white" style={{ background: primary }}>
              角色名
            </button>
            <p className="mt-1.5 font-mono text-[11px]" style={{ color: fg }}>bg-primary ✓ 跟着换</p>
          </div>
          <div className="text-center">
            <button className="rounded-md px-4 py-2 text-sm font-medium text-white" style={{ background: blue500 }}>
              外观名
            </button>
            <p className="mt-1.5 font-mono text-[11px]" style={{ color: fg }}>bg-blue-500 ✗ 锁死</p>
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        两个都是 <span className="font-mono">--color-*</span> 前缀,长得一样。但 <span className="font-mono">blue-500</span> 把"蓝"这个外观焊死了,夜间没法变;
        <span className="font-mono">primary</span> 只说"主色这个角色",换肤时值跟着走。<strong className="text-foreground">名字(外观 vs 角色)决定它落在 reference 还是 system 层。</strong>
      </p>
    </div>
  );
}
