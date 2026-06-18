import { useState } from 'react';

// Teach §6: a design system is a product with releases. Semantic versioning
// Major.Minor.Patch tells consumers how scared to be. Press a change type and
// watch which number bumps (and which reset).

type Kind = 'patch' | 'minor' | 'major';
const kinds: { id: Kind; cn: string; ex: string; color: string }[] = [
  { id: 'patch', cn: 'Patch · 修 bug', ex: '修正 button 在 Safari 下的 1px 错位', color: 'var(--chart-5)' },
  { id: 'minor', cn: 'Minor · 新增(不破坏)', ex: '新增 Toast 组件、给 Button 加 loading 状态', color: 'var(--chart-2)' },
  { id: 'major', cn: 'Major · 破坏性改动', ex: '改名 color/brand→color/primary、删除旧 Card', color: 'var(--destructive)' },
];

export function Versioning() {
  const [v, setV] = useState({ major: 2, minor: 4, patch: 1 });
  const [log, setLog] = useState<{ ver: string; kind: Kind; ex: string }[]>([]);

  const bump = (k: Kind) => {
    const next = { ...v };
    if (k === 'major') { next.major++; next.minor = 0; next.patch = 0; }
    else if (k === 'minor') { next.minor++; next.patch = 0; }
    else next.patch++;
    setV(next);
    const ex = kinds.find((x) => x.id === k)!.ex;
    setLog((l) => [{ ver: `${next.major}.${next.minor}.${next.patch}`, kind: k, ex }, ...l].slice(0, 5));
  };

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,0.8fr)_1fr]">
      <div>
        <div className="rounded-lg border border-border bg-card p-5 text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">当前版本</p>
          <p className="mt-1 font-mono text-4xl">
            <span className="text-destructive">{v.major}</span>.
            <span className="text-[var(--chart-2)]">{v.minor}</span>.
            <span className="text-[var(--chart-5)]">{v.patch}</span>
          </p>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">major . minor . patch</p>
        </div>
        <div className="mt-3 space-y-2">
          {kinds.map((k) => (
            <button key={k.id} onClick={() => bump(k.id)}
              className="block w-full rounded-md border border-border px-3 py-2 text-left text-sm transition-colors hover:border-[color:var(--primary)]">
              <span style={{ color: k.color }} className="font-medium">{k.cn}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{k.ex}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">发版记录(点左边按钮)</p>
        {log.length === 0 ? (
          <p className="text-sm text-muted-foreground">还没有发版。点一下左边任意一种改动,看版本号怎么变——
            注意:major 进位会把 minor、patch 清零;minor 进位会把 patch 清零。</p>
        ) : (
          <ul className="space-y-2">
            {log.map((e, i) => (
              <li key={i} className="flex items-baseline gap-3 text-sm">
                <span className="font-mono" style={{ color: kinds.find((k) => k.id === e.kind)!.color }}>v{e.ver}</span>
                <span className="text-muted-foreground">{e.ex}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
