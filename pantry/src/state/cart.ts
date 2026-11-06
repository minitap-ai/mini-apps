import { useMemo } from "react";
import { findPromo, totals, type CartLine } from "@/lib/pricing";
import { useApp } from "./app";

export function useCart() {
  const { data, update } = useApp();
  const promo = data.promoCode ? (findPromo(data.promoCode) ?? null) : null;
  const sum = useMemo(() => totals(data.cart, new Date(), promo), [data.cart, promo]);
  return {
    lines: data.cart,
    promo,
    totals: sum,
    add: (productId: string, variantId: string, qty = 1) =>
      update((d) => {
        const existing = d.cart.find((l) => l.productId === productId && l.variantId === variantId);
        const cart: CartLine[] = existing
          ? d.cart.map((l) => (l === existing ? { ...l, qty: l.qty + qty } : l))
          : [...d.cart, { productId, variantId, qty }];
        return { ...d, cart };
      }),
    setQty: (line: CartLine, qty: number) =>
      update((d) => ({
        ...d,
        cart: qty <= 0 ? d.cart.filter((l) => l.variantId !== line.variantId) : d.cart.map((l) => (l.variantId === line.variantId ? { ...l, qty } : l)),
      })),
    applyPromo: (code: string | null) => update((d) => ({ ...d, promoCode: code })),
    clear: () => update((d) => ({ ...d, cart: [], promoCode: null })),
  };
}
