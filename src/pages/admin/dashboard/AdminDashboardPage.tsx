import {
  useEffect,
  useState,
} from "react";

import {
  getAdminDashboard,
  type AdminDashboardStats,
  type AdminRecentOrder,
} from "../../../api/adminDashboardApi";

interface DashboardData {
  stats: AdminDashboardStats;
  recentOrders: AdminRecentOrder[];
}

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

function AdminDashboardPage() {
  const [data, setData] =
    useState<DashboardData | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError("");

        const result =
          await getAdminDashboard();

        if (mounted) {
          setData(result);
        }
      } catch (error: any) {
        console.error(
          "Failed to load admin dashboard:",
          error
        );

        if (mounted) {
          setError(
            error?.response?.data?.message ||
              error?.message ||
              "Unable to load dashboard."
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <main className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-[#eadfd3] bg-white">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#eadfd3] border-t-[#8b542f]" />

              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading dashboard...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-red-200 bg-white p-10 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              Unable to Load Dashboard
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-6 rounded-full bg-[#8b542f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#744324]"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  const {
    stats,
    recentOrders,
  } = data;

  return (
    <main className="px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b542f]">
            Overview
          </span>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your store and monitor
            your latest activity.
          </p>
        </div>

        {/* STATS */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Total Products"
            value={stats.totalProducts}
          />

          <StatCard
            label="Active Products"
            value={stats.activeProducts}
          />

          <StatCard
            label="Total Orders"
            value={stats.totalOrders}
          />

          <StatCard
            label="Pending Orders"
            value={stats.pendingOrders}
          />

          <StatCard
            label="Total Customers"
            value={stats.totalCustomers}
          />

          <StatCard
            label="Paid Orders"
            value={stats.paidOrders}
          />
        </div>

        {/* RECENT ORDERS */}

        <section className="mt-8 overflow-hidden rounded-3xl border border-[#eadfd3] bg-white shadow-sm">
          <div className="border-b border-[#eadfd3] px-6 py-5 sm:px-7">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest orders placed by customers.
            </p>
          </div>

          {recentOrders.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm font-medium text-slate-500">
                No orders found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-[#eadfd3] bg-[#fffaf5] text-left">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Order
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Order Status
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map(
                    (order) => (
                      <tr
                        key={order.id}
                        className="border-b border-[#f1e9e1] last:border-0"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                          {order.orderNumber}
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-800">
                            {order.customerName}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {order.customerPhone}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                          {formatCurrency(
                            order.totalAmount
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge
                            status={
                              order.orderStatus
                            }
                          />
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge
                            status={
                              order.paymentStatus
                            }
                          />
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {formatDate(
                            order.createdAt
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/*
 * =========================================================
 * STAT CARD
 * =========================================================
 */

interface StatCardProps {
  label: string;
  value: number;
}

function StatCard({
  label,
  value,
}: StatCardProps) {
  return (
    <div className="rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
        {value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

/*
 * =========================================================
 * STATUS BADGE
 * =========================================================
 */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized =
    status.toUpperCase();

  let className =
    "bg-slate-100 text-slate-700";

  if (
    normalized === "PAID" ||
    normalized === "COMPLETED" ||
    normalized === "CONFIRMED"
  ) {
    className =
      "bg-green-50 text-green-700";
  }

  if (
    normalized === "PENDING" ||
    normalized === "PROCESSING"
  ) {
    className =
      "bg-amber-50 text-amber-700";
  }

  if (
    normalized === "FAILED" ||
    normalized === "CANCELLED"
  ) {
    className =
      "bg-red-50 text-red-700";
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${className}`}
    >
      {status}
    </span>
  );
}

export default AdminDashboardPage;