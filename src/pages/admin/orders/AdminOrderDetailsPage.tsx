import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Package,
  UserRound,
  MapPin,
  CreditCard,
  CalendarDays,
  Tag,
  Clock,
  ShoppingBag,
  Truck,
  LoaderCircle,
  ChevronDown,
} from "lucide-react";

import {
  getAdminOrderById,
  updateAdminOrderStatus,
  updateAdminOrderDeliveryStatus,
} from "../../../api/adminOrderApi";

import type {
  AdminOrder,
  OrderStatus,
  DeliveryStatus,
} from "../../../components/admin/orders/types";

import {
  formatAmount,
  formatDate,
  getOrderStatusClass,
  getDeliveryStatusClass,
} from "../../../components/admin/orders/orderUtils";

import OrderStatusBadge from "../../../components/admin/orders/OrderStatusBadge";
import PaymentStatusBadge from "../../../components/admin/orders/PaymentStatusBadge";

/* =========================================================
 * ORDER STATUS OPTIONS
 * ========================================================= */

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

const LEGACY_ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
];

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

/* =========================================================
 * HELPERS
 * ========================================================= */

function formatLabel(value?: string | null): string {
  if (!value) return "Not available";
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDateTime(value?: string | null): string {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isLegacyOrderStatus(status: OrderStatus): boolean {
  return LEGACY_ORDER_STATUSES.includes(status);
}

/* =========================================================
 * DETAIL SECTION WRAPPER
 * ========================================================= */

function DetailSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#EADFD3] bg-white shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-[#F1E9E1] bg-[#FFFBFC] px-5 py-4">
        {icon && (
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FBECEF] text-[#B5697A]">
            {icon}
          </span>
        )}
        <h2 className="text-[15px] font-semibold text-gray-700">
          {title}
        </h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

/* =========================================================
 * DETAIL ITEM ROW
 * ========================================================= */

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  const displayValue =
    value === null || value === undefined || value === ""
      ? "Not available"
      : value;

  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wider text-slate-500 md:text-[11px]">
        {label}
      </p>
      <p className="mt-1 break-words text-[13px] leading-relaxed text-[#3D3834]">
        {displayValue}
      </p>
    </div>
  );
}

/* =========================================================
 * SUMMARY CARD
 * ========================================================= */

