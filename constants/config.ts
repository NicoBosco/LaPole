export const CURRENT_SEASON = new Date().getUTCFullYear().toString();

export const API_BASE_URL = "https://api.jolpi.ca/ergast/f1";

const currentYear = new Date().getUTCFullYear();
export const AVAILABLE_SEASONS = [
  currentYear.toString(),
  (currentYear - 1).toString(),
] as const;

export const PREVIOUS_SEASON = (currentYear - 1).toString();

export type Season = (typeof AVAILABLE_SEASONS)[number];

export const REVALIDATE_STANDINGS = 3600;
export const REVALIDATE_SCHEDULE = 86400;
export const REVALIDATE_RESULTS = 1800;
export const REVALIDATE_DRIVERS = 86400;
