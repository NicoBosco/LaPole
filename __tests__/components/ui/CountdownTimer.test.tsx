import "@testing-library/jest-dom/vitest";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CountdownTimer } from "@/components/ui/CountdownTimer";

describe("CountdownTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renderiza el estado 'Carrera finalizada' si la fecha ya pasó", () => {
    // Fijamos el tiempo actual
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() - 1); // 1 hora en el pasado

    render(<CountdownTimer targetDate={targetDate} />);

    // Avanzar a mounted
    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.getByText("Carrera finalizada")).toBeInTheDocument();
  });

  it("renderiza correctamente los días, horas, minutos y segundos a futuro", () => {
    // Fijamos fijos para asercion: 1 dia, 2 horas, 3 minutos, 4 segundos al futuro
    const now = new Date("2024-01-01T10:00:00Z");
    vi.setSystemTime(now);

    const futureDate = new Date(
      now.getTime() + 1 * 86400000 + 2 * 3600000 + 3 * 60000 + 4 * 1000,
    );

    render(<CountdownTimer targetDate={futureDate} />);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    // Validar que se muestran las partes
    expect(screen.getByText("01")).toBeInTheDocument(); // día
    expect(screen.getByText("02")).toBeInTheDocument(); // h
    expect(screen.getByText("03")).toBeInTheDocument(); // m
    expect(screen.getByText("04")).toBeInTheDocument(); // s
  });

  it("actualiza el contador con el paso del tiempo", () => {
    const now = new Date("2024-01-01T10:00:00Z");
    vi.setSystemTime(now);

    const futureDate = new Date(now.getTime() + 10000); // 10 segundos

    render(<CountdownTimer targetDate={futureDate} />);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByText("10")).toBeInTheDocument(); // 10s inicialmente

    act(() => {
      vi.advanceTimersByTime(1000); // pasa 1 seg
    });

    expect(screen.getByText("09")).toBeInTheDocument(); // 9s después
  });

  it("usa medianoche UTC si no se pasa targetTime y recibe un string", () => {
    // string 2024-01-02 -> 2024-01-02T00:00:00Z
    const now = new Date("2024-01-01T23:00:00Z");
    vi.setSystemTime(now);

    render(<CountdownTimer targetDate="2024-01-02" />);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    // Faltaría exactamente 1 hora para la medianoche UTC
    expect(screen.getByText("01")).toBeInTheDocument(); // horas
    expect(screen.getAllByText("00").length).toBeGreaterThanOrEqual(2); // mins y segs
  });
});
