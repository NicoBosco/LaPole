import {
  AVAILABLE_SEASONS,
  CURRENT_SEASON,
  type Season,
} from "@/constants/config";

export function resolveSeason(seasonParam?: string | null): string {
  if (!seasonParam) {
    return CURRENT_SEASON;
  }

  const isValid = AVAILABLE_SEASONS.includes(seasonParam as Season);
  return isValid ? seasonParam : CURRENT_SEASON;
}

export function getComparisonSeasons(currentSeason: string): [string, string] {
  const current = parseInt(currentSeason, 10);

  if (isNaN(current)) {
    const defaultCurrent = parseInt(CURRENT_SEASON, 10);
    return [CURRENT_SEASON, (defaultCurrent - 1).toString()];
  }

  return [current.toString(), (current - 1).toString()];
}
