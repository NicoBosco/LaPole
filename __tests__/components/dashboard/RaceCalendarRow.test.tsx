import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RaceCalendarRow } from "@/components/dashboard/RaceCalendarRow";
import { ProcessedRace } from "@/types/race";

const baseRace: ProcessedRace = {
  round: 1,
  season: "2024",
  raceName: "GP de Test",
  circuitName: "Test Circuit",
  country: "Testland",
  locality: "Testville",
  date: new Date("2024-01-01T12:00:00Z"),
  time: "12:00:00Z",
  isPast: false,
  isNext: false,
  hasSprint: false,
};

describe("RaceCalendarRow", () => {
  it("genera link a resultados y muestra 'Ver resultados' si isPast = true", () => {
    const pastRace = { ...baseRace, isPast: true };
    render(<RaceCalendarRow race={pastRace} season="2024" />);

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/races/2024/1");
    expect(screen.getByText("Ver resultados →")).toBeInTheDocument();
  });

  it("no envuelve en Link si isPast = false", () => {
    const futureRace = { ...baseRace, isPast: false };
    render(<RaceCalendarRow race={futureRace} season="2024" />);

    // No debe haber un link si es una carrera futura
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("GP de Test")).toBeInTheDocument();
  });

  it("muestra la etiqueta 'Próxima' si isNext = true", () => {
    const nextRace = { ...baseRace, isNext: true };
    render(<RaceCalendarRow race={nextRace} season="2024" />);

    expect(screen.getByText("Próxima")).toBeInTheDocument();
  });
});
