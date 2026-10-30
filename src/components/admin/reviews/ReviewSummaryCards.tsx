import { CheckCircle2, Loader2, MessageSquareText, XCircle } from "lucide-react";
import type { ReactNode } from "react";

import type { ReviewSummary } from "./types";

// ─── Types ────────────────────────────────────────────────
interface ReviewSummaryCardsProps {
  summary: ReviewSummary;
}

interface SummaryCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}

// ─── Config ───────────────────────────────────────────────
const CARD_DATA = [
  { key: "total", label: "Total Reviews", icon: MessageSquareText, iconBg: "bg-[#FBECEF]", iconColor: "text-[#B5697A]" },
  { key: "pending", label: "Pending", icon: Loader2, iconBg: "bg-[#FFF3E8]", iconColor: "text-[#C4773B]" },
  { key: "verified", label: "Verified", icon: CheckCircle2, iconBg: "bg-[#EEF8F2]", iconColor: "text-[#3F8A58]" },
  { key: "rejected", label: "Rejected", icon: XCircle, iconBg: "bg-[#FBECEF]", iconColor: "text-[#C45D6D]" },
] as const;

// ─── Summary Card ─────────────────────────────────────────
function SummaryCard({ label, value, icon, iconBg, iconColor }: SummaryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-[#EFE3D2] bg-white p-5 shadow-sm transition-all">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[12px] text-slate-500">{label}</p>
          <p className="mt-3 text-[24px] md:text-[28px] font-semibold leading-none tracking-[-0.02em] text-gray-700">
            {value.toLocaleString("en-IN")}
          </p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconBg} ${iconColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────
function ReviewSummaryCards({ summary }: ReviewSummaryCardsProps) {
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {CARD_DATA.map((card) => (
        <SummaryCard
          key={card.key}
          label={card.label}
          value={summary[card.key]}
          icon={<card.icon className="h-5 w-5" strokeWidth={1.8} />}
          iconBg={card.iconBg}
          iconColor={card.iconColor}
        />
      ))}
    </div>
  );
}

export default ReviewSummaryCards;