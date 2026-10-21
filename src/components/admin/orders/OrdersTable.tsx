// src/components/admin/orders/OrdersTable.tsx

import { useState, useMemo, useEffect } from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { AdminOrder } from "./types";

import {
  formatAmount,
  formatDate,
} from "./orderUtils";

import OrderStatusBadge from "./OrderStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface OrdersTableProps {
  orders: AdminOrder[];
}

const ITEMS_PER_PAGE = 10;


function OrdersTable({ orders }: OrdersTableProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Safety check for data
  const safeOrders = Array.isArray(orders) ? orders : [];

  // Reset page if orders list changes (e.g., search/filter)
  useEffect(() => {
    setCurrentPage(1);
  }, [safeOrders.length]);

  // Calculate total pages (minimum 1 to avoid infinity)
  const totalPages = Math.max(1, Math.ceil(safeOrders.length / ITEMS_PER_PAGE));

  // Get current page orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return safeOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [safeOrders, currentPage]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Pagination numbers logic (with ellipsis)
  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  if (safeOrders.length === 0) return null;

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px]">
          <thead>
            <tr className="border-b border-[#B5697A] bg-[#B5697A]">
              <th className="px-6 py-2.5 text-left font-[450] text-[11px] uppercase tracking-[0.08em] text-white">
                Order
              </th>

              <th className="px-6 py-2.5 text-left font-[450] text-[11px] uppercase tracking-[0.08em] text-white">
                Customer
              </th>

              <th className="px-6 py-2.5 text-left font-[450] text-[11px] uppercase tracking-[0.08em] text-white">
                Items
              </th>

              <th className="px-6 py-2.5 text-left font-[450] text-[11px] uppercase tracking-[0.08em] text-white">
                Amount
              </th>

              <th className="px-6 py-2.5 text-left font-[450] text-[11px] uppercase tracking-[0.08em] text-white">
                Payment
              </th>

              <th className="px-6 py-2.5 text-left font-[450] text-[11px] uppercase tracking-[0.08em] text-white">
                Status
              </th>

              <th className="px-6 py-2.5 text-left font-[450] text-[11px] uppercase tracking-[0.08em] text-white">
                Date
              </th>

              <th className="px-6 py-3 text-right font-[450] text-[11px] uppercase tracking-[0.08em] text-white">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-[#F1E9E1] transition-colors duration-200 last:border-0 hover:bg-[#fffbfc]"
              >
                {/* ORDER */}
                <td className="px-6 py-3">
                  <span className="inline-flex rounded-lg bg-[#FBECEF] px-2.5 py-1 text-[10px] md:text-[11px] text-[#A85F70]">
                    {order.orderNumber}
                  </span>
                </td>

                {/* CUSTOMER */}
                <td className="px-6 py-3">
                  <p className="text-[12px] md:text-[14px] text-gray-600">
                    {order.customerName}
                  </p>
                </td>

                {/* ITEMS */}
                <td className="px-6 py-3">
                  <span className="text-[13px] font-semibold text-[#5F554E]">
                    {order.itemCount}
                  </span>
                  <span className="ml-1 text-[12px] text-gray-500">
                    {order.itemCount === 1 ? "item" : "items"}
                  </span>
                </td>

                {/* AMOUNT */}
                <td className="px-6 py-3">
                  <span className="text-[12px] md:text-[14px] text-gray-600">
                    {formatAmount(order.totalAmount)}
                  </span>
                  {order.discountAmount > 0 && (
                    <p className="mt-0 text-[10px] text-[#3F8A58]">
                      Discount applied
                    </p>
                  )}
                </td>

                {/* PAYMENT */}
                <td className="px-6 py-3">
                  <PaymentStatusBadge status={order.paymentStatus} />
                </td>

                {/* STATUS */}
                <td className="px-6 py-3">
                  <OrderStatusBadge status={order.orderStatus} />
                </td>

                {/* DATE */}
                <td className="px-6 py-3">
                  <span className="text-[12px] text-gray-500">
                    {formatDate(order.createdAt)}
                  </span>
                </td>

                {/* ACTION */}
                <td className="px-6 py-3 text-right">
                  
                  <button
                    type="button"
                    aria-label={`View ${order.orderNumber}`}
                    title="View order"
                    onClick={() =>
                      navigate(`/admin/orders/${order.id}`)
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#D7E2F8] bg-[#F2F6FF] text-[#4D7FEA] transition-all duration-200 hover:border-[#BFD0F5] hover:bg-[#E8F0FF] hover:text-[#3D6ED8]"
                  >
                    <Eye
                      className="h-4 w-4"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          PAGINATION CONTROLS
      ===================================================== */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#F1E9E1] bg-white px-4 py-4 sm:flex-row sm:px-6">
          {/* Showing Info */}
          <p className="text-[11px] text-gray-500 sm:text-[12px]">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-700">
              {Math.min(currentPage * ITEMS_PER_PAGE, safeOrders.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {safeOrders.length}
            </span>{" "}
            orders
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Previous */}
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="
                inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#EADFD3] bg-white
                text-[#B5697A] hover:border-[#B5697A] hover:bg-[#FBEEF1]
                focus:outline-none disabled:cursor-not-allowed disabled:opacity-40
                disabled:hover:border-[#EADFD3] disabled:hover:bg-white sm:h-9 sm:w-9
              "
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>

            {/* Page Numbers */}
            {pageNumbers.map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="flex h-8 w-6 items-center justify-center text-[12px] text-gray-400 sm:h-9 sm:w-8"
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  aria-label={`Go to page ${page}`}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`
                    inline-flex h-8 min-w-[32px] items-center justify-center rounded-lg border px-2
                    text-[12px] focus:outline-none
                    sm:h-9 sm:min-w-[36px]
                    ${
                      page === currentPage
                        ? "border-[#B5697A] bg-[#B5697A] text-white shadow-sm"
                        : "border-[#EADFD3] bg-white text-[#6F6259] hover:border-[#B5697A] hover:text-[#B5697A]"
                    }
                  `}
                >
                  {page}
                </button>
              );
            })}

            {/* Next */}
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="
                inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#EADFD3] bg-white
                text-[#B5697A] hover:border-[#B5697A] hover:bg-[#FBEEF1]
                focus:outline-none disabled:cursor-not-allowed disabled:opacity-40
                disabled:hover:border-[#EADFD3] disabled:hover:bg-white sm:h-9 sm:w-9
              "
            >
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersTable;