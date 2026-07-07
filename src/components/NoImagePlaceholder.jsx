// "No image" placeholder — a quiet brand panel (serif monogram) rather than an
// apology. Shared by the products grid/list and the catalogue index.
export default function NoImagePlaceholder({ list }) {
  return (
    <div className={`rd-no-image${list ? " list" : ""}`}>
      <span className="rd-no-image-mark" aria-hidden="true">S</span>
      <span className="rd-no-image-label">See it in the showroom</span>
    </div>
  );
}
