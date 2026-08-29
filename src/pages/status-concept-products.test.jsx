import { describe, expect, it } from "vitest";
import { filterKitchenProducts, matchesSubcategory, productBrandLabel, productHasImage } from "./status-concept-products";
import { kitchenCollectionHeroes, kitchenProducts } from "../data/kitchenProducts";
import { PRODUCT_MENU } from "../data/productMenu";
import { productCollectionLabel } from "../utils/productLabels";

describe("product catalogue helpers", () => {
  it("keeps Sicily's isolated studio image visible", () => {
    expect(productHasImage({ id: "sicily-modular-set", category: "lounge" })).toBe(true);
  });

  it("keeps shade imagery visible and shows its supplier brand", () => {
    expect(productHasImage({ id: "glatz-alu-smart", category: "shade" })).toBe(true);
    expect(productBrandLabel({ supplier: "Glatz", category: "shade" })).toBe("Glatz");
  });

  it("uses explicit product classifications for material filters", () => {
    expect(matchesSubcategory({ subcategories: ["upholstered", "aluminium"] }, "upholstered")).toBe(true);
  });

  it("uses imported source metadata when product copy omits the material", () => {
    const product = {
      name: "Berlin Modular Sofa",
      category: "lounge",
      sourcePath: "site-statusconcept.com/furniture-series/lounge/aluminium-4/berlin-modular-sofa",
    };

    expect(matchesSubcategory(product, "aluminium")).toBe(true);
  });

  it("keeps the Draco kitchen scope to the requested three ranges and omits prices", () => {
    expect([...new Set(kitchenProducts.map((product) => product.collection))]).toEqual([
      "black-stainless-steel",
      "carbon-line-teak",
      "teak",
    ]);
    expect(kitchenProducts.every((product) => !Object.prototype.hasOwnProperty.call(product, "price"))).toBe(true);
    expect(kitchenProducts.some((product) => product.specs?.dimensions?.startsWith("TODO:"))).toBe(false);
    expect(productBrandLabel(kitchenProducts[0])).toBe("Black Steel");
    expect(productCollectionLabel(kitchenProducts.find((product) => product.collection === "carbon-line-teak"))).toBe("Carbon Teak");
  });

  it("provides a collection-specific lifestyle hero for every kitchen range", () => {
    expect(Object.keys(kitchenCollectionHeroes)).toEqual([
      "black-stainless-steel",
      "carbon-line-teak",
      "teak",
    ]);
    expect(kitchenCollectionHeroes["black-stainless-steel"]).toContain("black-stainless-steel-lifestyle");
    expect(kitchenCollectionHeroes["carbon-line-teak"]).toContain("carbon-line-teak-lifestyle");
    expect(kitchenCollectionHeroes.teak).toContain("kitchen-hero");
  });

  it("keeps Browse by filtering inside the selected kitchen collection", () => {
    const carbonAccessories = filterKitchenProducts(kitchenProducts, "carbon-line-teak", "accessories");

    expect(carbonAccessories.length).toBeGreaterThan(0);
    expect(carbonAccessories.every((product) => product.collection === "carbon-line-teak")).toBe(true);
    expect(carbonAccessories.every((product) => matchesSubcategory(product, "accessories"))).toBe(true);
  });

  it("separates modular and built-in kitchen navigation", () => {
    const kitchenTabs = PRODUCT_MENU.filter((item) => item.key.includes("kitchen"));
    const outdoorKitchens = kitchenTabs.find((item) => item.key === "kitchen");

    expect(outdoorKitchens?.items.map((item) => item.name)).toEqual([
      "Modular Kitchens",
      "Built-in Kitchens",
    ]);
    expect(outdoorKitchens?.items.find((item) => item.name === "Modular Kitchens")?.to).toBe("/products?cat=kitchen");
    expect(outdoorKitchens?.items.find((item) => item.name === "Built-in Kitchens")?.to).toContain("mode=built-in");
  });

  it("adds carpets, decor and statues as product categories", () => {
    expect(PRODUCT_MENU.filter((item) => ["carpets", "decor", "statues"].includes(item.key)).map((item) => item.label)).toEqual([
      "Carpets",
      "Decor",
      "Statues",
    ]);
  });
});
