// src/components/admin/orders/orderUtils.ts

import type {
  OrderStatus,
  PaymentStatus,
} from "./types";

/*
 * =========================================================
 * FORMAT CURRENCY
 * =========================================================
 */

export const formatAmount = (
  amount: number
) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

/*
 * =========================================================
 * FORMAT DATE
 * =========================================================
 */

export const formatDate = (
  date: string
) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

/*
 * =========================================================
 * ORDER STATUS CLASS
 * =========================================================
 */

export const getOrderStatusClass = (
  status: OrderStatus
) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700";

    case "CONFIRMED":
      return "bg-blue-50 text-blue-700";

    case "PROCESSING":
      return "bg-purple-50 text-purple-700";

    case "COMPLETED":
      return "bg-green-50 text-green-700";

    case "CANCELLED":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-50 text-slate-600";
  }
};

/*
 * =========================================================
 * PAYMENT STATUS CLASS
 * =========================================================
 */

export const getPaymentStatusClass = (
  status: PaymentStatus
) => {
  switch (status) {
    case "PAID":
      return "bg-green-50 text-green-700";

    case "FAILED":
      return "bg-red-50 text-red-700";

    case "REFUNDED":
      return "bg-purple-50 text-purple-700";

    case "PENDING":
    default:
      return "bg-amber-50 text-amber-700";
  }
};