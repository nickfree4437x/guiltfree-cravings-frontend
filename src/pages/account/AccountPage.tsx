import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";

interface ProfileForm {
  name: string;
  email: string;
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

function AccountPage() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );
  const updateUser = useAuthStore(
    (state) => state.updateUser
  );
  const logout = useAuthStore((state) => state.logout);

  const [form, setForm] = useState<ProfileForm>({
    name: "",
    email: "",
  });

  const [isEditing, setIsEditing] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  /*
   * =========================================================
   * LOAD USER DATA
   * =========================================================
   */

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm({
      name: user.name ?? "",
      email: user.email ?? "",
    });
  }, [user]);

  /*
   * =========================================================
   * AUTHENTICATION CHECK
   * =========================================================
   */

  if (!isAuthenticated || !user || !token) {
    return (
      <main className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[#fffaf5] px-6 py-12">
        <div className="w-full max-w-md rounded-3xl border border-[#eadfd3] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3e4d3]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-8 w-8 text-[#8b542f]"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
              />
            </svg>
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Login Required
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
            Please login to access your account and
            manage your profile.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 inline-flex rounded-full bg-[#8b542f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
          >
            Login
          </button>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * FORM CHANGE
   * =========================================================
   */

  const handleInputChange = (
    field: keyof ProfileForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  };

  /*
   * =========================================================
   * START EDITING
   * =========================================================
   */

  const handleStartEditing = () => {
    setForm({
      name: user.name ?? "",
      email: user.email ?? "",
    });

    setSuccessMessage("");
    setErrorMessage("");
    setIsEditing(true);
  };

  /*
   * =========================================================
   * CANCEL EDITING
   * =========================================================
   */

  const handleCancelEditing = () => {
    setForm({
      name: user.name ?? "",
      email: user.email ?? "",
    });

    setSuccessMessage("");
    setErrorMessage("");
    setIsEditing(false);
  };

  /*
   * =========================================================
   * SAVE PROFILE
   * =========================================================
   */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    setSuccessMessage("");
    setErrorMessage("");

    const normalizedName = form.name.trim();
    const normalizedEmail =
      form.email.trim().toLowerCase();

    /*
     * -------------------------------------------------------
     * NAME VALIDATION
     * -------------------------------------------------------
     */

    if (!normalizedName) {
      setErrorMessage("Name is required.");
      return;
    }

    if (normalizedName.length < 2) {
      setErrorMessage(
        "Name must be at least 2 characters long."
      );
      return;
    }

    if (normalizedName.length > 100) {
      setErrorMessage(
        "Name cannot exceed 100 characters."
      );
      return;
    }

    /*
     * -------------------------------------------------------
     * EMAIL VALIDATION
     * -------------------------------------------------------
     */

    if (!normalizedEmail) {
      setErrorMessage("Email is required.");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      setErrorMessage(
        "Please provide a valid email address."
      );
      return;
    }

    /*
     * -------------------------------------------------------
     * TOKEN CHECK
     * -------------------------------------------------------
     */

    if (!token) {
      setErrorMessage(
        "Your session has expired. Please login again."
      );
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch(
        `${API_BASE_URL}/users/me`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: normalizedName,
            email: normalizedEmail,
          }),
        }
      );

      let result:
        | UpdateProfileResponse
        | { success?: boolean; message?: string };

      try {
        result = await response.json();
      } catch {
        result = {
          success: false,
          message:
            "Unable to process the server response.",
        };
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to update your profile."
        );
      }

      if (
        !("data" in result) ||
        !result.data
      ) {
        throw new Error(
          result.message ||
            "Profile update failed."
        );
      }

      /*
       * -----------------------------------------------------
       * UPDATE ZUSTAND + LOCAL STORAGE
       * -----------------------------------------------------
       */

      updateUser({
        id: result.data.id,
        name: result.data.name,
        phone: result.data.phone,
        email: result.data.email,
        isVerified: result.data.isVerified,
      });

      setForm({
        name: result.data.name ?? "",
        email: result.data.email ?? "",
      });

      setIsEditing(false);

      setSuccessMessage(
        "Your profile has been updated successfully."
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while updating your profile.";

      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   */

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <main className="min-h-[calc(100vh-76px)] bg-[#fffaf5] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b542f]">
            My Account
          </span>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Account & Profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Manage your personal information and
            access your orders from one place.
          </p>
        </div>

        {/* ===================================================
            ACCOUNT LAYOUT
        =================================================== */}

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">

          {/* =================================================
              ACCOUNT SIDEBAR
          ================================================= */}

          <aside className="h-fit rounded-3xl border border-[#eadfd3] bg-white p-5 shadow-sm">

            {/* User Preview */}

            <div className="rounded-2xl bg-[#fffaf5] p-5 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3e4d3]">
                <span className="text-xl font-bold text-[#8b542f]">
                  {(
                    user.name?.trim()?.charAt(0) ||
                    user.phone.charAt(0) ||
                    "U"
                  ).toUpperCase()}
                </span>
              </div>

              <h2 className="mt-4 break-words text-base font-bold text-slate-900">
                {user.name || "GuiltFree Customer"}
              </h2>

              <p className="mt-1 break-all text-xs text-slate-500">
                {user.email || user.phone}
              </p>

            </div>

            {/* Account Navigation */}

            <nav className="mt-5 space-y-2">

              <Link
                to="/account"
                className="flex items-center gap-3 rounded-2xl bg-[#8b542f] px-4 py-3 text-sm font-semibold text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                  />
                </svg>

                My Profile
              </Link>

              <Link
                to="/orders"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-[#fffaf5] hover:text-[#8b542f]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 3h12v18H6z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 7h6M9 11h6M9 15h4"
                  />
                </svg>

                My Orders
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 17l5-5-5-5"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12H3"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 19V5a2 2 0 0 0-2-2h-6"
                  />
                </svg>

                Logout
              </button>

            </nav>

          </aside>

          {/* =================================================
              PROFILE CONTENT
          ================================================= */}

          <section className="rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">

            {/* Header */}

            <div className="flex flex-col justify-between gap-4 border-b border-[#eadfd3] pb-6 sm:flex-row sm:items-center">

              <div>
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Keep your account information up to
                  date.
                </p>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={handleStartEditing}
                  className="w-full rounded-full border border-[#8b542f] px-5 py-2.5 text-sm font-semibold text-[#8b542f] transition hover:bg-[#8b542f] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 sm:w-auto"
                >
                  Edit Profile
                </button>
              )}

            </div>

            {/* Messages */}

            {successMessage && (
              <div
                role="status"
                className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
              >
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div
                role="alert"
                className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {errorMessage}
              </div>
            )}

            {/* =================================================
                PROFILE FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="mt-7"
            >

              <div className="grid gap-6 sm:grid-cols-2">

                {/* Full Name */}

                <div>
                  <label
                    htmlFor="account-name"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Full Name
                  </label>

                  <input
                    id="account-name"
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      handleInputChange(
                        "name",
                        event.target.value
                      )
                    }
                    disabled={!isEditing || isSaving}
                    autoComplete="name"
                    placeholder="Enter your full name"
                    className="w-full rounded-2xl border border-[#eadfd3] bg-[#fffaf5] px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#8b542f] focus:bg-white focus:ring-2 focus:ring-[#8b542f]/10 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                </div>

                {/* Phone */}

                <div>
                  <label
                    htmlFor="account-phone"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Mobile Number
                  </label>

                  <input
                    id="account-phone"
                    type="tel"
                    value={user.phone}
                    disabled
                    readOnly
                    className="w-full cursor-not-allowed rounded-2xl border border-[#eadfd3] bg-slate-100 px-4 py-3 text-sm text-slate-600 outline-none"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Your mobile number is linked to
                    your account and cannot be changed
                    here.
                  </p>
                </div>

                {/* Email */}

                <div className="sm:col-span-2">
                  <label
                    htmlFor="account-email"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Email Address
                  </label>

                  <input
                    id="account-email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      handleInputChange(
                        "email",
                        event.target.value
                      )
                    }
                    disabled={!isEditing || isSaving}
                    autoComplete="email"
                    placeholder="Enter your email address"
                    className="w-full rounded-2xl border border-[#eadfd3] bg-[#fffaf5] px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#8b542f] focus:bg-white focus:ring-2 focus:ring-[#8b542f]/10 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                </div>

              </div>

              {/* =================================================
                  ACTIONS
              ================================================= */}

              {isEditing && (
                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#eadfd3] pt-6 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={handleCancelEditing}
                    disabled={isSaving}
                    className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8b542f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSaving ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="opacity-30"
                          />
                          <path
                            d="M21 12a9 9 0 0 0-9-9"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>

                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>

                </div>
              )}

            </form>

          </section>

        </div>

        {/* ===================================================
            BACK TO SHOP
        =================================================== */}

        <div className="mt-8 text-center">
          <Link
            to="/#products"
            className="text-sm font-semibold text-[#8b542f] transition hover:text-[#744324]"
          >
            ← Continue Shopping
          </Link>
        </div>

      </div>
    </main>
  );
}

export default AccountPage;