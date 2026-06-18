// Read the deck's theme tokens once and convert to concrete colors that
// Konva's canvas engine wants (it can't read CSS variables).
function cssVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

// Resolve any CSS color string (oklch, hsl, hex...) to an rgb() string that
// Konva/canvas can paint, by round-tripping through a throwaway canvas.
function resolve(color: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback;
  try {
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return fallback;
    ctx.fillStyle = color;
    return ctx.fillStyle;
  } catch {
    return fallback;
  }
}

export function getKonvaTheme() {
  return {
    primary: resolve(cssVar('--primary', '#cc785c'), '#cc785c'),
    chart1: resolve(cssVar('--chart-1', '#cc785c'), '#cc785c'),
    chart2: resolve(cssVar('--chart-2', '#5db8a6'), '#5db8a6'),
    chart3: resolve(cssVar('--chart-3', '#e8a55a'), '#e8a55a'),
    chart5: resolve(cssVar('--chart-5', '#5db872'), '#5db872'),
    border: resolve(cssVar('--border', '#e6dfd8'), '#e6dfd8'),
    muted: resolve(cssVar('--muted-foreground', '#6c6a64'), '#6c6a64'),
    foreground: resolve(cssVar('--foreground', '#141413'), '#141413'),
    card: resolve(cssVar('--card', '#faf9f5'), '#faf9f5'),
    surfaceSoft: resolve(cssVar('--secondary', '#f5f0e8'), '#f5f0e8'),
  };
}

export type KonvaTheme = ReturnType<typeof getKonvaTheme>;
