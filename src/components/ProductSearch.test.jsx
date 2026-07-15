import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductSearch from "./ProductSearch";

afterEach(cleanup);

function renderSearch(onClose = vi.fn()) {
  render(
    <MemoryRouter initialEntries={["/en/products"]}>
      <ProductSearch onClose={onClose} />
    </MemoryRouter>,
  );
  return onClose;
}

describe("ProductSearch", () => {
  it("shows matching products as the user types", async () => {
    renderSearch();
    fireEvent.change(screen.getByLabelText("Search products"), { target: { value: "vita sfera" } });

    expect(await screen.findByText("VITA(R) Sfera")).toBeTruthy();
    expect(screen.getByText("Shade")).toBeTruthy();
  });

  it("keeps short queries in the guidance state", () => {
    renderSearch();
    fireEvent.change(screen.getByLabelText("Search products"), { target: { value: "v" } });

    expect(screen.getByText("Enter at least two characters")).toBeTruthy();
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("closes from the visible close command", () => {
    const onClose = renderSearch();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledOnce();
  });
});
