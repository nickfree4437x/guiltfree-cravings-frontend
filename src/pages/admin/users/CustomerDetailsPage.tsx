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

function CustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [customer, setCustomer] =
    useState<AdminCustomerDetails | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");

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
                  <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[#1F4A2E] sm:text-[25px]">
                    {customer.name || "Unnamed Customer"}
                  </h1>

                  <CustomerVerificationBadge
                    isVerified={customer.isVerified}
                  />
                </div>

                <p className="mt-1 text-[12px] text-[#9A8D82]">
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
          <h2 className="text-[17px] font-semibold text-[#1F4A2E]">
            Customer Information
          </h2>

          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[17px] font-semibold text-[#1F4A2E]">
                  Latest Order
                </h2>

                <p className="mt-0.5 text-[12px] text-[#8B7A6C]">
                  Most recent order placed by this customer.
                </p>
              </div>

              <span className="text-[12px] text-[#B5697A]">
                {latestOrder.orderNumber}
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-[#FFFCF8] p-4">
                <p className="text-[10px] uppercase tracking-[0.08em] text-[#9A8D82]">
                  Amount
                </p>

                <p className="mt-1.5 text-[16px] text-[#1F4A2E]">
                  {formatCurrency(latestOrder.totalAmount)}
                </p>
              </div>

              <div className="rounded-xl bg-[#FFFCF8] p-4">
                <p className="text-[10px] uppercase tracking-[0.08em] text-[#9A8D82]">
                  Payment
                </p>

                <div className="mt-2">
                  <StatusBadge status={latestOrder.paymentStatus} />
                </div>
              </div>

              <div className="rounded-xl bg-[#FFFCF8] p-4">
                <p className="text-[10px] uppercase tracking-[0.08em] text-[#9A8D82]">
                  Order Status
                </p>

                <div className="mt-2">
                  <StatusBadge status={latestOrder.orderStatus} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ORDER HISTORY */}
        <section className="mt-6 overflow-hidden rounded-xl border border-[#EFE3D2] bg-white shadow-sm">
          <div className="border-b border-[#EFE3D2] px-5 py-5 sm:px-6">
            <h2 className="text-[17px] font-semibold text-[#1F4A2E]">
              Order History
            </h2>

            <p className="text-[12px] text-[#8B7A6C]">
              All orders placed by this customer.
            </p>
          </div>

          {customer.orders.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center px-6 py-12 text-center">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FBECEF] text-[#B5697A]">
                  <ShoppingBag
                    className="h-5 w-5"
                    strokeWidth={1.7}
                  />
                </div>

                <p className="mt-4 text-sm font-semibold text-[#514840]">
                  No orders yet
                </p>

                <p className="mt-1 text-xs text-[#9A8D82]">
                  This customer has not placed any orders.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-[#B5697A] bg-[#B5697A]">
                    <th className="px-6 py-3 text-left text-[11px] uppercase tracking-[0.08em] text-white/80">
                      Order
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] uppercase tracking-[0.08em] text-white/80">
                      Items
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] uppercase tracking-[0.08em] text-white/80">
                      Amount
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] uppercase tracking-[0.08em] text-white/80">
                      Payment
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] uppercase tracking-[0.08em] text-white/80">
                      Status
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] uppercase tracking-[0.08em] text-white/80">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {customer.orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[#F1E9E1] last:border-0 hover:bg-[#FFFBF8]"
                    >
                      <td className="px-6 py-5">
                        <span className="rounded-lg bg-[#FBECEF] px-2.5 py-1 text-[11px] text-[#A85F70]">
                          {order.orderNumber}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div>
                          <p className="text-[13px] font-semibold text-[#3D3834]">
                            {order.items.length}{" "}
                            {order.items.length === 1 ? "item" : "items"}
                          </p>

                          <p className="mt-1 max-w-[260px] truncate text-[11px] text-[#9A8D82]">
                            {order.items
                              .map((item) => item.productName)
                              .join(", ") || "No items"}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-[14px] font-semibold text-[#1F4A2E]">
                        {formatCurrency(order.totalAmount)}
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge status={order.paymentStatus} />
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge status={order.orderStatus} />
                      </td>

                      <td className="px-6 py-5 text-[13px] text-[#766A61]">
                        {formatOrderDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="rounded-xl border border-[#F0E7DF] bg-[#FFFCF8] p-4">
      <div className="flex items-center gap-2">
        <Icon
          className="h-4 w-4 text-[#B5697A]"
          strokeWidth={1.7}
        />

        <p className="text-[10px] uppercase tracking-[0.08em] text-[#9A8D82]">
          {label}
        </p>
      </div>

      <p className="mt-2 truncate text-[13px] text-[#3D3834]">
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
          <p className="text-[11px] uppercase tracking-[0.08em] text-[#9A8D82]">
            {label}
          </p>

          <p className="mt-3 text-[25px] font-semibold leading-none tracking-[-0.02em] text-[#1F2937]">
            {typeof value === "number"
              ? value.toLocaleString("en-IN")
              : value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          <Icon
            className="h-[20px] w-[20px]"
            strokeWidth={1.8}
          />
        </div>
      </div>
    </div>
  );
}

export default CustomerDetailsPage;