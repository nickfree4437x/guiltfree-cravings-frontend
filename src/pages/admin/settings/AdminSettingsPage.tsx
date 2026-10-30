// src/pages/admin/settings/AdminSettingsPage.tsx
import { useAdminAuthStore } from "../../../store/adminAuthStore";

import AdminSettingsHeader from "../../../components/admin/settings/AdminSettingsHeader";
import AdminProfileSection from "../../../components/admin/settings/AdminProfileSection";
import ChangePasswordSection from "../../../components/admin/settings/ChangePasswordSection";

// ─── Component ────────────────────────────────────────────
function AdminSettingsPage() {
  const admin = useAdminAuthStore((s) => s.admin);

  // ─── Render ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white px-5 py-2 sm:px-8 lg:px-10 lg:py-4">
      <div className="mx-auto max-w-6xl">
        <AdminSettingsHeader />

        <div className="mt-4 space-y-6">
          <AdminProfileSection admin={admin} />

          <ChangePasswordSection />
        </div>
      </div>
    </div>
  );
}

export default AdminSettingsPage;