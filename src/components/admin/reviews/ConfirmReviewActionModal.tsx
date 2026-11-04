import { CheckCircle2, XCircle, Loader2} from "lucide-react";

interface ConfirmReviewActionModalProps {
  isOpen: boolean;
  action: "verify" | "reject";
  isProcessing: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmReviewActionModal({
  isOpen,
  action,
  isProcessing,
  onConfirm,
  onClose,
}: ConfirmReviewActionModalProps) {
  if (!isOpen) return null;

  const isVerify = action === "verify";

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full ${
              isVerify
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {isVerify ? (
              <CheckCircle2 size={28} />
            ) : (
              <XCircle size={28} />
            )}
          </div>

          <h2 className="mt-4 text-[17px] font-semibold text-gray-900">
            {isVerify ? "Verify Review" : "Reject Review"}
          </h2>

          <p className="mt-2 text-[13px] leading-relaxed text-gray-500">
            Are you sure you want to {action} this review?{" "}
            {isVerify
              ? "This will make it visible to the public."
              : "This will hide it from the public."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-[13px] font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`
              flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold text-white transition disabled:opacity-50
              ${
                isVerify
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            `}
          >
            {isProcessing ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <span className="capitalize">{action}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}