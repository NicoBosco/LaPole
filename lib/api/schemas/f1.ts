import { z } from "zod";

export const DriverSchema = z.object({
  driverId: z.string(),
  permanentNumber: z.string().optional(),
  code: z.string().optional(),
  url: z.string().optional(),
  givenName: z.string(),
  familyName: z.string(),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
});

export const ConstructorSchema = z.object({
  constructorId: z.string(),
  url: z.string().optional(),
  name: z.string(),
  nationality: z.string().optional(),
});

export const CircuitSchema = z.object({
  circuitId: z.string(),
  url: z.string().optional(),
  circuitName: z.string(),
  Location: z.object({
    lat: z.string(),
    long: z.string(),
    locality: z.string(),
    country: z.string(),
  }),
});

export const RaceSchema = z.object({
  season: z.string(),
  round: z.string(),
  url: z.string().optional(),
  raceName: z.string(),
  Circuit: CircuitSchema,
  date: z.string(),
  time: z.string().optional(),
  FirstPractice: z.object({ date: z.string(), time: z.string() }).optional(),
  SecondPractice: z.object({ date: z.string(), time: z.string() }).optional(),
  ThirdPractice: z.object({ date: z.string(), time: z.string() }).optional(),
  Qualifying: z.object({ date: z.string(), time: z.string() }).optional(),
  Sprint: z.object({ date: z.string(), time: z.string() }).optional(),
});

export const RaceResultSchema = z
  .object({
    number: z.string().optional(),
    position: z.string().optional(),
    positionText: z.string().optional(),
    points: z.string().optional(),
    Driver: DriverSchema.optional(),
    Constructor: ConstructorSchema.optional(),
    grid: z.string().optional(),
    laps: z.string().optional(),
    status: z.string().optional(),
    Time: z
      .object({
        millis: z.string().optional(),
        time: z.string().optional(),
      })
      .optional(),
    FastestLap: z
      .object({
        rank: z.string().optional(),
        lap: z.string().optional(),
        Time: z
          .object({
            time: z.string().optional(),
          })
          .optional(),
        AverageSpeed: z
          .object({
            units: z.string().optional(),
            speed: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .passthrough();

export const RaceWithResultsSchema = RaceSchema.extend({
  Results: z.array(RaceResultSchema),
});

export const DriverStandingSchema = z.object({
  position: z.string(),
  positionText: z.string(),
  points: z.string(),
  wins: z.string(),
  Driver: DriverSchema,
  Constructors: z.array(ConstructorSchema),
});

export const ConstructorStandingSchema = z.object({
  position: z.string(),
  positionText: z.string(),
  points: z.string(),
  wins: z.string(),
  Constructor: ConstructorSchema,
});

export const MRDataSchema = z.object({
  MRData: z
    .object({
      xmlns: z.string().optional(),
      series: z.string().optional(),
      url: z.string().optional(),
      limit: z.string().optional(),
      offset: z.string().optional(),
      total: z.string().optional(),
    })
    .passthrough(),
});

export const StandingsResponseSchema = z.object({
  MRData: z.object({
    StandingsTable: z.object({
      season: z.string(),
      StandingsLists: z.array(
        z.object({
          season: z.string(),
          round: z.string().optional(),
          DriverStandings: z.array(DriverStandingSchema).optional(),
          ConstructorStandings: z.array(ConstructorStandingSchema).optional(),
        }),
      ),
    }),
  }),
});

export const RaceTableResponseSchema = z.object({
  MRData: z.object({
    RaceTable: z.object({
      season: z.string(),
      Races: z.array(RaceSchema),
    }),
  }),
});

export const ResultsTableResponseSchema = z.object({
  MRData: z.object({
    RaceTable: z.object({
      season: z.string(),
      round: z.string().optional(),
      driverId: z.string().optional(),
      constructorId: z.string().optional(),
      Races: z.array(RaceWithResultsSchema),
    }),
  }),
});

export const DriverTableResponseSchema = z.object({
  MRData: z.object({
    DriverTable: z.object({
      season: z.string().optional(),
      driverId: z.string().optional(),
      Drivers: z.array(DriverSchema),
    }),
  }),
});

export const ConstructorTableResponseSchema = z.object({
  MRData: z.object({
    ConstructorTable: z.object({
      season: z.string().optional(),
      constructorId: z.string().optional(),
      Constructors: z.array(ConstructorSchema),
    }),
  }),
});
