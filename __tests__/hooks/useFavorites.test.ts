import { renderHook, act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useFavorites } from "../../hooks/useFavorites";

describe("Hook useFavorites", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("comienza con una lista vacía cuando no hay nada almacenado", async () => {
    const { result } = renderHook(() => useFavorites("drivers"));

    await waitFor(() => {
      expect(result.current.favorites).toEqual([]);
    });
  });

  it("carga la lista desde localStorage", async () => {
    localStorage.setItem(
      "lapole-fav-drivers",
      JSON.stringify(["piastri", "leclerc"]),
    );

    const { result } = renderHook(() => useFavorites("drivers"));

    await waitFor(() => {
      expect(result.current.favorites).toEqual(["piastri", "leclerc"]);
    });
  });

  it("alterna los favoritos y persiste el nuevo estado", async () => {
    const { result } = renderHook(() => useFavorites("drivers"));

    await waitFor(() => {
      expect(result.current.favorites).toEqual([]);
    });

    act(() => {
      result.current.toggleFavorite("sainz");
    });

    expect(result.current.isFavorite("sainz")).toBe(true);
    expect(localStorage.getItem("lapole-fav-drivers")).toBe(
      JSON.stringify(["sainz"]),
    );

    act(() => {
      result.current.toggleFavorite("sainz");
    });

    expect(result.current.isFavorite("sainz")).toBe(false);
    expect(localStorage.getItem("lapole-fav-drivers")).toBe(JSON.stringify([]));
  });
});
