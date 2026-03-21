"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { ProcessedRaceWithResults } from "@/types/race";

interface ConstructorPerformanceChartProps {
  currentResults: ProcessedRaceWithResults[];
  previousResults: ProcessedRaceWithResults[];
  currentYear: string;
  previousYear: string;
  teamColor: string;
}

function buildCumulativeData(
  currentResults: ProcessedRaceWithResults[],
  previousResults: ProcessedRaceWithResults[],
) {
  const map: Record<
    number,
    { ptsPrev?: number; ptsCurr?: number; label: string }
  > = {};

  let cumulPrev = 0;
  previousResults.forEach((r) => {
    const round = r.round;
    cumulPrev += r.results.reduce((s, res) => s + res.points, 0);
    map[round] = { ...map[round], ptsPrev: cumulPrev, label: `R${round}` };
  });

  let cumulCurr = 0;
  currentResults.forEach((r) => {
    const round = r.round;
    cumulCurr += r.results.reduce((s, res) => s + res.points, 0);
    map[round] = { ...map[round], ptsCurr: cumulCurr, label: `R${round}` };
  });

  return Object.entries(map)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([round, v]) => ({ round: parseInt(round), ...v }));
}

export function ConstructorPerformanceChart({
  currentResults,
  previousResults,
  currentYear,
  previousYear,
  teamColor,
}: ConstructorPerformanceChartProps) {
  const data = buildCumulativeData(currentResults, previousResults);
  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart
        data={data}
        margin={{ top: 4, right: 16, left: -10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis
          dataKey="label"
          tick={{ fill: "#71717a", fontSize: 11 }}
          axisLine={{ stroke: "#3f3f46" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#71717a", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          labelStyle={{ color: "#e4e4e7", fontWeight: 600 }}
          itemStyle={{ color: "#a1a1aa" }}
        />
        <Legend
          wrapperStyle={{
            fontSize: "12px",
            color: "#a1a1aa",
            paddingTop: "12px",
          }}
        />
        {previousResults.length > 0 && (
          <Line
            type="monotone"
            dataKey="ptsPrev"
            name={previousYear}
            stroke="#71717a"
            strokeWidth={2}
            dot={{ r: 3, fill: "#71717a" }}
            activeDot={{ r: 5 }}
            connectNulls
          />
        )}
        {currentResults.length > 0 && (
          <Line
            type="monotone"
            dataKey="ptsCurr"
            name={currentYear}
            stroke={teamColor}
            strokeWidth={2.5}
            dot={{ r: 3, fill: teamColor }}
            activeDot={{ r: 5 }}
            connectNulls
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
