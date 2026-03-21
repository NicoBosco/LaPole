import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { usePagination } from "../../hooks/usePagination";

describe("Hook usePagination", () => {
  it("se inicializa en la página 1 y con el recorte esperado", () => {
    const items = [1, 2, 3, 4, 5];
    const { result } = renderHook(() => usePagination(items, 2));

    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.paginated).toEqual([1, 2]);
  });

  it("se desplaza a la página siguiente y anterior dentro de los límites", () => {
    const items = [1, 2, 3, 4, 5];
    const { result } = renderHook(() => usePagination(items, 2));

    act(() => {
      result.current.next();
    });

    expect(result.current.page).toBe(2);
    expect(result.current.paginated).toEqual([3, 4]);

    act(() => {
      result.current.prev();
    });

    expect(result.current.page).toBe(1);
    expect(result.current.paginated).toEqual([1, 2]);
  });

  it("restringe la navegación al intentar salir de los límites", () => {
    const items = [1, 2];
    const { result } = renderHook(() => usePagination(items, 2));

    act(() => {
      result.current.goTo(99);
    });

    expect(result.current.page).toBe(1);

    act(() => {
      result.current.prev();
    });

    expect(result.current.page).toBe(1);
  });

  it("mantiene la página renderizada segura cuando la lista se reduce", () => {
    const { result, rerender } = renderHook(
      ({ items }) => usePagination(items, 2),
      { initialProps: { items: [1, 2, 3, 4, 5] } },
    );

    act(() => {
      result.current.goTo(3);
    });

    expect(result.current.page).toBe(3);
    expect(result.current.paginated).toEqual([5]);

    rerender({ items: [1, 2] });

    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.paginated).toEqual([1, 2]);
  });

  it("puede restablecerse a la página 1", () => {
    const items = [1, 2, 3, 4, 5];
    const { result } = renderHook(() => usePagination(items, 2));

    act(() => {
      result.current.goTo(3);
    });

    expect(result.current.page).toBe(3);

    act(() => {
      result.current.reset();
    });

    expect(result.current.page).toBe(1);
  });
});
