import { describe, expect, it } from "vitest";
import { CURRENT_SEASON, PREVIOUS_SEASON } from "@/constants/config";
import { getComparisonSeasons, resolveSeason } from "@/lib/utils/season";

describe("utilidades de temporada", () => {
  describe("resolveSeason", () => {
    it("retorna la temporada actual cuando la entrada está vacía", () => {
      expect(resolveSeason(undefined)).toBe(CURRENT_SEASON);
      expect(resolveSeason(null)).toBe(CURRENT_SEASON);
    });

    it("retorna la temporada actual cuando la entrada es inválida", () => {
      expect(resolveSeason("2010")).toBe(CURRENT_SEASON);
      expect(resolveSeason("invalid")).toBe(CURRENT_SEASON);
    });

    it("retorna una temporada soportada sin cambios", () => {
      expect(resolveSeason(CURRENT_SEASON)).toBe(CURRENT_SEASON);
      expect(resolveSeason(PREVIOUS_SEASON)).toBe(PREVIOUS_SEASON);
    });
  });

  describe("getComparisonSeasons", () => {
    it("retorna la temporada seleccionada y la anterior inmediata", () => {
      const expectedPrevious = (
        Number.parseInt(PREVIOUS_SEASON, 10) - 1
      ).toString();

      expect(getComparisonSeasons(CURRENT_SEASON)).toEqual([
        CURRENT_SEASON,
        PREVIOUS_SEASON,
      ]);
      expect(getComparisonSeasons(PREVIOUS_SEASON)).toEqual([
        PREVIOUS_SEASON,
        expectedPrevious,
      ]);
    });

    it("vuelve a la temporada actual cuando la entrada es inválida", () => {
      expect(getComparisonSeasons("abc")).toEqual([
        CURRENT_SEASON,
        PREVIOUS_SEASON,
      ]);
    });
  });
});
