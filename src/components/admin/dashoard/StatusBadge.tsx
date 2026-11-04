
interface StatusBadgeProps {
  status?: string | null;
}

const statusStyles: Record<string, string> = {
  // New Order Lifecycle
  NEW: "border border-[#EFD5BD] bg-[#FFF3E8] text-[#C4773B]",
  CONFIRMED: "border border-[#CFE0F5] bg-[#EFF6FF] text-[#3972B5]",
  PACKED: "border border-[#DDD2F2] bg-[#F5F0FC] text-[#7954A6]",
  SHIPPED: "border border-[#C9E8EF] bg-[#EFFAFF] text-[#27839A]",
  DELIVERED: "border border-[#CFE4D4] bg-[#EEF8F2] text-[#3F8A58]",
  CANCELLED: "border border-[#E8C8CE] bg-[#FBECEF] text-[#A85F70]",
  RETURNED: "border border-[#E8C8CE] bg-[#FFF0F1] text-[#B44F63]",

  // Legacy Order Statuses
  PENDING: "border border-[#EFD5BD] bg-[#FFF3E8] text-[#C4773B]",
  PROCESSING: "border border-[#DDD2F2] bg-[#F5F0FC] text-[#7954A6]",
  COMPLETED: "border border-[#CFE4D4] bg-[#EEF8F2] text-[#3F8A58]",

  // Payment Statuses
  PAID: "border border-[#CFE4D4] bg-[#EEF8F2] text-[#3F8A58]",
  FAILED: "border border-[#E8C8CE] bg-[#FBECEF] text-[#A85F70]",
  REFUNDED: "border border-[#DDD2F2] bg-[#F5F0FC] text-[#7954A6]",
};

const statusLabels: Record<string, string> = {
  NEW: "New",
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
  PENDING: "Pending",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

const DEFAULT_STYLE =
  "border border-[#E8E1D9] bg-[#F7F4F1] text-[#6F6259]";

function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status?.trim().toUpperCase() || "PENDING";

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-[10px] font-medium tracking-[0.01em] ${
        statusStyles[normalized] || DEFAULT_STYLE
      }`}
    >
      {statusLabels[normalized] || normalized.replace(/_/g, " ")}
    </span>
  );
}

export default StatusBadge;
