import type { ReactNode } from "react";
import {
  MessageSquareText,
  CircleAlert,
  Clock3,
  CheckCircle2,
  Check,
} from "lucide-react";
import type { AdminOrderIssueStats } from "./OrderIssueTypes";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  iconClass: string;
  loading: boolean;
}

function StatCard({ title, value, icon, iconClass, loading }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 py-6 shadow-sm transition-shadow sm:py-7">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] md:text-[12px] text-slate-500">{title}</p>
          {loading ? (
            <div className="mt-3 h-8 w-16 animate-pulse rounded-lg bg-gray-100" />
          ) : (
            <p className="mt-3 text-xl md:text-2xl font-semibold tracking-tight text-gray-700">
              {value.toLocaleString("en-IN")}
            </p>
          )}
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface OrderIssueStatsCardsProps {
  stats: AdminOrderIssueStats;
  loading: boolean;
}

export function OrderIssueStatsCards({ stats, loading }: OrderIssueStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
      <StatCard title="Total Issues" value={stats.total} icon={<MessageSquareText size={16} />} iconClass="bg-[#B5697A]/10 text-[#B5697A]" loading={loading} />
      <StatCard title="Open" value={stats.open} icon={<CircleAlert size={16} />} iconClass="bg-amber-50 text-amber-600" loading={loading} />
      <StatCard title="In Progress" value={stats.inProgress} icon={<Clock3 size={16} />} iconClass="bg-blue-50 text-blue-600" loading={loading} />
      <StatCard title="Resolved" value={stats.resolved} icon={<CheckCircle2 size={16} />} iconClass="bg-emerald-50 text-emerald-600" loading={loading} />
      <StatCard title="Closed" value={stats.closed} icon={<Check size={16} />} iconClass="bg-gray-100 text-gray-600" loading={loading} />
    </div>
  );
}