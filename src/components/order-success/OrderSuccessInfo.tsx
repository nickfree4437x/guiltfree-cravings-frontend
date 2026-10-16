import type { Order } from "../../api/orderApi";
import {
  UserRound,
  Phone,
  Mail,
  ReceiptText,
  ClipboardCheck,
} from "lucide-react";

interface OrderSuccessInfoProps {
  order: Order;
}

function OrderSuccessInfo({ order }: OrderSuccessInfoProps) {
  const paymentStatus = order.paymentStatus
    .toLowerCase()
    .replace(/_/g, " ");

  const orderStatus = order.orderStatus
    .toLowerCase()
    .replace(/_/g, " ");

  const paymentStatusStyles: Record<string, string> = {
    paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    successful: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    failed: "bg-red-50 text-red-700 ring-red-200",
    refunded: "bg-slate-100 text-slate-700 ring-slate-200",
  };

  const paymentBadgeClass =
    paymentStatusStyles[paymentStatus] ??
    "bg-[#fff3e8] text-[#8b542f] ring-[#eadfd3]";

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-[#eadfd3] bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-5 bg-gradient-to-r from-[#fff8f7] to-[#fffaf5] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[#9f6674]">
            <ReceiptText className="h-4 w-4" />
            <p className="text-xs uppercase tracking-[0.18em]">
              Order Number
            </p>
          </div>

          <h2 className="mt-2 break-all text-[16px] font-semibold tracking-tight text-slate-700 sm:text-[22px]">
            {order.orderNumber}
          </h2>

          <p className="text-[12px] font-light sm:text-[13.5px] md:text-[13.5px] leading-relaxed tracking-wide max-w-[580px] mx-auto text-gray-600">
            Keep this number for your records.
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <span className="text-xs uppercase tracking-wider text-slate-400">
            Payment Status
          </span>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs capitalize ring-1 ring-inset ${paymentBadgeClass}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {paymentStatus}
          </span>
        </div>
      </div>

      {/* Customer Details */}
      <div className="p-6 sm:p-8">
        <div className="mb-5 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff1f2] text-[#B5697A]">
            <UserRound className="h-4 w-4" />
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-800">
              Customer Details
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Information provided with your order
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Customer Name */}
          <div className="rounded-2xl border border-[#eadfd3] bg-white p-4 transition-colors">
            <div className="flex items-center gap-2 text-slate-400">
              <UserRound className="h-4 w-4" />
              <p className="text-xs uppercase tracking-wider">
                Customer Name
              </p>
            </div>

            <p className="mt-2 break-words text-sm text-slate-800">
              {order.customerName || "Not provided"}
            </p>
          </div>

          {/* Mobile Number */}
          <div className="rounded-2xl border border-[#eadfd3] bg-white p-4 transition-colors ">
            <div className="flex items-center gap-2 text-slate-400">
              <Phone className="h-4 w-4" />
              <p className="text-xs uppercase tracking-wider">
                Mobile Number
              </p>
            </div>

            <p className="mt-2 break-words text-sm  text-slate-800">
              {order.customerPhone
                ? `+91 ${order.customerPhone}`
                : "Not provided"}
            </p>
          </div>

          {/* Email Address */}
          <div className="rounded-2xl border border-[#eadfd3] bg-white p-4 transition-colors  sm:col-span-2">
            <div className="flex items-center gap-2 text-slate-400">
              <Mail className="h-4 w-4" />
              <p className="text-xs uppercase tracking-wider">
                Email Address
              </p>
            </div>

            <p className="mt-2 break-all text-sm text-slate-800">
              {order.customerEmail || "Not provided"}
            </p>
          </div>
        </div>

        {/* Order Status */}
        <div className="mt-6 rounded-2xl border border-[#eadfd3] p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff1f2] text-[#B5697A]">
              <ClipboardCheck className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Order Status
              </p>

              <p className="mt-1 break-words text-xs md:text-sm font-semibold capitalize text-slate-800">
                {orderStatus}
              </p>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                You can view your order status from the My Orders section.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderSuccessInfo;