"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

// Deterministic pseudo-data from the seed so each sparkline is stable.
// Illustrative only, not real market data.
function generateSparkline(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++)
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  const points = [];
  let value = 50;
  for (let i = 0; i < 12; i++) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    value += (hash % 21) - 10;
    value = Math.max(10, Math.min(90, value));
    points.push({ i, value });
  }
  return points;
}

export function Sparkline({ seed }: { seed: string }) {
  const data = generateSparkline(seed);
  const up = data[data.length - 1].value >= data[0].value;

  return (
    <div style={{ height: 40, width: 96, flex: "none" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={up ? "#16a34a" : "#dc2626"}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
