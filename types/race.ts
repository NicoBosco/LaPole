import { Driver, DriverStanding } from "./driver";
import { Constructor, ConstructorStanding } from "./constructor";

export interface Circuit {
  circuitId: string;
  url?: string;
  circuitName: string;
  Location: {
    lat: string;
    long: string;
    locality: string;
    country: string;
  };
}

export interface Race {
  season: string;
  round: string;
  url?: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time?: string;
  FirstPractice?: { date: string; time: string };
  SecondPractice?: { date: string; time: string };
  ThirdPractice?: { date: string; time: string };
  Qualifying?: { date: string; time: string };
  Sprint?: { date: string; time: string };
}

export interface RaceResult {
  number?: string;
  position?: string;
  positionText?: string;
  points?: string;
  Driver?: Driver;
  Constructor?: Constructor;
  grid?: string;
  laps?: string;
  status?: string;
  Time?: { millis?: string; time?: string };
  FastestLap?: {
    rank?: string;
    lap?: string;
    Time?: { time?: string };
    AverageSpeed?: { units?: string; speed?: string };
  };
}

export interface RaceWithResults extends Race {
  Results: RaceResult[];
}

export interface StandingsTable {
  season: string;
  round?: string;
  DriverStandings?: DriverStanding[];
  ConstructorStandings?: ConstructorStanding[];
}

export interface ProcessedRace {
  round: number;
  season: string;
  raceName: string;
  circuitName: string;
  country: string;
  locality: string;
  date: Date;
  time?: string;
  isPast: boolean;
  isNext: boolean;
  hasSprint: boolean;
  firstPractice?: { date: string; time: string };
  secondPractice?: { date: string; time: string };
  thirdPractice?: { date: string; time: string };
  sprint?: { date: string; time: string };
  qualifying?: { date: string; time: string };
}

export interface ProcessedRaceResult {
  position: number;
  positionText: string;
  points: number;
  grid: number;
  laps: number;
  status: string;
  time?: string;
  driverId: string;
  driverName: string;
  teamId: string;
  teamName: string;
  fastestLapTime?: string;
  isFastestLap: boolean;
}

export interface ProcessedRaceWithResults extends ProcessedRace {
  results: ProcessedRaceResult[];
}
