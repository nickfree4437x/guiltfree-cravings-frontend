import { useState } from "react";

import {
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
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
    "h-11 w-full rounded-xl border border-[#E8DED3] bg-white px-4 pr-12 text-sm text-[#3D3834] outline-none placeholder:text-[#B0A39A] hover:border-[#DCCDC0] focus:border-[#B5697A] focus:bg-white";

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
    <section className="overflow-hidden rounded-xl border border-[#EFE3D2] bg-white shadow-sm">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="border-b border-[#EFE3D2] bg-white px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex items-start gap-4">

          <div className="min-w-0">
            <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-[#1F4A2E] sm:text-[18px]">
              Change Password
            </h2>

            <p className="mt-1 text-[13px] leading-relaxed text-gray-600">
              Update your admin account password to keep
              your account secure.
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
              className="mb-2 block text-[12px] uppercase tracking-[0.06em] text-[#6F6259]"
            >
              Current Password
            </label>

            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#A9998C]"
                strokeWidth={1.8}
                aria-hidden="true"
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
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#A9998C] hover:text-[#B5697A] focus:outline-none"
              >
                {showCurrentPassword ? (
                  <EyeOff
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                ) : (
                  <Eye
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.8}
                    aria-hidden="true"
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
              className="mb-2 block text-[12px] uppercase tracking-[0.06em] text-[#6F6259]"
            >
              New Password
            </label>

            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#A9998C]"
                strokeWidth={1.8}
                aria-hidden="true"
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
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#A9998C] hover:text-[#B5697A] focus:outline-none"
              >
                {showNewPassword ? (
                  <EyeOff
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                ) : (
                  <Eye
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.8}
                    aria-hidden="true"
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
              className="mb-2 block text-[12px] uppercase tracking-[0.06em] text-[#6F6259]"
            >
              Confirm New Password
            </label>

            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#A9998C]"
                strokeWidth={1.8}
                aria-hidden="true"
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
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#A9998C] hover:text-[#B5697A] focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                ) : (
                  <Eye
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>

            {confirmPassword &&
              newPassword === confirmPassword && (
                <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[#3F8A58]">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#EEF8F2]">
                    <Check
                      className="h-2.5 w-2.5"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                  </span>
                  Passwords match
                </div>
              )}
          </div>

        </div>

        {/* ===================================================
            PASSWORD REQUIREMENTS
            =================================================== */}

        <div className="mt-4 rounded-xl border border-[#EFE3D2] bg-white p-4 sm:p-5">

          <div className="flex items-center gap-2.5">

            <div>
              <p className="text-[13px] font-semibold text-[#3D3834]">
                Password requirements
              </p>

              <p className="mt-0.5 text-[11px] text-[#9A8D82]">
                Make sure your new password meets all
                requirements.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {passwordRequirements.map(
              (requirement) => (
                <div
                  key={requirement.label}
                  className={`
                    flex
                    items-center
                    gap-2
                    text-[12px]
                    transition-colors
                    ${
                      requirement.valid
                        ? "text-[#3F8A58]"
                        : "text-[#7B6D63]"
                    }
                  `}
                >
                  <span
                    className={`
                      flex
                      h-4
                      w-4
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      ${
                        requirement.valid
                          ? "border-[#3F8A58] bg-[#3F8A58] text-white"
                          : "border-[#D8CEC4] bg-white"
                      }
                    `}
                  >
                    {requirement.valid && (
                      <Check
                        className="h-2.5 w-2.5"
                        strokeWidth={2.5}
                        aria-hidden="true"
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
          <div className="mt-5 rounded-xl border border-[#E8C8CE] bg-[#FBECEF] px-4 py-3 text-[13px] leading-relaxed text-[#A85F70]">
            {error}
          </div>
        )}

        {/* ===================================================
            SUCCESS
            =================================================== */}

        {success && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#CFE4D4] bg-[#EEF8F2] px-4 py-3 text-[13px] leading-5 text-[#3F8A58]">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0"
              strokeWidth={2}
              aria-hidden="true"
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
            className="
              inline-flex
              h-11
              items-center
              justify-center
              rounded-xl
              bg-[#B5697A]
              px-5
              text-[13px]
              text-white
              transition-all
              duration-200
              hover:bg-[#A85F70]
              hover:shadow-sm
              focus:outline-none
              disabled:cursor-not-allowed
              disabled:opacity-60
              disabled:hover:translate-y-0
            "
          >
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Updating...
              </>
            ) : (
              <>
                <KeyRound
                  className="mr-2 h-4 w-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                Update Password
              </>
            )}
          </button>
        </div>

      </form>
    </section>
  );
}

export default ChangePasswordSection;