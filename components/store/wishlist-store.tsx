"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  image?: string;
  stock: number;
}

interface WishlistState {
  items: WishlistItem[];
  add: (item: WishlistItem) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        if (!get().items.find((i) => i.productId === item.productId)) {
          set((state) => ({ items: [...state.items, item] }));
        }
      },
      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "wishlist-storage" }
  )
);
