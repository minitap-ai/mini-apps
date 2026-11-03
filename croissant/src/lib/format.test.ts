import { describe, expect, it } from "vitest";
import { money, plural, titleCase } from "./format";

describe("money", () => {
  it("formats euros with two decimals", () => {
    expect(money(250, "EUR")).toBe("€2.50");
    expect(money(1205, "EUR")).toBe("€12.05");
    expect(money(0)).toBe("€0.00");
  });
  it("formats other currencies", () => {
    expect(money(399, "GBP")).toBe("£3.99");
    expect(money(450, "JPY")).toBe("¥450");
    expect(money(123456, "USD")).toBe("$1,234.56");
    expect(money(500, "SEK")).toBe("SEK 5.00");
  });
  it("keeps the sign", () => {
    expect(money(-250, "EUR")).toBe("-€2.50");
  });
});

describe("text helpers", () => {
  it("pluralises", () => {
    expect(plural(1, "item")).toBe("1 item");
    expect(plural(3, "item")).toBe("3 items");
  });
  it("title-cases tags", () => {
    expect(titleCase("gluten-free")).toBe("Gluten Free");
  });
});