function SummaryCard({
  title,
  value,
  icon,
  iconClass,
  valueClass = "text-[#3D3834]",
}: {
  title: string;
  value: string;
  icon: ReactNode;
  iconClass: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-xl border border-[#EADFD3] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] tracking-wider text-slate-500">
            {title}
          </p>
          <p
            className={`mt-2 break-words text-base font-semibold sm:text-lg ${valueClass}`}
          >
            {value}
          </p>
        </div>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </span>
      </div>
    </div>
  );
}

/* =========================================================
 * MAIN PAGE
 * ========================================================= */

function AdminOrderDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingOrderStatus, setUpdatingOrderStatus] = useState(false);
  const [orderStatusError, setOrderStatusError] = useState("");
  const [orderStatusSuccess, setOrderStatusSuccess] = useState("");

  const [deliveryError, setDeliveryError] = useState("");
  const [deliverySuccess, setDeliverySuccess] = useState("");
  const [updatingDelivery, setUpdatingDelivery] = useState(false);

  const loadOrder = useCallback(async () => {
    const orderId = Number(id);

    if (!id || !Number.isSafeInteger(orderId) || orderId <= 0) {
      setError("Invalid order ID.");
      setOrder(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getAdminOrderById(orderId);
      setOrder(data);
    } catch (err: unknown) {
      setOrder(null);
      setError(
        err instanceof Error ? err.message : "Unable to load order details."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  const handleOrderStatusChange = async (newStatus: OrderStatus) => {
    if (!order || updatingOrderStatus) return;
    if (isLegacyOrderStatus(order.orderStatus)) return;
    if (newStatus === order.orderStatus) return;

    setUpdatingOrderStatus(true);
    setOrderStatusError("");
    setOrderStatusSuccess("");

    try {
      const updatedOrder = await updateAdminOrderStatus(order.id, newStatus);

      setOrder((current) =>
        current
          ? {
              ...current,
              orderStatus: updatedOrder.orderStatus,
              paymentStatus: updatedOrder.paymentStatus,
              deliveryStatus: updatedOrder.deliveryStatus,
              updatedAt: updatedOrder.updatedAt,
            }
          : current
      );

      setOrderStatusSuccess(
        `Order status updated to ${formatLabel(updatedOrder.orderStatus)}.`
      );
    } catch (err: unknown) {
      setOrderStatusError(
        err instanceof Error ? err.message : "Unable to update order status."
      );
    } finally {
      setUpdatingOrderStatus(false);
    }
  };

  const handleDeliveryStatusChange = async (newStatus: DeliveryStatus) => {
    if (!order || updatingDelivery) return;
    if (newStatus === (order.deliveryStatus ?? "PENDING")) return;

    setUpdatingDelivery(true);
    setDeliveryError("");
    setDeliverySuccess("");

    try {
      const updatedOrder = await updateAdminOrderDeliveryStatus(
        order.id,
        newStatus
      );

      setOrder((current) =>
        current
          ? {
              ...current,
              deliveryStatus: updatedOrder.deliveryStatus,
              deliveredAt: updatedOrder.deliveredAt,
              updatedAt: updatedOrder.updatedAt,
            }
          : current
      );

      setDeliverySuccess(
        `Delivery status updated to ${formatLabel(newStatus)}.`
      );
    } catch (err: unknown) {
      setDeliveryError(
        err instanceof Error ? err.message : "Unable to update delivery status."
      );
    } finally {
      setUpdatingDelivery(false);
    }
  };

  /* =======================================================
   * LOADING STATE
   * ======================================================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFEFD] px-4">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-sm">
          <LoaderCircle className="h-5 w-5 animate-spin text-[#B5697A]" />
          <span className="text-sm font-medium text-gray-700">
            Loading order details...
          </span>
        </div>
      </div>
    );
  }

  /* =======================================================
   * ERROR STATE
   * ======================================================= */

  if (error || !order) {
    return (
      <div className="mx-auto max-w-3xl bg-[#FFFEFD] p-6 sm:p-10">
        <button
          onClick={() => navigate("/admin/orders")}
          className="mb-6 inline-flex items-center gap-2 text-[11px] text-[#B5697A] hover:underline"
        >
          <ArrowLeft size={16} /> Back to Orders
        </button>

        <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <Package className="mx-auto mb-3 h-10 w-10 text-[#B5697A]" />
          <h1 className="text-lg font-semibold text-[#3D3834]">
            Unable to load order
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {error || "Order not found."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => void loadOrder()}
              className="rounded-xl border border-[#EADFD3] px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
   * DERIVED DATA
   * ======================================================= */

  const address = [
    order.addressLine1,
    order.addressLine2,
    order.area,
    order.city,
    order.state,
    order.pincode,
  ].filter((part) => Boolean(part?.trim()));

  const items = Array.isArray(order.items) ? order.items : [];
  const totalItems = items.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );
  const deliveryStatus: DeliveryStatus = order.deliveryStatus ?? "PENDING";
  const isLegacyStatus = isLegacyOrderStatus(order.orderStatus);

  /* =======================================================
   * RENDER
   * ======================================================= */

  return (
    <div className="min-h-screen bg-[#FFFEFD] pb-16">
      <div className="mx-auto max-w-7xl space-y-6 px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        {/* =====================================================
            HEADER
        ===================================================== */}
        <header className="rounded-xl border border-[#EADFD3] bg-white p-5 shadow-sm sm:p-6">
          <button
            onClick={() => navigate("/admin/orders")}
            className="mb-4 inline-flex items-center gap-2 text-[11px] text-[#B5697A] transition hover:text-[#8E4658] hover:underline md:text-[12px]"
          >
            <ArrowLeft size={15} /> Back to Orders
          </button>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#FBECEF] px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#A85F70]">
                  Order Details
                </span>
                <span className="text-xs text-slate-400">#{order.id}</span>
              </div>
              <h1 className="mt-2 text-lg font-semibold tracking-tight text-gray-700 md:text-xl">
                {order.orderNumber}
              </h1>
              <p className="mt-1 text-[11px] text-slate-500 md:text-[12px]">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:w-[450px]">
              {/* ─── ORDER STATUS BOX ─── */}
              <div className="rounded-xl border border-[#F1E9E1] bg-[#FFFBFC] p-3.5">
                <p className="mb-2 text-[10px] uppercase tracking-wider text-slate-500">
                  Order Status
                </p>
                {isLegacyStatus ? (
                  <OrderStatusBadge status={order.orderStatus} />
                ) : (
                  <div className="relative">
                    <select
                      value={order.orderStatus}
                      disabled={updatingOrderStatus}
                      onChange={(e) =>
                        void handleOrderStatusChange(
                          e.target.value as OrderStatus
                        )
                      }
                      className={`w-full appearance-none rounded-lg border py-2 pl-3 pr-8 text-xs outline-none disabled:opacity-60 ${getOrderStatusClass(
                        order.orderStatus
                      )}`}
                    >
                      {ORDER_STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {updatingOrderStatus ? (
                      <LoaderCircle className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin" />
                    ) : (
                      <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
                    )}
                  </div>
                )}

                {/* ✅ inline success / error for order status */}
                {orderStatusSuccess && (
                  <p className="mt-2 text-[11px] text-emerald-600">
                    ✓ {orderStatusSuccess}
                  </p>
                )}
                {orderStatusError && (
                  <p className="mt-2 text-[11px] text-red-500">
                    ✗ {orderStatusError}
                  </p>
                )}
              </div>

              {/* ─── PAYMENT STATUS BOX ─── */}
              <div className="rounded-xl border border-[#F1E9E1] bg-[#FFFBFC] p-3.5">
                <p className="mb-2 text-[10px] uppercase tracking-wider text-slate-500">
                  Payment Status
                </p>
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
            </div>
          </div>
        </header>

        {/* =====================================================
            SUMMARY CARDS
        ===================================================== */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Items"
            value={String(totalItems)}
            icon={<ShoppingBag size={16} />}
            iconClass="bg-[#FBECEF] text-[#B5697A]"
          />
          <SummaryCard
            title="Order Total"
            value={formatAmount(order.totalAmount)}
            icon={<CreditCard size={16} />}
            iconClass="bg-emerald-50 text-emerald-600"
            valueClass="text-emerald-700"
          />
          <SummaryCard
            title="Delivery Zone"
            value={formatLabel(order.deliveryZone)}
            icon={<Truck size={16} />}
            iconClass="bg-blue-50 text-blue-600"
          />
          <SummaryCard
            title="Last Updated"
            value={formatDate(order.updatedAt)}
            icon={<CalendarDays size={16} />}
            iconClass="bg-amber-50 text-amber-600"
          />
        </section>

        {/* =====================================================
            CUSTOMER & DELIVERY GRID
        ===================================================== */}
        <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          {/* CUSTOMER */}
          <DetailSection
            title="Customer Information"
            icon={<UserRound size={14} />}
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <DetailItem label="Full Name" value={order.customerName} />
              <DetailItem
                label="Customer ID"
                value={order.userId ?? "Guest"}
              />

              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-500">
                  Phone
                </p>
                {order.customerPhone ? (
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="mt-1 flex items-center gap-2 text-[11px] text-[#B5697A] hover:underline md:text-[12px]"
                  >
                    {order.customerPhone}
                  </a>
                ) : (
                  <p className="mt-1 text-[13px] text-gray-500">
                    Not provided
                  </p>
                )}
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-500">
                  Email
                </p>
                {order.customerEmail ? (
                  <a
                    href={`mailto:${order.customerEmail}`}
                    className="mt-1 flex items-center gap-2 break-all text-[11px] text-[#B5697A] hover:underline md:text-[12px]"
                  >
                    {order.customerEmail}
                  </a>
                ) : (
                  <p className="mt-1 text-[13px] text-gray-500">
                    Not provided
                  </p>
                )}
              </div>
            </div>
          </DetailSection>

          {/* DELIVERY */}
          <DetailSection
            title="Delivery Information"
            icon={<MapPin size={14} />}
          >
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-500">
                Address
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-[#3D3834] md:text-[12px]">
                {address.length > 0
                  ? address.join(", ")
                  : "Address not available"}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 border-t border-[#F1E9E1] pt-5 sm:grid-cols-2">
              <DetailItem
                label="Zone"
                value={formatLabel(order.deliveryZone)}
              />
              <DetailItem label="PIN Code" value={order.pincode} />

              <div className="sm:col-span-2">
                <p className="mb-2 text-[11px] uppercase tracking-wider text-slate-500">
                  Update Delivery Status
                </p>
                <div className="relative">
                  <select
                    value={deliveryStatus}
                    disabled={updatingDelivery}
                    onChange={(e) =>
                      void handleDeliveryStatusChange(
                        e.target.value as DeliveryStatus
                      )
                    }
                    className={`w-full appearance-none rounded-lg border py-2.5 pl-3 pr-10 text-xs outline-none disabled:opacity-60 ${getDeliveryStatusClass(
                      deliveryStatus
                    )}`}
                  >
                    {DELIVERY_STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {updatingDelivery ? (
                    <LoaderCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin" />
                  ) : (
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                  )}
                </div>
                {deliverySuccess && (
                  <p className="mt-2 text-[11px] text-emerald-600">
                    ✓ {deliverySuccess}
                  </p>
                )}
                {deliveryError && (
                  <p className="mt-2 text-[11px] text-red-500">
                    ✗ {deliveryError}
                  </p>
                )}
              </div>

              <DetailItem
                label="Delivered At"
                value={
                  deliveryStatus === "DELIVERED"
                    ? formatDateTime(order.deliveredAt)
                    : "Pending"
                }
              />
              <DetailItem
                label="Delivery Charge"
                value={formatAmount(order.deliveryCharge ?? 0)}
              />
            </div>
          </DetailSection>
        </section>

        {/* =====================================================
            ORDER ITEMS TABLE
        ===================================================== */}
        <DetailSection
          title={`Ordered Products (${items.length})`}
          icon={<Package size={14} />}
        >
          {items.length === 0 ? (
            <p className="py-5 text-center text-sm text-gray-500">
              No items found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#F1E9E1] text-left">
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Product
                    </th>
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Variant
                    </th>
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Packaging
                    </th>
                    <th className="pb-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Qty
                    </th>
                    <th className="pb-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Price
                    </th>
                    <th className="pb-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1E9E1]">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FFFBFC]">
                      <td className="py-3 pr-4">
                        <p className="text-[13px] font-semibold text-[#3D3834]">
                          {item.productName}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          ID: {item.productId}
                        </p>
                      </td>
                      <td className="py-3 text-[13px] text-gray-600">
                        {item.variantQuantity} {item.variantUnit}
                      </td>
                      <td className="py-3 text-[13px] text-gray-600">
                        {item.packaging || "N/A"}
                      </td>
                      <td className="py-3 text-center text-[13px] font-medium text-gray-700">
                        {item.quantity}
                      </td>
                      <td className="py-3 text-right text-[13px] text-gray-600">
                        {formatAmount(item.unitPrice)}
                      </td>
                      <td className="py-3 text-right text-[13px] font-bold text-[#3D3834]">
                        {formatAmount(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DetailSection>

        {/* =====================================================
            INFO & PRICE BREAKDOWN
        ===================================================== */}
        <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <DetailSection
            title="Order Information"
            icon={<Clock size={14} />}
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <DetailItem
                label="Order Status"
                value={formatLabel(order.orderStatus)}
              />
              <DetailItem
                label="Payment Status"
                value={formatLabel(order.paymentStatus)}
              />
              <DetailItem
                label="Created At"
                value={formatDateTime(order.createdAt)}
              />
              <DetailItem
                label="Updated At"
                value={formatDateTime(order.updatedAt)}
              />
            </div>
          </DetailSection>

          <DetailSection
            title="Price Breakdown"
            icon={<CreditCard size={14} />}
          >
            <div className="space-y-3">
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-[#3D3834]">
                  {formatAmount(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-emerald-600">
                  − {formatAmount(order.discountAmount)}
                </span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-600">Delivery Charge</span>
                <span className="font-medium text-[#3D3834]">
                  {formatAmount(order.deliveryCharge ?? 0)}
                </span>
              </div>

              {order.offerCode && (
                <div className="flex justify-between text-[13px]">
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <Tag size={14} /> Applied Offer
                  </span>
                  <span className="font-semibold text-[#B5697A]">
                    {order.offerCode}
                  </span>
                </div>
              )}

              <div className="mt-2 border-t border-dashed border-[#EADFD3] pt-3">
                <div className="flex justify-between">
                  <span className="text-sm font-bold text-[#3D3834]">
                    Final Total
                  </span>
                  <span className="text-lg font-bold text-emerald-700">
                    {formatAmount(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </DetailSection>
        </section>
      </div>
    </div>
  );
}

export default AdminOrderDetailsPage;