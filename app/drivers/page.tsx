import { Suspense } from "react";
import { getDriverStandings } from "@/lib/api/races";
import { ErrorState } from "@/components/ui/ErrorState";
import { SeasonSelector } from "@/components/ui/SeasonSelector";
import { DriversPageClient } from "./DriversPageClient";
import { resolveSeason } from "@/lib/utils/season";
import { safeFetch } from "@/lib/utils/safeFetch";

export const metadata = {
  title: "Pilotos",
  description:
    "Clasificación y perfil de todos los pilotos de la temporada de Fórmula 1.",
};

interface DriversPageProps {
  searchParams: Promise<{ season?: string }>;
}

export default async function DriversPage({ searchParams }: DriversPageProps) {
  const params = await searchParams;
  const season = resolveSeason(params.season);

  const { data: standings, error } = await safeFetch(
    getDriverStandings(season),
  );

  if (error || !standings) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-end">
          <Suspense fallback={null}>
            <SeasonSelector currentSeason={season} />
          </Suspense>
        </div>
        <ErrorState message="No se pudieron obtener los pilotos de la temporada seleccionada." />
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex justify-end">
          <Suspense fallback={null}>
            <SeasonSelector currentSeason={season} />
          </Suspense>
        </div>
      </div>
      <DriversPageClient standings={standings} season={season} />
    </>
  );
}
