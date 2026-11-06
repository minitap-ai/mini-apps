import { describe, expect, it } from "vitest";
import { productById } from "./catalog";
import { validCard } from "./orders";
import { DELIVERY_FEE_CENTS, findPromo, saleProductId, totals, unitPriceCents } from "./pricing";

const day = new Date(2026, 10, 6);
const notOnSale = (ids: string[]) => ids.find((id) => id !== saleProductId(day)) as string;

describe("totals", () => {
  it("charges delivery under €35 and applies a promo only above its minimum", () => {
    const id = notOnSale(["coffee", "olive-oil"]);
    const product = productById(id)!;
    const price = product.variants[0]!.priceCents;
    const lines = [{ productId: id, variantId: product.variants[0]!.id, qty: 3 }];

    const plain = totals(lines, day);
    const promo = totals(lines, day, findPromo("welcome10"));

    expect(plain).toMatchObject({ subtotalCents: 3 * price, deliveryCents: DELIVERY_FEE_CENTS, totalCents: 3 * price + DELIVERY_FEE_CENTS });
    expect(promo.discountCents).toBe(Math.round(0.1 * 3 * price));
    expect(totals(lines.map((l) => ({ ...l, qty: 10 })), day).deliveryCents).toBe(0);
  });

  it("sells the deal of the day 20% off, and only that product", () => {
    const deal = productById(saleProductId(day))!;
    const variant = deal.variants[0]!;
    expect(unitPriceCents(deal, variant, day)).toBe(Math.round(variant.priceCents * 0.8));
    expect(saleProductId(day)).toBe(saleProductId(new Date(2026, 10, 6, 23, 59)));
    expect(saleProductId(day)).not.toBe(saleProductId(new Date(2026, 10, 7)));
  });
});

describe("card", () => {
  it.each([
    ["4242 4242 4242 4242", "12/29", "123", null],
    ["4242", "12/29", "123", "Enter the 16 digits of your card."],
    ["4242424242424242", "13/29", "123", "Enter the expiry date as MM/YY."],
  ])("%s %s %s", (number, expiry, cvc, expected) => {
    expect(validCard(number, expiry, cvc)).toBe(expected);
  });
});
