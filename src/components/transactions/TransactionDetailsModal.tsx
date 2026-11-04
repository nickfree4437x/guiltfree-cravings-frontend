import { X } from "lucide-react";
import type { PaymentTransaction } from "../../api/orderApi";

interface TransactionDetailsModalProps {
  transaction: PaymentTransaction;
  onClose: () => void;
}

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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[#F0DDE2] pb-2.5 last:border-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="shrink-0 text-[11px] font-medium text-slate-500 sm:text-[12px]">
        {label}
      </span>
      <span className="break-all text-[12px] font-medium text-[#3E3430] sm:max-w-[60%] sm:text-right sm:text-[13px]">
        {value}
      </span>
    </div>
  );
}

export default function TransactionDetailsModal({
  transaction,
  onClose,
}: TransactionDetailsModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-xl sm:max-h-[85vh] sm:rounded-2xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#F0DDE2] p-4 sm:p-5">
          <div>
            <h2 className="text-[16px] font-semibold text-[#3E3430] sm:text-[18px]">
              Transaction Details
            </h2>
            <p className="mt-1 text-[11px] text-slate-500 sm:text-[12px]">
              Full information about this payment.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FBEEF1] text-[#B5697A] transition hover:bg-[#F7E1E6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B5697A]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5">
          <div className="space-y-3">
            <DetailRow
              label="Merchant Order ID"
              value={transaction.merchantOrderId}
            />
            <DetailRow
              label="PhonePe Order ID"
              value={transaction.providerOrderId || "Not available"}
            />
            <DetailRow
              label="PhonePe Transaction ID"
              value={transaction.transactionId || "Not available"}
            />
            <DetailRow
              label="Payment Initiated"
              value={formatDate(transaction.createdAt)}
            />
            <DetailRow
              label="Last Verified"
              value={formatDate(transaction.lastVerifiedAt)}
            />
            <DetailRow
              label="Payment Completed"
              value={formatDate(transaction.paidAt)}
            />
            <DetailRow
              label="Gateway Response"
              value={transaction.providerCode || "Not available"}
            />

            {transaction.failureReason && (
              <div className="mt-2 rounded-lg bg-red-50 p-3 border border-red-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-red-600">
                  Failure Information
                </p>
                <p className="mt-1 break-words text-[12px] leading-relaxed text-red-700">
                  {transaction.failureReason}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom padding for iOS safe area */}
        <div className="h-4 shrink-0 sm:hidden" />
      </div>
    </div>
  );
}