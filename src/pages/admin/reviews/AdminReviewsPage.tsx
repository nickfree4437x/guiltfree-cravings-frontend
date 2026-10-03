import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CheckCircle2,
  ChevronDown,
  Eye,
  Loader2,
  MessageSquareText,
  RefreshCw,
  Search,
  Star,
  XCircle,
} from "lucide-react";

import {
  getAdminReviews,
  rejectAdminReview,
  verifyAdminReview,
  type AdminReview,
  type AdminReviewStatus,
} from "../../../api/adminReviewApi";

import { useAdminAuthStore } from "../../../store/adminAuthStore";

type StatusFilter =
  | "ALL"
  | AdminReviewStatus;

type RatingFilter =
  | "ALL"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5";

interface ReviewSummary {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
}

function AdminReviewsPage() {
  const token = useAdminAuthStore(
    (state) => state.token
  );

  const [reviews, setReviews] = useState<
    AdminReview[]
  >([]);

  const [summary, setSummary] =
    useState<ReviewSummary>({
      total: 0,
      pending: 0,
      verified: 0,
      rejected: 0,
    });

  const [isLoading, setIsLoading] =
    useState(true);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [ratingFilter, setRatingFilter] =
    useState<RatingFilter>("ALL");

  const [selectedReview, setSelectedReview] =
    useState<AdminReview | null>(null);

  const [actionId, setActionId] =
    useState<number | null>(null);

  /*
   * ============================================================
   * LOAD REVIEWS
   * ============================================================
   */

  const loadReviews = useCallback(
    async (refresh = false) => {
      if (!token) {
        setError(
          "Admin authentication token not found."
        );
        setIsLoading(false);
        return;
      }

      try {
        if (refresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        setError("");

        const data =
          await getAdminReviews(token);

        /*
         * Defensive handling:
         * API should return:
         *
         * {
         *   reviews: [],
         *   summary: {...}
         * }
         *
         * But even if reviews/summary are missing,
         * the page should not crash.
         */

        const safeReviews =
          Array.isArray(data?.reviews)
            ? data.reviews
            : [];

        const safeSummary =
          data?.summary ?? {};

        setReviews(safeReviews);

        setSummary({
          total: Number(
            safeSummary.total ?? 0
          ),
          pending: Number(
            safeSummary.pending ?? 0
          ),
          verified: Number(
            safeSummary.verified ?? 0
          ),
          rejected: Number(
            safeSummary.rejected ?? 0
          ),
        });
      } catch (loadError: any) {
        console.error(
          "Failed to load admin reviews:",
          loadError
        );

        setReviews([]);

        setSummary({
          total: 0,
          pending: 0,
          verified: 0,
          rejected: 0,
        });

        setError(
          loadError?.response?.data
            ?.message ||
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

  /*
   * ============================================================
   * FILTER REVIEWS
   * ============================================================
   */

  const filteredReviews = useMemo(() => {
    /*
     * Always guarantee an array before calling filter().
     * This prevents:
     *
     * Cannot read properties of undefined
     * (reading 'filter')
     */
    const safeReviews = Array.isArray(reviews)
      ? reviews
      : [];

    const query =
      search.trim().toLowerCase();

    return safeReviews.filter((review) => {
      const title =
        review.title
          ?.toLowerCase()
          .trim() ?? "";

      const comment =
        review.comment
          ?.toLowerCase()
          .trim() ?? "";

      const displayName =
        review.displayName
          ?.toLowerCase()
          .trim() ?? "";

      const email =
        review.email
          ?.toLowerCase()
          .trim() ?? "";

      const productName =
        review.product?.name
          ?.toLowerCase()
          .trim() ?? "";

      const matchesSearch =
        !query ||
        title.includes(query) ||
        comment.includes(query) ||
        displayName.includes(query) ||
        email.includes(query) ||
        productName.includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        review.status === statusFilter;

      const matchesRating =
        ratingFilter === "ALL" ||
        review.rating ===
          Number(ratingFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRating
      );
    });
  }, [
    reviews,
    search,
    statusFilter,
    ratingFilter,
  ]);

  /*
   * ============================================================
   * VERIFY REVIEW
   * ============================================================
   */

  const handleVerify = async (
    review: AdminReview
  ) => {
    if (!token) {
      setError(
        "Admin authentication token not found."
      );
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to verify this review?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(review.id);
      setError("");

      await verifyAdminReview(
        review.id,
        token
      );

      setSelectedReview(null);

      await loadReviews(true);
    } catch (actionError: any) {
      console.error(
        "Failed to verify review:",
        actionError
      );

      window.alert(
        actionError?.response?.data
          ?.message ||
          actionError?.message ||
          "Unable to verify review."
      );
    } finally {
      setActionId(null);
    }
  };

  /*
   * ============================================================
   * REJECT REVIEW
   * ============================================================
   */

  const handleReject = async (
    review: AdminReview
  ) => {
    if (!token) {
      setError(
        "Admin authentication token not found."
      );
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to reject this review?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(review.id);
      setError("");

      await rejectAdminReview(
        review.id,
        token
      );

      setSelectedReview(null);

      await loadReviews(true);
    } catch (actionError: any) {
      console.error(
        "Failed to reject review:",
        actionError
      );

      window.alert(
        actionError?.response?.data
          ?.message ||
          actionError?.message ||
          "Unable to reject review."
      );
    } finally {
      setActionId(null);
    }
  };

  /*
   * ============================================================
   * DATE FORMAT
   * ============================================================
   */

  const formatDate = (
    date: string
  ) => {
    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "—";
    }

    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(parsedDate);
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-[#fffaf5] px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b542f]">
              Customer Feedback
            </span>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Reviews
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Review customer feedback, moderate
              submissions and manage published reviews.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadReviews(true)
            }
            disabled={
              isRefreshing ||
              isLoading
            }
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#d8c6b5] bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-[#8b542f] hover:text-[#8b542f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={
                isRefreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>

        {/* ======================================================
            SUMMARY CARDS
        ====================================================== */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <SummaryCard
            label="Total Reviews"
            value={summary.total}
            icon={
              <MessageSquareText
                size={20}
              />
            }
          />

          <SummaryCard
            label="Pending"
            value={summary.pending}
            icon={
              <Loader2 size={20} />
            }
            valueClass="text-amber-700"
          />

          <SummaryCard
            label="Verified"
            value={summary.verified}
            icon={
              <CheckCircle2 size={20} />
            }
            valueClass="text-emerald-700"
          />

          <SummaryCard
            label="Rejected"
            value={summary.rejected}
            icon={
              <XCircle size={20} />
            }
            valueClass="text-red-600"
          />
        </div>

        {/* ======================================================
            FILTERS
        ====================================================== */}

        <section className="mt-8 rounded-2xl border border-[#eadfd3] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">

            {/* SEARCH */}

            <div className="relative flex-1">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search reviews, customer or product..."
                className="h-11 w-full rounded-xl border border-[#e5d9cd] bg-[#fffdfb] pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#8b542f] focus:ring-2 focus:ring-[#8b542f]/10"
              />
            </div>

            {/* STATUS FILTER */}

            <FilterSelect
              value={statusFilter}
              onChange={(value) =>
                setStatusFilter(
                  value as StatusFilter
                )
              }
              options={[
                ["ALL", "All Status"],
                ["PENDING", "Pending"],
                ["VERIFIED", "Verified"],
                ["REJECTED", "Rejected"],
              ]}
            />

            {/* RATING FILTER */}

            <FilterSelect
              value={ratingFilter}
              onChange={(value) =>
                setRatingFilter(
                  value as RatingFilter
                )
              }
              options={[
                ["ALL", "All Ratings"],
                ["5", "5 Stars"],
                ["4", "4 Stars"],
                ["3", "3 Stars"],
                ["2", "2 Stars"],
                ["1", "1 Star"],
              ]}
            />
          </div>
        </section>

        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* ======================================================
            REVIEWS SECTION
        ====================================================== */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-[#eadfd3] bg-white shadow-sm">

          {/* SECTION HEADER */}

          <div className="border-b border-[#eadfd3] px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Customer Reviews
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {filteredReviews.length} review
                  {filteredReviews.length !==
                  1
                    ? "s"
                    : ""}{" "}
                  shown
                </p>
              </div>
            </div>
          </div>

          {/* LOADING */}

          {isLoading ? (
            <div className="flex min-h-[280px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Loader2
                  size={20}
                  className="animate-spin text-[#8b542f]"
                />

                Loading reviews...
              </div>
            </div>
          ) : filteredReviews.length ===
            0 ? (
            /* EMPTY */

            <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f8eee4] text-[#8b542f]">
                <MessageSquareText
                  size={21}
                />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-800">
                No reviews found
              </h3>

              <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                {search ||
                statusFilter !== "ALL" ||
                ratingFilter !== "ALL"
                  ? "Try changing your search or filter selection."
                  : "Customer reviews will appear here once they are submitted."}
              </p>
            </div>
          ) : (
            /* REVIEW LIST */

            <div className="divide-y divide-[#eee5da]">
              {filteredReviews.map(
                (review) => (
                  <ReviewRow
                    key={review.id}
                    review={review}
                    actionId={actionId}
                    onView={() =>
                      setSelectedReview(
                        review
                      )
                    }
                    onVerify={() =>
                      void handleVerify(
                        review
                      )
                    }
                    onReject={() =>
                      void handleReject(
                        review
                      )
                    }
                    formatDate={formatDate}
                  />
                )
              )}
            </div>
          )}
        </section>
      </div>

      {/* ========================================================
          REVIEW DETAIL MODAL
      ======================================================== */}

      {selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          actionId={actionId}
          onClose={() =>
            setSelectedReview(null)
          }
          onVerify={() =>
            void handleVerify(
              selectedReview
            )
          }
          onReject={() =>
            void handleReject(
              selectedReview
            )
          }
          formatDate={formatDate}
        />
      )}
    </div>
  );
}


/* ==============================================================
   SUMMARY CARD
============================================================== */

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  valueClass?: string;
}

function SummaryCard({
  label,
  value,
  icon,
  valueClass = "text-slate-900",
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-[#eadfd3] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-xs font-medium text-slate-500">
            {label}
          </p>

          <p
            className={`mt-2 text-2xl font-bold ${valueClass}`}
          >
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8eee4] text-[#8b542f]">
          {icon}
        </div>
      </div>
    </div>
  );
}


/* ==============================================================
   FILTER SELECT
============================================================== */

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}

function FilterSelect({
  value,
  onChange,
  options,
}: FilterSelectProps) {
  return (
    <div className="relative min-w-[160px]">
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-11 w-full appearance-none rounded-xl border border-[#e5d9cd] bg-[#fffdfb] px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#8b542f] focus:ring-2 focus:ring-[#8b542f]/10"
      >
        {options.map(
          ([optionValue, label]) => (
            <option
              key={optionValue}
              value={optionValue}
            >
              {label}
            </option>
          )
        )}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}


/* ==============================================================
   REVIEW ROW
============================================================== */

interface ReviewRowProps {
  review: AdminReview;
  actionId: number | null;
  onView: () => void;
  onVerify: () => void;
  onReject: () => void;
  formatDate: (date: string) => string;
}

function ReviewRow({
  review,
  actionId,
  onView,
  onVerify,
  onReject,
  formatDate,
}: ReviewRowProps) {
  const isActioning =
    actionId === review.id;

  return (
    <div className="px-5 py-5 transition hover:bg-[#fffaf6]">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

        {/* REVIEW CONTENT */}

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-2">

            {/* STARS */}

            <div
              className="flex items-center gap-1"
              aria-label={`${review.rating} out of 5 stars`}
            >
              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <Star
                    key={star}
                    size={14}
                    strokeWidth={1.8}
                    className={
                      star <=
                      review.rating
                        ? "fill-[#b5697a] text-[#b5697a]"
                        : "text-[#d8c6b5]"
                    }
                  />
                )
              )}
            </div>

            {/* STATUS */}

            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${getStatusClasses(
                review.status
              )}`}
            >
              {review.status}
            </span>
          </div>

          {/* TITLE */}

          <h3 className="mt-3 text-sm font-semibold text-slate-900">
            {review.title ||
              "Untitled Review"}
          </h3>

          {/* COMMENT */}

          <p className="mt-1 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-500">
            {review.comment ||
              "No comment provided."}
          </p>

          {/* META */}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">

            <span>
              {review.displayName ||
                "Customer"}
            </span>

            {review.email && (
              <span>
                {review.email}
              </span>
            )}

            {review.product?.name && (
              <span>
                Product:{" "}
                {review.product.name}
              </span>
            )}

            <span>
              {formatDate(
                review.createdAt
              )}
            </span>
          </div>
        </div>

        {/* ACTIONS */}

        <div className="flex shrink-0 flex-wrap items-center gap-2">

          {/* VIEW */}

          <button
            type="button"
            onClick={onView}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#dfd2c5] bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-[#8b542f] hover:text-[#8b542f]"
          >
            <Eye size={14} />

            View
          </button>

          {/* VERIFY */}

          {review.status !==
            "VERIFIED" && (
            <button
              type="button"
              onClick={onVerify}
              disabled={isActioning}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#8b542f] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#744326] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isActioning ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <CheckCircle2
                  size={14}
                />
              )}

              Verify
            </button>
          )}

          {/* REJECT */}

          {review.status !==
            "REJECTED" && (
            <button
              type="button"
              onClick={onReject}
              disabled={isActioning}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <XCircle size={14} />

              Reject
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


/* ==============================================================
   STATUS CLASSES
============================================================== */

function getStatusClasses(
  status: AdminReviewStatus
) {
  if (status === "VERIFIED") {
    return "border border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "REJECTED") {
    return "border border-red-200 bg-red-50 text-red-600";
  }

  return "border border-amber-200 bg-amber-50 text-amber-700";
}


/* ==============================================================
   DETAIL MODAL
============================================================== */

interface ReviewDetailModalProps {
  review: AdminReview;
  actionId: number | null;
  onClose: () => void;
  onVerify: () => void;
  onReject: () => void;
  formatDate: (date: string) => string;
}

function ReviewDetailModal({
  review,
  actionId,
  onClose,
  onVerify,
  onReject,
  formatDate,
}: ReviewDetailModalProps) {
  const isActioning =
    actionId === review.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-[#eadfd3] bg-white shadow-2xl">

        {/* ====================================================
            MODAL HEADER
        ==================================================== */}

        <div className="flex items-start justify-between border-b border-[#eadfd3] px-6 py-5">

          <div className="min-w-0 pr-4">

            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8b542f]">
              Review Details
            </span>

            <h2 className="mt-1 break-words text-xl font-bold text-slate-900">
              {review.title ||
                "Untitled Review"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
            aria-label="Close review details"
          >
            <XCircle size={18} />
          </button>
        </div>

        {/* ====================================================
            MODAL BODY
        ==================================================== */}

        <div className="max-h-[65vh] overflow-y-auto px-6 py-6">

          {/* RATING + STATUS */}

          <div className="flex flex-wrap items-center gap-3">

            <div
              className="flex items-center gap-1"
              aria-label={`${review.rating} out of 5 stars`}
            >
              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <Star
                    key={star}
                    size={18}
                    strokeWidth={1.8}
                    className={
                      star <=
                      review.rating
                        ? "fill-[#b5697a] text-[#b5697a]"
                        : "text-[#d8c6b5]"
                    }
                  />
                )
              )}
            </div>

            <span className="text-sm font-medium text-slate-600">
              {review.rating}/5
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${getStatusClasses(
                review.status
              )}`}
            >
              {review.status}
            </span>
          </div>

          {/* COMMENT */}

          <div className="mt-6 rounded-2xl bg-[#fffaf5] p-5">

            <p className="text-sm leading-7 text-slate-700">
              {review.comment ||
                "No comment provided."}
            </p>
          </div>

          {/* CUSTOMER INFORMATION */}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            <InfoBox
              label="Customer"
              value={
                review.displayName ||
                "Customer"
              }
            />

            <InfoBox
              label="Email"
              value={
                review.email ||
                "Not provided"
              }
            />

            <InfoBox
              label="Product"
              value={
                review.product?.name ||
                `Product #${review.productId}`
              }
            />

            <InfoBox
              label="Submitted"
              value={formatDate(
                review.createdAt
              )}
            />
          </div>
        </div>

        {/* ====================================================
            MODAL FOOTER
        ==================================================== */}

        <div className="flex flex-col-reverse gap-3 border-t border-[#eadfd3] bg-[#fffaf5] px-6 py-4 sm:flex-row sm:justify-end">

          {/* CLOSE */}

          <button
            type="button"
            onClick={onClose}
            disabled={isActioning}
            className="rounded-xl border border-[#d8c6b5] bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Close
          </button>

          {/* REJECT */}

          {review.status !==
            "REJECTED" && (
            <button
              type="button"
              onClick={onReject}
              disabled={isActioning}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isActioning ? (
                <Loader2
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <XCircle size={15} />
              )}

              Reject
            </button>
          )}

          {/* VERIFY */}

          {review.status !==
            "VERIFIED" && (
            <button
              type="button"
              onClick={onVerify}
              disabled={isActioning}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8b542f] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#744326] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isActioning ? (
                <Loader2
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <CheckCircle2
                  size={15}
                />
              )}

              Verify Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


/* ==============================================================
   INFO BOX
============================================================== */

interface InfoBoxProps {
  label: string;
  value: string;
}

function InfoBox({
  label,
  value,
}: InfoBoxProps) {
  return (
    <div className="rounded-xl border border-[#eadfd3] bg-white px-4 py-3">

      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
}

export default AdminReviewsPage;