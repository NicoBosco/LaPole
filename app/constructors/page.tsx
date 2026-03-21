import { Suspense } from "react";
import Link from "next/link";
import { getConstructorStandings } from "@/lib/api/races";
import { getTeamMeta } from "@/constants/teams";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { ErrorState } from "@/components/ui/ErrorState";
import { SeasonSelector } from "@/components/ui/SeasonSelector";
import { resolveSeason } from "@/lib/utils/season";
import { safeFetch } from "@/lib/utils/safeFetch";

export const metadata = {
  title: "Equipos",
  description: "Clasificación de constructores de la temporada de Fórmula 1.",
};

interface ConstructorsPageProps {
  searchParams: Promise<{ season?: string }>;
}

export default async function ConstructorsPage({
  searchParams,
}: ConstructorsPageProps) {
  const params = await searchParams;
  const season = resolveSeason(params.season);

  const { data: standings, error } = await safeFetch(
    getConstructorStandings(season),
  );

  if (error || !standings) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-end">
          <Suspense fallback={null}>
            <SeasonSelector currentSeason={season} />
          </Suspense>
        </div>
        <ErrorState message="No pudimos cargar la clasificación de constructores." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 animate-fade-in-up">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
              Equipos
            </h1>
            <p className="mt-2 text-[var(--color-text-secondary)]">
              Clasificación de constructores — Temporada {season}
            </p>
          </div>
          <Suspense fallback={null}>
            <SeasonSelector currentSeason={season} />
          </Suspense>
        </div>
      </div>

      {standings.length === 0 ? (
        <EmptyState
          title="Todavía no hay datos"
          description={`La clasificación de constructores para ${season} aún no está disponible.`}
          icon="📊"
        />
      ) : (
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in-up"
          style={{ animationDelay: "0.05s" }}
        >
          {standings.map((standing) => {
            const teamMeta = getTeamMeta(standing.constructorId);
            const isTopThree = standing.position <= 3;

            return (
              <Link
                key={standing.constructorId}
                href={`/constructors/${standing.constructorId}?season=${season}`}
                className="group overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-raised)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] transition-all duration-200 block"
              >
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: teamMeta.primaryColor }}
                />

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span
                      className={`text-4xl font-black tabular-nums leading-none ${
                        isTopThree
                          ? "text-[var(--color-f1-red)]"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {standing.position}°
                    </span>
                    <Badge
                      variant="team"
                      style={{
                        backgroundColor: `${teamMeta.primaryColor}18`,
                        color: teamMeta.primaryColor,
                        borderColor: `${teamMeta.primaryColor}30`,
                      }}
                    >
                      {standing.nationality}
                    </Badge>
                  </div>

                  <h2 className="text-xl font-bold text-[var(--color-text-primary)] leading-tight mb-1 group-hover:text-[var(--color-f1-red)] transition-colors">
                    {teamMeta.shortName}
                  </h2>
                  <p className="text-sm text-[var(--color-text-muted)] mb-4">
                    {teamMeta.name}
                  </p>

                  <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                    <div>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Puntos
                      </p>
                      <p className="text-2xl font-bold text-[var(--color-text-primary)] tabular-nums">
                        {standing.points}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Victorias
                      </p>
                      <p className="text-2xl font-bold text-[var(--color-text-primary)] tabular-nums">
                        {standing.wins}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-right text-xs text-[var(--color-text-muted)] group-hover:text-[var(--color-f1-red)] transition-colors">
                    Ver detalle →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
