export type Cents = number;

export type Fulfilment = "delivery" | "pickup";

export interface Banner {
  variant: string;
  title: string;
  subtitle?: string;
}

export type Tile = "menu" | "search" | "daily";

export type Interruption =
  | { kind: "newsletter"; title: string; body?: string }
  | { kind: "notification_permission" };

export interface Home {
  banner: Banner;
  tiles: Tile[];
  interruptions: Interruption[];
}

export interface Category {
  id: string;
  name: string;
}

export interface MenuProduct {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  image: string;
  tags: string[];
  allergens: string[];
}

export interface CountrySpecial {
  id: string;
  name: string;
  price: Cents;
}

export interface Country {
  code: string;
  name: string;
  currency: string;
  specials: CountrySpecial[];
}

export interface Menu {
  currency: string;
  country: Country | null;
  categories: Category[];
  products: MenuProduct[];
}

export interface Prices {
  currency: string;
  prices: Record<string, Cents>;
}

export interface Product extends Omit<MenuProduct, "categoryId"> {
  price: Cents;
  currency: string;
  categoryId?: string;
}

export interface DailyProduct {
  id: string;
  name: string;
  price: Cents;
  currency: string;
  allergens: string[];
}

export interface Photo {
  image: string;
  alt?: string;
}

export interface CartLine {
  productId: string;
  name: string;
  unitPrice: Cents;
  qty: number;
  lineTotal: Cents;
}

export interface Cart {
  lines: CartLine[];
  subtotal: Cents;
  currency: string;
  count: number;
}

export interface Quote {
  id: string;
  fulfilment: Fulfilment;
  lines: CartLine[];
  subtotal: Cents;
  deliveryFee: Cents;
  total: Cents;
  currency: string;
}

export interface Order {
  id: string;
  number: string;
  status: string;
  statusLabel: string;
  fulfilment: Fulfilment;
  lines: CartLine[];
  subtotal: Cents;
  deliveryFee: Cents;
  total: Cents;
  currency: string;
  createdAt: string;
}

export interface OrderStatus {
  status: string;
  label: string;
}

export interface Legal {
  allergenTable: { product: string; allergens: string[] }[];
  notice: string;
}

export type OpeningDay = { day: string; opens: string; closes: string; closed?: false } | { day: string; closed: true };

export interface Hours {
  days: OpeningDay[];
}

export interface Reward {
  id: string;
  name: string;
  cost: number;
}

export interface Loyalty {
  points: number;
  rewards: Reward[];
}

export interface FamilyOrder {
  id: string;
  placedBy: string;
  items: string;
  createdAt: string;
}

export interface Family {
  family: { name: string; members: { name: string }[] };
  orders: FamilyOrder[];
}

export type CakeSize = "small" | "medium" | "large";

export interface Cake {
  id: string;
  size: CakeSize;
  message: string;
  status: "processing" | "ready";
  thumbnailUrl: string | null;
}

export interface Board {
  columns: { status: string; label: string; orders: { number: string; items: string; fulfilment: Fulfilment }[] }[];
}

export interface User {
  id: string;
  email: string;
  name: string;
}
