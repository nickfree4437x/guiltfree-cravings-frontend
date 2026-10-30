import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  Layers,
  MapPin,
  MapPinned,
  RefreshCw,
} from "lucide-react";

import OrdersPageHeader from "../../../components/admin/orders/OrdersPageHeader";
import OrderSummaryCards from "../../../components/admin/orders/OrderSummaryCards";
import OrdersToolbar from "../../../components/admin/orders/OrdersToolbar";
import OrdersList from "../../../components/admin/orders/OrdersList";

import {
  getAdminOrders,
  updateAdminOrderDeliveryStatus,
} from "../../../api/adminOrderApi";

import type {
  AdminOrder,
  OrderStatus,
  PaymentStatus,
  DeliveryStatus,
} from "../../../components/admin/orders/types";

type AreaFilter = "ALL" | "WITHIN_DWARKA" | "OUTSIDE_DWARKA";

const ORDERS_POLL_INTERVAL = 15_000;

function isWithinDwarka(order: AdminOrder): boolean {
  return order.deliveryZone?.trim().toUpperCase() === "WITHIN_DWARKA";
}

function isOutsideDwarka(order: AdminOrder): boolean {
  return order.deliveryZone?.trim().toUpperCase() === "OUTSIDE_DWARKA";
}

function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState<OrderStatus | "">("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");
  const [areaFilter, setAreaFilter] = useState<AreaFilter>("ALL");

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [deliveryUpdateError, setDeliveryUpdateError] = useState("");
  const [updatingOrderIds, setUpdatingOrderIds] = useState<number[]>([]);

  const requestInProgress = useRef(false);
  const mountedRef = useRef(false);

  /*
   * =========================================================
   * LOAD ADMIN ORDERS
   * =========================================================
   */

  const loadOrders = useCallback(async (showRefreshLoader = false) => {
    if (requestInProgress.current) return;

    requestInProgress.current = true;

    try {
      if (showRefreshLoader && mountedRef.current) {
        setIsRefreshing(true);
      }

      const data = await getAdminOrders();

      if (mountedRef.current) {
        setOrders(data);
        setError("");
      }
    } catch (err: unknown) {
      console.error("Failed to load admin orders:", err);

      if (mountedRef.current) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load orders. Please try again."
        );
      }
    } finally {
      requestInProgress.current = false;

      if (mountedRef.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  /*
   * =========================================================
   * UPDATE DELIVERY STATUS
   * =========================================================
   */

  const handleDeliveryStatusChange = useCallback(
    async (orderId: number, deliveryStatus: DeliveryStatus) => {
      if (updatingOrderIds.includes(orderId)) return;

      setDeliveryUpdateError("");

      setUpdatingOrderIds((current) => [...current, orderId]);

      try {
        const updatedOrder = await updateAdminOrderDeliveryStatus(
          orderId,
          deliveryStatus
        );

        if (mountedRef.current) {
          // Update the affected order immediately in the UI.
          setOrders((currentOrders) =>
            currentOrders.map((order) =>
              order.id === orderId
                ? {
                    ...order,
                    deliveryStatus: updatedOrder.deliveryStatus,
                    deliveredAt: updatedOrder.deliveredAt,
                    orderStatus: updatedOrder.orderStatus,
                    paymentStatus: updatedOrder.paymentStatus,
                    updatedAt: updatedOrder.updatedAt,
                  }
                : order
            )
          );
        }
      } catch (err: unknown) {
        console.error("Failed to update delivery status:", err);

        if (mountedRef.current) {
          setDeliveryUpdateError(
            err instanceof Error
              ? err.message
              : "Unable to update delivery status. Please try again."
          );
        }

        // Reload from the server so the UI reflects the saved state.
        await loadOrders();
      } finally {
        if (mountedRef.current) {
          setUpdatingOrderIds((current) =>
            current.filter((id) => id !== orderId)
          );
        }
      }
    },
    [loadOrders, updatingOrderIds]
  );

  /*
   * =========================================================
   * INITIAL LOAD + AUTO REFRESH
   * =========================================================
   */

  useEffect(() => {
    mountedRef.current = true;

    void loadOrders();

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void loadOrders(true);
      }
    }, ORDERS_POLL_INTERVAL);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadOrders(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      mountedRef.current = false;

      window.clearInterval(intervalId);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [loadOrders]);

  /*
   * =========================================================
   * SUMMARY COUNTS
   * =========================================================
   */

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "PENDING"
  ).length;

  const paidOrders = orders.filter(
    (order) => order.paymentStatus === "PAID"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.orderStatus === "COMPLETED"
  ).length;

  /*
   * =========================================================
   * DELIVERY AREA COUNTS
   * =========================================================
   */

  const areaCounts = useMemo(() => {
    const withinDwarka = orders.filter(isWithinDwarka).length;
    const outsideDwarka = orders.filter(isOutsideDwarka).length;

    return {
      all: orders.length,
      withinDwarka,
      outsideDwarka,
    };
  }, [orders]);

  /*
   * =========================================================
   * AREA FILTER
   * =========================================================
   */

  const areaFilteredOrders = useMemo(() => {
    switch (areaFilter) {
      case "WITHIN_DWARKA":
        return orders.filter(isWithinDwarka);

      case "OUTSIDE_DWARKA":
        return orders.filter(isOutsideDwarka);

      case "ALL":
      default:
        return orders;
    }
  }, [orders, areaFilter]);

  /*
   * =========================================================
   * SEARCH + STATUS FILTERS
   * =========================================================
   */

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return areaFilteredOrders.filter((order) => {
      const matchesSearch =
        !query ||
        order.orderNumber.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerPhone.toLowerCase().includes(query) ||
        Boolean(order.customerEmail?.toLowerCase().includes(query));

      const matchesOrderStatus =
        !orderStatus || order.orderStatus === orderStatus;

      const matchesPaymentStatus =
        !paymentStatus || order.paymentStatus === paymentStatus;

      return (
        matchesSearch &&
        matchesOrderStatus &&
        matchesPaymentStatus
      );
    });
  }, [areaFilteredOrders, search, orderStatus, paymentStatus]);

  /*
   * =========================================================
   * CLEAR FILTERS
   * =========================================================
   */

  const clearFilters = () => {
    setSearch("");
    setOrderStatus("");
    setPaymentStatus("");
    setAreaFilter("ALL");
  };

  const hasActiveFilters = Boolean(
    search.trim() || orderStatus || paymentStatus
  );

  /*
   * =========================================================
   * DELIVERY AREA TABS
   * =========================================================
   */

  const areaTabs = [
    {
      id: "ALL" as const,
      label: "All Areas",
      count: areaCounts.all,
      Icon: Layers,
    },
    {
      id: "WITHIN_DWARKA" as const,
      label: "Within Dwarka",
      count: areaCounts.withinDwarka,
      Icon: MapPin,
    },
    {
      id: "OUTSIDE_DWARKA" as const,
      label: "Outside Dwarka",
      count: areaCounts.outsideDwarka,
      Icon: MapPinned,
    },
  ];

  /*
   * =========================================================
   * INITIAL LOADING
   * =========================================================
   */

  if (isLoading) {
    return (
      <main className="min-h-full bg-white px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <OrdersPageHeader />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[138px] animate-pulse rounded-2xl border border-[#EFE3D2] bg-white"
              />
            ))}
          </div>

          <div className="mt-8 space-y-0 overflow-hidden rounded-2xl border border-[#EFE3D2] bg-white">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-[82px] animate-pulse border-b border-[#F1E9E1] bg-white"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * INITIAL LOAD ERROR
   * =========================================================
   */

  if (error && orders.length === 0) {
    return (
      <main className="min-h-full bg-white px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <OrdersPageHeader />

          <section className="mt-8 flex min-h-[360px] items-center justify-center rounded-2xl border border-[#EFE3D2] bg-white px-6 py-12 text-center">
            <div className="max-w-md">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FBECEF] text-[#B5697A]">
                <AlertCircle className="h-7 w-7" />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-[#1F4A2E]">
                Unable to Load Orders
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#8B7A6C]">
                {error}
              </p>

              <button
                type="button"
                onClick={() => void loadOrders()}
                className="mt-6 rounded-xl bg-[#B5697A] px-5 py-2.5 text-sm text-white hover:bg-[#A85F70]"
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
   * =========================================================
   * MAIN PAGE
   * =========================================================
   */

  return (
    <main className="min-h-full bg-white px-5 py-2 sm:px-6 lg:px-8 lg:py-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <OrdersPageHeader />

          <button
            type="button"
            disabled={isRefreshing}
            onClick={() => void loadOrders(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[#E8DED3] bg-white px-3 py-2 text-[11px] text-slate-500 shadow-sm hover:border-[#D9B8C1] hover:bg-[#FDF4F6] hover:text-[#B5697A] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-[12px]"
          >
            <RefreshCw
              className={
                isRefreshing
                  ? "h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4"
                  : "h-3.5 w-3.5 sm:h-4 sm:w-4"
              }
              strokeWidth={1.8}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* ORDER REFRESH ERROR */}
        {error && orders.length > 0 && (
          <div
            role="status"
            className="mt-4 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              Could not refresh orders. Showing previously loaded data.
            </span>

            <button
              type="button"
              onClick={() => void loadOrders(true)}
              className="shrink-0 font-semibold underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        )}

        {/* DELIVERY UPDATE ERROR */}
        {deliveryUpdateError && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{deliveryUpdateError}</span>
          </div>
        )}

        {/* SUMMARY CARDS */}
        <OrderSummaryCards
          totalOrders={totalOrders}
          pendingOrders={pendingOrders}
          paidOrders={paidOrders}
          completedOrders={completedOrders}
        />

        {/* SEARCH AND STATUS FILTERS */}
        <OrdersToolbar
          search={search}
          filteredCount={filteredOrders.length}
          totalCount={areaFilteredOrders.length}
          orderStatus={orderStatus}
          paymentStatus={paymentStatus}
          hasActiveFilters={hasActiveFilters}
          onSearchChange={setSearch}
          onOrderStatusChange={setOrderStatus}
          onPaymentStatusChange={setPaymentStatus}
          onClearFilters={() => {
            setSearch("");
            setOrderStatus("");
            setPaymentStatus("");
          }}
        />

        {/* DELIVERY AREA TABS */}
        <section
          aria-label="Filter orders by delivery area"
          className="mt-5"
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {areaTabs.map(({ id, label, count, Icon }) => {
              const active = areaFilter === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAreaFilter(id)}
                  aria-pressed={active}
                  className={`flex min-h-[40px] items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition ${
                    active
                      ? "border-[#fffbfc] bg-[#F8EBEF] text-[#824958]"
                      : "border-[#EFE3D2] bg-white text-[#6E5C61] hover:bg-[#fffbfc]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} strokeWidth={1.8} />
                    <span className="text-[11px] md:text-[12px]">
                      {label}
                    </span>
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      active
                        ? "bg-white text-[#824958]"
                        : "bg-[#F8F3F0] text-[#76666A]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ORDERS LIST */}
        <section className="mt-5 overflow-hidden rounded-xl border border-[#EFE3D2] bg-white shadow-sm">
          <OrdersList
            orders={filteredOrders}
            hasSearch={hasActiveFilters || areaFilter !== "ALL"}
            onClearSearch={clearFilters}
            onDeliveryStatusChange={handleDeliveryStatusChange}
          />
        </section>
      </div>
    </main>
  );
}

export default AdminOrdersPage;