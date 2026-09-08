// src/components/admin/settings/AdminProfileSection.tsx

import type { AdminUser } from "../../../api/adminApi";

interface AdminProfileSectionProps {
  admin: AdminUser | null;
}

function AdminProfileSection({
  admin,
}: AdminProfileSectionProps) {
  return (
    <section className="rounded-xl border border-[#eadfd3] bg-white shadow-sm">
      {/* HEADER */}

      <div className="border-b border-[#eadfd3] px-5 py-5 sm:px-6">
        <h2 className="text-lg font-bold text-slate-900">
          Admin Profile
        </h2>

        <p className="mt-0 text-sm text-slate-500">
          Basic information about the current
          administrator account.
        </p>
      </div>

      {/* CONTENT */}

      <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        {/* NAME */}

        <div>
          <label
            htmlFor="admin-name"
            className="text-xs uppercase tracking-wider text-slate-500"
          >
            Admin Name
          </label>

          <input
            id="admin-name"
            type="text"
            value={admin?.name || ""}
            readOnly
            className="mt-2 w-full rounded-xl border border-[#eadfd3] bg-[#fffaf5] px-4 py-3 text-sm text-slate-700 outline-none"
          />
        </div>

        {/* EMAIL */}

        <div>
          <label
            htmlFor="admin-email"
            className="text-xs uppercase tracking-wider text-slate-500"
          >
            Email
          </label>

          <input
            id="admin-email"
            type="email"
            value={admin?.email || ""}
            readOnly
            className="mt-2 w-full rounded-xl border border-[#eadfd3] bg-[#fffaf5] px-4 py-3 text-sm text-slate-700 outline-none"
          />
        </div>

        {/* PHONE */}

        <div>
          <label
            htmlFor="admin-phone"
            className="text-xs uppercase tracking-wider text-slate-500"
          >
            Phone
          </label>

          <input
            id="admin-phone"
            type="text"
            value={admin?.phone || ""}
            readOnly
            className="mt-2 w-full rounded-xl border border-[#eadfd3] bg-[#fffaf5] px-4 py-3 text-sm text-slate-700 outline-none"
          />
        </div>

        {/* ROLE */}

        <div>
          <label
            htmlFor="admin-role"
            className="text-xs uppercase tracking-wider text-slate-500"
          >
            Account Role
          </label>

          <input
            id="admin-role"
            type="text"
            value="Administrator"
            readOnly
            className="mt-2 w-full rounded-xl border border-[#eadfd3] bg-[#fffaf5] px-4 py-3 text-sm text-slate-700 outline-none"
          />
        </div>
      </div>
    </section>
  );
}

export default AdminProfileSection;