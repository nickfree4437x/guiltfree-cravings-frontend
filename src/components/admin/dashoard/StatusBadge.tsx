// ─── Types ────────────────────────────────────────────────
interface StatusBadgeProps {
  status: string;
}

// ─── Config ───────────────────────────────────────────────
const statusStyles: Record<string, string> = {
  PAID: "border border-[#CFE4D4] bg-[#EEF8F2] text-[#3F8A58]",
  COMPLETED: "border border-[#CFE4D4] bg-[#EEF8F2] text-[#3F8A58]",
  CONFIRMED: "border border-[#CFE4D4] bg-[#EEF8F2] text-[#3F8A58]",
  PENDING: "border border-[#EFD5BD] bg-[#FFF3E8] text-[#C4773B]",
  PROCESSING: "border border-[#EFD5BD] bg-[#FFF3E8] text-[#C4773B]",
  FAILED: "border border-[#E8C8CE] bg-[#FBECEF] text-[#A85F70]",
  CANCELLED: "border border-[#E8C8CE] bg-[#FBECEF] text-[#A85F70]",
};

const DEFAULT_STYLE = "border border-[#E8E1D9] bg-[#F7F4F1] text-[#6F6259]";

// ─── Component ────────────────────────────────────────────
function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toUpperCase();
  const styleClass = statusStyles[normalized] || DEFAULT_STYLE;

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] tracking-[0.01em] ${styleClass}`}>
      {status}
    </span>
  );
}

export default StatusBadge;