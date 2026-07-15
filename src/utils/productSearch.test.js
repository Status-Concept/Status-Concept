import { describe, expect, it } from "vitest";
import { normalizeSearch, rankProducts, uniqueProducts } from "./productSearch";

const products = [
  { id: "bali-lounge", name: "Bali Lounge Set", category: "lounge", collection: "Bali" },
  { id: "bali-daybed", name: "Bali Day Bed", category: "sunlounger", collection: "Bali" },
  { id: "vita-sfera", name: "VITA Sfera", category: "shade", collectionName: "Glatz" },
];

describe("product search", () => {
  it("normalizes punctuation and accents", () => {
    expect(normalizeSearch("VITA® Sférà")).toBe("vita sfera");
  });

  it("requires at least two characters", () => {
    expect(rankProducts(products, "b")).toEqual([]);
  });

  it("matches multiple terms across product fields", () => {
    expect(rankProducts(products, "bali day").map((product) => product.id)).toEqual(["bali-daybed"]);
  });

  it("ranks exact names before broader collection matches", () => {
    const exact = { id: "bali", name: "Bali", category: "lounge" };
    expect(rankProducts([products[0], exact, products[1]], "Bali")[0].id).toBe("bali");
  });

  it("removes duplicate product ids", () => {
    expect(uniqueProducts([products[0], products[0], products[1]])).toHaveLength(2);
  });
});
