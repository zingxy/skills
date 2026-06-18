import { useState } from 'react';

// Teach §3: name colors by ROLE (semantic), not by what they look like.
// `danger` keeps meaning across themes; `red-500` becomes a lie the moment you
// reskin. Flip the theme: the role names stay, the values behind them change,
// and the whole UI follows — for free.

type Role = 'primary' | 'danger' | 'success' | 'surface' | 'text';
const roles: { id: Role; cn: string }[] = [
  { id: 'primary', cn: '主操作' },
  { id: 'danger', cn: '危险' },
  { id: 'success', cn: '成功' },
  { id: 'surface', cn: '卡片底' },
  { id: 'text', cn: '正文' },
];

const themes: Record<string, Record<Role, string>> = {
  日间: { primary: '#cc785c', danger: '#c64545', success: '#5db872', surface: '#ffffff', text: '#141413' },
  夜间: { primary: '#e0997d', danger: '#e07a7a', success: '#7bd08f', surface: '#252320', text: '#faf9f5' },
  海洋: { primary: '#2f7fd0', danger: '#d06a4a', success: '#34a67a', surface: '#f3f7fb', text: '#0e2235' },
};

export function SemanticColor() {
  const [theme, setTheme] = useState('日间');
  const c = themes[theme];

  return (
    <div>
      <div className="mb-5 flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">切换主题:</span>
        {Object.keys(themes).map((t) => (
          <button key={t} onClick={() => setTheme(t)}
            className={'rounded-md px-3 py-1 ' + (theme === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground')}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-[1fr_1fr]">
        {/* the role tokens and their CURRENT values */}
        <div className="rounded-lg border border-border p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">语义 token → 当前值</p>
          <div className="space-y-2">
            {roles.map((r) => (
              <div key={r.id} className="flex items-center gap-3">
                <span className="h-6 w-6 shrink-0 rounded border border-border transition-colors duration-300" style={{ background: c[r.id] }} />
                <span className="font-mono text-sm">color/{r.id}</span>
                <span className="text-xs text-muted-foreground">{r.cn}</span>
                <span className="ml-auto font-mono text-xs text-muted-foreground transition-colors duration-300">{c[r.id]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* a mini UI built only from role names */}
        <div className="rounded-lg border border-border p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">只引用名字拼出的界面</p>
          <div className="rounded-lg p-4 transition-colors duration-300" style={{ background: c.surface }}>
            <div className="text-sm font-medium transition-colors duration-300" style={{ color: c.text }}>删除这个习惯?</div>
            <div className="mt-1 text-xs transition-colors duration-300" style={{ color: c.text, opacity: 0.7 }}>此操作不可撤销。</div>
            <div className="mt-4 flex gap-2">
              <button className="rounded-md px-3 py-1.5 text-sm font-medium text-white transition-colors duration-300" style={{ background: c.danger }}>删除</button>
              <button className="rounded-md px-3 py-1.5 text-sm font-medium text-white transition-colors duration-300" style={{ background: c.primary }}>取消</button>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        界面里写的是 <span className="font-mono">color/danger</span>、<span className="font-mono">color/primary</span> 这些<strong className="text-foreground">角色名</strong>,不是某个 hex。
        换主题时,名字没变、含义没变(危险还是危险),只是名字背后的值变了——全界面自动跟上。
        要是当初写的是 <span className="font-mono">red-500</span>,夜间主题里它还叫 red 却已经偏橙,名字就开始<strong className="text-foreground">撒谎</strong>了。
      </p>
    </div>
  );
}
