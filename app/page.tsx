import { Suspense } from "react";

import {
  getRaceSchedule,
  getLastRaceResults,
  getDriverStandings,
  getConstructorStandings,
} from "@/lib/api/races";
import { ConstructorStandingsTable } from "@/components/dashboard/ConstructorStandingsTable";
import { DriverStandingsTable } from "@/components/dashboard/DriverStandingsTable";
import { NextRaceCard } from "@/components/dashboard/NextRaceCard";
import { ConstructorPointsChart } from "@/components/dashboard/ConstructorPointsChart";
import { LastRaceResults } from "@/components/dashboard/LastRaceResults";
import { RaceCalendarRow } from "@/components/dashboard/RaceCalendarRow";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SeasonSelector } from "@/components/ui/SeasonSelector";
import { ErrorState } from "@/components/ui/ErrorState";
import { CardSkeleton, TableRowSkeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";
import { resolveSeason } from "@/lib/utils/season";
import { safeFetch } from "@/lib/utils/safeFetch";

export const metadata = {
  title: "Dashboard",
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
        <section
          className="animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <SectionHeader
            title="Clasificación de Pilotos"
            linkHref={`/drivers?season=${season}`}
            linkLabel="Ver tabla completa"
          />
          <Suspense fallback={<TableRowSkeleton cols={4} />}>
            <DriverStandingsSection season={season} />
          </Suspense>
        </section>

        <section
          className="animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
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

      <section
        className="animate-fade-in-up"
        style={{ animationDelay: "0.12s" }}
      >
        <SectionHeader
          title="Puntos por Constructor"
          subtitle="Comparativa visual de la temporada"
          linkHref={`/constructors?season=${season}`}
          linkLabel="Ver equipos"
        />
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <Suspense
            fallback={
              <div className="h-[240px] animate-skeleton rounded-md bg-[var(--color-surface-raised)]" />
            }
          >
            <ConstructorChartSection season={season} />
          </Suspense>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
        <section
          className="animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <SectionHeader title="Última Carrera" subtitle="Resultados finales" />
          <Suspense fallback={<TableRowSkeleton cols={4} />}>
            <LastRaceSection season={season} />
          </Suspense>
        </section>

        <section
          className="animate-fade-in-up"
          style={{ animationDelay: "0.25s" }}
        >
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

export async function NextRaceSection({ season }: { season: string }) {
  const { data: races, error } = await safeFetch(getRaceSchedule(season));

  if (error || !races) {
    return <ErrorState message="No pudimos cargar la próxima carrera." />;
  }

  const nextRace = races.find((r) => r.isNext);
  if (!nextRace) {
    const isPastSeason = races.length > 0 && races.every((r) => r.isPast);
    const message = isPastSeason
      ? `La temporada ${season} ha finalizado. Esperamos con ansias el próximo campeonato.`
      : "No hay próximas carreras programadas por el momento.";

    return (
      <Card
        glow
        className="flex flex-col items-center justify-center p-10 text-center border-[var(--color-border)] bg-[var(--color-surface)]"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-raised)] ring-4 ring-[var(--color-surface)]">
          <span className="text-3xl" aria-hidden="true">
            🏁
          </span>
        </div>
        <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
          Sin carreras a la vista
        </h3>
        <p className="mt-2 text-[var(--color-text-secondary)] max-w-sm mx-auto">
          {message}
        </p>
      </Card>
    );
  }
  return <NextRaceCard race={nextRace} />;
}

export async function DriverStandingsSection({ season }: { season: string }) {
  const { data: standings, error } = await safeFetch(
    getDriverStandings(season),
  );

  if (error || !standings)
    return (
      <ErrorState message="No pudimos cargar la clasificación de pilotos." />
    );

  if (standings.length === 0) {
    return <ErrorState message="La clasificación aún no está disponible." />;
  }
  return (
    <DriverStandingsTable season={season} standings={standings} limit={22} />
  );
}

async function ConstructorStandingsSection({ season }: { season: string }) {
  const { data: standings, error } = await safeFetch(
    getConstructorStandings(season),
  );

  if (error || !standings)
    return <ErrorState message="No pudimos cargar los equipos." />;

  if (standings.length === 0) {
    return (
      <ErrorState message="No hay datos de clasificación para la temporada." />
    );
  }
  return (
    <ConstructorStandingsTable
      season={season}
      standings={standings}
      limit={11}
    />
  );
}

export async function LastRaceSection({ season }: { season: string }) {
  const { data: race, error } = await safeFetch(getLastRaceResults(season));

  if (error)
    return <ErrorState message="No pudimos cargar la última carrera." />;

  if (!race) {
    return (
      <ErrorState message="Los resultados aparecerán después de la primera carrera." />
    );
  }
  return <LastRaceResults race={race} limit={22} />;
}

async function CalendarSection({ season }: { season: string }) {
  const { data: races, error } = await safeFetch(getRaceSchedule(season));

  if (error || !races)
    return <ErrorState message="No pudimos cargar el calendario." />;

  if (races.length === 0) {
    return <ErrorState message="Sin calendario disponible." />;
  }

  return (
    <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
      {races.map((race) => (
        <RaceCalendarRow key={race.round} race={race} season={season} />
      ))}
    </div>
  );
}

async function ConstructorChartSection({ season }: { season: string }) {
  const { data: standings, error } = await safeFetch(
    getConstructorStandings(season),
  );

  if (error || !standings)
    return <ErrorState message="Error al cargar el gráfico." />;

  if (standings.length === 0) {
    return <ErrorState message="Sin datos de constructores." />;
  }
  return <ConstructorPointsChart standings={standings} />;
}
