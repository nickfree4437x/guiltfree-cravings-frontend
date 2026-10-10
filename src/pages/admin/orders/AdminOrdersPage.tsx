// src/pages/admin/orders/AdminOrdersPage.tsx

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import OrdersPageHeader from "../../../components/admin/orders/OrdersPageHeader";
import OrderSummaryCards from "../../../components/admin/orders/OrderSummaryCards";
import OrdersToolbar from "../../../components/admin/orders/OrdersToolbar";
import OrdersList from "../../../components/admin/orders/OrdersList";

import {
  getAdminOrders,
} from "../../../api/adminOrderApi";

import type {
  AdminOrder,
  OrderStatus,
  PaymentStatus,
} from "../../../components/admin/orders/types";

/*
 * =========================================================
 * ADMIN ORDERS PAGE
 * =========================================================
 */

function AdminOrdersPage() {
  const [search, setSearch] =
    useState("");

  const [orderStatus, setOrderStatus] =
    useState<OrderStatus | "">("");

  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus | "">("");

  const [orders, setOrders] =
    useState<AdminOrder[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
   * =======================================================
   * LOAD ORDERS
   * =======================================================
   */

  const loadOrders = useCallback(
    async (
      showRefreshLoader = false
    ) => {
      try {
        if (showRefreshLoader) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        setError("");

        const data =
          await getAdminOrders();

        setOrders(data);
      } catch (error) {
        console.error(
          "Failed to load admin orders:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load orders. Please try again."
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  /*
   * =======================================================
   * INITIAL LOAD
   * =======================================================
   */

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  /*
   * =======================================================
   * SUMMARY COUNTS
   * =======================================================
   */

  const totalOrders =
    orders.length;

  const pendingOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "PENDING"
    ).length;

  const paidOrders =
    orders.filter(
      (order) =>
        order.paymentStatus ===
        "PAID"
    ).length;

  const completedOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "COMPLETED"
    ).length;

  /*
   * =======================================================
   * FILTER ORDERS
   * =======================================================
   */

  const filteredOrders =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return orders.filter(
        (order) => {
          const matchesSearch =
            !query ||
            order.orderNumber
              .toLowerCase()
              .includes(query) ||
            order.customerName
              .toLowerCase()
              .includes(query) ||
            order.customerPhone
              .toLowerCase()
              .includes(query) ||
            order.customerEmail
              ?.toLowerCase()
              .includes(query);

          const matchesOrderStatus =
            !orderStatus ||
            order.orderStatus ===
              orderStatus;

          const matchesPaymentStatus =
            !paymentStatus ||
            order.paymentStatus ===
              paymentStatus;

          return (
            matchesSearch &&
            matchesOrderStatus &&
            matchesPaymentStatus
          );
        }
      );
    }, [
      orders,
      search,
      orderStatus,
      paymentStatus,
    ]);

  /*
   * =======================================================
   * CLEAR FILTERS
   * =======================================================
   */

  const clearFilters = () => {
    setSearch("");
    setOrderStatus("");
    setPaymentStatus("");
  };

  const hasActiveFilters =
    Boolean(
      search.trim() ||
        orderStatus ||
        paymentStatus
    );

  /*
   * =======================================================
   * LOADING STATE
   * =======================================================
   */

  if (isLoading) {
    return (
      <main className="min-h-full bg-white px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <OrdersPageHeader />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="h-[138px] animate-pulse rounded-2xl border border-[#EFE3D2] bg-white"
                />
              )
            )}
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-[#EFE3D2] bg-white">
            <div className="h-[112px] animate-pulse border-b border-[#EFE3D2] bg-[#FFFCF8]" />

            <div className="space-y-0">
              {[1, 2, 3, 4, 5].map(
                (item) => (
                  <div
                    key={item}
                    className="h-[82px] animate-pulse border-b border-[#F1E9E1] bg-white"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * =======================================================
   * ERROR STATE
   * =======================================================
   */

  if (error) {
    return (
      <main className="min-h-full bg-white px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <OrdersPageHeader />

          <section className="mt-8 flex min-h-[360px] items-center justify-center rounded-2xl border border-[#EFE3D2] bg-white px-6 py-12 text-center shadow-[0_2px_10px_rgba(31,74,46,0.035)]">
            <div className="max-w-md">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FBECEF] text-[#B5697A]">
                <AlertCircle
                  className="h-7 w-7"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>

              <h2 className="mt-5 text-[18px] font-semibold text-[#1F4A2E]">
                Unable to Load Orders
              </h2>

              <p className="mt-2 text-[13px] leading-6 text-[#8B7A6C]">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  void loadOrders()
                }
                className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-[#B5697A] px-5 text-[13px] text-white transition-all duration-200 hover:bg-[#A85F70] hover:shadow-[0_6px_18px_rgba(181,105,122,0.18)] focus:outline-none focus:ring-2 focus:ring-[#B5697A]/20 focus:ring-offset-2"
              >
                Try Again
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <main className="min-h-full bg-white px-5 py-2 sm:px-6 lg:px-8 lg:py-4">
      <div className="mx-auto max-w-7xl">

        {/* PAGE HEADER */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <OrdersPageHeader />

          <button
            type="button"
            onClick={() =>
              void loadOrders(true)
            }
            disabled={isRefreshing}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-[#E8DED3] bg-white px-4 text-[13px] text-[#6F6259] shadow-sm transition-all duration-200 hover:border-[#D9B8C1] hover:bg-[#FDF4F6] hover:text-[#B5697A] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isRefreshing
                  ? "animate-spin"
                  : ""
              }`}
              strokeWidth={1.8}
              aria-hidden="true"
            />
            Refresh
          </button>
        </div>

        {/* SUMMARY CARDS */}

        <OrderSummaryCards
          totalOrders={totalOrders}
          pendingOrders={
            pendingOrders
          }
          paidOrders={
            paidOrders
          }
          completedOrders={
            completedOrders
          }
        />

        <OrdersToolbar
            search={search}
            filteredCount={
              filteredOrders.length
            }
            totalCount={orders.length}
            orderStatus={
              orderStatus
            }
            paymentStatus={
              paymentStatus
            }
            hasActiveFilters={
              hasActiveFilters
            }
            onSearchChange={
              setSearch
            }
            onOrderStatusChange={
              setOrderStatus
            }
            onPaymentStatusChange={
              setPaymentStatus
            }
            onClearFilters={
              clearFilters
            }
          />

        {/* ORDERS */}

        <section className="mt-5 overflow-hidden rounded-xl border border-[#EFE3D2] bg-white shadow-sm">

          <OrdersList
            orders={
              filteredOrders
            }
            hasSearch={
              hasActiveFilters
            }
            onClearSearch={
              clearFilters
            }
          />

        </section>
      </div>
    </main>
  );
}

export default AdminOrdersPage;