import { create } from "zustand";

import type { AuthUser } from "../api/authApi";

const AUTH_TOKEN_KEY =
  "guiltfree_auth_token";

const AUTH_USER_KEY =
  "guiltfree_auth_user";

/*
 * =========================================================
 * AUTH STATE
 * =========================================================
 */

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  login: (
    token: string,
    user: AuthUser
  ) => void;

  updateUser: (
    user: AuthUser
  ) => void;

  logout: () => void;
}

/*
 * =========================================================
 * LOAD STORED TOKEN
 * =========================================================
 */

const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(
      AUTH_TOKEN_KEY
    );
  } catch (error) {
    console.error(
      "Failed to read authentication token:",
      error
    );

    return null;
  }
};

/*
 * =========================================================
 * LOAD STORED USER
 * =========================================================
 */

const getStoredUser = (): AuthUser | null => {
  try {
    const storedUser =
      localStorage.getItem(
        AUTH_USER_KEY
      );

    if (!storedUser) {
      return null;
    }

    const parsedUser = JSON.parse(
      storedUser
    ) as AuthUser;

    /*
     * Basic validation so corrupted
     * localStorage data doesn't mark
     * the user as authenticated.
     */

    if (
      !parsedUser ||
      typeof parsedUser.id !== "number" ||
      typeof parsedUser.phone !== "string"
    ) {
      return null;
    }

    return parsedUser;
  } catch (error) {
    console.error(
      "Failed to read stored user:",
      error
    );

    return null;
  }
};

/*
 * =========================================================
 * INITIAL AUTH STATE
 * =========================================================
 */

const storedToken =
  getStoredToken();

const storedUser =
  getStoredUser();

const initialIsAuthenticated =
  Boolean(storedToken) &&
  Boolean(storedUser);

/*
 * =========================================================
 * AUTH STORE
 * =========================================================
 */

export const useAuthStore =
  create<AuthState>((set) => ({

    /*
     * =====================================================
     * INITIAL STATE
     * =====================================================
     */

    token: storedToken,

    user: storedUser,

    isAuthenticated:
      initialIsAuthenticated,

    /*
     * =====================================================
     * LOGIN
     * =====================================================
     *
     * Called after successful OTP verification.
     */

    login: (token, user) => {
      try {
        localStorage.setItem(
          AUTH_TOKEN_KEY,
          token
        );

        localStorage.setItem(
          AUTH_USER_KEY,
          JSON.stringify(user)
        );
      } catch (error) {
        console.error(
          "Failed to persist authentication:",
          error
        );
      }

      set({
        token,
        user,
        isAuthenticated: true,
      });
    },

    /*
     * =====================================================
     * UPDATE USER
     * =====================================================
     *
     * Called after:
     *
     * PATCH /api/users/me
     *
     * This keeps:
     *
     * PostgreSQL
     * Zustand
     * localStorage
     *
     * synchronized.
     */

    updateUser: (user) => {
      try {
        localStorage.setItem(
          AUTH_USER_KEY,
          JSON.stringify(user)
        );
      } catch (error) {
        console.error(
          "Failed to persist updated user:",
          error
        );
      }

      set((state) => ({
        token: state.token,
        user,
        isAuthenticated:
          Boolean(state.token) &&
          Boolean(user),
      }));
    },

    /*
     * =====================================================
     * LOGOUT
     * =====================================================
     */

    logout: () => {
      try {
        localStorage.removeItem(
          AUTH_TOKEN_KEY
        );

        localStorage.removeItem(
          AUTH_USER_KEY
        );
      } catch (error) {
        console.error(
          "Failed to clear authentication:",
          error
        );
      }

      set({
        token: null,
        user: null,
        isAuthenticated: false,
      });
    },
  }));