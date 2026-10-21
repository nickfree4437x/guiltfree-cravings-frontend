import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Mail,
  Package,
  Phone,
  ShoppingBag,
  UserRound,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { getAdminCustomerById } from "../../../api/adminUsersApi";
import type {
  AdminCustomerDetails,
  AdminCustomerOrder,
} from "../../../components/admin/customers/types";
import CustomerVerificationBadge from "../../../components/admin/customers/CustomerVerificationBadge";
import StatusBadge from "../../../components/admin/dashoard/StatusBadge";
import { formatCustomerDate } from "../../../components/admin/customers/customerUtils";

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatOrderDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const ORDERS_PER_PAGE = 5;

function CustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [customer, setCustomer] =
    useState<AdminCustomerDetails | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

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
          setCurrentPage(1); // Reset page on new customer load
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

  // Safe defaults prevent TypeScript errors when stats are missing.
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

  const latestOrder = useMemo<AdminCustomerOrder | null>(
    () => customer?.orders?.[0] || null,
    [customer]
  );

  // Pagination Logic for Orders
  const orders = customer?.orders || [];
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

  if (pageError || !customer) {
    return (
      <main className="min-h-full bg-white px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 text-[13px] text-[#A85F70] transition hover:text-[#8F4E60]"
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

  return (
    <main className="min-h-full bg-white px-5 py-3 sm:px-8 lg:px-10 lg:py-6">
      <div className="mx-auto max-w-7xl">
        {/* BACK */}
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 text-[13px] text-[#A85F70] transition hover:text-[#8F4E60] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
          Back to Customers
        </Link>

        {/* HEADER */}
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

                  <CustomerVerificationBadge
                    isVerified={customer.isVerified}
                  />
                </div>

                <p className="mt-0 text-[11px] md:text-[12px] text-slate-500">
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

        {/* CUSTOMER INFORMATION */}
        <section className="mt-5 rounded-xl border border-[#EFE3D2] bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-[14px] md:text-[16px] font-semibold text-gray-700">
            Customer Information
          </h2>

          <div className="mt-2 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              icon={UserRound}
              label="Full Name"
              value={customer.name || "Unnamed Customer"}
            />

            <InfoItem
              icon={Phone}
              label="Phone"
              value={customer.phone}
            />

            <InfoItem
              icon={Mail}
              label="Email"
              value={customer.email || "Not provided"}
            />

            <InfoItem
              icon={CheckCircle2}
              label="Verification"
              value={customer.isVerified ? "Verified" : "Unverified"}
            />

            <InfoItem
              icon={CalendarDays}
              label="Joined"
              value={formatCustomerDate(customer.createdAt)}
            />

            <InfoItem
              icon={Clock3}
              label="Last Updated"
              value={formatCustomerDate(customer.updatedAt)}
            />
          </div>
        </section>

        {/* CUSTOMER STATISTICS */}
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

        {/* LATEST ORDER */}
        {latestOrder && (
  <section className="mt-4 rounded-xl border border-[#EFE3D2] bg-white p-4 shadow-sm sm:p-5">
    {/* Header */}
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-[14px] md:text-[16px] font-semibold text-gray-700">
          Latest Order
        </h2>
        <p className="mt-0.5 text-[11px] md:text-[12px] text-gray-500">
          Most recent order placed by this customer.
        </p>
      </div>

      <span className="inline-flex w-fit items-center rounded-md bg-[#FBECEF] px-2.5 py-1 text-[11px] font-medium text-[#A85F70] sm:text-[12px]">
        {latestOrder.orderNumber}
      </span>
    </div>

    {/* Stats Grid */}
    <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-3 sm:gap-4">
      {/* AMOUNT */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-[#F0E7DF] bg-[#fffbfc] p-3.5 sm:p-4">
        <p className="text-[10px] uppercase tracking-[0.08em] text-[#9A8D82]">
          Amount
        </p>
        <p className="text-[15px] font-semibold text-[#1F4A2E] sm:text-[16px]">
          {formatCurrency(latestOrder.totalAmount)}
        </p>
      </div>

      {/* PAYMENT */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-[#F0E7DF] bg-[#FFFCF8] p-3.5 sm:p-4">
        <p className="text-[10px] uppercase tracking-[0.08em] text-[#9A8D82]">
          Payment
        </p>
        <div className="shrink-0">
          <StatusBadge status={latestOrder.paymentStatus} />
        </div>
      </div>

      {/* ORDER STATUS */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-[#F0E7DF] bg-[#FFFCF8] p-3.5 sm:p-4">
        <p className="text-[10px] uppercase tracking-[0.08em] text-[#9A8D82]">
          Status
        </p>
        <div className="shrink-0">
          <StatusBadge status={latestOrder.orderStatus} />
        </div>
      </div>
    </div>
  </section>
)}

        {/* ORDER HISTORY WITH PAGINATION */}
        <section className="mt-6 overflow-hidden rounded-xl border border-[#EFE3D2] bg-white shadow-sm">
          <div className="border-b border-[#EFE3D2] px-5 py-3 sm:px-6">
            <h2 className="text-[14px] md:text-[16px] font-semibold text-gray-700">
              Order History
            </h2>

            <p className="text-[11px] md:text-[12px] text-gray-500">
              All orders placed by this customer.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center px-6 py-12 text-center">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FBECEF] text-[#B5697A]">
                  <ShoppingBag
                    className="h-5 w-5"
                    strokeWidth={1.7}
                  />
                </div>

                <p className="mt-4 text-xs md:text-sm text-ray-600">
                  No orders yet
                </p>

                <p className="mt-1 text-xs text-[#9A8D82]">
                  This customer has not placed any orders.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-[#B5697A] bg-[#B5697A]">
                      <th className="px-6 py-2.5 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
                        Order
                      </th>

                      <th className="px-6 py-2.5 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
                        Items
                      </th>

                      <th className="px-6 py-2.5 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
                        Amount
                      </th>

                      <th className="px-6 py-2.5 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
                        Payment
                      </th>

                      <th className="px-6 py-2.5 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
                        Status
                      </th>

                      <th className="px-6 py-2.5 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-[#F1E9E1] last:border-0 hover:bg-[#FFFBF8]"
                      >
                        <td className="px-6 py-4">
                          <span className="rounded-lg bg-[#FBECEF] px-2.5 py-1 text-[9px] md:text-[10px] text-[#A85F70]">
                            {order.orderNumber}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div>
                            <p className="text-[12px] md:text-[13px] text-gray-600">
                              {order.items.length}{" "}
                              {order.items.length === 1 ? "item" : "items"}
                            </p>

                            <p className="mt-1 max-w-[260px] truncate text-[11px] text-gray-500">
                              {order.items
                                .map((item) => item.productName)
                                .join(", ") || "No items"}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-[12px] md:text-[13px] text-gray-500">
                          {formatCurrency(order.totalAmount)}
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge status={order.paymentStatus} />
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge status={order.orderStatus} />
                        </td>

                        <td className="px-6 py-4 text-[12px] text-gray-500">
                          {formatOrderDate(order.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#F1E9E1] bg-white px-4 py-4 sm:px-6">
                  {/* Showing Info */}
                  <p className="text-[11px] sm:text-[12px] text-gray-500">
                    Showing{" "}
                    <span className="font-semibold text-gray-700">
                      {(currentPage - 1) * ORDERS_PER_PAGE + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-gray-700">
                      {Math.min(currentPage * ORDERS_PER_PAGE, orders.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-700">
                      {orders.length}
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
                        inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center
                        rounded-lg border border-[#EADFD3] bg-white
                        text-[#B5697A]
                        hover:border-[#B5697A] hover:bg-[#FBEEF1]
                        focus:outline-none
                        disabled:cursor-not-allowed disabled:opacity-40
                        disabled:hover:border-[#EADFD3] disabled:hover:bg-white
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
                            className="flex h-8 w-6 sm:h-9 sm:w-8 items-center justify-center text-[12px] text-gray-400"
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
                            inline-flex h-8 min-w-[32px] sm:h-9 sm:min-w-[36px]
                            items-center justify-center rounded-lg border px-2
                            text-[12px]
                            focus:outline-none
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
                        inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center
                        rounded-lg border border-[#EADFD3] bg-white
                        text-[#B5697A]
                        hover:border-[#B5697A] hover:bg-[#FBEEF1]
                        focus:outline-none
                        disabled:cursor-not-allowed disabled:opacity-40
                        disabled:hover:border-[#EADFD3] disabled:hover:bg-white
                      "
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

/* INFO ITEM */

interface InfoItemProps {
  icon: typeof UserRound;
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="rounded-xl border border-[#F0E7DF] bg-[#fffbfc] p-4">
      <div className="flex items-center gap-2">
        <p className="text-[10px] uppercase tracking-[0.08em] text-slate-500">
          {label}
        </p>
      </div>

      <p className="mt-0.5 truncate text-[13px] text-[#3D3834]">
        {value}
      </p>
    </div>
  );
}

/* CUSTOMER STAT */

interface CustomerStatProps {
  icon: typeof ShoppingBag;
  label: string;
  value: string | number;
  iconBg: string;
  iconColor: string;
}

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
          <p className="text-[11px] uppercase tracking-[0.08em] text-slate-600">
            {label}
          </p>

          <p className="mt-2 text-[18px] md:text-[24px] font-semibold leading-none tracking-[-0.02em] text-gray-700">
            {typeof value === "number"
              ? value.toLocaleString("en-IN")
              : value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          <Icon
            className="h-[18px] w-[18px]"
            strokeWidth={1.8}
          />
        </div>
      </div>
    </div>
  );
}

export default CustomerDetailsPage;