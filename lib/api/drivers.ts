import { apiFetch } from "./client";
import { Driver, ProcessedDriver } from "@/types/driver";
import { ProcessedRaceWithResults, RaceWithResults } from "@/types/race";
import {
  StandingsResponse,
  ResultsTableResponse,
  DriverTableResponse,
} from "@/types/api";
import {
  CURRENT_SEASON,
  REVALIDATE_DRIVERS,
  REVALIDATE_STANDINGS,
} from "@/constants/config";
import {
  StandingsResponseSchema,
  DriverTableResponseSchema,
  ResultsTableResponseSchema,
} from "./schemas/f1";
import {
  mapToProcessedDriver,
  mapToProcessedRaceWithResults,
} from "./mappers/f1";

export async function getDrivers(season = CURRENT_SEASON): Promise<Driver[]> {
  const res = await apiFetch<DriverTableResponse>(
    `/${season}/drivers`,
    { revalidate: REVALIDATE_DRIVERS },
    DriverTableResponseSchema,
  );
  return res.MRData.DriverTable.Drivers ?? [];
}

export async function getDriverById(driverId: string): Promise<Driver | null> {
  const res = await apiFetch<DriverTableResponse>(
    `/drivers/${driverId}`,
    { revalidate: REVALIDATE_DRIVERS },
    DriverTableResponseSchema,
  );
  return res.MRData.DriverTable.Drivers?.[0] ?? null;
}

export async function getDriverCurrentStanding(
  driverId: string,
  season = CURRENT_SEASON,
): Promise<ProcessedDriver | null> {
  const res = await apiFetch<StandingsResponse>(
    `/${season}/drivers/${driverId}/driverStandings`,
    { revalidate: REVALIDATE_STANDINGS },
    StandingsResponseSchema,
  );

  const standing =
    res.MRData.StandingsTable.StandingsLists?.[0]?.DriverStandings?.[0];
  return standing ? mapToProcessedDriver(standing) : null;
}

export async function getDriverSeasonResults(
  driverId: string,
  season: string,
): Promise<ProcessedRaceWithResults[]> {
  const res = await apiFetch<ResultsTableResponse>(
    `/${season}/drivers/${driverId}/results`,
    { revalidate: REVALIDATE_STANDINGS },
    ResultsTableResponseSchema,
  );
  const races = (res.MRData.RaceTable.Races ?? []) as RaceWithResults[];
  return races.map((race) => mapToProcessedRaceWithResults(race));
}
