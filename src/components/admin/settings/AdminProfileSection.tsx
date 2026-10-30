// src/components/admin/settings/AdminProfileSection.tsx

import type { AdminUser } from "../../../api/adminApi";

// ─── Types ────────────────────────────────────────────────
interface AdminProfileSectionProps {
  admin: AdminUser | null;
}

// ─── Config ───────────────────────────────────────────────
const INPUT_CLASS =
  "mt-1 w-full rounded-xl border border-[#eadfd3] bg-white px-4 py-3 text-[12px] md:text-[12.5px] text-slate-700 outline-none";

const LABEL_CLASS = "text-[10px] md:text-[11px] uppercase tracking-wide text-slate-500";

// ─── Component ────────────────────────────────────────────
function AdminProfileSection({ admin }: AdminProfileSectionProps) {
  // Field config (all read-only)
  const fields = [
    { id: "admin-name", label: "Admin Name", type: "text", value: admin?.name || "" },
    { id: "admin-email", label: "Email", type: "email", value: admin?.email || "" },
    { id: "admin-role", label: "Account Role", type: "text", value: "Administrator" },
  ];

  return (
    <section className="rounded-xl border border-[#eadfd3] bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-[#eadfd3] px-5 py-4 sm:px-6">
        <h2 className="text-[14px] md:text-[16px] font-semibold text-slate-700">
          Admin Profile
        </h2>
        <p className="mt-0 text-[11px] md:text-[12px] text-slate-500">
          Basic information about the current administrator account.
        </p>
      </div>

      {/* Content */}
      <div className="grid gap-3 md:gap-5 p-5 sm:grid-cols-2 sm:p-6">
        {fields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className={LABEL_CLASS}>
              {field.label}
            </label>
            <input
              id={field.id}
              type={field.type}
              value={field.value}
              readOnly
              className={INPUT_CLASS}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminProfileSection;