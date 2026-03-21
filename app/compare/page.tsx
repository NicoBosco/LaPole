import { getDriverStandings } from "@/lib/api/races";
import { resolveSeason } from "@/lib/utils/season";
import { ComparePageClient } from "./ComparePageClient";
import { safeFetch } from "@/lib/utils/safeFetch";

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

  const { data: standings } = await safeFetch(getDriverStandings(season));

  return <ComparePageClient standings={standings || []} season={season} />;
}
