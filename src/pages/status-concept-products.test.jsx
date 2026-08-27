import { describe, expect, it } from "vitest";
import { matchesSubcategory, productBrandLabel, productHasImage } from "./status-concept-products";

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
});
