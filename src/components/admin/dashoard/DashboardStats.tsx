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
    <section aria-label="Dashboard statistics">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Products"
          value={stats.totalProducts}
          icon="products"
        />

        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          icon="orders"
        />

        <StatCard
          label="Pending Orders"
          value={stats.pendingOrders}
          icon="pending-orders"
        />

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