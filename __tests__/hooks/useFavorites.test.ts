import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useFavorites } from '../../hooks/useFavorites';

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty default state', async () => {
    const { result } = renderHook(() => useFavorites('drivers'));
    await act(async () => { await new Promise(r => setTimeout(r, 50)); });
    expect(result.current.favorites).toEqual([]);
  });



  it('should correctly identify if an item is favorited', async () => {
    const { result } = renderHook(() => useFavorites('drivers'));
    await act(async () => { await new Promise(r => setTimeout(r, 50)); });
    
    act(() => { result.current.toggleFavorite('sainz'); });
    expect(result.current.isFavorite('sainz')).toBe(true);
    expect(result.current.isFavorite('alonso')).toBe(false);
  });
});
