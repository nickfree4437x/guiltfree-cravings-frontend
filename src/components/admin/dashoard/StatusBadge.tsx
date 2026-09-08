// src/components/admin/dashboard/StatusBadge.tsx

interface StatusBadgeProps {
  status: string;
}

function StatusBadge({
  status,
}: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  let className =
    "bg-slate-100 text-slate-700";

  if (
    normalized === "PAID" ||
    normalized === "COMPLETED" ||
    normalized === "CONFIRMED"
  ) {
    className =
      "bg-green-50 text-green-700";
  }

  if (
    normalized === "PENDING" ||
    normalized === "PROCESSING"
  ) {
    className =
      "bg-amber-50 text-amber-700";
  }

  if (
    normalized === "FAILED" ||
    normalized === "CANCELLED"
  ) {
    className =
      "bg-red-50 text-red-700";
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs ${className}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;