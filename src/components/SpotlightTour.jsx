import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Game-style UI tutorial: the screen dims except for a spotlight cut-out over the
// current step's target element, with an explainer popup beside it.
// steps: [{ target: cssSelector | null, title, text }] - target null centers the popup.
export default function SpotlightTour({ steps, open, onClose }) {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState(null);
  const popupRef = useRef(null);

  const step = steps[index];

  useEffect(() => {
    if (open) setIndex(0);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !step) return;
    const measure = () => {
      if (!step.target) { setRect(null); return; }
      const el = document.querySelector(step.target);
      if (!el) { setRect(null); return; }
      el.scrollIntoView({ block: "center", behavior: "instant" });
      const r = el.getBoundingClientRect();
      setRect({ top: r.top - 8, left: r.left - 8, width: r.width + 16, height: r.height + 16 });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open, index, step]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && index < steps.length - 1) setIndex(index + 1);
      if (e.key === "ArrowLeft" && index > 0) setIndex(index - 1);
    };
    document.addEventListener("keydown", onKey);
    popupRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, index, steps.length, onClose]);

  if (!open || !step) return null;

  const last = index === steps.length - 1;
  const popupStyle = rect
    ? rect.top + rect.height + 190 < window.innerHeight
      ? { top: rect.top + rect.height + 16, left: Math.min(Math.max(16, rect.left), window.innerWidth - 356) }
      : { top: Math.max(16, rect.top - 206), left: Math.min(Math.max(16, rect.left), window.innerWidth - 356) }
    : { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

  return (
    <div className="tour-root" role="dialog" aria-modal="true" aria-label="Tutorial">
      {rect ? (
        <div
          className="tour-spotlight"
          style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
        />
      ) : (
        <div className="tour-backdrop" />
      )}
      <div ref={popupRef} tabIndex={-1} className="tour-popup" style={popupStyle}>
        <span className="fs tour-step-count">{index + 1} / {steps.length}</span>
        <h3 className="ff">{step.title}</h3>
        <p className="fs">{step.text}</p>
        <div className="tour-actions">
          <button type="button" className="fs tour-skip" onClick={onClose}>Sair</button>
          <div>
            {index > 0 && (
              <button type="button" className="cb cd fs" onClick={() => setIndex(index - 1)}>Anterior</button>
            )}
            <button type="button" className="cb cg fs" onClick={() => (last ? onClose() : setIndex(index + 1))}>
              {last ? "Concluir" : "Seguinte"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
