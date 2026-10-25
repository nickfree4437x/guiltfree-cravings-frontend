import { create } from "zustand";

import type { Product, ProductVariant } from "../api/productApi";

// ─── Types ────────────────────────────────────────────────
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
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (productId: number, variantId: number) => void;
  updateQuantity: (productId: number, variantId: number, quantity: number) => void;
  clearCart: () => void;
  getCartItemCount: () => number;
  getCartTotal: () => number;
  setPendingCartItem: (product: Product, variant: ProductVariant, quantity: number) => void;
  getPendingCartItem: () => PendingCartItem | null;
  clearPendingCartItem: () => void;
  addPendingCartItem: () => void;
}

// ─── Storage Keys ─────────────────────────────────────────
const CART_STORAGE_KEY = "guiltfree_cart";
const PENDING_CART_STORAGE_KEY = "guiltfree_pending_cart_item";

// ─── Item Match Helper ────────────────────────────────────
const isSameItem = (item: CartItem, productId: number, variantId: number) =>
  item.product.id === productId && item.variant.id === variantId;

// ─── Load Cart ────────────────────────────────────────────
const getStoredCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as CartItem[];
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
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
    console.error("Failed to load cart from localStorage:", error);
    return [];
  }
};

// ─── Save Cart ────────────────────────────────────────────
const saveCart = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
};

// ─── Pending Item Load/Save/Clear ─────────────────────────
const getStoredPendingCartItem = (): PendingCartItem | null => {
  try {
    const stored = localStorage.getItem(PENDING_CART_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as PendingCartItem;

    if (
      !parsed ||
      !parsed.product ||
      typeof parsed.product.id !== "number" ||
      !parsed.variant ||
      typeof parsed.variant.id !== "number" ||
      typeof parsed.quantity !== "number" ||
      parsed.quantity <= 0
    ) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("Failed to load pending cart item:", error);
    return null;
  }
};

const savePendingCartItem = (item: PendingCartItem) => {
  try {
    localStorage.setItem(PENDING_CART_STORAGE_KEY, JSON.stringify(item));
  } catch (error) {
    console.error("Failed to save pending cart item:", error);
  }
};

const removePendingCartItem = () => {
  try {
    localStorage.removeItem(PENDING_CART_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear pending cart item:", error);
  }
};

// ─── Initial Cart ─────────────────────────────────────────
const storedCart = getStoredCart();

// ─── Store ────────────────────────────────────────────────
export const useCartStore = create<CartState>((set, get) => ({
  items: storedCart,
  isCartDrawerOpen: false,

  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),

  // ─── Add to cart ──────────────────────────────────────
  addToCart: (product, variant, quantity = 1) => {
    if (quantity <= 0) return;

    set((state) => {
      const existing = state.items.find((item) => isSameItem(item, product.id, variant.id));

      const updatedItems: CartItem[] = existing
        ? state.items.map((item) =>
            isSameItem(item, product.id, variant.id)
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...state.items, { product, variant, quantity }];

      saveCart(updatedItems);
      return { items: updatedItems };
    });
  },

  // ─── Remove from cart ─────────────────────────────────
  removeFromCart: (productId, variantId) => {
    set((state) => {
      const updatedItems = state.items.filter((item) => !isSameItem(item, productId, variantId));
      saveCart(updatedItems);
      return { items: updatedItems };
    });
  },

  // ─── Update quantity ──────────────────────────────────
  updateQuantity: (productId, variantId, quantity) => {
    // quantity <= 0 → remove item
    if (quantity <= 0) {
      set((state) => {
        const updatedItems = state.items.filter((item) => !isSameItem(item, productId, variantId));
        saveCart(updatedItems);
        return { items: updatedItems };
      });
      return;
    }

    set((state) => {
      const updatedItems = state.items.map((item) =>
        isSameItem(item, productId, variantId) ? { ...item, quantity } : item
      );
      saveCart(updatedItems);
      return { items: updatedItems };
    });
  },

  // ─── Clear cart ───────────────────────────────────────
  clearCart: () => {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear cart from localStorage:", error);
    }
    set({ items: [] });
  },

  // ─── Derived values ───────────────────────────────────
  getCartItemCount: () => get().items.reduce((total, item) => total + item.quantity, 0),

  getCartTotal: () =>
    get().items.reduce((total, item) => total + item.variant.price * item.quantity, 0),

  // ─── Pending item ─────────────────────────────────────
  setPendingCartItem: (product, variant, quantity) => {
    if (quantity <= 0) return;
    savePendingCartItem({ product, variant, quantity });
  },

  getPendingCartItem: () => getStoredPendingCartItem(),

  clearPendingCartItem: () => removePendingCartItem(),

  // After login: merge pending item into cart, then clear pending
  addPendingCartItem: () => {
    const pendingItem = getStoredPendingCartItem();
    if (!pendingItem) return;

    get().addToCart(pendingItem.product, pendingItem.variant, pendingItem.quantity);
    removePendingCartItem();
  },
}));