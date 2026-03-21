import { describe, it, expect } from 'vitest';
import { mapRaceSchedule, mapToProcessedRaceWithResults } from '@/lib/api/mappers/f1';
import { Race, RaceWithResults } from '@/types/race';

describe('F1 Mappers', () => {
  describe('mapRaceSchedule', () => {
    it('should map standard race schedule properly', () => {
      const mockRaces: Race[] = [{
        season: "2024", round: "1", raceName: "Bahrain Grand Prix",
        Circuit: { circuitId: "bahrain", circuitName: "Bahrain International Circuit", Location: { lat: "26.0325", long: "50.5106", locality: "Sakhir", country: "Bahrain" } },
        date: "2024-03-02", time: "15:00:00Z"
      }];
      
      const processed = mapRaceSchedule(mockRaces);
      expect(processed[0].round).toBe(1);
      expect(typeof processed[0].isNext).toBe("boolean");
      expect(typeof processed[0].isPast).toBe("boolean");
    });
  });

  describe('mapToProcessedRaceWithResults', () => {
    it('should map a race with results without crashing', () => {
      const mockRace: RaceWithResults = {
        season: "2024", round: "1", raceName: "Bahrain Grand Prix",
        Circuit: { circuitId: "bahrain", circuitName: "Bahrain", Location: { lat: "0", long: "0", locality: "Loc", country: "Country" } },
        date: "2024-03-02", time: "15:00:00Z",
        Results: [
          {
            number: "1", position: "1", positionText: "1", points: "25", grid: "1", laps: "57", status: "Finished",
            Driver: { driverId: "max_verstappen", url: "", givenName: "Max", familyName: "Verstappen", dateOfBirth: "1997-09-30", nationality: "Dutch" },
            Constructor: { constructorId: "red_bull", url: "", name: "Red Bull", nationality: "Austrian" },
            Time: { millis: "5486830", time: "1:31:44.742" }
          }
        ]
      };
      
      const processed = mapToProcessedRaceWithResults(mockRace);
      expect(processed.round).toBe(1);
      expect(processed.results[0].driverId).toBe("max_verstappen");
      expect(processed.results[0].points).toBe(25);
      expect(processed.results[0].position).toBe(1);
    });
  });
});
