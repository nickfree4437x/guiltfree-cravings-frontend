import type { FormEvent } from "react";
// import toast from "react-hot-toast";

import type {
  ProfileFormData,
  ProfileFormErrors,
} from "../../pages/profile/ProfilePage";

interface ProfileFormProps {
  formData: ProfileFormData;
  errors: ProfileFormErrors;
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
  pageError,
  isSaving,
  phone,
  onChange,
  onSubmit,
}: ProfileFormProps) {
  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    onSubmit(event);
  };

  return (
    <section className="rounded-xl border border-[#EFE3D2] bg-white p-6 shadow-sm sm:p-8">

      {/* HEADER */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FBEEF1]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-4 w-4 text-[#B5697A]"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19a6 6 0 0 0-12 0m6-9a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm9 8v-1a4 4 0 0 0-3-3.87M17 3.13a4 4 0 0 1 0 7.75"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-[16px] font-semibold tracking-tight text-[#1F4A2E] sm:text-[18px]">
              Personal Information
            </h2>

            <p className="text-[11px] leading-relaxed text-gray-600 sm:text-[12px]">
              Keep your account information up to date.
            </p>
          </div>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {pageError && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#F0D9D9] bg-[#FFF7F7] p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FCEAEA] text-sm font-semibold text-[#C86B6B]">
            !
          </div>

          <div>
            <p className="text-[12px] font-semibold text-[#A94F4F] sm:text-[13px]">
              Unable to save profile
            </p>

            <p className="mt-1 text-[11px] leading-5 text-[#B86A6A]">
              {pageError}
            </p>
          </div>
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-6"
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
            className={`mt-2 w-full rounded-xl border bg-white px-4 py-2.5 text-[12px] text-[#3F352E] outline-none transition placeholder:text-[#B4A69C] sm:text-[13px] ${
              errors.name
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-[#E3D6C8] focus:border-[#B5697A] focus:ring-[#F8E8EC]"
            } disabled:cursor-not-allowed disabled:bg-[#FAF8F5] disabled:text-[#9B918A]`}
          />

          {errors.name && (
            <p className="mt-2 text-[11px] text-red-600">
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
              className="w-full cursor-not-allowed rounded-xl border border-[#E3D6C8] bg-[#FAF8F5] px-4 py-2.5 pr-12 text-[12px] text-[#756A62] outline-none sm:text-[13px]"
            />

            <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-[#EAF4EC] px-2 py-1">
              <span className="text-[9px] text-[#3E7049]">
                Verified
              </span>
            </div>
          </div>
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
            className={`mt-0 w-full rounded-xl border bg-white px-4 py-2.5 text-[12px] text-[#3F352E] outline-none transition placeholder:text-[#B4A69C] sm:text-[13px] ${
              errors.email
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-[#E3D6C8] focus:border-[#B5697A] focus:ring-[#F8E8EC]"
            } disabled:cursor-not-allowed disabled:bg-[#FAF8F5] disabled:text-[#9B918A]`}
          />

          {errors.email && (
            <p className="mt-2 text-[11px] text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        {/* SAVE */}
        <div className="flex flex-col gap-4 pt-0 sm:flex-row sm:items-center sm:justify-between">

          <p className="max-w-sm text-[10.5px] leading-relaxed text-[#A39890] sm:text-[11px]">
            Your mobile number is securely linked to your
            OTP authentication.
          </p>

          <button
            type="submit"
            disabled={isSaving}
            className="
              inline-flex
              min-w-[145px]
              items-center
              justify-center
              gap-2
              rounded-full
              bg-[#B5697A]
              px-6
              py-2.5
              text-[12px]
              text-white
              shadow-sm
              transition-all
              duration-200
              hover:bg-[#A55F70]
              hover:shadow-md
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#B5697A]/40
              focus-visible:ring-offset-2
              disabled:cursor-not-allowed
              disabled:opacity-70
            "
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