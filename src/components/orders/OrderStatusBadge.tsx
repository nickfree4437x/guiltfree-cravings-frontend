
import type { Order } from "../../api/orderApi";

interface OrderStatusBadgeProps {
  type: "order" | "payment";
  status: Order["orderStatus"] | Order["paymentStatus"];
}

function formatStatus(status: string) {
  const labels: Record<string, string> = {
    NEW: "New",
    CONFIRMED: "Confirmed",
    PACKED: "Packed",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
    RETURNED: "Returned",

    PENDING: "Pending (Legacy)",
    PROCESSING: "Processing (Legacy)",
    COMPLETED: "Completed (Legacy)",

    PAID: "Paid",
    FAILED: "Failed",
    REFUNDED: "Refunded",
  };

  return (
    labels[status] ||
    status
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

function getClasses(
  type: "order" | "payment",
  status: string
) {
  if (type === "payment") {
    switch (status) {
      case "PAID":
        return "bg-[#EAF6ED] text-[#287A42] border-[#CDE8D3]";

      case "FAILED":
        return "bg-[#FDECEC] text-[#B42318] border-[#F5CDCA]";

      case "REFUNDED":
        return "bg-[#F1ECFA] text-[#6941A5] border-[#DED2F3]";

      case "PENDING":
      default:
        return "bg-[#FFF4DB] text-[#986515] border-[#F0DDAF]";
    }
  }

  switch (status) {
    case "NEW":
      return "bg-[#FFF4DB] text-[#986515] border-[#F0DDAF]";

    case "CONFIRMED":
      return "bg-[#EAF2FF] text-[#285EA8] border-[#CDDEFA]";

    case "PACKED":
      return "bg-[#F1ECFA] text-[#6941A5] border-[#DED2F3]";

    case "SHIPPED":
      return "bg-[#E8F5FC] text-[#1876A5] border-[#C7E6F4]";

    case "DELIVERED":
      return "bg-[#EAF6ED] text-[#287A42] border-[#CDE8D3]";

    case "RETURNED":
      return "bg-[#FFF0F2] text-[#B4235A] border-[#F5CDD9]";

    case "CANCELLED":
      return "bg-[#FDECEC] text-[#B42318] border-[#F5CDCA]";

    // Legacy order statuses
    case "PENDING":
      return "bg-[#FFF4DB] text-[#986515] border-[#F0DDAF]";

    case "PROCESSING":
      return "bg-[#EAF2FF] text-[#285EA8] border-[#CDDEFA]";

    case "COMPLETED":
      return "bg-[#EAF6ED] text-[#287A42] border-[#CDE8D3]";

    default:
      return "bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]";
  }
}

function OrderStatusBadge({
  type,
  status,
}: OrderStatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-3
        py-1.5
        text-[10px]
        md:text-[11px]
        capitalize
        sm:text-[10px]
        ${getClasses(type, status)}
      `}
    >
      {type === "order" ? "Order" : "Payment"}:{" "}
      {formatStatus(status)}
    </span>
  );
}

export default OrderStatusBadge;
