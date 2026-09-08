// src/pages/admin/dashboard/AdminDashboardPage.tsx

import {
  useEffect,
  useState,
} from "react";

import {
  getAdminDashboard,
  type AdminDashboardStats,
  type AdminRecentOrder,
  type AdminTopSellingProduct,
} from "../../../api/adminDashboardApi";

import DashboardStats from "../../../components/admin/dashoard/DashboardStats";
import QuickActions from "../../../components/admin/dashoard/QuickActions";
import RecentOrders from "../../../components/admin/dashoard/RecentOrders";
import TopSellingProducts from "../../../components/admin/dashoard/TopSellingProducts";

interface DashboardData {
  stats: AdminDashboardStats;
  recentOrders: AdminRecentOrder[];
  topSellingProducts: AdminTopSellingProduct[];
}

function AdminDashboardPage() {
  const [data, setData] =
    useState<DashboardData | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * =========================================================
   * LOAD DASHBOARD
   * =========================================================
   */

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

  /*
   * =========================================================
   * LOADING STATE
   * =========================================================
   */

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

  /*
   * =========================================================
   * ERROR STATE
   * =========================================================
   */

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
              className="mt-6 rounded-full bg-[#8b542f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#744324]"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * NO DATA
   * =========================================================
   */

  if (!data) {
    return null;
  }

  const {
    stats,
    recentOrders,
    topSellingProducts,
  } = data;

  /*
   * =========================================================
   * DASHBOARD
   * =========================================================
   */

  return (
    <main className="px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="mt-8">
          <DashboardStats
            stats={stats}
          />
        </div>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <QuickActions />

        {/* =================================================
            TOP SELLING PRODUCTS
        ================================================= */}

        <TopSellingProducts
          products={topSellingProducts}
        />

        {/* =================================================
            RECENT ORDERS
        ================================================= */}

        <RecentOrders
          orders={recentOrders}
        />

      </div>
    </main>
  );
}

export default AdminDashboardPage;