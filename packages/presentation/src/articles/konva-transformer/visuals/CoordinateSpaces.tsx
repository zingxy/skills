import { useRef, useState } from 'react';

// Teach: the pointer arrives in screen (absolute) space, but the box "thinks"
// in its own local space. The transformer converts via the INVERSE of the
// box's absolute transform:  local = absTransform.invert().point(screen).
//
// Here the box has its own origin, a rotation, and a scale. We let the reader
// drag a pointer in screen space and watch the same point's LOCAL coordinates.

const W = 560;
const H = 340;

// Box transform parameters (the "node" the transformer is attached to).
const ORIGIN = { x: 300, y: 180 };
const BOX_W = 120;
const BOX_H = 80;

function transformParams(rotationDeg: number, scale: number) {
  const r = (rotationDeg * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  // Absolute transform m = T(origin) * R(r) * S(scale)
  // applied as point(x,y) = origin + R*S*(x,y)
  const a = c * scale;
  const b = s * scale;
  const cc = -s * scale;
  const d = c * scale;
  return { a, b, c: cc, d, e: ORIGIN.x, f: ORIGIN.y };
}

function applyM(m: ReturnType<typeof transformParams>, p: { x: number; y: number }) {
  return { x: m.a * p.x + m.c * p.y + m.e, y: m.b * p.x + m.d * p.y + m.f };
}

function invertPoint(m: ReturnType<typeof transformParams>, p: { x: number; y: number }) {
  const det = m.a * m.d - m.b * m.c;
  const ia = m.d / det;
  const ib = -m.b / det;
  const ic = -m.c / det;
  const id = m.a / det;
  const ie = (m.c * m.f - m.d * m.e) / det;
  const iff = (m.b * m.e - m.a * m.f) / det;
  return { x: ia * p.x + ic * p.y + ie, y: ib * p.x + id * p.y + iff };
}

export function CoordinateSpaces() {
  const [rotation, setRotation] = useState(25);
  const [scale, setScale] = useState(1.4);
  const [screen, setScreen] = useState({ x: 360, y: 110 });
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const m = transformParams(rotation, scale);
  const local = invertPoint(m, screen);

  // The four box corners in local space → screen space, for drawing the box.
  const corners = [
    { x: 0, y: 0 },
    { x: BOX_W, y: 0 },
    { x: BOX_W, y: BOX_H },
    { x: 0, y: BOX_H },
  ].map((p) => applyM(m, p));
  const boxPts = corners.map((p) => `${p.x},${p.y}`).join(' ');

  // Local axes drawn in screen space.
  const localOrigin = applyM(m, { x: 0, y: 0 });
  const localXend = applyM(m, { x: 70, y: 0 });
  const localYend = applyM(m, { x: 0, y: 70 });

  const toLocalEvent = (e: React.PointerEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    setScreen({ x: Math.max(0, Math.min(W, x)), y: Math.max(0, Math.min(H, y)) });
  };

  const inside = local.x >= 0 && local.x <= BOX_W && local.y >= 0 && local.y <= BOX_H;

  return (
    <div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-none select-none"
        style={{ cursor: 'crosshair' }}
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as Element).setPointerCapture?.(e.pointerId);
          toLocalEvent(e);
        }}
        onPointerMove={(e) => dragging.current && toLocalEvent(e)}
        onPointerUp={() => (dragging.current = false)}
      >
        {/* screen-space grid */}
        {Array.from({ length: Math.floor(W / 40) + 1 }, (_, i) => (
          <line key={'vx' + i} x1={i * 40} y1={0} x2={i * 40} y2={H} stroke="var(--border)" strokeWidth={0.5} opacity={0.5} />
        ))}
        {Array.from({ length: Math.floor(H / 40) + 1 }, (_, i) => (
          <line key={'hz' + i} x1={0} y1={i * 40} x2={W} y2={i * 40} stroke="var(--border)" strokeWidth={0.5} opacity={0.5} />
        ))}
        <text x={8} y={16} fontSize={11} fill="var(--muted-foreground)">屏幕 / 绝对坐标系</text>

        {/* the box in its own space */}
        <polygon points={boxPts} fill="var(--chart-1)" opacity={0.16} stroke="var(--chart-1)" strokeWidth={2} />

        {/* local axes */}
        <line x1={localOrigin.x} y1={localOrigin.y} x2={localXend.x} y2={localXend.y} stroke="var(--chart-3)" strokeWidth={2} markerEnd="url(#arrowhead)" />
        <line x1={localOrigin.x} y1={localOrigin.y} x2={localYend.x} y2={localYend.y} stroke="var(--chart-2)" strokeWidth={2} markerEnd="url(#arrowhead)" />
        <circle cx={localOrigin.x} cy={localOrigin.y} r={4} fill="var(--foreground)" />
        <text x={localXend.x + 4} y={localXend.y} fontSize={11} fill="var(--chart-3)">局部 x</text>
        <text x={localYend.x + 4} y={localYend.y} fontSize={11} fill="var(--chart-2)">局部 y</text>

        {/* the draggable pointer */}
        <line x1={localOrigin.x} y1={localOrigin.y} x2={screen.x} y2={screen.y} stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="3 3" />
        <circle cx={screen.x} cy={screen.y} r={7} fill="var(--primary)" stroke="white" strokeWidth={2} />

        <defs>
          <marker id="arrowhead" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill="var(--muted-foreground)" />
          </marker>
        </defs>
      </svg>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-sm">
            <span className="w-20 text-muted-foreground">rotation</span>
            <input type="range" min={-60} max={60} step={1} value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="flex-1 accent-[var(--primary)]" />
            <span className="w-12 text-right font-mono tabular-nums">{rotation}°</span>
          </label>
          <label className="flex items-center gap-3 text-sm">
            <span className="w-20 text-muted-foreground">scale</span>
            <input type="range" min={0.5} max={2.2} step={0.05} value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="flex-1 accent-[var(--primary)]" />
            <span className="w-12 text-right font-mono tabular-nums">{scale.toFixed(2)}</span>
          </label>
        </div>
        <div className="rounded-lg border border-border p-3 font-mono text-sm tabular-nums">
          <div className="flex justify-between">
            <span className="text-muted-foreground">屏幕坐标</span>
            <span>({screen.x.toFixed(0)}, {screen.y.toFixed(0)})</span>
          </div>
          <div className="my-1 text-center text-xs text-muted-foreground">↓ absTransform.invert().point()</div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">局部坐标</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
              ({local.x.toFixed(0)}, {local.y.toFixed(0)})
            </span>
          </div>
          <div className="mt-2 text-xs" style={{ color: inside ? 'var(--chart-5)' : 'var(--muted-foreground)' }}>
            {inside ? '✓ 落在框内 (0…W, 0…H)' : '在框外'}
          </div>
        </div>
      </div>
    </div>
  );
}
