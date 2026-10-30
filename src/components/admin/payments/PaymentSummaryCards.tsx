import { Activity, CheckCircle2, Clock3, CreditCard, XCircle } from "lucide-react";
import type { PaymentSummary } from "./types";
import { formatCurrency } from "./paymentUtils";

interface PaymentSummaryCardsProps {
  summary: PaymentSummary;
  loading: boolean;
}

export function PaymentSummaryCards({ summary, loading }: PaymentSummaryCardsProps) {
  // Refunded card removed
  const cards = [
    { label: "Total Payments", value: summary.total, icon: Activity, iconClasses: "bg-[#F8E9EC] text-[#B5697A]" },
    { label: "Successful", value: summary.paid, icon: CheckCircle2, iconClasses: "bg-green-50 text-green-600" },
    { label: "Pending", value: summary.pending, icon: Clock3, iconClasses: "bg-amber-50 text-amber-600" },
    { label: "Failed", value: summary.failed, icon: XCircle, iconClasses: "bg-red-50 text-red-600" },
  ];

  return (
    <>
      {/* 4 cards now instead of 5, grid adjusts */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border border-[#EADFD3] bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] md:text-[12px] text-slate-500">{card.label}</p>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${card.iconClasses}`}>
                  <Icon size={18} />
                </span>
              </div>
              <p className="mt-4 text-2xl font-bold tracking-tight text-slate-800">
                {loading ? "—" : card.value.toLocaleString("en-IN")}
              </p>
            </div>
          );
        })}
      </div>

      {/* Collected Amount remains same */}
      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-[#EADFD3] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#B5697A] text-white">
            <CreditCard size={21} />
          </span>
          <div>
            <p className="text-[12px] md:text-[13px] text-slate-500">Total Successfully Collected</p>
            <p className="mt-1 text-lg font-semibold text-slate-700 sm:text-xl">
              {loading ? "—" : formatCurrency(summary.paidAmount)}
            </p>
          </div>
        </div>
        <p className="text-[11px] md:text-[12px] text-slate-400">Based on successful payment records</p>
      </div>
    </>
  );
}