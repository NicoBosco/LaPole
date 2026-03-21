import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {
  NextRaceSection,
  DriverStandingsSection,
  LastRaceSection,
} from "@/app/page";
import {
  getRaceSchedule,
  getDriverStandings,
  getLastRaceResults,
} from "@/lib/api/races";

// Mock de la API
vi.mock("@/lib/api/races", () => ({
  getRaceSchedule: vi.fn(),
  getDriverStandings: vi.fn(),
  getLastRaceResults: vi.fn(),
}));

describe("Home Page / Server Sections", () => {
  it("si falla getRaceSchedule, muestra ErrorState en la sección de próxima carrera", async () => {
    vi.mocked(getRaceSchedule).mockRejectedValueOnce(
      new Error("Network Error"),
    );

    // Renderizado del componente de servidor
    const Component = (await NextRaceSection({
      season: "2024",
    })) as unknown as React.ReactElement;
    render(Component);

    expect(
      screen.getByText("No pudimos cargar la próxima carrera."),
    ).toBeInTheDocument();
  });

  it("si getDriverStandings devuelve vacío, muestra mensaje adecuado", async () => {
    vi.mocked(getDriverStandings).mockResolvedValueOnce([]);

    const Component = (await DriverStandingsSection({
      season: "2024",
    })) as unknown as React.ReactElement;
    render(Component);

    expect(
      screen.getByText("La clasificación aún no está disponible."),
    ).toBeInTheDocument();
  });

  it("si getLastRaceResults devuelve null, muestra el mensaje correspondiente", async () => {
    // Si la API no lo encuentra devuelve null
    vi.mocked(getLastRaceResults).mockResolvedValueOnce(null);

    const Component = (await LastRaceSection({
      season: "2024",
    })) as unknown as React.ReactElement;
    render(Component);

    expect(
      screen.getByText(
        "Los resultados aparecerán después de la primera carrera.",
      ),
    ).toBeInTheDocument();
  });

  it("si no hay carreras futuras en el listado, muestra el Empty State personalizado", async () => {
    // Al no tener atributo isNext activo, simula caso "Temporada pasada"
    vi.mocked(getRaceSchedule).mockResolvedValueOnce([
      {
        isPast: true,
        isNext: false,
        round: 1,
        raceName: "Past GP",
      } as unknown as import("@/types/race").ProcessedRace,
    ]);

    const Component = (await NextRaceSection({
      season: "2024",
    })) as unknown as React.ReactElement;
    render(Component);

    expect(screen.getByText("Sin carreras a la vista")).toBeInTheDocument();
    expect(
      screen.getByText(
        "La temporada 2024 ha finalizado. Esperamos con ansias el próximo campeonato.",
      ),
    ).toBeInTheDocument();
  });
});
