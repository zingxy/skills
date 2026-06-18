import { useState } from 'react';

// Teach §4: a component is a MAIN + many INSTANCES. Edit the main once and every
// instance updates — that's the whole point versus copy-paste. Variants capture
// states (variant prop); per-instance bits (the label) are properties.

const variants = {
  default: { bg: 'var(--secondary)', fg: 'var(--secondary-foreground)' },
  primary: { bg: 'var(--primary)', fg: '#fff' },
  danger: { bg: 'var(--destructive)', fg: '#fff' },
} as const;
type V = keyof typeof variants;

function Btn({ label, variant, radius, icon }: { label: string; variant: V; radius: number; icon: boolean }) {
  const v = variants[variant];
  return (
    <button className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all duration-300"
      style={{ background: v.bg, color: v.fg, borderRadius: radius }}>
      {icon && <span>★</span>}
      {label}
    </button>
  );
}

export function ComponentInstances() {
  const [variant, setVariant] = useState<V>('primary');
  const [radius, setRadius] = useState(8);
  const [icon, setIcon] = useState(false);
  const instances = ['保存', '删除', '下一步']; // each instance overrides only its text property

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,0.9fr)_1fr]">
      {/* the MAIN component + its props */}
      <div className="rounded-lg border-2 border-dashed border-primary/60 p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-primary">main component · Button</p>
        <div className="mb-4 flex min-h-12 items-center"><Btn label="Button" variant={variant} radius={radius} icon={icon} /></div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-20 text-muted-foreground">variant</span>
            {(Object.keys(variants) as V[]).map((v) => (
              <button key={v} onClick={() => setVariant(v)}
                className={'rounded-md px-2.5 py-1 font-mono text-xs ' + (variant === v ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground')}>
                {v}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2">
            <span className="w-20 text-muted-foreground">radius</span>
            <input type="range" min={0} max={20} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="flex-1 accent-[var(--primary)]" />
            <span className="w-8 text-right font-mono text-xs">{radius}</span>
          </label>
          <label className="flex items-center gap-2">
            <span className="w-20 text-muted-foreground">带图标</span>
            <input type="checkbox" checked={icon} onChange={(e) => setIcon(e.target.checked)} className="accent-[var(--primary)]" />
            <span className="font-mono text-xs text-muted-foreground">boolean property</span>
          </label>
        </div>
      </div>

      {/* the INSTANCES inherit everything but their own text */}
      <div className="rounded-lg border border-border p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">3 个 instance(散落在不同页面)</p>
        <div className="flex flex-wrap items-center gap-3">
          {instances.map((t) => <Btn key={t} label={t} variant={variant} radius={radius} icon={icon} />)}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          你只改了<strong className="text-foreground">左边那一个 main</strong>,右边三个实例<strong className="text-foreground">同时</strong>变了样式。
          但它们的文字各不相同——文字是每个实例自己的 <span className="font-mono">text property</span> 覆写。
          这正是"组件"胜过"复制粘贴"的地方:一处定义,处处一致,改一次全更新。
        </p>
      </div>
    </div>
  );
}
