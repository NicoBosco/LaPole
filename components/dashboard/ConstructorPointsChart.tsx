"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ProcessedConstructor } from "@/types/constructor";
import { getTeamMeta } from "@/constants/teams";

interface ConstructorPointsChartProps {
  standings: ProcessedConstructor[];
}

export function ConstructorPointsChart({
  standings,
}: ConstructorPointsChartProps) {
  const data = standings.map((s) => {
    const meta = getTeamMeta(s.constructorId);
    return {
      name: meta.shortName,
      pts: s.points,
      color: meta.primaryColor,
    };
  });

  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border)"
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={80}
          interval={0}
          tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
          contentStyle={{
            backgroundColor: "var(--color-surface-raised)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            fontSize: "12px",
            color: "var(--color-text-primary)",
          }}
          formatter={(value) => [`${value} pts`, "Puntos"]}
        />
        <Bar dataKey="pts" radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
