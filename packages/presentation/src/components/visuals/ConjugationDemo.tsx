import { useRef, useState } from 'react';

// Teach: ONE world delta Δ, applied to shapes living in DIFFERENT parent frames,
// becomes a DIFFERENT local delta per shape. That's the article's similarity
// transform:  Δ_child = W_parent⁻¹ · Δ · W_parent.
//
// For a pure translation Δ (vector v), the translation part of W_parent cancels
// and this reduces to:  localΔ = L_parent⁻¹ · v  — i.e. the SAME world arrow,
// re-measured against the parent's own (tilted / scaled) axes. We draw that
// re-measurement as the dashed parallelogram along each frame's local axes.

const W = 600;
const H = 360;
const AXIS = 56; // local-axis length we draw (in local units)

type Lin = { a: number; b: number; c: number; d: number }; // columns ex=(a,b), ey=(c,d)
const rot = (deg: number): Lin => {
  const r = (deg * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
  return { a: c, b: s, c: -s, d: c };
};
const scaleL = (k: number): Lin => ({ a: k, b: 0, c: 0, d: k });
const ap = (L: Lin, x: number, y: number) => ({ x: L.a * x + L.c * y, y: L.b * x + L.d * y });
function invL(L: Lin, vx: number, vy: number) {
  const det = L.a * L.d - L.b * L.c;
  return { x: (L.d * vx - L.c * vy) / det, y: (-L.b * vx + L.a * vy) / det };
}

function Frame({
  label, tint, origin, L, v,
}: {
  label: string; tint: string; origin: { x: number; y: number }; L: Lin; v: { x: number; y: number };
}) {
  const ex = ap(L, AXIS, 0); // local x axis in world
  const ey = ap(L, 0, AXIS); // local y axis in world
  const hs = 22;
  const corners = ([[-hs, -hs], [hs, -hs], [hs, hs], [-hs, hs]] as const)
    .map(([x, y]) => ap(L, x, y))
    .map((p) => `${origin.x + p.x},${origin.y + p.y}`)
    .join(' ');

  const comp = invL(L, v.x, v.y); // local components (lx, ly): v = comp.x·ex + comp.y·ey
  const tip = { x: origin.x + v.x, y: origin.y + v.y };
  const mid = { x: origin.x + L.a * comp.x, y: origin.y + L.b * comp.x }; // after the x-component

  return (
    <g>
      {/* local axes */}
      <line x1={origin.x} y1={origin.y} x2={origin.x + ex.x} y2={origin.y + ex.y} stroke="var(--chart-3)" strokeWidth={1.5} markerEnd="url(#cj-ax)" />
      <line x1={origin.x} y1={origin.y} x2={origin.x + ey.x} y2={origin.y + ey.y} stroke="var(--chart-2)" strokeWidth={1.5} markerEnd="url(#cj-ax)" />
      {/* the shape */}
      <polygon points={corners} fill={tint} opacity={0.18} stroke={tint} strokeWidth={2} />
      {/* Δ re-measured against THIS frame's axes (dashed parallelogram) */}
      <line x1={origin.x} y1={origin.y} x2={mid.x} y2={mid.y} stroke="var(--chart-3)" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.9} />
      <line x1={mid.x} y1={mid.y} x2={tip.x} y2={tip.y} stroke="var(--chart-2)" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.9} />
      {/* the shared world Δ arrow (identical vector on every frame) */}
      <line x1={origin.x} y1={origin.y} x2={tip.x} y2={tip.y} stroke="var(--primary)" strokeWidth={2.5} markerEnd="url(#cj-dl)" />
      <circle cx={origin.x} cy={origin.y} r={3.5} fill="var(--foreground)" />
      <text x={origin.x - hs} y={origin.y + hs + 16} fontSize={11} fill="var(--muted-foreground)">{label}</text>
      <text x={tip.x + 6} y={tip.y - 4} fontSize={11} fontWeight={600} fill="var(--primary)">
        父系 ({comp.x.toFixed(0)}, {comp.y.toFixed(0)})
      </text>
    </g>
  );
}

