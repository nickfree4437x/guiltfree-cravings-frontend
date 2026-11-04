import { useCallback, useEffect, useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock3,
  CreditCard,
  LoaderCircle,
  ReceiptText,
  RefreshCw,
  Search,
  Wallet,
  XCircle,
  ArrowDownUp,
  type LucideIcon,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuthStore } from "../../store/authStore";
import {
  getMyTransactions,
  type PaymentTransaction,
  type PaymentTransactionStatus,
} from "../../api/orderApi";

import TransactionCard from "../../components/transactions/TransactionCard";

// ─── Config ───────────────────────────────────────────────
const TRANSACTIONS_PER_PAGE = 6; // 6 cards per page

type TransactionFilter = "ALL" | PaymentTransactionStatus;
type SortOption = "newest" | "oldest";

const FILTERS: { label: string; value: TransactionFilter }[] = [
  { label: "All", value: "ALL" },
  { label: "Successful", value: "PAID" },
  { label: "Pending", value: "PENDING" },
  { label: "Failed", value: "FAILED" },
  { label: "Refunded", value: "REFUNDED" },
];

// ─── Helpers ──────────────────────────────────────────────
const formatCurrency = (amountInPaise: number, currency = "INR"): string => {
  const amount = Number(amountInPaise);
  if (!Number.isFinite(amount)) return "—";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount / 100);
  } catch {
    return `₹${(amount / 100).toFixed(2)}`;
  }
};

const getTransactionDate = (transaction: PaymentTransaction): string => {
  return transaction.paidAt || transaction.createdAt;
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = error.response;
    if (typeof response === "object" && response !== null && "data" in response) {
      const data = response.data;
      if (typeof data === "object" && data !== null && "message" in data && typeof data.message === "string") {
        return data.message;
      }
    }
  }
  return "We could not load your transactions. Please try again.";
};

// ─── Nav Button ───────────────────────────────────────────
function NavButton({ direction, onClick, disabled }: { direction: "prev" | "next"; onClick: () => void; disabled: boolean }) {
  const Icon = direction === "prev" ? FaChevronLeft : FaChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous page" : "Next page"}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#EADFD3] bg-white text-[#A98B6F] transition-colors hover:border-[#B5697A] hover:text-[#B5697A] focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11"
    >
      <Icon className="h-3 w-3" />
    </button>
  );
}

