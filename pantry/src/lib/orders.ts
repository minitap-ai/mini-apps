import type { CartLine, Totals } from "./pricing";

export interface Address {
  line1: string;
  city: string;
  postcode: string;
}

export interface Order {
  id: string;
  number: string;
  placedAt: string;
  lines: CartLine[];
  totals: Totals;
  address: Address;
  slot: string;
}

export const STATUSES = ["Order placed", "Being packed", "Out for delivery", "Delivered"] as const;
export type OrderStatus = (typeof STATUSES)[number];

/** Minutes after placing the order at which each status after the first is reached. */
const STATUS_MINUTES = [0, 2, 5, 15];

export function statusAt(order: Order, now: Date): OrderStatus {
  const minutes = (now.getTime() - new Date(order.placedAt).getTime()) / 60000;
  let index = 0;
  STATUS_MINUTES.forEach((m, i) => {
    if (minutes >= m) index = i;
  });
  return STATUSES[index] as OrderStatus;
}

export function nextOrderNumber(orders: Order[]): string {
  return `PT-${1001 + orders.length}`;
}

export const DELIVERY_SLOTS = ["Today 18:00–19:00", "Today 19:00–20:00", "Tomorrow 08:00–09:00", "Tomorrow 12:00–13:00"];

export function validCard(number: string, expiry: string, cvc: string): string | null {
  const digits = number.replace(/\s+/g, "");
  if (!/^\d{16}$/.test(digits)) return "Enter the 16 digits of your card.";
  const match = /^(\d{2})\/(\d{2})$/.exec(expiry.trim());
  if (!match || Number(match[1]) < 1 || Number(match[1]) > 12) return "Enter the expiry date as MM/YY.";
  if (!/^\d{3}$/.test(cvc.trim())) return "Enter the 3-digit security code.";
  return null;
}

export function validAddress(address: Address): string | null {
  if (!address.line1.trim()) return "Enter your street address.";
  if (!address.city.trim()) return "Enter your city.";
  if (!/^\d{5}$/.test(address.postcode.trim())) return "Enter a 5-digit postcode.";
  return null;
}
