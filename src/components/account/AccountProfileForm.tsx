import {
  useEffect,
  useState,
} from "react";

import type { FormEvent } from "react";

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

interface AccountProfileFormProps {
  user: {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    isVerified: boolean;
  };
  token: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://guiltfree-cravings-backend.onrender.com/api";

function AccountProfileForm({
  user,
  token,
}: AccountProfileFormProps) {
  const updateUser = useAuthStore(
    (state) => state.updateUser
  );

  const [form, setForm] =
    useState<ProfileForm>({
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
    setForm({
      name: user.name ?? "",
      email: user.email ?? "",
    });
  }, [user]);

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

    /*
     * Prevent duplicate requests.
     */

    if (isSaving) {
      return;
    }

    setSuccessMessage("");
    setErrorMessage("");

    /*
     * =======================================================
     * NORMALIZE DATA
     * =======================================================
     */

    const normalizedName =
      form.name.trim();

    const normalizedEmail =
      form.email.trim().toLowerCase();

    /*
     * =======================================================
     * NAME VALIDATION
     * =======================================================
     */

    if (!normalizedName) {
      setErrorMessage(
        "Name is required."
      );

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
     * =======================================================
     * EMAIL VALIDATION
     * =======================================================
     */

    if (!normalizedEmail) {
      setErrorMessage(
        "Email is required."
      );

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
     * =======================================================
     * TOKEN CHECK
     * =======================================================
     */

    if (!token) {
      setErrorMessage(
        "Your session has expired. Please login again."
      );

      return;
    }

    /*
     * =======================================================
     * API REQUEST
     * =======================================================
     */

    try {
      setIsSaving(true);

      const response = await fetch(
        `${API_BASE_URL}/users/me`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: normalizedName,
            email: normalizedEmail,
          }),
        }
      );

      /*
       * =====================================================
       * PARSE RESPONSE
       * =====================================================
       */

      let result:
        | UpdateProfileResponse
        | {
            success?: boolean;
            message?: string;
          };

      try {
        result =
          await response.json();
      } catch {
        result = {
          success: false,
          message:
            "Unable to process the server response.",
        };
      }

      /*
       * =====================================================
       * HTTP ERROR
       * =====================================================
       */

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to update your profile."
        );
      }

      /*
       * =====================================================
       * RESPONSE DATA CHECK
       * =====================================================
       */

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
       * =====================================================
       * UPDATE ZUSTAND
       * =====================================================
       */

      updateUser({
        id: result.data.id,
        name: result.data.name,
        phone: result.data.phone,
        email: result.data.email,
        isVerified:
          result.data.isVerified,
      });

      /*
       * =====================================================
       * UPDATE LOCAL FORM
       * =====================================================
       */

      setForm({
        name:
          result.data.name ?? "",

        email:
          result.data.email ?? "",
      });

      /*
       * =====================================================
       * EXIT EDIT MODE
       * =====================================================
       */

      setIsEditing(false);

      /*
       * =====================================================
       * SUCCESS MESSAGE
       * =====================================================
       */

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

  return (
    <section className="rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">

      {/* =================================================
          HEADER
      ================================================= */}

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

      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {successMessage && (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
        >
          {successMessage}
        </div>
      )}

      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

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

          {/* =================================================
              FULL NAME
          ================================================= */}

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
              disabled={
                !isEditing ||
                isSaving
              }
              autoComplete="name"
              placeholder="Enter your full name"
              className="w-full rounded-2xl border border-[#eadfd3] bg-[#fffaf5] px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#8b542f] focus:bg-white focus:ring-2 focus:ring-[#8b542f]/10 disabled:cursor-not-allowed disabled:opacity-70"
            />

          </div>

          {/* =================================================
              PHONE
          ================================================= */}

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

          {/* =================================================
              EMAIL
          ================================================= */}

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
              disabled={
                !isEditing ||
                isSaving
              }
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

            {/* Cancel */}

            <button
              type="button"
              onClick={
                handleCancelEditing
              }
              disabled={isSaving}
              className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            {/* Save */}

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
  );
}

export default AccountProfileForm;