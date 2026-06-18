import { useState } from 'react';

// Teach §2: M3 tokens come in three tiers. A component never names a raw color;
// it points at a SYSTEM role, which points at a REFERENCE value. Toggle dark to
// see: only the sys→ref link moves; the component token is untouched — that's
// why one definition themes everything.

export function TokenTiers() {
  const [dark, setDark] = useState(false);
  // Real M3 baseline values: primary is ref.palette.primary40 (light) / 80 (dark).
  const refName = dark ? 'primary80' : 'primary40';
  const refHex = dark ? '#D0BCFF' : '#6750A4';

  const Tier = ({ tag, title, children }: { tag: string; title: string; children: React.ReactNode }) => (
    <div className="flex-1 rounded-lg border border-border p-3">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{tag}</p>
      <p className="mb-3 text-xs text-muted-foreground">{title}</p>
      {children}
    </div>
  );
  const Chip = ({ children, hex }: { children: React.ReactNode; hex?: string }) => (
    <div className="flex items-center gap-2 rounded-md bg-secondary px-2.5 py-1.5 font-mono text-xs text-secondary-foreground">
      {hex && <span className="h-4 w-4 rounded border border-border" style={{ background: hex }} />}
      <span className="truncate">{children}</span>
    </div>
  );

  return (
    <div>
      <div className="mb-4 flex items-center gap-3 text-sm">
        <button onClick={() => setDark((d) => !d)} className="rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground">
          {dark ? '☀ 切回浅色' : '🌙 切到深色'}
        </button>
        <span className="text-muted-foreground">看哪一段链接变了</span>
      </div>

      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
        <Tier tag="reference" title="所有可用的原始值(整条色阶)">
          <Chip hex={refHex}>md.ref.palette.{refName}</Chip>
        </Tier>
        <span className="self-center text-muted-foreground">→ 被引用为 →</span>
        <Tier tag="system" title="角色 / 选择(主题在这一层)">
          <Chip hex={refHex}>md.sys.color.primary</Chip>
        </Tier>
        <span className="self-center text-muted-foreground">→ 被引用为 →</span>
        <Tier tag="component" title="某组件的具体属性">
          <Chip hex={refHex}>filledButton.container.color</Chip>
        </Tier>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-xs text-muted-foreground">解析结果:</span>
        <button className="rounded-full px-4 py-2 text-sm font-medium transition-colors" style={{ background: refHex, color: dark ? '#381E72' : '#fff' }}>
          Filled button
        </button>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        切到深色:变的只有 <span className="font-mono">sys.color.primary → ref.palette.*</span> 这<strong className="text-foreground">一段指向</strong>
        (primary40 → primary80)。<span className="font-mono">filledButton.container</span> 这个组件 token <strong className="text-foreground">一个字都没改</strong>——
        它永远只认 <span className="font-mono">sys.color.primary</span>。这就是三级 token 的意义:换主题=只动中间那层,组件层稳如泰山。
      </p>
    </div>
  );
}
