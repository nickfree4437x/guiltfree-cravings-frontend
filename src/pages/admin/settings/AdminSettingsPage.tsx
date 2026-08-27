import { useState } from "react";

import { useAdminAuthStore } from "../../../store/adminAuthStore";

function AdminSettingsPage() {
  const admin = useAdminAuthStore(
    (state) => state.admin
  );

  const [storeName, setStoreName] = useState(
    "GuiltFree Cravings"
  );

  const [storeEmail, setStoreEmail] = useState(
    "support@guiltfreecravings.com"
  );

  const [storePhone, setStorePhone] = useState(
    admin?.phone || ""
  );

  const [orderNotifications, setOrderNotifications] =
    useState(true);

  const [paymentNotifications, setPaymentNotifications] =
    useState(true);

  const [customerNotifications, setCustomerNotifications] =
    useState(false);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    /*
     * =====================================================
     * TEMPORARY SAVE
     * =====================================================
     *
     * Actual settings API baad mein connect karenge.
     */

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-6xl">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b542f]">
            Settings
          </span>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Admin Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage your admin profile, store information,
            notifications and account preferences.
          </p>
        </div>

        {/* =================================================
            SETTINGS CONTENT
        ================================================= */}

        <div className="mt-8 space-y-6">

          {/* =================================================
              ADMIN PROFILE
          ================================================= */}

          <section className="rounded-3xl border border-[#eadfd3] bg-white shadow-sm">

            <div className="border-b border-[#eadfd3] px-5 py-5 sm:px-6">
              <h2 className="text-lg font-bold text-slate-900">
                Admin Profile
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Basic information about the current
                administrator account.
              </p>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">

              {/* NAME */}

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Admin Name
                </label>

                <input
                  type="text"
                  value={admin?.name || ""}
                  readOnly
                  className="mt-2 w-full rounded-xl border border-[#eadfd3] bg-[#fffaf5] px-4 py-3 text-sm font-medium text-slate-700 outline-none"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Email
                </label>

                <input
                  type="email"
                  value={admin?.email || ""}
                  readOnly
                  className="mt-2 w-full rounded-xl border border-[#eadfd3] bg-[#fffaf5] px-4 py-3 text-sm font-medium text-slate-700 outline-none"
                />
              </div>

              {/* PHONE */}

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Phone
                </label>

                <input
                  type="text"
                  value={admin?.phone || ""}
                  readOnly
                  className="mt-2 w-full rounded-xl border border-[#eadfd3] bg-[#fffaf5] px-4 py-3 text-sm font-medium text-slate-700 outline-none"
                />
              </div>

              {/* ROLE */}

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Account Role
                </label>

                <input
                  type="text"
                  value="Administrator"
                  readOnly
                  className="mt-2 w-full rounded-xl border border-[#eadfd3] bg-[#fffaf5] px-4 py-3 text-sm font-medium text-slate-700 outline-none"
                />
              </div>

            </div>

          </section>

          {/* =================================================
              STORE INFORMATION
          ================================================= */}

          <section className="rounded-3xl border border-[#eadfd3] bg-white shadow-sm">

            <div className="border-b border-[#eadfd3] px-5 py-5 sm:px-6">
              <h2 className="text-lg font-bold text-slate-900">
                Store Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update the basic information displayed for
                your store.
              </p>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">

              {/* STORE NAME */}

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Store Name
                </label>

                <input
                  type="text"
                  value={storeName}
                  onChange={(event) =>
                    setStoreName(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-[#eadfd3] bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#8b542f] focus:ring-2 focus:ring-[#8b542f]/10"
                />
              </div>

              {/* STORE EMAIL */}

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Store Email
                </label>

                <input
                  type="email"
                  value={storeEmail}
                  onChange={(event) =>
                    setStoreEmail(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-[#eadfd3] bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#8b542f] focus:ring-2 focus:ring-[#8b542f]/10"
                />
              </div>

              {/* STORE PHONE */}

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Store Phone
                </label>

                <input
                  type="text"
                  value={storePhone}
                  onChange={(event) =>
                    setStorePhone(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-[#eadfd3] bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#8b542f] focus:ring-2 focus:ring-[#8b542f]/10"
                />
              </div>

              {/* CURRENCY */}

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Currency
                </label>

                <select
                  defaultValue="INR"
                  className="mt-2 w-full rounded-xl border border-[#eadfd3] bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#8b542f] focus:ring-2 focus:ring-[#8b542f]/10"
                >
                  <option value="INR">
                    Indian Rupee (₹)
                  </option>

                  <option value="USD">
                    US Dollar ($)
                  </option>
                </select>
              </div>

            </div>

          </section>

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <section className="rounded-3xl border border-[#eadfd3] bg-white shadow-sm">

            <div className="border-b border-[#eadfd3] px-5 py-5 sm:px-6">
              <h2 className="text-lg font-bold text-slate-900">
                Notifications
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose which admin notifications you want
                to receive.
              </p>
            </div>

            <div className="divide-y divide-[#eadfd3]">

              {/* ORDER NOTIFICATIONS */}

              <div className="flex items-center justify-between gap-5 px-5 py-5 sm:px-6">

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    New Order Notifications
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Get notified when a new order is created.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setOrderNotifications(
                      !orderNotifications
                    )
                  }
                  className={[
                    "relative h-6 w-11 shrink-0 rounded-full transition",
                    orderNotifications
                      ? "bg-[#8b542f]"
                      : "bg-slate-200",
                  ].join(" ")}
                  aria-label="Toggle order notifications"
                >
                  <span
                    className={[
                      "absolute top-1 h-4 w-4 rounded-full bg-white shadow transition",
                      orderNotifications
                        ? "left-6"
                        : "left-1",
                    ].join(" ")}
                  />
                </button>

              </div>

              {/* PAYMENT NOTIFICATIONS */}

              <div className="flex items-center justify-between gap-5 px-5 py-5 sm:px-6">

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Payment Notifications
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Get notified about successful or failed
                    payments.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setPaymentNotifications(
                      !paymentNotifications
                    )
                  }
                  className={[
                    "relative h-6 w-11 shrink-0 rounded-full transition",
                    paymentNotifications
                      ? "bg-[#8b542f]"
                      : "bg-slate-200",
                  ].join(" ")}
                  aria-label="Toggle payment notifications"
                >
                  <span
                    className={[
                      "absolute top-1 h-4 w-4 rounded-full bg-white shadow transition",
                      paymentNotifications
                        ? "left-6"
                        : "left-1",
                    ].join(" ")}
                  />
                </button>

              </div>

              {/* CUSTOMER NOTIFICATIONS */}

              <div className="flex items-center justify-between gap-5 px-5 py-5 sm:px-6">

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Customer Notifications
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Receive notifications for important
                    customer account activity.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCustomerNotifications(
                      !customerNotifications
                    )
                  }
                  className={[
                    "relative h-6 w-11 shrink-0 rounded-full transition",
                    customerNotifications
                      ? "bg-[#8b542f]"
                      : "bg-slate-200",
                  ].join(" ")}
                  aria-label="Toggle customer notifications"
                >
                  <span
                    className={[
                      "absolute top-1 h-4 w-4 rounded-full bg-white shadow transition",
                      customerNotifications
                        ? "left-6"
                        : "left-1",
                    ].join(" ")}
                  />
                </button>

              </div>

            </div>

          </section>

          {/* =================================================
              SECURITY
          ================================================= */}

          <section className="rounded-3xl border border-[#eadfd3] bg-white shadow-sm">

            <div className="border-b border-[#eadfd3] px-5 py-5 sm:px-6">

              <h2 className="text-lg font-bold text-slate-900">
                Security
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage security-related account actions.
              </p>

            </div>

            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Admin Authentication
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Your admin account is protected through
                  the configured authentication system.
                </p>
              </div>

              <span className="w-fit rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                Protected
              </span>

            </div>

          </section>

          {/* =================================================
              SAVE ACTION
          ================================================= */}

          <div className="flex flex-col gap-3 border-t border-[#eadfd3] pt-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
              {saved && (
                <p className="text-sm font-semibold text-green-600">
                  Settings saved successfully.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-[#8b542f] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#713f24] active:scale-[0.98]"
            >
              Save Changes
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminSettingsPage;