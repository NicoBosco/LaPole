import { Suspense } from "react";
import { getDriverStandings, getConstructorStandings, getRaceSchedule, getLastRaceResults } from "@/lib/api/races";
import { NextRaceCard } from "@/components/dashboard/NextRaceCard";
import { DriverStandingsTable } from "@/components/dashboard/DriverStandingsTable";
import { ConstructorStandingsTable } from "@/components/dashboard/ConstructorStandingsTable";
import { ConstructorPointsChart } from "@/components/dashboard/ConstructorPointsChart";
import { LastRaceResults } from "@/components/dashboard/LastRaceResults";
import { RaceCalendarRow } from "@/components/dashboard/RaceCalendarRow";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SeasonSelector } from "@/components/ui/SeasonSelector";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton, TableRowSkeleton } from "@/components/ui/Skeleton";
import { resolveSeason } from "@/lib/utils/season";

export const metadata = {
  title: "LaPole — F1 Dashboard",
  description: "Sigue la temporada de Fórmula 1: próxima carrera, clasificaciones y resultados.",
};

interface HomePageProps {
  searchParams: Promise<{ season?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const season = resolveSeason(params.season);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <div className="flex flex-wrap items-center justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Temporada {season}: Los datos del mundial
          </p>
        </div>
        <Suspense fallback={null}>
          <SeasonSelector currentSeason={season} />
        </Suspense>
      </div>

      <section className="animate-fade-in-up">
        <SectionHeader
          title="Próxima Carrera"
          subtitle={`Temporada ${season}`}
        />
        <Suspense fallback={<CardSkeleton />}>
          <NextRaceSection season={season} />
        </Suspense>
      </section>

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
        <section className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <SectionHeader
            title="Clasificación de Pilotos"
            linkHref={`/drivers?season=${season}`}
            linkLabel="Ver tabla completa"
          />
          <Suspense fallback={<TableRowSkeleton cols={4} />}>
            <DriverStandingsSection season={season} />
          </Suspense>
        </section>

        <section className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          <SectionHeader
            title="Clasificación de Constructores"
            linkHref={`/constructors?season=${season}`}
            linkLabel="Ver equipos"
          />
          <Suspense fallback={<TableRowSkeleton cols={4} />}>
            <ConstructorStandingsSection season={season} />
          </Suspense>
        </section>
      </div>

      <section className="animate-fade-in-up" style={{ animationDelay: "0.12s" }}>
        <SectionHeader
          title="Puntos por Constructor"
          subtitle="Comparativa visual de la temporada"
          linkHref={`/constructors?season=${season}`}
          linkLabel="Ver equipos"
        />
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <Suspense fallback={<div className="h-[240px] animate-skeleton rounded-md bg-[var(--color-surface-raised)]" />}>
            <ConstructorChartSection season={season} />
          </Suspense>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
        <section className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <SectionHeader
            title="Última Carrera"
            subtitle="Resultados finales"
          />
          <Suspense fallback={<TableRowSkeleton cols={4} />}>
            <LastRaceSection season={season} />
          </Suspense>
        </section>

        <section className="animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
          <SectionHeader
            title="Calendario de Temporada"
            subtitle={`${season} — todas las rondas`}
          />
          <Suspense fallback={<TableRowSkeleton cols={3} />}>
            <CalendarSection season={season} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}

async function NextRaceSection({ season }: { season: string }) {
  let races;
  try {
    races = await getRaceSchedule(season);
  } catch {
    races = null;
  }

  if (!races) {
    return (
      <EmptyState
        title="No pudimos cargar la próxima carrera"
        description="Fallo la conexión con la API de F1. Probá recargando."
        icon="⚠️"
      />
    );
  }

  const nextRace = races.find((r) => r.isNext);
  if (!nextRace) {
    return (
      <EmptyState
        title="Fin de la temporada"
        description="Ya se corrieron todas las carreras programadas."
        icon="🏁"
      />
    );
  }
  return <NextRaceCard race={nextRace} />;
}

async function DriverStandingsSection({ season }: { season: string }) {
  let standings;
  try {
    standings = await getDriverStandings(season);
  } catch {
    standings = null;
  }

  if (!standings) return <EmptyState title="No pudimos cargar a los pilotos" icon="⚠️" />;

  if (standings.length === 0) {
    return (
      <EmptyState
        title="Todavía no hay datos"
        description={`La clasificación de la temporada ${season} aún no está disponible.`}
        icon="📊"
      />
    );
  }
  return <DriverStandingsTable standings={standings} limit={22} />;
}

async function ConstructorStandingsSection({ season }: { season: string }) {
  let standings;
  try {
    standings = await getConstructorStandings(season);
  } catch {
    standings = null;
  }

  if (!standings) return <EmptyState title="No pudimos cargar a los equipos" icon="⚠️" />;

  if (standings.length === 0) {
    return (
      <EmptyState
        title="Sin clasificación disponible"
        description={`No hay datos de clasificación para la temporada ${season} todavía.`}
        icon="📊"
      />
    );
  }
  return <ConstructorStandingsTable standings={standings} limit={11} />;
}

async function LastRaceSection({ season }: { season: string }) {
  let race;
  let hasError = false;
  try {
    race = await getLastRaceResults(season);
  } catch {
    hasError = true;
  }

  if (hasError) return <EmptyState title="Hubo un error cargando los resultados" icon="⚠️" />;

  if (!race) {
    return (
      <EmptyState
        title="Todavía no hay resultados"
        description="Los datos aparecerán ni bien termine el último Gran Premio."
        icon="🏁"
      />
    );
  }
  return <LastRaceResults race={race} limit={22} />;
}

async function CalendarSection({ season }: { season: string }) {
  let races;
  try {
    races = await getRaceSchedule(season);
  } catch {
    races = null;
  }

  if (!races) return <EmptyState title="Error al cargar el calendario" icon="⚠️" />;

  if (races.length === 0) {
    return <EmptyState title="Sin calendario disponible" icon="📅" />;
  }

  return (
    <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
      {races.map((race) => (
        <RaceCalendarRow
          key={race.round}
          race={race}
          season={season}
        />
      ))}
    </div>
  );
}

async function ConstructorChartSection({ season }: { season: string }) {
  let standings;
  try {
    standings = await getConstructorStandings(season);
  } catch {
    standings = null;
  }

  if (!standings) return <EmptyState title="Error al cargar el gráfico" icon="⚠️" />;

  if (standings.length === 0) {
    return <EmptyState title="Sin datos de constructores" icon="📊" />;
  }
  return <ConstructorPointsChart standings={standings} />;
}