export function ConjugationDemo() {
  const [theta, setTheta] = useState(35); // 图形 A 的父坐标系:旋转
  const [k, setK] = useState(1.7);        // 图形 B 的父坐标系:缩放
  const [v, setV] = useState({ x: 78, y: 14 });
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const La = rot(theta);
  const Lb = scaleL(k);
  const Oa = { x: 165, y: 215 };
  const Ob = { x: 440, y: 215 };
  const localA = invL(La, v.x, v.y);
  const localB = invL(Lb, v.x, v.y);

  const handle = { x: 300 + v.x, y: 70 + v.y }; // draggable Δ tip up top
  const base = { x: 300, y: 70 };

  const setFromEvent = (e: React.PointerEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    const nx = Math.max(-130, Math.min(130, x - 300));
    const ny = Math.max(-40, Math.min(60, y - 70));
    setV({ x: nx, y: ny });
  };

  return (
    <div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-none select-none"
        style={{ cursor: 'grab' }}
        onPointerDown={(e) => { dragging.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); setFromEvent(e); }}
        onPointerMove={(e) => dragging.current && setFromEvent(e)}
        onPointerUp={() => (dragging.current = false)}
      >
        {/* the one world delta, defined up top — drag its tip */}
        <text x={base.x - 160} y={28} fontSize={11} fill="var(--muted-foreground)">一个世界位移 Δ(拖动箭头尖端) → 两个图形都按它移动,但换进各自父坐标系后数值不同</text>
        <line x1={base.x} y1={base.y} x2={handle.x} y2={handle.y} stroke="var(--primary)" strokeWidth={2.5} markerEnd="url(#cj-dl)" />
        <circle cx={handle.x} cy={handle.y} r={7} fill="var(--primary)" stroke="white" strokeWidth={2} />
        <text x={base.x - 14} y={base.y + 4} fontSize={11} fill="var(--muted-foreground)">Δ</text>

        <Frame label="图形 A · 父系旋转" tint="var(--chart-1)" origin={Oa} L={La} v={v} />
        <Frame label="图形 B · 父系缩放" tint="var(--chart-5)" origin={Ob} L={Lb} v={v} />

        <defs>
          <marker id="cj-ax" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill="var(--muted-foreground)" />
          </marker>
          <marker id="cj-dl" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <polygon points="0 0, 8 4, 0 8" fill="var(--primary)" />
          </marker>
        </defs>
      </svg>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-sm">
            <span className="w-28 text-muted-foreground">A 父系 rotation</span>
            <input type="range" min={-70} max={70} step={1} value={theta}
              onChange={(e) => setTheta(Number(e.target.value))}
              className="flex-1 accent-[var(--primary)]" />
            <span className="w-12 text-right font-mono tabular-nums">{theta}°</span>
          </label>
          <label className="flex items-center gap-3 text-sm">
            <span className="w-28 text-muted-foreground">B 父系 scale</span>
            <input type="range" min={0.6} max={2.4} step={0.05} value={k}
              onChange={(e) => setK(Number(e.target.value))}
              className="flex-1 accent-[var(--primary)]" />
            <span className="w-12 text-right font-mono tabular-nums">{k.toFixed(2)}×</span>
          </label>
        </div>
        <div className="rounded-lg border border-border p-3 font-mono text-sm tabular-nums">
          <div className="flex justify-between">
            <span className="text-muted-foreground">世界 Δ(两者相同)</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>({v.x.toFixed(0)}, {v.y.toFixed(0)})</span>
          </div>
          <div className="my-1 text-center text-xs text-muted-foreground">↓ Δ_parent = L_parent⁻¹ · Δ</div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--chart-1)' }}>图形 A 父系 Δ</span>
            <span>({localA.x.toFixed(0)}, {localA.y.toFixed(0)})</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--chart-5)' }}>图形 B 父系 Δ</span>
            <span>({localB.x.toFixed(0)}, {localB.y.toFixed(0)})</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">同一个世界位移,翻译进各自父坐标系后数值不同——这就是相似矩阵在做的事。</div>
        </div>
      </div>
    </div>
  );
}
