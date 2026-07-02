import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "./context/ToastContext";

const CompareContext = createContext();

const STORAGE_KEY = "status_concept_compare";
export const COMPARE_LIMIT = 3;

function readStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CompareProvider({ children }) {
  const { showToast } = useToast();
  const [compareItems, setCompareItems] = useState(readStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compareItems));
  }, [compareItems]);

  const isCompared = (id) => compareItems.some((item) => item.id === id);

  const toggleCompare = (product) => {
    if (!product?.id) return;
    if (isCompared(product.id)) {
      setCompareItems((prev) => prev.filter((item) => item.id !== product.id));
      showToast("Removido do comparador.");
      return;
    }
    if (compareItems.length >= COMPARE_LIMIT) {
      showToast("So podes comparar 3 produtos no comparador.", "error");
      return;
    }
    if (compareItems.length > 0 && compareItems[0].category !== product.category) {
      showToast("So podes comparar produtos da mesma categoria.", "error");
      return;
    }
    setCompareItems((prev) => [...prev, product]);
    showToast("Adicionado ao comparador.");
  };

  const removeCompare = (id) => setCompareItems((prev) => prev.filter((item) => item.id !== id));
  const clearCompare = () => setCompareItems([]);

  return (
    <CompareContext.Provider value={{ compareItems, isCompared, toggleCompare, removeCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
