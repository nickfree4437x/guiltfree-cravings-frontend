import { ReceiptText, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import type { Payment, Pagination } from "./types";
import { formatCurrency, formatDate, getStatusClasses } from "./paymentUtils";

interface PaymentListProps {
  payments: Payment[];
  loading: boolean;
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export function PaymentList({ payments, loading, pagination, onPageChange }: PaymentListProps) {
  return (
    // Main container with border and rounded corners
    <div className="overflow-hidden rounded-xl border border-[#EADFD3] bg-white shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-[#F1E9E1] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Transaction History</h2>
          <p className="mt-1 text-xs text-slate-500">
            {loading ? "Loading transactions..." : `${pagination.total} matching payment records`}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-[#F8E9EC] px-3 py-1 text-xs font-semibold text-[#A65368]">
          <ReceiptText size={14} /> PhonePe
        </span>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="border-b border-[#B5697A] bg-[#B5697A]">
            <tr>
              {["Payment ID", "Order", "Customer", "Amount", "Method", "Status", "Date"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-white">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1E9E1]">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center text-sm text-slate-500">
                  <RefreshCw size={20} className="mx-auto mb-3 animate-spin text-[#B5697A]" />
                  Loading payments...
                </td>
              </tr>
            ) : payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment.id} className="transition hover:bg-[#FFFBF8]">
                  <td className="max-w-[200px] md:max-w-[220px] px-4 py-3 md:py-4">
                    <p className="break-all text-[11px] md:text-xs font-semibold text-slate-800">
                      {payment.paymentId}
                    </p>
                    {payment.transactionId && (
                      <p className="mt-1 break-all text-[9px] md:text-[10px] text-slate-400">
                        Transaction reference
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 md:py-4">
                    <p className="text-[12px] md:text-sm font-semibold text-[#B5697A]">
                      {payment.orderNumber}
                    </p>
                  </td>
                  <td className="px-4 py-3 md:py-4">
                    <p className="text-[12px] md:text-sm font-medium text-slate-800">
                      {payment.customerName}
                    </p>
                    <p className="mt-1 text-[10px] md:text-xs text-slate-500">
                      {payment.customerPhone}
                    </p>
                    {payment.customerEmail && (
                      <p className="mt-1 max-w-[160px] md:max-w-[180px] truncate text-[10px] md:text-[11px] text-slate-400">
                        {payment.customerEmail}
                      </p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 md:py-4 text-[12px] md:text-sm font-bold text-slate-900">
                    {formatCurrency(payment.amount, payment.currency)}
                  </td>
                  <td className="px-4 py-3 md:py-4 text-[12px] md:text-sm text-slate-600">
                    {payment.method}
                  </td>
                  <td className="px-4 py-3 md:py-4">
                    <span className={`inline-flex rounded-full border px-2 py-0.5 md:px-2.5 md:py-1 text-[9px] md:text-[10px] font-semibold ${getStatusClasses(payment.status)}`}>
                      {payment.status}
                    </span>
                    {payment.failureReason && (
                      <p title={payment.failureReason} className="mt-1 max-w-[130px] md:max-w-[150px] truncate text-[9px] md:text-[10px] text-red-500">
                        {payment.failureReason}
                      </p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 md:py-4 text-[11px] md:text-xs text-slate-500">
                    {formatDate(payment.createdAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <ReceiptText size={30} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-600">No payments found</p>
                  <p className="mt-1 text-xs text-slate-400">Try changing your search or status filter.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination - EKDAM BOX KE ANDAR */}
      {!loading && pagination.total > 0 && (
        <div className="flex flex-col gap-3 border-t border-[#F1E9E1] bg-[#FFFBF8] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{(pagination.page - 1) * pagination.pageSize + 1}–{Math.min(pagination.page * pagination.pageSize, pagination.total)}</span> of <span className="font-semibold text-slate-700">{pagination.total.toLocaleString("en-IN")}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!pagination.hasPreviousPage || loading}
              onClick={() => onPageChange(pagination.page - 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-[#EADFD3] bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-[#FDF4F6] hover:border-[#D9B8C1] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={15} /> Previous
            </button>
            <span className="min-w-[76px] text-center text-xs font-medium text-slate-600">
              Page {pagination.page} of {Math.max(pagination.totalPages, 1)}
            </span>
            <button
              type="button"
              disabled={!pagination.hasNextPage || loading}
              onClick={() => onPageChange(pagination.page + 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-[#EADFD3] bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-[#FDF4F6] hover:border-[#D9B8C1] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}