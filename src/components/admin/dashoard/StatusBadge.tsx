interface StatusBadgeProps {
  status: string;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  let className =
    "border border-[#E8E1D9] bg-[#F7F4F1] text-[#6F6259]";

  if (
    normalized === "PAID" ||
    normalized === "COMPLETED" ||
    normalized === "CONFIRMED"
  ) {
    className =
      "border border-[#CFE4D4] bg-[#EEF8F2] text-[#3F8A58]";
  }

  if (
    normalized === "PENDING" ||
    normalized === "PROCESSING"
  ) {
    className =
      "border border-[#EFD5BD] bg-[#FFF3E8] text-[#C4773B]";
  }

  if (
    normalized === "FAILED" ||
    normalized === "CANCELLED"
  ) {
    className =
      "border border-[#E8C8CE] bg-[#FBECEF] text-[#A85F70]";
  }

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-[10px]
        tracking-[0.01em]
        ${className}
      `}
    >
      {status}
    </span>
  );
}

export default StatusBadge;