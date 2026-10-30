import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Package,
  ShoppingBag,
  UserRound,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Truck,
  ExternalLink,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getAdminCustomerById } from "../../../api/adminUsersApi";
import type {
  AdminCustomerDetails,
  AdminCustomerOrder,
} from "../../../components/admin/customers/types";
import type { DeliveryStatus } from "../../../components/admin/orders/types";

import CustomerVerificationBadge from "../../../components/admin/customers/CustomerVerificationBadge";
import StatusBadge from "../../../components/admin/dashoard/StatusBadge";
import { formatCustomerDate } from "../../../components/admin/customers/customerUtils";
import { getDeliveryStatusClass } from "../../../components/admin/orders/orderUtils";

// ─── Helpers ──────────────────────────────────────────────

const formatCurrency = (amount: number) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatOrderDate = (date: string) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDeliveryStatus = (status?: DeliveryStatus | null) => {
  if (!status) return "Pending";

  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const ORDERS_PER_PAGE = 5;

// ─── Types ────────────────────────────────────────────────

type CustomerOrderWithDelivery = AdminCustomerOrder & {
  deliveryStatus?: DeliveryStatus | null;
  deliveredAt?: string | null;
};

// ─── Sub-components ───────────────────────────────────────

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#F0E7DF] bg-[#fffbfc] p-4">
      <p className="text-[10px] uppercase tracking-[0.08em] text-slate-500">
        {label}
      </p>

      <p className="mt-0.5 truncate text-[13px] text-[#3D3834]">
        {value}
      </p>
    </div>
  );
}

type CustomerStatProps = {
  icon: React.ElementType;
  label: string;
  value: string | number;
  iconBg: string;
  iconColor: string;
};

