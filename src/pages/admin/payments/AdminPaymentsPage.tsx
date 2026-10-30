import { RefreshCw, AlertCircle } from "lucide-react";
import { useAdminPayments } from "../../../hooks/useAdminPayments";
import { PaymentSummaryCards } from "../../../components/admin/payments/PaymentSummaryCards";
import { PaymentFilters } from "../../../components/admin/payments/PaymentFilters";
import { PaymentList } from "../../../components/admin/payments/PaymentList";

export default function AdminPaymentsPage() {
  const {
    payments,
    summary,
    pagination,
    searchInput,
    status,
    dateFilter,
    loading,
    refreshing,
    error,
    handleStatusChange,
    handleSearchChange,
    handleDateChange,
    handleRefresh,
    setPage,
    fetchPayments,
  } = useAdminPayments();

  return (
    <div className="min-h-screen bg-white px-4 py-2 sm:px-6 sm:py-4 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mt-1 text-[18px] font-semibold tracking-tight text-slate-700 md:text-[22px]">Payments</h1>
            <p className="mt-0 text-[11px] md:text-[12px] font-[350] leading-relaxed text-slate-500">Monitor transactions, payment statuses and collections.</p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#E8DED3] bg-white px-3 py-2 text-[11px] text-slate-500 shadow-sm hover:border-[#D9B8C1] hover:bg-[#FDF4F6] hover:text-[#B5697A] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-[12px]"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <PaymentSummaryCards summary={summary} loading={loading} />

        {/* Filters */}
        <PaymentFilters
          searchInput={searchInput}
          status={status}
          dateFilter={dateFilter}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onDateChange={handleDateChange}
        />

        {/* Error State */}
        {error && (
          <div className="mb-4 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle size={19} className="mt-0.5 shrink-0 text-red-600" />
              <div>
                <p className="text-sm font-semibold text-red-700">Unable to load payments</p>
                <p className="mt-1 text-xs text-red-600">{error}</p>
              </div>
            </div>
            <button onClick={() => void fetchPayments()} className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100">Try again</button>
          </div>
        )}

        {/* Payments List (Pagination is inside this now) */}
        <PaymentList
          payments={payments}
          loading={loading}
          pagination={pagination}
          onPageChange={setPage}
        />

        <p className="mt-4 text-center text-[11px] text-slate-400">Payment records are loaded securely from your admin API.</p>
      </div>
    </div>
  );
}