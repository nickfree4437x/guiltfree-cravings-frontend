import type { AdminRecentOrder } from "../../../api/adminDashboardApi";

import StatusBadge from "./StatusBadge";

interface RecentOrdersProps {
  orders: AdminRecentOrder[];
}

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function RecentOrders({ orders }: RecentOrdersProps) {
  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <section className="mt-8 overflow-hidden bg-white shadow-sm">
      {/* =================================================
          SECTION HEADER
      ================================================= */}

      <div className="flex flex-col gap-1 border-b border-[#EFE3D2] py-1 sm:py-1.5">
        <div className="flex items-center gap-2">
          <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-[#1F4A2E]">
            Recent Orders
          </h2>
        </div>
      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {recentOrders.length === 0 ? (
        <div className="flex min-h-[220px] items-center justify-center px-6 py-12 text-center">
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#FBECEF] text-[#B5697A]">
              <span className="text-lg">—</span>
            </div>

            <p className="mt-4 text-sm text-[#5F554E]">
              No orders found.
            </p>

            <p className="mt-1 text-xs text-[#9A8D82]">
              New customer orders will appear here.
            </p>
          </div>
        </div>
      ) : (
        /* =================================================
           ORDERS TABLE
        ================================================= */

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            {/* =================================================
                TABLE HEADER
            ================================================= */}

            <thead>
              <tr className="border-b border-[#B5697A] bg-[#B5697A]">
                <th className="px-6 py-3 text-left">
                  <span className="text-[11px] uppercase tracking-wide text-white/80">
                    Order
                  </span>
                </th>

                <th className="px-6 py-3 text-left">
                  <span className="text-[11px] uppercase tracking-[0.08em] text-white/80">
                    Customer
                  </span>
                </th>

                <th className="px-6 py-3 text-left">
                  <span className="text-[11px] uppercase tracking-[0.08em] text-white/80">
                    Amount
                  </span>
                </th>

                <th className="px-6 py-3 text-left">
                  <span className="text-[11px] uppercase tracking-[0.08em] text-white/80">
                    Order Status
                  </span>
                </th>

                <th className="px-6 py-3 text-left">
                  <span className="text-[11px] uppercase tracking-[0.08em] text-white/80">
                    Payment
                  </span>
                </th>

                <th className="px-6 py-3 text-left">
                  <span className="text-[11px] uppercase tracking-[0.08em] text-white/80">
                    Date
                  </span>
                </th>
              </tr>
            </thead>

            {/* =================================================
                TABLE BODY
            ================================================= */}

            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="
                    border-b
                    border-[#F1E9E1]
                    transition-colors
                    duration-200
                    last:border-0
                    hover:bg-[#FFFBF8]
                  "
                >
                  {/* Order */}
                  <td className="px-6 py-3">
                    <span className="inline-flex rounded-lg bg-[#FBECEF] px-2.5 py-1 text-[11px] tracking-[0.01em] text-[#A85F70]">
                      {order.orderNumber}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-3">
                    <div>
                      <p className="text-[12.5px] text-[#3D3834]">
                        {order.customerName}
                      </p>

                      <p className="mt-1 text-[11px] text-[#9A8D82]">
                        {order.customerPhone}
                      </p>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-3">
                    <span className="text-[13px] text-[#1F4A2E]">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </td>

                  {/* Order Status */}
                  <td className="px-6 py-3">
                    <StatusBadge status={order.orderStatus} />
                  </td>

                  {/* Payment */}
                  <td className="px-6 py-3">
                    <StatusBadge status={order.paymentStatus} />
                  </td>

                  {/* Date */}
                  <td className="px-6 py-3">
                    <span className="text-[13px] text-[#766A61]">
                      {formatDate(order.createdAt)}
                    </span>
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