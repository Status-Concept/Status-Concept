import { useState } from "react";
import { useFavorites } from "./FavoritesContext";

export default function FavoriteButton({ product, size = 20, style = {} }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [animate, setAnimate] = useState(false);
  const active = isFavorite(product.id);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setAnimate(true);
    toggleFavorite(product);
    setTimeout(() => setAnimate(false), 400);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      style={{
        background: "rgba(0,0,0,.35)",
        backdropFilter: "blur(4px)",
        border: "none",
        borderRadius: "50%",
        width: size + 16,
        height: size + 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all .3s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: animate ? "scale(1.3)" : "scale(1)",
        zIndex: 5,
        ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,.55)"; e.currentTarget.style.transform = "scale(1.1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,.35)"; e.currentTarget.style.transform = animate ? "scale(1.3)" : "scale(1)"; }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={active ? "#c41e3a" : "none"}
        stroke={active ? "#c41e3a" : "rgba(255,255,255,.9)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: "all .3s ease" }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
