import { getDriverStandings } from "@/lib/api/races";
import { EmptyState } from "@/components/ui/EmptyState";
import { DriversPageClient } from "./DriversPageClient";
import { resolveSeason } from "@/lib/utils/season";

export const metadata = {
  title: "Pilotos",
  description: "Clasificación y perfil de todos los pilotos de la temporada de Fórmula 1.",
};

interface DriversPageProps {
  searchParams: Promise<{ season?: string }>;
}

export default async function DriversPage({ searchParams }: DriversPageProps) {
  const params = await searchParams;
  const season = resolveSeason(params.season);

  let standings;
  try {
    standings = await getDriverStandings(season);
  } catch {
    standings = null;
  }

  if (!standings) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState
          title="Error al cargar pilotos"
          description="No se pudieron obtener los datos. Verificá tu conexión e intentá recargar."
          icon="⚠️"
        />
      </div>
    );
  }

  return <DriversPageClient standings={standings} season={season} />;
}
