import { motion } from 'motion/react';

const COLS = [70, 300, 530];
const LAYERS = [3, 4, 2];

function nodes(layer: number) {
  const n = LAYERS[layer];
  const gap = 240 / (n + 1);
  return Array.from({ length: n }, (_, i) => ({ x: COLS[layer], y: 30 + gap * (i + 1) }));
}

const L0 = nodes(0);
const L1 = nodes(1);
const L2 = nodes(2);
const edges = [
  ...L0.flatMap((a) => L1.map((b) => ({ a, b }))),
  ...L1.flatMap((a) => L2.map((b) => ({ a, b }))),
];

// A few pulses that travel left→right to suggest the forward pass.
const pulses = [
  { a: L0[0], b: L1[1], delay: 0 },
  { a: L0[2], b: L1[2], delay: 0.4 },
  { a: L1[1], b: L2[0], delay: 0.9 },
  { a: L1[3], b: L2[1], delay: 1.2 },
];

export function NetworkDiagram() {
  return (
    <div className="w-full">
      <svg viewBox="0 0 600 300" className="w-full">
        {edges.map((e, i) => (
          <line
            key={i}
            x1={e.a.x}
            y1={e.a.y}
            x2={e.b.x}
            y2={e.b.y}
            stroke="var(--border)"
            strokeWidth={1}
          />
        ))}
        {pulses.map((p, i) => (
          <motion.circle
            key={i}
            r={4}
            fill="var(--chart-1)"
            initial={{ cx: p.a.x, cy: p.a.y, opacity: 0 }}
            animate={{ cx: [p.a.x, p.b.x], cy: [p.a.y, p.b.y], opacity: [0, 1, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}
        {[L0, L1, L2].flat().map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={16} fill="var(--card)" stroke="var(--primary)" strokeWidth={1.5} />
        ))}
        {['input', 'hidden', 'output'].map((label, i) => (
          <text key={label} x={COLS[i]} y={288} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)">
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}
