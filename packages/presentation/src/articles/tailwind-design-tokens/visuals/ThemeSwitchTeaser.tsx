import { useState } from 'react';

// Teach §1 (the payoff, felt before explained): the SAME mini-UI markup re-themes
// completely when you flip light/dark or swap the brand color — because every
// color it uses is a named token, not a hardcoded value. The component code never
// changes; only the values behind a handful of names do.

const brands = {
  coral: { name: '珊瑚', light: '#cc785c', dark: '#cc785c' },
  teal: { name: '青', light: '#0f766e', dark: '#5eead4' },
  violet: { name: '紫', light: '#6d28d9', dark: '#c4b5fd' },
} as const;
type Brand = keyof typeof brands;

export function ThemeSwitchTeaser() {
  const [dark, setDark] = useState(false);
  const [brand, setBrand] = useState<Brand>('coral');

  const primary = brands[brand][dark ? 'dark' : 'light'];
  // the semantic tokens — the ONLY thing that actually changes:
  const t = dark
    ? { bg: '#181715', fg: '#faf9f5', card: '#252320', muted: '#a09d96', border: '#ffffff1a' }
    : { bg: '#faf9f5', fg: '#141413', card: '#efe9de', muted: '#6c6a64', border: '#e6dfd8' };
  const onPrimary = dark && brand !== 'coral' ? '#181715' : '#ffffff';

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
        <button
          onClick={() => setDark((d) => !d)}
          className="rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground"
        >
          {dark ? '☀ 浅色' : '🌙 深色'}
        </button>
        <span className="text-muted-foreground">品牌色</span>
        {(Object.keys(brands) as Brand[]).map((b) => (
          <button
            key={b}
            onClick={() => setBrand(b)}
            className={'rounded-full px-3 py-1 text-xs text-white transition ' + (brand === b ? 'ring-2 ring-foreground ring-offset-1' : 'opacity-50')}
            style={{ background: brands[b][dark ? 'dark' : 'light'] }}
          >
            {brands[b].name}
          </button>
        ))}
      </div>

      {/* the mini UI — every color comes from `t` (semantic) + `primary` (role) */}
      <div
        className="rounded-xl border p-5 transition-colors"
        style={{ background: t.bg, color: t.fg, borderColor: t.border }}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-base font-semibold">习惯打卡</span>
          <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: primary, color: onPrimary }}>
            已连续 7 天
          </span>
        </div>
        <div className="rounded-lg p-3" style={{ background: t.card }}>
          <p className="text-sm">今天的目标</p>
          <p className="mt-0.5 text-sm" style={{ color: t.muted }}>喝 8 杯水 · 跑 3 公里</p>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="rounded-md px-4 py-2 text-sm font-medium" style={{ background: primary, color: onPrimary }}>
            打卡
          </button>
          <button className="rounded-md border px-4 py-2 text-sm" style={{ borderColor: t.border }}>
            跳过
          </button>
        </div>
      </div>
    </div>
  );
}
