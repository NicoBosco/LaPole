import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getConstructorById,
  getConstructorCurrentStanding,
  getConstructorSeasonResults,
} from "@/lib/api/constructors";
import { getDriverStandings } from "@/lib/api/races";
import { getTeamMeta } from "@/constants/teams";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SeasonSelector } from "@/components/ui/SeasonSelector";
import { resolveSeason, getComparisonSeasons } from "@/lib/utils/season";
import { ConstructorPerformanceChart } from "@/components/constructors/ConstructorPerformanceChart";

interface ConstructorDetailPageProps {
  params: Promise<{ constructorId: string }>;
  searchParams: Promise<{ season?: string }>;
}

export async function generateMetadata({ params }: ConstructorDetailPageProps) {
  const { constructorId } = await params;
  const teamMeta = getTeamMeta(constructorId);
  return {
    title: teamMeta.name,
    description: `Resultados y trayectoria de ${teamMeta.name} en la Fórmula 1.`,
  };
}

export default async function ConstructorDetailPage({
  params,
  searchParams,
}: ConstructorDetailPageProps) {
  const { constructorId } = await params;
  const sp = await searchParams;
  const season = resolveSeason(sp.season);
  const [currentYear, prevYear] = getComparisonSeasons(season);

  const teamMeta = getTeamMeta(constructorId);

  const [
    constructor,
    standing,
    driverStandings,
    currentResults,
    previousResults,
  ] = await Promise.all([
    getConstructorById(constructorId).catch(() => null),
    getConstructorCurrentStanding(constructorId, season).catch(() => null),
    getDriverStandings(season).catch(() => []),
    getConstructorSeasonResults(constructorId, currentYear).catch(() => []),
    getConstructorSeasonResults(constructorId, prevYear).catch(() => []),
  ]);

  if (!constructor) notFound();

  const teamDrivers = driverStandings.filter((s) => s.teamId === constructorId);

  const hasChart = previousResults.length > 0 || currentResults.length > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href={`/constructors?season=${season}`}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-f1-red)] transition-colors"
        >
          ← Volver a la lista
        </Link>
        <Suspense fallback={null}>
          <SeasonSelector currentSeason={season} />
        </Suspense>
      </div>

      <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] mb-6">
        <div
          className="h-1.5 w-full"
          style={{ backgroundColor: teamMeta.primaryColor }}
        />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                {constructor.nationality} · Temporada {season}
              </p>
              <h1 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight leading-tight">
                {teamMeta.shortName}
              </h1>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                {teamMeta.name}
              </p>
              {standing && (
                <Badge
                  variant="team"
                  className="mt-3 text-sm px-3 py-1"
                  style={{
                    backgroundColor: `${teamMeta.primaryColor}18`,
                    color: teamMeta.primaryColor,
                    borderColor: `${teamMeta.primaryColor}30`,
                  }}
                >
                  Temporada {season}: {standing.position}° posición
                </Badge>
              )}
            </div>

            {standing && (
              <div className="flex gap-6 sm:flex-col sm:gap-4 sm:text-right">
                <StatBox
                  label="Posición"
                  value={`${standing.position}°`}
                  highlight
                  color={teamMeta.primaryColor}
                />
                <StatBox label="Puntos" value={standing.points} />
                <StatBox label="Victorias" value={standing.wins} />
              </div>
            )}
          </div>
        </div>
      </div>

      {teamDrivers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
            Pilotos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {teamDrivers.map((s) => (
              <Link
                key={s.driverId}
                href={`/drivers/${s.driverId}?season=${season}`}
                className="flex items-center gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 hover:bg-[var(--color-surface-raised)] hover:border-[var(--color-border-subtle)] transition-all group"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-sm font-black text-white"
                  style={{ backgroundColor: teamMeta.primaryColor }}
                >
                  #{s.number ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-f1-red)] transition-colors">
                    {s.fullName}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {s.code}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Puntos
                  </p>
                  <p className="text-lg font-bold text-[var(--color-text-primary)] tabular-nums">
                    {s.points}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {hasChart && (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 mb-8">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
            Progresión de puntos
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-5">
            Comparativa entre las temporadas {prevYear} y {currentYear}
          </p>
          <ConstructorPerformanceChart
            currentResults={currentResults}
            previousResults={previousResults}
            currentYear={currentYear}
            previousYear={prevYear}
            teamColor={teamMeta.primaryColor}
          />
        </div>
      )}

      {currentResults.length > 0 && (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
          <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Resultados por carrera — {season}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[400px]">
              <div className="grid grid-cols-[2rem_1fr_auto_auto_auto] border-b border-[var(--color-border)] bg-[var(--color-surface-raised)]/50 px-4 py-2.5 gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  R
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Carrera
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Piloto 1
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Piloto 2
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] text-right">
                  Pts
                </span>
              </div>
              {currentResults.map((race) => {
                const totalPoints = race.results.reduce(
                  (sum, r) => sum + r.points,
                  0,
                );
                const driver1 = race.results[0];
                const driver2 = race.results[1];
                return (
                  <Link
                    key={race.round}
                    href={`/races/${season}/${race.round}`}
                    className="grid grid-cols-[2rem_1fr_auto_auto_auto] items-center gap-3 px-4 py-3 border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-raised)] transition-colors"
                  >
                    <span className="text-xs text-[var(--color-text-muted)] tabular-nums">
                      {race.round}
                    </span>
                    <span className="text-sm text-[var(--color-text-primary)] truncate">
                      {race.raceName}
                    </span>
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {driver1
                        ? `P${driver1.positionText} ${driver1.driverName.split(" ").pop()}`
                        : "—"}
                    </span>
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {driver2
                        ? `P${driver2.positionText} ${driver2.driverName.split(" ").pop()}`
                        : "—"}
                    </span>
                    <span className="text-sm font-bold text-[var(--color-text-primary)] tabular-nums text-right">
                      {totalPoints}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!standing && (
        <EmptyState
          title="Sin datos esta temporada"
          description={`No hay registros de puntos ni posición para este equipo en el mundial de ${season}.`}
          icon="📊"
        />
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  highlight = false,
  color,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
  color?: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </p>
      <p
        className={`text-3xl font-black tabular-nums mt-0.5 ${highlight ? "" : "text-[var(--color-text-primary)]"}`}
        style={highlight && color ? { color } : undefined}
      >
        {value}
      </p>
    </div>
  );
}
