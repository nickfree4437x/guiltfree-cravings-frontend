import type { FormEvent } from "react";

import type {
  ProfileFormData,
  ProfileFormErrors,
} from "../../pages/profile/ProfilePage";

interface ProfileFormProps {
  formData: ProfileFormData;
  errors: ProfileFormErrors;
  successMessage: string;
  pageError: string;
  isSaving: boolean;
  phone: string;

  onChange: (
    field: keyof ProfileFormData,
    value: string
  ) => void;

  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;
}

function ProfileForm({
  formData,
  errors,
  successMessage,
  pageError,
  isSaving,
  phone,
  onChange,
  onSubmit,
}: ProfileFormProps) {
  return (
    <section className="rounded-lg border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">

      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Personal Information
        </h2>

        <p className="mt-1 text-sm font-[350] text-slate-500">
          Keep your account information up to date.
        </p>
      </div>

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
              Your account information has been saved.
            </p>
          </div>
        </div>
      )}

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

      <form
        onSubmit={onSubmit}
        className="mt-7 space-y-6"
      >

        {/* FULL NAME */}

        <div>

          <input
            id="profile-name"
            type="text"
            value={formData.name}
            onChange={(event) =>
              onChange(
                "name",
                event.target.value
              )
            }
            placeholder="Enter your full name"
            autoComplete="name"
            disabled={isSaving}
            className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${
              errors.name
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-[#d9c7b7] focus:border-[#8b542f] focus:ring-[#f3e4d3]"
            }`}
          />

          {errors.name && (
            <p className="mt-2 text-xs text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        {/* PHONE */}

        <div>

          <div className="relative mt-2">
            <input
              id="profile-phone"
              type="tel"
              value={phone}
              readOnly
              aria-readonly="true"
              autoComplete="tel"
              className="w-full cursor-not-allowed rounded-xl border border-[#d9c7b7] bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-600 outline-none"
            />
          </div>

          <p className="mt-2 text-xs font-[350] leading-5 text-slate-400">
            This number is verified using OTP and cannot
            be changed from your profile.
          </p>
        </div>

        {/* EMAIL */}

        <div>

          <input
            id="profile-email"
            type="email"
            value={formData.email}
            onChange={(event) =>
              onChange(
                "email",
                event.target.value
              )
            }
            placeholder="Enter your email address"
            autoComplete="email"
            disabled={isSaving}
            className={`mt-0 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${
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

        {/* SAVE */}

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs font-[350] leading-5 text-slate-400">
            Your mobile number is securely linked to your
            OTP authentication.
          </p>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-full bg-[#8b542f] px-6 py-2.5 text-sm text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
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
  );
}

export default ProfileForm;