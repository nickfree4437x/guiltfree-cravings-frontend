interface ProfileLoadErrorProps {
  message: string;
}

function ProfileLoadError({
  message,
}: ProfileLoadErrorProps) {
  return (
    <main className="min-h-screen bg-[#FFFCF7] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#F1DDE2] bg-[#FBEEF1] px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B5697A]" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#B5697A] sm:text-[10px]">
              Account
            </span>
          </div>

          <h1 className="text-[22px] font-semibold tracking-tight text-[#1F4A2E] sm:text-[26px] md:text-[28px]">
            My Profile
          </h1>

          <p className="mx-auto mt-2 max-w-xl px-2 text-[11.5px] leading-5 text-[#8B7A6C] sm:text-[13px] md:text-[14px] md:leading-6">
            Keep your personal information up to date and manage
            the details connected to your account.
          </p>

          <div className="mx-auto mt-5 h-px w-10 bg-[#E8C8D0]" />
        </div>

        {/* Error Card */}
        <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-[#F0D9D9] bg-white p-7 text-center shadow-sm sm:mt-10 sm:p-10">

          {/* Error Icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF3F3]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-7 w-7 text-[#C86B6B]"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M10.3 3.7 2.9 18a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="mt-5 text-[18px] font-semibold tracking-tight text-[#1F4A2E] sm:text-[20px]">
            Unable to Load Profile
          </h2>

          {/* Message */}
          <p className="mx-auto mt-2 max-w-md text-[12px] leading-5 text-[#8B7A6C] sm:text-[13px] sm:leading-6">
            {message}
          </p>

          {/* Try Again */}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="
              mt-6
              inline-flex
              items-center
              justify-center
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
            "
          >
            Try Again
          </button>

        </div>

      </div>
    </main>
  );
}

export default ProfileLoadError;