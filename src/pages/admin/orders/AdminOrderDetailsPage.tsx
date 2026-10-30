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
  Mail,
  Clock,
  ShoppingBag,
  Truck,
  RefreshCw,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Phone,
} from "lucide-react";

import {
  getAdminOrderById,
  updateAdminOrderDeliveryStatus,
} from "../../../api/adminOrderApi";

import type {
  AdminOrder,
  DeliveryStatus,
} from "../../../components/admin/orders/types";

import {
  formatAmount,
  formatDate,
  getDeliveryStatusClass,
} from "../../../components/admin/orders/orderUtils";

import OrderStatusBadge from "../../../components/admin/orders/OrderStatusBadge";
import PaymentStatusBadge from "../../../components/admin/orders/PaymentStatusBadge";

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

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DetailSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#F1E9E1] bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-[#F1E9E1] bg-[#FFFBFC] px-4 py-4 sm:px-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FBECEF] text-[#B5697A]">
          {icon}
        </span>

        <h2 className="text-sm font-semibold text-[#4B403B] sm:text-base">
          {title}
        </h2>
      </div>

      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

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
      <p className="text-[11px] text-slate-500 sm:text-xs">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium leading-relaxed text-[#5F554E]">
        {displayValue}
      </p>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  iconClass,
  valueClass = "text-[#4B403B]",
}: {
  title: string;
  value: string;
  icon: ReactNode;
  iconClass: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#F1E9E1] bg-white p-4 sm:p-5">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </span>

        <div className="min-w-0">
          <p className="text-xs text-slate-500">{title}</p>
          <p
            className={`mt-1 break-words text-base font-semibold sm:text-lg ${valueClass}`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function AdminOrderDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
        err instanceof Error
          ? err.message
          : "Unable to load order details."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let active = true;

    async function fetchOrder() {
      const orderId = Number(id);

      if (!id || !Number.isSafeInteger(orderId) || orderId <= 0) {
        if (active) {
          setError("Invalid order ID.");
          setOrder(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await getAdminOrderById(orderId);

        if (active) {
          setOrder(data);
        }
      } catch (err: unknown) {
        if (active) {
          setOrder(null);
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load order details."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void fetchOrder();

    return () => {
      active = false;
    };
  }, [id]);

  const handleDeliveryStatusChange = async (
    newStatus: DeliveryStatus
  ) => {
    if (!order || updatingDelivery) return;

    const previousStatus = order.deliveryStatus ?? "PENDING";

    if (newStatus === previousStatus) return;

    setUpdatingDelivery(true);
    setDeliveryError("");
    setDeliverySuccess("");

    try {
      const updatedOrder = await updateAdminOrderDeliveryStatus(
        order.id,
        newStatus
      );

      setOrder((currentOrder) => {
        if (!currentOrder) return currentOrder;

        return {
          ...currentOrder,
          deliveryStatus: updatedOrder.deliveryStatus,
          deliveredAt: updatedOrder.deliveredAt,
          updatedAt: updatedOrder.updatedAt,
        };
      });

      setDeliverySuccess(
        `Delivery status updated to ${formatLabel(newStatus)}.`
      );
    } catch (err: unknown) {
      setDeliveryError(
        err instanceof Error
          ? err.message
          : "Unable to update delivery status. Please try again."
      );
    } finally {
      setUpdatingDelivery(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-white px-4">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <RefreshCw className="h-5 w-5 animate-spin text-[#B5697A]" />
          Loading order details...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-3xl bg-white p-5 sm:p-8">
        <button
          type="button"
          onClick={() => navigate("/admin/orders")}
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#B5697A] transition hover:text-[#8E4658] hover:underline"
        >
          <ArrowLeft size={17} />
          Back to Orders
        </button>

        <div className="rounded-2xl border border-red-100 bg-white p-6 text-center sm:p-8">
          <Package className="mx-auto mb-3 h-10 w-10 text-[#B5697A]" />

          <h1 className="text-lg font-semibold text-[#3D3834]">
            Unable to load order
          </h1>

          <p className="mt-2 break-words text-sm text-gray-600">
            {error || "Order details were not found."}
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => void loadOrder()}
              className="inline-flex items-center gap-2 rounded-xl border border-[#EADFD3] px-4 py-2.5 text-sm text-[#6F6259] transition hover:bg-[#FFFBFC]"
            >
              <RefreshCw size={15} />
              Try Again
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/orders")}
              className="rounded-xl bg-[#B5697A] px-5 py-2.5 text-sm text-white transition hover:bg-[#A65B6D]"
            >
              Return to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

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

  const deliveryStatus: DeliveryStatus =
    order.deliveryStatus ?? "PENDING";

  return (
    <div className="min-h-screen bg-[#FFFEFD] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <header>
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="mb-5 inline-flex items-center gap-2 text-xs text-[#B5697A] transition hover:text-[#8E4658] hover:underline sm:text-sm"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </button>

          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-[#FBECEF] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#A85F70]">
                  Order Details
                </span>

                <span className="text-xs text-slate-400">
                  ID: {order.id}
                </span>
              </div>

              <h1 className="mt-3 break-words text-xl font-semibold text-[#3D3834] sm:text-2xl lg:text-3xl">
                {order.orderNumber}
              </h1>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:min-w-[400px]">
              <div className="rounded-xl border border-[#F1E9E1] bg-white p-3">
                <p className="mb-2 text-xs text-slate-500">
                  Order Status
                </p>
                <OrderStatusBadge status={order.orderStatus} />
              </div>

              <div className="rounded-xl border border-[#F1E9E1] bg-white p-3">
                <p className="mb-2 text-xs text-slate-500">
                  Payment Status
                </p>
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
            </div>
          </div>
        </header>

        {/* SUMMARY CARDS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Items"
            value={String(totalItems)}
            icon={<ShoppingBag size={20} />}
            iconClass="bg-[#FBECEF] text-[#B5697A]"
          />

          <SummaryCard
            title="Order Total"
            value={formatAmount(order.totalAmount)}
            icon={<CreditCard size={20} />}
            iconClass="bg-green-50 text-[#36764A]"
            valueClass="text-[#36764A]"
          />

          <SummaryCard
            title="Delivery Zone"
            value={formatLabel(order.deliveryZone)}
            icon={<Truck size={20} />}
            iconClass="bg-blue-50 text-blue-600"
          />

          <SummaryCard
            title="Last Updated"
            value={formatDate(order.updatedAt)}
            icon={<CalendarDays size={20} />}
            iconClass="bg-amber-50 text-amber-600"
          />
        </section>

        {/* CUSTOMER + DELIVERY */}
        <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <DetailSection
            title="Customer Information"
            icon={<UserRound size={19} />}
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <DetailItem
                label="Customer Name"
                value={order.customerName}
              />

              <DetailItem
                label="Customer ID"
                value={order.userId ?? "Guest / Not available"}
              />

              <div className="min-w-0">
                <p className="text-xs text-slate-500">
                  Phone Number
                </p>

                {order.customerPhone ? (
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="mt-1 inline-flex items-center gap-2 break-all text-sm text-[#B5697A] hover:underline"
                  >
                    <Phone size={14} className="shrink-0" />
                    {order.customerPhone}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">
                    Not available
                  </p>
                )}
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-500">
                  Email Address
                </p>

                {order.customerEmail ? (
                  <a
                    href={`mailto:${order.customerEmail}`}
                    className="mt-1 inline-flex items-start gap-2 break-all text-sm text-[#B5697A] hover:underline"
                  >
                    <Mail
                      className="mt-0.5 shrink-0"
                      size={14}
                    />
                    {order.customerEmail}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">
                    Not provided
                  </p>
                )}
              </div>
            </div>
          </DetailSection>

          <DetailSection
            title="Delivery Information"
            icon={<MapPin size={19} />}
          >
            <div>
              <p className="text-xs text-slate-500">
                Delivery Address
              </p>

              {address.length > 0 ? (
                <p className="mt-1 break-words text-sm leading-relaxed text-[#3D3834]">
                  {address.join(", ")}
                </p>
              ) : (
                <p className="mt-2 text-sm text-[#9A8D82]">
                  Address not available
                </p>
              )}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 border-t border-[#F1E9E1] pt-5 sm:grid-cols-2">
              <DetailItem
                label="Delivery Zone"
                value={formatLabel(order.deliveryZone)}
              />

              <DetailItem
                label="PIN Code"
                value={order.pincode}
              />

              <div className="min-w-0 sm:col-span-2">
                <label
                  htmlFor="delivery-status"
                  className="mb-2 block text-xs font-medium text-slate-500"
                >
                  Update Delivery Status
                </label>

                <div className="relative max-w-md">
                  <Truck
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#B5697A]"
                    aria-hidden="true"
                  />

                  <select
                    id="delivery-status"
                    value={deliveryStatus}
                    disabled={updatingDelivery}
                    onChange={(event) =>
                      void handleDeliveryStatusChange(
                        event.target.value as DeliveryStatus
                      )
                    }
                    className={`
                      w-full appearance-none rounded-xl border
                      py-3 pl-10 pr-10 text-sm font-medium
                      outline-none transition
                      focus:ring-2 focus:ring-[#B5697A]/20
                      disabled:cursor-wait disabled:opacity-60
                      ${getDeliveryStatusClass(deliveryStatus)}
                    `}
                  >
                    {DELIVERY_STATUS_OPTIONS.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {updatingDelivery ? (
                    <LoaderCircle
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-[#B5697A]"
                      aria-label="Updating delivery status"
                    />
                  ) : (
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-current"
                      aria-hidden="true"
                    />
                  )}
                </div>

                {updatingDelivery && (
                  <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <LoaderCircle
                      size={13}
                      className="animate-spin"
                    />
                    Saving delivery status...
                  </p>
                )}

                {deliverySuccess && (
                  <p
                    role="status"
                    className="mt-2 flex items-start gap-2 text-xs text-green-700"
                  >
                    <CheckCircle2
                      size={14}
                      className="mt-0.5 shrink-0"
                    />
                    {deliverySuccess}
                  </p>
                )}

                {deliveryError && (
                  <p
                    role="alert"
                    className="mt-2 flex items-start gap-2 text-xs text-red-600"
                  >
                    <AlertCircle
                      size={14}
                      className="mt-0.5 shrink-0"
                    />
                    {deliveryError}
                  </p>
                )}
              </div>

              <DetailItem
                label="Delivered At"
                value={
                  deliveryStatus === "DELIVERED"
                    ? formatDateTime(order.deliveredAt)
                    : "Not delivered yet"
                }
              />

              <DetailItem
                label="Delivery Charge"
                value={formatAmount(order.deliveryCharge ?? 0)}
              />

              <DetailItem
                label="Delivery Charge Confirmed"
                value={
                  order.deliveryChargeConfirmed == null
                    ? "Not available"
                    : order.deliveryChargeConfirmed
                      ? "Yes"
                      : "No"
                }
              />
            </div>
          </DetailSection>
        </section>

        {/* ORDER ITEMS */}
        <DetailSection
          title={`Ordered Products (${items.length})`}
          icon={<Package size={19} />}
        >
          {items.length === 0 ? (
            <p className="py-5 text-center text-sm text-slate-500">
              No product details available for this order.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-[#F1E9E1] text-left">
                    <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wide text-gray-500">
                      Product
                    </th>

                    <th className="px-4 pb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                      Variant
                    </th>

                    <th className="px-4 pb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                      Packaging
                    </th>

                    <th className="px-4 pb-3 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                      Qty
                    </th>

                    <th className="px-4 pb-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                      Unit Price
                    </th>

                    <th className="pb-3 pl-4 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                      Subtotal
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[#F7F0E9] last:border-0"
                    >
                      <td className="py-4 pr-4">
                        <p className="text-sm font-semibold text-[#3D3834]">
                          {item.productName}
                        </p>

                        <p className="mt-1 text-xs text-[#9A8D82]">
                          Product ID: {item.productId}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-sm text-[#5F554E]">
                        {item.variantQuantity} {item.variantUnit}
                      </td>

                      <td className="px-4 py-4 text-sm text-[#5F554E]">
                        {item.packaging || "Not specified"}
                      </td>

                      <td className="px-4 py-4 text-center text-sm font-medium text-[#3D3834]">
                        {item.quantity}
                      </td>

                      <td className="px-4 py-4 text-right text-sm text-[#5F554E]">
                        {formatAmount(item.unitPrice)}
                      </td>

                      <td className="py-4 pl-4 text-right text-sm font-semibold text-[#3D3834]">
                        {formatAmount(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DetailSection>

        {/* ORDER INFORMATION + PRICE BREAKDOWN */}
        <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <DetailSection
            title="Order & Payment Information"
            icon={<Clock size={19} />}
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <DetailItem
                label="Internal Order ID"
                value={order.id}
              />

              <DetailItem
                label="Order Number"
                value={order.orderNumber}
              />

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
                label="Last Updated At"
                value={formatDateTime(order.updatedAt)}
              />
            </div>
          </DetailSection>

          <DetailSection
            title="Price Breakdown"
            icon={<CreditCard size={19} />}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-gray-600">Subtotal</span>

                <span className="font-medium text-[#3D3834]">
                  {formatAmount(order.subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-gray-600">Discount</span>

                <span className="font-medium text-green-700">
                  − {formatAmount(order.discountAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-gray-600">
                  Delivery Charge
                </span>

                <span className="font-medium text-[#3D3834]">
                  {formatAmount(order.deliveryCharge ?? 0)}
                </span>
              </div>

              {(order.offerCode || order.offerId != null) && (
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="inline-flex items-center gap-2 text-gray-600">
                    <Tag size={15} />
                    Applied Offer
                  </span>

                  <span className="break-all text-right font-semibold text-[#B5697A]">
                    {order.offerCode || `Offer #${order.offerId}`}
                  </span>
                </div>
              )}

              <div className="border-t border-dashed border-[#EADFD3] pt-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-[#3D3834]">
                    Final Total
                  </span>

                  <span className="text-xl font-bold text-[#1F4A2E]">
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