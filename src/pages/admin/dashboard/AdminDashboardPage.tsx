import { useEffect, useState } from "react";

import {
  getAdminDashboard,
  type AdminInfo,
  type AdminDashboardStats,
  type AdminRecentOrder,
  type AdminTopSellingProduct,
} from "../../../api/adminDashboardApi";

import DashboardStats from "../../../components/admin/dashoard/DashboardStats";
import QuickActions from "../../../components/admin/dashoard/QuickActions";
import RecentOrders from "../../../components/admin/dashoard/RecentOrders";
import TopSellingProducts from "../../../components/admin/dashoard/TopSellingProducts";
import SalesRevenueAnalytics from "../../../components/admin/dashoard/SalesRevenueAnalytics";

import { ShieldCheck, CircleCheck, CircleX } from "lucide-react";

// ─── Types ────────────────────────────────────────────────
interface DashboardData {
  adminInfo: AdminInfo | null;
  stats: AdminDashboardStats;
  recentOrders: AdminRecentOrder[];
  topSellingProducts: AdminTopSellingProduct[];
}

// ─── Component ────────────────────────────────────────────
function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError("");
        const result = await getAdminDashboard();
        if (mounted) setData(result);
      } catch (error: any) {
        console.error("Failed to load admin dashboard:", error);
        if (mounted) {
          setError(error?.response?.data?.message || error?.message || "Unable to load dashboard.");
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    void loadDashboard();
    return () => { mounted = false; };
  }, []);

  // ─── States ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <main className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex min-h-[400px] max-w-7xl items-center justify-center rounded-3xl border border-[#EAD9DC] bg-white">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#EAD9DC] border-t-[#824958]" />
            <p className="mt-4 text-sm font-medium text-[#76666A]">Loading dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-3xl border border-red-200 bg-white p-8 text-center sm:p-10">
          <h2 className="text-xl font-bold text-[#211A1C]">Unable to Load Dashboard</h2>
          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  if (!data) return null;

  const { adminInfo, stats, recentOrders, topSellingProducts } = data;

  const formattedDate = adminInfo?.createdAt
    ? new Date(adminInfo.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "Not available";

  // Admin details config
  const adminDetails = [
    { label: "Admin Name", value: adminInfo?.name },
    { label: "Email Address", value: adminInfo?.email },
    { label: "Account Created", value: formattedDate, fullWidth: true },
  ];

  // ─── Render ─────────────────────────────────────────────
  return (
    <main className="px-5 py-5 sm:px-8 sm:py-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-7">
        
        {/* Admin Information */}
        <section aria-labelledby="admin-information-heading" className="overflow-hidden rounded-2xl border border-[#EAD9DC] bg-white shadow-sm">
          {/* Header */}
          <div className="relative overflow-hidden border-b border-[#EAD9DC] bg-[#FFFBFC] px-5 py-4 sm:px-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#B5697A] text-white shadow-sm">
                  <ShieldCheck size={26} strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <h1 id="admin-information-heading" className="mt-1 text-[20px] font-semibold tracking-tight text-[#3B252C] sm:text-[24px]">
                    Admin Information
                  </h1>
                  <p className="mt-0 text-[10px] text-gray-500 md:text-[11px]">
                    Manage and view your account details
                  </p>
                </div>
              </div>

              {adminInfo && (
                <div className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[10px] md:text-[11px] ${
                  adminInfo.isActive
                    ? "border-[#C8E8D5] bg-[#EFFAF3] text-[#247447]"
                    : "border-[#F2CACA] bg-[#FFF1F1] text-[#B42318]"
                }`}>
                  {adminInfo.isActive ? <CircleCheck size={13} /> : <CircleX size={13} />}
                  {adminInfo.isActive ? "Active" : "Inactive"}
                </div>
              )}
            </div>
          </div>

          {/* Details Body */}
          {adminInfo ? (
            <div className="p-4 sm:p-6">
              <div className="mb-2">
                <h2 className="text-[12px] font-semibold text-gray-600 md:text-[14px]">Account Details</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {adminDetails.map((detail) => (
                  <div key={detail.label} className={`flex min-w-0 items-start gap-3.5 rounded-xl border border-[#F0E3E6] bg-[#FFFBFC] p-4 transition-colors ${detail.fullWidth ? "sm:col-span-2" : ""}`}>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-[11px] text-slate-500 md:text-[12px]">{detail.label}</p>
                      <p className="mt-1 break-words text-[12px] text-gray-600 md:text-[13px]">
                        {detail.value || "Not provided"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-6 sm:p-7">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5E5E9] text-[#824958]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[12px] md:text-[13px] font-semibold text-slate-600">Admin details unavailable</p>
                <p className="mt-1 text-[11px] md:text-[12px] text-slate-500">
                  We couldn't retrieve your account information. Please refresh the page or sign in again.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Dashboard Statistics */}
        <section aria-label="Dashboard statistics">
          <DashboardStats stats={stats} />
        </section>

        {/* Analytics & Actions */}
        <SalesRevenueAnalytics />
        <QuickActions />

        {/* Products & Orders */}
        <TopSellingProducts products={topSellingProducts} />
        <RecentOrders orders={recentOrders} />
      </div>
    </main>
  );
}

export default AdminDashboardPage;