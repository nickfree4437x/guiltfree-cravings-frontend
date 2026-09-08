import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product } from "../api/productApi";

interface WishlistState {
  items: Product[];

  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (product) => {
        const exists = get().items.some(
          (item) => item.id === product.id
        );

        if (exists) return;

        set((state) => ({
          items: [...state.items, product],
        }));
      },

      removeFromWishlist: (productId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => item.id !== productId
          ),
        }));
      },

      toggleWishlist: (product) => {
        const exists = get().items.some(
          (item) => item.id === product.id
        );

        if (exists) {
          get().removeFromWishlist(product.id);
        } else {
          get().addToWishlist(product);
        }
      },

      isInWishlist: (productId) => {
        return get().items.some(
          (item) => item.id === productId
        );
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: "guiltfree-wishlist",
    }
  )
);