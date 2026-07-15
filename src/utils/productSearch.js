export function normalizeSearch(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function searchableProductText(product) {
  return normalizeSearch([
    product.name,
    product.id,
    product.sku,
    product.category,
    product.categoryLabel,
    product.collection,
    product.collectionName,
    product.desc,
    product.description,
    product.tagline,
  ].filter(Boolean).join(" "));
}

export function rankProducts(products, query) {
  const normalizedQuery = normalizeSearch(query);
  if (normalizedQuery.length < 2) return [];

  const terms = normalizedQuery.split(" ").filter(Boolean);

  return products
    .map((product, index) => {
      const name = normalizeSearch(product.name);
      const collection = normalizeSearch(product.collectionName || product.collection);
      const haystack = searchableProductText(product);
      if (!terms.every((term) => haystack.includes(term))) return null;

      let score = 4;
      if (name === normalizedQuery) score = 0;
      else if (name.startsWith(normalizedQuery)) score = 1;
      else if (name.includes(normalizedQuery)) score = 2;
      else if (collection.includes(normalizedQuery)) score = 3;

      return { product, score, index };
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .map(({ product }) => product);
}

export function uniqueProducts(products) {
  const seen = new Set();
  return products.filter((product) => {
    const key = product.id || normalizeSearch(product.name);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
