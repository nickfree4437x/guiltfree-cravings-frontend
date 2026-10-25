import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  Clock3,
  XCircle,
  LoaderCircle,
} from "lucide-react";

import api from "../../api/orderApi";

type PaymentState = "checking" | "success" | "pending" | "failed";

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const merchantOrderId = searchParams.get("merchantOrderId");

  const [status, setStatus] = useState<PaymentState>("checking");
  const [message, setMessage] = useState(
    "Please wait while we verify your payment."
  );

  useEffect(() => {
    let cancelled = false;

    const verifyPayment = async () => {
      if (!merchantOrderId) {
        setStatus("failed");
        setMessage(
          "Payment reference is missing. Please check your orders."
        );
        return;
      }

      try {
        const response = await api.post(
          `/payments/${encodeURIComponent(merchantOrderId)}/verify`
        );

        if (cancelled) return;

        const result = response.data?.data ?? response.data;

        const paymentStatus = String(
          result?.status ?? result?.paymentStatus ?? ""
        ).toUpperCase();

        if (
          ["PAID", "COMPLETED", "SUCCESS", "SUCCESSFUL"].includes(
            paymentStatus
          )
        ) {
          setStatus("success");
          setMessage(
            "Your payment has been verified successfully. Thank you for choosing Guilt Free Cravings!"
          );
        } else if (
          ["PENDING", "INITIATED", "PROCESSING"].includes(paymentStatus)
        ) {
          setStatus("pending");
          setMessage(
            "Your payment is being confirmed. Please check your order status before retrying."
          );
        } else {
          setStatus("failed");
          setMessage(
            result?.message ||
              "We could not confirm your payment. Please check your order status."
          );
        }
      } catch (error: any) {
        if (cancelled) return;

        const responseData = error?.response?.data;

        const responseStatus = String(
          responseData?.data?.status ??
            responseData?.status ??
            responseData?.data?.paymentStatus ??
            ""
        ).toUpperCase();

        if (
          ["PENDING", "INITIATED", "PROCESSING"].includes(responseStatus)
        ) {
          setStatus("pending");
          setMessage(
            "Payment confirmation is taking longer than expected. Please check your orders."
          );
        } else {
          setStatus("pending");
          setMessage(
            responseData?.message ||
              "We could not verify your payment right now. Please check your orders before retrying."
          );
        }
      }
    };

    void verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [merchantOrderId]);

  const heading = {
    checking: "Verifying Payment",
    success: "Payment Successful!",
    pending: "Payment Confirmation Pending",
    failed: "Payment Not Confirmed",
  }[status];

  const statusStyles = {
    checking: {
      icon: LoaderCircle,
      iconWrapper: "bg-amber-50 text-amber-600",
      badge: "bg-amber-50 text-amber-700",
      badgeText: "VERIFYING PAYMENT",
    },
    success: {
      icon: CheckCircle2,
      iconWrapper: "bg-emerald-50 text-emerald-600",
      badge: "bg-emerald-50 text-emerald-700",
      badgeText: "PAYMENT VERIFIED",
    },
    pending: {
      icon: Clock3,
      iconWrapper: "bg-amber-50 text-amber-600",
      badge: "bg-amber-50 text-amber-700",
      badgeText: "AWAITING CONFIRMATION",
    },
    failed: {
      icon: XCircle,
      iconWrapper: "bg-rose-50 text-rose-600",
      badge: "bg-rose-50 text-rose-700",
      badgeText: "PAYMENT NOT CONFIRMED",
    },
  }[status];

  const StatusIcon = statusStyles.icon;

  return (
    <main className="w-full bg-white">
      <div className="flex min-h-[480px] items-center justify-center px-4 py-24 sm:min-h-[520px] sm:px-6 sm:py-32 lg:min-h-[540px]">
        <section className="my-4 w-full max-w-md overflow-hidden rounded-xl border border-[#f0e4df] bg-white shadow-sm">
          <div className="h-1 w-full bg-[#B5697A]" />

          <div className="px-5 py-7 text-center sm:px-8 sm:py-8">
            {/* Status Icon */}
            <div
              className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${statusStyles.iconWrapper}`}
            >
              <StatusIcon
                size={28}
                strokeWidth={1.7}
                className={
                  status === "checking" ? "animate-spin" : undefined
                }
              />
            </div>

            {/* Status Badge */}
            <span
              className={`inline-flex rounded-full px-3 py-1 text-[10px] tracking-wide ${statusStyles.badge}`}
            >
              {statusStyles.badgeText}
            </span>

            {/* Heading */}
            <h1 className="mt-3 text-lg font-medium leading-snug text-gray-700 sm:text-xl">
              {heading}
            </h1>

            {/* Message */}
            <p className="mx-auto mt-1 max-w-sm text-[12px] md:text-[13px] leading-relaxed text-slate-500">
              {message}
            </p>

            {/* Payment Reference */}
            {merchantOrderId && (
              <div className="mt-5 rounded-lg border border-[#f0e4df] bg-[#fffbfc] px-4 py-3 text-left">
                <p className="text-[11px] md:text-[12px] text-gray-600">
                  Payment Reference
                </p>

                <p className="mt-1 break-all text-sm text-[#4d363d]">
                  {merchantOrderId}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
              {status === "pending" && (
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#B5697A] px-5 py-2 text-[12px] md:text-[13px] text-white focus:outline-none"
                >
                  Check Again
                </button>
              )}

              <Link
                to="/orders"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#B5697A] px-5 py-2 text-[12px] md:text-[13px] text-white focus:outline-none"
              >
                View My Orders
              </Link>
            </div>

            {/* Footer Text */}
            <p className="mt-4 border-t border-[#f3e9e5] pt-2 text-xs font-normal text-slate-500">
              Made with care, just for you.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PaymentResultPage;