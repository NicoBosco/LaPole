import { getDriverStandings } from "@/lib/api/races";
import { resolveSeason } from "@/lib/utils/season";
import { ComparePageClient } from "./ComparePageClient";

export const metadata = {
  title: "Comparar Pilotos",
  description: "Compará estadísticas de dos pilotos de Fórmula 1 lado a lado.",
};

interface ComparePageProps {
  searchParams: Promise<{ season?: string }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const sp = await searchParams;
  const season = resolveSeason(sp.season);

  const standings = await getDriverStandings(season).catch(() => []);

  return <ComparePageClient standings={standings} season={season} />;
}
