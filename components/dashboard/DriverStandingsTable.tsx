import Link from "next/link";
import { ProcessedDriver } from "@/types/driver";
import { getTeamMeta } from "@/constants/teams";

interface DriverStandingsTableProps {
  standings: ProcessedDriver[];
  limit?: number;
}

export function DriverStandingsTable({
  standings,
  limit = 10,
}: DriverStandingsTableProps) {
  const shown = standings.slice(0, limit);

  return (
    <div className="overflow-auto max-h-[440px] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="min-w-[360px]">

        <div className="sticky top-0 z-10 grid grid-cols-[2rem_1fr_auto_auto] items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Pos
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Piloto
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] text-center">
            Victorias
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] text-right">
            Puntos
          </span>
        </div>

        {shown.map((driver, idx) => {
          const teamMeta = getTeamMeta(driver.teamId);
          const isTopThree = idx < 3;

          return (
            <Link
              key={driver.driverId}
              href={`/drivers/${driver.driverId}`}
              className="grid grid-cols-[2rem_1fr_auto_auto] items-center gap-3 px-4 py-3 border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-raised)] transition-colors group"
            >

              <span
                className={`text-sm font-bold tabular-nums ${
                  isTopThree
                    ? "text-[var(--color-f1-red)]"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                {driver.position}
              </span>

              <div className="flex items-center gap-3 min-w-0">

                <span
                  className="hidden sm:block h-5 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: teamMeta.primaryColor }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-f1-red)] transition-colors truncate">
                    {driver.fullName}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] truncate">
                    {driver.teamName}
                  </p>
                </div>
              </div>

              <span className="text-sm text-[var(--color-text-secondary)] tabular-nums text-center">
                {driver.wins}
              </span>

              <span className="text-sm font-bold text-[var(--color-text-primary)] tabular-nums text-right">
                {driver.points}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
