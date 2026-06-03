import { createContext, useCallback, useContext, useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { supabase } from "./lib/supabase";

const FavoritesContext = createContext();

const STORAGE_KEY = "status_concept_favorites";
const DETAILS_KEY = "status_concept_favorite_details";

function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function favoriteId(product) {
  return product?.id || product?.product_id;
}

export function FavoritesProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState(() => readStorage(STORAGE_KEY, []));
  const [favoriteDetails, setFavoriteDetails] = useState(() => readStorage(DETAILS_KEY, {}));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(DETAILS_KEY, JSON.stringify(favoriteDetails));
  }, [favoriteDetails]);

  const loadSupabaseFavorites = useCallback(async () => {
    if (!supabase || !user) return;
    setLoading(true);

    const localFavorites = readStorage(STORAGE_KEY, []);
    const rowsToMigrate = localFavorites
      .map((item) => favoriteId(item))
      .filter(Boolean)
      .map((id) => ({ user_id: user.id, product_id: id }));

    if (rowsToMigrate.length > 0) {
      await supabase.from("favorites").upsert(rowsToMigrate, { onConflict: "user_id,product_id" });
      setFavoriteDetails((prev) => localFavorites.reduce((acc, item) => {
        const id = favoriteId(item);
        return id ? { ...acc, [id]: { ...item, id } } : acc;
      }, prev));
    }

    const { data, error } = await supabase
      .from("favorites")
      .select("product_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      const details = readStorage(DETAILS_KEY, {});
      setFavorites((data || []).map((row) => ({
        ...(details[row.product_id] || {}),
        id: row.product_id,
        addedAt: new Date(row.created_at).getTime(),
      })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (user) loadSupabaseFavorites();
    else setFavorites(readStorage(STORAGE_KEY, []));
  }, [authLoading, loadSupabaseFavorites, user]);

  const isFavorite = (id) => favorites.some((f) => favoriteId(f) === id);

  const toggleFavorite = async (product) => {
    const id = favoriteId(product);
    if (!id) return;

    setFavoriteDetails((prev) => ({ ...prev, [id]: { ...product, id } }));

    if (user && supabase) {
      if (isFavorite(id)) {
        setFavorites((prev) => prev.filter((f) => favoriteId(f) !== id));
        await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", id);
        return;
      }

      const optimistic = { ...product, id, addedAt: Date.now() };
      setFavorites((prev) => [...prev, optimistic]);
      const { error } = await supabase.from("favorites").upsert({ user_id: user.id, product_id: id });
      if (error) setFavorites((prev) => prev.filter((f) => favoriteId(f) !== id));
      return;
    }

    setFavorites((prev) => {
      if (prev.some((f) => favoriteId(f) === id)) {
        return prev.filter((f) => favoriteId(f) !== id);
      }
      return [...prev, { ...product, id, addedAt: Date.now() }];
    });
  };

  const removeFavorite = async (id) => {
    setFavorites((prev) => prev.filter((f) => favoriteId(f) !== id));
    if (user && supabase) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", id);
    }
  };

  const clearFavorites = async () => {
    setFavorites([]);
    if (user && supabase) {
      await supabase.from("favorites").delete().eq("user_id", user.id);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, removeFavorite, clearFavorites, loading, refreshFavorites: loadSupabaseFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
