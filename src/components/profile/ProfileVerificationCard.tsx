interface ProfileVerificationCardProps {
  phone: string;
}

function ProfileVerificationCard({
  phone,
}: ProfileVerificationCardProps) {
  return (
    <div className="rounded-lg border border-[#EFE3D2] bg-white p-5 shadow-sm sm:p-6">

      {/* HEADER */}
      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FBEEF1] text-[#B5697A]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m5 12 4 4L19 6"
            />
          </svg>
        </div>

        <div>
          <p className="text-[12px] md:text-[14px] font-semibold text-[#B5697A]">
            Mobile Verified
          </p>

          <p className="text-[10px] leading-relaxed text-gray-600">
            Your account is securely verified.
          </p>
        </div>

      </div>

      {/* PHONE */}
      <div className="mt-3 rounded-xl border border-[#F1E7DC] bg-[#FFFCF7] p-2.5">


        <div className="flex items-center justify-between gap-3">

          <p className="text-[13px] text-[#5E5148]">
            +91 {phone}
          </p>

          <span className="rounded-full bg-[#FBEEF1] px-2.5 py-1.5 text-[9px] text-[#B5697A]">
            Verified
          </span>

        </div>

      </div>

    </div>
  );
}

export default ProfileVerificationCard;