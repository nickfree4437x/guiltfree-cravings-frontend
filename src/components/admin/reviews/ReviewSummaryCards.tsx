import {
  CheckCircle2,
  Loader2,
  MessageSquareText,
  XCircle,
} from "lucide-react";

import type { ReviewSummary } from "./types";

interface ReviewSummaryCardsProps {
  summary: ReviewSummary;
}

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  accent: string;
}

function ReviewSummaryCards({
  summary,
}: ReviewSummaryCardsProps) {
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Total Reviews"
        value={summary.total}
        icon={
          <MessageSquareText
            className="h-5 w-5"
            strokeWidth={1.8}
          />
        }
        iconBg="bg-[#FBECEF]"
        iconColor="text-[#B5697A]"
        accent="bg-[#D99AA9]"
      />

      <SummaryCard
        label="Pending"
        value={summary.pending}
        icon={
          <Loader2
            className="h-5 w-5"
            strokeWidth={1.8}
          />
        }
        iconBg="bg-[#FFF3E8]"
        iconColor="text-[#C4773B]"
        accent="bg-[#E2AD7C]"
      />

      <SummaryCard
        label="Verified"
        value={summary.verified}
        icon={
          <CheckCircle2
            className="h-5 w-5"
            strokeWidth={1.8}
          />
        }
        iconBg="bg-[#EEF8F2]"
        iconColor="text-[#3F8A58]"
        accent="bg-[#91C5A0]"
      />

      <SummaryCard
        label="Rejected"
        value={summary.rejected}
        icon={
          <XCircle
            className="h-5 w-5"
            strokeWidth={1.8}
          />
        }
        iconBg="bg-[#FBECEF]"
        iconColor="text-[#C45D6D]"
        accent="bg-[#D994A0]"
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
}: SummaryCardProps) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-xl
        border
        border-[#EFE3D2]
        bg-white
        p-5
        shadow-sm
        transition-all
      "
    >

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[12px] text-[#7B6D63]">
            {label}
          </p>

          <p className="mt-3 text-[28px] font-bold leading-none tracking-[-0.02em] text-[#1F2937]">
            {value.toLocaleString("en-IN")}
          </p>
        </div>

        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-2xl
            ${iconBg}
            ${iconColor}
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default ReviewSummaryCards;