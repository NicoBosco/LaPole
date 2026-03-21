import { renderHook, act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useFavorites } from "../../hooks/useFavorites";

describe("useFavorites", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with an empty list when nothing is stored", async () => {
    const { result } = renderHook(() => useFavorites("drivers"));

    await waitFor(() => {
      expect(result.current.favorites).toEqual([]);
    });
  });

  it("hydrates the list from localStorage", async () => {
    localStorage.setItem("lapole-fav-drivers", JSON.stringify(["piastri", "leclerc"]));

    const { result } = renderHook(() => useFavorites("drivers"));

    await waitFor(() => {
      expect(result.current.favorites).toEqual(["piastri", "leclerc"]);
    });
  });

  it("toggles favorites and persists the new state", async () => {
    const { result } = renderHook(() => useFavorites("drivers"));

    await waitFor(() => {
      expect(result.current.favorites).toEqual([]);
    });

    act(() => {
      result.current.toggleFavorite("sainz");
    });

    expect(result.current.isFavorite("sainz")).toBe(true);
    expect(localStorage.getItem("lapole-fav-drivers")).toBe(JSON.stringify(["sainz"]));

    act(() => {
      result.current.toggleFavorite("sainz");
    });

    expect(result.current.isFavorite("sainz")).toBe(false);
    expect(localStorage.getItem("lapole-fav-drivers")).toBe(JSON.stringify([]));
  });
});
