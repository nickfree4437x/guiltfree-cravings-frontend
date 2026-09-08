interface ProfileVerificationCardProps {
  phone: string;
}

function ProfileVerificationCard({
  phone,
}: ProfileVerificationCardProps) {
  return (
    <div className="rounded-lg border border-[#eadfd3] bg-white p-6 shadow-sm">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 text-green-600">
          ✓
        </div>

        <div>

          <p className="text-sm font-bold text-slate-900">
            Mobile Verified
          </p>

          <p className="mt-0 text-xs font-[350] text-slate-500">
            Your account is verified.
          </p>

        </div>

      </div>

      <div className="mt-4 rounded-2xl bg-[#fffaf5] p-4">

        <p className="text-[12px] md:text-[13px] font-[350] uppercase tracking-wider text-slate-500">
          Account Phone
        </p>

        <p className="mt-0 text-sm font-semibold text-slate-800">
          +91 {phone}
        </p>

      </div>

    </div>
  );
}

export default ProfileVerificationCard;