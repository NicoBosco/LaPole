import { apiFetch } from "./client";
import { ProcessedConstructor, Constructor } from "@/types/constructor";
import { ProcessedRaceWithResults, RaceWithResults } from "@/types/race";
import {
  StandingsResponse,
  ResultsTableResponse,
  ConstructorTableResponse,
} from "@/types/api";
import {
  CURRENT_SEASON,
  REVALIDATE_DRIVERS,
  REVALIDATE_STANDINGS,
} from "@/constants/config";
import {
  StandingsResponseSchema,
  ConstructorTableResponseSchema,
  ResultsTableResponseSchema,
} from "./schemas/f1";
import {
  mapToProcessedConstructor,
  mapToProcessedRaceWithResults,
} from "./mappers/f1";

export async function getConstructors(
  season = CURRENT_SEASON,
): Promise<Constructor[]> {
  const res = await apiFetch<ConstructorTableResponse>(
    `/${season}/constructors`,
    { revalidate: REVALIDATE_DRIVERS },
    ConstructorTableResponseSchema,
  );
  return res.MRData.ConstructorTable.Constructors ?? [];
}

export async function getConstructorById(
  constructorId: string,
): Promise<Constructor | null> {
  const res = await apiFetch<ConstructorTableResponse>(
    `/constructors/${constructorId}`,
    { revalidate: REVALIDATE_DRIVERS },
    ConstructorTableResponseSchema,
  );
  return res.MRData.ConstructorTable.Constructors?.[0] ?? null;
}

export async function getConstructorCurrentStanding(
  constructorId: string,
  season = CURRENT_SEASON,
): Promise<ProcessedConstructor | null> {
  const res = await apiFetch<StandingsResponse>(
    `/${season}/constructors/${constructorId}/constructorStandings`,
    { revalidate: REVALIDATE_STANDINGS },
    StandingsResponseSchema,
  );

  const standing =
    res.MRData.StandingsTable.StandingsLists?.[0]?.ConstructorStandings?.[0];
  return standing ? mapToProcessedConstructor(standing) : null;
}
export async function getConstructorSeasonResults(
  constructorId: string,
  season: string,
): Promise<ProcessedRaceWithResults[]> {
  const res = await apiFetch<ResultsTableResponse>(
    `/${season}/constructors/${constructorId}/results`,
    { revalidate: REVALIDATE_STANDINGS },
    ResultsTableResponseSchema,
  );
  const races = (res.MRData.RaceTable.Races ?? []) as RaceWithResults[];
  return races.map((race) => mapToProcessedRaceWithResults(race));
}
