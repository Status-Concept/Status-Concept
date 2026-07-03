import { useState } from "react";
import { useCompare } from "./CompareContext";

export default function CompareButton({ product, size = 20, style = {} }) {
  const { isCompared, toggleCompare } = useCompare();
  const [animate, setAnimate] = useState(false);
  const active = isCompared(product.id);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setAnimate(true);
    toggleCompare(product);
    setTimeout(() => setAnimate(false), 400);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={active ? "Remove from comparison" : "Add to comparison"}
      title={active ? "Remove from comparison" : "Compare"}
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
        fill="none"
        stroke={active ? "#8a7658" : "rgba(255,255,255,.9)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: "all .3s ease" }}
      >
        <path d="M9 3 5 7l4 4" />
        <path d="M5 7h11" />
        <path d="m15 21 4-4-4-4" />
        <path d="M19 17H8" />
      </svg>
    </button>
  );
}
