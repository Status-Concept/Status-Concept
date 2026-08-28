const KITCHEN_COLLECTION_LABELS = {
  "black-stainless-steel": "Black Steel",
  "carbon-line-teak": "Carbon Teak",
  teak: "Teak",
};

const collectionKey = (product) => String(product?.collectionSlug || product?.collection || "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

export const productCollectionLabel = (product) => {
  const fullLabel = product?.collectionName || product?.collection || "";
  if (product?.category !== "kitchen") return fullLabel;
  return KITCHEN_COLLECTION_LABELS[collectionKey(product)] || fullLabel;
};
