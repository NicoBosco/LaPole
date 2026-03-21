import { AVAILABLE_SEASONS, CURRENT_SEASON } from "@/constants/config";

export function resolveSeason(seasonParam?: string | null): string {
  if (!seasonParam) return CURRENT_SEASON;
  if (AVAILABLE_SEASONS.includes(seasonParam)) {
    return seasonParam;
  }
  return CURRENT_SEASON;
}

export function getComparisonSeasons(currentSeason: string): [string, string] {
  const resolvedSeason = resolveSeason(currentSeason);
  const current = Number.parseInt(resolvedSeason, 10);

  return [resolvedSeason, (current - 1).toString()];
}
