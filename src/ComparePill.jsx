import { useLocation } from "react-router-dom";
import { useCompare, COMPARE_LIMIT } from "./CompareContext";
import { useLocalizedNavigate } from "./hooks/useLocalizedNavigate";

export default function ComparePill() {
  const { compareItems } = useCompare();
  const navigate = useLocalizedNavigate();
  const location = useLocation();

  if (compareItems.length === 0) return null;
  if (location.pathname.includes("/cliente/comparador")) return null;

  return (
    <button
      type="button"
      className="compare-pill fs"
      onClick={() => navigate("/cliente/comparador")}
      aria-label={`Open comparison with ${compareItems.length} products`}
    >
      <span className="compare-pill-thumbs">
        {compareItems.slice(0, COMPARE_LIMIT).map((item) => (
          <img key={item.id} src={item.img} alt="" />
        ))}
      </span>
      Comparar ({compareItems.length}/{COMPARE_LIMIT})
    </button>
  );
}
