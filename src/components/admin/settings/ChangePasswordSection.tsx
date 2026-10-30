import { useState } from "react";
import type { FormEvent } from "react";
import { Check, Eye, EyeOff, KeyRound, Lock } from "lucide-react";
import toast from "react-hot-toast";

import { changeAdminPassword } from "../../../api/adminApi";

// ─── Types ────────────────────────────────────────────────
interface ChangePasswordSectionProps {
  onSuccess?: () => void;
}

// ─── Config ───────────────────────────────────────────────
const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/;

const PASSWORD_INPUT_CLASS =
  "h-11 w-full rounded-xl border border-[#E8DED3] bg-white px-4 pr-12 pl-11 text-[11px] md:text-[12px] text-slate-500 outline-none placeholder:text-slate-500 hover:border-[#DCCDC0] focus:border-[#B5697A] focus:bg-white";

const LABEL_CLASS = "mb-1 block text-[10px] md:text-[11px] uppercase tracking-wide text-slate-500";

const getPasswordRequirements = (pwd: string) => [
  { label: "At least 8 characters", valid: pwd.length >= 8 },
  { label: "One uppercase letter", valid: /[A-Z]/.test(pwd) },
  { label: "One lowercase letter", valid: /[a-z]/.test(pwd) },
  { label: "One number", valid: /\d/.test(pwd) },
  { label: "One special character", valid: SPECIAL_CHAR_REGEX.test(pwd) },
];

// ─── Validation ───────────────────────────────────────────
function validatePasswords(
  current: string,
  next: string,
  confirm: string
): string | null {
  if (!current) return "Please enter your current password.";
  if (!next) return "Please enter your new password.";
  if (next.length < 8) return "Password must be at least 8 characters long.";
  if (!/[A-Z]/.test(next)) return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(next)) return "Password must contain at least one lowercase letter.";
  if (!/\d/.test(next)) return "Password must contain at least one number.";
  if (!SPECIAL_CHAR_REGEX.test(next)) return "Password must contain at least one special character.";
  if (!confirm) return "Please confirm your new password.";
  if (next !== confirm) return "New password and confirm password do not match.";
  return null;
}

// ─── Password Field ───────────────────────────────────────
function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  setShow,
  placeholder,
  autoComplete,
  disabled,
  ariaLabelPrefix,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  setShow: (fn: (v: boolean) => boolean) => void;
  placeholder: string;
  autoComplete: string;
  disabled: boolean;
  ariaLabelPrefix: string;
}) {
  const Icon = show ? EyeOff : Eye;
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>
      <div className="relative">
        <Lock
          className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#A9998C]"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={PASSWORD_INPUT_CLASS}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={`${show ? "Hide" : "Show"} ${ariaLabelPrefix}`}
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#A9998C] hover:text-[#B5697A] focus:outline-none"
        >
          <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────
function ChangePasswordSection({ onSuccess }: ChangePasswordSectionProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordRequirements = getPasswordRequirements(newPassword);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validatePasswords(currentPassword, newPassword, confirmPassword);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setIsLoading(true);
      const result = await changeAdminPassword(currentPassword, newPassword);
      
      // ✅ SUCCESS TOAST
      toast.success(result.message || "Admin password changed successfully.");

      // Clear form + reset visibility
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      onSuccess?.();
    } catch (error: any) {
      // ✅ ERROR TOAST
      toast.error(error?.message || "Unable to change your password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────
  return (
    <section className="overflow-hidden rounded-xl border border-[#EFE3D2] bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-[#EFE3D2] bg-white px-5 py-5 sm:px-7 sm:py-5">
        <h2 className="text-[14px] md:text-[16px] font-semibold text-slate-700">
          Change Password
        </h2>
        <p className="mt-0 text-[11px] md:text-[12px] text-slate-500">
          Update your admin account password to keep your account secure.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-5 py-6 sm:px-7 sm:py-7">
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Current password (full width) */}
          <div className="lg:col-span-2">
            <PasswordField
              id="current-admin-password"
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
              show={showCurrentPassword}
              setShow={setShowCurrentPassword}
              placeholder="Enter your current password"
              autoComplete="current-password"
              disabled={isLoading}
              ariaLabelPrefix="current password"
            />
          </div>

          {/* New password */}
          <PasswordField
            id="new-admin-password"
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            show={showNewPassword}
            setShow={setShowNewPassword}
            placeholder="Enter your new password"
            autoComplete="new-password"
            disabled={isLoading}
            ariaLabelPrefix="new password"
          />

          {/* Confirm password */}
          <div>
            <PasswordField
              id="confirm-admin-password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
              placeholder="Confirm your new password"
              autoComplete="new-password"
              disabled={isLoading}
              ariaLabelPrefix="confirm password"
            />

            {confirmPassword && newPassword === confirmPassword && (
              <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[#3F8A58]">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#EEF8F2]">
                  <Check className="h-2.5 w-2.5" strokeWidth={2.5} aria-hidden="true" />
                </span>
                Passwords match
              </div>
            )}
          </div>
        </div>

        {/* Password requirements */}
        <div className="mt-4 rounded-xl border border-[#EFE3D2] bg-white p-4 sm:p-5">
          <p className="text-[13px] font-semibold text-gray-600">Password requirements</p>
          <p className="mt-0.5 text-[10px] md:text-[11px] text-gray-500">
            Make sure your new password meets all requirements.
          </p>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {passwordRequirements.map((req) => (
              <div
                key={req.label}
                className={`flex items-center gap-2 text-[12px] transition-colors ${
                  req.valid ? "text-[#3F8A58]" : "text-slate-500"
                }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    req.valid
                      ? "border-[#3F8A58] bg-[#3F8A58] text-white"
                      : "border-[#D8CEC4] bg-white"
                  }`}
                >
                  {req.valid && <Check className="h-2.5 w-2.5" strokeWidth={2.5} aria-hidden="true" />}
                </span>
                <span>{req.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ❌ REMOVED INLINE ERROR/SUCCESS BOXES */}

        {/* Submit */}
        <div className="mt-6 flex w-full justify-end sm:w-auto">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full sm:w-auto h-10 md:h-11 items-center justify-center rounded-xl bg-[#B5697A] px-5 text-[12px] sm:text-[13px] text-white shadow-sm transition-all duration-200 hover:bg-[#A85F70] hover:shadow-md focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <span className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Updating...
              </>
            ) : (
              <>
                <KeyRound className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.8} aria-hidden="true" />
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