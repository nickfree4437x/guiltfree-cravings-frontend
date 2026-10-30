// src/components/admin/dashboard/RecentOrders.tsx

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  UserRound,
  CalendarDays,
  ArrowUpRight,
  Truck,
} from "lucide-react";

import type { AdminRecentOrder } from "../../../api/adminDashboardApi";
import type { DeliveryStatus } from "../orders/types";

import StatusBadge from "./StatusBadge";

// ─── Types ────────────────────────────────────────────────

interface RecentOrdersProps {
  orders: AdminRecentOrder[];
}

// ─── Helpers ──────────────────────────────────────────────

const formatCurrency = (amount: number) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date?: string | null) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatLabel = (value?: string | null) => {
  if (!value) return "Pending";

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getDeliveryStatusClasses = (status: DeliveryStatus) => {
  switch (status) {
    case "CONFIRMED":
      return "border-blue-100 bg-blue-50 text-blue-700";

    case "PROCESSING":
      return "border-violet-100 bg-violet-50 text-violet-700";

    case "OUT_FOR_DELIVERY":
      return "border-amber-100 bg-amber-50 text-amber-700";

    case "DELIVERED":
      return "border-green-100 bg-green-50 text-green-700";

    case "CANCELLED":
      return "border-red-100 bg-red-50 text-red-700";

    case "PENDING":
    default:
      return "border-gray-200 bg-gray-50 text-gray-600";
  }
};

// ─── Config ───────────────────────────────────────────────

const TABLE_HEADERS = [
  "Order",
  "Customer",
  "Amount",
  "Order Status",
  "Payment",
  "Delivery Status",
  "Date",
];

const TH_CLASS =
  "whitespace-nowrap px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-white";

const TD_CLASS = "px-5 py-3";

// ─── Component ────────────────────────────────────────────

function RecentOrders({ orders }: RecentOrdersProps) {
  const navigate = useNavigate();

  const recentOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];

    return [...orders]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime() || 0;
        const dateB = new Date(b.createdAt).getTime() || 0;

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [orders]);

  const handleOrderClick = (orderId: string | number) => {
    navigate(`/admin/orders/${orderId}`);
  };

  return (
    <section className="mt-4 overflow-hidden rounded-2xl border border-[#F1E9E1] bg-white shadow-sm md:mt-6">
      {/* SECTION HEADER */}
      <div className="flex flex-col gap-3 border-b border-[#F1E9E1] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FBECEF] text-[#B5697A]">
            <ShoppingBag size={19} />
          </span>

          <div>
            <h2 className="text-base font-semibold tracking-tight text-[#3D3834] md:text-lg">
              Recent Orders
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Latest customer orders
            </p>
          </div>
        </div>

        {recentOrders.length > 0 && (
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-[#B5697A] transition hover:text-[#8E4658] sm:self-auto"
          >
            View all orders
            <ArrowUpRight size={15} />
          </button>
        )}
      </div>

      {/* EMPTY STATE */}
      {recentOrders.length === 0 ? (
        <div className="flex min-h-[220px] items-center justify-center px-6 py-12 text-center">
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#FBECEF] text-[#B5697A]">
              <ShoppingBag size={21} />
            </div>

            <p className="mt-4 text-sm font-medium text-[#5F554E]">
              No orders found
            </p>

            <p className="mt-1 text-xs text-[#9A8D82]">
              New customer orders will appear here.
            </p>
          </div>
        </div>
      ) : (
        /* ORDERS TABLE */
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-[#B5697A] bg-[#B5697A]">
                {TABLE_HEADERS.map((header) => (
                  <th key={header} className={TH_CLASS}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => {
                const deliveryStatus: DeliveryStatus =
                  order.deliveryStatus ?? "PENDING";

                return (
                  <tr
                    key={order.id}
                    onClick={() => handleOrderClick(order.id)}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" ||
                        event.key === " "
                      ) {
                        event.preventDefault();
                        handleOrderClick(order.id);
                      }
                    }}
                    tabIndex={0}
                    role="link"
                    aria-label={`View details for order ${order.orderNumber}`}
                    className="cursor-pointer border-b border-[#F1E9E1] outline-none transition-colors duration-200 last:border-0 hover:bg-[#FFFBFC] focus-visible:bg-[#FDF5F7] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B5697A]"
                  >
                    {/* ORDER */}
                    <td className={TD_CLASS}>
                      <span className="inline-flex whitespace-nowrap rounded-lg bg-[#FBECEF] px-2.5 py-1 text-[10px] tracking-wide text-[#A85F70] md:text-[11px]">
                        {order.orderNumber}
                      </span>
                    </td>

                    {/* CUSTOMER */}
                    <td className={TD_CLASS}>
                      <div className="flex min-w-[150px] items-start gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7F0E9] text-[#8E7566]">
                          <UserRound size={15} />
                        </span>

                        <div className="min-w-0">
                          <p className="max-w-[190px] truncate text-xs font-medium text-[#3D3834] md:text-sm">
                            {order.customerName || "Guest Customer"}
                          </p>

                          <p className="mt-1 text-[11px] text-slate-500">
                            {order.customerPhone || "No phone provided"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* AMOUNT */}
                    <td className={TD_CLASS}>
                      <span className="whitespace-nowrap text-xs font-semibold text-[#1F4A2E] md:text-sm">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </td>

                    {/* ORDER STATUS */}
                    <td className={TD_CLASS}>
                      <StatusBadge status={order.orderStatus} />
                    </td>

                    {/* PAYMENT STATUS */}
                    <td className={TD_CLASS}>
                      <StatusBadge status={order.paymentStatus} />
                    </td>

                    {/* DELIVERY STATUS */}
                    <td className={TD_CLASS}>
                      <span
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[10px] font-medium md:text-[11px] ${getDeliveryStatusClasses(
                          deliveryStatus
                        )}`}
                      >
                        <Truck size={12} />
                        {formatLabel(deliveryStatus)}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className={TD_CLASS}>
                      <span className="inline-flex items-center gap-2 whitespace-nowrap text-xs text-gray-500">
                        <CalendarDays
                          size={14}
                          className="shrink-0 text-[#B5697A]"
                        />
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default RecentOrders;