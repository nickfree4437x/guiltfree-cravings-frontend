
import { useEffect, useState } from "react";
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
} from "lucide-react";

import {
  getAdminOrderById,
} from "../../../api/adminOrderApi";

import type {
  AdminOrder,
} from "../../../components/admin/orders/types";

import {
  formatAmount,
  formatDate,
} from "../../../components/admin/orders/orderUtils";

import OrderStatusBadge from "../../../components/admin/orders/OrderStatusBadge";
import PaymentStatusBadge from "../../../components/admin/orders/PaymentStatusBadge";

function formatLabel(value?: string | null) {
  if (!value) return "Not available";

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDateTime(value?: string | null) {
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

function DetailSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#F1E9E1] bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-[#F1E9E1] bg-[#fffbfc] px-5 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FBECEF] text-[#B5697A]">
          {icon}
        </span>

        <h2 className="text-[14px] text-gray-700 sm:text-[16px]">
          {title}
        </h2>
      </div>

      <div className="p-5">{children}</div>
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
  return (
    <div className="min-w-0">
      <p className="text-[11px] md:text-[12px] text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-gray-600">
        {value === null || value === undefined || value === ""
          ? "Not available"
          : value}
      </p>
    </div>
  );
}

function AdminOrderDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      setLoading(true);
      setError("");

      const orderId = Number(id);

      if (!id || !Number.isSafeInteger(orderId) || orderId <= 0) {
        setError("Invalid order ID.");
        setLoading(false);
        return;
      }

      try {
        const data = await getAdminOrderById(orderId);

        if (active) {
          setOrder(data);
        }
      } catch (err: unknown) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load order details."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadOrder();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <RefreshCw className="h-5 w-5 animate-spin text-[#B5697A]" />
          Loading order details...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-3xl p-5 sm:p-8">
        <button
          type="button"
          onClick={() => navigate("/admin/orders")}
          className="mb-6 inline-flex items-center gap-2 text-sm hover:underline text-[#B5697A] hover:text-[#8E4658]"
        >
          <ArrowLeft size={17} />
          Back to Orders
        </button>

        <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
          <Package className="mx-auto mb-3 h-10 w-10 text-[#B5697A]" />
          <h1 className="text-lg font-semibold text-[#3D3834]">
            Unable to load order
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {error || "Order details were not found."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="mt-5 rounded-xl bg-[#B5697A] px-5 py-2.5 text-sm text-white hover:bg-[#A65B6D]"
          >
            Return to Orders
          </button>
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

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="mb-5 inline-flex items-center hover:underline gap-1 text-[11px] md:text-[12px] transition text-[#B5697A]"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </button>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>

              <h1 className="mt-0 break-all text-[18px] md:text-[26px] font-semibold text-gray-700">
                {order.orderNumber}
              </h1>

              <p className="mt-0 text-[11px] md:text-[12px] text-slate-500">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>

            
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[12px] text-gray-600 sm:text-[12px]">
                    Order Status:
                    </span>
                    <OrderStatusBadge status={order.orderStatus} />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[12px] text-gray-600 sm:text-[12px]">
                    Payment Status:
                    </span>
                    <PaymentStatusBadge status={order.paymentStatus} />
                </div>
            </div>

          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-[#F1E9E1] bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-[#FBECEF] p-3 text-[#B5697A]">
                <ShoppingBag size={20} />
              </span>
              <div>
                <p className="text-xs text-slate-500">Total Items</p>
                <p className="mt-1 text-lg font-semibold text-gray-600">
                  {items.reduce(
                    (total, item) => total + Number(item.quantity || 0),
                    0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#F1E9E1] bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-green-50 p-3 text-[#36764A]">
                <CreditCard size={20} />
              </span>
              <div>
                <p className="text-xs text-slate-500">Order Total</p>
                <p className="mt-1 text-lg font-semibold text-gray-600">
                  {formatAmount(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#F1E9E1] bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Truck size={20} />
              </span>
              <div>
                <p className="text-xs text-slate-500">Delivery Zone</p>
                <p className="mt-1 text-lg font-semibold text-gray-600">
                  {formatLabel(order.deliveryZone)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#F1E9E1] bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <CalendarDays size={20} />
              </span>
              <div>
                <p className="text-xs text-slate-500">Last Updated</p>
                <p className="mt-1 text-lg font-semibold text-gray-600">
                  {formatDate(order.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CUSTOMER + DELIVERY */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">

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

              <div>
                <p className="text-[11px] md:text-[12px] text-slate-500">Phone Number</p>
                <a
                  href={`tel:${order.customerPhone}`}
                  className="mt-1 inline-flex items-center gap-2 text-[12px] md:text-[13px] text-[#B5697A] hover:underline"
                >
                  {order.customerPhone || "Not available"}
                </a>
              </div>

              <div>
                <p className="text-[11px] md:text-[12px] text-slate-500">Email Address</p>
                {order.customerEmail ? (
                  <a
                    href={`mailto:${order.customerEmail}`}
                    className="mt-1 inline-flex items-start gap-2 break-all text-[12px] md:text-[13px] text-[#B5697A] hover:underline"
                  >
                    <Mail className="mt-0.5 shrink-0" size={14} />
                    {order.customerEmail}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-[#3D3834]">
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
              <p className="text-[11px] md:text-[12px] text-slate-500">Delivery Address</p>

              {address.length > 0 ? (
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-[#3D3834]">
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

              <DetailItem
                label="Delivery Status"
                value={formatLabel(order.deliveryStatus)}
              />

              <DetailItem
                label="Delivery Charge"
                value={formatAmount(order.deliveryCharge ?? 0)}
              />

              <DetailItem
                label="Delivery Charge Confirmed"
                value={
                  order.deliveryChargeConfirmed === undefined ||
                  order.deliveryChargeConfirmed === null
                    ? "Not available"
                    : order.deliveryChargeConfirmed
                      ? "Yes"
                      : "No"
                }
              />
            </div>
          </DetailSection>
        </div>

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
                    <th className="pb-3 pr-4 text-xs font-[400] uppercase tracking-wide text-gray-500">
                      Product
                    </th>
                    <th className="px-4 pb-3 text-xs font-[400] uppercase tracking-wide text-gray-500">
                      Variant
                    </th>
                    <th className="px-4 pb-3 text-xs font-[400] uppercase tracking-wide text-gray-500">
                      Packaging
                    </th>
                    <th className="px-4 pb-3 text-center text-xs font-[400] uppercase tracking-wide text-gray-500">
                      Qty
                    </th>
                    <th className="px-4 pb-3 text-right text-xs font-[400] uppercase tracking-wide text-gray-500">
                      Unit Price
                    </th>
                    <th className="pl-4 pb-3 text-right text-xs font-[400] uppercase tracking-wide text-gray-500">
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

                      <td className="pl-4 py-4 text-right text-sm font-semibold text-[#3D3834]">
                        {formatAmount(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DetailSection>

        {/* PRICE + ORDER INFO */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">

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
                <span className="text-gray-600">Delivery Charge</span>
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
                  <span className="font-semibold text-[#B5697A]">
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
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetailsPage;
