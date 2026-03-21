import { describe, it, expect } from "vitest";
import {
  mapRaceSchedule,
  mapToProcessedRaceWithResults,
  mapToProcessedDriver,
  mapToProcessedConstructor,
} from "@/lib/api/mappers/f1";
import { Race, RaceWithResults } from "@/types/race";
import { DriverStanding } from "@/types/driver";
import { ConstructorStanding } from "@/types/constructor";

describe("Mapeadores de F1", () => {
  describe("mapRaceSchedule", () => {
    it("debe mapear el calendario de carreras estándar correctamente", () => {
      const mockRaces: Race[] = [
        {
          season: "2024",
          round: "1",
          raceName: "Bahrain Grand Prix",
          Circuit: {
            circuitId: "bahrain",
            circuitName: "Bahrain International Circuit",
            Location: {
              lat: "26.0325",
              long: "50.5106",
              locality: "Sakhir",
              country: "Bahrain",
            },
          },
          date: "2024-03-02",
          time: "15:00:00Z",
        },
      ];

      const processed = mapRaceSchedule(mockRaces);
      expect(processed[0].round).toBe(1);
      expect(typeof processed[0].isNext).toBe("boolean");
      expect(typeof processed[0].isPast).toBe("boolean");
    });
  });

  describe("mapToProcessedRaceWithResults", () => {
    it("debe mapear una carrera con resultados sin fallar", () => {
      const mockRace: RaceWithResults = {
        season: "2024",
        round: "1",
        raceName: "Bahrain Grand Prix",
        Circuit: {
          circuitId: "bahrain",
          circuitName: "Bahrain",
          Location: {
            lat: "0",
            long: "0",
            locality: "Loc",
            country: "Country",
          },
        },
        date: "2024-03-02",
        time: "15:00:00Z",
        Results: [
          {
            number: "1",
            position: "1",
            positionText: "1",
            points: "25",
            grid: "1",
            laps: "57",
            status: "Finished",
            Driver: {
              driverId: "max_verstappen",
              url: "",
              givenName: "Max",
              familyName: "Verstappen",
              dateOfBirth: "1997-09-30",
              nationality: "Dutch",
            },
            Constructor: {
              constructorId: "red_bull",
              url: "",
              name: "Red Bull",
              nationality: "Austrian",
            },
            Time: { millis: "5486830", time: "1:31:44.742" },
          },
        ],
      };

      const processed = mapToProcessedRaceWithResults(mockRace);
      expect(processed.round).toBe(1);
      expect(processed.results[0].driverId).toBe("max_verstappen");
      expect(processed.results[0].points).toBe(25);
      expect(processed.results[0].position).toBe(1);
    });
  });

  describe("mapToProcessedDriver", () => {
    it("mapea un driver correctamente con constructor", () => {
      const standing: DriverStanding = {
        position: "1",
        positionText: "1",
        points: "100",
        wins: "4",
        Driver: {
          driverId: "colapinto",
          permanentNumber: "43",
          code: "COL",
          url: "",
          givenName: "Franco",
          familyName: "Colapinto",
          dateOfBirth: "2003-05-27",
          nationality: "Argentinian",
        },
        Constructors: [
          {
            constructorId: "williams",
            url: "",
            name: "Williams",
            nationality: "British",
          },
        ],
      };

      const result = mapToProcessedDriver(standing);
      expect(result.points).toBe(100);
      expect(result.position).toBe(1);
      expect(result.wins).toBe(4);
      expect(result.teamName).toBe("Williams");
      expect(result.fullName).toBe("Franco Colapinto");
    });

    it("usa fallbacks si falta el código o constructor", () => {
      const standing: DriverStanding = {
        position: "2",
        positionText: "2",
        points: "50",
        wins: "1",
        Driver: {
          driverId: "alonso",
          url: "",
          givenName: "Fernando",
          familyName: "Alonso",
        },
        Constructors: [],
      };

      const result = mapToProcessedDriver(standing);
      expect(result.code).toBe("");
      expect(result.teamName).toBe("Independent");
    });
  });

  describe("mapToProcessedConstructor", () => {
    it("convierte numericamente points, wins y pos", () => {
      const standing: ConstructorStanding = {
        position: "3",
        positionText: "3",
        points: "115.5",
        wins: "2",
        Constructor: {
          constructorId: "ferrari",
          url: "",
          name: "Ferrari",
          nationality: "Italian",
        },
      };

      const result = mapToProcessedConstructor(standing);
      expect(result.position).toBe(3);
      expect(result.points).toBe(115.5);
      expect(result.wins).toBe(2);
      expect(result.name).toBe("Ferrari");
    });
  });
});
