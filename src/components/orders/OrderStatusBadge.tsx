import type { Order } from "../../api/orderApi";

interface OrderStatusBadgeProps {
  type: "order" | "payment";
  status: Order["orderStatus"] | Order["paymentStatus"];
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, " ");
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
    case "CONFIRMED":
      return "bg-[#EAF6ED] text-[#287A42] border-[#CDE8D3]";

    case "PROCESSING":
      return "bg-[#EAF2FF] text-[#285EA8] border-[#CDDEFA]";

    case "COMPLETED":
      return "bg-[#EAF6ED] text-[#287A42] border-[#CDE8D3]";

    case "CANCELLED":
      return "bg-[#FDECEC] text-[#B42318] border-[#F5CDCA]";

    case "PENDING":
    default:
      return "bg-[#FFF4DB] text-[#986515] border-[#F0DDAF]";
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
        md:text-[12px]
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