import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { api, type Cart } from "@/lib/backend";
import { useToast } from "@/ui/toast";

interface CartState {
  cart: Cart | null;
  setCart: (cart: Cart) => void;
  add: (productId: string) => Promise<void>;
}

const CartContext = createContext<CartState>({ cart: null, setCart: () => {}, add: async () => {} });

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const toast = useToast();

  const add = useCallback(
    async (productId: string) => {
      const result = await api.addToCart(productId);
      setCart(result.cart);
      toast("Added!", result.toastMs);
    },
    [toast],
  );

  return <CartContext.Provider value={{ cart, setCart, add }}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
