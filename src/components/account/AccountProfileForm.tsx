import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { useAuthStore } from "../../store/authStore";

// ─── Types ────────────────────────────────────────────────
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
    name: string | null;
    phone: string;
    email: string | null;
    isVerified: boolean;
  };
  token: string;
}

// ─── Config ───────────────────────────────────────────────
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://guiltfreecravings.com/api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INPUT_CLASS =
  "w-full rounded-2xl border border-[#eadfd3] bg-[#fffaf5] px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#8b542f] focus:bg-white focus:ring-2 focus:ring-[#8b542f]/10 disabled:cursor-not-allowed disabled:opacity-70";

// ─── Validation ───────────────────────────────────────────
function validateForm(name: string, email: string): string | null {
  if (!name) return "Name is required.";
  if (name.length < 2) return "Name must be at least 2 characters long.";
  if (name.length > 100) return "Name cannot exceed 100 characters.";
  if (!email) return "Email is required.";
  if (!EMAIL_REGEX.test(email)) return "Please provide a valid email address.";
  return null;
}

// ─── Component ────────────────────────────────────────────
function AccountProfileForm({ user, token }: AccountProfileFormProps) {
  const updateUser = useAuthStore((s) => s.updateUser);

  const [form, setForm] = useState<ProfileForm>({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load user data into form
  useEffect(() => {
    setForm({ name: user.name ?? "", email: user.email ?? "" });
  }, [user]);

  // ─── Handlers ───────────────────────────────────────────
  const handleInputChange = (field: keyof ProfileForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSuccessMessage("");
    setErrorMessage("");
  };

  const resetFormFromUser = () =>
    setForm({ name: user.name ?? "", email: user.email ?? "" });

  const handleStartEditing = () => {
    resetFormFromUser();
    setSuccessMessage("");
    setErrorMessage("");
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    resetFormFromUser();
    setSuccessMessage("");
    setErrorMessage("");
    setIsEditing(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;

    setSuccessMessage("");
    setErrorMessage("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    const validationError = validateForm(name, email);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (!token) {
      setErrorMessage("Your session has expired. Please login again.");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      // Parse response safely
      let result: UpdateProfileResponse | { success?: boolean; message?: string };
      try {
        result = await response.json();
      } catch {
        result = { success: false, message: "Unable to process the server response." };
      }

      if (!response.ok) {
        throw new Error(result.message || "Unable to update your profile.");
      }

      if (!("data" in result) || !result.data) {
        throw new Error(result.message || "Profile update failed.");
      }

      // Update Zustand
      updateUser({
        id: result.data.id,
        name: result.data.name,
        phone: result.data.phone,
        email: result.data.email,
        isVerified: result.data.isVerified,
      });

      // Update local form
      setForm({ name: result.data.name ?? "", email: result.data.email ?? "" });
      setIsEditing(false);
      setSuccessMessage("Your profile has been updated successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while updating your profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────
  return (
    <section className="rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#eadfd3] pb-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Personal Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Keep your account information up to date.
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

      {/* Success */}
      {successMessage && (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
        >
          {successMessage}
        </div>
      )}

      {/* Error */}
      {errorMessage && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-7">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Full name */}
          <div>
            <label htmlFor="account-name" className="mb-2 block text-sm font-semibold text-slate-800">
              Full Name
            </label>
            <input
              id="account-name"
              type="text"
              value={form.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={!isEditing || isSaving}
              autoComplete="name"
              placeholder="Enter your full name"
              className={INPUT_CLASS}
            />
          </div>

          {/* Phone (read-only) */}
          <div>
            <label htmlFor="account-phone" className="mb-2 block text-sm font-semibold text-slate-800">
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
              Your mobile number is linked to your account and cannot be changed here.
            </p>
          </div>

          {/* Email */}
          <div className="sm:col-span-2">
            <label htmlFor="account-email" className="mb-2 block text-sm font-semibold text-slate-800">
              Email Address
            </label>
            <input
              id="account-email"
              type="email"
              value={form.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!isEditing || isSaving}
              autoComplete="email"
              placeholder="Enter your email address"
              className={INPUT_CLASS}
            />
          </div>
        </div>

        {/* Actions */}
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
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" className="opacity-30" />
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