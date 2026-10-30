import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowDownUp,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  LoaderCircle,
  PackageCheck,
  RefreshCw,
  Search,
  ShoppingBag,
  Wallet,
  XCircle,
} from "lucide-react";

import {
  getMyOrders,
  type Order,
  type OrderItem,
} from "../../api/orderApi";
import { getProductById } from "../../api/productApi";
import { useCartStore } from "../../store/cartStore";

// ─── Constants ────────────────────────────────────────────
const ORDERS_PER_PAGE = 6;

type SortOption = "newest" | "oldest";
type HistoryFilter = "ALL" | "PAID" | "REFUNDED";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const DATE_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const DATETIME_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

// ─── Helpers ─────────────────────────────────────────────
function formatCurrency(amount: number) {
  const value = Number(amount);

  return CURRENCY_FORMATTER.format(
    Number.isFinite(value) ? value : 0
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : DATE_FORMATTER.format(date);
}

function formatDateTime(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : DATETIME_FORMATTER.format(date);
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const status = (
      error as { response?: { status?: number } }
    ).response?.status;

    if (status === 401) {
      return "Your session may have expired. Please sign in again to view your order history.";
    }

    if (status === 403) {
      return "You are not authorized to view this order history.";
    }
  }

  return "We couldn't connect to the server. Please try again.";
}

