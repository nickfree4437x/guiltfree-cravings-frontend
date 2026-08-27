import { useMemo, useState } from "react";

/*
 * =========================================================
 * CUSTOMER TYPE
 * =========================================================
 */

type AdminCustomer = {
  id: number;
  name: string | null;
  phone: string;
  email: string | null;
  isVerified: boolean;
  totalOrders: number;
  createdAt: string;
};

/*
 * =========================================================
 * CUSTOMERS PAGE
 * =========================================================
 *
 * Admin customer listing.
 *
 * Currently:
 * - UI only
 * - No fake customer data
 * - Ready for backend API integration
 *
 * No delivery functionality is included.
 *
 * =========================================================
 */

function AdminCustomersPage() {
  const [search, setSearch] = useState("");

  /*
   * =======================================================
   * CUSTOMER DATA
   * =======================================================
   *
   * This will later be populated from:
   *
   * GET /api/admin/users
   *
   * Keeping it empty for now prevents fake data
   * from appearing in the admin panel.
   */

  const [customers] =
    useState<AdminCustomer[]>([]);

  /*
   * =======================================================
   * SUMMARY
   * =======================================================
   */

  const totalCustomers = customers.length;

  const verifiedCustomers =
    customers.filter(
      (customer) =>
        customer.isVerified
    ).length;

  const customersWithOrders =
    customers.filter(
      (customer) =>
        customer.totalOrders > 0
    ).length;

  /*
   * =======================================================
   * SEARCH
   * =======================================================
   */

  const filteredCustomers = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter(
      (customer) => {
        const name =
          customer.name
            ?.toLowerCase() || "";

        const email =
          customer.email
            ?.toLowerCase() || "";

        const phone =
          customer.phone
            .toLowerCase();

        return (
          name.includes(query) ||
          email.includes(query) ||
          phone.includes(query)
        );
      }
    );
  }, [customers, search]);

  /*
   * =======================================================
   * DATE FORMATTER
   * =======================================================
   */

  const formatDate = (
    date: string
  ) => {
    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b542f]">
            Management
          </span>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Customers
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            View and manage customers registered
            with your GuiltFree Cravings store.
          </p>
        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">

          {/* TOTAL CUSTOMERS */}

          <div className="rounded-2xl border border-[#eadfd3] bg-white p-5 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Customers
            </p>

            <p className="mt-3 text-2xl font-bold text-slate-900">
              {totalCustomers}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Registered customers
            </p>

          </div>

          {/* VERIFIED */}

          <div className="rounded-2xl border border-[#eadfd3] bg-white p-5 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Verified Customers
            </p>

            <p className="mt-3 text-2xl font-bold text-green-600">
              {verifiedCustomers}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              OTP verified accounts
            </p>

          </div>

          {/* WITH ORDERS */}

          <div className="rounded-2xl border border-[#eadfd3] bg-white p-5 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              With Orders
            </p>

            <p className="mt-3 text-2xl font-bold text-[#8b542f]">
              {customersWithOrders}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Customers who placed orders
            </p>

          </div>

        </div>

        {/* =================================================
            CUSTOMER LIST
        ================================================= */}

        <section className="mt-8 overflow-hidden rounded-3xl border border-[#eadfd3] bg-white shadow-sm">

          {/* =================================================
              TOOLBAR
          ================================================= */}

          <div className="border-b border-[#eadfd3] p-5 sm:p-6">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  All Customers
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredCustomers.length} customer
                  {filteredCustomers.length !== 1
                    ? "s"
                    : ""}{" "}
                  found
                </p>
              </div>

              {/* SEARCH */}

              <div className="relative w-full lg:max-w-sm">

                <span
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                >
                  ⌕
                </span>

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search customer..."
                  className="w-full rounded-xl border border-[#d9c7b7] bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#8b542f] focus:ring-2 focus:ring-[#f3e4d3]"
                />

              </div>

            </div>

          </div>

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {filteredCustomers.length === 0 ? (
            <div className="px-6 py-16 text-center sm:px-10">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff3e8] text-2xl text-[#8b542f]">
                ◯
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No customers found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {search
                  ? "No customers match your search. Try searching with a different name, phone number, or email."
                  : "Registered customers will appear here once customers create accounts."}
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="mt-5 rounded-full bg-[#8b542f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
                >
                  Clear Search
                </button>
              )}

            </div>
          ) : (

            /* =================================================
               DESKTOP TABLE
            ================================================= */

            <div className="hidden overflow-x-auto lg:block">

              <table className="w-full min-w-[950px]">

                <thead>
                  <tr className="border-b border-[#eadfd3] bg-[#fffaf5]">

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                      Verification
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                      Orders
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eadfd3]">

                  {filteredCustomers.map(
                    (customer) => (
                      <tr
                        key={customer.id}
                        className="transition hover:bg-[#fffaf5]"
                      >

                        <td className="px-6 py-5">

                          <p className="text-sm font-bold text-slate-900">
                            {customer.name ||
                              "Unnamed Customer"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            #{customer.id}
                          </p>

                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {customer.phone}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {customer.email ||
                            "—"}
                        </td>

                        <td className="px-6 py-5">

                          {customer.isVerified ? (
                            <span className="inline-flex rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                              Unverified
                            </span>
                          )}

                        </td>

                        <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                          {customer.totalOrders}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {formatDate(
                            customer.createdAt
                          )}
                        </td>

                        <td className="px-6 py-5 text-right">

                          <button
                            type="button"
                            className="rounded-xl border border-[#d9c7b7] px-4 py-2 text-xs font-bold text-[#8b542f] transition hover:bg-[#fff3e8]"
                          >
                            View
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

          {/* =================================================
              MOBILE CUSTOMER CARDS
          ================================================= */}

          {filteredCustomers.length > 0 && (
            <div className="divide-y divide-[#eadfd3] lg:hidden">

              {filteredCustomers.map(
                (customer) => (
                  <article
                    key={customer.id}
                    className="p-5 sm:p-6"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <p className="text-sm font-bold text-slate-900">
                          {customer.name ||
                            "Unnamed Customer"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Customer #{customer.id}
                        </p>

                      </div>

                      {customer.isVerified ? (
                        <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                          Verified
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                          Unverified
                        </span>
                      )}

                    </div>

                    <div className="mt-5 space-y-3">

                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Phone
                        </p>

                        <p className="mt-1 text-sm text-slate-700">
                          {customer.phone}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Email
                        </p>

                        <p className="mt-1 break-all text-sm text-slate-700">
                          {customer.email ||
                            "—"}
                        </p>
                      </div>

                    </div>

                    <div className="mt-5 flex items-center justify-between">

                      <div>

                        <p className="text-xs text-slate-400">
                          Orders
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-800">
                          {customer.totalOrders}
                        </p>

                      </div>

                      <button
                        type="button"
                        className="rounded-xl border border-[#d9c7b7] px-4 py-2 text-xs font-bold text-[#8b542f] transition hover:bg-[#fff3e8]"
                      >
                        View Customer
                      </button>

                    </div>

                  </article>
                )
              )}

            </div>
          )}

        </section>

      </div>
    </div>
  );
}

export default AdminCustomersPage;