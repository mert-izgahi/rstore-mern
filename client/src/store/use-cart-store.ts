import { IOrderItem, IProduct } from "@/lib/types";
import { toast } from "sonner";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartState {
  items: IOrderItem[];
  addProduct: (product: IProduct, quantity: number) => void;
  removeProduct: (productId: string) => void;
  clearCart: () => void;
  calculateTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addProduct: (product: IProduct,quantity: number) => {
        const _items = get().items;
        const existingItem = _items.find(
          (item) => item.productId === product._id
        );
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          _items.push({
            productId: product._id,
            quantity: quantity,
            title: product.name,
            price: product.price,
            image: product.images[0],
          });
        }
        set({ items: _items });
        toast.success(`${product.name} added to cart`);
      },
      removeProduct: (productId: string) => {
        const _items = get().items;
        const filteredItems = _items.filter(
          (item) => item.productId !== productId
        );
        set({ items: filteredItems });
        toast.success("Product removed from cart");
      },
      clearCart: () => {
        set({ items: [] });
        toast.success("Cart cleared");
      },
      calculateTotal: () => {
        const _items = get().items;
        const total = _items.reduce((acc, item) => {
          return acc + item.price * item.quantity;
        }, 0);
        return total;
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
