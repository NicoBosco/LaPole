import { 
  ProcessedDriver, 
  DriverStanding 
} from "@/types/driver";
import { 
  ProcessedConstructor, 
  ConstructorStanding 
} from "@/types/constructor";
import { 
  ProcessedRace,
  ProcessedRaceWithResults,
  Race,
  RaceWithResults
} from "@/types/race";

export function mapToProcessedDriver(standing: DriverStanding): ProcessedDriver {
  const { Driver, Constructors, points, position, wins } = standing;
  const team = Constructors[0];
  
  return {
    driverId: Driver.driverId,
    code: Driver.code ?? "",
    number: Driver.permanentNumber ?? "",
    firstName: Driver.givenName,
    lastName: Driver.familyName,
    fullName: `${Driver.givenName} ${Driver.familyName}`,
    nationality: Driver.nationality ?? "",
    dob: Driver.dateOfBirth ?? "",
    teamId: team?.constructorId ?? "",
    teamName: team?.name ?? "Independent",
    position: parseInt(position, 10),
    points: parseFloat(points),
    wins: parseInt(wins, 10),
  };
}

export function mapToProcessedConstructor(standing: ConstructorStanding): ProcessedConstructor {
  const { Constructor, points, position, wins } = standing;
  
  return {
    constructorId: Constructor.constructorId,
    name: Constructor.name,
    nationality: Constructor.nationality ?? "",
    position: parseInt(position, 10),
    points: parseFloat(points),
    wins: parseInt(wins, 10),
  };
}

export function mapToProcessedRace(race: Race): ProcessedRace {
  const now = new Date();
  const raceDate = new Date(`${race.date}T${race.time ?? "00:00:00Z"}`);
  
  return {
    round: parseInt(race.round, 10),
    season: race.season,
    raceName: race.raceName,
    circuitName: race.Circuit.circuitName,
    country: race.Circuit.Location.country,
    locality: race.Circuit.Location.locality,
    date: raceDate,
    time: race.time,
    isPast: raceDate < now,
    isNext: false, // Esto se calculará en el servicio si es necesario
    hasSprint: !!race.Sprint,
    firstPractice: race.FirstPractice,
    secondPractice: race.SecondPractice,
    thirdPractice: race.ThirdPractice,
    sprint: race.Sprint,
    qualifying: race.Qualifying,
  };
}

export function mapToProcessedRaceWithResults(race: RaceWithResults): ProcessedRaceWithResults {
  const processedRace = mapToProcessedRace(race);
  
  return {
    ...processedRace,
    results: (race.Results || []).map(r => ({
      position: parseInt(r.position || "0", 10) || 0,
      positionText: r.positionText || "—",
      points: parseFloat(r.points || "0") || 0,
      grid: parseInt(r.grid || "0", 10) || 0,
      laps: parseInt(r.laps || "0", 10) || 0,
      status: r.status || "Unknown",
      time: r.Time?.time,
      driverId: r.Driver?.driverId || "",
      driverName: r.Driver ? `${r.Driver.givenName} ${r.Driver.familyName}` : "Unknown",
      teamId: r.Constructor?.constructorId || "",
      teamName: r.Constructor?.name || "Unknown",
      fastestLapTime: r.FastestLap?.Time?.time,
      isFastestLap: r.FastestLap?.rank === "1",
    })),
  };
}

export function mapDriverStandings(standings: DriverStanding[]): ProcessedDriver[] {
  return standings.map(mapToProcessedDriver);
}

export function mapConstructorStandings(standings: ConstructorStanding[]): ProcessedConstructor[] {
  return standings.map(mapToProcessedConstructor);
}

export function mapRaceSchedule(races: Race[]): ProcessedRace[] {
  const mapped = races.map(mapToProcessedRace);

  const now = new Date();
  const nextRace = mapped.find(r => r.date > now);
  if (nextRace) {
    nextRace.isNext = true;
  }
  
  return mapped;
}
