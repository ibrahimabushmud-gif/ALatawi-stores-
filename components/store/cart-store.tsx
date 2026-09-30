"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
  stock: number;
  qty: number;
}

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) => {
        const current = get().items.find((i) => i.productId === item.productId);
        if (current) {
          const newQty = Math.min(current.qty + qty, item.stock);
          set((state) => ({
            items: state.items.map((i) =>
              i.productId === item.productId ? { ...i, qty: newQty } : i
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...item, qty: Math.min(qty, item.stock) }],
          }));
        }
      },
      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      setQty: (productId, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId
              ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) }
              : i
          ),
        })),
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    { name: "cart-storage" }
  )
);
