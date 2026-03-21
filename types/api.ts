import { Driver, DriverStanding } from "./driver";
import { Constructor, ConstructorStanding } from "./constructor";
import { Race, RaceWithResults } from "./race";

export interface MRData {
  xmlns?: string;
  series?: string;
  url?: string;
  limit?: string;
  offset?: string;
  total?: string;
}

export interface StandingsResponse {
  MRData: MRData & {
    StandingsTable: {
      season: string;
      StandingsLists: {
        season: string;
        round?: string;
        DriverStandings?: DriverStanding[];
        ConstructorStandings?: ConstructorStanding[];
      }[];
    };
  };
}

export interface RaceTableResponse {
  MRData: MRData & {
    RaceTable: {
      season: string;
      Races: Race[];
    };
  };
}

export interface ResultsTableResponse {
  MRData: MRData & {
    RaceTable: {
      season: string;
      round?: string;
      driverId?: string;
      constructorId?: string;
      Races: RaceWithResults[];
    };
  };
}

export interface DriverTableResponse {
  MRData: MRData & {
    DriverTable: {
      season?: string;
      driverId?: string;
      Drivers: Driver[];
    };
  };
}

export interface ConstructorTableResponse {
  MRData: MRData & {
    ConstructorTable: {
      season?: string;
      constructorId?: string;
      Constructors: Constructor[];
    };
  };
}
