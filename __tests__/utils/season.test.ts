import { describe, expect, it } from "vitest";
import { CURRENT_SEASON, PREVIOUS_SEASON } from "@/constants/config";
import { getComparisonSeasons, resolveSeason } from "@/lib/utils/season";

describe("season utilities", () => {
  describe("resolveSeason", () => {
    it("returns the current season when the input is empty", () => {
      expect(resolveSeason(undefined)).toBe(CURRENT_SEASON);
      expect(resolveSeason(null)).toBe(CURRENT_SEASON);
    });

    it("returns the current season when the input is invalid", () => {
      expect(resolveSeason("2010")).toBe(CURRENT_SEASON);
      expect(resolveSeason("invalid")).toBe(CURRENT_SEASON);
    });

    it("returns a supported season unchanged", () => {
      expect(resolveSeason(CURRENT_SEASON)).toBe(CURRENT_SEASON);
      expect(resolveSeason(PREVIOUS_SEASON)).toBe(PREVIOUS_SEASON);
    });
  });

  describe("getComparisonSeasons", () => {
    it("returns the selected season and the immediately previous one", () => {
      const expectedPrevious = (Number.parseInt(PREVIOUS_SEASON, 10) - 1).toString();

      expect(getComparisonSeasons(CURRENT_SEASON)).toEqual([
        CURRENT_SEASON,
        PREVIOUS_SEASON,
      ]);
      expect(getComparisonSeasons(PREVIOUS_SEASON)).toEqual([
        PREVIOUS_SEASON,
        expectedPrevious,
      ]);
    });

    it("falls back to the current season when the input is invalid", () => {
      expect(getComparisonSeasons("abc")).toEqual([
        CURRENT_SEASON,
        PREVIOUS_SEASON,
      ]);
    });
  });
});
