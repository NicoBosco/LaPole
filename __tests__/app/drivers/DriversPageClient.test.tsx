import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DriversPageClient } from "@/app/drivers/DriversPageClient";
import { ProcessedDriver } from "@/types/driver";

// Mocking Next.js Link para evitar errores de router
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
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
  // Generar 12 pilotos más para probar paginación (total 14)
  ...Array.from({ length: 12 }).map((_, i) => ({
    driverId: `driver_${i}`,
    code: `D${i}`,
    number: `${90 + i}`,
    firstName: `Name_${i}`,
    lastName: `Last_${i}`,
    fullName: `Name_${i} Last_${i}`,
    teamId: "test_team",
    teamName: "Test Team",
    points: 10,
    position: i + 5,
    wins: 0,
    nationality: "Test",
    dob: "2000-01-01",
  })),
];

describe("DriversPageClient", () => {
  it("al buscar texto, filtra por nombre/equipo/código", () => {
    render(<DriversPageClient standings={mockStandings} season="2024" />);

    // Buscar por apellido
    fireEvent.change(screen.getByPlaceholderText("Buscar piloto o equipo..."), {
      target: { value: "Alonso" },
    });
    expect(screen.getByText("Alonso")).toBeInTheDocument();
    expect(screen.queryByText("Verstappen")).not.toBeInTheDocument();

    // Buscar por equipo
    fireEvent.change(screen.getByPlaceholderText("Buscar piloto o equipo..."), {
      target: { value: "Aston Martin" },
    });
    expect(screen.getByText("Alonso")).toBeInTheDocument();

    // Buscar por código
    fireEvent.change(screen.getByPlaceholderText("Buscar piloto o equipo..."), {
      target: { value: "VER" },
    });
    expect(screen.getByText("Verstappen")).toBeInTheDocument();
  });

  it("en tab favorites, solo muestra favoritos e interactúa con el componente", () => {
    render(<DriversPageClient standings={mockStandings} season="2024" />);

    // Hacer tap en el botón de favoritos de Alonso
    const starBtn = screen.getByRole("button", {
      name: /Agregar Alonso a favoritos|Quitar Alonso de favoritos/,
    });
    fireEvent.click(starBtn); // Ahora es favorito

    // Cambiar a tab Favorites
    const tabFav = screen.getByRole("button", { name: /⭐ Favoritos/ });
    fireEvent.click(tabFav);

    expect(screen.getByText("Alonso")).toBeInTheDocument();
    expect(screen.queryByText("Verstappen")).not.toBeInTheDocument();
  });

  it("al cambiar query, vuelve a tab all", () => {
    render(<DriversPageClient standings={mockStandings} season="2024" />);

    // Ir a favs
    fireEvent.click(screen.getByRole("button", { name: /⭐ Favoritos/ }));

    // Escribir en busqueda
    fireEvent.change(screen.getByPlaceholderText("Buscar piloto o equipo..."), {
      target: { value: "Verstappen" },
    });

    // El tab Todos debe estar activo (y lo sabemos porque renderiza VER)
    expect(screen.getByText("Verstappen")).toBeInTheDocument();
  });

  it("muestra empty state correcto si no hay resultados", () => {
    render(<DriversPageClient standings={mockStandings} season="2024" />);

    fireEvent.change(screen.getByPlaceholderText("Buscar piloto o equipo..."), {
      target: { value: "Zidane" },
    });

    expect(screen.getByText("No encontramos a ese piloto")).toBeInTheDocument();
    expect(
      screen.getByText(/No hay coincidencias para "Zidane"/),
    ).toBeInTheDocument();
  });

  it("al paginar, cambia el subset visible", () => {
    render(<DriversPageClient standings={mockStandings} season="2024" />);

    // Verificamos que se muestran 12 items por página
    expect(screen.getByText("Verstappen")).toBeInTheDocument();
    expect(screen.queryByText("Last_11")).not.toBeInTheDocument(); // Index 11 es el 13vo piloto

    // Siguiente página
    fireEvent.click(screen.getByRole("button", { name: "Página siguiente" }));

    expect(screen.queryByText("Verstappen")).not.toBeInTheDocument();
    expect(screen.getByText("Last_11")).toBeInTheDocument();
  });
});
