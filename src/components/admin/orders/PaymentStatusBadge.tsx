// src/components/admin/orders/PaymentStatusBadge.tsx

import type { PaymentStatus } from "./types";
import { getPaymentStatusClass } from "./orderUtils";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

function PaymentStatusBadge({
  status,
}: PaymentStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${getPaymentStatusClass(
        status
      )}`}
    >
      {status}
    </span>
  );
}

export default PaymentStatusBadge;