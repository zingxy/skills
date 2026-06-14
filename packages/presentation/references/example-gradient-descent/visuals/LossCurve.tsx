import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Loss falling over training epochs — fast at first, then flattening.
const data = Array.from({ length: 21 }, (_, epoch) => ({
  epoch,
  loss: +(8 * Math.exp(-epoch / 4) + 0.3).toFixed(2),
}));

export function LossCurve() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ left: 8, right: 16, top: 8 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis
            dataKey="epoch"
            stroke="var(--muted-foreground)"
            fontSize={12}
            label={{ value: 'training epoch', position: 'insideBottom', offset: -2, fontSize: 12, fill: 'var(--muted-foreground)' }}
          />
          <YAxis stroke="var(--muted-foreground)" fontSize={12} width={32} />
          <Tooltip
            cursor={{ stroke: 'var(--border)' }}
            contentStyle={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              color: 'var(--foreground)',
            }}
          />
          <Line
            type="monotone"
            dataKey="loss"
            stroke="var(--chart-1)"
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
