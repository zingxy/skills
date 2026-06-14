// Local --W--> World --View--> Camera --Viewport--> Screen
const STEPS = [
  { space: 'Local', note: '物体自己的坐标' },
  { matrix: 'W', hint: '世界变换' },
  { space: 'World', note: '唯一的全局空间' },
  { matrix: 'View', hint: '= Camera⁻¹' },
  { space: 'Camera', note: '取景框内的坐标' },
  { matrix: 'Viewport', hint: 'dpr 缩放' },
  { space: 'Screen', note: '屏幕像素' },
];

export function PipelineDiagram() {
  return (
    <div className="flex flex-wrap items-stretch gap-y-3 overflow-x-auto py-2">
      {STEPS.map((s, i) =>
        'space' in s ? (
          <div
            key={i}
            className="flex min-w-24 flex-col items-center justify-center rounded-lg border border-border bg-card px-4 py-3 text-center"
          >
            <span className="font-mono text-sm font-semibold text-foreground">{s.space}</span>
            <span className="mt-1 text-xs text-muted-foreground">{s.note}</span>
          </div>
        ) : (
          <div key={i} className="flex min-w-16 flex-col items-center justify-center px-1 text-center">
            <span className="font-mono text-xs font-medium text-primary">×{s.matrix}</span>
            <span className="text-lg leading-none text-muted-foreground">→</span>
            <span className="text-[10px] text-muted-foreground">{s.hint}</span>
          </div>
        ),
      )}
    </div>
  );
}
