import { AVAILABLE_SEASONS, CURRENT_SEASON, type Season } from "@/constants/config";

/**
 * Valida el parámetro de la temporada, usando CURRENT_SEASON por defecto ante ingresos vacíos o erróneos.
 */
export function resolveSeason(seasonParam?: string | null): string {
  if (!seasonParam) return CURRENT_SEASON;
  if (AVAILABLE_SEASONS.includes(seasonParam as Season)) {
    return seasonParam;
  }
  return CURRENT_SEASON;
}

/**
 * Deriva matemáticamente la temporada actual y la anterior para los gráficos comparativos.
 * Ej: "2026" -> ["2026", "2025"]
 */
export function getComparisonSeasons(currentSeason: string): [string, string] {
  const current = parseInt(currentSeason, 10);
  const previous = isNaN(current) ? parseInt(CURRENT_SEASON, 10) - 1 : current - 1;
  return [currentSeason, previous.toString()];
}
