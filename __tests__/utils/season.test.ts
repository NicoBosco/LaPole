import { describe, it, expect } from "vitest";
import { resolveSeason, getComparisonSeasons } from "@/lib/utils/season";
import { CURRENT_SEASON } from "@/constants/config";

describe("season utilities", () => {
  describe("resolveSeason", () => {
    it("returns naturally current season on empty param", () => {
      expect(resolveSeason(undefined)).toBe(CURRENT_SEASON);
      expect(resolveSeason(null)).toBe(CURRENT_SEASON);
    });

    it("returns current season on invalid param", () => {
      expect(resolveSeason("2010")).toBe(CURRENT_SEASON);
      expect(resolveSeason("invalid")).toBe(CURRENT_SEASON);
    });

    it("returns exactly the valid requested season", () => {
      expect(resolveSeason("2025")).toBe("2025");
      expect(resolveSeason("2026")).toBe("2026");
    });
  });

  describe("getComparisonSeasons", () => {
    it("returns mathematically right current and previous seasons", () => {
      expect(getComparisonSeasons("2026")).toEqual(["2026", "2025"]);
      expect(getComparisonSeasons("2025")).toEqual(["2025", "2024"]);
      expect(getComparisonSeasons("2020")).toEqual(["2020", "2019"]);
    });

    it("handles invalid inputs falling back safely", () => {
      const fallbackCurrentInt = parseInt(CURRENT_SEASON, 10);
      expect(getComparisonSeasons("abc")).toEqual([
        "abc",
        (fallbackCurrentInt - 1).toString(),
      ]);
    });
  });
});
