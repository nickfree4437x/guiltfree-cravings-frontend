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
    <div className="hidden overflow-x-auto lg:block">
      <table className="w-full min-w-[950px]">
        <thead>
          <tr className="border-b border-[#B5697A] bg-[#B5697A]">
            <th className="px-6 py-3 text-left">
              <span className="text-[11px] uppercase text-white/80">
                Customer
              </span>
            </th>

            <th className="px-6 py-3 text-left">
              <span className="text-[11px] uppercase  text-white/80">
                Phone
              </span>
            </th>

            <th className="px-6 py-3 text-left">
              <span className="text-[11px] uppercase text-white/80">
                Email
              </span>
            </th>

            <th className="px-6 py-3 text-left">
              <span className="text-[11px] uppercase text-white/80">
                Verification
              </span>
            </th>

            <th className="px-6 py-3 text-left">
              <span className="text-[11px] uppercase text-white/80">
                Orders
              </span>
            </th>

            <th className="px-6 py-3 text-left">
              <span className="text-[11px] uppercase text-white/80">
                Joined
              </span>
            </th>

            <th className="px-6 py-3 text-right">
              <span className="text-[11px] uppercase  text-white/80">
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

                <td className="px-6 py-3">
                  <p className="text-[14px] text-[#3D3834]">
                    {customer.name ||
                      "Unnamed Customer"}
                  </p>
                </td>

                {/* PHONE */}

                <td className="px-6 py-3 text-[13px] text-[#6F6259]">
                  {customer.phone}
                </td>

                {/* EMAIL */}

                <td className="px-6 py-3 text-[13px] text-[#6F6259]">
                  {customer.email ||
                    "—"}
                </td>

                {/* VERIFICATION */}

                <td className="px-6 py-3">
                  <CustomerVerificationBadge
                    isVerified={
                      customer.isVerified
                    }
                  />
                </td>

                {/* ORDERS */}

                <td className="px-6 py-3">
                  <span className="text-[13px] text-[#1F4A2E]">
                    {customer.totalOrders.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </td>

                {/* JOINED */}

                <td className="px-6 py-3 text-[13px] text-[#766A61]">
                  {formatCustomerDate(
                    customer.createdAt
                  )}
                </td>

                {/* ACTION */}

                <td className="px-6 py-3 text-right">
                  <button
                    type="button"
                    onClick={() =>
                      handleViewCustomer(
                        customer.id
                      )
                    }
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-xl
                      border
                      border-[#E6C5CC]
                      bg-white
                      px-3.5
                      py-2
                      text-[12px]
                      text-[#A85F70]
                      hover:bg-[#FBECEF]
                      hover:text-[#9A5264]
                      focus:outline-none
                    "
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