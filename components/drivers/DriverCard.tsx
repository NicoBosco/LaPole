import Link from "next/link";
import { ProcessedDriver } from "@/types/driver";
import { getTeamMeta } from "@/constants/teams";
import { getNationalityFlag } from "@/lib/utils/formatters";
import { Badge } from "@/components/ui/Badge";

interface DriverCardProps {
  driver: ProcessedDriver;
  isFavorite?: boolean;
  onToggleFavorite?: (driverId: string) => void;
}

export function DriverCard({ driver, isFavorite = false, onToggleFavorite }: DriverCardProps) {
  const { 
    driverId, 
    firstName, 
    lastName, 
    code, 
    teamId, 
    position, 
    points, 
    wins, 
    nationality 
  } = driver;
  
  const teamMeta = getTeamMeta(teamId);
  const flag = getNationalityFlag(nationality);

  return (
    <div className="relative group rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden hover:border-[var(--color-f1-red)]/40 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] transition-all duration-200">

      <div className="h-1 w-full" style={{ backgroundColor: teamMeta.primaryColor }} />

      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite(driverId);
          }}
          aria-label={isFavorite ? `Quitar ${lastName} de favoritos` : `Agregar ${lastName} a favoritos`}
          title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full text-base transition-colors hover:scale-110 focus-visible:outline-2 focus-visible:outline-[var(--color-f1-red)]"
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      )}

      <Link
        href={`/drivers/${driverId}`}
        className="block p-4"
        tabIndex={0}
      >

        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl font-black text-[var(--color-text-muted)] tabular-nums leading-none group-hover:text-[var(--color-f1-red)] transition-colors">
            #{position}
          </span>
          {code && (
            <span className="text-xs font-bold tracking-widest text-[var(--color-text-muted)] border border-[var(--color-border)] rounded px-2 py-0.5 mr-7">
              {code}
            </span>
          )}
        </div>

        <div className="mb-3">
          <p className="text-xs text-[var(--color-text-muted)]">{firstName}</p>
          <p className="text-lg font-bold text-[var(--color-text-primary)] leading-tight group-hover:text-[var(--color-f1-red)] transition-colors">
            {lastName}
          </p>
        </div>

        <Badge
          variant="team"
          style={{
            backgroundColor: `${teamMeta.primaryColor}18`,
            color: teamMeta.primaryColor,
            borderColor: `${teamMeta.primaryColor}30`,
          }}
        >
          {teamMeta.shortName}
        </Badge>

        <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-3">
          <div className="text-center">
            <p className="text-xs text-[var(--color-text-muted)]">Puntos</p>
            <p className="text-sm font-bold text-[var(--color-text-primary)] tabular-nums">{points}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[var(--color-text-muted)]">Victorias</p>
            <p className="text-sm font-bold text-[var(--color-text-primary)] tabular-nums">{wins}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[var(--color-text-muted)]">País</p>
            <p className="text-sm">{flag}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
