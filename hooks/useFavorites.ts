"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "lapole-fav-";

export function useFavorites(entity: string) {
  const key = `${STORAGE_KEY}${entity}`;
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFavorites(JSON.parse(stored) as string[]);
      }
    } catch (err) {
      console.warn("Fallo al cargar favoritos de localStorage:", err);
    }
  }, [key]);

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const next = prev.includes(id)
          ? prev.filter((f) => f !== id)
          : [...prev, id];
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch (err) {
          console.warn("Fallo al guardar favorito en localStorage:", err);
        }
        return next;
      });
    },
    [key],
  );

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  return { favorites, toggleFavorite, isFavorite };
}
