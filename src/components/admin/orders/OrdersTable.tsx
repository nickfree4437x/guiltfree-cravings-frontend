import { useState, useMemo, useEffect } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Truck,
  LoaderCircle,
  PackageCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import type {
  AdminOrder,
  OrderStatus,
  DeliveryStatus,
} from "./types";

import {
  formatAmount,
  formatDate,
  getDeliveryStatusClass,
} from "./orderUtils";

import OrderStatusBadge from "./OrderStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface OrdersTableProps {
  orders: AdminOrder[];

  onOrderStatusChange: (
    orderId: number,
    orderStatus: OrderStatus
  ) => Promise<void>;

  onDeliveryStatusChange: (
    orderId: number,
    deliveryStatus: DeliveryStatus
  ) => Promise<void>;
}

const ITEMS_PER_PAGE = 10;

/*
 * =========================================================
 * MAIN ORDER STATUS OPTIONS
 * =========================================================
 */

const ORDER_STATUS_OPTIONS: {
  value: OrderStatus;
  label: string;
}[] = [
  { value: "NEW", label: "New" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PACKED", label: "Packed" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "RETURNED", label: "Returned" },
];

/*
 * =========================================================
 * LEGACY ORDER STATUSES
 * =========================================================
 */

const LEGACY_ORDER_STATUSES: {
  value: OrderStatus;
  label: string;
}[] = [
  { value: "PENDING", label: "Pending (Legacy)" },
  { value: "PROCESSING", label: "Processing (Legacy)" },
  { value: "COMPLETED", label: "Completed (Legacy)" },
];

/*
 * =========================================================
 * DELIVERY STATUS OPTIONS
 * =========================================================
 */

const DELIVERY_STATUS_OPTIONS: {
  value: DeliveryStatus;
  label: string;
}[] = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

function OrdersTable({
  orders,
  onOrderStatusChange,
  onDeliveryStatusChange,
}: OrdersTableProps) {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  const [updatingOrderIds, setUpdatingOrderIds] = useState<
    number[]
  >([]);

  const [updateErrors, setUpdateErrors] = useState<
    Record<number, string>
  >({});

  const [deliveryUpdateErrors, setDeliveryUpdateErrors] =
    useState<Record<number, string>>({});

  const safeOrders = Array.isArray(orders) ? orders : [];

  /*
   * =========================================================
   * PAGINATION
   * =========================================================
   */

  useEffect(() => {
    setCurrentPage(1);
  }, [safeOrders.length]);

  const totalPages = Math.max(
    1,
    Math.ceil(safeOrders.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return safeOrders.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [safeOrders, currentPage]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
  };

  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  /*
   * =========================================================
   * UPDATE MAIN ORDER STATUS
   * =========================================================
   */

  const handleOrderStatusChange = async (
    orderId: number,
    status: OrderStatus
  ) => {
    if (updatingOrderIds.includes(orderId)) return;

    setUpdatingOrderIds((previous) => [
      ...previous,
      orderId,
    ]);

    setUpdateErrors((previous) => {
      const next = { ...previous };
      delete next[orderId];
      return next;
    });

    try {
      await onOrderStatusChange(orderId, status);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to update order status.";

      setUpdateErrors((previous) => ({
        ...previous,
        [orderId]: message,
      }));
    } finally {
      setUpdatingOrderIds((previous) =>
        previous.filter((id) => id !== orderId)
      );
    }
  };

  /*
   * =========================================================
   * UPDATE DELIVERY STATUS
   * =========================================================
   */

  const handleDeliveryStatusChange = async (
    orderId: number,
    status: DeliveryStatus
  ) => {
    if (updatingOrderIds.includes(orderId)) return;

    setUpdatingOrderIds((previous) => [
      ...previous,
      orderId,
    ]);

    setDeliveryUpdateErrors((previous) => {
      const next = { ...previous };
      delete next[orderId];
      return next;
    });

    try {
      await onDeliveryStatusChange(orderId, status);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to update delivery status.";

      setDeliveryUpdateErrors((previous) => ({
        ...previous,
        [orderId]: message,
      }));
    } finally {
      setUpdatingOrderIds((previous) =>
        previous.filter((id) => id !== orderId)
      );
    }
  };

  /*
   * =========================================================
   * EMPTY STATE
   * =========================================================
   */

  if (safeOrders.length === 0) return null;

  /*
   * =========================================================
   * MAIN TABLE
   * =========================================================
   */

  return (
    <div className="w-full">

      <div className="overflow-x-auto">

        {/* Min-width ko thoda kam kiya kyunki Action column hat gaya */}
        <table className="w-full min-w-[1100px]">

          <thead>
            <tr className="border-b border-[#B5697A] bg-[#B5697A]">

              <th className="px-5 py-3 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
                Order
              </th>

              <th className="px-5 py-3 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
                Customer
              </th>

              <th className="px-5 py-3 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
                Amount
              </th>

              <th className="px-5 py-3 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
                Payment
              </th>

              <th className="px-5 py-3 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
                Order Status
              </th>

              <th className="px-5 py-3 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
                Delivery Status
              </th>

              <th className="px-5 py-3 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
                Date
              </th>

            </tr>
          </thead>

          <tbody>

            {paginatedOrders.map((order) => {
              const deliveryStatus: DeliveryStatus =
                order.deliveryStatus ?? "PENDING";

              const isUpdating = updatingOrderIds.includes(
                order.id
              );

              const orderUpdateError = updateErrors[order.id];

              const deliveryUpdateError =
                deliveryUpdateErrors[order.id];

              const isLegacyStatus =
                LEGACY_ORDER_STATUSES.some(
                  (status) =>
                    status.value === order.orderStatus
                );

              const legacyStatusLabel =
                LEGACY_ORDER_STATUSES.find(
                  (status) =>
                    status.value === order.orderStatus
                )?.label;

              return (
                <tr
                  key={order.id}
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                  className="cursor-pointer border-b border-[#F1E9E1] transition-colors duration-200 last:border-0 hover:bg-[#fffbfc]"
                >

                  {/* ORDER */}

                  <td className="px-5 py-3">
                    <span className="inline-flex whitespace-nowrap rounded-lg bg-[#FBECEF] px-2.5 py-1 text-[9px] text-[#A85F70] md:text-[10px]">
                      {order.orderNumber}
                    </span>
                  </td>

                  {/* CUSTOMER */}

                  <td className="px-5 py-3">
                    <p className="max-w-[180px] truncate text-[12px] text-gray-600 md:text-[14px]">
                      {order.customerName}
                    </p>

                    {order.customerPhone && (
                      <p className="mt-0.5 text-[11px] text-gray-400">
                        {order.customerPhone}
                      </p>
                    )}
                  </td>

                  {/* AMOUNT */}

                  <td className="px-5 py-3">
                    <span className="whitespace-nowrap text-[12px] text-gray-600 md:text-[14px]">
                      {formatAmount(order.totalAmount)}
                    </span>

                    {order.discountAmount > 0 && (
                      <p className="mt-0.5 text-[10px] text-[#3F8A58]">
                        Discount applied
                      </p>
                    )}
                  </td>

                  {/* PAYMENT STATUS */}

                  <td className="px-5 py-3">
                    <PaymentStatusBadge
                      status={order.paymentStatus}
                    />
                  </td>

                  {/* MAIN ORDER STATUS */}

                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="min-w-[180px]">

                      {isLegacyStatus ? (
                        <div>
                          <OrderStatusBadge
                            status={order.orderStatus}
                          />

                          <p className="mt-1 text-[9px] text-gray-400">
                            {legacyStatusLabel}
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="relative">

                            <PackageCheck
                              size={14}
                              aria-hidden="true"
                              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#A85F70]"
                            />

                            <select
                              aria-label={`Order status for ${order.orderNumber}`}
                              value={order.orderStatus}
                              disabled={isUpdating}
                              onChange={(event) =>
                                handleOrderStatusChange(
                                  order.id,
                                  event.target.value as OrderStatus
                                )
                              }
                              className="
                                w-full appearance-none rounded-lg border
                                border-[#EADFD3] bg-white
                                py-2 pl-8 pr-7 text-[11px]
                                text-[#6E5C61] outline-none transition-all
                                focus:border-[#B5697A]
                                disabled:cursor-not-allowed disabled:opacity-60
                              "
                            >
                              {ORDER_STATUS_OPTIONS.map(
                                (option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                )
                              )}
                            </select>

                            {isUpdating ? (
                              <LoaderCircle
                                size={14}
                                aria-label="Updating order status"
                                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 animate-spin text-[#A85F70]"
                              />
                            ) : (
                              <ChevronRight
                                size={14}
                                aria-hidden="true"
                                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-[#A85F70]"
                              />
                            )}

                          </div>
                        </>
                      )}

                      {orderUpdateError && (
                        <p
                          role="alert"
                          className="mt-1 max-w-[190px] text-[10px] text-red-600"
                        >
                          {orderUpdateError}
                        </p>
                      )}

                    </div>
                  </td>

                  {/* DELIVERY STATUS */}

                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="min-w-[170px]">

                      <div className="relative">

                        <Truck
                          size={14}
                          aria-hidden="true"
                          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#A85F70]"
                        />

                        <select
                          aria-label={`Delivery status for ${order.orderNumber}`}
                          value={deliveryStatus}
                          disabled={isUpdating}
                          onChange={(event) =>
                            handleDeliveryStatusChange(
                              order.id,
                              event.target.value as DeliveryStatus
                            )
                          }
                          className={`
                            w-full appearance-none rounded-lg border
                            py-2 pl-8 pr-7 text-[11px]
                            outline-none transition-all
                            disabled:cursor-wait disabled:opacity-60
                            ${getDeliveryStatusClass(deliveryStatus)}
                          `}
                        >
                          {DELIVERY_STATUS_OPTIONS.map(
                            (option) => (
                              <option
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </option>
                            )
                          )}
                        </select>

                        {isUpdating ? (
                          <LoaderCircle
                            size={14}
                            aria-label="Updating delivery status"
                            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 animate-spin text-[#A85F70]"
                          />
                        ) : (
                          <ChevronRight
                            size={14}
                            aria-hidden="true"
                            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-current"
                          />
                        )}

                      </div>

                      {order.deliveredAt &&
                        deliveryStatus === "DELIVERED" && (
                          <p className="mt-1 text-[10px] text-green-700">
                            Delivered:{" "}
                            {formatDate(order.deliveredAt)}
                          </p>
                        )}

                      {deliveryUpdateError && (
                        <p
                          role="alert"
                          className="mt-1 max-w-[190px] text-[10px] text-red-600"
                        >
                          {deliveryUpdateError}
                        </p>
                      )}

                    </div>
                  </td>

                  {/* DATE */}

                  <td className="px-5 py-3">
                    <span className="whitespace-nowrap text-[10px] md:text-[11px] text-gray-500">
                      {formatDate(order.createdAt)}
                    </span>
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

      {/* =====================================================
          PAGINATION
      ===================================================== */}

      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#F1E9E1] bg-white px-4 py-4 sm:flex-row sm:px-6">

          <p className="text-[11px] text-gray-500 sm:text-[12px]">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-700">
              {Math.min(
                currentPage * ITEMS_PER_PAGE,
                safeOrders.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {safeOrders.length}
            </span>{" "}
            orders
          </p>

          <div className="flex items-center gap-1.5 sm:gap-2">

            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#EADFD3] bg-white text-[#B5697A] hover:border-[#B5697A] hover:bg-[#FBEEF1] focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9"
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>

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
                  aria-current={
                    page === currentPage ? "page" : undefined
                  }
                  className={`
                    inline-flex h-8 min-w-[32px] items-center
                    justify-center rounded-lg border px-2 text-[12px]
                    focus:outline-none sm:h-9 sm:min-w-[36px]
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

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#EADFD3] bg-white text-[#B5697A] hover:border-[#B5697A] hover:bg-[#FBEEF1] focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9"
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