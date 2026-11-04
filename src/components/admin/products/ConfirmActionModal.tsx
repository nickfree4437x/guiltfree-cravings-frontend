import {
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Loader2,
  X,
} from "lucide-react";

interface ConfirmActionModalProps {
  isOpen: boolean;
  action: "delete" | "toggle";
  productName: string;
  nextStatus?: boolean;
  isProcessing: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmActionModal({
  isOpen,
  action,
  productName,
  nextStatus,
  isProcessing,
  onConfirm,
  onClose,
}: ConfirmActionModalProps) {
  if (!isOpen) return null;

  const isDelete = action === "delete";
  const isActivate = action === "toggle" && nextStatus === true;

  const title = isDelete
    ? "Delete Product"
    : isActivate
    ? "Activate Product"
    : "Deactivate Product";

  const description = isDelete
    ? `Are you sure you want to delete "${productName}"? This action cannot be undone.`
    : `Are you sure you want to ${
        isActivate ? "activate" : "deactivate"
      } "${productName}"?`;

  const confirmLabel = isDelete
    ? "Delete"
    : isActivate
    ? "Activate"
    : "Deactivate";

  const Icon = isDelete
    ? Trash2
    : isActivate
    ? CheckCircle2
    : AlertTriangle;

  const iconBg = isDelete
    ? "bg-red-50 text-red-600"
    : isActivate
    ? "bg-emerald-50 text-emerald-600"
    : "bg-amber-50 text-amber-600";

  // ✅ Inline styles for the confirm button to bypass any CSS conflicts
  const confirmBtnStyle = {
    backgroundColor: isDelete
      ? "#dc2626" // Red
      : isActivate
      ? "#059669" // Green
      : "#d97706", // Amber
    color: "#ffffff", // White text
    border: "1px solid transparent",
  };

  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (e.target === e.currentTarget && !isProcessing) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm transition-all duration-200"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="relative w-full max-w-[420px] overflow-hidden rounded-2xl bg-white p-6 shadow-xl sm:p-7"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          aria-label="Close confirmation"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
        >
          <X size={18} />
        </button>

        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full ${iconBg}`}
          >
            <Icon size={28} strokeWidth={1.8} />
          </div>

          <h2
            id="confirm-modal-title"
            className="mt-4 text-lg font-semibold tracking-tight text-slate-800 sm:text-xl"
          >
            {title}
          </h2>

          <p className="mt-2 max-w-[320px] text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-7 grid grid-cols-2 gap-3">
          {/* Cancel Button */}
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-[11px] md:text-[12px] text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:h-11"
          >
            Cancel
          </button>

          {/* Confirm Button (Using inline style to ensure visibility) */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            style={confirmBtnStyle}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl text-[11px] md:text-[12px] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 sm:h-11"
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin text-white" />
                Processing...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}