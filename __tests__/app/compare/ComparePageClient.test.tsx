import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ComparePageClient } from "@/app/compare/ComparePageClient";
import { ProcessedDriver } from "@/types/driver";

// Simulación de ResponsiveContainer para que renderice el BarChart en Vitest
vi.mock("recharts", async (importOriginal) => {
  const OriginalRecharts = await importOriginal<typeof import("recharts")>();
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: "100%", height: "200px" }}>{children}</div>
    ),
  };
});

// Mock de manejo de rutas de Next.js para enlaces
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));
// Mock de SeasonSelector ya que solo probamos la lógica de comparación
vi.mock("@/components/ui/SeasonSelector", () => ({
  SeasonSelector: () => <div>SeasonSelector</div>,
}));

const mockStandings: ProcessedDriver[] = [
  {
    driverId: "max_verstappen",
    code: "VER",
    number: "1",
    firstName: "Max",
    lastName: "Verstappen",
    fullName: "Max Verstappen",
    teamId: "red_bull",
    teamName: "Red Bull",
    points: 400,
    position: 1,
    wins: 15,
    nationality: "Dutch",
    dob: "1997-09-30",
  },
  {
    driverId: "fernando_alonso",
    code: "ALO",
    number: "14",
    firstName: "Fernando",
    lastName: "Alonso",
    fullName: "Fernando Alonso",
    teamId: "aston_martin",
    teamName: "Aston Martin",
    points: 200,
    position: 4,
    wins: 0,
    nationality: "Spanish",
    dob: "1981-07-29",
  },
];

describe("ComparePageClient", () => {
  it("sin selección, muestra estado inicial", () => {
    render(<ComparePageClient standings={mockStandings} season="2024" />);
    expect(screen.getByText("Compara dos pilotos")).toBeInTheDocument();
    expect(
      screen.getByText(/Selecciona un piloto en cada desplegable/),
    ).toBeInTheDocument();
  });

  it("con un solo piloto, muestra 'Falta un piloto'", () => {
    render(<ComparePageClient standings={mockStandings} season="2024" />);

    // Combobox/Select para Piloto A
    const selectA = screen.getByRole("combobox", { name: "Piloto A" });
    fireEvent.change(selectA, { target: { value: "max_verstappen" } });

    expect(screen.getByText("Falta un piloto")).toBeInTheDocument();
    expect(
      screen.getByText(/Para completar la comparativa/),
    ).toBeInTheDocument();
  });

  it("con dos pilotos válidos, muestra comparación visual, estadisticas y links", () => {
    render(<ComparePageClient standings={mockStandings} season="2024" />);

    const selectA = screen.getByRole("combobox", { name: "Piloto A" });
    const selectB = screen.getByRole("combobox", { name: "Piloto B" });

    fireEvent.change(selectA, { target: { value: "max_verstappen" } });
    fireEvent.change(selectB, { target: { value: "fernando_alonso" } });

    expect(
      screen.getByText("Comparativa visual de puntos y victorias"),
    ).toBeInTheDocument();

    // Verificar stats en tabla
    // 400 puntos de Max, 200 de Alonso
    expect(screen.getByText("400 ✓")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();

    // Verificar que los links se renderizan
    const links = screen.getAllByRole("link");
    expect(
      links.some(
        (l) => l.getAttribute("href") === "/drivers/max_verstappen?season=2024",
      ),
    ).toBeTruthy();
    expect(
      links.some(
        (l) =>
          l.getAttribute("href") === "/drivers/fernando_alonso?season=2024",
      ),
    ).toBeTruthy();
  });

  it("bloquea elegir el mismo piloto en ambos selectors", () => {
    render(<ComparePageClient standings={mockStandings} season="2024" />);

    const selectA = screen.getByRole("combobox", { name: "Piloto A" });
    fireEvent.change(selectA, { target: { value: "max_verstappen" } });

    const selectB = screen.getByRole("combobox", { name: "Piloto B" });
    // el option max_verstappen NO deberia existir en B porque esta excluido
    const optionsB = within(selectB).getAllByRole("option");
    const hasMax = optionsB.some(
      (o) => (o as HTMLOptionElement).value === "max_verstappen",
    );

    expect(hasMax).toBe(false);
  });
});
