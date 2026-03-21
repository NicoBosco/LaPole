import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RaceDetailPage from "@/app/races/[season]/[round]/page";
import { getRaceResults } from "@/lib/api/races";
import { notFound } from "next/navigation";

// Mock de navegación de Next.js
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

// Mock de la API
vi.mock("@/lib/api/races", () => ({
  getRaceResults: vi.fn(),
}));

describe("RaceDetailPage", () => {
  it("si getRaceResults devuelve null, invoca notFound", async () => {
    vi.mocked(getRaceResults).mockRejectedValueOnce(new Error("API Error"));

    const params = Promise.resolve({ season: "2024", round: "1" });

    // Al fallar getRaceResults, la página hace catch y devuelve null internamente
    // Lo cual dispara notFound()
    await expect(RaceDetailPage({ params })).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
  });

  it("si results está vacío, muestra empty state", async () => {
    vi.mocked(getRaceResults).mockResolvedValueOnce({
      season: "2024",
      round: 1,
      raceName: "Bahrain GP",
      circuitName: "Sakhir",
      locality: "Sakhir",
      country: "Bahrain",
      date: new Date(),
      results: [],
    } as unknown as import("@/types/race").ProcessedRaceWithResults);

    const params = Promise.resolve({ season: "2024", round: "1" });
    const Component = (await RaceDetailPage({
      params,
    })) as unknown as React.ReactElement;
    render(Component);

    expect(screen.getByText("Sin resultados disponibles")).toBeInTheDocument();
  });

  it("si hay resultados, renderiza piloto/equipo/puntos", async () => {
    vi.mocked(getRaceResults).mockResolvedValueOnce({
      season: "2024",
      round: 1,
      raceName: "Bahrain GP",
      circuitName: "Sakhir",
      locality: "Sakhir",
      country: "Bahrain",
      date: new Date(),
      results: [
        {
          position: 1,
          positionText: "1",
          points: 25,
          driverId: "max_verstappen",
          driverName: "Max Verstappen",
          teamId: "red_bull",
          status: "Finished",
          time: "1:30:00.000",
          isFastestLap: true,
          fastestLapTime: "1:32.608",
        },
      ],
    } as unknown as import("@/types/race").ProcessedRaceWithResults);

    const params = Promise.resolve({ season: "2024", round: "1" });
    const Component = (await RaceDetailPage({
      params,
    })) as unknown as React.ReactElement;
    render(Component);

    expect(screen.getByText("Max Verstappen")).toBeInTheDocument();
    expect(screen.getByText("Red Bull")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("⚡ Vuelta rápida")).toBeInTheDocument();
  });
});
