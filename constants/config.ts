export const CURRENT_SEASON = "2026";

export const API_BASE_URL = "https://api.jolpi.ca/ergast/f1";

export const AVAILABLE_SEASONS = ["2026", "2025"] as const;
export type Season = (typeof AVAILABLE_SEASONS)[number];

export const REVALIDATE_STANDINGS = 3600;
export const REVALIDATE_SCHEDULE = 86400;
export const REVALIDATE_RESULTS = 1800;
export const REVALIDATE_DRIVERS = 86400;
