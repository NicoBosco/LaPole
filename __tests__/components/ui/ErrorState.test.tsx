import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ErrorState } from "@/components/ui/ErrorState";

describe("ErrorState", () => {
  it("renderiza el mensaje por defecto", () => {
    render(<ErrorState />);

    expect(
      screen.getByText("Ocurrió un error al cargar los datos."),
    ).toBeInTheDocument();
  });

  it("renderiza un mensaje personalizado", () => {
    const CustomMessage = "La API está caída en este momento.";
    render(<ErrorState message={CustomMessage} />);

    expect(screen.getByText(CustomMessage)).toBeInTheDocument();
  });

  it("no muestra el botón de reintentar si no se pasa la función", () => {
    render(<ErrorState />);

    const boton = screen.queryByRole("button", { name: /reintentar/i });
    expect(boton).not.toBeInTheDocument();
  });

  it("muestra el botón de reintentar y ejecuta la función al hacer clic", () => {
    const handleRetry = vi.fn();
    render(<ErrorState onRetry={handleRetry} />);

    const boton = screen.getByRole("button", { name: /reintentar/i });
    expect(boton).toBeInTheDocument();

    fireEvent.click(boton);

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
