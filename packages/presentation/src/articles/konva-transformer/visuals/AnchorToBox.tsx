import { useRef, useState } from 'react';

// Teach: dragging ONE anchor just moves that anchor (in local space). The new
// box is then *read back* from two anchors:
//   width  = bottomRight.x - topLeft.x
//   height = bottomRight.y - topLeft.y
// The other anchors are dependent — moving bottom-right also slides
// top-right.y and bottom-left.x to stay a rectangle. This mirrors Konva's
// _handleMouseMove: it sets the dragged anchor, fixes up its neighbours, then
// builds {x, y, width, height} from .top-left and .bottom-right.

const W = 560;
const H = 320;
const ANCHOR_NAMES = [
  'top-left', 'top-center', 'top-right',
  'middle-left', 'middle-right',
  'bottom-left', 'bottom-center', 'bottom-right',
] as const;
type AnchorName = (typeof ANCHOR_NAMES)[number];

export function AnchorToBox() {
  // box defined by two corners in local/stage space
  const [tl, setTl] = useState({ x: 180, y: 90 });
  const [br, setBr] = useState({ x: 380, y: 230 });
  const [active, setActive] = useState<AnchorName | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<AnchorName | null>(null);

  const left = Math.min(tl.x, br.x);
  const right = Math.max(tl.x, br.x);
  const top = Math.min(tl.y, br.y);
  const bottom = Math.max(tl.y, br.y);
  const cx = (left + right) / 2;
  const cy = (top + bottom) / 2;
  const width = br.x - tl.x;
  const height = br.y - tl.y;

  const anchorPos: Record<AnchorName, { x: number; y: number }> = {
    'top-left': { x: tl.x, y: tl.y },
    'top-center': { x: cx, y: tl.y },
    'top-right': { x: br.x, y: tl.y },
    'middle-left': { x: tl.x, y: cy },
    'middle-right': { x: br.x, y: cy },
    'bottom-left': { x: tl.x, y: br.y },
    'bottom-center': { x: cx, y: br.y },
    'bottom-right': { x: br.x, y: br.y },
  };

  const evtPos = (e: React.PointerEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * W,
      y: ((e.clientY - rect.top) / rect.height) * H,
    };
  };

  // Move the dragged anchor; fix up the box's two defining corners.
  const moveAnchor = (name: AnchorName, p: { x: number; y: number }) => {
    const ntl = { ...tl };
    const nbr = { ...br };
    if (name.includes('left')) ntl.x = p.x;
    if (name.includes('right')) nbr.x = p.x;
    if (name.includes('top')) ntl.y = p.y;
    if (name.includes('bottom')) nbr.y = p.y;
    setTl(ntl);
    setBr(nbr);
  };

  return (
    <div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-none select-none"
        onPointerMove={(e) => dragging.current && moveAnchor(dragging.current, evtPos(e))}
        onPointerUp={() => { dragging.current = null; setActive(null); }}
        onPointerLeave={() => { dragging.current = null; }}
      >
        {/* the figure being framed */}
        <rect x={left} y={top} width={right - left} height={bottom - top}
          fill="var(--chart-1)" opacity={0.14} />
        {/* dashed selection border */}
        <rect x={left} y={top} width={right - left} height={bottom - top}
          fill="none" stroke="var(--primary)" strokeWidth={1.5} strokeDasharray="5 4" />

        {/* width / height readout brackets */}
        <line x1={left} y1={bottom + 22} x2={right} y2={bottom + 22} stroke="var(--chart-3)" strokeWidth={1} />
        <text x={cx} y={bottom + 36} textAnchor="middle" fontSize={12} fill="var(--chart-3)" className="font-mono">
          width = {width.toFixed(0)}
        </text>
        <line x1={right + 22} y1={top} x2={right + 22} y2={bottom} stroke="var(--chart-2)" strokeWidth={1} />
        <text x={right + 28} y={cy} fontSize={12} fill="var(--chart-2)" className="font-mono">
          height = {height.toFixed(0)}
        </text>

        {/* anchors */}
        {ANCHOR_NAMES.map((name) => {
          const p = anchorPos[name];
          const isActive = active === name;
          return (
            <g key={name}>
              <rect
                x={p.x - 7}
                y={p.y - 7}
                width={14}
                height={14}
                rx={3}
                fill={isActive ? 'var(--primary)' : 'white'}
                stroke="var(--primary)"
                strokeWidth={2}
                style={{ cursor: 'pointer' }}
                onPointerDown={(e) => {
                  dragging.current = name;
                  setActive(name);
                  (e.target as Element).setPointerCapture?.(e.pointerId);
                }}
              />
              {(name === 'top-left' || name === 'bottom-right') && (
                <text x={p.x + 10} y={p.y - 10} fontSize={10} fill="var(--foreground)" className="font-mono">
                  {name === 'top-left' ? 'topLeft' : 'bottomRight'}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-3 font-mono text-xs leading-relaxed tabular-nums">
          <div>topLeft     = ({tl.x.toFixed(0)}, {tl.y.toFixed(0)})</div>
          <div>bottomRight = ({br.x.toFixed(0)}, {br.y.toFixed(0)})</div>
          <div className="mt-1 text-muted-foreground">────────────────────</div>
          <div style={{ color: 'var(--chart-3)' }}>width  = bottomRight.x − topLeft.x = {width.toFixed(0)}</div>
          <div style={{ color: 'var(--chart-2)' }}>height = bottomRight.y − topLeft.y = {height.toFixed(0)}</div>
        </div>
        <div className="rounded-lg border border-border p-3 text-sm leading-relaxed text-muted-foreground">
          拖任意一个白色锚点。你只动了<strong className="text-foreground">一个</strong>锚点,但相邻锚点会自动跟上,
          始终保持一个矩形。Konva 就是这样:移动被拖的那个,修好邻居,再用
          <span className="font-mono text-foreground">topLeft / bottomRight</span> 两个角算回新的
          <span className="font-mono text-foreground">{` {x, y, width, height}`}</span>。
        </div>
      </div>
    </div>
  );
}
