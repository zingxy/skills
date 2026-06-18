import { useEffect, useState } from 'react';

// Teach §5 (animated): shadcn's whole job is WIRING. A value you set in :root flows
// through @theme inline → a generated utility → the component. Change --primary (or
// flip .dark) and watch the new value travel down the pipe, energizing each stage
// in turn and finally re-lighting the <Button>. This makes the "配电盘接线" spine
// literal: edit one circuit at the source, the current reaches every socket.

const swatches = ['#cc785c', '#5db8a6', '#6d28d9', '#2563eb'];

const stages = [
  {
    tag: ':root / .dark',
    note: 'system 层:你在这里登记角色名(主题住这)',
    code: (c: string) => (
      <>
        --primary: <span style={{ color: c }}>{c}</span>;<br />
        --primary-foreground: #fff; <span className="text-muted-foreground">/* 成对的 on-color */</span>
      </>
    ),
  },
  {
    tag: '@theme inline',
    note: '接线:inline = 引用 var() 而非固化值,所以 .dark 一改就全跟着变',
    code: () => (
      <>
        --color-primary: <span className="text-muted-foreground">var(</span>--primary<span className="text-muted-foreground">)</span>;
      </>
    ),
  },
  {
    tag: 'Tailwind 生成 utility',
    note: '引擎按这条回路造出插座',
    code: () => <>bg-primary · text-primary-foreground</>,
  },
  {
    tag: '<Button> 组件',
    note: 'component 层:只认角色名,绝不写 hex',
    code: () => <>className="bg-primary text-primary-foreground"</>,
  },
];

export function WiringFlow() {
  const [primary, setPrimary] = useState('#cc785c');
  const [dark, setDark] = useState(false);
  const [stage, setStage] = useState(stages.length - 1);

  // re-run the cascade whenever the source value or mode changes
  useEffect(() => {
    setStage(0);
    const timers = [1, 2, 3].map((s) => setTimeout(() => setStage(s), s * 430));
    return () => timers.forEach(clearTimeout);
  }, [primary, dark]);

  return (
    <div>
      {/* controls — the source you edit */}
      <div className="mb-5 flex flex-wrap items-center gap-3 text-sm">
        <span className="text-muted-foreground">改 --primary</span>
        {swatches.map((c) => (
          <button
            key={c}
            onClick={() => setPrimary(c)}
            className={'h-7 w-7 rounded-full border border-border ' + (primary === c ? 'ring-2 ring-foreground ring-offset-2' : '')}
            style={{ background: c }}
          />
        ))}
        <button
          onClick={() => setDark((d) => !d)}
          className="ml-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
        >
          {dark ? '☀ 浅色' : '🌙 切 .dark'}
        </button>
        <span className="text-muted-foreground">→ 看新值沿管道流下去</span>
      </div>

      {/* the pipeline */}
      <div className="flex flex-col items-stretch">
        {stages.map((st, i) => {
          const lit = stage >= i; // this stage has received the value
          const isLast = i === stages.length - 1;
          const color = lit ? primary : 'var(--muted-foreground)';
          return (
            <div key={st.tag}>
              <div
                className="rounded-xl border p-3.5 transition-all duration-300"
                style={{
                  borderColor: lit ? primary : 'var(--border)',
                  background: lit ? `color-mix(in oklab, ${primary} 7%, var(--card))` : 'var(--card)',
                  opacity: lit ? 1 : 0.55,
                  transform: stage === i ? 'scale(1.015)' : 'scale(1)',
                }}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full transition-colors duration-300" style={{ background: color }} />
                  <span className="font-mono text-xs font-medium" style={{ color: lit ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                    {st.tag}
                  </span>
                  <span className="ml-auto text-[11px] text-muted-foreground">{st.note}</span>
                </div>

                {isLast ? (
                  // the real, live component sitting on a (light/dark) surface
                  <div
                    className="mt-2 flex items-center gap-3 rounded-lg p-3 transition-colors duration-300"
                    style={{ background: dark ? '#181715' : '#faf9f5' }}
                  >
                    <button
                      className="rounded-md px-4 py-2 text-sm font-medium text-white transition-colors duration-300"
                      style={{ background: primary }}
                    >
                      保存习惯
                    </button>
                    <code className="font-mono text-[11px]" style={{ color: dark ? '#a09d96' : '#6c6a64' }}>
                      {st.code(primary)}
                    </code>
                  </div>
                ) : (
                  <code className="block pl-5 font-mono text-xs leading-relaxed">{st.code(primary)}</code>
                )}
              </div>

              {/* connector — energizes as the value passes through */}
              {!isLast && (
                <div className="mx-auto my-1 flex h-7 w-6 flex-col items-center">
                  <div className="relative h-full w-0.5 overflow-hidden rounded bg-border">
                    <div
                      className="absolute inset-x-0 top-0 rounded transition-all duration-300"
                      style={{ height: stage >= i + 1 ? '100%' : '0%', background: primary }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
