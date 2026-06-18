import { useState } from 'react';

// Teach §1: the pain. Three designers, one app. Without shared tokens each
// invents their own button; with a design system all three pull from the SAME
// named tokens, so the output looks like one person made it. Toggle to feel it.

type Spec = { label: string; bg: string; radius: number; padX: number; padY: number; token: string };

// Each "designer" improvising their own values (ad-hoc hex / px).
const adHoc: Spec[] = [
  { label: '设计师 A', bg: '#3b6fe0', radius: 4, padX: 14, padY: 8, token: '#3b6fe0 · r4 · 14/8' },
  { label: '设计师 B', bg: '#2f5fd0', radius: 12, padX: 20, padY: 10, token: '#2f5fd0 · r12 · 20/10' },
  { label: '设计师 C', bg: '#4a7bf0', radius: 8, padX: 24, padY: 6, token: '#4a7bf0 · r8 · 24/6' },
];

// Everyone references the SAME tokens.
const shared: Spec = {
  label: '', bg: 'var(--primary)', radius: 10, padX: 20, padY: 10,
  token: 'color/primary · radius/md · space/2',
};

export function InconsistencyDemo() {
  const [system, setSystem] = useState(false);

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <button
          onClick={() => setSystem((s) => !s)}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          {system ? '关掉设计系统' : '打开设计系统'}
        </button>
        <span className="text-sm text-muted-foreground">
          {system ? '三人引用同一套 token —— 像一个人做的' : '三人各凭手感 —— 三种蓝、三种圆角、三种间距'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {adHoc.map((d, i) => {
          const s = system ? { ...shared, label: d.label } : d;
          return (
            <div key={i} className="rounded-lg border border-border bg-card p-5">
              <p className="mb-4 text-xs text-muted-foreground">{d.label}</p>
              <div className="flex min-h-16 items-center justify-center">
                <button
                  className="font-medium text-white transition-all duration-300"
                  style={{
                    background: s.bg,
                    borderRadius: s.radius,
                    padding: `${s.padY}px ${s.padX}px`,
                  }}
                >
                  保存
                </button>
              </div>
              <p
                className="mt-4 font-mono text-[11px] transition-colors"
                style={{ color: system ? 'var(--chart-2)' : 'var(--destructive)' }}
              >
                {system ? shared.token : d.token}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {system ? (
          <>三个按钮现在<strong className="text-foreground"> 一模一样</strong>,因为它们指向同一个名字(<span className="font-mono">color/primary</span> 等)。改这一个名字,三处一起变。</>
        ) : (
          <>注意右下角:三个人写的是<strong className="text-foreground"> 具体的 hex 和 px</strong>。没人是错的,但合在一起就是不一致——而且人越多,组合越乱。</>
        )}
      </p>
    </div>
  );
}