function CustomerStat({
  icon: Icon,
  label,
  value,
  iconBg,
  iconColor,
}: CustomerStatProps) {
  return (
    <div className="rounded-xl border border-[#EFE3D2] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.05em] text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-[18px] font-semibold leading-none tracking-[-0.02em] text-gray-700 md:text-[24px]">
            {typeof value === "number"
              ? value.toLocaleString("en-IN")
              : value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}

function DeliveryStatusBadge({
  status,
}: {
  status?: DeliveryStatus | null;
}) {
  const normalizedStatus: DeliveryStatus = status || "PENDING";

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium sm:text-[11px] ${getDeliveryStatusClass(
        normalizedStatus
      )}`}
    >
      <Truck className="h-3 w-3 shrink-0" strokeWidth={1.8} />
      {formatDeliveryStatus(status)}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────

function CustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<AdminCustomerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ─── Fetch Customer ─────────────────────────────────────

  useEffect(() => {
    let mounted = true;

    const loadCustomer = async () => {
      const customerId = Number(id);

      if (!Number.isInteger(customerId) || customerId <= 0) {
        setPageError("Invalid customer ID.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setPageError("");

        const result = await getAdminCustomerById(customerId);

        if (mounted) {
          setCustomer(result);
          setCurrentPage(1);
        }
      } catch (error: any) {
        console.error("Failed to load customer details:", error);

        if (mounted) {
          setPageError(
            error?.response?.data?.message ||
              error?.message ||
              "Unable to load customer details right now."
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadCustomer();

    return () => {
      mounted = false;
    };
  }, [id]);

  // ─── Safe Default Stats ─────────────────────────────────

  const stats = customer?.stats ?? {
    totalOrders: 0,
    totalSpent: 0,
    paidOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalReviews: 0,
  };

  const orders = useMemo<CustomerOrderWithDelivery[]>(
    () => (customer?.orders ?? []) as CustomerOrderWithDelivery[],
    [customer]
  );

  const latestOrder = orders[0] ?? null;

  // ─── Pagination ─────────────────────────────────────────

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;

    return orders.slice(startIndex, startIndex + ORDERS_PER_PAGE);
  }, [orders, currentPage]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
  };

  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page++) {
        pages.push(page);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let page = start; page <= end; page++) {
        pages.push(page);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  // ─── Navigate to Order Details ──────────────────────────

  const openOrderDetails = (orderId: number) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const handleOrderRowKeyDown = (
    event: React.KeyboardEvent<HTMLTableRowElement>,
    orderId: number
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openOrderDetails(orderId);
    }
  };

  // ─── Loading State ──────────────────────────────────────

  if (isLoading) {
    return (
      <main className="min-h-full bg-white px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-[#EFE3D2] bg-white">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#EADBD0] border-t-[#B5697A]" />

              <p className="mt-4 text-sm font-medium text-[#7B6D63]">
                Loading customer details...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── Error State ────────────────────────────────────────

  if (pageError || !customer) {
    return (
      <main className="min-h-full bg-white px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 text-[12px] text-[#A85F70] transition hover:text-[#8F4E60]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
            Back to Customers
          </Link>

          <div className="mt-6 rounded-2xl border border-[#E8C8CE] bg-white p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FBECEF] text-[#A85F70]">
              !
            </div>

            <h2 className="mt-5 text-xl font-semibold text-[#3D3834]">
              Unable to Load Customer
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#A85F70]">
              {pageError || "Customer could not be found."}
            </p>

            <Link
              to="/admin/users"
              className="mt-6 inline-flex items-center rounded-xl bg-[#B5697A] px-5 py-2.5 text-sm text-white transition hover:bg-[#A45D6F]"
            >
              Back to Customers
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ─── Main Render ────────────────────────────────────────

  return (
    <main className="min-h-full bg-white px-5 py-3 sm:px-8 lg:px-10 lg:py-6">
      <div className="mx-auto max-w-7xl">
        {/* Back */}
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 text-[13px] text-[#A85F70] transition hover:text-[#8F4E60] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
          Back to Customers
        </Link>

        {/* Customer Header */}
        <section className="mt-3 rounded-xl border border-[#EFE3D2] bg-white p-5 shadow-sm sm:p-6 lg:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#FBECEF] text-[#B5697A]">
                <UserRound className="h-6 w-6" strokeWidth={1.7} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-[18px] font-semibold tracking-[-0.02em] text-[#1F4A2E] sm:text-[24px]">
                    {customer.name || "Unnamed Customer"}
                  </h1>

                  <CustomerVerificationBadge isVerified={customer.isVerified} />
                </div>

                <p className="text-[11px] text-slate-500 md:text-[12px]">
                  Customer #{customer.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[12px] text-[#8B7A6C]">
              <CalendarDays
                className="h-4 w-4 text-[#B5697A]"
                strokeWidth={1.7}
              />
              Joined {formatCustomerDate(customer.createdAt)}
            </div>
          </div>
        </section>

        {/* Customer Information */}
        <section className="mt-5 rounded-xl border border-[#EFE3D2] bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-[14px] font-semibold text-gray-700 md:text-[16px]">
            Customer Information
          </h2>

          <div className="mt-2 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              label="Full Name"
              value={customer.name || "Unnamed Customer"}
            />
            <InfoItem label="Phone" value={customer.phone || "Not provided"} />
            <InfoItem label="Email" value={customer.email || "Not provided"} />
            <InfoItem
              label="Verification"
              value={customer.isVerified ? "Verified" : "Unverified"}
            />
            <InfoItem
              label="Joined"
              value={formatCustomerDate(customer.createdAt)}
            />
            <InfoItem
              label="Last Updated"
              value={formatCustomerDate(customer.updatedAt)}
            />
          </div>
        </section>

        {/* Customer Statistics */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <CustomerStat
            icon={ShoppingBag}
            label="Total Orders"
            value={stats.totalOrders}
            iconBg="bg-[#FBECEF]"
            iconColor="text-[#B5697A]"
          />

          <CustomerStat
            icon={CreditCard}
            label="Total Spent"
            value={formatCurrency(stats.totalSpent)}
            iconBg="bg-[#EEF8F2]"
            iconColor="text-[#3F8A58]"
          />

          <CustomerStat
            icon={CheckCircle2}
            label="Paid Orders"
            value={stats.paidOrders}
            iconBg="bg-[#EEF5FF]"
            iconColor="text-[#4D7FEA]"
          />

          <CustomerStat
            icon={Clock3}
            label="Pending Orders"
            value={stats.pendingOrders}
            iconBg="bg-[#FFF3E8]"
            iconColor="text-[#C4773B]"
          />

          <CustomerStat
            icon={Package}
            label="Processing"
            value={stats.processingOrders}
            iconBg="bg-[#F4F0FF]"
            iconColor="text-[#8062C7]"
          />

          <CustomerStat
            icon={CheckCircle2}
            label="Completed"
            value={stats.completedOrders}
            iconBg="bg-[#EEF8F2]"
            iconColor="text-[#3F8A58]"
          />

          <CustomerStat
            icon={XCircle}
            label="Cancelled"
            value={stats.cancelledOrders}
            iconBg="bg-[#FBECEF]"
            iconColor="text-[#A85F70]"
          />

          <CustomerStat
            icon={Package}
            label="Reviews"
            value={stats.totalReviews}
            iconBg="bg-[#FFF7E8]"
            iconColor="text-[#B27A2D]"
          />
        </section>

        {/* Latest Order */}
        {latestOrder && (
          <section className="mt-4 rounded-xl border border-[#EFE3D2] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[14px] font-semibold text-gray-700 md:text-[16px]">
                  Latest Order
                </h2>

                <p className="mt-0.5 text-[11px] text-gray-500 md:text-[12px]">
                  Most recent order placed by this customer.
                </p>
              </div>

              <button
                type="button"
                onClick={() => openOrderDetails(latestOrder.id)}
                className="inline-flex w-fit items-center gap-2 rounded-md bg-[#FBECEF] px-2.5 py-1 text-[10px] text-[#A85F70] transition hover:bg-[#F5DDE3] sm:text-[11px]"
                title="View order details"
              >
                {latestOrder.orderNumber}
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 xl:grid-cols-4">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-[#F0E7DF] bg-[#fffbfc] p-3.5 sm:p-4">
                <p className="text-[10px] uppercase tracking-[0.08em] text-slate-500">
                  Amount
                </p>

                <p className="text-[15px] font-semibold text-[#1F4A2E] sm:text-[16px]">
                  {formatCurrency(latestOrder.totalAmount)}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl border border-[#F0E7DF] bg-[#FFFCF8] p-3.5 sm:p-4">
                <p className="text-[10px] uppercase tracking-[0.08em] text-slate-500">
                  Payment
                </p>

                <StatusBadge status={latestOrder.paymentStatus} />
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl border border-[#F0E7DF] bg-[#FFFCF8] p-3.5 sm:p-4">
                <p className="text-[10px] uppercase tracking-[0.08em] text-slate-500">
                  Order Status
                </p>

                <StatusBadge status={latestOrder.orderStatus} />
              </div>

              <div className="flex flex-col items-start justify-center gap-2 rounded-xl border border-[#F0E7DF] bg-[#FFFCF8] p-3.5 sm:p-4">
                <p className="text-[10px] uppercase tracking-[0.08em] text-slate-500">
                  Delivery Status
                </p>

                <DeliveryStatusBadge status={latestOrder.deliveryStatus} />

                {latestOrder.deliveredAt && (
                  <p className="text-[10px] text-slate-500">
                    Delivered: {formatOrderDate(latestOrder.deliveredAt)}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => openOrderDetails(latestOrder.id)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#B5697A] px-4 py-2.5 text-[12px] font-medium text-white transition hover:bg-[#A45D6F]"
            >
              View Order Details
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </section>
        )}

        {/* Order History */}
        <section className="mt-6 overflow-hidden rounded-xl border border-[#EFE3D2] bg-white shadow-sm">
          <div className="border-b border-[#EFE3D2] px-5 py-3 sm:px-6">
            <h2 className="text-[14px] font-semibold text-gray-700 md:text-[16px]">
              Order History
            </h2>

            <p className="text-[11px] text-gray-500 md:text-[12px]">
              All orders placed by this customer. Click an order to view its
              details.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center px-6 py-12 text-center">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FBECEF] text-[#B5697A]">
                  <ShoppingBag className="h-5 w-5" strokeWidth={1.7} />
                </div>

                <p className="mt-4 text-xs text-gray-600 md:text-sm">
                  No orders yet
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  This customer has not placed any orders.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full min-w-[1150px]">
                  <thead>
                    <tr className="border-b border-[#B5697A] bg-[#B5697A]">
                      {[
                        "Order",
                        "Items",
                        "Amount",
                        "Payment",
                        "Order Status",
                        "Delivery Status",
                        "Date",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-[0.08em] text-white md:text-[11px]"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedOrders.map((order) => (
                      <tr
                        key={order.id}
                        role="link"
                        tabIndex={0}
                        aria-label={`View order ${order.orderNumber}`}
                        onClick={() => openOrderDetails(order.id)}
                        onKeyDown={(event) =>
                          handleOrderRowKeyDown(event, order.id)
                        }
                        className="cursor-pointer border-b border-[#F1E9E1] transition-colors last:border-0 hover:bg-[#FFFBF8] focus:bg-[#FFFBF8] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#B5697A]"
                      >
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#FBECEF] px-2.5 py-1 text-[10px] text-[#A85F70]">
                            {order.orderNumber}
                            <ExternalLink className="h-3 w-3" />
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-[12px] text-gray-600 md:text-[13px]">
                            {order.items.length}{" "}
                            {order.items.length === 1 ? "item" : "items"}
                          </p>

                          <p className="mt-1 max-w-[220px] truncate text-[11px] text-gray-500">
                            {order.items
                              .map((item) => item.productName)
                              .join(", ") || "No items"}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-[12px] text-gray-600 md:text-[13px]">
                          {formatCurrency(order.totalAmount)}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={order.paymentStatus} />
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={order.orderStatus} />
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-col items-start gap-1.5">
                            <DeliveryStatusBadge status={order.deliveryStatus} />

                            {order.deliveredAt && (
                              <span className="whitespace-nowrap text-[10px] text-slate-500">
                                {formatOrderDate(order.deliveredAt)}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-[12px] text-gray-500">
                          {formatOrderDate(order.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Order Cards */}
              <div className="block divide-y divide-[#F1E9E1] sm:hidden">
                {paginatedOrders.map((order) => (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => openOrderDetails(order.id)}
                    className="block w-full space-y-3 p-4 text-left transition-colors hover:bg-[#FFFBF8] focus:bg-[#FFFBF8] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#B5697A]"
                    aria-label={`View order ${order.orderNumber}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#FBECEF] px-2.5 py-1 text-[10px] font-medium text-[#A85F70]">
                        {order.orderNumber}
                        <ExternalLink className="h-3 w-3" />
                      </span>

                      <span className="text-[11px] text-gray-500">
                        {formatOrderDate(order.createdAt)}
                      </span>
                    </div>

                    <div>
                      <p className="text-[12px] text-gray-600">
                        <span className="font-medium text-gray-700">
                          {order.items.length}
                        </span>{" "}
                        {order.items.length === 1 ? "item" : "items"}
                      </p>

                      <p className="mt-0.5 line-clamp-2 text-[11px] text-gray-500">
                        {order.items
                          .map((item) => item.productName)
                          .join(", ") || "No items"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="mr-auto text-[13px] font-semibold text-gray-700">
                        {formatCurrency(order.totalAmount)}
                      </span>

                      <StatusBadge status={order.paymentStatus} />
                      <StatusBadge status={order.orderStatus} />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#F1E9E1] pt-3">
                      <span className="text-[10px] uppercase tracking-[0.08em] text-slate-500">
                        Delivery Status
                      </span>

                      <DeliveryStatusBadge status={order.deliveryStatus} />
                    </div>

                    {order.deliveredAt && (
                      <p className="text-[10px] text-slate-500">
                        Delivered on {formatOrderDate(order.deliveredAt)}
                      </p>
                    )}

                    <p className="flex items-center gap-1 text-[11px] font-medium text-[#A85F70]">
                      View order details
                      <ExternalLink className="h-3 w-3" />
                    </p>
                  </button>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center justify-between gap-4 border-t border-[#F1E9E1] bg-white px-4 py-4 sm:flex-row sm:px-6">
                  <p className="text-[11px] text-gray-500 sm:text-[12px]">
                    Showing{" "}
                    <span className="font-semibold text-gray-700">
                      {(currentPage - 1) * ORDERS_PER_PAGE + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-gray-700">
                      {Math.min(
                        currentPage * ORDERS_PER_PAGE,
                        orders.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-700">
                      {orders.length}
                    </span>{" "}
                    orders
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#EADFD3] bg-white text-[#B5697A] transition-colors hover:border-[#B5697A] hover:bg-[#FBEEF1] focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9"
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
                          className={`inline-flex h-8 min-w-[32px] items-center justify-center rounded-lg border px-2 text-[12px] transition-all duration-200 focus:outline-none sm:h-9 sm:min-w-[36px] ${
                            page === currentPage
                              ? "border-[#B5697A] bg-[#B5697A] text-white shadow-sm"
                              : "border-[#EADFD3] bg-white text-[#6F6259] hover:border-[#B5697A] hover:text-[#B5697A]"
                          }`}
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
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#EADFD3] bg-white text-[#B5697A] transition-colors hover:border-[#B5697A] hover:bg-[#FBEEF1] focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9"
                    >
                      <ChevronRight size={16} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default CustomerDetailsPage;