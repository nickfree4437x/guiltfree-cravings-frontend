// src/components/admin/orders/orderUtils.ts

import type {
  OrderStatus,
  PaymentStatus,
  DeliveryStatus,
} from "./types";

/*
 * =========================================================
 * FORMAT CURRENCY
 * =========================================================
 */

export const formatAmount = (
  amount: number
): string => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

/*
 * =========================================================
 * FORMAT DATE
 * =========================================================
 */

export const formatDate = (
  date: string
): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

/*
 * =========================================================
 * ORDER STATUS CLASS
 * =========================================================
 */

export const getOrderStatusClass = (
  status: OrderStatus
): string => {
  switch (status) {
    case "PENDING":
      return "border border-[#EFD5BD] bg-[#FFF3E8] text-[#C4773B]";

    case "CONFIRMED":
      return "border border-[#D7E2F8] bg-[#F2F6FF] text-[#4D7FEA]";

    case "PROCESSING":
      return "border border-[#D9D0EE] bg-[#F4F0FF] text-[#8062C7]";

    case "COMPLETED":
      return "border border-[#CFE4D4] bg-[#EEF8F2] text-[#3F8A58]";

    case "CANCELLED":
      return "border border-[#F0D1D5] bg-[#FFF3F5] text-[#C45D6D]";

    default:
      return "border border-[#E8E1D9] bg-[#F7F4F1] text-[#6F6259]";
  }
};

/*
 * =========================================================
 * PAYMENT STATUS CLASS
 * =========================================================
 */

export const getPaymentStatusClass = (
  status: PaymentStatus
): string => {
  switch (status) {
    case "PAID":
      return "border border-[#CFE4D4] bg-[#EEF8F2] text-[#3F8A58]";

    case "FAILED":
      return "border border-[#F0D1D5] bg-[#FFF3F5] text-[#C45D6D]";

    case "REFUNDED":
      return "border border-[#D9D0EE] bg-[#F4F0FF] text-[#8062C7]";

    case "PENDING":
    default:
      return "border border-[#EFD5BD] bg-[#FFF3E8] text-[#C4773B]";
  }
};

/*
 * =========================================================
 * DELIVERY STATUS CLASS
 * =========================================================
 */

export const getDeliveryStatusClass = (
  status: DeliveryStatus
): string => {
  switch (status) {
    case "PENDING":
      return "border border-[#EFD5BD] bg-[#FFF3E8] text-[#C4773B]";

    case "CONFIRMED":
      return "border border-[#D7E2F8] bg-[#F2F6FF] text-[#4D7FEA]";

    case "PROCESSING":
      return "border border-[#D9D0EE] bg-[#F4F0FF] text-[#8062C7]";

    case "OUT_FOR_DELIVERY":
      return "border border-[#BFE3F5] bg-[#EDF9FF] text-[#2581A8]";

    case "DELIVERED":
      return "border border-[#CFE4D4] bg-[#EEF8F2] text-[#3F8A58]";

    case "CANCELLED":
      return "border border-[#F0D1D5] bg-[#FFF3F5] text-[#C45D6D]";

    default:
      return "border border-[#E8E1D9] bg-[#F7F4F1] text-[#6F6259]";
  }
};