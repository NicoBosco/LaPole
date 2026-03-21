import { apiFetch } from "./client";
import { ProcessedDriver } from "@/types/driver";
import { ProcessedConstructor } from "@/types/constructor";
import { ProcessedRace, ProcessedRaceWithResults, RaceWithResults } from "@/types/race";
import { StandingsResponse, RaceTableResponse, ResultsTableResponse } from "@/types/api";
import {
  CURRENT_SEASON,
  REVALIDATE_STANDINGS,
  REVALIDATE_SCHEDULE,
  REVALIDATE_RESULTS,
} from "@/constants/config";
import {
  StandingsResponseSchema,
  RaceTableResponseSchema,
  ResultsTableResponseSchema,
} from "./schemas/f1";
import {
  mapDriverStandings,
  mapConstructorStandings,
  mapRaceSchedule,
  mapToProcessedRaceWithResults,
} from "./mappers/f1";



export async function getDriverStandings(
  season = CURRENT_SEASON
): Promise<ProcessedDriver[]> {
  const res = await apiFetch<StandingsResponse>(
    `/${season}/driverStandings`,
    { revalidate: REVALIDATE_STANDINGS },
    StandingsResponseSchema
  );
  
  const standings = res.MRData.StandingsTable.StandingsLists?.[0]?.DriverStandings ?? [];
  return mapDriverStandings(standings);
}

export async function getConstructorStandings(
  season = CURRENT_SEASON
): Promise<ProcessedConstructor[]> {
  const res = await apiFetch<StandingsResponse>(
    `/${season}/constructorStandings`,
    { revalidate: REVALIDATE_STANDINGS },
    StandingsResponseSchema
  );
  
  const standings = res.MRData.StandingsTable.StandingsLists?.[0]?.ConstructorStandings ?? [];
  return mapConstructorStandings(standings);
}



export async function getRaceSchedule(
  season = CURRENT_SEASON
): Promise<ProcessedRace[]> {
  const res = await apiFetch<RaceTableResponse>(
    `/${season}`, 
    { revalidate: REVALIDATE_SCHEDULE },
    RaceTableResponseSchema
  );
  
  return mapRaceSchedule(res.MRData.RaceTable.Races ?? []);
}



export async function getLastRaceResults(
  season = CURRENT_SEASON
): Promise<ProcessedRaceWithResults | null> {
  const res = await apiFetch<ResultsTableResponse>(
    `/${season}/last/results?limit=30`, 
    { revalidate: REVALIDATE_RESULTS },
    ResultsTableResponseSchema
  );
  
  const races = res.MRData.RaceTable.Races;
  if (!races || races.length === 0) return null;
  return mapToProcessedRaceWithResults(races[0] as RaceWithResults);
}

export async function getRaceResults(
  season: string,
  round: string
): Promise<ProcessedRaceWithResults | null> {
  const res = await apiFetch<ResultsTableResponse>(
    `/${season}/${round}/results?limit=30`,
    { revalidate: REVALIDATE_RESULTS },
    ResultsTableResponseSchema
  );
  
  const races = res.MRData.RaceTable.Races;
  if (!races || races.length === 0) return null;
  return mapToProcessedRaceWithResults(races[0] as RaceWithResults);
}
