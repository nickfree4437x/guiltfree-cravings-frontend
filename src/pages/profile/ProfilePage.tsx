import {
  useEffect,
  useState,
} from "react";

import type { FormEvent } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getMyProfile,
  updateMyProfile,
  type UserProfile,
} from "../../api/userApi";

import { useAuthStore } from "../../store/authStore";

/*
 * =========================================================
 * FORM DATA
 * =========================================================
 */

interface ProfileFormData {
  name: string;
  email: string;
}

/*
 * =========================================================
 * FORM ERRORS
 * =========================================================
 */

interface ProfileFormErrors {
  name: string;
  email: string;
}

/*
 * =========================================================
 * PROFILE PAGE
 * =========================================================
 */

function ProfilePage() {
  const navigate = useNavigate();

  /*
   * =======================================================
   * AUTH STORE
   * =======================================================
   */

  const user = useAuthStore(
    (state) => state.user
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const login = useAuthStore(
    (state) => state.login
  );

  /*
   * =======================================================
   * PROFILE STATE
   * =======================================================
   */

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [formData, setFormData] =
    useState<ProfileFormData>({
      name: "",
      email: "",
    });

  const [errors, setErrors] =
    useState<ProfileFormErrors>({
      name: "",
      email: "",
    });

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [pageError, setPageError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  /*
   * =======================================================
   * AUTH GUARD
   * =======================================================
   */

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/cart", {
        replace: true,
      });
    }
  }, [
    isAuthenticated,
    navigate,
  ]);

  /*
   * =======================================================
   * LOAD PROFILE
   * =======================================================
   */

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setPageError("");

        const data =
          await getMyProfile();

        if (!isMounted) {
          return;
        }

        setProfile(data);

        setFormData({
          name: data.name ?? "",
          email: data.email ?? "",
        });

        /*
         * Keep Zustand user synchronized
         * with the latest database profile.
         */

        const token =
          useAuthStore.getState().token;

        if (token) {
          login(token, {
            id: data.id,
            name: data.name,
            email: data.email ?? "",
            phone: data.phone,
            isVerified: data.isVerified,
          });
        }
      } catch (error) {
        console.error(
          "Failed to load profile:",
          error
        );

        if (!isMounted) {
          return;
        }

        setPageError(
          "Unable to load your profile right now. Please try again."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [
    isAuthenticated,
    login,
  ]);

  /*
   * =======================================================
   * INPUT CHANGE
   * =======================================================
   */

  const handleChange = (
    field: keyof ProfileFormData,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));

    setSuccessMessage("");
    setPageError("");
  };

  /*
   * =======================================================
   * VALIDATE FORM
   * =======================================================
   */

  const validateForm = () => {
    const newErrors: ProfileFormErrors = {
      name: "",
      email: "",
    };

    /*
     * NAME
     */

    const trimmedName =
      formData.name.trim();

    if (!trimmedName) {
      newErrors.name =
        "Please enter your full name.";
    } else if (
      trimmedName.length < 2
    ) {
      newErrors.name =
        "Name must be at least 2 characters long.";
    } else if (
      trimmedName.length > 100
    ) {
      newErrors.name =
        "Name cannot exceed 100 characters.";
    }

    /*
     * EMAIL
     */

    const trimmedEmail =
      formData.email
        .trim()
        .toLowerCase();

    if (!trimmedEmail) {
      newErrors.email =
        "Please enter your email address.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        trimmedEmail
      )
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    setErrors(newErrors);

    return !Object.values(
      newErrors
    ).some(
      (error) => error !== ""
    );
  };

  /*
   * =======================================================
   * SAVE PROFILE
   * =======================================================
   */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSuccessMessage("");
    setPageError("");

    const isValid =
      validateForm();

    if (!isValid) {
      return;
    }

    try {
      setIsSaving(true);

      const updatedUser =
        await updateMyProfile({
          name: formData.name.trim(),
          email: formData.email
            .trim()
            .toLowerCase(),
        });

      /*
       * Update local profile.
       */

      setProfile(updatedUser);

      setFormData({
        name:
          updatedUser.name ?? "",
        email:
          updatedUser.email ?? "",
      });

      /*
       * Keep Zustand authentication
       * user synchronized.
       */

      const token =
        useAuthStore.getState().token;

      if (token) {
        login(token, {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email ?? "",
          phone: updatedUser.phone,
          isVerified:
            updatedUser.isVerified,
        });
      }

      setSuccessMessage(
        "Profile updated successfully."
      );
    } catch (error: any) {
      console.error(
        "Failed to update profile:",
        error
      );

      const message =
        error?.response?.data?.message;

      if (message) {
        setPageError(message);
      } else {
        setPageError(
          "Unable to update your profile. Please try again."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  /*
   * =======================================================
   * PREVENT CONTENT FLASH
   * =======================================================
   */

  if (!isAuthenticated) {
    return null;
  }

  /*
   * =======================================================
   * LOADING STATE
   * =======================================================
   */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#fffaf5] px-6 py-12 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">

          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b542f]">
              Your Account
            </span>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              My Profile
            </h1>
          </div>

          <div className="mt-10 rounded-3xl border border-[#eadfd3] bg-white p-10 text-center shadow-sm">

            <div
              className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#eadfd3] border-t-[#8b542f]"
              aria-hidden="true"
            />

            <p className="mt-5 text-sm font-medium text-slate-600">
              Loading your profile...
            </p>

          </div>

        </div>
      </main>
    );
  }

  /*
   * =======================================================
   * PAGE ERROR
   * =======================================================
   */

  if (pageError && !profile) {
    return (
      <main className="min-h-screen bg-[#fffaf5] px-6 py-12 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">

          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b542f]">
              Your Account
            </span>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              My Profile
            </h1>
          </div>

          <div className="mt-10 rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm sm:p-10">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-8 w-8 text-red-500"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.3 3.7 2.9 18a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"
                />
              </svg>

            </div>

            <h2 className="mt-6 text-xl font-bold text-slate-900">
              Unable to Load Profile
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {pageError}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-6 inline-flex rounded-full bg-[#8b542f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
            >
              Try Again
            </button>

          </div>

        </div>
      </main>
    );
  }

  /*
   * =======================================================
   * PROFILE PAGE
   * =======================================================
   */

  return (
    <main className="min-h-screen bg-[#fffaf5] px-6 py-12 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div>

          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b542f]">
            Your Account
          </span>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Manage your personal information and
            account details.
          </p>

        </div>

        {/* =================================================
            PROFILE CONTENT
        ================================================= */}

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_280px] lg:items-start">

          {/* =================================================
              PROFILE FORM
          ================================================= */}

          <section className="rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Keep your account information up to
                date.
              </p>

            </div>

            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {successMessage && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                  ✓
                </div>

                <div>

                  <p className="text-sm font-semibold text-green-800">
                    {successMessage}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-green-700">
                    Your account information has been
                    saved.
                  </p>

                </div>

              </div>
            )}

            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {pageError && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
                  !
                </div>

                <div>

                  <p className="text-sm font-semibold text-red-800">
                    Unable to save profile
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-700">
                    {pageError}
                  </p>

                </div>

              </div>
            )}

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-6"
            >

              {/* =================================================
                  FULL NAME
              ================================================= */}

              <div>

                <label
                  htmlFor="profile-name"
                  className="text-sm font-semibold text-slate-800"
                >
                  Full Name
                </label>

                <input
                  id="profile-name"
                  type="text"
                  value={formData.name}
                  onChange={(event) =>
                    handleChange(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="Enter your full name"
                  autoComplete="name"
                  disabled={isSaving}
                  className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${
                    errors.name
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                      : "border-[#d9c7b7] focus:border-[#8b542f] focus:ring-[#f3e4d3]"
                  }`}
                />

                {errors.name && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.name}
                  </p>
                )}

              </div>

              {/* =================================================
                  PHONE
              ================================================= */}

              <div>

                <label
                  htmlFor="profile-phone"
                  className="text-sm font-semibold text-slate-800"
                >
                  Verified Mobile Number
                </label>

                <div className="relative mt-2">

                  <input
                    id="profile-phone"
                    type="tel"
                    value={
                      profile?.phone ||
                      user?.phone ||
                      ""
                    }
                    readOnly
                    aria-readonly="true"
                    autoComplete="tel"
                    className="w-full cursor-not-allowed rounded-2xl border border-[#d9c7b7] bg-slate-50 px-4 py-3.5 pr-12 text-sm font-medium text-slate-600 outline-none"
                  />

                  <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600"
                    aria-label="Verified"
                  >
                    ✓
                  </span>

                </div>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  This number is verified using OTP and
                  cannot be changed from your profile.
                </p>

              </div>

              {/* =================================================
                  EMAIL
              ================================================= */}

              <div>

                <label
                  htmlFor="profile-email"
                  className="text-sm font-semibold text-slate-800"
                >
                  Email Address
                </label>

                <input
                  id="profile-email"
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    handleChange(
                      "email",
                      event.target.value
                    )
                  }
                  placeholder="Enter your email address"
                  autoComplete="email"
                  disabled={isSaving}
                  className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${
                    errors.email
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                      : "border-[#d9c7b7] focus:border-[#8b542f] focus:ring-[#f3e4d3]"
                  }`}
                />

                {errors.email && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.email}
                  </p>
                )}

              </div>

              {/* =================================================
                  SAVE BUTTON
              ================================================= */}

              <div className="flex flex-col gap-3 border-t border-[#eadfd3] pt-6 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-xs leading-5 text-slate-400">
                  Your mobile number is securely linked
                  to your OTP authentication.
                </p>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-full bg-[#8b542f] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                >

                  {isSaving ? (
                    <>
                      <span
                        className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                        aria-hidden="true"
                      />

                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}

                </button>

              </div>

            </form>

          </section>

          {/* =================================================
              ACCOUNT SIDEBAR
          ================================================= */}

          <aside className="space-y-5">

            {/* =================================================
                VERIFICATION CARD
            ================================================= */}

            <div className="rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 text-green-600">
                  ✓
                </div>

                <div>

                  <p className="text-sm font-bold text-slate-900">
                    Mobile Verified
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Your account is verified.
                  </p>

                </div>

              </div>

              <div className="mt-5 rounded-2xl bg-[#fffaf5] p-4">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Account Phone
                </p>

                <p className="mt-2 text-sm font-bold text-slate-800">
                  +91{" "}
                  {profile?.phone ||
                    user?.phone ||
                    ""}
                </p>

              </div>

            </div>

            {/* =================================================
                QUICK LINKS
            ================================================= */}

            <div className="rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm">

              <h2 className="text-sm font-bold text-slate-900">
                Account
              </h2>

              <div className="mt-4 space-y-2">

                <Link
                  to="/orders"
                  className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#fffaf5] hover:text-[#8b542f]"
                >
                  <span>
                    My Orders
                  </span>

                  <span aria-hidden="true">
                    →
                  </span>
                </Link>

                <Link
                  to="/#products"
                  className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#fffaf5] hover:text-[#8b542f]"
                >
                  <span>
                    Continue Shopping
                  </span>

                  <span aria-hidden="true">
                    →
                  </span>
                </Link>

              </div>

            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}

export default ProfilePage;