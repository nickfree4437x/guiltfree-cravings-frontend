// src/components/admin/dashboard/DashboardStats.tsx

import type { AdminDashboardStats } from "../../../api/adminDashboardApi";

import StatCard from "./StatCard";

interface DashboardStatsProps {
  stats: AdminDashboardStats;
}

function DashboardStats({
  stats,
}: DashboardStatsProps) {
  return (
    <section
      aria-label="Dashboard statistics"
      className="w-full"
    >
      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {/* =====================================================
            TOTAL PRODUCTS
        ===================================================== */}

        <StatCard
          label="Total Products"
          value={stats.totalProducts}
          icon="products"
        />

        {/* =====================================================
            TOTAL ORDERS
        ===================================================== */}

        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          icon="orders"
        />

        {/* =====================================================
            PENDING ORDERS
        ===================================================== */}

        <StatCard
          label="Pending Orders"
          value={stats.pendingOrders}
          icon="pending-orders"
        />

        {/* =====================================================
            TOTAL CUSTOMERS
        ===================================================== */}

        <StatCard
          label="Total Customers"
          value={stats.totalCustomers}
          icon="customers"
        />
      </div>
    </section>
  );
}

export default DashboardStats;