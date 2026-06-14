import { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

// Loss landscape: a simple bowl with its lowest point at w = 2.
const L = (w: number) => (w - 2) ** 2 + 0.5;
const grad = (w: number) => 2 * (w - 2);

const W_MIN = -3;
const W_MAX = 7;
const L_MAX = 26;
const START = -2.4;

// SVG plot mapping.
const X = (w: number) => 40 + ((w - W_MIN) / (W_MAX - W_MIN)) * 540;
const Y = (loss: number) => 300 - (loss / L_MAX) * 280;

const curve = (() => {
  const pts: string[] = [];
  for (let w = W_MIN; w <= W_MAX; w += 0.1) pts.push(`${X(w)},${Y(L(w))}`);
  return pts.join(' ');
})();

type Status = 'rolling' | 'converged' | 'diverged' | 'oscillating';

export function GradientDescent1D() {
  const [lr, setLr] = useState(0.1);
  const [w, setW] = useState(START);
  const [trail, setTrail] = useState<number[]>([START]);
  const [steps, setSteps] = useState(0);
  const [running, setRunning] = useState(true);
  const [status, setStatus] = useState<Status>('rolling');

  const reset = useCallback((nextLr = lr) => {
    setLr(nextLr);
    setW(START);
    setTrail([START]);
    setSteps(0);
    setStatus('rolling');
    setRunning(true);
  }, [lr]);

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => {
      const g = grad(w);
      if (Math.abs(g) < 0.05) {
        setStatus('converged');
        setRunning(false);
        return;
      }
      const next = w - lr * g;
      if (Math.abs(next) > 11 || steps >= 26) {
        setStatus(Math.abs(next) > 11 ? 'diverged' : 'oscillating');
        setRunning(false);
        return;
      }
      setW(next);
      setTrail((t) => [...t, next]);
      setSteps((s) => s + 1);
    }, 600);
    return () => clearTimeout(id);
  }, [running, w, lr, steps]);

  const statusText: Record<Status, string> = {
    rolling: 'rolling downhill…',
    converged: 'reached the bottom 🎯',
    diverged: 'steps too big — overshooting into the void 💥',
    oscillating: 'bouncing across the valley, never settling ↔',
  };
  const statusColor =
    status === 'converged'
      ? 'text-chart-5'
      : status === 'diverged' || status === 'oscillating'
        ? 'text-destructive'
        : 'text-muted-foreground';

  return (
    <div>
      <svg viewBox="0 0 600 320" className="w-full">
        {/* loss curve */}
        <polyline points={curve} fill="none" stroke="var(--border)" strokeWidth={2} />
        {/* minimum marker */}
        <line x1={X(2)} y1={Y(L(2))} x2={X(2)} y2={300} stroke="var(--chart-5)" strokeWidth={1} strokeDasharray="3 3" />
        <text x={X(2)} y={Y(L(2)) - 8} textAnchor="middle" fontSize={11} fill="var(--chart-5)">
          minimum
        </text>
        {/* trail of past steps */}
        {trail.map((tw, i) => (
          <circle key={i} cx={X(tw)} cy={Y(L(tw))} r={3} fill="var(--chart-1)" opacity={0.25} />
        ))}
        {/* the ball */}
        <motion.circle
          r={9}
          fill="var(--chart-1)"
          initial={{ cx: X(START), cy: Y(L(START)) }}
          animate={{ cx: X(w), cy: Y(L(w)) }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        />
        <text x={40} y={315} fontSize={11} fill="var(--muted-foreground)">
          weight w →
        </text>
      </svg>

      {/* controls */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">learning rate</span>
          <input
            type="range"
            min={0.05}
            max={1.05}
            step={0.05}
            value={lr}
            onChange={(e) => reset(Number(e.target.value))}
            className="accent-[var(--primary)]"
          />
          <span className="w-10 font-mono tabular-nums">{lr.toFixed(2)}</span>
        </label>
        <div className="flex items-center gap-4 text-sm">
          <span className={statusColor}>{statusText[status]}</span>
          <Button size="sm" variant="secondary" onClick={() => reset()}>
            Replay
          </Button>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Step {steps} · loss {L(w).toFixed(2)} — try a tiny rate (slow but safe), then push it past
        1.0 and watch it overshoot.
      </p>
    </div>
  );
}
