import { describe, expect, it } from "vitest";
import { expandProductCollection, filterKitchenProducts, matchesSubcategory, productBrandLabel, productHasImage, refineProductResults } from "./status-concept-products";
import { kitchenCollectionHeroes, kitchenProducts } from "../data/kitchenProducts";
import { PRODUCT_MENU } from "../data/productMenu";
import { productCollectionLabel } from "../utils/productLabels";
import { isRattanProduct } from "../data/productExclusions";

describe("product catalogue helpers", () => {
  it("does not turn a sink into a BBQ because its description mentions grills", () => {
    const sink = { category: "kitchen", name: "Sink Cabinet", description: "Works with the Draco Grills barbecue kitchen" };
    expect(matchesSubcategory(sink, "bbq")).toBe(false);
    expect(matchesSubcategory(sink, "accessories")).toBe(true);
  });

  it("combines search results with range and product-type filters", () => {
    const results = refineProductResults(kitchenProducts, { category: "kitchen", collection: "carbon-line-teak", subcategory: "accessories" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((product) => product.collection === "carbon-line-teak" && matchesSubcategory(product, "accessories"))).toBe(true);
    expect(refineProductResults(kitchenProducts, { category: "kitchen", builtIn: true })).toEqual([]);
  });

  it("filters by the declared product type even when the label uses another word", () => {
    const ottoman = { name: "Sicily Ottoman", category: "lounge", collection: "Sicily", productType: ["pouf"] };
    const sofa = { name: "Sicily Corner Module", category: "lounge", collection: "Sicily", productType: ["modular"] };
    expect(refineProductResults([ottoman, sofa], { category: "lounge", collection: "sicily", type: "pouf" })).toEqual([ottoman]);
    expect(refineProductResults([ottoman, sofa], { category: "lounge", collection: "sicily", type: "modular" })).toEqual([sofa]);
  });

  it("does not classify a bioclimatic pergola as a parasol just because it provides shade", () => {
    expect(matchesSubcategory({ name: "Bioclimatic Pergola", description: "Shade solution" }, "parasols")).toBe(false);
  });
  it("keeps Sicily's isolated studio image visible", () => {
    expect(productHasImage({ id: "sicily-modular-set", category: "lounge" })).toBe(true);
  });

  it("shows Sicily's three gallery pieces as separate products in its collection", () => {
    const products = expandProductCollection([
      { id: "sicily-modular-set", name: "Sicily Modular Set", category: "lounge" },
    ], "sicily");

    expect(products.map((product) => product.name)).toEqual([
      "Sicily Corner Module",
      "Sicily Centre Module",
      "Sicily Ottoman",
    ]);
    expect(products.map((product) => product.route)).toEqual([
      "/product/sicily-modular-set?part=corner",
      "/product/sicily-modular-set?part=centre",
      "/product/sicily-modular-set?part=ottoman",
    ]);
    expect(new Set(products.map((product) => product.img)).size).toBe(3);
    expect(expandProductCollection([{ id: "sicily-modular-set" }], "")).toHaveLength(1);
  });

  it("lists Bermuda's photographed chair and ottoman pieces separately", () => {
    const products = expandProductCollection([
      { id: "bermuda-divano", name: "BERMUDA (Divano)", img: "/product-images/corrections/229-bermuda-divano.webp", category: "lounge" },
    ], "bermuda");

    expect(products.map((product) => product.name)).toEqual([
      "Bermuda Left Lounge Chair",
      "Bermuda Ottoman",
      "Bermuda Right Lounge Chair",
    ]);
    expect(products.map((product) => product.imageCrop)).toEqual(["left", "center", "right"]);
    expect(products.every((product) => product.img.includes("229-bermuda-divano"))).toBe(true);
    expect(products.map((product) => product.route)).toEqual([
      "/product/bermuda-divano?part=left",
      "/product/bermuda-divano?part=center",
      "/product/bermuda-divano?part=right",
    ]);
  });

  it("excludes the photographed Celia rattan lounge set", () => {
    expect(isRattanProduct({ id: "local-product-1d8e527f1fa3", name: "Calia Sofa Set + Coffee Tables Set" })).toBe(true);
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
