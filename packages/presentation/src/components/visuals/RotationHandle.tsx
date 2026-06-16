import { useRef, useState } from 'react';

// Teach: the rotater is just a point you drag. The new rotation is the ANGLE
// from the pivot (box centre) to that point — Math.atan2(dy, dx). Konva then
// optionally SNAPS it: if the angle is within `tol` of one of rotationSnaps()
// (e.g. 0/45/90/...), it locks onto that snap. The reader can toggle snapping
// and feel the magnetism.

const W = 560;
const H = 340;
const PIVOT = { x: 280, y: 185 };
const BOX_W = 150;
const BOX_H = 96;
const HANDLE_R = 120;
const SNAPS = [0, 45, 90, 135, 180, 225, 270, 315];
const TOL = 8;

function snap(angle: number): number {
  // normalize 0..360
  let a = ((angle % 360) + 360) % 360;
  for (const s of SNAPS) {
    if (Math.abs(a - s) < TOL || Math.abs(a - s - 360) < TOL) return s;
  }
  return a;
}

export function RotationHandle() {
  const [rawAngle, setRawAngle] = useState(0); // degrees, from atan2
  const [snapping, setSnapping] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const applied = snapping ? snap(rawAngle) : ((rawAngle % 360) + 360) % 360;
  const wasSnapped = snapping && Math.abs(applied - (((rawAngle % 360) + 360) % 360)) > 0.01;

  const rad = (applied * Math.PI) / 180;
  // handle sits above the box, rotated around pivot
  const baseHandle = { x: 0, y: -HANDLE_R };
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  const handle = {
    x: PIVOT.x + (baseHandle.x * c - baseHandle.y * s),
    y: PIVOT.y + (baseHandle.x * s + baseHandle.y * c),
  };

  // box corners rotated around pivot
  const corners = [
    { x: -BOX_W / 2, y: -BOX_H / 2 },
    { x: BOX_W / 2, y: -BOX_H / 2 },
    { x: BOX_W / 2, y: BOX_H / 2 },
    { x: -BOX_W / 2, y: BOX_H / 2 },
  ].map((p) => ({
    x: PIVOT.x + (p.x * c - p.y * s),
    y: PIVOT.y + (p.x * s + p.y * c),
  }));
  const boxPts = corners.map((p) => `${p.x},${p.y}`).join(' ');

  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const rect = svgRef.current!.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const py = ((e.clientY - rect.top) / rect.height) * H;
    const dx = px - PIVOT.x;
    const dy = py - PIVOT.y;
    // angle of the handle relative to "straight up" => atan2(dx, -dy)
    const deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
    setRawAngle(deg);
  };

  return (
    <div>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full touch-none select-none"
        onPointerMove={onMove}
        onPointerUp={() => (dragging.current = false)}
        onPointerLeave={() => (dragging.current = false)}
      >
        {/* snap guide rays */}
        {snapping && SNAPS.map((sd) => {
          const sr = (sd * Math.PI) / 180;
          return (
            <line key={sd}
              x1={PIVOT.x} y1={PIVOT.y}
              x2={PIVOT.x + Math.sin(sr) * (HANDLE_R + 18)}
              y2={PIVOT.y - Math.cos(sr) * (HANDLE_R + 18)}
              stroke="var(--border)" strokeWidth={1} strokeDasharray="2 4" />
          );
        })}

        {/* box */}
        <polygon points={boxPts} fill="var(--chart-1)" opacity={0.16} stroke="var(--primary)" strokeWidth={1.5} strokeDasharray="5 4" />

        {/* pivot */}
        <circle cx={PIVOT.x} cy={PIVOT.y} r={4} fill="var(--foreground)" />
        <text x={PIVOT.x + 8} y={PIVOT.y + 4} fontSize={11} fill="var(--muted-foreground)">pivot (中心)</text>

        {/* arm from pivot to handle */}
        <line x1={PIVOT.x} y1={PIVOT.y} x2={handle.x} y2={handle.y}
          stroke={wasSnapped ? 'var(--chart-5)' : 'var(--primary)'} strokeWidth={2} />

        {/* angle arc reference (straight up) */}
        <line x1={PIVOT.x} y1={PIVOT.y} x2={PIVOT.x} y2={PIVOT.y - HANDLE_R} stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />

        {/* handle */}
        <circle cx={handle.x} cy={handle.y} r={9}
          fill={wasSnapped ? 'var(--chart-5)' : 'var(--primary)'} stroke="white" strokeWidth={2}
          style={{ cursor: 'grab' }}
          onPointerDown={(e) => { dragging.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); }} />

        <text x={16} y={24} fontSize={12} fill="var(--muted-foreground)">拖动绿/红把手旋转</text>
      </svg>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={snapping} onChange={(e) => setSnapping(e.target.checked)}
            className="accent-[var(--primary)]" />
          <span>角度吸附 (rotationSnaps,每 45°,容差 {TOL}°)</span>
        </label>
        <div className="rounded-md border border-border px-3 py-1.5 font-mono text-sm tabular-nums">
          atan2 原始角 = <span style={{ color: 'var(--muted-foreground)' }}>{(((rawAngle % 360) + 360) % 360).toFixed(1)}°</span>
          {'  →  '}
          rotation = <span style={{ color: wasSnapped ? 'var(--chart-5)' : 'var(--primary)', fontWeight: 600 }}>{applied.toFixed(1)}°</span>
          {wasSnapped && <span style={{ color: 'var(--chart-5)' }}> (已吸附)</span>}
        </div>
      </div>
    </div>
  );
}
