export interface Variant {
  id: string;
  label: string;
  priceCents: number;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  emoji: string;
  tint: string;
  organic: boolean;
  description: string;
  variants: Variant[];
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { id: "fruits", name: "Fruits", emoji: "🍎" },
  { id: "vegetables", name: "Vegetables", emoji: "🥦" },
  { id: "dairy", name: "Dairy & eggs", emoji: "🥛" },
  { id: "bakery", name: "Bakery", emoji: "🍞" },
  { id: "pantry", name: "Pantry staples", emoji: "🥫" },
  { id: "drinks", name: "Drinks", emoji: "🧃" },
];

const one = (id: string, priceCents: number, label = "1 unit"): Variant[] => [{ id: `${id}-1`, label, priceCents }];

export const PRODUCTS: Product[] = [
  { id: "bananas", name: "Bananas", categoryId: "fruits", emoji: "🍌", tint: "#FFF3C4", organic: true, description: "Fairtrade bananas, ripe in two days.", variants: [{ id: "bananas-6", label: "Bunch of 6", priceCents: 189 }, { id: "bananas-12", label: "Bunch of 12", priceCents: 349 }] },
  { id: "apples", name: "Gala apples", categoryId: "fruits", emoji: "🍎", tint: "#FFE0DC", organic: false, description: "Crisp and sweet, from the Loire valley.", variants: [{ id: "apples-1kg", label: "1 kg", priceCents: 279 }, { id: "apples-2kg", label: "2 kg", priceCents: 499 }] },
  { id: "strawberries", name: "Strawberries", categoryId: "fruits", emoji: "🍓", tint: "#FFDCE3", organic: true, description: "Gariguette strawberries, 250 g punnet.", variants: one("strawberries", 399, "250 g") },
  { id: "avocados", name: "Avocados", categoryId: "fruits", emoji: "🥑", tint: "#E3F2D5", organic: false, description: "Ready to eat.", variants: [{ id: "avocados-2", label: "Pack of 2", priceCents: 299 }, { id: "avocados-4", label: "Pack of 4", priceCents: 549 }] },
  { id: "lemons", name: "Lemons", categoryId: "fruits", emoji: "🍋", tint: "#FFF8C9", organic: true, description: "Unwaxed lemons from Sicily.", variants: one("lemons", 249, "Net of 4") },
  { id: "broccoli", name: "Broccoli", categoryId: "vegetables", emoji: "🥦", tint: "#DDF1DA", organic: true, description: "One head, about 400 g.", variants: one("broccoli", 179) },
  { id: "carrots", name: "Carrots", categoryId: "vegetables", emoji: "🥕", tint: "#FFE6CC", organic: true, description: "Sandy carrots, 1 kg bag.", variants: one("carrots", 159, "1 kg") },
  { id: "tomatoes", name: "Cherry tomatoes", categoryId: "vegetables", emoji: "🍅", tint: "#FFDCD6", organic: false, description: "On the vine, 500 g.", variants: one("tomatoes", 329, "500 g") },
  { id: "spinach", name: "Baby spinach", categoryId: "vegetables", emoji: "🥬", tint: "#DFF2DC", organic: true, description: "Washed and ready to eat, 200 g.", variants: one("spinach", 219, "200 g") },
  { id: "milk", name: "Whole milk", categoryId: "dairy", emoji: "🥛", tint: "#EEF3FA", organic: false, description: "Fresh whole milk.", variants: [{ id: "milk-1l", label: "1 L", priceCents: 129 }, { id: "milk-2l", label: "2 L", priceCents: 239 }] },
  { id: "oat-milk", name: "Oat milk", categoryId: "dairy", emoji: "🥛", tint: "#F4EEDF", organic: true, description: "Barista oat drink, 1 L.", variants: one("oat-milk", 229, "1 L") },
  { id: "eggs", name: "Free-range eggs", categoryId: "dairy", emoji: "🥚", tint: "#FBF1DF", organic: true, description: "Large free-range eggs.", variants: [{ id: "eggs-6", label: "Box of 6", priceCents: 249 }, { id: "eggs-12", label: "Box of 12", priceCents: 449 }] },
  { id: "yogurt", name: "Greek yogurt", categoryId: "dairy", emoji: "🍶", tint: "#F2F4F7", organic: false, description: "Strained Greek yogurt, 500 g.", variants: one("yogurt", 289, "500 g") },
  { id: "cheddar", name: "Mature cheddar", categoryId: "dairy", emoji: "🧀", tint: "#FFF0C7", organic: false, description: "Aged 12 months, 200 g.", variants: one("cheddar", 349, "200 g") },
  { id: "sourdough", name: "Sourdough loaf", categoryId: "bakery", emoji: "🍞", tint: "#F3E2C8", organic: true, description: "Baked this morning, 800 g.", variants: one("sourdough", 399) },
  { id: "croissants", name: "Butter croissants", categoryId: "bakery", emoji: "🥐", tint: "#F7DFB5", organic: false, description: "Pack of 4.", variants: one("croissants", 349, "Pack of 4") },
  { id: "bagels", name: "Plain bagels", categoryId: "bakery", emoji: "🥯", tint: "#F1E2CC", organic: false, description: "Pack of 5.", variants: one("bagels", 279, "Pack of 5") },
  { id: "pasta", name: "Spaghetti", categoryId: "pantry", emoji: "🍝", tint: "#FBEFD2", organic: true, description: "Durum wheat, 500 g.", variants: one("pasta", 149, "500 g") },
  { id: "rice", name: "Basmati rice", categoryId: "pantry", emoji: "🍚", tint: "#F5F2EA", organic: false, description: "1 kg bag.", variants: one("rice", 289, "1 kg") },
  { id: "olive-oil", name: "Olive oil", categoryId: "pantry", emoji: "🫒", tint: "#E8EFCF", organic: true, description: "Extra virgin, 750 ml.", variants: one("olive-oil", 899, "750 ml") },
  { id: "tomato-sauce", name: "Tomato sauce", categoryId: "pantry", emoji: "🥫", tint: "#FBD9D2", organic: false, description: "Basil tomato sauce, 400 g jar.", variants: one("tomato-sauce", 219, "400 g") },
  { id: "coffee", name: "Ground coffee", categoryId: "drinks", emoji: "☕", tint: "#E9DCCF", organic: true, description: "Medium roast, 250 g.", variants: one("coffee", 549, "250 g") },
  { id: "orange-juice", name: "Orange juice", categoryId: "drinks", emoji: "🧃", tint: "#FFE8C2", organic: false, description: "Not from concentrate, 1 L.", variants: one("orange-juice", 279, "1 L") },
  { id: "sparkling-water", name: "Sparkling water", categoryId: "drinks", emoji: "💧", tint: "#E1F0FA", organic: false, description: "6 × 1 L.", variants: one("sparkling-water", 299, "6 × 1 L") },
];

export const RECOMMENDED_IDS = ["strawberries", "sourdough", "eggs", "coffee", "avocados", "olive-oil"];

export const productById = (id: string): Product | undefined => PRODUCTS.find((p) => p.id === id);
export const categoryById = (id: string): Category | undefined => CATEGORIES.find((c) => c.id === id);

export function search(query: string, filters: { organic?: boolean; onSale?: string | null } = {}): Product[] {
  const q = query.trim().toLowerCase();
  return PRODUCTS.filter(
    (p) =>
      (!q || p.name.toLowerCase().includes(q) || p.categoryId.includes(q)) &&
      (!filters.organic || p.organic) &&
      (!filters.onSale || p.id === filters.onSale),
  );
}
