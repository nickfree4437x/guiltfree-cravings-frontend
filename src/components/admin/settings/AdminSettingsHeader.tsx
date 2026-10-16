// src/components/admin/settings/AdminSettingsHeader.tsx

function AdminSettingsHeader() {
  return (
    <div>

      <h1 className="mt-2 text-[18px] md:text-[22px] font-bold tracking-tight text-slate-700">
        Admin Settings
      </h1>

      <p className="mt-0 max-w-xl text-[11px] md:text-[12px] font-[350] leading-relaxed text-slate-500">
       Manage your profile, store info, and account preferences.
      </p>
    </div>
  );
}

export default AdminSettingsHeader;