import "@testing-library/jest-dom/vitest";
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useTheme } from "@/hooks/useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = "";
    vi.restoreAllMocks();

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("inicializa con el tema dark por defecto", () => {
    const { result } = renderHook(() => useTheme());

    // Aunque mounted empieza en false, el primer render efectúa el useEffect y lee 'dark'
    expect(result.current.theme).toBe("dark");
  });

  it("lee el tema desde localStorage si existe", () => {
    localStorage.setItem("lapole-theme", "light");
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("light");
  });

  it("guarda el tema en localStorage al hacer toggle", () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    // Dark -> Light
    expect(result.current.theme).toBe("light");
    expect(localStorage.getItem("lapole-theme")).toBe("light");
  });

  it("actualiza el data-theme del document cuando setea el tema", () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme("light");
    });

    expect(document.documentElement.dataset.theme).toBe("light");

    act(() => {
      result.current.setTheme("dark");
    });

    // Tema oscuro limpia el dataset
    expect(document.documentElement.dataset.theme).toBe("");
  });
});
