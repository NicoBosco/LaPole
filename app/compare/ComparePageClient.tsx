"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ProcessedDriver } from "@/types/driver";
import { getTeamMeta } from "@/constants/teams";
import { getNationalityFlag } from "@/lib/utils/formatters";
import { EmptyState } from "@/components/ui/EmptyState";
import { SeasonSelector } from "@/components/ui/SeasonSelector";

interface ComparePageClientProps {
  standings: ProcessedDriver[];
  season: string;
}

export function ComparePageClient({
  standings,
  season,
}: ComparePageClientProps) {
  const [idA, setIdA] = useState<string>("");
  const [idB, setIdB] = useState<string>("");

  const driverA = standings.find((s) => s.driverId === idA);
  const driverB = standings.find((s) => s.driverId === idB);

  const samePicked = idA && idB && idA === idB;
  const bothPicked = driverA && driverB && !samePicked;

  const chartData = bothPicked
    ? [
        {
          stat: "Puntos",
          [driverA.lastName]: driverA.points,
          [driverB.lastName]: driverB.points,
        },
        {
          stat: "Victorias",
          [driverA.lastName]: driverA.wins,
          [driverB.lastName]: driverB.wins,
        },
        {
          stat: "Posición",
          [driverA.lastName]: driverA.position,
          [driverB.lastName]: driverB.position,
        },
      ]
    : [];

  const teamMetaA = driverA ? getTeamMeta(driverA.teamId) : null;
  const teamMetaB = driverB ? getTeamMeta(driverB.teamId) : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 animate-fade-in-up">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
              Comparar Pilotos
            </h1>
            <p className="mt-1 text-[var(--color-text-secondary)]">
              Estadísticas lado a lado — Temporada {season}
            </p>
          </div>
          <SeasonSelector currentSeason={season} />
        </div>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 animate-fade-in-up"
        style={{ animationDelay: "0.05s" }}
      >
        <DriverSelect
          label="Piloto A"
          value={idA}
          onChange={setIdA}
          standings={standings}
          excludeId={idB}
          accentColor="#e10600"
        />
        <DriverSelect
          label="Piloto B"
          value={idB}
          onChange={setIdB}
          standings={standings}
          excludeId={idA}
          accentColor="#3b82f6"
        />
      </div>

      {!idA && !idB && (
        <EmptyState
          title="Compara dos pilotos"
          description="Selecciona un piloto en cada desplegable para ver su rendimiento frente a frente."
          icon="🏎️"
        />
      )}

      {(idA || idB) && !bothPicked && !samePicked && (
        <EmptyState
          title="Falta un piloto"
          description="Para completar la comparativa, elige a otro corredor en el selector vacío."
          icon="👆"
        />
      )}

      {samePicked && (
        <EmptyState
          title="Pilotos idénticos"
          description="Por favor, selecciona dos competidores diferentes para ver sus diferencias."
          icon="⚠️"
        />
      )}

      {bothPicked && driverA && driverB && teamMetaA && teamMetaB && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-4">
            <DriverCompareCard driver={driverA} accent="#e10600" />
            <DriverCompareCard driver={driverB} accent="#3b82f6" />
          </div>

          <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="min-w-[380px]">
              <div className="grid grid-cols-3 border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                <span style={{ color: "#e10600" }}>{driverA.lastName}</span>
                <span className="text-center">Stat</span>
                <span className="text-right" style={{ color: "#3b82f6" }}>
                  {driverB.lastName}
                </span>
              </div>
              {[
                {
                  label: "Posición",
                  a: driverA.position + "°",
                  b: driverB.position + "°",
                  aWins: driverA.position < driverB.position,
                },
                {
                  label: "Puntos",
                  a: driverA.points,
                  b: driverB.points,
                  aWins: driverA.points > driverB.points,
                },
                {
                  label: "Victorias",
                  a: driverA.wins,
                  b: driverB.wins,
                  aWins: driverA.wins > driverB.wins,
                },
                {
                  label: "Equipo",
                  a: teamMetaA.shortName,
                  b: teamMetaB.shortName,
                  aWins: null,
                },
                {
                  label: "Número",
                  a: `#${driverA.number || "—"}`,
                  b: `#${driverB.number || "—"}`,
                  aWins: null,
                },
                {
                  label: "Nacionalidad",
                  a:
                    getNationalityFlag(driverA.nationality) +
                    " " +
                    (driverA.nationality || "—"),
                  b:
                    getNationalityFlag(driverB.nationality) +
                    " " +
                    (driverB.nationality || "—"),
                  aWins: null,
                },
              ].map(({ label, a, b, aWins }) => (
                <div
                  key={label}
                  className="grid grid-cols-3 items-center border-b border-[var(--color-border)] last:border-0 px-4 py-3"
                >
                  <span
                    className={`text-sm font-semibold tabular-nums ${aWins === true ? "text-[#e10600]" : "text-[var(--color-text-primary)]"}`}
                  >
                    {a} {aWins === true && "✓"}
                  </span>
                  <span className="text-center text-xs text-[var(--color-text-muted)]">
                    {label}
                  </span>
                  <span
                    className={`text-right text-sm font-semibold tabular-nums ${aWins === false ? "text-[#3b82f6]" : "text-[var(--color-text-primary)]"}`}
                  >
                    {aWins === false && "✓ "}
                    {b}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
              Comparativa visual de puntos y victorias
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={chartData}
                margin={{ top: 0, right: 8, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="stat"
                  tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-surface-raised)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "var(--color-text-primary)",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: "12px",
                    color: "var(--color-text-secondary)",
                  }}
                />
                <Bar
                  dataKey={driverA.lastName}
                  fill="#e10600"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey={driverB.lastName}
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link
              href={`/drivers/${driverA.driverId}?season=${season}`}
              className="flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] hover:border-[#e10600]/40 hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] transition-all"
            >
              Ver perfil de {driverA.lastName} →
            </Link>
            <Link
              href={`/drivers/${driverB.driverId}?season=${season}`}
              className="flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] hover:border-[#3b82f6]/40 hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] transition-all"
            >
              Ver perfil de {driverB.lastName} →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function DriverSelect({
  label,
  value,
  onChange,
  standings,
  excludeId,
  accentColor,
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
  standings: ProcessedDriver[];
  excludeId: string;
  accentColor: string;
}) {
  return (
    <div>
      <label
        className="block text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color: accentColor }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-subtle)] transition-colors hover:border-[var(--color-border-subtle)]"
        aria-label={label}
      >
        <option value="">— Seleccioná un piloto —</option>
        {standings
          .filter((s) => s.driverId !== excludeId)
          .map((s) => (
            <option key={s.driverId} value={s.driverId}>
              #{s.position} {s.fullName}
            </option>
          ))}
      </select>
    </div>
  );
}

function DriverCompareCard({
  driver,
  accent,
}: {
  driver: ProcessedDriver;
  accent: string;
}) {
  const teamMeta = getTeamMeta(driver.teamId);
  const flag = getNationalityFlag(driver.nationality);

  return (
    <div
      className="rounded-[var(--radius-lg)] border bg-[var(--color-surface)] overflow-hidden"
      style={{ borderColor: `${accent}40` }}
    >
      <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-2xl font-black tabular-nums"
            style={{ color: accent }}
          >
            {driver.position}°
          </span>
          {driver.code && (
            <span className="text-xs font-bold tracking-widest text-[var(--color-text-muted)] border border-[var(--color-border)] rounded px-1.5 py-0.5">
              {driver.code}
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">
          {driver.firstName}
        </p>
        <p className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
          {driver.lastName}
        </p>
        <p
          className="text-xs font-medium mb-3"
          style={{ color: teamMeta.primaryColor }}
        >
          {teamMeta.shortName}
        </p>
        <div className="flex gap-2 text-xs text-[var(--color-text-muted)]">
          <span>
            {flag} {driver.nationality}
          </span>
          {driver.number && <span>· #{driver.number}</span>}
        </div>
      </div>
    </div>
  );
}
