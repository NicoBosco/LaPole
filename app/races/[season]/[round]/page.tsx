import { notFound } from "next/navigation";
import Link from "next/link";
import { getRaceResults } from "@/lib/api/races";
import { getTeamMeta } from "@/constants/teams";
import { formatRaceDate } from "@/lib/utils/formatters";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

interface RaceDetailPageProps {
  params: Promise<{ season: string; round: string }>;
}

export async function generateMetadata({ params }: RaceDetailPageProps) {
  const { season, round } = await params;
  const race = await getRaceResults(season, round).catch(() => null);
  if (!race) return { title: "Carrera no encontrada" };
  return {
    title: `${race.raceName} ${season}`,
    description: `Resultados completos de la ${race.raceName} ${season}, Ronda ${round}.`,
  };
}

export default async function RaceDetailPage({ params }: RaceDetailPageProps) {
  const { season, round } = await params;

  const race = await getRaceResults(season, round).catch(() => null);
  if (!race) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={`/?season=${season}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-f1-red)] transition-colors"
      >
        ← Volver al Dashboard
      </Link>

      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden mb-6">
        <div className="h-1.5 bg-[var(--color-f1-red)]" />
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                Temporada {season} · Ronda {round}
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
                {race.raceName}
              </h1>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                🗺️ {race.locality}, {race.country}
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                🏟️ {race.circuitName} · 📅 {formatRaceDate(race.date)}
              </p>
            </div>
            <Badge variant="success" className="text-sm px-3 py-1.5">
              ✅ Finalizada
            </Badge>
          </div>
        </div>
      </div>

      {race.results.length === 0 ? (
        <EmptyState title="Sin resultados disponibles" icon="🏁" />
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="min-w-[520px]">
            <div className="grid grid-cols-[2.5rem_1fr_auto_auto_auto] items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Pos</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Piloto</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hidden sm:block">Tiempo / Estado</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hidden sm:block">Vuelta Rápida</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] text-right">Pts</span>
            </div>

            {race.results.map((result) => {
              const teamMeta = getTeamMeta(result.teamId);
              const isTopThree = result.position <= 3;
              const isDNF = result.status !== "Finished" && !result.status.startsWith("+");

              return (
                <Link
                  key={result.driverId}
                  href={`/drivers/${result.driverId}?season=${season}`}
                  className="grid grid-cols-[2.5rem_1fr_auto_auto_auto] items-center gap-3 px-4 py-3 border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-raised)] transition-colors group"
                >
                  <span className={`text-sm font-black tabular-nums ${isTopThree ? "text-[var(--color-f1-red)]" : "text-[var(--color-text-muted)]"}`}>
                    {result.positionText}
                  </span>

                  <div className="flex items-center gap-3 min-w-0">
                    <span className="h-5 w-1 shrink-0 rounded-full" style={{ backgroundColor: teamMeta.primaryColor }} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-f1-red)] transition-colors truncate">
                        {result.driverName}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-xs text-[var(--color-text-muted)]">{teamMeta.shortName}</p>
                        {result.isFastestLap && <span className="text-xs text-purple-400 font-semibold">⚡ Vuelta rápida</span>}
                      </div>
                    </div>
                  </div>

                  <span className={`text-sm tabular-nums hidden sm:block ${isDNF ? "text-amber-400" : "text-[var(--color-text-secondary)]"}`}>
                    {isDNF ? result.status : (result.time ?? result.status)}
                  </span>

                  <span className="text-xs text-[var(--color-text-muted)] hidden sm:block tabular-nums">
                    {result.fastestLapTime ?? "—"}
                  </span>

                  <span className="text-sm font-bold text-[var(--color-text-primary)] tabular-nums text-right">
                    {result.points}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
