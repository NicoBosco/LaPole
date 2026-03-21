import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NextRaceCard } from "@/components/dashboard/NextRaceCard";
import { ProcessedRace } from "@/types/race";

const mockRace: ProcessedRace = {
  round: 1,
  season: "2024",
  raceName: "Bahrain Grand Prix",
  circuitName: "Bahrain International Circuit",
  country: "Bahrain",
  locality: "Sakhir",
  date: new Date("2024-03-02T15:00:00Z"),
  time: "15:00:00Z",
  isPast: false,
  isNext: true,
  hasSprint: false,
  firstPractice: { date: "2024-02-29", time: "11:30:00Z" },
  qualifying: { date: "2024-03-01", time: "16:00:00Z" },
};

describe("NextRaceCard", () => {
  it("renderiza nombre de carrera, ronda y circuito", () => {
    render(<NextRaceCard race={mockRace} />);

    expect(screen.getByText("Bahrain Grand Prix")).toBeInTheDocument();
    expect(screen.getByText("Ronda 1")).toBeInTheDocument();
    expect(screen.getByText(/Sakhir, Bahrain/)).toBeInTheDocument();
    expect(
      screen.getByText(/Bahrain International Circuit/),
    ).toBeInTheDocument();
  });

  it("muestra la hora UTC y ARG formateada si race.time existe", () => {
    const { container } = render(<NextRaceCard race={mockRace} />);

    // Validamos independientemente del parseo o separador de TextNodes
    expect(container.textContent).toMatch(/15:00 UTC/);
    expect(container.textContent).toMatch(/ARG/);
  });

  it("muestra badges de sesiones solo cuando existen", () => {
    render(<NextRaceCard race={mockRace} />);

    expect(screen.getByText("FP1")).toBeInTheDocument();
    expect(screen.getByText("Clasificación")).toBeInTheDocument();

    // FP2 y Sprint no existen en el mock
    expect(screen.queryByText("FP2")).not.toBeInTheDocument();
    expect(screen.queryByText("Sprint")).not.toBeInTheDocument();
  });

  it("no rompe si faltan prácticas o qualifying", () => {
    const minimalRace = { ...mockRace };
    delete minimalRace.firstPractice;
    delete minimalRace.qualifying;

    render(<NextRaceCard race={minimalRace} />);

    expect(screen.getByText("Bahrain Grand Prix")).toBeInTheDocument();
    expect(screen.queryByText("FP1")).not.toBeInTheDocument();
    expect(screen.queryByText("Clasificación")).not.toBeInTheDocument();
  });
});
