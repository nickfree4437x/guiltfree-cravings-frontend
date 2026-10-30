// src/components/admin/dashboard/StatCard.tsx

import {
  Activity,
  CheckCircle2,
  ClipboardList,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────
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

// ─── Config ───────────────────────────────────────────────
const cardConfig = {
  products: {
    icon: Package,
    iconBg: "bg-[#FBECEF]",
    iconColor: "text-[#B5697A]",
    accent: "bg-[#D99AA9]",
  },
  "active-products": {
    icon: Activity,
    iconBg: "bg-[#EEF7F0]",
    iconColor: "text-[#3E8052]",
    accent: "bg-[#8DBA98]",
  },
  orders: {
    icon: ShoppingBag,
    iconBg: "bg-[#EEF5FF]",
    iconColor: "text-[#4D7FEA]",
    accent: "bg-[#91B4F4]",
  },
  "pending-orders": {
    icon: ClipboardList,
    iconBg: "bg-[#FFF3E8]",
    iconColor: "text-[#C4773B]",
    accent: "bg-[#E2AD7C]",
  },
  customers: {
    icon: Users,
    iconBg: "bg-[#F4F0FF]",
    iconColor: "text-[#8062C7]",
    accent: "bg-[#B8A4E5]",
  },
  "paid-orders": {
    icon: CheckCircle2,
    iconBg: "bg-[#EEF8F2]",
    iconColor: "text-[#3F8A58]",
    accent: "bg-[#91C5A0]",
  },
} as const;

// ─── Component ────────────────────────────────────────────
function StatCard({ label, value, icon }: StatCardProps) {
  const config = cardConfig[icon];
  const Icon = config.icon;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-[#EFE3D2] bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        
        {/* Text */}
        <div className="min-w-0">
          <p className="text-[12px] tracking-[0.01em] text-slate-500">
            {label}
          </p>
          <p className="mt-3 text-[20px] font-semibold leading-none tracking-[-0.02em] text-gray-700 sm:text-[25px]">
            {value.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Icon */}
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${config.iconBg} ${config.iconColor}`}>
          <Icon className="h-[21px] w-[21px]" strokeWidth={1.8} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export default StatCard;