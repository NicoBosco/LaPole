import { ProcessedRace } from "@/types/race";
import { formatRaceDate } from "@/lib/utils/formatters";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CountdownTimer } from "@/components/ui/CountdownTimer";

interface NextRaceCardProps {
  race: ProcessedRace;
}

/** Formatea la hora UTC para mostrar. Retorna ej. "14:00 UTC" */
function formatUtcTime(time: string): string {
  return time.replace(/:00(?:Z)?$/, "Z").replace("Z", " UTC");
}

/** Convierte UTC a la hora de Argentina (UTC-3). Retorna ej. "11:00 🇦🇷" */
function toArgentinaTime(date: Date): string {
  try {
    const local = date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Argentina/Buenos_Aires",
    });
    return `${local} 🇦🇷`;
  } catch {
    return "";
  }
}

export function NextRaceCard({ race }: NextRaceCardProps) {
  return (
    <Card
      glow
      className="relative overflow-hidden border-[var(--color-f1-red)]/20 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-raised)]"
    >

      <div className="absolute left-0 top-0 h-full w-1 rounded-l-[var(--radius-lg)] bg-[var(--color-f1-red)]" />

      <div className="pl-3">

        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="danger" className="text-xs font-semibold uppercase tracking-wider">
                🏁 Próxima Carrera
              </Badge>
              <Badge variant="default">Ronda {race.round}</Badge>
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)] leading-tight">
              {race.raceName}
            </h3>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              🗺️ {race.locality}, {race.country}
            </p>
          </div>

          <CountdownTimer targetDate={race.date} targetTime={race.time} />
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)] mb-4">
          <span className="flex items-center gap-1.5">
            <span className="text-[var(--color-f1-red)]">📅</span>
            {formatRaceDate(race.date)}
          </span>
          {race.circuitName && (
            <span className="flex items-center gap-1.5">
              <span className="text-[var(--color-f1-red)]">🏟️</span>
              {race.circuitName}
            </span>
          )}
          {race.time && (
            <>
              <span className="flex items-center gap-1.5">
                <span className="text-[var(--color-f1-red)]">🕐</span>
                {formatUtcTime(race.time)}
              </span>
              <span className="flex items-center gap-1.5">
                {toArgentinaTime(race.date)}
              </span>
            </>
          )}
        </div>

        {(race.firstPractice || race.qualifying) && (
          <div className="flex flex-wrap gap-2">
            {race.firstPractice && (
              <SessionBadge label="FP1" session={race.firstPractice} />
            )}
            {race.secondPractice && (
              <SessionBadge label="FP2" session={race.secondPractice} />
            )}
            {race.thirdPractice && (
              <SessionBadge label="FP3" session={race.thirdPractice} />
            )}
            {race.sprint && (
              <SessionBadge label="Sprint" session={race.sprint} />
            )}
            {race.qualifying && (
              <SessionBadge label="Clasificación" session={race.qualifying} />
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

function SessionBadge({
  label,
  session,
}: {
  label: string;
  session: { date: string; time: string };
}) {
  const dt = new Date(`${session.date}T${session.time}`);
  const argentinaTime = toArgentinaTime(dt);

  return (
    <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-xs">
      <span className="font-semibold text-[var(--color-text-primary)] block">{label}</span>
      <span className="text-[var(--color-text-muted)]">{formatRaceDate(session.date)}</span>
      {session.time && (
        <div className="mt-0.5 space-y-0.5">
          <p className="text-[var(--color-text-secondary)]">{formatUtcTime(session.time)}</p>
          {argentinaTime && (
            <p className="text-[var(--color-text-secondary)]">{argentinaTime}</p>
          )}
        </div>
      )}
    </div>
  );
}