// ─── Payment Status Badge ─────────────────────────────────
function HistoryStatusBadge({
  status,
}: {
  status: Order["paymentStatus"];
}) {
  const styles: Record<Order["paymentStatus"], string> = {
    PAID: "border-emerald-200 bg-emerald-50 text-emerald-700",
    PENDING: "border-amber-200 bg-amber-50 text-amber-700",
    FAILED: "border-red-200 bg-red-50 text-red-700",
    REFUNDED: "border-violet-200 bg-violet-50 text-violet-700",
  };

  const icons: Record<Order["paymentStatus"], React.ReactNode> = {
    PAID: <CheckCircle2 className="h-3.5 w-3.5" />,
    PENDING: <Clock3 className="h-3.5 w-3.5" />,
    FAILED: <XCircle className="h-3.5 w-3.5" />,
    REFUNDED: <RefreshCw className="h-3.5 w-3.5" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-medium ${styles[status]}`}
    >
      {icons[status]}
      {formatLabel(status)}
    </span>
  );
}

// ─── Summary Card ─────────────────────────────────────────
function SummaryCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-[#EFE3D2] bg-white p-4 shadow-sm transition-all hover:border-[#DDB0BB] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#A39890] sm:text-[11px]">
            {title}
          </p>

          <p className="mt-2 break-words text-xl font-semibold text-[#3E3430] sm:text-2xl">
            {value}
          </p>

          <p className="mt-1 text-[10px] leading-relaxed text-[#8B7A6C] sm:text-xs">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF1F2] text-[#B5697A] sm:h-11 sm:w-11">
          {icon}
        </div>
      </div>
    </article>
  );
}

// ─── Loading State ────────────────────────────────────────
function HistoryLoadingState() {
  return (
    <section
      className="mt-8 space-y-5"
      role="status"
      aria-label="Loading order history"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-2xl border border-[#EFE3D2] bg-white"
          />
        ))}
      </div>

      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-2xl border border-[#EFE3D2] bg-white p-5"
        >
          <div className="h-4 w-32 rounded bg-[#F4ECE7]" />
          <div className="mt-4 h-5 w-48 rounded bg-[#F4ECE7]" />
          <div className="mt-5 h-16 rounded-xl bg-[#FAF5F2]" />
        </div>
      ))}

      <p className="text-center text-xs text-[#8B7A6C]">
        Retrieving your completed orders...
      </p>
    </section>
  );
}

// ─── Empty State ──────────────────────────────────────────
function HistoryEmptyState({
  hasSearch,
}: {
  hasSearch: boolean;
}) {
  return (
    <section className="mt-8 rounded-3xl border border-dashed border-[#EADFD3] bg-white px-5 py-12 text-center sm:px-10 sm:py-16">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF1F2] text-[#B5697A]">
        <PackageCheck className="h-8 w-8" />
      </div>

      <h2 className="mt-5 text-xl font-semibold text-[#3E3430] sm:text-2xl">
        {hasSearch ? "No Matching Orders" : "Your Order History Is Empty"}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#8B7A6C]">
        {hasSearch
          ? "No delivered orders match your search or selected filters. Try changing your search."
          : "Your successfully delivered orders will appear here. Once an order reaches you, you can revisit its details and order the same products again."}
      </p>

      <Link
        to="/"
        className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#B5697A] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#A55F70]"
      >
        <ShoppingBag className="h-4 w-4" />
        Explore Products
      </Link>
    </section>
  );
}

// ─── Error State ──────────────────────────────────────────
function HistoryErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <section className="mt-8 rounded-3xl border border-red-100 bg-white px-5 py-12 text-center sm:px-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <RefreshCw className="h-6 w-6" />
      </div>

      <h2 className="mt-5 text-xl font-semibold text-[#3E3430]">
        Unable to Load Order History
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#8B7A6C]">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#B5697A] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#A55F70]"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </section>
  );
}

// ─── Order Again Result ───────────────────────────────────
interface ReorderResult {
  type: "success" | "warning" | "error";
  message: string;
}

// ─── Completed Order Card ─────────────────────────────────
function CompletedOrderCard({
  order,
}: {
  order: Order;
}) {
  const navigate = useNavigate();

  const addToCart = useCartStore((state) => state.addToCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const [isReordering, setIsReordering] = useState(false);
  const [reorderResult, setReorderResult] =
    useState<ReorderResult | null>(null);

  const totalItems = order.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // ─── Reorder Handler ────────────────────────────────────
  const handleOrderAgain = async () => {
    if (isReordering) return;

    if (order.items.length === 0) {
      setReorderResult({
        type: "error",
        message: "No products are available to reorder from this order.",
      });
      return;
    }

    setIsReordering(true);
    setReorderResult(null);

    let addedCount = 0;
    let unavailableCount = 0;

    try {
      // Fetch current product details rather than relying on
      // potentially outdated product snapshots in the order.
      const results = await Promise.all(
        order.items.map(async (item: OrderItem) => {
          try {
            const product = await getProductById(item.productId);

            const variant = product.variants.find(
              (candidate) => candidate.id === item.variantId
            );

            if (!product.isActive || !variant) {
              return {
                item,
                product: null,
                variant: null,
              };
            }

            return {
              item,
              product,
              variant,
            };
          } catch {
            // The product may have been removed or deactivated.
            return {
              item,
              product: null,
              variant: null,
            };
          }
        })
      );

      // Do not alter the current cart until we know at least one item
      // from this delivered order can be reordered.
      const availableItems = results.filter(
        (result) => result.product && result.variant
      );
      unavailableCount = results.reduce(
        (count, result) =>
          count + (!result.product || !result.variant ? result.item.quantity : 0),
        0
      );
      addedCount = availableItems.reduce(
        (count, result) => count + result.item.quantity,
        0
      );

      if (availableItems.length === 0) {
        setReorderResult({
          type: "error",
          message:
            "Unfortunately, none of the products in this order are currently available. Please explore our latest products.",
        });
        return;
      }

      // Replace the existing cart so checkout contains only the products
      // from the selected delivered order, not unrelated cart items.
      clearCart();

      for (const result of availableItems) {
        addToCart(
          result.product!,
          result.variant!,
          result.item.quantity
        );
      }

      // Navigate directly to checkout. The optional notice can be displayed
      // there if the checkout page chooses to read location.state.
      navigate("/checkout", {
        state: unavailableCount > 0
          ? {
              reorderNotice: `${addedCount} item(s) are ready for checkout. ${unavailableCount} item(s) were unavailable and could not be reordered.`,
            }
          : {
              reorderNotice: "Your previous order is ready for checkout.",
            },
      });
    } catch (error) {
      console.error("Failed to reorder:", error);

      setReorderResult({
        type: "error",
        message:
          "Something went wrong while adding these products. Please try again.",
      });
    } finally {
      setIsReordering(false);
    }
  };

  const resultStyles: Record<ReorderResult["type"], string> = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    error: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-[#EFE3D2] bg-white shadow-sm transition-all duration-300 hover:border-[#DDB0BB] hover:shadow-md">
      {/* Order Header */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#A39890]">
              Order Number
            </p>

            <h3 className="mt-1 break-all text-base font-semibold text-[#3E3430] sm:text-lg">
              {order.orderNumber}
            </h3>

            <p className="mt-2 flex items-center gap-2 text-[11px] text-[#8B7A6C] sm:text-xs">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" />
              Ordered on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-medium text-emerald-700">
              <PackageCheck className="h-3.5 w-3.5" />
              Delivered
            </span>

            <HistoryStatusBadge status={order.paymentStatus} />
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="border-y border-[#EFE3D2] bg-[#FFFBFA] px-5 py-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-0">
          <div className="border-r border-[#EFE3D2] pr-3 sm:pr-5">
            <p className="text-[10px] uppercase tracking-wider text-[#A39890]">
              Total Items
            </p>

            <p className="mt-1.5 text-sm font-semibold text-[#5E5148]">
              {totalItems} {totalItems === 1 ? "Item" : "Items"}
            </p>
          </div>

          <div className="sm:border-r sm:border-[#EFE3D2] sm:px-5">
            <p className="text-[10px] uppercase tracking-wider text-[#A39890]">
              Order Total
            </p>

            <p className="mt-1.5 text-sm font-semibold text-[#B5697A]">
              {formatCurrency(order.totalAmount)}
            </p>
          </div>

          <div className="col-span-2 mt-1 border-t border-[#EFE3D2] pt-3 sm:col-span-1 sm:mt-0 sm:border-0 sm:pl-5 sm:pt-0">
            <p className="text-[10px] uppercase tracking-wider text-[#A39890]">
              Delivery Location
            </p>

            <p className="mt-1.5 break-words text-xs font-medium text-[#5E5148]">
              {[order.area, order.city].filter(Boolean).join(", ") ||
                "Address unavailable"}
            </p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="px-5 py-5 sm:px-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold text-[#3E3430]">
            Items in this order
          </h4>

          <span className="text-[10px] text-[#8B7A6C]">
            {order.items.length}{" "}
            {order.items.length === 1 ? "product" : "products"}
          </span>
        </div>

        {order.items.length > 0 ? (
          <div className="divide-y divide-[#F0E7DF]">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF1F2] text-[#B5697A]">
                    <ShoppingBag className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="break-words text-xs font-medium text-[#3E3430] sm:text-sm">
                      {item.productName}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] leading-5 text-[#8B7A6C] sm:text-xs">
                      <span>
                        {item.variantQuantity} {item.variantUnit}
                      </span>

                      <span aria-hidden="true">•</span>

                      <span>{formatLabel(item.packaging)}</span>

                      <span aria-hidden="true">•</span>

                      <span>Qty: {item.quantity}</span>
                    </div>

                    <p className="mt-1 text-[10px] text-[#A39890]">
                      {formatCurrency(item.unitPrice)} per unit
                    </p>
                  </div>
                </div>

                <p className="shrink-0 text-xs font-semibold tabular-nums text-[#5E5148] sm:text-sm">
                  {formatCurrency(item.subtotal)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#8B7A6C]">
            Product details are unavailable for this order.
          </p>
        )}
      </div>

      {/* Delivery Address */}
      <div className="mx-5 border-t border-[#F0E7DF] py-4 sm:mx-6">
        <p className="text-[10px] font-medium uppercase tracking-wider text-[#A39890]">
          Delivered To
        </p>

        <p className="mt-1.5 break-words text-xs leading-5 text-[#5E5148]">
          {[
            order.addressLine1,
            order.addressLine2,
            order.area,
            order.city,
            order.state,
            order.pincode,
          ]
            .filter(Boolean)
            .join(", ") || "Delivery address unavailable"}
        </p>
      </div>

      {/* Order Again Feedback */}
      {reorderResult && (
        <div
          role="status"
          aria-live="polite"
          className={`mx-5 mb-4 rounded-xl border px-4 py-3 text-xs leading-5 sm:mx-6 ${resultStyles[reorderResult.type]}`}
        >
          {reorderResult.message}

          {reorderResult.type === "error" && (
            <Link
              to="/"
              className="ml-1 font-semibold underline underline-offset-2"
            >
              Explore Products
            </Link>
          )}
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex flex-col gap-3 border-t border-[#EFE3D2] bg-white px-5 py-4 sm:px-6">
        <p className="text-[11px] text-[#8B7A6C]">
          Order placed on {formatDateTime(order.createdAt)}
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleOrderAgain}
            disabled={isReordering || order.items.length === 0}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#B5697A] px-5 py-3 text-xs font-medium text-white shadow-sm transition hover:bg-[#A55F70] focus:outline-none focus:ring-2 focus:ring-[#B5697A] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isReordering ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Preparing Checkout...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Order Again
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/orders/${order.id}`)}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#EADFD3] bg-white px-5 py-3 text-xs font-medium text-[#8B542F] transition hover:border-[#B5697A] hover:text-[#B5697A] focus:outline-none focus:ring-2 focus:ring-[#B5697A] focus:ring-offset-2 sm:w-auto"
          >
            View Order Details
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Main Page ────────────────────────────────────────────
function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [paymentFilter, setPaymentFilter] = useState<HistoryFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  // ─── Fetch Orders ───────────────────────────────────────
  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getMyOrders();

      setOrders(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to load order history:", err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  // ─── Delivered Orders Only ──────────────────────────────
  const deliveredOrders = useMemo(
    () => orders.filter((order) => order.deliveryStatus === "DELIVERED"),
    [orders]
  );

  // ─── Summary ────────────────────────────────────────────
  const summary = useMemo(
    () =>
      deliveredOrders.reduce(
        (result, order) => {
          result.totalItems += order.items.reduce(
            (total, item) => total + item.quantity,
            0
          );

          result.totalSpent += Number(order.totalAmount) || 0;

          return result;
        },
        { totalItems: 0, totalSpent: 0 }
      ),
    [deliveredOrders]
  );

  // ─── Search, Filter and Sort ────────────────────────────
  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return deliveredOrders
      .filter((order) => {
        if (
          paymentFilter !== "ALL" &&
          order.paymentStatus !== paymentFilter
        ) {
          return false;
        }

        if (!query) return true;

        return (
          order.orderNumber.toLowerCase().includes(query) ||
          order.items.some((item) =>
            item.productName.toLowerCase().includes(query)
          )
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        return sortBy === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [deliveredOrders, search, paymentFilter, sortBy]);

  // ─── Pagination ─────────────────────────────────────────
  const totalPages = Math.ceil(
    filteredOrders.length / ORDERS_PER_PAGE
  );

  useEffect(() => {
    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    } else if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ORDERS_PER_PAGE;

    return filteredOrders.slice(start, start + ORDERS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page++) {
        pages.push(page);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 3) pages.push("...");

    for (
      let page = Math.max(2, currentPage - 1);
      page <= Math.min(totalPages - 1, currentPage + 1);
      page++
    ) {
      pages.push(page);
    }

    if (currentPage < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setSearch("");
    setPaymentFilter("ALL");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search.trim().length > 0 || paymentFilter !== "ALL";

  // ─── Render ─────────────────────────────────────────────
  return (
    <main className="min-h-[calc(100vh-76px)] bg-[#FFFBFC] px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8 lg:pt-32">
      <div className="mx-auto w-full max-w-6xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs text-[#8B7A6C]"
        >
          <Link to="/" className="transition hover:text-[#B5697A]">
            Home
          </Link>

          <ChevronRight className="h-3.5 w-3.5" />

          <span className="font-medium text-[#B5697A]">
            Order History
          </span>
        </nav>

        {/* Page Header */}
        <header className="rounded-3xl border border-[#EFE3D2] bg-gradient-to-r from-[#FFF1F2] via-[#FFF8F7] to-[#FFFAF5] p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#EADFD3] bg-white/80 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#9F6674]">
                <PackageCheck className="h-3.5 w-3.5" />
                Your completed deliveries
              </span>

              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[#3E3430] sm:text-3xl lg:text-4xl">
                Order History
              </h1>

              <p className="mt-3 max-w-xl text-xs leading-6 text-[#8B7A6C] sm:text-sm">
                Revisit delivered orders, check your previous purchases
                and reorder your favourite products in just a few clicks.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:items-end">
              <Link
                to="/orders"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#EADFD3] bg-white px-5 py-2.5 text-xs font-medium text-[#8B542F] transition hover:border-[#B5697A] hover:text-[#B5697A]"
              >
                <ArrowLeft className="h-4 w-4" />
                My Orders
              </Link>

              <Link
                to="/"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#B5697A] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#A55F70]"
              >
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </header>

        {isLoading && <HistoryLoadingState />}

        {!isLoading && error && (
          <HistoryErrorState
            message={error}
            onRetry={() => void loadOrders()}
          />
        )}

        {!isLoading && !error && (
          <>
            {/* Summary Cards */}
            <section
              aria-label="Order history summary"
              className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              <SummaryCard
                title="Completed Orders"
                value={String(deliveredOrders.length)}
                description="Successfully delivered orders"
                icon={<PackageCheck className="h-5 w-5" />}
              />

              <SummaryCard
                title="Total Items"
                value={String(summary.totalItems)}
                description="Items across your delivered orders"
                icon={<ShoppingBag className="h-5 w-5" />}
              />

              <SummaryCard
                title="Total Order Value"
                value={formatCurrency(summary.totalSpent)}
                description="Combined value of delivered orders"
                icon={<Wallet className="h-5 w-5" />}
              />
            </section>

            {/* Search and Filters */}
            <section className="mt-8 rounded-2xl border border-[#EFE3D2] bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-base font-semibold text-[#3E3430]">
                    Your Delivered Orders
                  </h2>

                  <p className="mt-1 text-[11px] text-[#8B7A6C] sm:text-xs">
                    {filteredOrders.length}{" "}
                    {filteredOrders.length === 1 ? "order" : "orders"} found
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_190px_190px]">
                  <label className="relative block">
                    <span className="sr-only">
                      Search by order number or product
                    </span>

                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A39890]" />

                    <input
                      type="search"
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search order number or product..."
                      className="h-11 w-full rounded-xl border border-[#EADFD3] bg-white pl-10 pr-4 text-xs text-[#3E3430] outline-none transition placeholder:text-[#B3A69C] focus:border-[#B5697A] focus:ring-2 focus:ring-[#B5697A]/10"
                    />
                  </label>

                  <label className="relative block">
                    <span className="sr-only">
                      Filter by payment status
                    </span>

                    <Wallet className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A39890]" />

                    <select
                      value={paymentFilter}
                      onChange={(event) => {
                        setPaymentFilter(
                          event.target.value as HistoryFilter
                        );
                        setCurrentPage(1);
                      }}
                      className="h-11 w-full appearance-none rounded-xl border border-[#EADFD3] bg-white pl-10 pr-4 text-xs text-[#5E5148] outline-none transition focus:border-[#B5697A] focus:ring-2 focus:ring-[#B5697A]/10"
                    >
                      <option value="ALL">All payment statuses</option>
                      <option value="PAID">Paid orders</option>
                      <option value="REFUNDED">Refunded orders</option>
                    </select>
                  </label>

                  <label className="relative block">
                    <span className="sr-only">Sort orders</span>

                    <ArrowDownUp className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A39890]" />

                    <select
                      value={sortBy}
                      onChange={(event) => {
                        setSortBy(event.target.value as SortOption);
                        setCurrentPage(1);
                      }}
                      className="h-11 w-full appearance-none rounded-xl border border-[#EADFD3] bg-white pl-10 pr-4 text-xs text-[#5E5148] outline-none transition focus:border-[#B5697A] focus:ring-2 focus:ring-[#B5697A]/10"
                    >
                      <option value="newest">Newest first</option>
                      <option value="oldest">Oldest first</option>
                    </select>
                  </label>
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="self-start text-xs font-medium text-[#B5697A] underline underline-offset-4 transition hover:text-[#8B542F]"
                  >
                    Clear search and filters
                  </button>
                )}
              </div>
            </section>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
              <HistoryEmptyState
                hasSearch={
                  hasActiveFilters || deliveredOrders.length > 0
                }
              />
            )}

            {/* Order List */}
            {filteredOrders.length > 0 && (
              <>
                <section
                  aria-label="Delivered order list"
                  className="mt-5 space-y-5"
                >
                  {paginatedOrders.map((order) => (
                    <CompletedOrderCard
                      key={order.id}
                      order={order}
                    />
                  ))}
                </section>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav
                    aria-label="Order history pagination"
                    className="mt-8 flex flex-wrap items-center justify-center gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EADFD3] bg-white text-[#A98B6F] transition hover:border-[#B5697A] hover:text-[#B5697A] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {pageNumbers.map((page, index) =>
                      page === "..." ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="flex h-10 w-8 items-center justify-center text-sm text-[#A98B6F]"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          type="button"
                          onClick={() => goToPage(page)}
                          aria-label={`Go to page ${page}`}
                          aria-current={
                            currentPage === page ? "page" : undefined
                          }
                          className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xs font-medium transition ${
                            currentPage === page
                              ? "border-[#B5697A] bg-[#B5697A] text-white shadow-sm"
                              : "border-[#EADFD3] bg-white text-[#5E5148] hover:border-[#B5697A] hover:text-[#B5697A]"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      type="button"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EADFD3] bg-white text-[#A98B6F] transition hover:border-[#B5697A] hover:text-[#B5697A] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </nav>
                )}

                <p className="mt-5 text-center text-[10px] text-[#A39890] sm:text-xs">
                  Showing {(currentPage - 1) * ORDERS_PER_PAGE + 1}–
                  {Math.min(
                    currentPage * ORDERS_PER_PAGE,
                    filteredOrders.length
                  )}{" "}
                  of {filteredOrders.length} delivered orders
                </p>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default OrderHistoryPage;