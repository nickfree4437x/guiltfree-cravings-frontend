import {
  useEffect,
  useState,
} from "react";
import type { FormEvent } from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { adminLogin } from "../../../api/adminApi";
import { useAdminAuthStore } from "../../../store/adminAuthStore";

interface LocationState {
  from?: {
    pathname?: string;
  };
}

function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated =
    useAdminAuthStore(
      (state) => state.isAuthenticated
    );

  const login = useAdminAuthStore(
    (state) => state.login
  );

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  /*
   * =========================================================
   * ALREADY AUTHENTICATED
   * =========================================================
   */

  useEffect(() => {
    if (isAuthenticated) {
      navigate(
        "/admin/dashboard",
        { replace: true }
      );
    }
  }, [
    isAuthenticated,
    navigate,
  ]);

  /*
   * =========================================================
   * LOGIN SUBMIT
   * =========================================================
   */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const normalizedEmail =
      email.trim().toLowerCase();

    const normalizedPassword =
      password.trim();

    /*
     * EMAIL VALIDATION
     */

    if (!normalizedEmail) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail
      )
    ) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    /*
     * PASSWORD VALIDATION
     */

    if (!normalizedPassword) {
      setError(
        "Please enter your password."
      );
      return;
    }

    try {
      setIsLoading(true);

      /*
       * CALL ADMIN LOGIN API
       */

      const result =
        await adminLogin(
          normalizedEmail,
          normalizedPassword
        );

      /*
       * SAVE AUTHENTICATION
       */

      login(
        result.token,
        result.admin
      );

      /*
       * CHECK PREVIOUS LOCATION
       */

      const state =
        location.state as
          | LocationState
          | null;

      const redirectPath =
        state?.from?.pathname ||
        "/admin/dashboard";

      navigate(
        redirectPath,
        { replace: true }
      );
    } catch (error: any) {
      console.error(
        "Admin login failed:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to login. Please try again.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * =========================================================
   * UI
   * =========================================================
   */

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-5 py-10">
      <div className="w-full max-w-md">
        {/* BRAND / HEADER */}

        <div className="mb-8 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8b542f]">
            GuiltFree Cravings
          </span>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to access the admin panel.
          </p>
        </div>

        {/* LOGIN CARD */}

        <section className="rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">
          {/* ERROR */}

          {error && (
            <div
              className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3"
              role="alert"
            >
              <p className="text-sm font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* EMAIL */}

            <div>
              <label
                htmlFor="admin-email"
                className="text-sm font-semibold text-slate-800"
              >
                Email Address
              </label>

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(
                    event.target.value
                  );
                  setError("");
                }}
                placeholder="Enter admin email"
                autoComplete="email"
                disabled={isLoading}
                className="mt-2 w-full rounded-2xl border border-[#d9c7b7] bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#8b542f] focus:ring-2 focus:ring-[#f3e4d3] disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            </div>

            {/* PASSWORD */}

            <div>
              <label
                htmlFor="admin-password"
                className="text-sm font-semibold text-slate-800"
              >
                Password
              </label>

              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(
                    event.target.value
                  );
                  setError("");
                }}
                placeholder="Enter admin password"
                autoComplete="current-password"
                disabled={isLoading}
                className="mt-2 w-full rounded-2xl border border-[#d9c7b7] bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#8b542f] focus:ring-2 focus:ring-[#f3e4d3] disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#8b542f] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                    aria-hidden="true"
                  />

                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </section>

        {/* FOOTER */}

        <p className="mt-6 text-center text-xs text-slate-400">
          Admin access only
        </p>
      </div>
    </main>
  );
}

export default AdminLoginPage;