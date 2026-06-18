import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Transformer, Text } from 'react-konva';
import type Konva from 'konva';
import { getKonvaTheme } from './konva-theme';

type Attrs = {
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
};

const W = 600;
const H = 360;

export function TransformerPlayground() {
  const theme = getKonvaTheme();
  const rectRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const [attrs, setAttrs] = useState<Attrs>({
    x: 240,
    y: 130,
    width: 140,
    height: 90,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
  });

  const read = () => {
    const n = rectRef.current;
    if (!n) return;
    setAttrs({
      x: Math.round(n.x()),
      y: Math.round(n.y()),
      width: n.width(),
      height: n.height(),
      scaleX: n.scaleX(),
      scaleY: n.scaleY(),
      rotation: n.rotation(),
    });
  };

  // Attach the transformer to the rect once mounted.
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
                x={attrs.x}
                y={attrs.y}
                width={attrs.width}
                height={attrs.height}
                fill={theme.chart1}
                opacity={0.85}
                cornerRadius={6}
                draggable
                onDragMove={read}
                onTransform={read}
              />
              <Transformer
                ref={trRef}
                rotateEnabled
                anchorStroke={theme.primary}
                anchorFill={theme.card}
                anchorSize={11}
                borderStroke={theme.primary}
                borderDash={[4, 4]}
                rotateAnchorOffset={28}
              />
              <Text
                text="拖角缩放 · 拖上方的把手旋转 · 拖整体移动"
                x={16}
                y={H - 28}
                fontSize={13}
                fill={theme.muted}
              />
            </Layer>
          </Stage>
        </div>

        <ReadoutPanel attrs={attrs} theme={theme} />
      </div>
    </div>
  );
}

function ReadoutPanel({ attrs, theme }: { attrs: Attrs; theme: ReturnType<typeof getKonvaTheme> }) {
  const rows: [string, string, boolean][] = [
    ['x', attrs.x.toFixed(0), false],
    ['y', attrs.y.toFixed(0), false],
    ['width', attrs.width.toFixed(0), false],
    ['height', attrs.height.toFixed(0), false],
    ['scaleX', attrs.scaleX.toFixed(3), Math.abs(attrs.scaleX - 1) > 0.01],
    ['scaleY', attrs.scaleY.toFixed(3), Math.abs(attrs.scaleY - 1) > 0.01],
    ['rotation', attrs.rotation.toFixed(1) + '°', Math.abs(attrs.rotation) > 0.5],
  ];
  return (
    <div className="min-w-[180px] rounded-lg border border-border p-4">
      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        图形当前的属性
      </div>
      <table className="w-full font-mono text-sm tabular-nums">
        <tbody>
          {rows.map(([k, v, hot]) => (
            <tr key={k}>
              <td className="py-0.5 pr-3 text-muted-foreground">{k}</td>
              <td
                className="py-0.5 text-right"
                style={{ color: hot ? theme.primary : undefined, fontWeight: hot ? 600 : 400 }}
              >
                {v}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        缩放时<strong>变的是 scaleX/scaleY</strong>,width/height 一动不动。这就是第一个线索。
      </p>
    </div>
  );
}
