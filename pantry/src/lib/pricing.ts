import { PRODUCTS, productById, type Product, type Variant } from "./catalog";

export const DELIVERY_FEE_CENTS = 299;
export const FREE_DELIVERY_FROM_CENTS = 3500;
export const SALE_PERCENT = 20;

export interface CartLine {
  productId: string;
  variantId: string;
  qty: number;
}

export interface Promo {
  code: string;
  label: string;
  percent: number;
  minSubtotalCents: number;
}

export const PROMOS: Promo[] = [
  { code: "WELCOME10", label: "10% off your order", percent: 10, minSubtotalCents: 1500 },
  { code: "FRESH5", label: "5% off fresh produce orders", percent: 5, minSubtotalCents: 0 },
];

/** One product is on sale each day, chosen from the date: the same all day for every customer. */
export function saleProductId(day: Date): string {
  const key = Math.floor(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()) / 86400000);
  return (PRODUCTS[key % PRODUCTS.length] as Product).id;
}

export function unitPriceCents(product: Product, variant: Variant, day: Date): number {
  if (saleProductId(day) !== product.id) return variant.priceCents;
  return Math.round((variant.priceCents * (100 - SALE_PERCENT)) / 100);
}

export function findPromo(code: string): Promo | undefined {
  return PROMOS.find((p) => p.code === code.trim().toUpperCase());
}

export interface Totals {
  subtotalCents: number;
  discountCents: number;
  deliveryCents: number;
  totalCents: number;
  itemCount: number;
}

export function totals(lines: CartLine[], day: Date, promo?: Promo | null): Totals {
  let subtotalCents = 0;
  let itemCount = 0;
  for (const line of lines) {
    const product = productById(line.productId);
    const variant = product?.variants.find((v) => v.id === line.variantId);
    if (!product || !variant) continue;
    subtotalCents += unitPriceCents(product, variant, day) * line.qty;
    itemCount += line.qty;
  }
  const discountCents =
    promo && subtotalCents >= promo.minSubtotalCents ? Math.round((subtotalCents * promo.percent) / 100) : 0;
  const deliveryCents = itemCount === 0 || subtotalCents >= FREE_DELIVERY_FROM_CENTS ? 0 : DELIVERY_FEE_CENTS;
  return { subtotalCents, discountCents, deliveryCents, totalCents: subtotalCents - discountCents + deliveryCents, itemCount };
}

export const euros = (cents: number): string => `€${(cents / 100).toFixed(2)}`;
