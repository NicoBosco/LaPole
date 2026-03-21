import { ProcessedRaceWithResults } from "@/types/race";
import { getTeamMeta } from "@/constants/teams";
import { formatRaceDate } from "@/lib/utils/formatters";
import { Badge } from "@/components/ui/Badge";

interface LastRaceResultsProps {
  race: ProcessedRaceWithResults;
  limit?: number;
}

export function LastRaceResults({ race, limit = 10 }: LastRaceResultsProps) {
  const results = race.results.slice(0, limit);

  return (
    <div className="overflow-auto max-h-[460px] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="min-w-[380px]">
        <div className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Última Carrera — Ronda {race.round}
              </p>
              <p className="text-sm font-semibold text-[var(--color-text-primary)] mt-0.5">
                {race.raceName}
              </p>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {formatRaceDate(race.date)} · {race.locality}
            </p>
          </div>
        </div>

        <div className="sticky top-[52px] z-10 grid grid-cols-[2rem_1fr_auto_auto] items-center gap-3 border-b border-[var(--color-border)] px-4 py-2.5 bg-[var(--color-surface-raised)]/90 backdrop-blur-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Pos
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Piloto
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hidden sm:block">
            Tiempo
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] text-right">
            Pts
          </span>
        </div>

        {results.map((result) => {
          const teamMeta = getTeamMeta(result.teamId);
          const isTopThree = result.position <= 3;
          const isDNF =
            result.status !== "Finished" && !result.status.startsWith("+");

          return (
            <div
              key={result.driverId}
              className="grid grid-cols-[2rem_1fr_auto_auto] items-center gap-3 px-4 py-3 border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-raised)] transition-colors"
            >
              <span
                className={`text-sm font-bold tabular-nums ${
                  isTopThree
                    ? "text-[var(--color-f1-red)]"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                {result.positionText}
              </span>

              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="h-5 w-1 shrink-0 rounded-full hidden sm:block"
                  style={{ backgroundColor: teamMeta.primaryColor }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                    {result.driverName}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] truncate">
                    {teamMeta.shortName}
                  </p>
                </div>
                {isDNF && (
                  <Badge
                    variant="warning"
                    className="ml-1 hidden sm:inline-flex"
                  >
                    DNF
                  </Badge>
                )}
              </div>

              <span className="text-sm text-[var(--color-text-secondary)] tabular-nums hidden sm:block">
                {result.time ?? result.status}
              </span>

              <span className="text-sm font-bold text-[var(--color-text-primary)] tabular-nums text-right">
                {result.points}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
