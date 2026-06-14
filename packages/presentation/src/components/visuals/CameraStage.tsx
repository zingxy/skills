import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

// World is the one true coordinate space (1000 × 700 units).
const WORLD_W = 1000;
const WORLD_H = 700;
const SENSOR_W0 = 520; // what the camera captures at zoom = 1
const SENSOR_H0 = 364;

type Landmark = { id: string; x: number; y: number; label: string; color: string };
const LANDMARKS: Landmark[] = [
  { id: 'A', x: 200, y: 170, label: '🏠 房子', color: 'var(--chart-1)' },
  { id: 'B', x: 780, y: 150, label: '🌲 树', color: 'var(--chart-2)' },
  { id: 'C', x: 320, y: 560, label: '⭐ 灯塔', color: 'var(--chart-3)' },
  { id: 'E', x: 820, y: 540, label: '🎯 E', color: 'var(--primary)' },
];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function CameraStage() {
  // Camera = a rectangle in the world: center (x, y) and zoom z.
  const [cam, setCam] = useState({ x: 360, y: 320, z: 1 });
  const [picked, setPicked] = useState<{ x: number; y: number } | null>(null);
  const [target, setTarget] = useState<{ x: number; y: number } | null>(null);
  const worldRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ ox: number; oy: number; cx: number; cy: number } | null>(null);

  const sensorW = SENSOR_W0 / cam.z;
  const sensorH = SENSOR_H0 / cam.z;
  const camLeft = cam.x - sensorW / 2;
  const camTop = cam.y - sensorH / 2;

  const clampCam = (x: number, y: number, z: number) => {
    const sw = SENSOR_W0 / z;
    const sh = SENSOR_H0 / z;
    return { x: clamp(x, sw / 2, WORLD_W - sw / 2), y: clamp(y, sh / 2, WORLD_H - sh / 2), z };
  };

  // Map a client point to world coords using the world SVG's box.
  const clientToWorld = (clientX: number, clientY: number) => {
    const r = worldRef.current!.getBoundingClientRect();
    return {
      x: ((clientX - r.left) / r.width) * WORLD_W,
      y: ((clientY - r.top) / r.height) * WORLD_H,
    };
  };

  // Drag the camera frame to pan.
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!drag.current) return;
      const w = clientToWorld(e.clientX, e.clientY);
      setCam((c) => clampCam(drag.current!.cx + (w.x - drag.current!.ox), drag.current!.cy + (w.y - drag.current!.oy), c.z));
    };
    const up = () => (drag.current = null);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  // Animate the camera to a target (focus move): Camera_new = T · Camera_old.
  useEffect(() => {
    if (!target) return;
    let raf = 0;
    const step = () => {
      setCam((c) => {
        const nx = c.x + (target.x - c.x) * 0.18;
        const ny = c.y + (target.y - c.y) * 0.18;
        if (Math.hypot(target.x - nx, target.y - ny) < 1) {
          setTarget(null);
          return clampCam(target.x, target.y, c.z);
        }
        raf = requestAnimationFrame(step);
        return clampCam(nx, ny, c.z);
      });
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  // world → viewport (the right panel, drawn in its own 1000×700 box)
  const toVp = (x: number, y: number) => ({
    x: ((x - camLeft) / sensorW) * WORLD_W,
    y: ((y - camTop) / sensorH) * WORLD_H,
  });

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        {/* WORLD panel */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            世界 (World) · 拖动取景框
          </p>
          <svg
            ref={worldRef}
            viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
            className="w-full touch-none rounded-lg border border-border bg-muted/30"
            onClick={(e) => {
              // click empty world to recenter camera there
              if (drag.current) return;
              const w = clientToWorld(e.clientX, e.clientY);
              setCam((c) => clampCam(w.x, w.y, c.z));
            }}
          >
            {/* grid */}
            {Array.from({ length: 11 }, (_, i) => (
              <line key={`v${i}`} x1={i * 100} y1={0} x2={i * 100} y2={WORLD_H} stroke="var(--border)" strokeWidth={1} />
            ))}
            {Array.from({ length: 8 }, (_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 100} x2={WORLD_W} y2={i * 100} stroke="var(--border)" strokeWidth={1} />
            ))}
            {/* landmarks */}
            {LANDMARKS.map((m) => (
              <g key={m.id}>
                <circle cx={m.x} cy={m.y} r={14} fill={m.color} />
                <text x={m.x + 22} y={m.y + 6} fontSize={26} fill="var(--foreground)">{m.label}</text>
              </g>
            ))}
            {/* picked world point */}
            {picked && (
              <g>
                <circle cx={picked.x} cy={picked.y} r={9} fill="none" stroke="var(--destructive)" strokeWidth={3} />
                <line x1={picked.x - 16} y1={picked.y} x2={picked.x + 16} y2={picked.y} stroke="var(--destructive)" strokeWidth={2} />
                <line x1={picked.x} y1={picked.y - 16} x2={picked.x} y2={picked.y + 16} stroke="var(--destructive)" strokeWidth={2} />
              </g>
            )}
            {/* camera frame (draggable) */}
            <rect
              x={camLeft}
              y={camTop}
              width={sensorW}
              height={sensorH}
              fill="var(--primary)"
              fillOpacity={0.08}
              stroke="var(--primary)"
              strokeWidth={3}
              className="cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => {
                e.stopPropagation();
                const w = clientToWorld(e.clientX, e.clientY);
                drag.current = { ox: w.x, oy: w.y, cx: cam.x, cy: cam.y };
              }}
            />
            <text x={camLeft + 8} y={camTop + 24} fontSize={20} fill="var(--primary)" fontWeight={600}>
              Camera
            </text>
          </svg>
        </div>

        {/* VIEWPORT panel */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            相机拍到的 (Viewport) · 点击拾取
          </p>
          <svg
            viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
            className="w-full cursor-crosshair rounded-lg border border-border bg-background"
            onClick={(e) => {
              const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
              const px = ((e.clientX - r.left) / r.width) * WORLD_W;
              const py = ((e.clientY - r.top) / r.height) * WORLD_H;
              // viewport → world (inverse of toVp)
              setPicked({ x: camLeft + (px / WORLD_W) * sensorW, y: camTop + (py / WORLD_H) * sensorH });
            }}
          >
            {LANDMARKS.map((m) => {
              const p = toVp(m.x, m.y);
              const r = 14 * cam.z;
              return (
                <g key={m.id}>
                  <circle cx={p.x} cy={p.y} r={r} fill={m.color} />
                  <text x={p.x + r + 8} y={p.y + 8} fontSize={26 * cam.z} fill="var(--foreground)">{m.label}</text>
                </g>
              );
            })}
            {picked && (
              <g>
                {(() => {
                  const p = toVp(picked.x, picked.y);
                  return (
                    <>
                      <line x1={p.x - 18} y1={p.y} x2={p.x + 18} y2={p.y} stroke="var(--destructive)" strokeWidth={2} />
                      <line x1={p.x} y1={p.y - 18} x2={p.x} y2={p.y + 18} stroke="var(--destructive)" strokeWidth={2} />
                    </>
                  );
                })()}
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* controls */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="text-muted-foreground">缩放</span>
        <Button size="sm" variant="secondary" onClick={() => setCam((c) => clampCam(c.x, c.y, clamp(c.z * 1.25, 0.7, 4)))}>
          放大 +
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setCam((c) => clampCam(c.x, c.y, clamp(c.z / 1.25, 0.7, 4)))}>
          缩小 −
        </Button>
        <Button size="sm" onClick={() => setTarget({ x: LANDMARKS[3].x, y: LANDMARKS[3].y })}>
          把焦点移到 🎯 E
        </Button>
        <span className="ml-auto font-mono text-xs tabular-nums text-muted-foreground">
          相机中心 ({Math.round(cam.x)}, {Math.round(cam.y)}) · zoom {cam.z.toFixed(2)}
          {picked && ` · 拾取世界坐标 (${Math.round(picked.x)}, ${Math.round(picked.y)})`}
        </span>
      </div>
    </div>
  );
}
