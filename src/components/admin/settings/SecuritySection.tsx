// src/components/admin/settings/SecuritySection.tsx

function SecuritySection() {
  return (
    <section className="rounded-3xl border border-[#eadfd3] bg-white shadow-sm">
      {/* HEADER */}

      <div className="border-b border-[#eadfd3] px-5 py-5 sm:px-6">
        <h2 className="text-lg font-bold text-slate-900">
          Security
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage security-related account actions.
        </p>
      </div>

      {/* CONTENT */}

      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-sm font-bold text-slate-900">
            Admin Authentication
          </p>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
            Your admin account is protected through
            the configured authentication system.
          </p>
        </div>

        <span className="w-fit shrink-0 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
          Protected
        </span>
      </div>
    </section>
  );
}

export default SecuritySection;