import type { Order } from "../../api/orderApi";

interface OrderStatusBadgeProps {
  type: "order" | "payment";
  status: Order["orderStatus"] | Order["paymentStatus"];
}

function formatStatus(
  status: string
) {
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
        return "bg-[#F7F1E9] text-[#806A4F] border-[#E8DCCB]";

      case "FAILED":
        return "bg-[#FFF3F3] text-[#C86B6B] border-[#F0D9D9]";

      case "REFUNDED":
        return "bg-[#FBEEF1] text-[#B5697A] border-[#F1DDE2]";

      case "PENDING":
      default:
        return "bg-[#FFF8ED] text-[#A8793E] border-[#F0E1C8]";
    }
  }

  switch (status) {
    case "CONFIRMED":
      return "bg-[#FBEEF1] text-[#B5697A] border-[#F1DDE2]";

    case "PROCESSING":
      return "bg-[#F8F2F7] text-[#87647A] border-[#E8DDE5]";

    case "COMPLETED":
      return "bg-[#F7F1E9] text-[#806A4F] border-[#E8DCCB]";

    case "CANCELLED":
      return "bg-[#FFF3F3] text-[#C86B6B] border-[#F0D9D9]";

    case "PENDING":
    default:
      return "bg-[#FFF8ED] text-[#A8793E] border-[#F0E1C8]";
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
        text-[9px]
        capitalize
        sm:text-[10px]
        ${getClasses(type, status)}
      `}
    >
      {type === "order"
        ? "Order"
        : "Payment"}
      : {formatStatus(status)}
    </span>
  );
}

export default OrderStatusBadge;