
import type { PaymentStatus } from "./types";

import {
  getPaymentStatusClass,
} from "./orderUtils";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

function PaymentStatusBadge({
  status,
}: PaymentStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] tracking-[0.01em] ${getPaymentStatusClass(
        status
      )}`}
    >
      {PAYMENT_STATUS_LABELS[status] ?? status}
    </span>
  );
}

export default PaymentStatusBadge;
