import { useState } from 'react';

// Teach §4: components nest. Atoms (button, input, icon) combine into molecules
// (a search bar), which combine into organisms (a header). Step through to see
// the same small pieces build up — that's Brad Frost's atomic design.

const stages = [
  { id: 0, name: 'Atoms 原子', desc: '最小、不可再拆的元件:icon、input、button、avatar。' },
  { id: 1, name: 'Molecules 分子', desc: '几个原子组成一个有用的小单元:input + button = 搜索框。' },
  { id: 2, name: 'Organisms 组织', desc: '分子 + 原子拼成界面里的大块:logo + 搜索框 + avatar = 顶栏。' },
];

const Atom = ({ children, lit }: { children: React.ReactNode; lit: boolean }) => (
  <div className="rounded-md border px-3 py-1.5 text-sm transition-colors"
    style={{ borderColor: lit ? 'var(--chart-2)' : 'var(--border)', background: lit ? 'color-mix(in oklab, var(--chart-2) 12%, transparent)' : 'var(--card)' }}>
    {children}
  </div>
);

export function AtomicDesign() {
  const [stage, setStage] = useState(1);

  const Icon = <Atom lit={stage === 0}>🔍</Atom>;
  const Input = <Atom lit={stage === 0}>搜索习惯…</Atom>;
  const Button = <Atom lit={stage === 0}>搜索</Atom>;
  const Logo = <Atom lit={stage === 0}>● Habitz</Atom>;
  const Avatar = <Atom lit={stage === 0}>🙂</Atom>;

  const SearchBar = (
    <div className="inline-flex items-center gap-2 rounded-lg border p-2 transition-colors"
      style={{ borderColor: stage >= 1 ? 'var(--chart-3)' : 'var(--border)', background: stage === 1 ? 'color-mix(in oklab, var(--chart-3) 10%, transparent)' : 'transparent' }}>
      {Icon}{Input}{Button}
    </div>
  );

  return (
    <div>
      <div className="mb-5 flex gap-2">
        {stages.map((s) => (
          <button key={s.id} onClick={() => setStage(s.id)}
            className={'rounded-md px-3 py-1.5 text-sm ' + (stage === s.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground')}>
            {s.name}
          </button>
        ))}
      </div>

      <div className="flex min-h-32 items-center justify-center rounded-lg border border-border bg-card p-6">
        {stage === 0 && <div className="flex flex-wrap items-center gap-3">{Logo}{Icon}{Input}{Button}{Avatar}</div>}
        {stage === 1 && SearchBar}
        {stage === 2 && (
          <div className="flex w-full max-w-md items-center justify-between gap-3 rounded-lg border p-3"
            style={{ borderColor: 'var(--chart-1)', background: 'color-mix(in oklab, var(--chart-1) 8%, transparent)' }}>
            {Logo}{SearchBar}{Avatar}
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        <strong className="text-foreground">{stages[stage].name}:</strong> {stages[stage].desc}
        {stage > 0 && ' 注意高亮:大的东西不是新画的,而是把上一层拼起来——所以改一个原子,所有用到它的分子、组织都跟着变。'}
      </p>
    </div>
  );
}
