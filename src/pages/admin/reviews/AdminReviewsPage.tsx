import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, MessageSquareText, RefreshCw, XCircle } from "lucide-react";

import {
  getAdminReviews,
  rejectAdminReview,
  verifyAdminReview,
  type AdminReview,
} from "../../../api/adminReviewApi";

import { useAdminAuthStore } from "../../../store/adminAuthStore";

import ReviewSummaryCards from "../../../components/admin/reviews/ReviewSummaryCards";
import ReviewFilters from "../../../components/admin/reviews/ReviewFilters";
import ReviewRow from "../../../components/admin/reviews/ReviewRow";
import ReviewDetailModal from "../../../components/admin/reviews/ReviewDetailModal";

import type {
  RatingFilter,
  ReviewSummary,
  StatusFilter,
} from "../../../components/admin/reviews/types";

// ─── Config ───────────────────────────────────────────────
const EMPTY_SUMMARY: ReviewSummary = { total: 0, pending: 0, verified: 0, rejected: 0 };

// ─── Component ────────────────────────────────────────────
function AdminReviewsPage() {
  const token = useAdminAuthStore((s) => s.token);

  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>(EMPTY_SUMMARY);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("ALL");
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);

  // ─── Load reviews ───────────────────────────────────────
  const loadReviews = useCallback(
    async (refresh = false) => {
      if (!token) {
        setError("Admin authentication token not found.");
        setIsLoading(false);
        return;
      }

      try {
        if (refresh) setIsRefreshing(true);
        else setIsLoading(true);
        setError("");

        const data = await getAdminReviews(token);
        const safeReviews = Array.isArray(data?.reviews) ? data.reviews : [];
        const safeSummary = data?.summary ?? {};

        setReviews(safeReviews);
        setSummary({
          total: Number(safeSummary.total ?? 0),
          pending: Number(safeSummary.pending ?? 0),
          verified: Number(safeSummary.verified ?? 0),
          rejected: Number(safeSummary.rejected ?? 0),
        });
      } catch (loadError: any) {
        console.error("Failed to load admin reviews:", loadError);
        setReviews([]);
        setSummary(EMPTY_SUMMARY);
        setError(
          loadError?.response?.data?.message ||
            loadError?.message ||
            "Unable to load reviews."
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [token]
  );

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  // ─── Filter reviews ─────────────────────────────────────
  const filteredReviews = useMemo(() => {
    const safeReviews = Array.isArray(reviews) ? reviews : [];
    const query = search.trim().toLowerCase();

    return safeReviews.filter((review) => {
      const title = review.title?.toLowerCase().trim() ?? "";
      const comment = review.comment?.toLowerCase().trim() ?? "";
      const displayName = review.displayName?.toLowerCase().trim() ?? "";
      const email = review.email?.toLowerCase().trim() ?? "";
      const productName = review.product?.name?.toLowerCase().trim() ?? "";

      const matchesSearch =
        !query ||
        title.includes(query) ||
        comment.includes(query) ||
        displayName.includes(query) ||
        email.includes(query) ||
        productName.includes(query);

      const matchesStatus = statusFilter === "ALL" || review.status === statusFilter;
      const matchesRating = ratingFilter === "ALL" || review.rating === Number(ratingFilter);

      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [reviews, search, statusFilter, ratingFilter]);

  // ─── Handle Action (Verify / Reject) ────────────────────
  const handleAction = async (review: AdminReview, action: "verify" | "reject") => {
    if (!token) {
      setError("Admin authentication token not found.");
      return;
    }

    const confirmMsg = `Are you sure you want to ${action} this review?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      setActionId(review.id);
      setError("");

      if (action === "verify") {
        await verifyAdminReview(review.id, token);
      } else {
        await rejectAdminReview(review.id, token);
      }

      setSelectedReview(null);
      await loadReviews(true);
    } catch (actionError: any) {
      console.error(`Failed to ${action} review:`, actionError);
      window.alert(
        actionError?.response?.data?.message ||
          actionError?.message ||
          `Unable to ${action} review.`
      );
    } finally {
      setActionId(null);
    }
  };

  // ─── Render ─────────────────────────────────────────────
  return (
    <div className="min-h-full bg-white px-5 py-2 sm:px-6 lg:px-8 lg:py-3">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-row items-start justify-between gap-3 sm:gap-4 lg:items-end">
          <div className="min-w-0 flex-1">
            <h1 className="mt-1 text-[18px] font-semibold tracking-tight text-slate-700 md:text-[22px]">
              Reviews
            </h1>
            <p className="mt-0 max-w-xl text-[11px] md:text-[12px] font-[350] leading-relaxed text-slate-500">
              Moderate and manage customer reviews.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadReviews(true)}
            disabled={isRefreshing || isLoading}
            className="inline-flex shrink-0 items-center gap-1.5 sm:gap-2 rounded-xl border border-[#E8DED3] bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-[12px] text-slate-500 shadow-sm hover:border-[#D9B8C1] hover:bg-[#FDF4F6] hover:text-[#B5697A] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={isRefreshing ? "h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" : "h-3.5 w-3.5 sm:h-4 sm:w-4"}
              strokeWidth={1.8}
            />
            Refresh
          </button>
        </div>

        <ReviewSummaryCards summary={summary} />

        <ReviewFilters
          search={search}
          statusFilter={statusFilter}
          ratingFilter={ratingFilter}
          onSearchChange={setSearch}
          onStatusChange={setStatusFilter}
          onRatingChange={setRatingFilter}
        />

        {/* Error */}
        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#E8C8CE] bg-[#FBECEF] px-4 py-3">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#C45D6D]" strokeWidth={1.8} />
            <p className="text-[12px] text-[#A85F70]">{error}</p>
          </div>
        )}

        {/* Reviews section */}
        <section className="mt-4 overflow-hidden rounded-xl border border-[#EFE3D2] bg-white shadow-sm">
          <div className="border-b border-[#EFE3D2] px-5 py-3 sm:px-6">
            <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-[#1F4A2E]">
              Customer Reviews
            </h2>
            <p className="mt-0 text-[12px] text-gray-500">
              {filteredReviews.length} review{filteredReviews.length !== 1 ? "s" : ""} shown
            </p>
          </div>

          {isLoading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex items-center gap-3 text-[12px] text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin text-[#B5697A]" strokeWidth={1.8} />
                Loading reviews...
              </div>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FBECEF] text-[#B5697A]">
                <MessageSquareText className="h-6 w-6" strokeWidth={1.7} />
              </div>
              <h3 className="mt-5 text-[15px] font-semibold text-[#1F4A2E]">No reviews found</h3>
              <p className="mt-2 max-w-sm text-[12px] leading-5 text-gray-500">
                {search || statusFilter !== "ALL" || ratingFilter !== "ALL"
                  ? "Try changing your search or filter selection."
                  : "Customer reviews will appear here once they are submitted."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#F1E9E1]">
              {filteredReviews.map((review) => (
                <ReviewRow
                  key={review.id}
                  review={review}
                  actionId={actionId}
                  onView={() => setSelectedReview(review)}
                  onVerify={() => void handleAction(review, "verify")}
                  onReject={() => void handleAction(review, "reject")}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Detail Modal */}
      {selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          actionId={actionId}
          onClose={() => setSelectedReview(null)}
          onVerify={() => void handleAction(selectedReview, "verify")}
          onReject={() => void handleAction(selectedReview, "reject")}
        />
      )}
    </div>
  );
}

export default AdminReviewsPage;