import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Transformer, Text } from 'react-konva';
import type Konva from 'konva';
import { getKonvaTheme } from './konva-theme';

// Teach: boundBoxFunc is the single hook between "the reader's new box" and
// "what actually gets applied". Konva calls boundBoxFunc(oldBox, newBox); if it
// returns a box, THAT replaces newBox. Toggle a min-size guard and feel the
// box refuse to shrink past the limit — the floor is enforced by returning
// oldBox whenever the new box is too small.

const W = 560;
const H = 320;
const MIN = 60;

export function BoundBoxDemo() {
  const theme = getKonvaTheme();
  const rectRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const [guard, setGuard] = useState(true);
  const guardRef = useRef(guard);
  guardRef.current = guard;
  const [size, setSize] = useState({ w: 200, h: 130 });

  useEffect(() => {
    if (trRef.current && rectRef.current) {
      trRef.current.nodes([rectRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, []);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div className="overflow-hidden rounded-lg" style={{ background: theme.surfaceSoft }}>
          <Stage width={W} height={H} className="mx-auto block w-full max-w-full" style={{ height: 'auto' }}>
            <Layer>
              <Rect
                ref={rectRef}
                x={180}
                y={95}
                width={200}
                height={130}
                fill={theme.chart2}
                opacity={0.85}
                cornerRadius={6}
                draggable
                onTransform={() => {
                  const n = rectRef.current!;
                  setSize({
                    w: Math.round(n.width() * n.scaleX()),
                    h: Math.round(n.height() * n.scaleY()),
                  });
                }}
              />
              <Transformer
                ref={trRef}
                rotateEnabled={false}
                anchorStroke={theme.chart2}
                anchorFill={theme.card}
                anchorSize={11}
                borderStroke={theme.chart2}
                borderDash={[4, 4]}
                boundBoxFunc={(oldBox, newBox) => {
                  // The heart of it: refuse boxes below MIN when guard is on.
                  if (guardRef.current && (Math.abs(newBox.width) < MIN || Math.abs(newBox.height) < MIN)) {
                    return oldBox; // veto → keep the last valid box
                  }
                  return newBox;
                }}
              />
              <Text text={`试着把它缩到很小`} x={16} y={H - 28} fontSize={13} fill={theme.muted} />
            </Layer>
          </Stage>
        </div>

        <div className="min-w-[190px] space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={guard} onChange={(e) => setGuard(e.target.checked)}
              className="accent-[var(--primary)]" />
            <span>boundBoxFunc 最小尺寸约束 (≥ {MIN}px)</span>
          </label>
          <div className="rounded-lg border border-border p-3 font-mono text-sm tabular-nums">
            <div className="flex justify-between">
              <span className="text-muted-foreground">当前 width</span>
              <span style={{ color: size.w <= MIN + 1 && guard ? theme.primary : undefined }}>{size.w}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">当前 height</span>
              <span style={{ color: size.h <= MIN + 1 && guard ? theme.primary : undefined }}>{size.h}</span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            关掉约束:能缩成一条线甚至翻面。打开:缩到 {MIN}px 就<strong>卡住</strong>——
            因为函数返回了 <span className="font-mono">oldBox</span>,否决了这一帧的新框。
          </p>
        </div>
      </div>
    </div>
  );
}
