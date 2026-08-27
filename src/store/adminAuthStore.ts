import { create } from "zustand";

import type { AdminUser } from "../api/adminApi";

const ADMIN_TOKEN_KEY =
  "guiltfree_admin_token";

const ADMIN_USER_KEY =
  "guiltfree_admin_user";

/*
 * =========================================================
 * ADMIN AUTH STATE
 * =========================================================
 */

interface AdminAuthState {
  token: string | null;
  admin: AdminUser | null;
  isAuthenticated: boolean;

  login: (
    token: string,
    admin: AdminUser
  ) => void;

  logout: () => void;
}

/*
 * =========================================================
 * STORED TOKEN
 * =========================================================
 */

const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(
      ADMIN_TOKEN_KEY
    );
  } catch (error) {
    console.error(
      "Failed to read admin token:",
      error
    );

    return null;
  }
};

/*
 * =========================================================
 * STORED ADMIN
 * =========================================================
 */

const getStoredAdmin = (): AdminUser | null => {
  try {
    const storedAdmin =
      localStorage.getItem(
        ADMIN_USER_KEY
      );

    if (!storedAdmin) {
      return null;
    }

    const parsedAdmin =
      JSON.parse(storedAdmin) as AdminUser;

    if (
      !parsedAdmin ||
      typeof parsedAdmin.id !== "number" ||
      typeof parsedAdmin.name !== "string"
    ) {
      return null;
    }

    return parsedAdmin;
  } catch (error) {
    console.error(
      "Failed to read stored admin:",
      error
    );

    return null;
  }
};

/*
 * =========================================================
 * INITIAL STATE
 * =========================================================
 */

const storedToken =
  getStoredToken();

const storedAdmin =
  getStoredAdmin();

const initialIsAuthenticated =
  Boolean(storedToken) &&
  Boolean(storedAdmin);

/*
 * =========================================================
 * ADMIN AUTH STORE
 * =========================================================
 */

export const useAdminAuthStore =
  create<AdminAuthState>((set) => ({
    token: storedToken,

    admin: storedAdmin,

    isAuthenticated:
      initialIsAuthenticated,

    /*
     * =====================================================
     * LOGIN
     * =====================================================
     */

    login: (token, admin) => {
      try {
        localStorage.setItem(
          ADMIN_TOKEN_KEY,
          token
        );

        localStorage.setItem(
          ADMIN_USER_KEY,
          JSON.stringify(admin)
        );
      } catch (error) {
        console.error(
          "Failed to persist admin authentication:",
          error
        );
      }

      set({
        token,
        admin,
        isAuthenticated: true,
      });
    },

    /*
     * =====================================================
     * LOGOUT
     * =====================================================
     */

    logout: () => {
      try {
        localStorage.removeItem(
          ADMIN_TOKEN_KEY
        );

        localStorage.removeItem(
          ADMIN_USER_KEY
        );
      } catch (error) {
        console.error(
          "Failed to clear admin authentication:",
          error
        );
      }

      set({
        token: null,
        admin: null,
        isAuthenticated: false,
      });
    },
  }));