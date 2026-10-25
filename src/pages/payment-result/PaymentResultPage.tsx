import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
        setMessage("Payment reference is missing. Please check your orders.");
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
          setMessage("Your payment has been verified successfully.");
        } else if (
          ["PENDING", "INITIATED", "PROCESSING"].includes(paymentStatus)
        ) {
          setStatus("pending");
          setMessage(
            "Your payment is still being confirmed. Please check again shortly."
          );
        } else {
          setStatus("failed");
          setMessage(
            result?.message ||
              "We could not confirm this payment. Please check your order status."
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
            "Payment confirmation is taking longer than expected. Please check your orders before retrying."
          );
        } else {
          setStatus("pending");
          setMessage(
            responseData?.message ||
              "We could not verify the payment right now. Please check your orders before retrying."
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

  return (
    <main
      style={{
        minHeight: "65vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        background: "#fff",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "520px",
          padding: "36px 24px",
          border: "1px solid #eee",
          borderRadius: "16px",
          textAlign: "center",
          boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            margin: "0 auto 20px",
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            background:
              status === "success"
                ? "#e7f8ec"
                : status === "failed"
                  ? "#fff0f0"
                  : "#fff5e8",
            color:
              status === "success"
                ? "#198754"
                : status === "failed"
                  ? "#dc3545"
                  : "#a15c00",
            fontSize: "30px",
            fontWeight: 700,
          }}
        >
          {status === "checking" ? "…" : status === "success" ? "✓" : "!"}
        </div>

        <h1 style={{ fontSize: "26px", marginBottom: "12px" }}>
          {heading}
        </h1>

        <p style={{ color: "#666", lineHeight: 1.7 }}>{message}</p>

        {merchantOrderId && (
          <p
            style={{
              marginTop: "20px",
              fontSize: "13px",
              color: "#777",
              overflowWrap: "anywhere",
            }}
          >
            Payment Reference: {merchantOrderId}
          </p>
        )}

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "28px",
          }}
        >
          {status === "pending" && (
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "12px 20px",
                border: "none",
                borderRadius: "8px",
                background: "#8e2945",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Check Again
            </button>
          )}

          {status === "success" && (
            <Link
              to="/orders"
              style={{
                padding: "12px 20px",
                borderRadius: "8px",
                background: "#8e2945",
                color: "#fff",
                textDecoration: "none",
              }}
            >
              View My Orders
            </Link>
          )}

          <Link
            to="/"
            style={{
              padding: "12px 20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              color: "#333",
              textDecoration: "none",
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    </main>
  );
};

export default PaymentResultPage;