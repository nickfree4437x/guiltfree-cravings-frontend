// src/components/admin/dashboard/StatCard.tsx

import {
  Activity,
  CheckCircle2,
  ClipboardList,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon:
    | "products"
    | "active-products"
    | "orders"
    | "pending-orders"
    | "customers"
    | "paid-orders";
}

const cardConfig = {
  products: {
    icon: Package,
    iconBg: "bg-[#f3e4d3]",
    iconColor: "text-[#8b542f]",
    accent: "bg-[#8b542f]",
    hover: "hover:border-[#d8bfa9]",
  },

  "active-products": {
    icon: Activity,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    accent: "bg-emerald-500",
    hover: "hover:border-emerald-200",
  },

  orders: {
    icon: ShoppingBag,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    accent: "bg-blue-500",
    hover: "hover:border-blue-200",
  },

  "pending-orders": {
    icon: ClipboardList,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    accent: "bg-amber-500",
    hover: "hover:border-amber-200",
  },

  customers: {
    icon: Users,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    accent: "bg-violet-500",
    hover: "hover:border-violet-200",
  },

  "paid-orders": {
    icon: CheckCircle2,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    accent: "bg-green-500",
    hover: "hover:border-green-200",
  },
} as const;

function StatCard({
  label,
  value,
  icon,
}: StatCardProps) {
  const config = cardConfig[icon];
  const Icon = config.icon;

  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-white p-5 shadow-sm transition-all duration-300 sm:p-6 ${config.hover}`}
    >
      {/* Top Accent */}
      <div
        className={`absolute left-0 top-0 w-full ${config.accent}`}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-4">
        {/* Content */}
        <div className="min-w-0">
          <p className="text-sm text-slate-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value.toLocaleString("en-IN")}
          </p>

        </div>

        {/* Icon */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${config.iconBg} ${config.iconColor} transition-transform duration-300`}
        >
          <Icon
            className="h-[21px] w-[21px]"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>
      </div>


    </div>
  );
}

export default StatCard;