// ─── Summary Card ─────────────────────────────────────────
interface SummaryCardProps { label: string; value: string | number; icon: LucideIcon; iconClassName: string; description: string; }
function SummaryCard({ label, value, icon: Icon, iconClassName, description }: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-[#F0DDE2] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] text-slate-500 md:text-[11px]">{label}</p>
          <p className="mt-2 truncate text-[21px] font-semibold tracking-tight text-gray-700 sm:text-[24px]">{value}</p>
        </div>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}>
          <Icon className="h-[16px] w-[16px]" strokeWidth={1.8} />
        </span>
      </div>
      <p className="mt-2 text-[9px] text-slate-500 md:text-[10px]">{description}</p>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────
interface EmptyTransactionsProps { filtered: boolean; onReset: () => void; }
function EmptyTransactions({ filtered, onReset }: EmptyTransactionsProps) {
  return (
    <div className="rounded-2xl border border-dashed border-[#EBD5DC] bg-white px-5 py-12 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FBEEF1] text-[#B5697A]">
        <ReceiptText className="h-7 w-7" strokeWidth={1.5} />
      </span>
      <h3 className="mt-5 text-[16px] font-semibold text-[#594D47]">{filtered ? "No matching transactions" : "No transactions yet"}</h3>
      <p className="mx-auto mt-2 max-w-xs text-[11px] leading-relaxed text-[#A39790]">{filtered ? "Try changing your search or selecting another payment status." : "Your payment history will appear here whenever you make a payment on an order."}</p>
      {filtered ? (
        <button type="button" onClick={onReset} className="mt-5 rounded-full bg-[#B5697A] px-5 py-2.5 text-[11px] font-semibold text-white transition hover:bg-[#9F596B]">Clear filters</button>
      ) : (
        <Link to="/orders" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#B5697A] px-5 py-2.5 text-[11px] font-semibold text-white transition hover:bg-[#9F596B]">View My Orders <ArrowRight className="h-3.5 w-3.5" /></Link>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────
export default function TransactionsPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<TransactionFilter>("ALL");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login", { replace: true });
  }, [isAuthenticated, navigate]);

  const fetchTransactions = useCallback(async (isRefresh = false) => {
    if (!isAuthenticated) return;
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError("");
    try {
      const data = await getMyTransactions();
      setTransactions(data);
      setCurrentPage(1);
      if (isRefresh) toast.success("Transactions refreshed");
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      if (transactions.length > 0 && isRefresh) toast.error(message);
      else setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAuthenticated, transactions.length]);

  useEffect(() => {
    if (isAuthenticated) void fetchTransactions();
  }, [isAuthenticated, fetchTransactions]);

  // Summary
  const summary = useMemo(() => {
    const successful = transactions.filter((item) => item.status === "PAID");
    const pending = transactions.filter((item) => item.status === "PENDING");
    const failed = transactions.filter((item) => item.status === "FAILED");
    const refunded = transactions.filter((item) => item.status === "REFUNDED");
    const totalPaid = successful.reduce((total, item) => total + item.amount, 0);
    return {
      total: transactions.length,
      successful: successful.length,
      pending: pending.length,
      failed: failed.length,
      refunded: refunded.length,
      totalPaid,
    };
  }, [transactions]);

  // Filter & Sort
  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return transactions
      .filter((t) => {
        const matchesFilter = filter === "ALL" || t.status === filter;
        const matchesSearch = !query || t.order.orderNumber.toLowerCase().includes(query) || t.merchantOrderId.toLowerCase().includes(query) || (t.transactionId || "").toLowerCase().includes(query) || (t.providerOrderId || "").toLowerCase().includes(query);
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => {
        const dateA = new Date(getTransactionDate(a)).getTime();
        const dateB = new Date(getTransactionDate(b)).getTime();
        return sortBy === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [transactions, filter, search, sortBy]);

  // ─── Pagination ────────────────────────────────────────
  const totalPages = Math.ceil(filteredTransactions.length / TRANSACTIONS_PER_PAGE);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) setCurrentPage(totalPages);
    if (totalPages === 0 && currentPage !== 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
    return filteredTransactions.slice(start, start + TRANSACTIONS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }, [currentPage, totalPages]);

  const resetFilters = () => {
    setFilter("ALL");
    setSearch("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-white pb-24 lg:pb-12">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        
        {/* Intro Banner */}
        <section className="relative overflow-hidden rounded-xl bg-[#B5697A] p-5 shadow-sm sm:p-7">
          <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/[0.08]" />
          <div className="pointer-events-none absolute -bottom-20 right-28 h-36 w-36 rounded-full bg-white/[0.06]" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white">
                <ReceiptText className="h-6 w-6" strokeWidth={1.7} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.10em] text-white/90">Payment Overview</p>
                <h2 className="mt-1 text-[18px] font-semibold text-white sm:text-[22px]">Your Transactions</h2>
                <p className="mt-0 text-[10px] leading-relaxed text-white/75">All your PhonePe payment attempts in one place.</p>
              </div>
            </div>

            {/* ✅ Refresh button — uses `refreshing` state */}
            <button
              type="button"
              onClick={() => void fetchTransactions(true)}
              disabled={refreshing || loading}
              aria-label="Refresh transactions"
              title="Refresh transactions"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white transition hover:bg-white/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                strokeWidth={1.9}
              />
            </button>
          </div>
        </section>

        {/* Summary Cards */}
        <section className="mt-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            <SummaryCard label="Total Transactions" value={loading ? "—" : summary.total} icon={ReceiptText} iconClassName="bg-[#FBEEF1] text-[#B5697A]" description="All payment attempts" />
            <SummaryCard label="Successful" value={loading ? "—" : summary.successful} icon={CheckCircle2} iconClassName="bg-green-50 text-green-600" description="Completed payments" />
            <SummaryCard label="Pending" value={loading ? "—" : summary.pending} icon={Clock3} iconClassName="bg-amber-50 text-amber-600" description="Awaiting confirmation" />
            <SummaryCard label="Failed" value={loading ? "—" : summary.failed} icon={XCircle} iconClassName="bg-red-50 text-red-600" description="Unsuccessful attempts" />
            <SummaryCard label="Total Paid" value={loading ? "—" : formatCurrency(summary.totalPaid)} icon={CreditCard} iconClassName="bg-blue-50 text-blue-600" description="Successful payments only" />
          </div>
        </section>

        {/* History */}
        <section className="mt-4">

          {/* Filters */}
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_190px_190px]">
            <label className="relative block">
              <span className="sr-only">Search transactions</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input type="search" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search order number or transaction ID..." className="h-11 w-full rounded-xl border border-[#EADFD3] bg-white pl-10 pr-4 text-xs text-[#3E3430] outline-none transition placeholder:text-slate-500 focus:border-[#B5697A]" />
            </label>
            <label className="relative block">
              <span className="sr-only">Filter by status</span>
              <Wallet className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <select value={filter} onChange={(e) => { setFilter(e.target.value as TransactionFilter); setCurrentPage(1); }} className="h-11 w-full appearance-none rounded-xl border border-[#EADFD3] bg-white pl-10 pr-4 text-xs text-slate-700 outline-none transition focus:border-[#B5697A]">
                {FILTERS.map((item) => (<option key={item.value} value={item.value}>{item.label === "All" ? "All statuses" : item.label}</option>))}
              </select>
            </label>
            <label className="relative block">
              <span className="sr-only">Sort transactions</span>
              <ArrowDownUp className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <select value={sortBy} onChange={(e) => { setSortBy(e.target.value as SortOption); setCurrentPage(1); }} className="h-11 w-full appearance-none rounded-xl border border-[#EADFD3] bg-white pl-10 pr-4 text-xs text-slate-700 outline-none transition focus:border-[#B5697A]">
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>
          </div>

          {/* Loading */}
          {loading && <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-[#F0DDE2] bg-white py-16"><LoaderCircle className="h-8 w-8 animate-spin text-[#B5697A]" /><p className="mt-3 text-[11px] text-slate-500">Loading your transactions...</p></div>}

          {/* Error */}
          {!loading && error && <div className="mt-5 rounded-2xl border border-red-100 bg-white px-5 py-10 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500"><AlertCircle className="h-6 w-6" /></span><h3 className="mt-4 text-[14px] font-semibold text-[#594D47]">Unable to load transactions</h3><p className="mt-2 text-[11px] text-slate-500">{error}</p><button onClick={() => void fetchTransactions()} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#B5697A] px-5 py-2.5 text-[11px] font-semibold text-white transition hover:bg-[#9F596B]"><RefreshCw className="h-3.5 w-3.5" /> Try Again</button></div>}

          {/* Empty */}
          {!loading && !error && filteredTransactions.length === 0 && <div className="mt-5"><EmptyTransactions filtered={transactions.length > 0 || Boolean(search) || filter !== "ALL"} onReset={resetFilters} /></div>}

          {/* Cards */}
          {!loading && !error && filteredTransactions.length > 0 && (
            <>
              <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {paginatedTransactions.map((transaction) => (
                  <TransactionCard key={transaction.id} transaction={transaction} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav aria-label="Transactions pagination" className="mx-auto mt-10 flex max-w-5xl flex-wrap items-center justify-center gap-2">
                  <NavButton direction="prev" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} />
                  {pageNumbers.map((page, index) => {
                    if (page === "...") return <span key={`ellipsis-${index}`} className="flex h-10 w-8 items-center justify-center text-[14px] font-medium text-[#A98B6F] sm:h-11 sm:w-10">...</span>;
                    const isActive = page === currentPage;
                    return (
                      <button key={page} type="button" onClick={() => goToPage(page)} className={`flex h-10 w-10 items-center justify-center rounded-lg border text-[13px] transition-colors sm:h-11 sm:w-11 sm:text-[14px] ${isActive ? "border-[#B5697A] bg-[#B5697A] text-white shadow-sm" : "border-[#EADFD3] bg-white text-[#2C2C2C] hover:border-[#B5697A] hover:text-[#B5697A]"}`}>
                        {page}
                      </button>
                    );
                  })}
                  <NavButton direction="next" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} />
                </nav>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}