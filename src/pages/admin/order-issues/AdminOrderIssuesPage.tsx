import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import karo
import { AlertCircle, LoaderCircle, RefreshCw } from "lucide-react";

import { getAdminOrderIssues, getAdminOrderIssueStats } from "../../../api/adminApi";
import type { AdminOrderIssue, AdminOrderIssueStats, OrderIssueStatus } from "../../../components/admin/order-issue/OrderIssueTypes";
import { PAGE_SIZE, INITIAL_STATS } from "../../../components/admin/order-issue/OrderIssueTypes";
import { getErrorMessage } from "../../../components/admin/order-issue/orderIssueUtils";

import { OrderIssueStatsCards } from "../../../components/admin/order-issue/OrderIssueStatsCards";
import { OrderIssueFilters } from "../../../components/admin/order-issue/OrderIssueFilters";
import { OrderIssueList } from "../../../components/admin/order-issue/OrderIssueList";
import { OrderIssuePagination } from "../../../components/admin/order-issue/OrderIssuePagination";

export default function AdminOrderIssuesPage() {
  const navigate = useNavigate(); // ✅ useNavigate

  const [issues, setIssues] = useState<AdminOrderIssue[]>([]);
  const [stats, setStats] = useState<AdminOrderIssueStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState("");
  const [statsError, setStatsError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderIssueStatus | "">("");
  const [issueTypeFilter, setIssueTypeFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // ❌ Modal states removed: selectedIssue, detailsLoading, detailsError

  // Debounce search
  useEffect(() => {
    const timeout = window.setTimeout(() => { setPage(1); setSearch(searchInput.trim()); }, 350);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const loadStats = useCallback(async () => {
    setStatsLoading(true); setStatsError("");
    try { setStats(await getAdminOrderIssueStats()); }
    catch (err) { setStatsError(getErrorMessage(err)); }
    finally { setStatsLoading(false); }
  }, []);

  const loadIssues = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const result = await getAdminOrderIssues({ page, limit: PAGE_SIZE, search, status: statusFilter, issueType: issueTypeFilter, sortOrder });
      setIssues(result.data); setTotal(result.pagination.total); setTotalPages(result.pagination.totalPages);
    } catch (err) {
      setIssues([]); setTotal(0); setTotalPages(0); setError(getErrorMessage(err));
    } finally { setLoading(false); }
  }, [page, search, statusFilter, issueTypeFilter, sortOrder]);

  useEffect(() => { void loadStats(); }, [loadStats]);
  useEffect(() => { void loadIssues(); }, [loadIssues]);

  const issueTypes = useMemo(() => [...new Set(issues.map((i) => i.issueType).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [issues]);

  // ✅ Navigate to details page
  const openIssueDetails = (id: number) => {
    navigate(`/admin/order-issues/${id}`);
  };

  const resetFilters = () => { setSearchInput(""); setSearch(""); setStatusFilter(""); setIssueTypeFilter(""); setSortOrder("desc"); setPage(1); };

  const showingFrom = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="min-h-screen bg-white px-4 py-2 sm:px-6 sm:py-4 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        
        {/* Heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-[18px] font-semibold tracking-tight text-slate-700 md:text-[22px]">Order Issues</h1>
            <p className="mt-0 text-[11px] md:text-[12px] font-[350] leading-relaxed text-slate-500">Review, track, and resolve customer order issues.</p>
          </div>
          <button type="button" onClick={() => { void loadStats(); void loadIssues(); }} disabled={loading || statsLoading} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#E8DED3] bg-white px-3 py-2 text-[11px] text-slate-500 shadow-sm hover:border-[#D9B8C1] hover:bg-[#FDF4F6] hover:text-[#B5697A] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-[12px]">
            <RefreshCw size={16} className={loading || statsLoading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {statsError && <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-2 text-sm text-amber-800"><AlertCircle size={18} className="mt-0.5 shrink-0" /><span>Could not load issue statistics: {statsError}</span></div><button type="button" onClick={() => void loadStats()} className="self-start text-sm font-semibold text-amber-900 underline underline-offset-4 sm:self-auto">Retry</button></div>}

        <OrderIssueStatsCards stats={stats} loading={statsLoading} />
        
        <OrderIssueFilters
          searchInput={searchInput} setSearchInput={setSearchInput}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          issueTypeFilter={issueTypeFilter} setIssueTypeFilter={setIssueTypeFilter}
          issueTypes={issueTypes} sortOrder={sortOrder} setSortOrder={setSortOrder}
          setPage={setPage}
        />

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div><h2 className="text-[16px] md:text-[18px] font-semibold text-gray-700">Customer Reports</h2><p className="mt-0 text-[11px] md:text-[12px] text-slate-500">{loading ? "Loading reported issues..." : `${total.toLocaleString("en-IN")} issue${total === 1 ? "" : "s"} found`}</p></div>
          </div>

          {error && <div className="m-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-2 text-sm text-red-700"><AlertCircle size={18} className="mt-0.5 shrink-0" /><span>{error}</span></div><button type="button" onClick={() => void loadIssues()} className="self-start text-sm font-semibold text-red-700 underline underline-offset-4 sm:self-auto">Try again</button></div>}

          {loading && <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-5 py-12"><LoaderCircle size={30} className="animate-spin text-[#B5697A]" /><p className="text-sm text-gray-500">Loading order issues...</p></div>}

          {!loading && !error && issues.length === 0 && <div className="flex min-h-64 flex-col items-center justify-center px-5 py-12 text-center"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B5697A]/10 text-[#B5697A]"><AlertCircle size={28} /></div><h3 className="mt-4 text-base font-bold text-gray-900">No order issues found</h3><p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">{search || statusFilter || issueTypeFilter ? "Try changing your search or filters to find reported issues." : "There are no reported order issues at the moment."}</p>{(search || statusFilter || issueTypeFilter) && <button type="button" onClick={resetFilters} className="mt-4 rounded-xl bg-[#B5697A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a65a6b]">Clear Filters</button>}</div>}

          {!loading && !error && issues.length > 0 && (
            <>
              <OrderIssueList issues={issues} onViewDetails={openIssueDetails} />
              <OrderIssuePagination page={page} totalPages={totalPages} total={total} showingFrom={showingFrom} showingTo={showingTo} setPage={setPage} />
            </>
          )}
        </div>
      </div>
    
    </div>
  );
}