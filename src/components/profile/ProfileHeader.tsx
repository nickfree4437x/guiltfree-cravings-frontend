import { UserRound } from "lucide-react";

function ProfileHeader() {
  return (
    <div className="w-full">
      {/* =====================================================
          PREMIUM BANNER
      ===================================================== */}
      <section className="relative overflow-hidden rounded-xl bg-[#B5697A] p-5 shadow-sm sm:p-7">
        <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/[0.08]" />
        <div className="pointer-events-none absolute -bottom-20 right-28 h-36 w-36 rounded-full bg-white/[0.06]" />

        <div className="relative flex items-center gap-4 text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white">
            <UserRound className="h-6 w-6" strokeWidth={1.7} />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.10em] text-white/90">
              Account Details
            </p>

            <h1 className="mt-1 text-[18px] font-semibold text-white sm:text-[22px]">
              My Profile
            </h1>

            <p className="mt-0 text-[10px] leading-relaxed text-white/75">
              Manage your details for a smoother and easier shopping experience.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProfileHeader;