import { useState } from 'react';

// Teach §3: why only SOME dimensions get an @theme prefix. A dimension earns a
// prefix when its value is a SCALE worth standardizing across a team ("how much?
// which one?"). A property whose value is a fixed CSS keyword (flex vs grid,
// absolute vs relative) has no scale to tokenize — it gets a utility, but no
// prefix. Classify each, then check.

type Kind = 'scale' | 'keyword';
const items: { label: string; kind: Kind; detail: string }[] = [
  { label: '间距 / 尺寸', kind: 'scale', detail: '一把 --spacing 基准尺 → p-4 w-8 gap-2' },
  { label: '颜色', kind: 'scale', detail: '--color-* → bg-* text-* border-*' },
  { label: '圆角', kind: 'scale', detail: '--radius-* → rounded-*' },
  { label: '字号', kind: 'scale', detail: '--text-* → text-sm text-xl' },
  { label: 'display', kind: 'keyword', detail: '就 flex / grid / block 几个值 → flex grid' },
  { label: 'position', kind: 'keyword', detail: '就 absolute / relative… → absolute' },
  { label: 'justify-content', kind: 'keyword', detail: '固定关键字 → justify-between' },
  { label: 'overflow', kind: 'keyword', detail: '固定关键字 → overflow-hidden' },
];

export function PrefixSorter() {
  const [picks, setPicks] = useState<Record<number, Kind>>({});
  const [checked, setChecked] = useState(false);
  const allDone = Object.keys(picks).length === items.length;
  const score = items.filter((it, i) => picks[i] === it.kind).length;

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        给每个 CSS 维度归类:它该不该拥有一个 <span className="font-mono">@theme</span> 前缀(= 值得做成一套共享刻度)?
      </p>
      <div className="space-y-2">
        {items.map((it, i) => {
          const pick = picks[i];
          const right = checked && pick === it.kind;
          const wrong = checked && pick && pick !== it.kind;
          return (
            <div
              key={it.label}
              className={
                'flex flex-wrap items-center gap-3 rounded-lg border p-2.5 transition-colors ' +
                (right
                  ? 'border-[var(--chart-2)] bg-[var(--chart-2)]/10'
                  : wrong
                    ? 'border-destructive bg-destructive/10'
                    : 'border-border')
              }
            >
              <span className="w-32 shrink-0 font-mono text-sm">{it.label}</span>
              <div className="flex gap-1.5">
                {(['scale', 'keyword'] as Kind[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => {
                      setPicks((p) => ({ ...p, [i]: k }));
                      setChecked(false);
                    }}
                    className={
                      'rounded-md px-2.5 py-1 text-xs ' +
                      (pick === k ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground')
                    }
                  >
                    {k === 'scale' ? '刻度型 · 有前缀' : '关键字型 · 无前缀'}
                  </button>
                ))}
              </div>
              {checked && pick && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {right ? '✓ ' : '✗ '}
                  {it.detail}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          disabled={!allDone}
          onClick={() => setChecked(true)}
          className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-40"
        >
          看答案
        </button>
        {checked && (
          <span className="text-sm text-muted-foreground">
            答对 {score} / {items.length}。判据始终是一句话:<strong className="text-foreground">各写各的会乱、值得统一成刻度吗?</strong>
          </span>
        )}
      </div>
    </div>
  );
}
