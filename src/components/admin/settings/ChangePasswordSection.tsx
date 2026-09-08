import { useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  ShieldCheck,
} from "lucide-react";

import { changeAdminPassword } from "../../../api/adminApi";

interface ChangePasswordSectionProps {
  onSuccess?: () => void;
}

interface PasswordRequirement {
  label: string;
  valid: boolean;
}

function ChangePasswordSection({
  onSuccess,
}: ChangePasswordSectionProps) {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
   * =========================================================
   * PASSWORD REQUIREMENTS
   * =========================================================
   */

  const passwordRequirements: PasswordRequirement[] = [
    {
      label: "At least 8 characters",
      valid: newPassword.length >= 8,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(newPassword),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(newPassword),
    },
    {
      label: "One number",
      valid: /\d/.test(newPassword),
    },
    {
      label: "One special character",
      valid: /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/.test(
        newPassword
      ),
    },
  ];

  /*
   * =========================================================
   * PASSWORD INPUT
   * =========================================================
   */

  const passwordInputClass =
    "h-12 w-full rounded-xl border border-[#eadfd3] bg-[#fffaf5] px-4 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#8b542f] focus:ring-2 focus:ring-[#8b542f]/10";

  /*
   * =========================================================
   * HANDLE SUBMIT
   * =========================================================
   */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    /*
     * Current password validation
     */

    if (!currentPassword) {
      setError(
        "Please enter your current password."
      );
      return;
    }

    /*
     * New password validation
     */

    if (!newPassword) {
      setError(
        "Please enter your new password."
      );
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError(
        "Password must contain at least one uppercase letter."
      );
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      setError(
        "Password must contain at least one lowercase letter."
      );
      return;
    }

    if (!/\d/.test(newPassword)) {
      setError(
        "Password must contain at least one number."
      );
      return;
    }

    if (
      !/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/.test(
        newPassword
      )
    ) {
      setError(
        "Password must contain at least one special character."
      );
      return;
    }

    /*
     * Confirm password validation
     */

    if (!confirmPassword) {
      setError(
        "Please confirm your new password."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "New password and confirm password do not match."
      );
      return;
    }

    /*
     * =======================================================
     * API REQUEST
     * =======================================================
     */

    try {
      setIsLoading(true);

      const result =
        await changeAdminPassword(
          currentPassword,
          newPassword
        );

      setSuccess(
        result.message ||
          "Admin password has been changed successfully."
      );

      /*
       * Clear form after successful password change.
       */

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      /*
       * Reset password visibility states.
       */

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      onSuccess?.();
    } catch (error: any) {
      setError(
        error?.message ||
          "Unable to change your password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <section className="overflow-hidden rounded-3xl border border-[#eadfd3] bg-white shadow-[0_12px_40px_rgba(117,69,39,0.05)]">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="border-b border-[#eee4dc] px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f8eee4] text-[#8b542f]">
            <KeyRound
              className="h-5 w-5"
              strokeWidth={1.8}
            />
          </div>

          <div>
            <h2 className="text-[17px] font-semibold tracking-tight text-slate-900 sm:text-lg">
              Change Password
            </h2>

            <p className="mt-1 text-[13px] leading-5 text-slate-500 sm:text-sm">
              Update your admin account password to
              keep your account secure.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          FORM
          ===================================================== */}

      <form
        onSubmit={handleSubmit}
        className="px-5 py-6 sm:px-7 sm:py-7"
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {/* =================================================
              CURRENT PASSWORD
              ================================================= */}

          <div className="lg:col-span-2">
            <label
              htmlFor="current-admin-password"
              className="mb-2 block text-[13px] font-medium text-slate-700"
            >
              Current Password
            </label>

            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-slate-400"
                strokeWidth={1.8}
              />

              <input
                id="current-admin-password"
                type={
                  showCurrentPassword
                    ? "text"
                    : "password"
                }
                value={currentPassword}
                onChange={(event) => {
                  setCurrentPassword(
                    event.target.value
                  );
                  setError("");
                  setSuccess("");
                }}
                placeholder="Enter your current password"
                autoComplete="current-password"
                disabled={isLoading}
                className={`${passwordInputClass} pl-11`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrentPassword(
                    (current) => !current
                  )
                }
                aria-label={
                  showCurrentPassword
                    ? "Hide current password"
                    : "Show current password"
                }
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-[#f8eee4] hover:text-[#8b542f]"
              >
                {showCurrentPassword ? (
                  <EyeOff
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.8}
                  />
                ) : (
                  <Eye
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.8}
                  />
                )}
              </button>
            </div>
          </div>

          {/* =================================================
              NEW PASSWORD
              ================================================= */}

          <div>
            <label
              htmlFor="new-admin-password"
              className="mb-2 block text-[13px] font-medium text-slate-700"
            >
              New Password
            </label>

            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-slate-400"
                strokeWidth={1.8}
              />

              <input
                id="new-admin-password"
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(
                    event.target.value
                  );
                  setError("");
                  setSuccess("");
                }}
                placeholder="Enter your new password"
                autoComplete="new-password"
                disabled={isLoading}
                className={`${passwordInputClass} pl-11`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowNewPassword(
                    (current) => !current
                  )
                }
                aria-label={
                  showNewPassword
                    ? "Hide new password"
                    : "Show new password"
                }
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-[#f8eee4] hover:text-[#8b542f]"
              >
                {showNewPassword ? (
                  <EyeOff
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.8}
                  />
                ) : (
                  <Eye
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.8}
                  />
                )}
              </button>
            </div>
          </div>

          {/* =================================================
              CONFIRM PASSWORD
              ================================================= */}

          <div>
            <label
              htmlFor="confirm-admin-password"
              className="mb-2 block text-[13px] font-medium text-slate-700"
            >
              Confirm New Password
            </label>

            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-slate-400"
                strokeWidth={1.8}
              />

              <input
                id="confirm-admin-password"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(
                    event.target.value
                  );
                  setError("");
                  setSuccess("");
                }}
                placeholder="Confirm your new password"
                autoComplete="new-password"
                disabled={isLoading}
                className={`${passwordInputClass} pl-11`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (current) => !current
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-[#f8eee4] hover:text-[#8b542f]"
              >
                {showConfirmPassword ? (
                  <EyeOff
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.8}
                  />
                ) : (
                  <Eye
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.8}
                  />
                )}
              </button>
            </div>

            {confirmPassword &&
              newPassword === confirmPassword && (
                <div className="mt-2 flex items-center gap-1.5 text-[12px] text-emerald-600">
                  <Check
                    className="h-3.5 w-3.5"
                    strokeWidth={2}
                  />
                  Passwords match
                </div>
              )}
          </div>
        </div>

        {/* ===================================================
            PASSWORD REQUIREMENTS
            =================================================== */}

        <div className="mt-6 rounded-2xl border border-[#eadfd3] bg-[#fffaf5] p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck
              className="h-4 w-4 text-[#8b542f]"
              strokeWidth={1.8}
            />

            <p className="text-[13px] font-semibold text-slate-800">
              Password requirements
            </p>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {passwordRequirements.map(
              (requirement) => (
                <div
                  key={requirement.label}
                  className={`flex items-center gap-2 text-[12px] transition-colors ${
                    requirement.valid
                      ? "text-emerald-600"
                      : "text-slate-500"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      requirement.valid
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {requirement.valid && (
                      <Check
                        className="h-2.5 w-2.5"
                        strokeWidth={2.5}
                      />
                    )}
                  </span>

                  <span>
                    {requirement.label}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* ===================================================
            ERROR
            =================================================== */}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] leading-5 text-red-600">
            {error}
          </div>
        )}

        {/* ===================================================
            SUCCESS
            =================================================== */}

        {success && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] leading-5 text-emerald-700">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0"
              strokeWidth={2}
            />

            <span>{success}</span>
          </div>
        )}

        {/* ===================================================
            ACTION
            =================================================== */}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#8b542f] px-5 text-[13px] font-medium text-white transition hover:bg-[#754527] focus:outline-none focus:ring-2 focus:ring-[#8b542f]/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ChangePasswordSection;