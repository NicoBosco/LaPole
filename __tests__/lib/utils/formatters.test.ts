import { describe, it, expect } from "vitest";
import {
  formatRaceDate,
  formatShortDate,
  formatLapTime,
  truncate,
  getNationalityFlag,
} from "@/lib/utils/formatters";

describe("formatters", () => {
  describe("formatRaceDate", () => {
    it("devuelve una fecha estable en UTC", () => {
      const result = formatRaceDate("2024-03-02");
      expect(result).toBe("2 mar 2024");
    });
  });

  describe("formatShortDate", () => {
    it("devuelve la fecha corta correcta", () => {
      const result = formatShortDate("2024-03-02");
      expect(result).toBe("2 mar");
    });
  });

  describe("formatLapTime", () => {
    it("convierte tiempo numérico en segundos a formato mm:ss.sss", () => {
      expect(formatLapTime("83.456")).toBe("1:23.456");
      expect(formatLapTime("59.123")).toBe("59.123");
    });

    it("devuelve el mismo string si ya viene formateado", () => {
      expect(formatLapTime("1:23.456")).toBe("1:23.456");
    });
  });

  describe("truncate", () => {
    it("corta el texto si supera el límite", () => {
      expect(truncate("Hola mundo", 8)).toBe("Hola ...");
    });

    it("no modifica el texto si no supera el límite", () => {
      expect(truncate("Hola", 8)).toBe("Hola");
    });
  });

  describe("getNationalityFlag", () => {
    it("devuelve la bandera mapeada", () => {
      expect(getNationalityFlag("Argentinian")).toBe("🇦🇷");
      expect(getNationalityFlag("Spanish")).toBe("🇪🇸");
    });

    it("devuelve string vacío si la nacionalidad es desconocida", () => {
      expect(getNationalityFlag("Unknown")).toBe("");
    });
  });
});
