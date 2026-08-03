export const MAX_PAGE_IMAGES = 5;

export const isKitchenContent = (item) => item?.category === "kitchen";

export const limitPageImages = (images, item) => {
  const safeImages = Array.isArray(images) ? images : [];
  return isKitchenContent(item) ? safeImages : safeImages.slice(0, MAX_PAGE_IMAGES);
};

export const limitPageItems = (items, kitchen = false) => {
  const safeItems = Array.isArray(items) ? items : [];
  return kitchen ? safeItems : safeItems.slice(0, MAX_PAGE_IMAGES);
};
