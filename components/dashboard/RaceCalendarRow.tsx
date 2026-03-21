import Link from "next/link";
import { ProcessedRace } from "@/types/race";
import { formatRaceDate } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";

interface RaceCalendarRowProps {
  race: ProcessedRace;
  season: string;
}

export function RaceCalendarRow({ race, season }: RaceCalendarRowProps) {
  const { isPast, isNext } = race;
  const content = (
    <div
      className={cn(
        "flex items-center gap-4 rounded-[var(--radius-md)] border px-4 py-3 transition-colors",
        isNext
          ? "border-[var(--color-f1-red)]/30 bg-[var(--color-f1-red-muted)]"
          : isPast
            ? "border-[var(--color-border)] bg-[var(--color-surface)] opacity-60 hover:opacity-100"
            : "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-raised)]",
      )}
    >
      <div className="shrink-0 text-center w-8">
        <span
          className={cn(
            "text-xs font-bold tabular-nums",
            isNext
              ? "text-[var(--color-f1-red)]"
              : "text-[var(--color-text-muted)]",
          )}
        >
          R{race.round}
        </span>
      </div>

      <div className="shrink-0">
        <span
          className={cn(
            "inline-block h-2 w-2 rounded-full",
            isNext
              ? "bg-[var(--color-f1-red)]"
              : isPast
                ? "bg-[var(--color-success)]"
                : "bg-[var(--color-border)]",
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-semibold truncate",
            isPast
              ? "text-[var(--color-text-secondary)]"
              : "text-[var(--color-text-primary)]",
            isPast && "group-hover:text-[var(--color-f1-red)]",
          )}
        >
          {race.raceName}
        </p>
        <p className="text-xs text-[var(--color-text-muted)] truncate">
          {race.locality}, {race.country}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p
          className={cn(
            "text-xs font-medium",
            isNext
              ? "text-[var(--color-f1-red)]"
              : "text-[var(--color-text-secondary)]",
          )}
        >
          {formatRaceDate(race.date)}
        </p>
        {isPast && (
          <p className="text-xs text-[var(--color-success)] font-medium">
            Ver resultados →
          </p>
        )}
        {isNext && (
          <p className="text-xs text-[var(--color-f1-red)] font-semibold">
            Próxima
          </p>
        )}
      </div>
    </div>
  );

  if (isPast) {
    return (
      <Link href={`/races/${season}/${race.round}`} className="group block">
        {content}
      </Link>
    );
  }

  return content;
}
