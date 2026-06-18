import { useMemo, useState } from 'react';
import { argbFromHex, hexFromArgb, themeFromSourceColor } from '@material/material-color-utilities';

// Teach §3-4 (the showpiece): ONE seed color → M3's real algorithm (HCT) mixes a
// 0-100 tonal palette → assigns tones to color ROLES → a full light & dark scheme.
// Components only ask for roles, so theme + dark mode fall out for free. This is
// exactly Material You / dynamic color, computed with Google's official library.

// "wallpapers" — picking one is what dynamic color does from a phone wallpaper.
const seeds = [
  { name: '紫(M3 默认)', hex: '#6750A4' },
  { name: '青', hex: '#006A6A' },
  { name: '橙', hex: '#B5460F' },
  { name: '蓝', hex: '#415F91' },
  { name: '粉', hex: '#8B418F' },
];

const TONES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99];

export function ThemeGenerator() {
  const [seed, setSeed] = useState('#6750A4');
  const [dark, setDark] = useState(false);

  const theme = useMemo(() => themeFromSourceColor(argbFromHex(seed)), [seed]);
  const s = theme.schemes[dark ? 'dark' : 'light'];
  const hex = (argb: number) => hexFromArgb(argb);

  const roles: [string, number, number][] = [
    ['primary', s.primary, s.onPrimary],
    ['primaryContainer', s.primaryContainer, s.onPrimaryContainer],
    ['secondary', s.secondary, s.onSecondary],
    ['tertiary', s.tertiary, s.onTertiary],
    ['surface', s.surface, s.onSurface],
    ['surfaceVariant', s.surfaceVariant, s.onSurfaceVariant],
  ];

  return (
    <div>
      {/* controls */}
      <div className="mb-5 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">壁纸 / 种子色:</span>
        {seeds.map((p) => (
          <button key={p.hex} onClick={() => setSeed(p.hex)} title={p.name}
            className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110"
            style={{ background: p.hex, borderColor: seed === p.hex ? 'var(--foreground)' : 'transparent' }} />
        ))}
        <input type="color" value={seed} onChange={(e) => setSeed(e.target.value)}
          className="h-7 w-9 cursor-pointer rounded border border-border bg-transparent" title="自定义" />
        <span className="ml-2 font-mono text-xs text-muted-foreground">{seed}</span>
        <button onClick={() => setDark((d) => !d)}
          className="ml-auto rounded-md bg-secondary px-3 py-1.5 text-secondary-foreground">
          {dark ? '☀ 切到浅色' : '🌙 切到深色'}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_minmax(0,0.85fr)]">
        <div>
          {/* tonal palette */}
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">primary tonal palette · 0–100</p>
          <div className="mb-4 flex overflow-hidden rounded-md">
            {TONES.map((t) => {
              const c = hex(theme.palettes.primary.tone(t));
              return (
                <div key={t} className="flex-1 py-3 text-center text-[10px]" style={{ background: c, color: t >= 60 ? '#000' : '#fff' }}>{t}</div>
              );
            })}
          </div>
          {/* color roles */}
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">color roles(当前 {dark ? '深色' : '浅色'} scheme)</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {roles.map(([name, bg, on]) => (
              <div key={name} className="rounded-md p-2 text-[11px]" style={{ background: hex(bg), color: hex(on) }}>
                <div className="font-medium">{name}</div>
                <div className="font-mono opacity-80">on →</div>
              </div>
            ))}
          </div>
        </div>

        {/* mini UI built ONLY from roles */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">只引用角色拼出的界面</p>
          <div className="overflow-hidden rounded-xl border border-border" style={{ background: hex(s.background) }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ background: hex(s.surface), color: hex(s.onSurface) }}>
              <span className="font-medium">Habitz</span>
              <span style={{ color: hex(s.onSurfaceVariant) }}>⋯</span>
            </div>
            <div className="space-y-3 p-4">
              <div className="rounded-xl p-3" style={{ background: hex(s.primaryContainer), color: hex(s.onPrimaryContainer) }}>
                <div className="text-sm font-medium">今日进度</div>
                <div className="text-xs opacity-80">3 / 5 个习惯已完成</div>
              </div>
              <div className="rounded-xl p-3" style={{ background: hex(s.surfaceVariant), color: hex(s.onSurfaceVariant) }}>
                <div className="text-sm">喝水 · 阅读 · 运动</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-full px-4 py-2 text-sm font-medium" style={{ background: hex(s.primary), color: hex(s.onPrimary) }}>开始</button>
                <button className="rounded-full px-4 py-2 text-sm font-medium" style={{ background: hex(s.secondaryContainer), color: hex(s.onSecondaryContainer) }}>稍后</button>
                <span className="ml-auto grid h-12 w-12 place-items-center rounded-2xl text-2xl" style={{ background: hex(s.tertiaryContainer), color: hex(s.onTertiaryContainer) }}>+</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        换一颗种子色:整套 0–100 色阶、所有 color roles、右边整个界面、连深/浅色都<strong className="text-foreground">一次性重算</strong>了。
        界面里没有任何一个 hex,只写了 <span className="font-mono">primary</span>、<span className="font-mono">onPrimaryContainer</span> 这些<strong className="text-foreground">角色名</strong>。
        这就是 dynamic color(Material You):从壁纸取一颗色,算法配齐一切。本 demo 用的是 Google 官方 <span className="font-mono">material-color-utilities</span>,真算法。
      </p>
    </div>
  );
}
