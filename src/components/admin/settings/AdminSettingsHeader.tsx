// src/components/admin/settings/AdminSettingsHeader.tsx

function AdminSettingsHeader() {
  return (
    <div>

      <h1 className="mt-2 text-[18px] md:text-[24px] font-bold tracking-tight text-slate-900">
        Admin Settings
      </h1>

      <p className="mt-0 max-w-xl text-sm leading-relaxed text-slate-500">
        Manage your admin profile, store information,
        notifications and account preferences.
      </p>
    </div>
  );
}

export default AdminSettingsHeader;