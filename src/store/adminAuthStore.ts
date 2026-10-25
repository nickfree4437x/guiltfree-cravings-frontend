import { create } from "zustand";

import type { AdminUser } from "../api/adminApi";

// ─── Storage Keys ─────────────────────────────────────────
const ADMIN_TOKEN_KEY = "guiltfree_admin_token";
const ADMIN_USER_KEY = "guiltfree_admin_user";

// ─── Types ────────────────────────────────────────────────
interface AdminAuthState {
  token: string | null;
  admin: AdminUser | null;
  isAuthenticated: boolean;
  login: (token: string, admin: AdminUser) => void;
  logout: () => void;
}

// ─── Storage Helpers ──────────────────────────────────────
const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch (error) {
    console.error("Failed to read admin token:", error);
    return null;
  }
};

const getStoredAdmin = (): AdminUser | null => {
  try {
    const stored = localStorage.getItem(ADMIN_USER_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as AdminUser;

    // Basic shape validation
    if (
      !parsed ||
      typeof parsed.id !== "number" ||
      typeof parsed.name !== "string"
    ) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("Failed to read stored admin:", error);
    return null;
  }
};

// ─── Initial State ────────────────────────────────────────
const storedToken = getStoredToken();
const storedAdmin = getStoredAdmin();
const initialIsAuthenticated = Boolean(storedToken) && Boolean(storedAdmin);

// ─── Store ────────────────────────────────────────────────
export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  token: storedToken,
  admin: storedAdmin,
  isAuthenticated: initialIsAuthenticated,

  login: (token, admin) => {
    try {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(admin));
    } catch (error) {
      console.error("Failed to persist admin authentication:", error);
    }

    set({ token, admin, isAuthenticated: true });
  },

  logout: () => {
    try {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
    } catch (error) {
      console.error("Failed to clear admin authentication:", error);
    }

    set({ token: null, admin: null, isAuthenticated: false });
  },
}));