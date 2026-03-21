import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePagination } from '../../hooks/usePagination';

describe('usePagination', () => {
  it('should initialize with page 1 and correct total pages', () => {
    const items = [1, 2, 3, 4, 5];
    const { result } = renderHook(() => usePagination(items, 2));

    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.paginated).toEqual([1, 2]);
  });

  it('should handle next and prev navigation', () => {
    const items = [1, 2, 3, 4, 5];
    const { result } = renderHook(() => usePagination(items, 2));

    act(() => { result.current.next(); });
    expect(result.current.page).toBe(2);
    expect(result.current.paginated).toEqual([3, 4]);

    act(() => { result.current.prev(); });
    expect(result.current.page).toBe(1);
    expect(result.current.paginated).toEqual([1, 2]);
  });

  it('should respect bounds on next and prev', () => {
    const items = [1, 2];
    const { result } = renderHook(() => usePagination(items, 2));

    act(() => { result.current.next(); });
    expect(result.current.page).toBe(1); // Ya que el total de páginas es 1

    act(() => { result.current.prev(); });
    expect(result.current.page).toBe(1);
  });

  it('should go to specific page and reset', () => {
    const items = [1, 2, 3, 4, 5];
    const { result } = renderHook(() => usePagination(items, 2));

    act(() => { result.current.goTo(3); });
    expect(result.current.page).toBe(3);
    
    act(() => { result.current.reset(); });
    expect(result.current.page).toBe(1);
  });
});
