import { create } from "zustand";

import type { AuthUser } from "../api/authApi";

// ─── Storage Keys ─────────────────────────────────────────
const AUTH_TOKEN_KEY = "guiltfree_auth_token";
const AUTH_USER_KEY = "guiltfree_auth_user";

// ─── Types ────────────────────────────────────────────────
interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  updateUser: (user: AuthUser) => void;
  logout: () => void;
}

// ─── Storage Helpers ──────────────────────────────────────
const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error("Failed to read authentication token:", error);
    return null;
  }
};

const getStoredUser = (): AuthUser | null => {
  try {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as AuthUser;

    // Basic validation — prevents corrupted storage from marking user as authenticated
    if (
      !parsed ||
      typeof parsed.id !== "number" ||
      typeof parsed.phone !== "string"
    ) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("Failed to read stored user:", error);
    return null;
  }
};

// ─── Initial State ────────────────────────────────────────
const storedToken = getStoredToken();
const storedUser = getStoredUser();
const initialIsAuthenticated = Boolean(storedToken) && Boolean(storedUser);

// ─── Store ────────────────────────────────────────────────
export const useAuthStore = create<AuthState>((set) => ({
  token: storedToken,
  user: storedUser,
  isAuthenticated: initialIsAuthenticated,

  // Called after successful OTP verification
  login: (token, user) => {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Failed to persist authentication:", error);
    }

    set({ token, user, isAuthenticated: true });
  },

  // Called after PATCH /api/users/me — syncs Zustand + localStorage
  updateUser: (user) => {
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Failed to persist updated user:", error);
    }

    set((state) => ({
      token: state.token,
      user,
      isAuthenticated: Boolean(state.token) && Boolean(user),
    }));
  },

  logout: () => {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    } catch (error) {
      console.error("Failed to clear authentication:", error);
    }

    set({ token: null, user: null, isAuthenticated: false });
  },
}));