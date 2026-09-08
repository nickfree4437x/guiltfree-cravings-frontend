// src/components/admin/dashboard/RecentOrders.tsx

import type { AdminRecentOrder } from "../../../api/adminDashboardApi";

import StatusBadge from "./StatusBadge";

interface RecentOrdersProps {
  orders: AdminRecentOrder[];
}

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

function RecentOrders({
  orders,
}: RecentOrdersProps) {
  return (
    <section className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm">
      {/* =================================================
          SECTION HEADER
      ================================================= */}

      <div className="border-b border-[#eadfd3] px-6 py-5 sm:px-7">
        <h2 className="text-lg font-bold text-slate-900">
          Recent Orders
        </h2>

        <p className="mt-1 text-sm font-[350] text-slate-500">
          Latest orders placed by customers.
        </p>
      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {orders.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <p className="text-sm font-medium text-slate-500">
            No orders found.
          </p>
        </div>
      ) : (
        /* =================================================
           ORDERS TABLE
        ================================================= */

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-[#eadfd3] bg-[#fffaf5] text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Order
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Customer
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Amount
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Order Status
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Payment
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[#f1e9e1] last:border-0"
                >
                  {/* Order */}
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    {order.orderNumber}
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {order.customerName}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {order.customerPhone}
                    </p>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    {formatCurrency(
                      order.totalAmount
                    )}
                  </td>

                  {/* Order Status */}
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={
                        order.orderStatus
                      }
                    />
                  </td>

                  {/* Payment */}
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={
                        order.paymentStatus
                      }
                    />
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {formatDate(
                      order.createdAt
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default RecentOrders;