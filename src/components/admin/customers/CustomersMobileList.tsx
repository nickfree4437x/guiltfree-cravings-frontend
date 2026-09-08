// src/components/admin/customers/CustomersMobileList.tsx

import type {
  AdminCustomer,
} from "./types";

import CustomerVerificationBadge from "./CustomerVerificationBadge";

interface CustomersMobileListProps {
  customers: AdminCustomer[];
}

function CustomersMobileList({
  customers,
}: CustomersMobileListProps) {
  return (
    <div className="divide-y divide-[#eadfd3] lg:hidden">

      {customers.map(
        (customer) => (
          <article
            key={customer.id}
            className="p-5 sm:p-6"
          >

            {/* HEADER */}

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

              <CustomerVerificationBadge
                isVerified={
                  customer.isVerified
                }
              />

            </div>

            {/* CUSTOMER INFO */}

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

            {/* FOOTER */}

            <div className="mt-5 flex items-center justify-between">

              <div>

                <p className="text-xs text-slate-400">
                  Orders
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {customer.totalOrders.toLocaleString(
                    "en-IN"
                  )}
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
  );
}

export default CustomersMobileList;