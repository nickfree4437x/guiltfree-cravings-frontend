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

interface PendingCartItem {
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

  setPendingCartItem: (
    product: Product,
    variant: ProductVariant,
    quantity: number
  ) => void;

  getPendingCartItem: () => PendingCartItem | null;

  clearPendingCartItem: () => void;

  addPendingCartItem: () => void;
}

/* =========================================================
   CART STORAGE
========================================================= */

const CART_STORAGE_KEY = "guiltfree_cart";

const PENDING_CART_STORAGE_KEY =
  "guiltfree_pending_cart_item";

/* =========================================================
   LOAD CART
========================================================= */

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

/* =========================================================
   SAVE CART
========================================================= */

const saveCart = (
  items: CartItem[]
) => {
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

/* =========================================================
   LOAD PENDING CART ITEM
========================================================= */

const getStoredPendingCartItem =
  (): PendingCartItem | null => {
    try {
      const storedItem =
        localStorage.getItem(
          PENDING_CART_STORAGE_KEY
        );

      if (!storedItem) {
        return null;
      }

      const parsedItem =
        JSON.parse(
          storedItem
        ) as PendingCartItem;

      if (
        !parsedItem ||
        !parsedItem.product ||
        typeof parsedItem.product.id !== "number" ||
        !parsedItem.variant ||
        typeof parsedItem.variant.id !== "number" ||
        typeof parsedItem.quantity !== "number" ||
        parsedItem.quantity <= 0
      ) {
        return null;
      }

      return parsedItem;
    } catch (error) {
      console.error(
        "Failed to load pending cart item:",
        error
      );

      return null;
    }
  };

/* =========================================================
   SAVE PENDING CART ITEM
========================================================= */

const savePendingCartItem = (
  item: PendingCartItem
) => {
  try {
    localStorage.setItem(
      PENDING_CART_STORAGE_KEY,
      JSON.stringify(item)
    );
  } catch (error) {
    console.error(
      "Failed to save pending cart item:",
      error
    );
  }
};

/* =========================================================
   CLEAR PENDING CART ITEM
========================================================= */

const removePendingCartItem = () => {
  try {
    localStorage.removeItem(
      PENDING_CART_STORAGE_KEY
    );
  } catch (error) {
    console.error(
      "Failed to clear pending cart item:",
      error
    );
  }
};

/* =========================================================
   INITIAL CART
========================================================= */

const storedCart =
  getStoredCart();

/* =========================================================
   CART STORE
========================================================= */

export const useCartStore =
  create<CartState>(
    (set, get) => ({
      /* =====================================================
         INITIAL STATE
      ===================================================== */

      items: storedCart,

      /* =====================================================
         ADD TO CART
      ===================================================== */

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
                item.product.id ===
                  product.id &&
                item.variant.id ===
                  variant.id
            );

          let updatedItems: CartItem[];

          if (existingItem) {
            updatedItems =
              state.items.map(
                (item) =>
                  item.product.id ===
                    product.id &&
                  item.variant.id ===
                    variant.id
                    ? {
                        ...item,
                        quantity:
                          item.quantity +
                          quantity,
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

          saveCart(updatedItems);

          return {
            items: updatedItems,
          };
        });
      },

      /* =====================================================
         REMOVE FROM CART
      ===================================================== */

      removeFromCart: (
        productId,
        variantId
      ) => {
        set((state) => {
          const updatedItems =
            state.items.filter(
              (item) =>
                !(
                  item.product.id ===
                    productId &&
                  item.variant.id ===
                    variantId
                )
            );

          saveCart(updatedItems);

          return {
            items: updatedItems,
          };
        });
      },

      /* =====================================================
         UPDATE QUANTITY
      ===================================================== */

      updateQuantity: (
        productId,
        variantId,
        quantity
      ) => {
        if (quantity <= 0) {
          set((state) => {
            const updatedItems =
              state.items.filter(
                (item) =>
                  !(
                    item.product.id ===
                      productId &&
                    item.variant.id ===
                      variantId
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
            state.items.map(
              (item) =>
                item.product.id ===
                  productId &&
                item.variant.id ===
                  variantId
                  ? {
                      ...item,
                      quantity,
                    }
                  : item
            );

          saveCart(updatedItems);

          return {
            items: updatedItems,
          };
        });
      },

      /* =====================================================
         CLEAR CART
      ===================================================== */

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

      /* =====================================================
         CART ITEM COUNT
      ===================================================== */

      getCartItemCount: () => {
        return get().items.reduce(
          (total, item) =>
            total + item.quantity,
          0
        );
      },

      /* =====================================================
         CART TOTAL
      ===================================================== */

      getCartTotal: () => {
        return get().items.reduce(
          (total, item) =>
            total +
            item.variant.price *
              item.quantity,
          0
        );
      },

      /* =====================================================
         SET PENDING CART ITEM
      ===================================================== */

      setPendingCartItem: (
        product,
        variant,
        quantity
      ) => {
        if (quantity <= 0) {
          return;
        }

        savePendingCartItem({
          product,
          variant,
          quantity,
        });
      },

      /* =====================================================
         GET PENDING CART ITEM
      ===================================================== */

      getPendingCartItem: () => {
        return getStoredPendingCartItem();
      },

      /* =====================================================
         CLEAR PENDING CART ITEM
      ===================================================== */

      clearPendingCartItem: () => {
        removePendingCartItem();
      },

      /* =====================================================
         ADD PENDING ITEM AFTER LOGIN
      ===================================================== */

      addPendingCartItem: () => {
        const pendingItem =
          getStoredPendingCartItem();

        if (!pendingItem) {
          return;
        }

        get().addToCart(
          pendingItem.product,
          pendingItem.variant,
          pendingItem.quantity
        );

        removePendingCartItem();
      },
    })
  );