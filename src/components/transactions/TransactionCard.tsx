import { useState } from "react";
import {
  ArrowDownLeft,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import type {
  PaymentTransaction,
  PaymentTransactionStatus,
} from "../../api/orderApi";
import TransactionDetailsModal from "./TransactionDetailsModal";

const formatCurrency = (amountInPaise: number, currency = "INR"): string => {
  const amount = Number(amountInPaise);
  if (!Number.isFinite(amount)) return "—";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount / 100);
  } catch {
    return `₹${(amount / 100).toFixed(2)}`;
  }
};

const formatDate = (date?: string | null): string => {
  if (!date) return "Not available";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
};

const getStatusConfig = (status: PaymentTransactionStatus) => {
  switch (status) {
    case "PAID":
      return {
        label: "Successful",
        description: "Payment completed successfully.",
        icon: CheckCircle2,
        className: "border-green-100 bg-green-50 text-green-700",
        iconClassName: "text-green-600",
        dotClassName: "bg-green-500",
      };
    case "PENDING":
      return {
        label: "Pending",
        description: "Payment confirmation is awaited.",
        icon: Clock3,
        className: "border-amber-100 bg-amber-50 text-amber-700",
        iconClassName: "text-amber-600",
        dotClassName: "bg-amber-500",
      };
    case "FAILED":
      return {
        label: "Failed",
        description: "This payment attempt was unsuccessful.",
        icon: XCircle,
        className: "border-red-100 bg-red-50 text-red-600",
        iconClassName: "text-red-500",
        dotClassName: "bg-red-500",
      };
    case "REFUNDED":
      return {
        label: "Refunded",
        description: "This payment has been refunded.",
        icon: ArrowDownLeft,
        className: "border-blue-100 bg-blue-50 text-blue-700",
        iconClassName: "text-blue-600",
        dotClassName: "bg-blue-500",
      };
    default:
      return {
        label: status,
        description: "Payment status information.",
        icon: AlertCircle,
        className: "border-gray-100 bg-gray-50 text-gray-600",
        iconClassName: "text-gray-500",
        dotClassName: "bg-gray-400",
      };
  }
};

const getTransactionDate = (transaction: PaymentTransaction): string => {
  return transaction.paidAt || transaction.createdAt;
};

const copyToClipboard = async (value: string, label: string): Promise<void> => {
  if (!value || value === "Not available") {
    toast.error("Reference is not available.");
    return;
  }
  try {
    if (!navigator.clipboard?.writeText) {
      throw new Error("Clipboard is unavailable.");
    }
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied.`);
  } catch {
    toast.error("Unable to copy. Please try again.");
  }
};

interface TransactionCardProps {
  transaction: PaymentTransaction;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const status = getStatusConfig(transaction.status);

  const reference =
    transaction.transactionId ||
    transaction.providerOrderId ||
    transaction.merchantOrderId;

  return (
    <>
      <article className="overflow-hidden rounded-xl border border-[#F0DDE2] bg-white shadow-sm transition-shadow">
        <div className="p-4 sm:p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="min-w-0">
                <p className="text-[12px] md:text-[13px] font-semibold text-gray-700">
                  PhonePe Payment
                </p>
                <p className="mt-0.5 truncate text-[10px] text-slate-500">
                  {formatDate(getTransactionDate(transaction))}
                </p>
              </div>
            </div>

            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          {/* Amount */}
          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500">Transaction Amount</p>
              <p className="mt-1 truncate text-[18px] md:text-[20px] font-semibold tracking-tight text-gray-700">
                {formatCurrency(transaction.amount, transaction.currency)}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[10px] text-slate-500">Payment Method</p>
              <p className="mt-1 text-[11px] font-semibold text-gray-700">
                PhonePe
              </p>
            </div>
          </div>

          {/* Reference Info */}
          <div className="mt-4 grid grid-cols-1 gap-3 rounded-lg bg-[#FCF8F9] p-3 sm:grid-cols-2">
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-wider text-slate-500">
                Order Number
              </p>
              <Link
                to={`/orders/${transaction.order.id}`}
                className="mt-1 inline-flex max-w-full items-center gap-1 text-[11px] text-[#B5697A] hover:underline"
              >
                <span className="truncate">{transaction.order.orderNumber}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </Link>
            </div>

            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-wider text-slate-500">
                Transaction Ref
              </p>
              <div className="mt-1 flex min-w-0 items-center gap-1">
                <span className="truncate text-[10px] font-medium text-[#75665F]">
                  {reference}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(reference, "Reference")}
                  className="shrink-0 rounded p-1 text-[#B5697A] transition hover:bg-[#FBEEF1]"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Status Description */}
          <div className="mt-3 flex items-start gap-2">
            <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${status.dotClassName}`} />
            <p className="text-[10px] leading-relaxed text-slate-500">
              {status.description}
            </p>
          </div>

          {/* Action Button (Opens Modal) */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-4 flex w-full items-center justify-between border-t border-[#F3E7EA] pt-3 text-left text-[11px] hover:underline text-[#B5697A] transition-colors hover:text-[#965365]"
          >
            View transaction details
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </article>

      {/* Modal */}
      {isModalOpen && (
        <TransactionDetailsModal
          transaction={transaction}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}