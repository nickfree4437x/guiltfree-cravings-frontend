// src/components/admin/customers/CustomersTable.tsx

import type {
  AdminCustomer,
} from "./types";

import {
  formatCustomerDate,
} from "./customerUtils";

import CustomerVerificationBadge from "./CustomerVerificationBadge";

import {
  useNavigate,
} from "react-router-dom";

import { Eye } from "lucide-react";

interface CustomersTableProps {
  customers: AdminCustomer[];
}

function CustomersTable({
  customers,
}: CustomersTableProps) {
  const navigate = useNavigate();

  const handleViewCustomer = (
    customerId: number
  ) => {
    navigate(
      `/admin/customers/${customerId}`
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[720px] lg:min-w-[950px]">
        <thead>
          <tr className="border-b border-[#B5697A] bg-[#B5697A]">
            <th className="px-4 py-2.5 text-left sm:px-6">
              <span className="text-[10px] font-[450] uppercase tracking-[0.08em] text-white sm:text-[11px]">
                Customer
              </span>
            </th>

            <th className="px-4 py-2.5 text-left sm:px-6">
              <span className="text-[10px] font-[450] uppercase tracking-[0.08em] text-white sm:text-[11px]">
                Phone
              </span>
            </th>

            {/* EMAIL — mobile pe hide */}
            <th className="hidden px-4 py-2.5 text-left sm:table-cell sm:px-6">
              <span className="text-[10px] font-[450] uppercase tracking-[0.08em] text-white sm:text-[11px]">
                Email
              </span>
            </th>

            <th className="px-4 py-2.5 text-left sm:px-6">
              <span className="text-[10px] font-[450] uppercase tracking-[0.08em] text-white sm:text-[11px]">
                Verified
              </span>
            </th>

            <th className="px-4 py-2.5 text-left sm:px-6">
              <span className="text-[10px] font-[450] uppercase tracking-[0.08em] text-white sm:text-[11px]">
                Orders
              </span>
            </th>

            {/* JOINED — mobile pe hide */}
            <th className="hidden px-4 py-2.5 text-left sm:table-cell sm:px-6">
              <span className="text-[10px] font-[450] uppercase tracking-[0.08em] text-white sm:text-[11px]">
                Joined
              </span>
            </th>

            <th className="px-4 py-2.5 text-right sm:px-6">
              <span className="text-[10px] uppercase text-white/80 sm:text-[11px]">
                Action
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          {customers.map(
            (customer) => (
              <tr
                key={customer.id}
                className="
                  border-b
                  border-[#F1E9E1]
                  transition-colors
                  duration-200
                  last:border-0
                  hover:bg-[#FFFBF8]
                "
              >
                {/* CUSTOMER */}

                <td className="px-4 py-3 sm:px-6">
                  <p className="truncate text-[12px] text-gray-600 md:text-[13px]">
                    {customer.name ||
                      "Unnamed Customer"}
                  </p>
                </td>

                {/* PHONE */}

                <td className="px-4 py-3 text-[11.5px] text-gray-500 sm:px-6 sm:text-[12.5px]">
                  {customer.phone}
                </td>

                {/* EMAIL — mobile pe hide */}

                <td className="hidden px-4 py-3 text-[11.5px] text-gray-500 sm:table-cell sm:px-6 sm:text-[12.5px]">
                  {customer.email ||
                    "—"}
                </td>

                {/* VERIFICATION */}

                <td className="px-4 py-3 sm:px-6">
                  <CustomerVerificationBadge
                    isVerified={
                      customer.isVerified
                    }
                  />
                </td>

                {/* ORDERS */}

                <td className="px-4 py-3 sm:px-6">
                  <span className="text-[12px] text-[#1F4A2E] sm:text-[13px]">
                    {customer.totalOrders.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </td>

                {/* JOINED — mobile pe hide */}

                <td className="hidden px-4 py-3 text-[11.5px] text-gray-500 sm:table-cell sm:px-6 sm:text-[12.5px]">
                  {formatCustomerDate(
                    customer.createdAt
                  )}
                </td>

                {/* ACTION */}

                <td className="px-4 py-3 text-right sm:px-6">
                  <button
                    type="button"
                    onClick={() =>
                      handleViewCustomer(
                        customer.id
                      )
                    }
                    aria-label={`View ${customer.name || "customer"}`}
                    title="View customer"
                    className="
                      inline-flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-[#D7E2F8]
                      bg-[#F2F6FF]
                      text-[#4D7FEA]
                      hover:border-[#BFD0F5]
                      hover:bg-[#E8F0FF]
                      hover:text-[#3D6ED8]
                      focus:outline-none
                      sm:h-9
                      sm:w-9
                    "
                  >
                    <Eye
                      className="h-[14px] w-[14px] sm:h-[16px] sm:w-[16px]"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
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