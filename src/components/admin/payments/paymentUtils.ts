import type { PaymentStatus } from "./types";

export const getStatusClasses = (status: PaymentStatus) => {
  switch (status) {
    case "PAID":
      return "border-green-200 bg-green-50 text-green-700";
    case "PENDING":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "FAILED":
      return "border-red-200 bg-red-50 text-red-700";
    case "REFUNDED":
      return "border-purple-200 bg-purple-50 text-purple-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
};

export const formatCurrency = (amountInPaise: number, currency = "INR") => {
  const amountInRupees = amountInPaise / 100;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(amountInRupees);
  } catch {
    return `₹${amountInRupees.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  }
};

export const formatDate = (value: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// ✅ YE HAI MISSING FUNCTION JO ERROR DE RAHA THA
export const getAdminToken = (): string | null => {
  try {
    // Exact key used by src/store/adminAuthStore.ts
    return localStorage.getItem("guiltfree_admin_token");
  } catch (error) {
    console.error("Unable to read admin token:", error);
    return null;
  }
};