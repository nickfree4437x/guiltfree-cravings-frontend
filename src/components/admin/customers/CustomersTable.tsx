// src/components/admin/customers/CustomersTable.tsx

import type {
  AdminCustomer,
} from "./types";

import {
  formatCustomerDate,
} from "./customerUtils";

import CustomerVerificationBadge from "./CustomerVerificationBadge";

interface CustomersTableProps {
  customers: AdminCustomer[];
}

function CustomersTable({
  customers,
}: CustomersTableProps) {
  return (
    <div className="hidden overflow-x-auto lg:block">

      <table className="w-full min-w-[950px]">

        <thead>
          <tr className="border-b border-[#eadfd3] bg-[#fffaf5]">

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              Customer
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              Phone
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              Verification
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              Orders
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              Joined
            </th>

            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
              Action
            </th>

          </tr>
        </thead>

        <tbody className="divide-y divide-[#eadfd3]">

          {customers.map(
            (customer) => (
              <tr
                key={customer.id}
                className="transition hover:bg-[#fffaf5]"
              >

                {/* CUSTOMER */}

                <td className="px-6 py-5">

                  <p className="text-sm font-bold text-slate-900">
                    {customer.name ||
                      "Unnamed Customer"}
                  </p>

                </td>

                {/* PHONE */}

                <td className="px-6 py-5 text-sm text-slate-600">
                  {customer.phone}
                </td>

                {/* EMAIL */}

                <td className="px-6 py-5 text-sm text-slate-600">
                  {customer.email ||
                    "—"}
                </td>

                {/* VERIFICATION */}

                <td className="px-6 py-5">
                  <CustomerVerificationBadge
                    isVerified={
                      customer.isVerified
                    }
                  />
                </td>

                {/* ORDERS */}

                <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                  {customer.totalOrders.toLocaleString(
                    "en-IN"
                  )}
                </td>

                {/* JOINED */}

                <td className="px-6 py-5 text-sm text-slate-600">
                  {formatCustomerDate(
                    customer.createdAt
                  )}
                </td>

                {/* ACTION */}

                <td className="px-6 py-5 text-right">

                  <button
                    type="button"
                    className="rounded-xl border border-[#d9c7b7] px-4 py-2 text-xs text-[#8b542f] transition hover:bg-[#fff3e8]"
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
  );
}

export default CustomersTable;