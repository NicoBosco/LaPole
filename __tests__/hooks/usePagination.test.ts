import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { usePagination } from "../../hooks/usePagination";

describe("usePagination", () => {
  it("initializes with page 1 and the expected slice", () => {
    const items = [1, 2, 3, 4, 5];
    const { result } = renderHook(() => usePagination(items, 2));

    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.paginated).toEqual([1, 2]);
  });

  it("moves to the next and previous page within bounds", () => {
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

  it("clamps navigation when trying to go out of bounds", () => {
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

  it("keeps the rendered page safe when the list shrinks", () => {
    const { result, rerender } = renderHook(
      ({ items }) => usePagination(items, 2),
      { initialProps: { items: [1, 2, 3, 4, 5] } }
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

  it("can reset back to page 1", () => {
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
