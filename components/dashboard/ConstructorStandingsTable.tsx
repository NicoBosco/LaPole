import Link from "next/link";
import { ProcessedConstructor } from "@/types/constructor";
import { getTeamMeta } from "@/constants/teams";

interface ConstructorStandingsTableProps {
  standings: ProcessedConstructor[];
  limit?: number;
}

export function ConstructorStandingsTable({
  standings,
  limit = 10,
}: ConstructorStandingsTableProps) {
  const shown = standings.slice(0, limit);

  return (
    <div className="overflow-auto max-h-[360px] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="min-w-[360px]">

        <div className="sticky top-0 z-10 grid grid-cols-[2rem_1fr_auto_auto] items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Pos</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Constructor</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] text-center">Victorias</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] text-right">Puntos</span>
        </div>

        {shown.map((standing, idx) => {
          const teamMeta = getTeamMeta(standing.constructorId);
          const isTopThree = idx < 3;

          return (
            <Link
              key={standing.constructorId}
              href={`/constructors/${standing.constructorId}`}
              className="grid grid-cols-[2rem_1fr_auto_auto] items-center gap-3 px-4 py-3 border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-raised)] transition-colors group"
            >
              <span
                className={`text-sm font-bold tabular-nums ${
                  isTopThree ? "text-[var(--color-f1-red)]" : "text-[var(--color-text-muted)]"
                }`}
              >
                {standing.position}
              </span>

              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="h-5 w-1 shrink-0 rounded-full hidden sm:block"
                  style={{ backgroundColor: teamMeta.primaryColor }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-f1-red)] transition-colors truncate">
                    {teamMeta.shortName}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] truncate">
                    {standing.nationality}
                  </p>
                </div>
              </div>

              <span className="text-sm text-[var(--color-text-secondary)] tabular-nums text-center">
                {standing.wins}
              </span>

              <span className="text-sm font-bold text-[var(--color-text-primary)] tabular-nums text-right">
                {standing.points}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
