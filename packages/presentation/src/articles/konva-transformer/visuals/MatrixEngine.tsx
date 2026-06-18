import { useRef, useState } from 'react';

// Teach: the transformer never edits the node directly. It builds a transform
// for the OLD box and a transform for the NEW box, then the change is the
// delta matrix:   delta = newTr.multiply(oldTr.invert())
// Apply delta to the node's transform, then DECOMPOSE the result back into the
// attrs Konva actually stores: x, y, scaleX, scaleY, rotation.
//
// Here: a fixed old box (unit-ish), and a new box the reader reshapes by
// dragging its corners. We show both transforms' matrices, the delta, and the
// decomposition — live.

type M = [number, number, number, number, number, number]; // a b c d e f

const W = 560;
const H = 320;

// Old box: axis-aligned rectangle, top-left at (160,90), size 200x120.
const OLD = { x: 160, y: 90, w: 200, h: 120 };

function boxTransform(b: { x: number; y: number; w: number; h: number; rot?: number }): M {
  // Transform that maps the unit square [0,1]x[0,1] onto the box.
  const r = ((b.rot ?? 0) * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  // scale w,h then rotate then translate
  const a = c * b.w;
  const bb = s * b.w;
  const cc = -s * b.h;
  const d = c * b.h;
  return [a, bb, cc, d, b.x, b.y];
}

function invert(m: M): M {
  const det = m[0] * m[3] - m[1] * m[2];
  const ia = m[3] / det;
  const ib = -m[1] / det;
  const ic = -m[2] / det;
  const id = m[0] / det;
  const ie = (m[2] * m[5] - m[3] * m[4]) / det;
  const iff = (m[1] * m[4] - m[0] * m[5]) / det;
  return [ia, ib, ic, id, ie, iff];
}

function multiply(a: M, b: M): M {
  return [
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3],
    a[0] * b[4] + a[2] * b[5] + a[4],
    a[1] * b[4] + a[3] * b[5] + a[5],
  ];
}

// Konva's decompose (a,b,c,d,e,f).
function decompose(m: M) {
  const [a, b, c, d, e, f] = m;
  const delta = a * d - b * c;
  const res = { x: e, y: f, rotation: 0, scaleX: 0, scaleY: 0 };
  if (a !== 0 || b !== 0) {
    const r = Math.sqrt(a * a + b * b);
    res.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
    res.scaleX = r;
    res.scaleY = delta / r;
  }
  res.rotation = (res.rotation * 180) / Math.PI;
  return res;
}

function fmt(m: M) {
  return m.map((v) => (Math.abs(v) < 0.001 ? '0' : v.toFixed(2)));
}

export function MatrixEngine() {
  // New box defined by two corners (the reader drags either).
  const [tl, setTl] = useState({ x: 220, y: 120 });
  const [br, setBr] = useState({ x: 460, y: 280 });
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<'tl' | 'br' | null>(null);

  const newBox = { x: tl.x, y: tl.y, w: br.x - tl.x, h: br.y - tl.y };

  const oldTr = boxTransform(OLD);
  const newTr = boxTransform(newBox);
  // delta maps old-box-space onto new-box-space
  const delta = multiply(newTr, invert(oldTr));
  // The node's local transform was effectively oldTr (unit square -> old box);
  // after delta it becomes newTr. Decompose newTr to get the stored attrs.
  const decomp = decompose(newTr);

  const evt = (e: React.PointerEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * W,
      y: ((e.clientY - rect.top) / rect.height) * H,
    };
  };

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full touch-none select-none"
          onPointerMove={(e) => {
            if (!dragging.current) return;
            const p = evt(e);
            if (dragging.current === 'tl') setTl(p); else setBr(p);
          }}
          onPointerUp={() => (dragging.current = null)}
          onPointerLeave={() => (dragging.current = null)}
        >
          {/* old box (ghost) */}
          <rect x={OLD.x} y={OLD.y} width={OLD.w} height={OLD.h}
            fill="none" stroke="var(--muted-foreground)" strokeWidth={1.5} strokeDasharray="4 4" opacity={0.7} />
          <text x={OLD.x} y={OLD.y - 6} fontSize={11} fill="var(--muted-foreground)">old box</text>

          {/* new box */}
          <rect x={Math.min(tl.x, br.x)} y={Math.min(tl.y, br.y)}
            width={Math.abs(newBox.w)} height={Math.abs(newBox.h)}
            fill="var(--chart-1)" opacity={0.15} stroke="var(--primary)" strokeWidth={2} />
          <text x={tl.x} y={tl.y - 6} fontSize={11} fill="var(--primary)">new box</text>

          {/* draggable corners */}
          {([['tl', tl], ['br', br]] as const).map(([key, p]) => (
            <circle key={key} cx={p.x} cy={p.y} r={8} fill="var(--primary)" stroke="white" strokeWidth={2}
              style={{ cursor: 'grab' }}
              onPointerDown={(e) => { dragging.current = key; (e.target as Element).setPointerCapture?.(e.pointerId); }} />
          ))}
          <text x={16} y={H - 12} fontSize={11} fill="var(--muted-foreground)">拖两个角,把 old box 重塑成 new box</text>
        </svg>

        <div className="space-y-3 text-xs">
          <MatrixCard label="oldTr  (unit → old box)" m={oldTr} tone="var(--muted-foreground)" />
          <MatrixCard label="newTr  (unit → new box)" m={newTr} tone="var(--primary)" />
          <MatrixCard label="delta = newTr × oldTr⁻¹" m={delta} tone="var(--chart-3)" />
          <div className="rounded-lg border border-border p-3">
            <div className="mb-1 font-medium uppercase tracking-wider text-muted-foreground">decompose(newTr) → 存进图形的属性</div>
            <div className="grid grid-cols-2 gap-x-4 font-mono tabular-nums">
              <div>x = {decomp.x.toFixed(0)}</div>
              <div>y = {decomp.y.toFixed(0)}</div>
              <div style={{ color: 'var(--primary)' }}>scaleX = {decomp.scaleX.toFixed(3)}</div>
              <div style={{ color: 'var(--primary)' }}>scaleY = {decomp.scaleY.toFixed(3)}</div>
              <div style={{ color: 'var(--chart-2)' }}>rotation = {decomp.rotation.toFixed(1)}°</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MatrixCard({ label, m, tone }: { label: string; m: M; tone: string }) {
  const f = fmt(m);
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="mb-1 font-medium uppercase tracking-wider" style={{ color: tone }}>{label}</div>
      <div className="font-mono tabular-nums leading-snug">
        <div>[ a={f[0]}  c={f[2]}  e={f[4]} ]</div>
        <div>[ b={f[1]}  d={f[3]}  f={f[5]} ]</div>
      </div>
    </div>
  );
}
