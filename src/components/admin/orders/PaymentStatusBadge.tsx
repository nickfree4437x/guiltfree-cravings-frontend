// src/components/admin/orders/PaymentStatusBadge.tsx

import type {
  PaymentStatus,
} from "./types";

import {
  getPaymentStatusClass,
} from "./orderUtils";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

function PaymentStatusBadge({
  status,
}: PaymentStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] tracking-[0.01em] ${getPaymentStatusClass(
        status
      )}`}
    >
      {status}
    </span>
  );
}

export default PaymentStatusBadge;