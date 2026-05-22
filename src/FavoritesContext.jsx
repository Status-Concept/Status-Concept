import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

const STORAGE_KEY = "status_concept_favorites";

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (id) => favorites.some((f) => f.id === id);

  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === product.id)) {
        return prev.filter((f) => f.id !== product.id);
      }
      return [...prev, { ...product, addedAt: Date.now() }];
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const clearFavorites = () => setFavorites([]);

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, removeFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
