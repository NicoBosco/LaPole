import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getDriverById,
  getDriverCurrentStanding,
  getDriverSeasonResults,
} from "@/lib/api/drivers";
import { getTeamMeta } from "@/constants/teams";
import { getNationalityFlag, formatRaceDate } from "@/lib/utils/formatters";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { SeasonSelector } from "@/components/ui/SeasonSelector";
import { resolveSeason, getComparisonSeasons } from "@/lib/utils/season";
import { DriverPerformanceChart } from "@/components/drivers/DriverPerformanceChart";

interface DriverDetailPageProps {
  params: Promise<{ driverId: string }>;
  searchParams: Promise<{ season?: string }>;
}

export async function generateMetadata({ params }: DriverDetailPageProps) {
  const { driverId } = await params;
  const driver = await getDriverById(driverId).catch(() => null);
  if (!driver) return { title: "No encontramos a este piloto" };
  return {
    title: `${driver.givenName} ${driver.familyName}`,
    description: `Estadísticas y trayectoria de ${driver.givenName} ${driver.familyName} en la Fórmula 1.`,
  };
}

export default async function DriverDetailPage({
  params,
  searchParams,
}: DriverDetailPageProps) {
  const { driverId } = await params;
  const sp = await searchParams;
  const season = resolveSeason(sp.season);
  const [currentYear, prevYear] = getComparisonSeasons(season);

  const [driver, standing, currentResults, previousResults] = await Promise.all(
    [
      getDriverById(driverId).catch(() => null),
      getDriverCurrentStanding(driverId, season).catch(() => null),
      getDriverSeasonResults(driverId, currentYear).catch(() => []),
      getDriverSeasonResults(driverId, prevYear).catch(() => []),
    ],
  );

  if (!driver) notFound();

  const teamMeta = getTeamMeta(standing?.teamId ?? "");
  const flag = getNationalityFlag(driver.nationality ?? "");

  const hasChart = previousResults.length > 0 || currentResults.length > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href={`/drivers?season=${season}`}
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
              <div className="flex items-center gap-3 mb-2">
                {driver.permanentNumber && (
                  <span
                    className="text-5xl font-black tabular-nums leading-none"
                    style={{ color: teamMeta.primaryColor }}
                  >
                    #{driver.permanentNumber}
                  </span>
                )}
                {driver.code && (
                  <span className="text-lg font-bold tracking-widest text-[var(--color-text-muted)] border border-[var(--color-border)] rounded px-2 py-1">
                    {driver.code}
                  </span>
                )}
              </div>
              <div className="mb-4">
                <p className="text-lg text-[var(--color-text-secondary)]">
                  {driver.givenName}
                </p>
                <h1 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] leading-tight tracking-tight">
                  {driver.familyName}
                </h1>
              </div>
              <Badge
                variant="team"
                className="text-sm px-3 py-1"
                style={{
                  backgroundColor: `${teamMeta.primaryColor}18`,
                  color: teamMeta.primaryColor,
                  borderColor: `${teamMeta.primaryColor}30`,
                }}
              >
                {teamMeta.name}
              </Badge>
            </div>

            {standing && (
              <div className="flex gap-6 sm:flex-col sm:gap-4 sm:text-right">
                <StatBox
                  label="Posición"
                  value={`${standing.position}°`}
                  highlight
                />
                <StatBox label="Puntos" value={standing.points} />
                <StatBox label="Victorias" value={standing.wins} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <InfoCard
          label="Nacionalidad"
          value={`${flag} ${driver.nationality ?? "—"}`}
        />
        <InfoCard
          label="Fecha de nacimiento"
          value={driver.dateOfBirth ? formatRaceDate(driver.dateOfBirth) : "—"}
        />
        <InfoCard label="Temporada" value={season} />
        <InfoCard
          label="Equipo"
          value={teamMeta.shortName}
          color={teamMeta.primaryColor}
        />
      </div>

      {hasChart && (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 mb-8">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
            Rendimiento por carrera
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-5">
            Puntos acumulados ronda a ronda — comparativa {prevYear} vs{" "}
            {currentYear}
          </p>
          <DriverPerformanceChart
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
              Resultados {season}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[380px]">
              <div className="grid grid-cols-[2rem_1fr_auto_auto] border-b border-[var(--color-border)] bg-[var(--color-surface-raised)]/50 px-4 py-2.5 gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  R
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Carrera
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Pos
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] text-right">
                  Pts
                </span>
              </div>
              {currentResults.map((race) => {
                const res = race.results[0];
                const pos = res?.position ?? 999;
                const isTop3 = pos <= 3;
                return (
                  <Link
                    key={race.round}
                    href={`/races/${season}/${race.round}`}
                    className="grid grid-cols-[2rem_1fr_auto_auto] items-center gap-3 px-4 py-3 border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-raised)] transition-colors"
                  >
                    <span className="text-xs text-[var(--color-text-muted)] tabular-nums">
                      {race.round}
                    </span>
                    <span className="text-sm text-[var(--color-text-primary)] truncate">
                      {race.raceName}
                    </span>
                    <span
                      className={`text-sm font-bold tabular-nums ${isTop3 ? "text-[var(--color-f1-red)]" : "text-[var(--color-text-secondary)]"}`}
                    >
                      {res?.positionText ?? "—"}
                    </span>
                    <span className="text-sm font-bold text-[var(--color-text-primary)] tabular-nums text-right">
                      {res?.points ?? 0}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!standing && (
        <div className="mt-6">
          <EmptyState
            title="Sin registros esta temporada"
            description={`Este piloto no ha puntuado en la temporada ${season} o no hay datos disponibles.`}
            icon="📊"
          />
        </div>
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </p>
      <p
        className={`text-3xl font-black tabular-nums mt-0.5 ${highlight ? "text-[var(--color-f1-red)]" : "text-[var(--color-text-primary)]"}`}
      >
        {value}
      </p>
    </div>
  );
}

function InfoCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
        {label}
      </p>
      <p
        className="text-sm font-medium"
        style={{ color: color ?? "var(--color-text-primary)" }}
      >
        {value}
      </p>
    </div>
  );
}
