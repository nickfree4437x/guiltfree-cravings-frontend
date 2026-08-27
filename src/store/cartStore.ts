import { create } from "zustand";

import type {
  Product,
  ProductVariant,
} from "../api/productApi";

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface CartState {
  items: CartItem[];

  addToCart: (
    product: Product,
    variant: ProductVariant,
    quantity?: number
  ) => void;

  removeFromCart: (
    productId: number,
    variantId: number
  ) => void;

  updateQuantity: (
    productId: number,
    variantId: number,
    quantity: number
  ) => void;

  clearCart: () => void;

  getCartItemCount: () => number;
  getCartTotal: () => number;
}

/*
 * =========================================================
 * CART STORAGE
 * =========================================================
 */

const CART_STORAGE_KEY = "guiltfree_cart";

/*
 * =========================================================
 * LOAD CART FROM LOCAL STORAGE
 * =========================================================
 */

const getStoredCart = (): CartItem[] => {
  try {
    const storedCart =
      localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
      return [];
    }

    const parsedCart = JSON.parse(
      storedCart
    ) as CartItem[];

    /*
     * Basic validation
     *
     * Corrupted localStorage data should
     * never break the cart application.
     */

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart.filter(
      (item) =>
        item &&
        item.product &&
        typeof item.product.id === "number" &&
        item.variant &&
        typeof item.variant.id === "number" &&
        typeof item.quantity === "number" &&
        item.quantity > 0
    );
  } catch (error) {
    console.error(
      "Failed to load cart from localStorage:",
      error
    );

    return [];
  }
};

/*
 * =========================================================
 * SAVE CART TO LOCAL STORAGE
 * =========================================================
 */

const saveCart = (items: CartItem[]) => {
  try {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(items)
    );
  } catch (error) {
    console.error(
      "Failed to save cart to localStorage:",
      error
    );
  }
};

/*
 * =========================================================
 * INITIAL CART
 * =========================================================
 */

const storedCart = getStoredCart();

/*
 * =========================================================
 * CART STORE
 * =========================================================
 */

export const useCartStore = create<CartState>(
  (set, get) => ({
    /*
     * =====================================================
     * INITIAL STATE
     * =====================================================
     */

    items: storedCart,

    /*
     * =====================================================
     * ADD TO CART
     * =====================================================
     *
     * Same product + same variant
     * = increase quantity
     *
     * Same product + different variant
     * = separate cart item
     */

    addToCart: (
      product,
      variant,
      quantity = 1
    ) => {
      if (quantity <= 0) {
        return;
      }

      set((state) => {
        const existingItem =
          state.items.find(
            (item) =>
              item.product.id === product.id &&
              item.variant.id === variant.id
          );

        let updatedItems: CartItem[];

        if (existingItem) {
          updatedItems = state.items.map(
            (item) =>
              item.product.id === product.id &&
              item.variant.id === variant.id
                ? {
                    ...item,
                    quantity:
                      item.quantity + quantity,
                  }
                : item
          );
        } else {
          updatedItems = [
            ...state.items,
            {
              product,
              variant,
              quantity,
            },
          ];
        }

        /*
         * Persist updated cart
         */

        saveCart(updatedItems);

        return {
          items: updatedItems,
        };
      });
    },

    /*
     * =====================================================
     * REMOVE FROM CART
     * =====================================================
     */

    removeFromCart: (
      productId,
      variantId
    ) => {
      set((state) => {
        const updatedItems =
          state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                item.variant.id === variantId
              )
          );

        /*
         * Persist updated cart
         */

        saveCart(updatedItems);

        return {
          items: updatedItems,
        };
      });
    },

    /*
     * =====================================================
     * UPDATE QUANTITY
     * =====================================================
     */

    updateQuantity: (
      productId,
      variantId,
      quantity
    ) => {
      /*
       * Quantity 0 or below
       * = remove item
       */

      if (quantity <= 0) {
        set((state) => {
          const updatedItems =
            state.items.filter(
              (item) =>
                !(
                  item.product.id === productId &&
                  item.variant.id === variantId
                )
            );

          saveCart(updatedItems);

          return {
            items: updatedItems,
          };
        });

        return;
      }

      set((state) => {
        const updatedItems =
          state.items.map((item) =>
            item.product.id === productId &&
            item.variant.id === variantId
              ? {
                  ...item,
                  quantity,
                }
              : item
          );

        /*
         * Persist updated cart
         */

        saveCart(updatedItems);

        return {
          items: updatedItems,
        };
      });
    },

    /*
     * =====================================================
     * CLEAR CART
     * =====================================================
     *
     * Used after successful order creation/payment flow
     * according to the existing checkout implementation.
     */

    clearCart: () => {
      try {
        localStorage.removeItem(
          CART_STORAGE_KEY
        );
      } catch (error) {
        console.error(
          "Failed to clear cart from localStorage:",
          error
        );
      }

      set({
        items: [],
      });
    },

    /*
     * =====================================================
     * CART ITEM COUNT
     * =====================================================
     *
     * Example:
     *
     * 250g × 2
     * 500g × 1
     *
     * count = 3
     */

    getCartItemCount: () => {
      return get().items.reduce(
        (total, item) =>
          total + item.quantity,
        0
      );
    },

    /*
     * =====================================================
     * CART TOTAL
     * =====================================================
     *
     * variant.price × quantity
     */

    getCartTotal: () => {
      return get().items.reduce(
        (total, item) =>
          total +
          item.variant.price *
            item.quantity,
        0
      );
    },
  })
);