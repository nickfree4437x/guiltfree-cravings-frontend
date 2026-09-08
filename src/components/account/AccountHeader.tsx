function AccountHeader() {
  return (
    <div className="mb-8">

      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b542f]">
        My Account
      </span>

      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Account & Profile
      </h1>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
        Manage your personal information and
        access your orders from one place.
      </p>

    </div>
  );
}

export default AccountHeader;