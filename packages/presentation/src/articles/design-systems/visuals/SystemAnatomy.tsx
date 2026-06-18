import { useState } from 'react';

// Teach §2: a design system is layered. Click a layer to see its job and its
// Lego counterpart. Order is bottom-up = the order you build/learn them in.

type Layer = { id: string; name: string; en: string; role: string; lego: string; color: string };

const layers: Layer[] = [
  { id: 'principles', name: '原则', en: 'Principles', color: 'var(--chart-4)',
    role: '"为什么" —— 公司的信念与取向(如"无障碍优先")。决定其余每一层的取舍。',
    lego: '乐高公司的设计哲学:积木为什么长这样、为什么能互拼。' },
  { id: 'foundations', name: '地基 / Tokens', en: 'Foundations', color: 'var(--chart-1)',
    role: '"是什么"的最底层:color、typography、spacing、grid、elevation、icon。看不见,却决定一切能否对齐。',
    lego: '凸点间距标准 —— 看不见的网格,让任意两块积木都能严丝合缝拼上。' },
  { id: 'components', name: '组件', en: 'Components', color: 'var(--chart-2)',
    role: '把地基凝固成可复用的元件:button、input、card。一个 main、无数 instance,改一处全联动。',
    lego: '模具压出来的标准积木 —— 不用每次手捏,拿来即用。' },
  { id: 'patterns', name: '模式', en: 'Patterns', color: 'var(--chart-3)',
    role: '把组件拼成解决具体问题的成套方案:登录流程、空状态、表单校验。',
    lego: '官方套装 + 拼搭说明:把零散积木拼成"一艘海盗船"。' },
  { id: 'process', name: '文档 + 治理', en: 'Docs & Process', color: 'var(--chart-5)',
    role: '"怎么用、怎么活":文档、命名、版本、贡献流程、推广。让系统能被人用对、能持续演进。',
    lego: '说明书 + 乐高公司的运营:谁来出新积木、怎么发新版、怎么让大家爱用。' },
];

export function SystemAnatomy() {
  const [active, setActive] = useState('foundations');
  const cur = layers.find((l) => l.id === active)!;

  return (
    <div className="grid gap-5 md:grid-cols-[1.1fr_1fr]">
      {/* the stack, bottom-up */}
      <div className="flex flex-col-reverse gap-2">
        {layers.map((l) => {
          const on = l.id === active;
          return (
            <button
              key={l.id}
              onClick={() => setActive(l.id)}
              className="flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-all"
              style={{
                borderColor: on ? l.color : 'var(--border)',
                background: on ? `color-mix(in oklab, ${l.color} 14%, transparent)` : 'transparent',
              }}
            >
              <span className="font-heading text-lg" style={{ color: on ? l.color : 'var(--foreground)' }}>
                {l.name}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{l.en}</span>
            </button>
          );
        })}
        <p className="mt-1 text-center text-xs text-muted-foreground">↑ 越往上越具体 · 越往下越基础(也越该先学)</p>
      </div>

      {/* detail */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="mb-2 flex items-baseline gap-2">
          <span className="font-heading text-2xl" style={{ color: cur.color }}>{cur.name}</span>
          <span className="font-mono text-xs text-muted-foreground">{cur.en}</span>
        </div>
        <p className="text-sm leading-relaxed text-foreground/90">{cur.role}</p>
        <div className="mt-4 rounded-md bg-secondary p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">🧱 乐高类比</p>
          <p className="mt-1 text-sm text-foreground/90">{cur.lego}</p>
        </div>
      </div>
    </div>
  );
}
